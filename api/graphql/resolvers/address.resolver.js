import Address from "../../models/address.models.js";
import { verifyAuthorization } from "../../utils/utils.js";

const addressResolvers = {
  Query: {
    addresses: async (_, __, { req }) => {
      try {
        const decodedToken = verifyAuthorization(req);
        if (!decodedToken) {
          throw new Error("Você não tem permissão.");
        }

        const group = decodedToken.group;
        const addresses = await Address.find({ group });

        return {
          success: true,
          message: "Endereços recuperados com sucesso.",
          addresses,
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
          addresses: [],
        };
      }
    },
  },

  Mutation: {
    createAddress: async (_, { newAddressInput }, { req }) => {
      try {
        const decodedToken = verifyAuthorization(req);
        if (!decodedToken) {
          throw new Error("Você não tem permissão.");
        }

        const { street, number, neighborhood, city, type, complement, gps } =
          newAddressInput;

        if (!street) {
          throw new Error("O campo 'street' é obrigatório.");
        }

        // Normalize the number for comparison (case insensitive and trimmed)
        const normalizedNumber = number?.trim().toLowerCase();

        // Check if number is some variation of "s/n"
        const isSN = normalizedNumber === "s/n";

        // Prepare the base query for existing addresses
        const baseQuery = {
          street,
          neighborhood,
          city,
          type,
          group: decodedToken.group,
        };

        // For "s/n" addresses, we check GPS coordinates instead of number
        if (isSN) {
          if (!gps || !gps.latitude || !gps.longitude) {
            throw new Error(
              "Para endereços com 'S/N', as coordenadas GPS são obrigatórias."
            );
          }

          // Check for existing addresses with same GPS (within a small tolerance)
          const existingAddress = await Address.findOne({
            ...baseQuery,
            "gps.latitude": { $near: gps.latitude, $maxDistance: 0.0001 }, // ~11 meters
            "gps.longitude": { $near: gps.longitude, $maxDistance: 0.0001 },
          });

          if (existingAddress) {
            const message =
              existingAddress.type === "department" &&
              existingAddress.complement === complement
                ? "Já existe um APARTAMENTO com mesmo endereço, complemento, bairro, cidade e localização GPS."
                : "Já existe um endereço com mesma localização GPS.";

            return {
              success: false,
              message,
              address: null,
            };
          }
        } else {
          // For normal addresses, check by number and complement
          const existingAddress = await Address.findOne({
            ...baseQuery,
            number: { $regex: new RegExp(`^${number}$`, "i") }, // Case insensitive match
            complement,
          });

          if (existingAddress) {
            const message =
              existingAddress.type === "department" &&
              existingAddress.complement === complement
                ? "Já existe um APARTAMENTO com mesmo endereço, numero, complemento, bairro e cidade."
                : "Este endereço já existe.";

            return {
              success: false,
              message,
              address: null,
            };
          }
        }

        // Create new address if no duplicates found
        const newAddress = new Address({
          ...newAddressInput,
          group: decodedToken.group,
          userId: decodedToken.userId,
          active: true,
        });

        const savedAddress = await newAddress.save();

        return {
          success: true,
          message: "Endereço criado com sucesso.",
          address: savedAddress,
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
          address: null,
        };
      }
    },
    // createAddress: async (_, { newAddressInput }, { req }) => {
    //   try {
    //     const decodedToken = verifyAuthorization(req);
    //     if (!decodedToken) {
    //       throw new Error("Você não tem permissão.");
    //     }

    //     const { street, number, neighborhood, city, type, complement } =
    //       newAddressInput;

    //     // Verifica se existe street
    //     if (street) {
    //       // Verifica se existe um endereço com o mesmo número, bairro, cidade
    //       const existingAddress = await Address.findOne({
    //         street,
    //         number,
    //         neighborhood,
    //         city,
    //         type,
    //         complement,
    //         group: decodedToken.group, // Garantir que o endereço seja do mesmo grupo
    //       });

    //       if (
    //         existingAddress &&
    //         existingAddress.type === "department" &&
    //         existingAddress.complement === complement
    //       ) {
    //         return {
    //           success: false,
    //           message:
    //             "Já existe um APARTAMENTO com mesmo endereço, numero, complemento, bairro e cidade...",
    //           address: null,
    //         };
    //       }

    //       if (existingAddress && existingAddress.type !== "department") {
    //         return {
    //           success: false,
    //           message: "Este endereço já existe.",
    //           address: null,
    //         };
    //       }
    //     }

    //     // Criação do novo endereço se não existir um duplicado
    //     const newAddress = new Address({
    //       ...newAddressInput,
    //       group: decodedToken.group, // Define o grupo do usuário
    //       userId: decodedToken.userId,
    //       active: true,
    //     });

    //     const savedAddress = await newAddress.save();

    //     return {
    //       success: true,
    //       message: "Endereço criado com sucesso.",
    //       address: savedAddress,
    //     };
    //   } catch (error) {
    //     return {
    //       success: false,
    //       message: error.message,
    //       address: null,
    //     };
    //   }
    // },

    updateAddress: async (_, { input }, { req }) => {
      try {
        const decodedToken = verifyAuthorization(req);
        if (!decodedToken) {
          throw new Error("Você não tem permissão.");
        }

        const existingAddress = await Address.findById(input.id);
        if (!existingAddress) {
          throw new Error("Endereço não encontrado.");
        }

        // Filtra apenas os campos que realmente foram alterados
        const updatedFields = {};
        Object.keys(input).forEach((key) => {
          if (
            input[key] !== undefined &&
            input[key] !== null &&
            input[key] !== existingAddress[key]
          ) {
            updatedFields[key] = input[key];
          }
        });

        if (Object.keys(updatedFields).length === 0) {
          throw new Error("Nenhuma alteração detectada.");
        }

        const updatedAddress = await Address.findByIdAndUpdate(
          input.id,
          updatedFields,
          { new: true }
        );

        return {
          success: true,
          message: "Endereço atualizado com sucesso.",
          address: updatedAddress,
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
          address: null,
        };
      }
    },

    deleteAddress: async (_, { id }, { req }) => {
      try {
        const decodedToken = verifyAuthorization(req);
        if (!decodedToken) {
          throw new Error("Você não tem permissão.");
        }

        const deletedAddress = await Address.findByIdAndDelete(id);
        if (!deletedAddress) {
          throw new Error("Endereço não encontrado.");
        }

        return {
          success: true,
          message: "Endereço excluído com sucesso.",
          address: deletedAddress,
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
          address: null,
        };
      }
    },
  },
};

export default addressResolvers;
