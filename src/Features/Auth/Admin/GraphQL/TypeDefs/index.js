"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminTypeDefs = void 0;
const graphql_tag_1 = require("graphql-tag");
exports.AdminTypeDefs = (0, graphql_tag_1.gql) `
  # Define the OtpPurpose enum
  enum OtpPurpose {
    registration
    login
    password_reset
  }

  type Admin {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    phone: String
    profileImage: String
    createdAt: String!
    updatedAt: String!
  }

  type AdminAuthResponse {
    success: Boolean!
    message: String
    token: String
    admin: Admin
  }

  type AdminOtpResponse {
    success: Boolean!
    message: String
    email: String
  }

  input AdminSignupInput {
    firstName: String!
    lastName: String!
    email: String!
    phone: String
    password: String!
    profileImage: String
  }

  input AdminLoginInput {
    email: String!
    password: String!
  }

  input AdminRequestOtpInput {
    email: String!
    purpose: OtpPurpose = password_reset
  }

  input AdminVerifyOtpInput {
    email: String!
    otp: String!
    purpose: OtpPurpose = password_reset
  }

  input AdminResetPasswordInput {
    email: String!
    otp: String!
    newPassword: String!
  }

  input AdminUpdateProfileInput {
    firstName: String
    lastName: String
    phone: String
    profileImage: String
  }

  input AdminChangePasswordInput {
    currentPassword: String!
    newPassword: String!
  }

  input AdminResendOtpInput {
    email: String!
    purpose: OtpPurpose!
  }

  input AdminSetNewPasswordInput {
    email: String!
    otp: String!
    newPassword: String!
  }

  # User Management Types for Admin
  type UserListResponse {
    users: [User!]!
    total: Int!
    page: Int!
    limit: Int!
    totalPages: Int!
  }

  input ListUsersInput {
    page: Int = 1
    limit: Int = 10
    search: String
  }

  # Vendor Management Types for Admin
  type VendorListResponse {
    vendors: [Vendor!]!
    total: Int!
    page: Int!
    limit: Int!
    totalPages: Int!
  }

  input ListVendorsInput {
    page: Int = 1
    limit: Int = 10
    search: String
    status: VendorStatus
    vendorType: VendorType
  }

  input UpdateVendorStatusInput {
    vendorId: ID!
    status: VendorStatus!
    message: String
  }

  extend type Query {
    adminMe: Admin
    # User Management Queries for Admin
    adminListAllUsers(input: ListUsersInput): UserListResponse!
    adminGetUserById(userId: ID!): User
    # Vendor Management Queries for Admin
    adminListAllVendors(input: ListVendorsInput): VendorListResponse!
    adminGetVendorById(vendorId: ID!): Vendor
  }

  extend type Mutation {
    adminSignup(input: AdminSignupInput!): AdminAuthResponse!
    adminLogin(input: AdminLoginInput!): AdminAuthResponse!
    adminRequestOtp(input: AdminRequestOtpInput!): AdminOtpResponse!
    adminVerifyOtp(input: AdminVerifyOtpInput!): AdminOtpResponse!
    adminResetPassword(input: AdminResetPasswordInput!): AdminAuthResponse!
    adminUpdateAdminProfile(input: AdminUpdateProfileInput!): AdminAuthResponse!
    adminChangePassword(input: AdminChangePasswordInput!): Boolean!
    adminResendOtp(input: AdminResendOtpInput!): Boolean!
    adminSetNewPassword(input: AdminSetNewPasswordInput!): Boolean!
    adminDeleteAccount: Boolean!
    # User Management Mutations for Admin
    adminDeleteUser(userId: ID!): Boolean!
    # Vendor Management Mutations for Admin
    adminDeleteVendor(vendorId: ID!): Boolean!
    adminUpdateVendorStatus(input: UpdateVendorStatusInput!): Boolean!
  }
`;
