import { mergeTypeDefs } from "@graphql-tools/merge";
import userTypeDef from "./user.typedef.js";

const mergedTypeDefs = mergeTypeDefs(userTypeDef);

export default mergedTypeDefs;
