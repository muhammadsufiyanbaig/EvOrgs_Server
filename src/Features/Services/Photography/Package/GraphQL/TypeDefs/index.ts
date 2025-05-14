// src/Features/Photography/TypeDefs.ts

import { gql } from 'apollo-server-express';

export const photographyTypeDefs = gql`
  type PhotographyPackage {
    id: ID!
    vendorId: ID!
    packageName: String!
    serviceArea: [String!]!
    description: String!
    imageUrl: [String!]!
    price: Float!
    duration: Int!
    photographerCount: Int!
    deliverables: [String!]
    amenities: [String!]!
    isAvailable: Boolean!
    rating: Float
    reviewCount: Int!
    createdAt: String!
    updatedAt: String!
  }

  input CreatePhotographyPackageInput {
    packageName: String!
    serviceArea: [String!]!
    description: String!
    imageUrl: [String!]!
    price: Float!
    duration: Int!
    photographerCount: Int
    deliverables: [String!]
    amenities: [String!]!
  }

  input UpdatePhotographyPackageInput {
    packageName: String
    serviceArea: [String!]
    description: String
    imageUrl: [String!]
    price: Float
    duration: Int
    photographerCount: Int
    deliverables: [String!]
    amenities: [String!]
  }

  input SearchPhotographyPackagesInput {
    packageName: String
    amenities: [String!]
    serviceArea: [String!]
    photographerCount: Int
  }

  type DeleteResponse {
    success: Boolean!
    message: String!
  }

  extend type Query {
    photographPackage(id: ID!): PhotographyPackage!
    vendorPhotographPackages: [PhotographyPackage!]!
    searchPhotographPackages(input: SearchPhotographyPackagesInput!): [PhotographyPackage!]!
  }

  extend type Mutation {
    createPhotographPackage(input: CreatePhotographyPackageInput!): PhotographyPackage!
    updatePhotographPackage(id: ID!, input: UpdatePhotographyPackageInput!): PhotographyPackage!
    deletePhotographPackage(id: ID!): DeleteResponse!
    togglePhotographPackageAvailability(id: ID!): PhotographyPackage!
  }
`;