import { mergeTypeDefs } from "@graphql-tools/merge";
import userTypeDef from "./user.typeDef.js";
import addressTypeDef from "./address.typeDef.js";

const mergedTypeDefs = mergeTypeDefs([userTypeDef, addressTypeDef]);

export default mergedTypeDefs;
