"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
const TypeDefs_1 = require("../../Features/Advertisment/GraphQL/TypeDefs");
const TypeDefs_2 = require("../../Features/Analytics/GraphQL/TypeDefs");
const TypeDefs_3 = require("../../Features/Auth/Admin/GraphQL/TypeDefs");
const TypeDefs_4 = require("../../Features/Auth/User/GraphQL/TypeDefs");
const TypeDefs_5 = require("../../Features/Auth/Vendor/GraphQL/TypeDefs");
const TypeDefs_6 = require("../../Features/Blog/GraphQL/TypeDefs");
const TypeDefs_7 = require("../../Features/Booking/GraphQl/TypeDefs");
const TypeDefs_8 = require("../../Features/Chats/GraphQL/TypeDefs");
const TypeDefs_9 = __importDefault(require("../../Features/Notification/GraphQL/TypeDefs"));
const TypeDefs_10 = require("../../Features/POS/GraphQL/TypeDefs");
const typeDefs_1 = require("../../Features/Preferences/GraphQL/typeDefs");
const TypeDefs_11 = require("../../Features/Reviews/GraphQL/TypeDefs");
const TypeDefs_12 = require("../../Features/Services/Catering/Custom/GraphQL/TypeDefs");
const TypeDefs_13 = require("../../Features/Services/Catering/Package/GraphQL/TypeDefs");
const TypeDefs_14 = require("../../Features/Services/FarmHouse/GraphQL/TypeDefs");
const TypeDefs_15 = require("../../Features/Services/Photography/Custom/GraphQL/TypeDefs");
const TypeDefs_16 = require("../../Features/Services/Photography/Package/GraphQL/TypeDefs");
const TypeDefs_17 = require("../../Features/Services/Venue/GraphQL/TypeDefs");
const TypeDefs_18 = require("../../Features/Support/GraphQL/TypeDefs");
const TypeDefs_19 = require("../../Features/Voucher/GraphQL/TypeDefs");
exports.typeDefs = [
    TypeDefs_4.UserTypeDefs,
    TypeDefs_5.VendorTypeDefs,
    TypeDefs_3.AdminTypeDefs,
    TypeDefs_17.venueTypeDefs,
    TypeDefs_14.farmhouseTypeDefs,
    TypeDefs_13.CateringPackageTypeDefs,
    TypeDefs_12.customCateringTypeDefs,
    TypeDefs_16.photographyTypeDefs,
    TypeDefs_15.customPhotographyTypeDefs,
    TypeDefs_7.BookingTypeDefs,
    TypeDefs_10.posTypeDefs,
    TypeDefs_11.reviewTypeDefs,
    TypeDefs_6.blogTypeDefs,
    TypeDefs_1.adTypeDefs,
    TypeDefs_8.chatTypeDefs,
    TypeDefs_18.supportTypeDefs,
    typeDefs_1.settingsTypeDefs,
    TypeDefs_9.default,
    TypeDefs_2.analyticsTypeDefs,
    TypeDefs_19.voucherTypeDefs,
];
