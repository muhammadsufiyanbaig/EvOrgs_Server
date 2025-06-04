import { gql } from 'apollo-server-express';

export const settingsTypeDefs = gql`
  type UserPreference {
    id: ID!
    userId: ID!
    pushNotifications: Boolean!
    emailNotifications: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type VendorPreference {
    id: ID!
    vendorId: ID!
    pushNotifications: Boolean!
    emailNotifications: Boolean!
    visibleInSearch: Boolean!
    visibleReviews: Boolean!
    workingHoursStart: String
    workingHoursEnd: String
    workingDays: [String!]
    createdAt: String!
    updatedAt: String!
  }

  input UserPreferenceInput {
    pushNotifications: Boolean
    emailNotifications: Boolean
  }

  input VendorPreferenceInput {
    pushNotifications: Boolean
    emailNotifications: Boolean
    visibleInSearch: Boolean
    visibleReviews: Boolean
    workingHoursStart: String
    workingHoursEnd: String
    workingDays: [String!]
  }

  type Query {
    getUserPreferences: UserPreference
    getVendorPreferences: VendorPreference
  }

  type Mutation {
    updateUserPreferences(input: UserPreferenceInput!): UserPreference!
    updateVendorPreferences(input: VendorPreferenceInput!): VendorPreference!
    resetUserPreferences: UserPreference!
    resetVendorPreferences: VendorPreference!
  }
`;
