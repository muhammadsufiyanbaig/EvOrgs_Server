import { AdminTypeDefs } from "../../Features/Auth/Admin/GraphQL/TypeDefs";
import { UserTypeDefs } from "../../Features/Auth/User/GraphQL/TypeDefs";
import { VendorTypeDefs } from "../../Features/Auth/Vendor/GraphQL/TypeDefs";

export const typeDefs = [
  UserTypeDefs,
  VendorTypeDefs,
  AdminTypeDefs,
  ];