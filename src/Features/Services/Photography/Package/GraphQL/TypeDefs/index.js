"use strict";
// src/Features/Photography/TypeDefs.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.photographyTypeDefs = void 0;
const apollo_server_express_1 = require("apollo-server-express");
exports.photographyTypeDefs = (0, apollo_server_express_1.gql) `
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

  # Admin-specific types
  input AdminPackageFilters {
    vendorId: ID
    packageName: String
    serviceArea: [String!]
    amenities: [String!]
    isAvailable: Boolean
    minPrice: Float
    maxPrice: Float
    minDuration: Int
    maxDuration: Int
    minPhotographerCount: Int
    maxPhotographerCount: Int
    searchTerm: String
    page: Int
    limit: Int
    sortBy: String
  }

  type PackageListResponse {
    packages: [PhotographyPackageWithVendor!]!
    total: Int!
    page: Int!
    totalPages: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }

  type PhotographyPackageWithVendor {
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
    vendor: VendorInfo
  }

  type VendorInfo {
    id: ID!
    vendorName: String!
    vendorEmail: String!
    vendorPhone: String
    vendorAddress: String
  }

  type PackageStatsResponse {
    totalPackages: Int!
    availablePackages: Int!
    unavailablePackages: Int!
    averagePrice: Float!
    averageRating: Float!
    totalVendors: Int!
  }

  extend type Query {
    photographPackage(id: ID!): PhotographyPackage!
    vendorPhotographPackages: [PhotographyPackage!]!
    searchPhotographPackages(input: SearchPhotographyPackagesInput!): [PhotographyPackage!]!
    
    # Admin queries
    adminGetAllPackages(filters: AdminPackageFilters): PackageListResponse!
    adminGetPackage(id: ID!): PhotographyPackageWithVendor!
    adminGetPackageStatistics: PackageStatsResponse!
    adminGetRecentPackages(limit: Int): [PhotographyPackageWithVendor!]!
    adminGetPackagesByAvailability(isAvailable: Boolean!): [PhotographyPackageWithVendor!]!
    adminGetHighValuePackages(minPrice: Float!): [PhotographyPackageWithVendor!]!
    adminGetPackagesByVendor(vendorId: ID!): [PhotographyPackageWithVendor!]!
  }

  extend type Mutation {
    createPhotographPackage(input: CreatePhotographyPackageInput!): PhotographyPackage!
    updatePhotographPackage(id: ID!, input: UpdatePhotographyPackageInput!): PhotographyPackage!
    deletePhotographPackage(id: ID!): DeleteResponse!
    togglePhotographPackageAvailability(id: ID!): PhotographyPackage!
    
    # Admin mutations
    adminUpdatePackageStatus(id: ID!, isAvailable: Boolean!): PhotographyPackage!
    adminDeletePackage(id: ID!): DeleteResponse!
  }
`;
