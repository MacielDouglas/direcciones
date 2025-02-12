import Card from "../../models/card.models.js";
import User from "../../models/user.models.js";
import {
  findCardById,
  findNextNumber,
  validateObjectId,
  verifyAuthorization,
} from "../../utils/utils.js";

const cardResolver = {
  Query: {
    card: async (_, { action, id, limit = 50, skip = 0 }, { req }) => {
      const decodedToken = verifyAuthorization(req);
      if (!decodedToken) {
        throw new Error("Você não tem permissão.");
      }

      switch (action) {
        case "get":
          try {
            if (id) {
              const card = await findCardById(id);
              const user = card.userId
                ? await User.findById(card.userId, "id name").lean()
                : null;

              return {
                message: "Cartão encontrado.",
                success: true,
                card: [
                  {
                    ...card,
                    id: card._id.toString(),
                    user: user ? { id: user.id, name: user.name } : null,
                  },
                ],
              };
            }

            const cards = await Card.find({})
              .limit(Math.min(limit, 100))
              .skip(skip)
              .lean();

            const cardsWithUsers = await Promise.all(
              cards.map(async (card) => {
                const user = card.userId
                  ? await User.findById(card.userId, "id name").lean()
                  : null;

                return {
                  ...card,
                  id: card._id.toString(),
                  user: user ? { id: user.id, name: user.name } : null,
                };
              })
            );

            return {
              message: "Cartões encontrados.",
              success: true,
              card: cardsWithUsers,
            };
          } catch (error) {
            throw new Error(`Erro ao buscar cartões: ${error.message}`);
          }

        default:
          throw new Error("Ação inválida.");
      }
    },
  },

  Mutation: {
    cardMutation: async (
      _,
      { action, id, newCard, updateCardInput, designateCardInput },
      { req }
    ) => {
      const decodedToken = verifyAuthorization(req);
      if (!decodedToken) {
        throw new Error("Você não tem permissão.");
      }

      switch (action) {
        case "create":
          try {
            const findNextNumber = async () => {
              // Busca todos os cartões e ordena pelo número em ordem crescente
              const allCards = await Card.find({}, { number: 1 })
                .sort({ number: 1 })
                .lean();

              if (!allCards.length) return 1; // Se não houver cartões, retorna o primeiro número

              // Encontra a primeira lacuna na sequência
              for (let i = 1; i <= allCards.length; i++) {
                if (allCards[i - 1].number !== i) {
                  return i; // Retorna o número da primeira lacuna
                }
              }

              // Se não houver lacunas, retorna o próximo número da sequência
              return allCards.length + 1;
            };

            const number = await findNextNumber();
            const card = new Card({
              ...newCard,
              number,
              group: decodedToken.group,
              usersAssigned: [], // Inicializa o array vazio
            });

            return {
              message: `Novo cartão criado com número ${card.number}.`,
              success: true,
              card: await card.save(),
            };
          } catch (error) {
            throw new Error(`Erro ao criar cartão: ${error.message}`);
          }

        case "designateCard":
          try {
            const decodedToken = verifyAuthorization(req);

            if (
              !decodedToken ||
              (!decodedToken.isSS &&
                !decodedToken.isAdmin &&
                !decodedToken.isSCards)
            ) {
              throw new Error("Você não tem permissão para designar cards.");
            }

            const { userId, cardId } = designateCardInput;

            if (!userId || !Array.isArray(cardId) || cardId.length === 0) {
              throw new Error(
                "ID do usuário e pelo menos um ID de card são necessários."
              );
            }

            const user = await User.findById(userId);
            if (!user) {
              throw new Error("Usuário não encontrado.");
            }

            if (decodedToken.group !== user.group) {
              throw new Error(
                "Você não pode enviar um card para um usuário que não é do seu grupo."
              );
            }

            const currentDate = new Date().toISOString();

            // Atualizar múltiplos cartões
            const updatedCards = await Promise.all(
              cardId.map(async (id) => {
                const card = await Card.findById(id);
                if (!card) {
                  throw new Error(`Cartão com ID ${id} não encontrado.`);
                }

                return Card.findByIdAndUpdate(
                  id,
                  {
                    $set: {
                      startDate: currentDate,
                      endDate: null,
                    },
                    $push: {
                      usersAssigned: { userId, date: currentDate },
                    },
                  },
                  { new: true }
                );
              })
            );

            // Atualizar usuário
            const updatedUser = await User.findByIdAndUpdate(
              userId,
              {
                $push: {
                  myCards: cardId.map((id) => ({
                    cardId: id,
                    date: currentDate,
                  })),
                },
              },
              { new: true }
            );

            if (!updatedUser) {
              throw new Error("Falha ao atualizar o usuário.");
            }

            return {
              message: `Cartões designados para o usuário ${user.name}.`,
              success: true,
              // card: updatedCards,
            };
          } catch (error) {
            throw new Error(`Erro ao designar cartões: ${error.message}`);
          }

        case "returnCard":
          try {
            const decodedToken = verifyAuthorization(req);

            if (!decodedToken) {
              throw new Error("Você não tem permissão para devolver card.");
            }

            const { userId, cardId } = designateCardInput;

            if (!userId || !cardId) {
              throw new Error("ID do usuário ou ID do card são necessários.");
            }

            const user = await User.findById(userId);
            const card = await Card.findById(cardId);

            if (!card && !user) {
              throw new Error("Cartão ou usuário não encontrado.");
            }

            if (card.endDate !== null && card.startDate === null) {
              throw new Error("Esse cartão já foi devolvido.");
            }

            const lastAssignedUserId =
              card.usersAssigned.length > 0
                ? card.usersAssigned[card.usersAssigned.length - 1].userId
                : null;

            if (lastAssignedUserId.toString() !== user._id.toString()) {
              throw new Error(
                `Este cartão não pertence ao usuário ${user.name}.`
              );
            }

            const currentDate = new Date().toISOString();

            // Atualizar o documento diretamente
            const updatedCard = await Card.findByIdAndUpdate(
              cardId,
              {
                $set: {
                  startDate: null,
                  endDate: currentDate,
                },
                $push: {
                  usersAssigned: { userId: null, date: null },
                },
              },
              { new: true } // Retorna o documento atualizado
            );

            const updateUser = await User.findByIdAndUpdate(
              userId,
              {
                $pull: {
                  myCards: { cardId }, // Remove o card devolvido
                },
                $push: {
                  myTotalCards: { cardId, date: currentDate }, // Adiciona ao histórico
                },
              },
              { new: true } // Retorna o documento atualizado
            );

            if (!updatedCard && !updateUser) {
              throw new Error("Falha ao atualizar o cartão.");
            }

            return {
              message: `Cartão que estava com o usuário ${user.name} foi devolvido.`,
              success: true,
              card: updatedCard,
            };
          } catch (error) {
            throw new Error(`Erro ao designar cartão: ${error.message}`);
          }

        case "update":
          try {
            if (!id) {
              throw new Error("ID necessário.");
            }

            const card = await findCardById(id);
            if (!card) {
              throw new Error("Cartão não encontrado.");
            }

            const { street, userId } = updateCardInput;
            const cardUpdate = {};

            // Lógica para atualização do campo `street`
            if (Array.isArray(street)) {
              const oldStreet = card.street || [];
              const newStreet = street;

              // Identificar IDs removidos e adicionados
              const removedStreets = oldStreet.filter(
                (id) => !newStreet.includes(id)
              );
              const addedStreets = newStreet.filter(
                (id) => !oldStreet.includes(id)
              );

              if (removedStreets.length > 0 || addedStreets.length > 0) {
                cardUpdate.street = newStreet;
              }
            } else {
              // Caso `street` não seja enviado, o cartão deve ser deletado
              await Card.deleteOne({ _id: id });
              return {
                message: "Cartão deletado.",
                success: true,
                card: null,
              };
            }

            // Lógica para atualização do `userId`
            if (!userId || userId.trim() === "") {
              cardUpdate.endDate = new Date().toISOString();
              cardUpdate.startDate = null;
              cardUpdate.userId = null;
            } else {
              cardUpdate.userId = userId;
              cardUpdate.startDate = new Date().toISOString();
              cardUpdate.endDate = null;
            }

            // Atualizar apenas se houver modificações
            const updateResult = await Card.updateOne({ _id: id }, cardUpdate);
            if (updateResult.nModified === 0) {
              throw new Error("Nenhuma modificação realizada.");
            }

            return {
              message: "Cartão atualizado.",
              success: true,
              card: { ...card, ...cardUpdate },
            };
          } catch (error) {
            throw new Error(`Erro ao atualizar cartão: ${error.message}`);
          }

        case "delete":
          try {
            validateObjectId(id);
            const card = await findCardById(id);
            await Card.deleteOne({ _id: card.id });
            return {
              message: "Cartão deletado.",
              success: true,
              card: null,
            };
          } catch (error) {
            throw new Error(`Erro ao deletar cartão: ${error.message}`);
          }

        default:
          throw new Error("Ação inválida.");
      }
    },
  },
};

export default cardResolver;
