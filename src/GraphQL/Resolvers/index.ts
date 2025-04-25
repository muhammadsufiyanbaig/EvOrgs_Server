import { dateScalar } from "./ScalarResolver";
import { userResolvers } from "./userResolver";
import { VendorResolvers } from "./vendorResolver";


export const resolvers = {
  Date: dateScalar,
  Query: {
    ...userResolvers.Query,
    ...VendorResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...VendorResolvers.Mutation,
  },
};