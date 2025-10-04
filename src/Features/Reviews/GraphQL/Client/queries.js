"use strict";
// GraphQL Queries for Reviews System (Apollo Client Free Version)
// Optimized for polling instead of subscriptions
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALL_REVIEW_QUERIES = exports.SEARCH_REVIEWS = exports.GET_REVIEW_COMPARISON = exports.GET_REVIEW_ANALYTICS = exports.POLL_ADMIN_REVIEWS = exports.POLL_REVIEW_RESPONSES = exports.POLL_VENDOR_REVIEWS = exports.GET_TOP_RATED_REVIEWS = exports.GET_RECENT_REVIEWS = exports.GET_VERIFIED_REVIEWS = exports.GET_SERVICE_REVIEWS = exports.GET_FLAGGED_REVIEWS = exports.GET_PENDING_REVIEWS = exports.GET_ALL_REVIEWS = exports.GET_REVIEW_RESPONSE = exports.GET_SERVICE_REVIEW_STATS = exports.GET_VENDOR_REVIEW_STATS = exports.GET_MY_REVIEWS = exports.GET_USER_REVIEWS = exports.GET_VENDOR_REVIEWS = exports.GET_REVIEW = exports.GET_REVIEWS = void 0;
const client_1 = require("@apollo/client");
const fragments_1 = require("./fragments");
// ==================== BASIC REVIEW QUERIES ====================
/**
 * Get reviews with filters and pagination
 */
exports.GET_REVIEWS = (0, client_1.gql) `
  query GetReviews($filters: ReviewFilters, $pagination: PaginationInput) {
    getReviews(filters: $filters, pagination: $pagination) {
      ...PaginatedReviews
    }
  }
  ${fragments_1.PAGINATED_REVIEWS_FRAGMENT}
`;
/**
 * Get a single review by ID
 */
exports.GET_REVIEW = (0, client_1.gql) `
  query GetReview($id: ID!) {
    getReview(id: $id) {
      ...ReviewComplete
    }
  }
  ${fragments_1.REVIEW_COMPLETE_FRAGMENT}
`;
/**
 * Get vendor reviews with pagination
 */
exports.GET_VENDOR_REVIEWS = (0, client_1.gql) `
  query GetVendorReviews($vendorId: ID!, $pagination: PaginationInput) {
    getVendorReviews(vendorId: $vendorId, pagination: $pagination) {
      reviews {
        ...ReviewWithUser
      }
      pagination {
        page
        limit
        total
        totalPages
        hasNextPage
        hasPrevPage
      }
    }
  }
  ${fragments_1.REVIEW_WITH_USER_FRAGMENT}
`;
/**
 * Get user reviews with pagination
 */
exports.GET_USER_REVIEWS = (0, client_1.gql) `
  query GetUserReviews($userId: ID!, $pagination: PaginationInput) {
    getUserReviews(userId: $userId, pagination: $pagination) {
      reviews {
        ...ReviewWithVendor
      }
      pagination {
        page
        limit
        total
        totalPages
        hasNextPage
        hasPrevPage
      }
    }
  }
  ${fragments_1.REVIEW_WITH_VENDOR_FRAGMENT}
`;
/**
 * Get current user's reviews (for authenticated users)
 */
exports.GET_MY_REVIEWS = (0, client_1.gql) `
  query GetMyReviews($pagination: PaginationInput) {
    getUserReviews(pagination: $pagination) {
      reviews {
        ...ReviewWithVendor
      }
      pagination {
        page
        limit
        total
        totalPages
        hasNextPage
        hasPrevPage
      }
    }
  }
  ${fragments_1.REVIEW_WITH_VENDOR_FRAGMENT}
`;
// ==================== STATISTICS QUERIES ====================
/**
 * Get vendor review statistics
 */
exports.GET_VENDOR_REVIEW_STATS = (0, client_1.gql) `
  query GetVendorReviewStats($vendorId: ID!) {
    getVendorReviewStats(vendorId: $vendorId) {
      ...VendorReviewStats
    }
  }
  ${fragments_1.VENDOR_REVIEW_STATS_FRAGMENT}
`;
/**
 * Get service review statistics
 */
exports.GET_SERVICE_REVIEW_STATS = (0, client_1.gql) `
  query GetServiceReviewStats($serviceId: ID!, $serviceType: String!) {
    getServiceReviewStats(serviceId: $serviceId, serviceType: $serviceType) {
      ...ServiceReviewStats
    }
  }
  ${fragments_1.SERVICE_REVIEW_STATS_FRAGMENT}
`;
/**
 * Get review response for a specific review
 */
exports.GET_REVIEW_RESPONSE = (0, client_1.gql) `
  query GetReviewResponse($reviewId: ID!) {
    getReviewResponse(reviewId: $reviewId) {
      ...ReviewResponseComplete
    }
  }
  ${fragments_1.REVIEW_RESPONSE_COMPLETE_FRAGMENT}
`;
// ==================== ADMIN QUERIES ====================
/**
 * Get all reviews (Admin only)
 */
exports.GET_ALL_REVIEWS = (0, client_1.gql) `
  query GetAllReviews($filters: ReviewFilters, $pagination: PaginationInput) {
    getAllReviews(filters: $filters, pagination: $pagination) {
      reviews {
        ...AdminReview
      }
      pagination {
        page
        limit
        total
        totalPages
        hasNextPage
        hasPrevPage
      }
      filters {
        rating
        serviceType
        isVerified
        isPublished
        dateFrom
        dateTo
        vendorId
        userId
        moderationStatus
      }
    }
  }
  ${fragments_1.ADMIN_REVIEW_FRAGMENT}
`;
/**
 * Get pending reviews for moderation (Admin only)
 */
exports.GET_PENDING_REVIEWS = (0, client_1.gql) `
  query GetPendingReviews($pagination: PaginationInput) {
    getAllReviews(
      filters: { isPublished: false, moderationStatus: "PENDING" }
      pagination: $pagination
    ) {
      reviews {
        ...AdminReview
      }
      pagination {
        page
        limit
        total
        totalPages
        hasNextPage
        hasPrevPage
      }
    }
  }
  ${fragments_1.ADMIN_REVIEW_FRAGMENT}
`;
/**
 * Get flagged reviews (Admin only)
 */
exports.GET_FLAGGED_REVIEWS = (0, client_1.gql) `
  query GetFlaggedReviews($pagination: PaginationInput) {
    getAllReviews(
      filters: { moderationStatus: "FLAGGED" }
      pagination: $pagination
    ) {
      reviews {
        ...AdminReview
      }
      pagination {
        page
        limit
        total
        totalPages
        hasNextPage
        hasPrevPage
      }
    }
  }
  ${fragments_1.ADMIN_REVIEW_FRAGMENT}
`;
// ==================== SPECIALIZED QUERIES ====================
/**
 * Get reviews for a specific service
 */
exports.GET_SERVICE_REVIEWS = (0, client_1.gql) `
  query GetServiceReviews(
    $serviceId: ID!
    $serviceType: String!
    $pagination: PaginationInput
  ) {
    getReviews(
      filters: { serviceId: $serviceId, serviceType: $serviceType, isPublished: true }
      pagination: $pagination
    ) {
      reviews {
        ...ReviewComplete
      }
      pagination {
        page
        limit
        total
        totalPages
        hasNextPage
        hasPrevPage
      }
    }
  }
  ${fragments_1.REVIEW_COMPLETE_FRAGMENT}
`;
/**
 * Get verified reviews only
 */
exports.GET_VERIFIED_REVIEWS = (0, client_1.gql) `
  query GetVerifiedReviews($vendorId: ID, $pagination: PaginationInput) {
    getReviews(
      filters: { vendorId: $vendorId, isVerified: true, isPublished: true }
      pagination: $pagination
    ) {
      reviews {
        ...ReviewComplete
      }
      pagination {
        page
        limit
        total
        totalPages
        hasNextPage
        hasPrevPage
      }
    }
  }
  ${fragments_1.REVIEW_COMPLETE_FRAGMENT}
`;
/**
 * Get recent reviews
 */
exports.GET_RECENT_REVIEWS = (0, client_1.gql) `
  query GetRecentReviews($limit: Int = 10, $vendorId: ID) {
    getReviews(
      filters: { vendorId: $vendorId, isPublished: true }
      pagination: { page: 1, limit: $limit }
    ) {
      reviews {
        ...ReviewSummary
      }
    }
  }
  ${fragments_1.REVIEW_SUMMARY_FRAGMENT}
`;
/**
 * Get top-rated reviews
 */
exports.GET_TOP_RATED_REVIEWS = (0, client_1.gql) `
  query GetTopRatedReviews($vendorId: ID, $minRating: Int = 4, $pagination: PaginationInput) {
    getReviews(
      filters: { 
        vendorId: $vendorId, 
        rating: $minRating, 
        isVerified: true, 
        isPublished: true 
      }
      pagination: $pagination
    ) {
      reviews {
        ...ReviewComplete
      }
      pagination {
        page
        limit
        total
        totalPages
        hasNextPage
        hasPrevPage
      }
    }
  }
  ${fragments_1.REVIEW_COMPLETE_FRAGMENT}
`;
// ==================== REAL-TIME POLLING QUERIES ====================
/**
 * Poll vendor reviews for real-time updates
 */
exports.POLL_VENDOR_REVIEWS = (0, client_1.gql) `
  query PollVendorReviews($vendorId: ID!, $lastUpdated: DateTime) {
    getVendorReviews(
      vendorId: $vendorId
      pagination: { page: 1, limit: 5 }
    ) {
      reviews {
        id
        rating
        comment
        isVerified
        isPublished
        createdAt
        updatedAt
        user {
          id
          firstName
          lastName
        }
      }
    }
  }
`;
/**
 * Poll review responses for real-time updates
 */
exports.POLL_REVIEW_RESPONSES = (0, client_1.gql) `
  query PollReviewResponses($reviewIds: [ID!]!) {
    getReviews(filters: { ids: $reviewIds }) {
      reviews {
        id
        response {
          id
          responseText
          createdAt
          updatedAt
        }
      }
    }
  }
`;
/**
 * Poll admin reviews for moderation
 */
exports.POLL_ADMIN_REVIEWS = (0, client_1.gql) `
  query PollAdminReviews($lastChecked: DateTime) {
    getAllReviews(
      filters: { moderationStatus: "PENDING", updatedAfter: $lastChecked }
      pagination: { page: 1, limit: 10 }
    ) {
      reviews {
        id
        rating
        comment
        isVerified
        isPublished
        moderationStatus
        createdAt
        updatedAt
        user {
          id
          firstName
          lastName
        }
        vendor {
          id
          vendorName
        }
      }
    }
  }
`;
// ==================== AGGREGATION QUERIES ====================
/**
 * Get review analytics dashboard data
 */
exports.GET_REVIEW_ANALYTICS = (0, client_1.gql) `
  query GetReviewAnalytics($vendorId: ID, $dateFrom: DateTime, $dateTo: DateTime) {
    getVendorReviewStats(vendorId: $vendorId) {
      totalReviews
      averageRating
      ratingDistribution {
        rating
        count
        percentage
      }
      responseRate
      averageResponseTime
    }
    
    getReviews(
      filters: { 
        vendorId: $vendorId, 
        dateFrom: $dateFrom, 
        dateTo: $dateTo 
      }
      pagination: { page: 1, limit: 1 }
    ) {
      pagination {
        total
      }
    }
  }
`;
/**
 * Get review comparison data
 */
exports.GET_REVIEW_COMPARISON = (0, client_1.gql) `
  query GetReviewComparison($vendorIds: [ID!]!) {
    comparisons: getVendorReviewStats(vendorIds: $vendorIds) {
      vendorId
      totalReviews
      averageRating
      ratingDistribution {
        rating
        count
        percentage
      }
      responseRate
    }
  }
`;
// ==================== SEARCH QUERIES ====================
/**
 * Search reviews by content
 */
exports.SEARCH_REVIEWS = (0, client_1.gql) `
  query SearchReviews(
    $searchTerm: String!
    $filters: ReviewFilters
    $pagination: PaginationInput
  ) {
    getReviews(
      filters: { 
        ...filters, 
        searchTerm: $searchTerm,
        isPublished: true 
      }
      pagination: $pagination
    ) {
      reviews {
        ...ReviewComplete
      }
      pagination {
        page
        limit
        total
        totalPages
        hasNextPage
        hasPrevPage
      }
    }
  }
  ${fragments_1.REVIEW_COMPLETE_FRAGMENT}
`;
// ==================== EXPORT ALL QUERIES ====================
exports.ALL_REVIEW_QUERIES = {
    // Basic queries
    GET_REVIEWS: exports.GET_REVIEWS,
    GET_REVIEW: exports.GET_REVIEW,
    GET_VENDOR_REVIEWS: exports.GET_VENDOR_REVIEWS,
    GET_USER_REVIEWS: exports.GET_USER_REVIEWS,
    GET_MY_REVIEWS: exports.GET_MY_REVIEWS,
    // Statistics queries
    GET_VENDOR_REVIEW_STATS: exports.GET_VENDOR_REVIEW_STATS,
    GET_SERVICE_REVIEW_STATS: exports.GET_SERVICE_REVIEW_STATS,
    GET_REVIEW_RESPONSE: exports.GET_REVIEW_RESPONSE,
    // Admin queries
    GET_ALL_REVIEWS: exports.GET_ALL_REVIEWS,
    GET_PENDING_REVIEWS: exports.GET_PENDING_REVIEWS,
    GET_FLAGGED_REVIEWS: exports.GET_FLAGGED_REVIEWS,
    // Specialized queries
    GET_SERVICE_REVIEWS: exports.GET_SERVICE_REVIEWS,
    GET_VERIFIED_REVIEWS: exports.GET_VERIFIED_REVIEWS,
    GET_RECENT_REVIEWS: exports.GET_RECENT_REVIEWS,
    GET_TOP_RATED_REVIEWS: exports.GET_TOP_RATED_REVIEWS,
    // Real-time polling
    POLL_VENDOR_REVIEWS: exports.POLL_VENDOR_REVIEWS,
    POLL_REVIEW_RESPONSES: exports.POLL_REVIEW_RESPONSES,
    POLL_ADMIN_REVIEWS: exports.POLL_ADMIN_REVIEWS,
    // Analytics and aggregation
    GET_REVIEW_ANALYTICS: exports.GET_REVIEW_ANALYTICS,
    GET_REVIEW_COMPARISON: exports.GET_REVIEW_COMPARISON,
    // Search
    SEARCH_REVIEWS: exports.SEARCH_REVIEWS
};
