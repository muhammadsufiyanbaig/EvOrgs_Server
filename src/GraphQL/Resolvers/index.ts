import { adminResolver } from "../../Features/Auth/Admin/GraphQL/Resolver";
import { userResolvers } from "../../Features/Auth/User/GraphQL/Resolver";
import { VendorResolvers } from "../../Features/Auth/Vendor/GraphQL/Resolver";
import { farmhouseResolvers } from "../../Features/Services/FarmHouse/GraphQL/Resolvers";
import { venueResolver } from "../../Features/Services/Venue/GraphQL/Resolvers";
import { dateScalar } from "./Scalar";



export const resolvers = {
  Date: dateScalar,
  Query: {
    ...userResolvers.Query,
    ...VendorResolvers.Query,
    ...adminResolver.Query,
    ...venueResolver.Query,
    ...farmhouseResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...VendorResolvers.Mutation,
    ...adminResolver.Mutation,
    ...venueResolver.Mutation,
    ...farmhouseResolvers.Mutation,
  },
};