import { dateScalar } from "./ScalarResolver";
import { userResolvers } from "./userResolver";


export const resolvers = {
  Date: dateScalar,
  Query: {
    ...userResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
  },
};