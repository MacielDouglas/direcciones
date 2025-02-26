import mongoose from "mongoose";
import Card from "../../models/card.models.js";
import User from "../../models/user.models.js";
import {
  findCardById,
  validateObjectId,
  verifyAuthorization,
} from "../../utils/utils.js";
import Address from "../../models/address.models.js";

const findUserById = async (userId) =>
  userId ? await User.findById(userId, "id name").lean() : null;

const cardResolver = {
  Query: {
    getCard: async (_, { id }, { req }) => {
      verifyAuthorization(req);
      validateObjectId(id);

      const card = await findCardById(id);
      if (!card) throw new Error("Cartão não encontrado.");

      return {
        message: "Cartão encontrado.",
        success: true,
        card: {
          ...card,
          id: card._id.toString(),
          user: await findUserById(card.userId),
        },
      };
    },

    listCards: async (_, { limit = 50, skip = 0 }, { req }) => {
      verifyAuthorization(req);

      const cards = await Card.find({})
        .limit(Math.min(limit, 100))
        .skip(skip)
        .lean();
      const cardsWithUsers = await Promise.all(
        cards.map(async (card) => ({
          ...card,
          id: card._id.toString(),
          user: await findUserById(card.userId),
        }))
      );

      return {
        message: "Cartões encontrados.",
        success: true,
        cards: cardsWithUsers,
      };
    },

    myCards: async (_, __, { req }) => {
      const decodedToken = verifyAuthorization(req);

      if (!decodedToken) {
        throw new Error("Você não tem permissão para acessar os cards.");
      }

      try {
        const userId = new mongoose.Types.ObjectId(decodedToken.userId);

        // Buscar os cards atribuídos ao usuário
        const cards = await Card.find({
          "usersAssigned.userId": userId,
        }).lean();

        if (!cards.length) {
          return {
            success: true,
            message: "Nenhum card encontrado.",
            cards: [],
          };
        }

        // Coletar todos os IDs de endereços dos cards de forma eficiente
        const streetIds = [...new Set(cards.flatMap((card) => card.street))];

        // Buscar todos os endereços correspondentes
        const addresses = await Address.find({
          _id: { $in: streetIds },
        }).lean();

        // Criar um mapa para acesso rápido aos endereços por ID
        const addressMap = new Map(
          addresses.map((addr) => [addr._id.toString(), addr])
        );

        // Mapear e garantir que street tenha os objetos corretos com id
        const updatedCards = cards.map((card) => {
          const updatedStreets = card.street
            .map((streetId) => {
              const address = addressMap.get(streetId.toString());
              return address
                ? { ...address, id: address._id.toString() }
                : null;
            })
            .filter(Boolean); // Filtra diretamente valores null ou undefined

          if (updatedStreets.length === 0) {
            console.error(`Card ${card._id} não possui endereços válidos`);
          }

          return {
            ...card,
            id: card._id.toString(),
            street: updatedStreets, // Atualiza a street com os endereços mapeados
          };
        });

        return {
          success: true,
          message: `Encontrado ${updatedCards.length} tarjetas`,
          cards: updatedCards,
        };
      } catch (error) {
        console.error("Erro ao buscar os cards:", error);
        return {
          success: false,
          message: `Erro ao buscar os cards: ${error.message}`,
          cards: [],
        };
      }
    },
  },

  Mutation: {
    createCard: async (_, { input }, { req }) => {
      const decodedToken = verifyAuthorization(req);
      if (!decodedToken.isSS) throw new Error("Você não tem permissão.");

      const number = await Card.find({}, { number: 1 })
        .sort({ number: 1 })
        .lean()
        .then((cards) => {
          for (let i = 1; i <= cards.length; i++)
            if (cards[i - 1].number !== i) return i;
          return cards.length + 1;
        });

      const card = new Card({
        ...input,
        number,
        group: decodedToken.group,
        usersAssigned: [],
      });
      await card.save();

      return {
        message: `Nova cartão criado com número ${card.number}.`,
        success: true,
        card,
      };
    },

    deleteCard: async (_, { id }, { req }) => {
      const { isSS } = verifyAuthorization(req);
      validateObjectId(id);
      if (!isSS) throw new Error("Sem permissão para deletar cartões.");

      const card = await findCardById(id);
      if (!card) throw new Error("Cartão não encontrado.");
      await Card.deleteOne({ _id: card.id });

      return {
        message: `Cartão ${card.number} deletado.`,
        success: true,
        card: null,
      };
    },

    updateCard: async (_, { id, input }, { req }) => {
      verifyAuthorization(req);
      validateObjectId(id);

      const card = await findCardById(id);
      if (!card) throw new Error("Cartão não encontrado.");

      const duplicateCard = await Card.findOne({
        street: { $in: input.street },
      });

      if (
        duplicateCard.length > 0 &&
        !duplicateCard
          .map((card) => card._id.toString())
          .some((id) => id === id)
      )
        throw new Error("There is an address that is in use on another card.");

      const oldStreet = card.street.map((id) => id.toHexString()) || [];
      const newStreet = [...new Set([...oldStreet, ...input.street])];

      if (newStreet.length === 0) {
        await Card.deleteOne({ _id: id });
        return { message: "Cartão deletado.", success: true, card: null };
      }
      await Card.updateOne({ _id: id }, { street: newStreet });

      const newCard = await findCardById(id);

      return { message: "Cartão atualizado.", success: true, card: newCard };
    },

    assignCard: async (_, { input }, { req }) => {
      verifyAuthorization(req, ["isSS", "isAdmin", "isSCards"]);

      const { userId, cardIds } = input;
      if (!userId || !Array.isArray(cardIds) || cardIds.length === 0)
        throw new Error("Dados inválidos.");

      const user = await User.findById(userId);
      if (!user) throw new Error("Usuário não encontrado.");

      const currentDate = new Date().toISOString();
      const updatedCards = await Promise.all(
        cardIds.map(async (id) =>
          Card.findByIdAndUpdate(
            id,
            {
              $set: { startDate: currentDate, endDate: null },
              $push: { usersAssigned: { userId, date: currentDate } },
            },
            { new: true }
          )
        )
      );

      return {
        message: "Cartões designados com sucesso.",
        success: true,
        card: updatedCards,
      };
    },

    returnCard: async (_, { input }, { req }) => {
      const decodedToken = verifyAuthorization(req);
      const { cardId, userId } = input;

      if (!decodedToken.isSS || userId !== decodedToken.userId)
        throw new Error("Sem permissão para devolver cartão.");

      const currentDate = new Date().toISOString();
      const updatedCard = await Card.findByIdAndUpdate(
        cardId,
        {
          $set: { startDate: null, endDate: currentDate, usersAssigned: [] },
          $push: { assignedHistory: { userId, date: currentDate } },
        },
        { new: true }
      );

      return {
        success: true,
        message: "Cartão devolvido com sucesso.",
        card: updatedCard,
      };
    },
  },
};

export default cardResolver;

// import mongoose from "mongoose";
// import Card from "../../models/card.models.js";
// import User from "../../models/user.models.js";
// import {
//   findCardById,
//   validateObjectId,
//   verifyAuthorization,
// } from "../../utils/utils.js";

// const cardResolver = {
//   Query: {
//     getCard: async (_, { id }, { req }) => {
//       verifyAuthorization(req);
//       validateObjectId(id);

//       const card = await findCardById(id);
//       if (!card) throw new Error("Cartão não encontrado.");

//       const user = card.userId
//         ? await User.findById(card.userId, "id name").lean()
//         : null;
//       return {
//         message: "Cartão encontrado.",
//         success: true,
//         card: { ...card, id: card._id.toString(), user },
//       };
//     },

//     listCards: async (_, { limit = 50, skip = 0 }, { req }) => {
//       verifyAuthorization(req);

//       const cards = await Card.find({})
//         .limit(Math.min(limit, 100))
//         .skip(skip)
//         .lean();
//       const cardsWithUsers = await Promise.all(
//         cards.map(async (card) => {
//           const user = card.userId
//             ? await User.findById(card.userId, "id name").lean()
//             : null;
//           return { ...card, id: card._id.toString(), user };
//         })
//       );

//       return {
//         message: "Cartões encontrados.",
//         success: true,
//         cards: cardsWithUsers,
//       };
//     },

//     myCards: async (_, __, { req }) => {
//       const decodedToken = verifyAuthorization(req);
//       if (!decodedToken) {
//         throw new Error("Você não tem permissão para acessar os cards.");
//       }

//       try {
//         const userId = new mongoose.Types.ObjectId(decodedToken.userId);
//         const cards = await Card.find({ "usersAssigned.userId": userId });

//         return {
//           success: true,
//           message:
//             cards.length > 0
//               ? "Cards encontrados com sucesso."
//               : "Nenhum card encontrado.",
//           cards,
//         };
//       } catch (error) {
//         return {
//           success: false,
//           message: "Erro ao buscar os cards: " + error.message,
//           cards: [],
//         };
//       }
//     },
//   },

//   Mutation: {
//     createCard: async (_, { input }, { req }) => {
//       const decodedToken = verifyAuthorization(req);
//       if (!decodedToken.isSS) {
//         throw new Error("Você não tem permissão.");
//       }

//       try {
//         const findNextNumber = async () => {
//           // Busca todos os cartões e ordena pelo número em ordem crescente
//           const allCards = await Card.find({}, { number: 1 })
//             .sort({ number: 1 })
//             .lean();

//           if (!allCards.length) return 1; // Se não houver cartões, retorna o primeiro número

//           // Encontra a primeira lacuna na sequência
//           for (let i = 1; i <= allCards.length; i++) {
//             if (allCards[i - 1].number !== i) {
//               return i; // Retorna o número da primeira lacuna
//             }
//           }

//           // Se não houver lacunas, retorna o próximo número da sequência
//           return allCards.length + 1;
//         };

//         const number = await findNextNumber();
//         const card = new Card({
//           ...input,
//           number,
//           group: decodedToken.group,
//           usersAssigned: [],
//         });
//         await card.save();

//         return {
//           message: `Nueva tarjeta creada con número ${card.number}.`,
//           success: true,
//           card,
//         };
//       } catch (error) {
//         throw new Error(`Erro ao criar cartão: ${error.message}`);
//       }
//     },

//     deleteCard: async (_, { id }, { req }) => {
//       const decodedToken = verifyAuthorization(req);
//       validateObjectId(id);

//       try {
//         const { isSS } = decodedToken;

//         if (!isSS) {
//           throw new Error("No tienes permiso para borrar tarjetas.");
//         }

//         const card = await findCardById(id);
//         if (!card) throw new Error("Tarjeta no encontrada.");
//         await Card.deleteOne({ _id: card.id });
//         return {
//           message: `Tarjeta ${card.number} borrada.`,
//           success: true,
//           card: null,
//         };
//       } catch (error) {
//         throw new Error(`Error al borrar la tarjeta: ${error.message}`);
//       }
//     },

//     updateCard: async (_, { id, input }, { req }) => {
//       verifyAuthorization(req);
//       validateObjectId(id);

//       try {
//         const card = await findCardById(id);
//         if (!card) throw new Error("Tarjeta no encontrada.");

//         const { street } = input;

//         const duplicateCard = await Card.find({ street: { $in: street } });
//         const cardBoolean = duplicateCard
//           .map((card) => card._id.toString())
//           .some((id) => id === id);

//         if (duplicateCard.length > 0 && !cardBoolean) {
//           throw new Error(
//             "There is an address that is in use on another card."
//           );
//         }

//         const cardUpdate = {};

//         // if (Array.isArray(street)) {
//         const oldStreet = card.street.map((id) => id.toHexString()) || [];

//         const combinedStreet = [...oldStreet, ...street];

//         const reduceStreet = combinedStreet.reduce((acc, street) => {
//           acc[street] = (acc[street] || 0) + 1;
//           return acc;
//         }, {});

//         const newStreet = combinedStreet.filter(
//           (item) => reduceStreet[item] === 1
//         );
//         console.log(newStreet.length <= 0);

//         if (newStreet.length <= 0) {
//           await Card.deleteOne({ _id: id });
//           return {
//             message: "Cartão deletado.",
//             success: true,
//             card: null,
//           };
//         }

//         const updateResult = await Card.updateOne(
//           { _id: id },
//           { street: newStreet }
//         );

//         if (updateResult.nModified === 0) {
//           throw new Error("Nenhuma modificação realizada.");
//         }

//         return {
//           message: "Cartão atualizado.",
//           success: true,
//           card: { ...card, ...cardUpdate },
//         };
//       } catch (error) {
//         throw new Error(`Erro ao atualizar cartão: ${error.message}`);
//       }
//     },

//     assignCard: async (_, { input }, { req }) => {
//       const decodedToken = verifyAuthorization(req, [
//         "isSS",
//         "isAdmin",
//         "isSCards",
//       ]);

//       try {
//         const { userId, cardIds } = input;
//         const cards = await Card.find({ _id: cardIds });

//         const assigned = cards.map(
//           (card) => card.startDate !== null && card.endDate === null
//         );

//         if (assigned.some((isAssigned) => isAssigned)) {
//           throw new Error(`La tarjeta ya está asignada`);
//         }

//         if (!userId || !Array.isArray(cardIds) || cardIds.length === 0) {
//           throw new Error(
//             "ID do usuário e pelo menos um ID de cartão são necessários."
//           );
//         }

//         const user = await User.findById(userId);
//         if (!user || decodedToken.group !== user.group) {
//           throw new Error("Usuário inválido ou fora do grupo autorizado.");
//         }

//         const currentDate = new Date().toISOString();

//         const updatedCards = await Promise.all(
//           cards.map(async (id) => {
//             const card = await Card.findById(id);
//             if (!card) {
//               throw new Error(`Cartão com ID ${id} não encontrado.`);
//             }

//             return Card.findByIdAndUpdate(
//               id,
//               {
//                 $set: {
//                   startDate: currentDate,
//                   endDate: null,
//                 },
//                 $push: {
//                   usersAssigned: { userId, date: currentDate },
//                 },
//               },
//               { new: true }
//             );
//           })
//         );

//         return {
//           message: "Cartões designados com sucesso.",
//           success: true,
//           card: updatedCards,
//         };
//       } catch (error) {
//         throw new Error(`Erro ao designar cartões: ${error.message}`);
//       }
//     },
//     returnCard: async (_, { input }, { req }) => {
//       const decodedToken = verifyAuthorization(req);
//       const { cardId, userId } = input;

//       if (!decodedToken.isSS || userId !== decodedToken.userId) {
//         throw new Error(`Usted no puede retornar esta tarjeta`);
//       }

//       try {
//         const card = await Card.findById(cardId);
//         if (card.endDate !== null && card.startDate === null) {
//           throw new Error("Esta tarjeta no esta asignada.");
//         }
//         const currentDate = new Date().toISOString();

//         const updatedCard = await Card.findByIdAndUpdate(
//           cardId,
//           {
//             $set: { startDate: null, endDate: currentDate, usersAssigned: [] },
//             $push: { assignedHistory: { userId, date: currentDate } },
//           },
//           { new: true }
//         );

//         return {
//           success: true,
//           message: `Se devolvió la tarjeta que estaba con el usuario .`,
//           card: updatedCard,
//         };
//       } catch (error) {
//         throw new Error(`Erro ao devolver cartão: ${error.message}`);
//       }
//     },
//   },
// };

// export default cardResolver;
