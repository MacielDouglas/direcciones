import { model, Schema } from "mongoose";

const addressSchema = new Schema(
  {
    street: {
      type: String,
      required: [true, "O campo 'street' é obrigatório."],
      trim: true,
      minlength: [3, "O campo 'street' deve ter no mínimo 3 caracteres."],
      maxlength: [100, "O campo 'street' deve ter no máximo 100 caracteres."],
    },
    number: {
      type: String,
      required: [true, "O campo 'number' é obrigatório."],
      match: [
        /^\d+[a-zA-Z]?$/,
        "O campo 'number' deve conter um número válido.",
      ],
    },
    city: {
      type: String,
      required: [true, "O campo 'city' é obrigatório."],
      trim: true,
      minlength: [2, "O campo 'city' deve ter no mínimo 2 caracteres."],
      maxlength: [60, "O campo 'city' deve ter no máximo 100 caracteres."],
    },
    neighborhood: {
      type: String,
      required: [true, "O campo 'neighborhood' é obrigatório."],
      trim: true,
      minlength: [2, "O campo 'neighborhood' deve ter no mínimo 2 caracteres."],
      maxlength: [
        60,
        "O campo 'neighborhood' deve ter no máximo 100 caracteres.",
      ],
    },
    gps: {
      type: String,
      validate: {
        validator: function (v) {
          return /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?((1[0-7]\d|\d{1,2})(\.\d+)?|180(\.0+)?)$/.test(
            v
          );
        },
        message: (props) => `${props.value} não é uma coordenada GPS válida!`,
      },
      required: false,
    },
    complement: {
      type: String,
      required: false,
      maxlength: [
        250,
        "O campo 'complement' deve ter no máximo 250 caracteres.",
      ],
      set: function (v) {
        const regex =
          /\b(homem(ens)?|hombre(s)?|mulher(es)?|mujer(es)?|criança|jovem|niño|niña|muchacho|muchacha|peru(ano|ana|anos|anas)?|argentin(a|o|as|os)?|chile(no|na|nos|nas)?|urugua(y|i)(o|a|os|as)?|paragua(y|i)(o|a|os|as)?|venezuela(no|na|as|os)?|bolivia(no|na|nos|nas)?|cuba(no|na|nos|nas)?|equator(iano|iana|ianos|ianas)?|colombia(no|na|nos|nas)?ecuator(iano|iana|ianos|ianas)?)\b/gi;
        return v.replace(regex, "******");
      },
    },
    type: {
      type: String,
      required: [true, "O campo 'type' é obrigatório."],
      enum: {
        values: ["house", "department", "store", "hotel", "restaurant"],
        message:
          "O campo 'type' deve ser 'house', 'department', 'store', 'hotel' ou 'restaurant'.",
      },
    },
    photo: {
      type: String,
      required: false,
      maxlength: [500, "O campo 'photo' deve ter no máximo 500 caracteres."],
    },
    userId: {
      type: String,
      required: [true, "O campo 'userId' é obrigatório."],
      trim: true,
    },
    active: {
      type: Boolean,
      required: [true, "O campo 'active' é obrigatório."],
    },
    confirmed: {
      type: Boolean,
      required: [true, "O campo 'confirmed' é obrigatório."],
    },
    visited: {
      type: String,
      enum: {
        values: ["yes", "no", null],
        message: "O campo 'visited' deve ser 'yes', 'no' ou vazio.",
      },
    },
  },
  { timestamps: true } // Adiciona createdAt e updatedAt automaticamente
);

const Address = model("Address", addressSchema);

export default Address;
