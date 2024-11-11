import { mergeResolvers } from "@graphql-tools/merge";
import userResolver from "./user.resolver.js";
import cardResolver from "./card.resolver.js";

const mergedResolvers = mergeResolvers([userResolver, cardResolver]);

export default mergedResolvers;
