"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CateringPackageTypeDefs = void 0;
const graphql_tag_1 = __importDefault(require("graphql-tag"));
exports.CateringPackageTypeDefs = (0, graphql_tag_1.default) `
  type CateringPackage {
    id: ID!
    vendorId: ID!
    packageName: String!
    serviceArea: [String!]!
    description: String!
    imageUrl: [String!]!
    price: Float!
    minGuests: Int!
    maxGuests: Int!
    menuItems: [String]
    dietaryOptions: [String]
    amenities: [String!]!
    isAvailable: Boolean!
    rating: Float
    reviewCount: Int!
    createdAt: String!
    updatedAt: String!
  }

  type SearchResult {
    packages: [CateringPackage!]!
    totalCount: Int!
    page: Int!
    limit: Int!
    totalPages: Int!
  }

  input CateringPackageInput {
    packageName: String!
    serviceArea: [String!]!
    description: String!
    imageUrl: [String!]!
    price: Float!
    minGuests: Int!
    maxGuests: Int!
    menuItems: [String]
    dietaryOptions: [String]
    amenities: [String!]!
  }

  input CateringPackageUpdateInput {
    packageName: String
    serviceArea: [String]
    description: String
    imageUrl: [String]
    price: Float
    minGuests: Int
    maxGuests: Int
    menuItems: [String]
    dietaryOptions: [String]
    amenities: [String]
  }

  input SearchCateringPackagesInput {
    packageName: String
    amenities: [String]
    serviceArea: [String]
    menuItems: [String]
  }

  input AdminCateringPackageFilters {
    vendorId: ID
    packageName: String
    isAvailable: Boolean
    minPrice: Float
    maxPrice: Float
    minGuests: Int
    maxGuests: Int
    serviceArea: [String]
    amenities: [String]
    dietaryOptions: [String]
    page: Int
    limit: Int
    sortBy: String
  }

  type CateringPackageListResponse {
    packages: [CateringPackage!]!
    total: Int!
    page: Int!
    totalPages: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }

  type Query {
    cateringPackage(id: ID!): CateringPackage
    vendorCateringPackages: [CateringPackage!]!
    searchCateringPackages(
      input: SearchCateringPackagesInput!, 
      page: Int = 1, 
      limit: Int = 10
    ): SearchResult!
    
    # Admin queries
    adminGetAllCateringPackages(filters: AdminCateringPackageFilters): CateringPackageListResponse!
    adminGetCateringPackage(id: ID!): CateringPackage
  }

  type Mutation {
    createCateringPackage(input: CateringPackageInput!): CateringPackage!
    updateCateringPackage(id: ID!, input: CateringPackageUpdateInput!): CateringPackage!
    deleteCateringPackage(id: ID!): Boolean!
    toggleCateringPackageAvailability(id: ID!): CateringPackage!
    
    # Admin mutations
    adminUpdateCateringPackageAvailability(id: ID!, isAvailable: Boolean!): CateringPackage!
    adminDeleteCateringPackage(id: ID!): Boolean!
  }
`;
