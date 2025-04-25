import { gql } from "graphql-tag";

export const VendorTypeDefs = gql`
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

  extend type Query {
    vendor(id: ID!): Vendor
    vendorProfile: Vendor
    pendingVendors: [Vendor!]!
    approvedVendors: [Vendor!]!
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
  }
`;
