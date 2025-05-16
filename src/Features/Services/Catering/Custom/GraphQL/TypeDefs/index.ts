import { gql } from 'apollo-server-core';

export const customCateringTypeDefs = gql`
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
    startDate: String
    endDate: String
  }

  # Query type for fetching custom packages
  type Query {
    # User can fetch their custom packages
    getUserCustomPackages: [CustomCateringPackage!]!
    
    # Vendor can fetch all custom packages
    getVendorCustomPackages: [CustomCateringPackage!]!
    
    # Search custom packages for vendors
    searchCustomPackages(filters: CustomPackageSearchFilters): [CustomCateringPackage!]!
    
    # Get a single custom package by ID
    getCustomPackageById(packageId: ID!): CustomCateringPackage
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