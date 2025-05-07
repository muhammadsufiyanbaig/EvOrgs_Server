import { AdminTypeDefs } from "../../Features/Auth/Admin/GraphQL/TypeDefs";
import { UserTypeDefs } from "../../Features/Auth/User/GraphQL/TypeDefs";
import { VendorTypeDefs } from "../../Features/Auth/Vendor/GraphQL/TypeDefs";
import { farmhouseTypeDefs } from "../../Features/Services/FarmHouse/GraphQL/TypeDefs";
import { venueTypeDefs } from "../../Features/Services/Venue/GraphQL/TypeDefs";

export const typeDefs = [
  UserTypeDefs,
  VendorTypeDefs,
  AdminTypeDefs,
  venueTypeDefs,
  farmhouseTypeDefs,
  ];