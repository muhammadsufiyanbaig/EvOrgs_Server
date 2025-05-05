import { adminResolver } from "../../Features/Auth/Admin/GraphQL/Resolver";
import { userResolvers } from "../../Features/Auth/User/GraphQL/Resolver";
import { VendorResolvers } from "../../Features/Auth/Vendor/GraphQL/Resolver";
import { dateScalar } from "./Scalar";



export const resolvers = {
  Date: dateScalar,
  Query: {
    ...userResolvers.Query,
    ...VendorResolvers.Query,
    ...adminResolver.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...VendorResolvers.Mutation,
    ...adminResolver.Mutation,
  },
};