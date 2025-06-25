import { adResolvers } from "../../Features/Advertisment/GraphQL/Resolver";
import { adminResolver } from "../../Features/Auth/Admin/GraphQL/Resolver";
import { userResolvers } from "../../Features/Auth/User/GraphQL/Resolver";
import { VendorResolvers } from "../../Features/Auth/Vendor/GraphQL/Resolver";
import { blogResolvers } from "../../Features/Blog/GraphQL/Resolver";
import { BookingResolvers } from "../../Features/Booking/GraphQl/Resolver";
import { posResolvers } from "../../Features/POS/GraphQL/Resolver";
import { settingsResolvers } from "../../Features/Preferences/GraphQL/Resolver";
import { reviewResolvers } from "../../Features/Reviews/GraphQL/Resolver";
import { customCateringResolvers } from "../../Features/Services/Catering/Custom/GraphQL/Resolvers";
import { cateringPackageResolvers } from "../../Features/Services/Catering/Package/GraphQL/Resolvers";
import { farmhouseResolvers } from "../../Features/Services/FarmHouse/GraphQL/Resolvers";
import { customPhotographyResolver } from "../../Features/Services/Photography/Custom/GraphQL/Resolvers";
import { photographyResolvers } from "../../Features/Services/Photography/Package/GraphQL/Resolvers";
import { venueResolver } from "../../Features/Services/Venue/GraphQL/Resolvers";
import { supportResolvers } from "../../Features/Support/GraphQL/Resolver";
import { voucherResolvers } from "../../Features/Voucher/GraphQL/Resolver";
import { dateScalar } from "./Scalar";



export const resolvers = {
  Date: dateScalar,
  Query: {
    ...userResolvers.Query,
    ...VendorResolvers.Query,
    ...adminResolver.Query,
    ...venueResolver.Query,
    ...farmhouseResolvers.Query,
    ...cateringPackageResolvers.Query,
    ...customCateringResolvers.Query,
    ...photographyResolvers.Query,
    ...customPhotographyResolver.Query,
    ...BookingResolvers.Query,
    ...posResolvers.Query,
    ...reviewResolvers.Query,
    ...blogResolvers.Query,
    ...adResolvers.Query,
    ...supportResolvers.Query,
    ...settingsResolvers.Query,
    ...voucherResolvers.Query,

  },
  Mutation: {
    ...userResolvers.Mutation,
    ...VendorResolvers.Mutation,
    ...adminResolver.Mutation,
    ...venueResolver.Mutation,
    ...farmhouseResolvers.Mutation,
    ...cateringPackageResolvers.Mutation,
    ...customCateringResolvers.Mutation,
    ...photographyResolvers.Mutation,
    ...customPhotographyResolver.Mutation,
    ...BookingResolvers.Mutation,
    ...posResolvers.Mutation,
    ...reviewResolvers.Mutation,
    ...blogResolvers.Mutation,
    ...adResolvers.Mutation,
    ...supportResolvers.Mutation,
    ...settingsResolvers.Mutation,
    ...voucherResolvers.Mutation,
    
  },
};