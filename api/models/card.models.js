import { model, Schema, Types } from "mongoose";

const cardSchema = new Schema(
  {
    street: {
      type: [{ type: Types.ObjectId, ref: "Address", required: true }],
      default: [],
    },
    userId: {
      type: Types.ObjectId,
      ref: "User",
    },
    number: {
      type: Number,
      required: true,
      unique: true,
    },
    startDate: {
      type: String,
      default: null,
    },
    endDate: {
      type: String,
      default: null,
    },
    group: {
      type: String,
      required: true,
    },
    usersAssigned: {
      type: [
        {
          userId: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
          },
          date: {
            type: String,
            required: true,
          },
        },
      ],
      default: [],
    },
    assignedHistory: {
      type: [
        {
          userId: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
          },
          date: {
            type: String,
            required: true,
          },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

// Middleware para garantir regras de data conforme usersAssigned
cardSchema.pre("save", function (next) {
  if (this.usersAssigned.length === 0) {
    if (!this.endDate) {
      this.endDate = new Date().toISOString();
    }
    this.startDate = null;
  } else {
    this.endDate = null;
    if (this.usersAssigned.length > 0) {
      this.startDate = this.usersAssigned[0].date;
      this.assignedHistory.push(...this.usersAssigned);
    }
  }
  next();
});

// Middleware para verificar duplicidade de streets
cardSchema.pre("save", async function (next) {
  const duplicateCard = await model("Card").findOne({
    street: { $in: this.street },
    _id: { $ne: this._id },
  });
  if (duplicateCard) {
    throw new Error("Os endereços já estão associados a outro cartão.");
  }
  next();
});

// Middleware para findOneAndUpdate e updateOne
const updateMiddleware = async function (next) {
  const update = this.getUpdate();
  const street = update.$set?.street || update.street;

  if (street) {
    const duplicateCard = await model("Card").findOne({
      street: { $in: street },
      _id: { $ne: this.getQuery()._id },
    });
    if (duplicateCard) {
      throw new Error("Os endereços já estão associados a outro cartão.");
    }
  }

  if (update.usersAssigned) {
    if (update.usersAssigned.length === 0) {
      update.endDate = new Date().toISOString();
      update.startDate = null;
    } else {
      update.endDate = null;
      update.startDate = update.usersAssigned[0].date;
      update.$push = update.$push || {};
      update.$push.assignedHistory = { $each: update.usersAssigned };
    }
  }
  next();
};

cardSchema.pre("updateOne", updateMiddleware);
cardSchema.pre("findOneAndUpdate", updateMiddleware);

// Método estático para limpar registros antigos em assignedHistory
cardSchema.statics.cleanOldAssignments = async function () {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  await this.updateMany(
    {},
    {
      $pull: {
        usersAssigned: { date: { $lt: oneYearAgo.toISOString() } },
        assignedHistory: { date: { $lt: oneYearAgo.toISOString() } },
      },
    }
  );
};

const Card = model("Card", cardSchema);
export default Card;

// import { model, Schema, Types } from "mongoose";

// const cardSchema = new Schema(
//   {
//     street: [
//       {
//         type: Types.ObjectId, // Array de ObjectIds que referenciam o modelo Address
//         ref: "Address",
//         required: true,
//         unique: true,
//       },
//     ],
//     userId: {
//       type: Types.ObjectId, // Referencia o modelo User
//       ref: "User",
//     },
//     number: {
//       type: Number,
//       required: true,
//       unique: true,
//     },
//     startDate: {
//       type: String, // Usando string para datas
//     },
//     endDate: {
//       type: String, // Usando string para datas
//     },
//     group: {
//       type: String,
//       required: true,
//     },
//     usersAssigned: [
//       {
//         userId: {
//           type: Types.ObjectId, // Referencia o modelo User
//           ref: "User",
//         },
//         date: {
//           type: String, // Data da associação
//           required: true,
//         },
//       },
//     ],
//   },
//   { timestamps: true } // Adiciona os timestamps automáticos para createdAt e updatedAt
// );

// // Middleware para salvar - verificar duplicidade de streets
// cardSchema.pre("save", async function (next) {
//   const card = this;

//   // Verifica se há outro Card com os mesmos street IDs
//   const duplicateCard = await Card.findOne({
//     street: { $in: card.street }, // Verifica se algum Card tem um dos mesmos IDs de Address
//   });

//   if (duplicateCard) {
//     const duplicatedIds = duplicateCard.street.filter((id) =>
//       card.street.includes(id)
//     );
//     throw new Error(
//       `Os endereços com os seguintes IDs já estão associados a outro cartão: ${duplicatedIds.join(
//         ", "
//       )}`
//     );
//   }

//   next();
// });

// // Middleware para findOneAndUpdate e updateOne
// const updateMiddleware = async function (next) {
//   const update = this.getUpdate();
//   const street = update.$set?.street || update.street;

//   if (street) {
//     const duplicateCard = await Card.findOne({
//       street: { $in: street },
//     });

//     if (duplicateCard) {
//       const duplicatedIds = duplicateCard.street.filter((id) =>
//         street.includes(id)
//       );
//       throw new Error(
//         `Os endereços com os seguintes IDs já estão associados a outro cartão: ${duplicatedIds.join(
//           ", "
//         )}`
//       );
//     }
//   }

//   next();
// };

// cardSchema.pre("updateOne", updateMiddleware);
// cardSchema.pre("findOneAndUpdate", updateMiddleware);

// // Método estático para limpar registros antigos em usersAssigned
// cardSchema.statics.cleanOldAssignments = async function () {
//   const oneYearAgo = new Date();
//   oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

//   await this.updateMany(
//     {},
//     {
//       $pull: {
//         usersAssigned: {
//           date: { $lt: oneYearAgo.toISOString() },
//         },
//       },
//     }
//   );
// };

// // Modelo do Card
// const Card = model("Card", cardSchema);

// export default Card;
