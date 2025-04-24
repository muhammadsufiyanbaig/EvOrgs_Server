import { gql } from "graphql-tag";

export const UsertypeDefs = gql`
  scalar Date

  enum Gender {
    Male
    Female
    Others
  }

  enum UserType {
    User
    Vendor
    Admin
  }

  enum OtpPurpose {
    registration
    password_reset 
  }

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
    gender: Gender!
    createdAt: Date!
    isVerified: Boolean!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input RegisterInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
    phone: String
    address: String
    profileImage: String
    dateOfBirth: String
    gender: Gender!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input UpdateProfileInput {
    firstName: String
    lastName: String
    phone: String
    address: String
    profileImage: String
    dateOfBirth: String
    gender: Gender
    fcmToken: String
  }

  input ChangePasswordInput {
    currentPassword: String!
    newPassword: String!
  }

  input VerifyOtpInput {
    email: String!
    otp: String!
    purpose: OtpPurpose!
    userType: UserType!
  }

  input ResendOtpInput {
    email: String!
    purpose: OtpPurpose!
    userType: UserType!
  }

  input ResetPasswordInput {
    email: String!
    userType: UserType!
  }

  input SetNewPasswordInput {
    email: String!
    otp: String!
    newPassword: String!
    userType: UserType!
  }

  type Query {
    me: User
  }

  type Mutation {
    register(input: RegisterInput!): Boolean!
    verifyRegistration(input: VerifyOtpInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    requestLoginOtp(email: String!, userType: UserType!): Boolean!
    verifyLoginOtp(input: VerifyOtpInput!): AuthPayload!
    updateProfile(input: UpdateProfileInput!): User!
    changePassword(input: ChangePasswordInput!): Boolean!
    resetPassword(input: ResetPasswordInput!): Boolean!
    setNewPassword(input: SetNewPasswordInput!): Boolean!
    resendOtp(input: ResendOtpInput!): Boolean!
    deleteAccount: Boolean!
  }
`;