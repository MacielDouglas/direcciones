import mongoose, { model, Schema, Types } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    group: {
      type: String,
      required: true,
      default: "0",
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isSS: {
      type: Boolean,
      default: false,
    },
    isSCards: {
      type: Boolean,
      default: false,
    },
    myCards: [
      {
        // type: Types.ObjectId,
        type: mongoose.Schema.Types.ObjectId,
        ref: "Card", // Referência ao modelo Cardmodelo Card
      },
    ],
    myTotalCards: [
      {
        type: Types.ObjectId,
        ref: "Card", // Referência para o modelo Card
      },
    ],
    comments: [
      {
        cardId: {
          type: Types.ObjectId,
          ref: "Card", // Referência para o modelo Card
        },
        text: {
          type: String,
          maxlength: 250, // Limite de 250 caracteres
        },
      },
    ],
  },
  { timestamps: true } // Adiciona createdAt e updatedAt automaticamente
);

// Middleware para sincronizar mudanças no campo `group`
userSchema.pre("save", function (next) {
  const user = this;

  // Reseta privilégios caso o grupo seja alterado
  if (user.isModified("group")) {
    user.isAdmin = false;
    user.isSS = false;
    user.isSCards = false;
    user.myCards = [];
    user.myTotalCards = [];
    user.comments = [];
  }

  next();
});

const User = model("User", userSchema);

export default User;
