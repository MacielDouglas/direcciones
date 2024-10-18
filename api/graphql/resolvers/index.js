import { mergeResolvers } from "@graphql-tools/merge";
import userResolver from "./user.resolver.js";

const mergedResolver = mergeResolvers(userResolver);

export default mergedResolver;
