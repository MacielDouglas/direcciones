import validator from "validator";
import mongoose from "mongoose";
import Address from "../../models/address.models.js";
import Card from "../../models/card.models.js";
import User from "../../models/user.models.js";
import { validateObjectId, verifyAuthorization } from "../../utils/utils.js";

const addressResolver = {
  Query: {
    address: async (_, { action, input, id }, { req }) => {
      try {
        const decodedToken = verifyAuthorization(req);
        if (!decodedToken) {
          throw new Error("Você não tem permissão.");
        }

        // Obtendo o grupo do token decodificado
        const group = decodedToken.group;
        if (!group) {
          throw new Error("Grupo não fornecido.");
        }

        const query = { group };

        // Filtros adicionais opcionais
        if (input?.street) {
          query.street = { $regex: new RegExp(input.street, "i") };
        }
        if (input?.city) {
          query.city = input.city.trim().toLowerCase();
        }
        if (input?.type) {
          query.type = input.type.trim().toLowerCase();
        }

        // Configurando paginação com valores padrão
        const limit = Math.min(input?.limit || 50, 100);
        const skip = input?.skip || 0;

        // Buscando pelo ID específico, se fornecido
        if (id) {
          if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("ID inválido.");
          }

          const addressById = await Address.findOne({ _id: id, group })
            .populate("userId", "name email")
            .lean();

          if (!addressById) {
            throw new Error("Endereço não encontrado.");
          }

          return {
            message: "Endereço encontrados.",
            success: true,
            address: [
              {
                ...addressById,
                id: addressById._id.toString(),
                userId: addressById.userId.name,
              },
            ],
          };
        }

        // Buscando lista de endereços com base nos filtros
        const addresses = await Address.find(query)
          .populate("userId", "name email")
          .limit(limit)
          .skip(skip)
          .lean();

        return {
          message: addresses.length
            ? "Endereços encontrados."
            : "Nenhum endereço encontrado.",
          success: true,
          address: addresses.map((address) => ({
            ...address,
            id: address._id.toString(),
            userId: address.userId.name,
          })),
        };
      } catch (error) {
        throw new Error(`Erro ao buscar endereços: ${error.message}`);
      }
    },
  },

  Mutation: {
    addressMutation: async (
      _,
      { action, id, newAddress, updateAddressInput },
      { req }
    ) => {
      const decodedToken = verifyAuthorization(req);
      if (!decodedToken) {
        throw new Error("Você não tem permissão.");
      }

      switch (action) {
        case "create":
          try {
            const formattedAddress = {
              street: newAddress.street?.trim().toLowerCase(),
              number: newAddress.number?.trim().toLowerCase(),
              city: newAddress.city?.trim().toLowerCase(),
              neighborhood: newAddress.neighborhood?.trim().toLowerCase() || "",
              complement: newAddress.complement?.trim().toLowerCase() || "",
              type: newAddress.type?.trim().toLowerCase(),
              photo: newAddress.photo?.trim(),
              gps: newAddress.gps?.trim(),
              group: decodedToken.group,
              userId: decodedToken.userId, // Relacionar com o usuário autenticado
            };

            if (
              !formattedAddress.street ||
              !formattedAddress.number ||
              !formattedAddress.city ||
              !formattedAddress.type
            ) {
              throw new Error(
                "Os campos rua, número, cidade e tipo são obrigatórios."
              );
            }

            const existingAddress = await Address.findOne({
              street: formattedAddress.street,
              number: formattedAddress.number,
              city: formattedAddress.city,
            });

            if (existingAddress) {
              throw new Error("Endereço já existente.");
            }

            const address = new Address(formattedAddress);

            await address.save();

            return {
              message: "Novo endereço criado.",
              success: true,
              address: { ...address.toObject(), id: address._id.toString() },
            };
          } catch (error) {
            throw new Error(`Erro ao criar endereço: ${error.message}`);
          }

        case "update":
          try {
            validateObjectId(id);
            const address = await Address.findById(id);
            if (!address) {
              throw new Error("Endereço não encontrado.");
            }

            const addressUpdate = {};
            const {
              street,
              number,
              city,
              neighborhood,
              complement,
              gps,
              type,
              photo,
              confirmed,
              visited,
            } = updateAddressInput;

            if (street) addressUpdate.street = street.trim().toLowerCase();
            if (number) addressUpdate.number = number.trim();
            if (city) addressUpdate.city = city.trim().toLowerCase();
            if (neighborhood)
              addressUpdate.neighborhood = neighborhood.trim().toLowerCase();
            if (complement) addressUpdate.complement = complement.trim();
            if (gps) addressUpdate.gps = gps.trim();
            if (type) addressUpdate.type = type.trim().toLowerCase();
            if (photo) addressUpdate.photo = photo.trim();
            if (typeof confirmed === "boolean")
              addressUpdate.confirmed = confirmed;
            if (typeof visited === "boolean") addressUpdate.visited = visited;

            if (Object.keys(addressUpdate).length > 0) {
              const updatedAddress = await Address.findByIdAndUpdate(
                id,
                { $set: addressUpdate },
                { new: true, runValidators: true }
              ).lean();

              return {
                message: "Endereço atualizado com sucesso.",
                success: true,
                address: {
                  ...updatedAddress,
                  id: updatedAddress._id.toString(),
                },
              };
            } else {
              return {
                message: "Nenhuma alteração realizada.",
                success: false,
                address: address.toObject(),
              };
            }
          } catch (error) {
            throw new Error(`Erro ao atualizar endereço: ${error.message}`);
          }

        case "delete":
          try {
            validateObjectId(id);

            const address = await Address.findById(id);
            if (!address) {
              throw new Error("Endereço não encontrado.");
            }

            // Atualizar todos os cartões relacionados para remover o endereço
            await Card.updateMany(
              { street: id },
              { $pull: { street: id } },
              { multi: true }
            );

            // Atualizar todos os usuários relacionados
            await User.updateMany(
              { "myCards.address": id },
              { $pull: { "myCards.address": id } }
            );

            await Address.deleteOne({ _id: id });

            return {
              message: "Endereço deletado com sucesso.",
              success: true,
              address: null,
            };
          } catch (error) {
            throw new Error(`Erro ao deletar endereço: ${error.message}`);
          }

        default:
          throw new Error("Ação inválida.");
      }
    },
  },
};

export default addressResolver;
