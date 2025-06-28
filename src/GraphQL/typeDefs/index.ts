import { adTypeDefs } from "../../Features/Advertisment/GraphQL/TypeDefs";
import { AdminTypeDefs } from "../../Features/Auth/Admin/GraphQL/TypeDefs";
import { UserTypeDefs } from "../../Features/Auth/User/GraphQL/TypeDefs";
import { VendorTypeDefs } from "../../Features/Auth/Vendor/GraphQL/TypeDefs";
import { blogTypeDefs } from "../../Features/Blog/GraphQL/TypeDefs";
import { BookingTypeDefs } from "../../Features/Booking/GraphQl/TypeDefs";
import notificationTypeDefs from "../../Features/Notification/GraphQL/TypeDefs";
import { posTypeDefs } from "../../Features/POS/GraphQL/TypeDefs";
import { settingsTypeDefs } from "../../Features/Preferences/GraphQL/typeDefs";
import { reviewTypeDefs } from "../../Features/Reviews/GraphQL/TypeDefs";
import { customCateringTypeDefs } from "../../Features/Services/Catering/Custom/GraphQL/TypeDefs";
import { CateringPackageTypeDefs } from "../../Features/Services/Catering/Package/GraphQL/TypeDefs";
import { farmhouseTypeDefs } from "../../Features/Services/FarmHouse/GraphQL/TypeDefs";
import { customPhotographyTypeDefs } from "../../Features/Services/Photography/Custom/GraphQL/TypeDefs";
import { photographyTypeDefs } from "../../Features/Services/Photography/Package/GraphQL/TypeDefs";
import { venueTypeDefs } from "../../Features/Services/Venue/GraphQL/TypeDefs";
import { supportTypeDefs } from "../../Features/Support/GraphQL/TypeDefs";


export const typeDefs = [
  UserTypeDefs,
  VendorTypeDefs,
  AdminTypeDefs,
  venueTypeDefs,
  farmhouseTypeDefs,
  CateringPackageTypeDefs,
  customCateringTypeDefs,
  photographyTypeDefs,
  customPhotographyTypeDefs,
  BookingTypeDefs,
  posTypeDefs,
  reviewTypeDefs,
  blogTypeDefs,
  adTypeDefs,
  supportTypeDefs,
  settingsTypeDefs,
  notificationTypeDefs,
];