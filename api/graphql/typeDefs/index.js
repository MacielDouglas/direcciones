import { mergeTypeDefs } from "@graphql-tools/merge";
import userTypeDef from "./user.typeDef.js";

const mergedTypeDefs = mergeTypeDefs(userTypeDef);

export default mergedTypeDefs;
