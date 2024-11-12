import { mergeTypeDefs } from "@graphql-tools/merge";
import userTypeDef from "./user.typeDef.js";
import cardTypeDef from "./card.typeDef.js";
import addressTypeDef from "./address.typeDef.js";

const mergedTypeDefs = mergeTypeDefs([
  userTypeDef,
  cardTypeDef,
  addressTypeDef,
]);

export default mergedTypeDefs;
