import mongoose, { model, Schema, Types } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
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
      default: "",
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
    uid: {
      type: String,
      default: "",
    },
    codUser: {
      type: Number,
      required: true,
      unique: true,
    },
    myCards: {
      type: [
        {
          cardId: {
            type: Types.ObjectId,
            ref: "Card",
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
    myTotalCards: {
      type: [
        {
          cardId: {
            type: Types.ObjectId,
            ref: "Card",
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
    comments: {
      type: [
        {
          cardId: {
            type: Types.ObjectId,
            ref: "Card",
            required: true,
          },
          text: {
            type: String,
            maxlength: 250,
          },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

// Middleware para resetar privilégios caso o grupo seja alterado
userSchema.pre("save", function (next) {
  if (this.isModified("group")) {
    this.isAdmin = false;
    this.isSS = false;
    this.isSCards = false;
    this.myCards = [];
    this.myTotalCards = [];
    this.comments = [];
  }
  next();
});

// Middleware para remover myTotalCards após um ano
userSchema.pre("save", function (next) {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  this.myTotalCards = this.myTotalCards.filter((card) => {
    return new Date(card.date) >= oneYearAgo;
  });

  next();
});

const User = model("User", userSchema);
export default User;
