"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.additionalTypeDefs = exports.reviewTypeDefs = void 0;
const apollo_server_express_1 = require("apollo-server-express");
exports.reviewTypeDefs = (0, apollo_server_express_1.gql) `
  enum ServiceType {
    FarmHouse
    Venue
    CateringPackage
    PhotographyPackage
  }

  enum SortOrder {
    asc
    desc
  }

  enum ReviewSortBy {
    createdAt
    rating
    updatedAt
  }

  type Review {
    id: ID!
    userId: ID!
    user: User
    vendorId: ID!
    vendor: Vendor
    serviceType: ServiceType!
    serviceId: ID!
    bookingId: ID
    rating: Int!
    reviewText: String
    images: [String!]
    isPublished: Boolean!
    isVerified: Boolean!
    createdAt: String!
    updatedAt: String!
    response: ReviewResponse
  }

  type ReviewResponse {
    id: ID!
    reviewId: ID!
    review: Review!
    vendorId: ID!
    vendor: Vendor!
    responseText: String!
    createdAt: String!
    updatedAt: String!
  }

  type ReviewStats {
    totalReviews: Int!
    averageRating: Float!
    ratingDistribution: [RatingDistribution!]!
  }

  type RatingDistribution {
    rating: Int!
    count: Int!
  }

  type ReviewConnection {
    reviews: [Review!]!
    totalCount: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    currentPage: Int!
    totalPages: Int!
  }

  input CreateReviewInput {
    vendorId: ID!
    serviceType: ServiceType!
    serviceId: ID!
    bookingId: ID
    rating: Int!
    reviewText: String
    images: [String!]
  }

  input UpdateReviewInput {
    id: ID!
    rating: Int
    reviewText: String
    images: [String!]
  }

  input CreateReviewResponseInput {
    reviewId: ID!
    responseText: String!
  }

  input UpdateReviewResponseInput {
    id: ID!
    responseText: String!
  }

  input ReviewFilters {
    vendorId: ID
    serviceType: ServiceType
    serviceId: ID
    rating: Int
    isPublished: Boolean
    isVerified: Boolean
    userId: ID
  }

  input PaginationInput {
    page: Int = 1
    limit: Int = 10
    sortBy: ReviewSortBy = createdAt
    sortOrder: SortOrder = desc
  }

  type Query {
    # Get reviews with filters and pagination
    getReviews(filters: ReviewFilters, pagination: PaginationInput): ReviewConnection!
    
    # Get a single review by ID
    getReview(id: ID!): Review
    
    # Get reviews for a specific vendor
    getVendorReviews(vendorId: ID!, pagination: PaginationInput): ReviewConnection!
    
    # Get reviews by a specific user
    getUserReviews(userId: ID!, pagination: PaginationInput): ReviewConnection!
    
    # Get review stats for a vendor
    getVendorReviewStats(vendorId: ID!): ReviewStats!
    
    # Get review stats for a specific service
    getServiceReviewStats(serviceId: ID!, serviceType: ServiceType!): ReviewStats!
    
    # Get review response by review ID
    getReviewResponse(reviewId: ID!): ReviewResponse
    
    # Admin: Get all reviews (including unpublished)
    getAllReviews(filters: ReviewFilters, pagination: PaginationInput): ReviewConnection!
  }

  type Mutation {
    # User mutations
    createReview(input: CreateReviewInput!): Review!
    updateReview(input: UpdateReviewInput!): Review!
    deleteReview(id: ID!): Boolean!
    
    # Vendor mutations
    createReviewResponse(input: CreateReviewResponseInput!): ReviewResponse!
    updateReviewResponse(input: UpdateReviewResponseInput!): ReviewResponse!
    deleteReviewResponse(id: ID!): Boolean!
    
    # Admin mutations
    verifyReview(id: ID!): Review!
    unverifyReview(id: ID!): Review!
    publishReview(id: ID!): Review!
    unpublishReview(id: ID!): Review!
    deleteReviewAdmin(id: ID!): Boolean!
    deleteReviewResponseAdmin(id: ID!): Boolean!
  }
`;
// Additional type definitions for User and Vendor (if not already defined)
exports.additionalTypeDefs = (0, apollo_server_express_1.gql) `
  type User {
    id: ID!
    email: String!
    firstName: String
    lastName: String
  }

  type Vendor {
    id: ID!
    email: String!
    businessName: String
    businessType: String
  }
`;
