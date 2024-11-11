import { mergeTypeDefs } from "@graphql-tools/merge";
import userTypeDef from "./user.typeDef.js";
import cardTypeDef from "./card.typeDef.js";

const mergedTypeDefs = mergeTypeDefs([userTypeDef, cardTypeDef]);

export default mergedTypeDefs;
