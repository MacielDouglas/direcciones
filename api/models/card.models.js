import { model, Schema, Types } from "mongoose";

const cardSchema = new Schema(
  {
    street: [
      {
        type: Types.ObjectId, // Array de ObjectIds que referenciam o modelo Address
        ref: "Address",
        required: true,
        unique: true,
      },
    ],
    userId: {
      type: Types.ObjectId, // Referencia o modelo User
      ref: "User",
    },
    number: {
      type: Number,
      required: true,
      unique: true,
    },
    startDate: {
      type: String, // Usando string para datas
    },
    endDate: {
      type: String, // Usando string para datas
    },
    group: {
      type: String,
      required: true,
    },
    usersAssigned: [
      {
        userId: {
          type: Types.ObjectId, // Referencia o modelo User
          ref: "User",
        },
        date: {
          type: String, // Data da associação
          required: true,
        },
      },
    ],
  },
  { timestamps: true } // Adiciona os timestamps automáticos para createdAt e updatedAt
);

// Middleware para salvar - verificar duplicidade de streets
cardSchema.pre("save", async function (next) {
  const card = this;

  // Verifica se há outro Card com os mesmos street IDs
  const duplicateCard = await Card.findOne({
    street: { $in: card.street }, // Verifica se algum Card tem um dos mesmos IDs de Address
  });

  if (duplicateCard) {
    const duplicatedIds = duplicateCard.street.filter((id) =>
      card.street.includes(id)
    );
    throw new Error(
      `Os endereços com os seguintes IDs já estão associados a outro cartão: ${duplicatedIds.join(
        ", "
      )}`
    );
  }

  next();
});

// Middleware para findOneAndUpdate e updateOne
const updateMiddleware = async function (next) {
  const update = this.getUpdate();
  const street = update.$set?.street || update.street;

  if (street) {
    const duplicateCard = await Card.findOne({
      street: { $in: street },
    });

    if (duplicateCard) {
      const duplicatedIds = duplicateCard.street.filter((id) =>
        street.includes(id)
      );
      throw new Error(
        `Os endereços com os seguintes IDs já estão associados a outro cartão: ${duplicatedIds.join(
          ", "
        )}`
      );
    }
  }

  next();
};

cardSchema.pre("updateOne", updateMiddleware);
cardSchema.pre("findOneAndUpdate", updateMiddleware);

// Método estático para limpar registros antigos em usersAssigned
cardSchema.statics.cleanOldAssignments = async function () {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  await this.updateMany(
    {},
    {
      $pull: {
        usersAssigned: {
          date: { $lt: oneYearAgo.toISOString() },
        },
      },
    }
  );
};

// Modelo do Card
const Card = model("Card", cardSchema);

export default Card;
