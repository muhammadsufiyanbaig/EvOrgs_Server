"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const Resolver_1 = require("../../Features/Advertisment/GraphQL/Resolver");
const Resolver_2 = require("../../Features/Analytics/GraphQL/Resolver");
const Resolver_3 = require("../../Features/Auth/Admin/GraphQL/Resolver");
const Resolver_4 = require("../../Features/Auth/User/GraphQL/Resolver");
const Resolver_5 = require("../../Features/Auth/Vendor/GraphQL/Resolver");
const Resolver_6 = require("../../Features/Blog/GraphQL/Resolver");
const Resolver_7 = require("../../Features/Booking/GraphQl/Resolver");
const Resolver_8 = require("../../Features/Chats/GraphQL/Resolver");
const Resolver_9 = require("../../Features/Notification/GraphQL/Resolver");
const Resolver_10 = require("../../Features/POS/GraphQL/Resolver");
const Resolver_11 = require("../../Features/Preferences/GraphQL/Resolver");
const Resolver_12 = require("../../Features/Reviews/GraphQL/Resolver");
const Resolvers_1 = require("../../Features/Services/Catering/Custom/GraphQL/Resolvers");
const Resolvers_2 = require("../../Features/Services/Catering/Package/GraphQL/Resolvers");
const Resolvers_3 = require("../../Features/Services/FarmHouse/GraphQL/Resolvers");
const Resolvers_4 = require("../../Features/Services/Photography/Custom/GraphQL/Resolvers");
const Resolvers_5 = require("../../Features/Services/Photography/Package/GraphQL/Resolvers");
const Resolvers_6 = require("../../Features/Services/Venue/GraphQL/Resolvers");
const Resolver_13 = require("../../Features/Support/GraphQL/Resolver");
const Resolver_14 = require("../../Features/Voucher/GraphQL/Resolver");
const Scalar_1 = require("./Scalar");
exports.resolvers = {
    Date: Scalar_1.dateScalar,
    JSON: Resolver_8.chatResolvers.JSON,
    Query: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, Resolver_4.userResolvers.Query), Resolver_5.VendorResolvers.Query), Resolver_3.adminResolver.Query), Resolvers_6.venueResolver.Query), Resolvers_3.farmhouseResolvers.Query), Resolvers_2.cateringPackageResolvers.Query), Resolvers_1.customCateringResolvers.Query), Resolvers_5.photographyResolvers.Query), Resolvers_4.customPhotographyResolver.Query), Resolver_7.BookingResolvers.Query), Resolver_10.posResolvers.Query), Resolver_12.reviewResolvers.Query), Resolver_6.blogResolvers.Query), Resolver_1.adResolvers.Query), Resolver_8.chatResolvers.Query), Resolver_13.supportResolvers.Query), Resolver_11.settingsResolvers.Query), Resolver_9.notificationResolvers.Query), Resolver_2.analyticsResolvers.Query), Resolver_14.voucherResolvers.Query),
    Mutation: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, Resolver_4.userResolvers.Mutation), Resolver_5.VendorResolvers.Mutation), Resolver_3.adminResolver.Mutation), Resolvers_6.venueResolver.Mutation), Resolvers_3.farmhouseResolvers.Mutation), Resolvers_2.cateringPackageResolvers.Mutation), Resolvers_1.customCateringResolvers.Mutation), Resolvers_5.photographyResolvers.Mutation), Resolvers_4.customPhotographyResolver.Mutation), Resolver_7.BookingResolvers.Mutation), Resolver_10.posResolvers.Mutation), Resolver_12.reviewResolvers.Mutation), Resolver_6.blogResolvers.Mutation), Resolver_1.adResolvers.Mutation), Resolver_8.chatResolvers.Mutation), Resolver_13.supportResolvers.Mutation), Resolver_11.settingsResolvers.Mutation), Resolver_9.notificationResolvers.Mutation), Resolver_2.analyticsResolvers.Mutation), Resolver_14.voucherResolvers.Mutation),
};
