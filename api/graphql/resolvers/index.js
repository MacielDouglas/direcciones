import { mergeResolvers } from "@graphql-tools/merge";
import userResolver from "./user.resolver.js";
import addressResolver from "./address.resolver.js";

const mergedResolver = mergeResolvers([userResolver, addressResolver]);

export default mergedResolver;
