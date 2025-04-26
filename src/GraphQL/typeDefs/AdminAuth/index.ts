import { gql } from "graphql-tag";

export const AdminTypeDefs = gql`
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

  type AuthResponse {
    success: Boolean!
    message: String
    token: String
    admin: Admin
  }

  type OtpResponse {
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

  input RequestOtpInput {
    email: String!
  }

  input VerifyOtpInput {
    email: String!
    otp: String!
  }

  input ResetPasswordInput {
    email: String!
    otp: String!
    newPassword: String!
  }

  input ChangePasswordInput {
    currentPassword: String!
    newPassword: String!
  }

  input ResendOtpInput {
    email: String!
    purpose: String!
  }

  input SetNewPasswordInput {
    email: String!
    otp: String!
    newPassword: String!
  }

  type Query {
    me: Admin
  }

  type Mutation {
    adminSignup(input: AdminSignupInput!): AuthResponse!
    adminLogin(input: AdminLoginInput!): AuthResponse!
    requestOtp(input: RequestOtpInput!): OtpResponse!
    verifyOtp(input: VerifyOtpInput!): OtpResponse!
    resetPassword(input: ResetPasswordInput!): AuthResponse!
    updateProfile(firstName: String, lastName: String, phone: String, profileImage: String): AuthResponse!
    changePassword(input: ChangePasswordInput!): Boolean!
    resendOtp(input: ResendOtpInput!): Boolean!
    setNewPassword(input: SetNewPasswordInput!): Boolean!
    deleteAccount: Boolean!
  }
`;