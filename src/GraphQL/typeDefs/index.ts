import { AdminTypeDefs } from "../../Features/Auth/Admin/GraphQL/TypeDefs";
import { UserTypeDefs } from "../../Features/Auth/User/GraphQL/TypeDefs";
import { VendorTypeDefs } from "../../Features/Auth/Vendor/GraphQL/TypeDefs";
import { customCateringTypeDefs } from "../../Features/Services/Catering/Custom/GraphQL/TypeDefs";
import { CateringPackageTypeDefs } from "../../Features/Services/Catering/Package/GraphQL/TypeDefs";
import { farmhouseTypeDefs } from "../../Features/Services/FarmHouse/GraphQL/TypeDefs";
import { customPhotographyTypeDefs } from "../../Features/Services/Photography/Custom/GraphQL/TypeDefs";
import { photographyTypeDefs } from "../../Features/Services/Photography/Package/GraphQL/TypeDefs";
import { venueTypeDefs } from "../../Features/Services/Venue/GraphQL/TypeDefs";


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
  ];