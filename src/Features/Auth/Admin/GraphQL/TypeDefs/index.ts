import { gql } from "graphql-tag";

export const AdminTypeDefs = gql`
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

  extend type Query {
    adminMe: Admin
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
  }
`;