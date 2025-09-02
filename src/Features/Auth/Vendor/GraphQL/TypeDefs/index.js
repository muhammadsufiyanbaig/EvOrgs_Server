"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorTypeDefs = void 0;
const graphql_tag_1 = require("graphql-tag");
exports.VendorTypeDefs = (0, graphql_tag_1.gql) `
  type Vendor {
    id: ID!
    vendorName: String!
    vendorEmail: String!
    vendorPhone: String
    fcmToken: [String]
    vendorAddress: String
    vendorProfileDescription: String
    vendorWebsite: String
    vendorSocialLinks: [String]
    profileImage: String
    bannerImage: String
    vendorType: VendorType!
    vendorStatus: VendorStatus!
    vendorTypeId: ID
    rating: Float
    reviewCount: Int
    createdAt: Date!
    updatedAt: Date!
  }

  enum VendorType {
    FarmHouse
    Venue
    Catering
    Photography
  }

  enum VendorStatus {
    Pending
    Approved
    Rejected
  }

  type VendorAuthPayload {
    token: String!
    vendor: Vendor!
  }

  input VendorRegisterInput {
    vendorName: String!
    vendorEmail: String!
    password: String!
    vendorPhone: String
    vendorAddress: String
    vendorProfileDescription: String
    vendorWebsite: String
    vendorSocialLinks: [String]
    profileImage: String
    bannerImage: String
    vendorType: VendorType!
    vendorTypeId: ID
  }

  input VendorLoginInput {
    vendorEmail: String!
    password: String!
  }

  input VendorVerifyOtpInput {
    vendorEmail: String!
    otp: String!
    purpose: OtpPurpose!
    userType: UserType!
  }

  input VendorUpdateProfileInput {
    vendorName: String
    vendorPhone: String
    vendorAddress: String
    vendorProfileDescription: String
    vendorWebsite: String
    vendorSocialLinks: [String]
    profileImage: String
    bannerImage: String
    vendorType: VendorType
    vendorTypeId: ID
    fcmToken: String
  }

  input VendorChangePasswordInput {
    currentPassword: String!
    newPassword: String!
  }

  input VendorResetPasswordInput {
    vendorEmail: String!
    userType: UserType!
  }

  input VendorSetNewPasswordInput {
    vendorEmail: String!
    otp: String!
    newPassword: String!
    userType: UserType!
  }

  input VendorResendOtpInput {
    vendorEmail: String!
    purpose: OtpPurpose!
    userType: UserType!
  }

  input VendorApprovalInput {
    vendorId: ID!
    status: VendorStatus!
    message: String
  }

  # Vendor Management Types
  input VendorUpdateStatusInput {
    vendorId: ID!
    status: VendorStatus!
    message: String
  }

  # Import types from User schema for vendor management
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    phone: String
    address: String
    fcmToken: [String]
    profileImage: String
    dateOfBirth: Date
    gender: String!
    createdAt: Date!
    isVerified: Boolean!
  }

  type UserListResponse {
    users: [User!]!
    total: Int!
    page: Int!
    limit: Int!
    totalPages: Int!
  }

  type VendorListResponse {
    vendors: [Vendor!]!
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

  input ListVendorsInput {
    page: Int = 1
    limit: Int = 10
    search: String
    status: VendorStatus
    vendorType: VendorType
  }

  extend type Query {
    vendorProfile: Vendor
    vendor(id: ID!): Vendor
    pendingVendors: [Vendor]
    # Vendor Management Queries
    vendorListAllVendors(input: ListVendorsInput): VendorListResponse!
    vendorListAllUsers(input: ListUsersInput): UserListResponse!
    vendorGetVendorById(vendorId: ID!): Vendor
    vendorGetUserById(userId: ID!): User
  }

  extend type Mutation {
    vendorRegister(input: VendorRegisterInput!): Boolean!
    vendorVerifyRegistration(input: VendorVerifyOtpInput!): VendorAuthPayload!
    vendorLogin(input: VendorLoginInput!): VendorAuthPayload!
    vendorRequestLoginOtp(vendorEmail: String!, userType: UserType!): Boolean!
    vendorVerifyLoginOtp(input: VendorVerifyOtpInput!): VendorAuthPayload!
    vendorUpdateProfile(input: VendorUpdateProfileInput!): Vendor!
    vendorChangePassword(input: VendorChangePasswordInput!): Boolean!
    vendorResetPassword(input: VendorResetPasswordInput!): Boolean!
    vendorSetNewPassword(input: VendorSetNewPasswordInput!): Boolean!
    vendorResendOtp(input: VendorResendOtpInput!): Boolean!
    vendorDeleteAccount: Boolean!
    vendorApproval(input: VendorApprovalInput!): Vendor!
    # Vendor Management Mutations
    vendorUpdateVendorStatus(input: VendorUpdateStatusInput!): Boolean!
    vendorVerifyUser(userId: ID!): Boolean!
  }
`;
