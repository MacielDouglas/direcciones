import User from "../../models/user.models.js";
import Card from "../../models/card.models.js";
import Address from "../../models/address.models.js";
import bcrypt from "bcryptjs";
import {
  createToken,
  existing,
  sanitizeUser,
  setTokenCookie,
  validateUserCredentials,
  verifyAuthorization,
} from "../../utils/utils.js";

const userResolver = {
  Query: {
    user: async (_, { action, id, email, password }, { req, res }) => {
      switch (action) {
        case "get":
          const decodedToken = verifyAuthorization(req);
          if (!decodedToken) {
            throw new Error("Você não tem permissão para acessar os usuários.");
          }

          try {
            const user = await existing(id, "user");

            const cards = await Card.find({ userId: user.id });

            const myCards = await Promise.all(
              cards.map(async (card) => {
                const streets = await Address.find({
                  street: { $in: card.street },
                });

                return {
                  id: card.id,
                  number: card.number,
                  startDate: card.startDate,
                  endDate: card.endDate,
                  streets,
                };
              })
            );

            return {
              success: true,
              message: `Usuário: ${user.name}, encontrado.`,
              user: {
                ...sanitizeUser(user),
                myCards,
              },
            };
          } catch (error) {
            throw new Error(`Error get User: ${error.message}`);
          }

        case "login":
          try {
            const user = await validateUserCredentials(email, password);
            const token = createToken(user);
            setTokenCookie(res, token);

            const cards = await Card.find({ userId: user.id });

            return {
              success: true,
              message: `Usuário: ${user.name}, encontrado.`,
              user: {
                ...sanitizeUser(user),
              },
            };
          } catch (error) {
            throw new Error(`Error login User: ${error.message}`);
          }

        case "logout":
          try {
            res.clearCookie("access_token");
            return {
              success: true,
              message: "User logged out successfully!!!",
            };
          } catch (error) {
            throw new Error(`Error logout User: ${error.message}`);
          }

        default:
          throw new Error("Ação inválida.");
      }
    },
    getUsers: async (_, __, { req }) => {
      const decodedToken = verifyAuthorization(req);

      if (!decodedToken) {
        throw new Error("Você não tem permissão para acessar os usuários.");
      }

      try {
        let filter = {};

        // Condições para definir o filtro baseado nas permissões do usuário
        if (decodedToken.isAdmin) {
          // Admin pode buscar todos os usuários
          filter = {}; // Filtro vazio para pegar todos os usuários
        } else if (decodedToken.isSS) {
          // SS pode buscar usuários do seu grupo ou de group = 0
          filter = { $or: [{ group: decodedToken.group }, { group: 0 }] };
        } else {
          // Usuário normal pode buscar apenas usuários do seu grupo
          filter = { group: decodedToken.group };
        }

        // Buscar usuários conforme o filtro
        const users = await User.find(filter, "id name group");

        if (!users || users.length === 0) {
          return {
            success: false,
            message: "Nenhum usuário encontrado para o grupo fornecido.",
            users: [],
          };
        }

        return {
          success: true,
          message: `Usuários encontrados.`,
          users, // A lista já contém apenas `id` e `name`
        };
      } catch (error) {
        throw new Error(`Erro ao buscar usuários: ${error.message}`);
      }
    },
  },

  Mutation: {
    userMutation: async (
      _,
      { action, user, id, updateUserInput, cardIds },
      { req, res }
    ) => {
      switch (action) {
        case "create":
          try {
            const [existingEmail, existingNameUser] = await Promise.all([
              User.findOne({ email: user.email }),
              User.findOne({ name: user.name }),
            ]);

            if (existingEmail) {
              throw new Error("Email already in use");
            }

            if (existingNameUser) {
              throw new Error("Name already in use");
            }

            const sanitizedEmail = user.email.trim().toLowerCase();
            const sanitizedName = user.name.trim();

            const defaultProfilePicture =
              "https://firebasestorage.googleapis.com/v0/b/queimando-panela.appspot.com/o/perfil%2F1722454447282user.webp?alt=media&token=3dd585aa-5ce9-4bb3-9d46-5ecf11d1e60c";

            const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
            const hashedPassword = await bcrypt.hash(user.password, saltRounds);

            const newUser = new User({
              ...user,
              email: sanitizedEmail,
              name: sanitizedName,
              password: hashedPassword,
              profilePicture: defaultProfilePicture,
              group: "0",
            });

            await newUser.save();

            return {
              success: true,
              message: `Usuário: ${user.name}, criado.`,
              user: sanitizeUser(newUser),
            };
          } catch (error) {
            throw new Error(`Error creating new User: ${error.message}`);
          }

        case "delete":
          try {
            const decodedToken = verifyAuthorization(req);
            if (!decodedToken) {
              throw new Error(
                "Você não tem permissão para excluir esse usuário."
              );
            }
            const user = await existing(id, "user");

            // Validação das permissões: pode deletar se for o próprio usuário ou se for admin ou SS
            const hasPermission =
              decodedToken.userId === user.id ||
              decodedToken.isAdmin ||
              decodedToken.isSS;

            if (!hasPermission) {
              throw new Error(
                "Você não tem permissão para excluir este usuário."
              );
            }

            const deleteResult = await User.deleteOne({ _id: user.id });
            if (deleteResult.deletedCount === 0) {
              throw new Error(
                "Erro ao excluir o usuário. Usuário não encontrado."
              );
            }

            res.clearCookie("access_token");

            return {
              success: true,
              message: `Usuário: ${user.name} foi excluído com sucesso.`,
            };
          } catch (error) {
            throw new Error(`Erro ao excluir usuário: ${error.message}`);
          }

        case "addGroup":
          try {
            const userToUpdate = await existing(id, "user"); // Inicializa primeiro
            const decodedToken = verifyAuthorization(req);

            if (!decodedToken || !decodedToken.isSS) {
              throw new Error(
                "Você não tem permissão para alterar esse usuário."
              );
            }

            if (
              decodedToken.group === userToUpdate.group ||
              userToUpdate.group !== "0"
            ) {
              throw new Error(
                "Esse usuário já pertence ao seu grupo ou esta em um outro grupo."
              );
            }

            const userUpdate = {};
            const group = decodedToken.group;

            // Valida e atualiza o grupo apenas se o usuário tiver permissão
            if (group && group.trim()) {
              if (!decodedToken.isSS && !decodedToken.isSCards) {
                throw new Error(
                  "Você não tem permissão para alterar o campo 'group'."
                );
              }

              userUpdate.group = group;
            } else if (!group) {
              // Removendo o grupo implica em resetar as informações associadas
              userUpdate.group = null;
              userUpdate.myCards = [];
              userUpdate.myTotalCards = [];
              userUpdate.comments = [];
              userUpdate.isAdmin = false;
              userUpdate.isSS = false;
              userUpdate.isSCards = false;
            }

            const updatedUser = await User.findByIdAndUpdate(id, userUpdate, {
              new: true,
            });

            return {
              success: true,
              message: `Usuário foi adicionado ao grupo com sucesso.`,
              user: sanitizeUser(updatedUser),
            };
          } catch (error) {
            throw new Error(`Erro ao atualizar o usuário: ${error.message}`);
          }

        case "update":
          try {
            const userToUpdate = await existing(id, "user"); // Inicializa primeiro

            const decodedToken = verifyAuthorization(req);
            if (!decodedToken || decodedToken.userId !== userToUpdate.id) {
              throw new Error(
                "Você não tem permissão para alterar esse usuário."
              );
            }

            const userUpdate = {};
            const { name } = updateUserInput;

            // Atualiza o nome, se fornecido
            if (name && name.trim()) {
              userUpdate.name = name;
            }

            const updatedUser = await User.findByIdAndUpdate(id, userUpdate, {
              new: true,
            });

            return {
              success: true,
              message: `Usuário atualizado com sucesso.`,
              user: sanitizeUser(updatedUser),
            };
          } catch (error) {
            throw new Error(`Erro ao atualizar o usuário: ${error.message}`);
          }

        case "designateIss":
          try {
            const decodedToken = verifyAuthorization(req);

            if (!decodedToken || !decodedToken.isAdmin) {
              throw new Error("Apenas administradores podem designar 'isSS'.");
            }

            const userToDesignate = await existing(id, "user");

            userToDesignate.isSS = true;
            await userToDesignate.save();

            return {
              success: true,
              message: `Usuário ${userToDesignate.name} agora é SS.`,
              user: sanitizeUser(userToDesignate),
            };
          } catch (error) {
            throw new Error(`Erro ao designar 'isSS': ${error.message}`);
          }

        case "designateGroup":
          try {
            const decodedToken = verifyAuthorization(req);

            if (
              !decodedToken ||
              (!decodedToken.isSS && !decodedToken.isSCards)
            ) {
              throw new Error("Você não tem permissão para designar grupo.");
            }

            const userToDesignate = await existing(id, "user");

            const { group } = updateUserInput;
            if (!group) {
              throw new Error("Grupo não fornecido.");
            }

            userToDesignate.group = group;
            await userToDesignate.save();

            return {
              success: true,
              message: `Usuário ${userToDesignate.name} agora está no grupo ${group}.`,
              user: sanitizeUser(userToDesignate),
            };
          } catch (error) {
            throw new Error(`Erro ao designar grupo: ${error.message}`);
          }

        default:
          throw new Error("Ação inválida.");
      }
    },
  },
};

export default userResolver;
