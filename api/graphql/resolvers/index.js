import { mergeResolvers } from "@graphql-tools/merge";
import userResolver from "./user.resolver.js";
import cardResolver from "./card.resolver.js";
import addressResolver from "./address.resolver.js";

const mergedResolvers = mergeResolvers([
  userResolver,
  cardResolver,
  addressResolver,
]);

export default mergedResolvers;
