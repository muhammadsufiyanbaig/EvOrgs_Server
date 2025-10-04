"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customCateringTypeDefs = void 0;
const apollo_server_core_1 = require("apollo-server-core");
exports.customCateringTypeDefs = (0, apollo_server_core_1.gql) `
  # Enum for custom package status
  enum CustomPackageStatus {
    Requested
    Quoted
    Accepted
    Rejected
  }

  # Input type for creating a custom catering package
  input CreateCustomPackageInput {
    vendorId: ID!
    orderDetails: String!
    guestCount: Int!
    eventDate: String
  }

  # Input type for vendor to quote a package
  input QuoteCustomPackageInput {
    packageId: ID!
    price: Float!
  }

  # Input type for responding to a quote
  input RespondToQuoteInput {
    packageId: ID!
    response: CustomPackageStatus!
  }

  # Custom Catering Package Type
  type CustomCateringPackage {
    id: ID!
    vendorId: ID!
    userId: ID!
    orderDetails: String!
    guestCount: Int!
    eventDate: String
    price: Float
    status: CustomPackageStatus!
    createdAt: String!
    updatedAt: String!
  }

  # Search filters input type
  input CustomPackageSearchFilters {
    status: CustomPackageStatus
    minGuestCount: Int
    maxGuestCount: Int
    minPrice: Float
    maxPrice: Float
    startDate: String
    endDate: String
    searchTerm: String
    sortBy: String
    page: Int
    limit: Int
  }

  # Search response type with pagination
  type CustomPackageSearchResponse {
    packages: [CustomCateringPackage!]!
    total: Int!
    page: Int!
    totalPages: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }

  # Paginated response type for admin
  type PaginatedCustomPackages {
    packages: [CustomCateringPackage!]!
    totalCount: Int!
    page: Int!
    limit: Int!
    totalPages: Int!
  }

  # Admin filter input
  input AdminCustomPackageFilters {
    status: CustomPackageStatus
    vendorId: ID
    userId: ID
    minGuestCount: Int
    maxGuestCount: Int
    startDate: String
    endDate: String
    page: Int
    limit: Int
  }

  # Query type for fetching custom packages
  type Query {
    # User can fetch their custom packages
    getUserCustomPackages: [CustomCateringPackage!]!
    
    # Vendor can fetch all custom packages
    getVendorCustomPackages: [CustomCateringPackage!]!
    
    # Search custom packages for vendors with enhanced filters and pagination
    searchCustomPackages(filters: CustomPackageSearchFilters): CustomPackageSearchResponse!
    
    # Get a single custom package by ID
    getCustomPackageById(packageId: ID!): CustomCateringPackage

    # Admin can fetch all custom packages with pagination and filters
    adminGetAllCustomPackages(filters: AdminCustomPackageFilters): PaginatedCustomPackages!
  }

  # Mutation type for creating and managing custom packages
  type Mutation {
    # User creates a custom package request
    createCustomPackageRequest(input: CreateCustomPackageInput!): CustomCateringPackage!
    
    # Vendor quotes a custom package
    quoteCustomPackage(input: QuoteCustomPackageInput!): CustomCateringPackage!
    
    # User accepts or rejects a quoted package
    respondToCustomPackageQuote(input: RespondToQuoteInput!): CustomCateringPackage!
  }
`;
