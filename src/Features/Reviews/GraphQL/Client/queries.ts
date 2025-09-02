// GraphQL Queries for Reviews System (Apollo Client Free Version)
// Optimized for polling instead of subscriptions

import { gql } from '@apollo/client';
import {
  REVIEW_COMPLETE_FRAGMENT,
  REVIEW_WITH_USER_FRAGMENT,
  REVIEW_WITH_VENDOR_FRAGMENT,
  REVIEW_RESPONSE_COMPLETE_FRAGMENT,
  VENDOR_REVIEW_STATS_FRAGMENT,
  SERVICE_REVIEW_STATS_FRAGMENT,
  PAGINATED_REVIEWS_FRAGMENT,
  ADMIN_REVIEW_FRAGMENT,
  REVIEW_SUMMARY_FRAGMENT
} from './fragments';

// ==================== BASIC REVIEW QUERIES ====================

/**
 * Get reviews with filters and pagination
 */
export const GET_REVIEWS = gql`
  query GetReviews($filters: ReviewFilters, $pagination: PaginationInput) {
    getReviews(filters: $filters, pagination: $pagination) {
      ...PaginatedReviews
    }
  }
  ${PAGINATED_REVIEWS_FRAGMENT}
`;

/**
 * Get a single review by ID
 */
export const GET_REVIEW = gql`
  query GetReview($id: ID!) {
    getReview(id: $id) {
      ...ReviewComplete
    }
  }
  ${REVIEW_COMPLETE_FRAGMENT}
`;

/**
 * Get vendor reviews with pagination
 */
export const GET_VENDOR_REVIEWS = gql`
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
  ${REVIEW_WITH_USER_FRAGMENT}
`;

/**
 * Get user reviews with pagination
 */
export const GET_USER_REVIEWS = gql`
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
  ${REVIEW_WITH_VENDOR_FRAGMENT}
`;

/**
 * Get current user's reviews (for authenticated users)
 */
export const GET_MY_REVIEWS = gql`
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
  ${REVIEW_WITH_VENDOR_FRAGMENT}
`;

// ==================== STATISTICS QUERIES ====================

/**
 * Get vendor review statistics
 */
export const GET_VENDOR_REVIEW_STATS = gql`
  query GetVendorReviewStats($vendorId: ID!) {
    getVendorReviewStats(vendorId: $vendorId) {
      ...VendorReviewStats
    }
  }
  ${VENDOR_REVIEW_STATS_FRAGMENT}
`;

/**
 * Get service review statistics
 */
export const GET_SERVICE_REVIEW_STATS = gql`
  query GetServiceReviewStats($serviceId: ID!, $serviceType: String!) {
    getServiceReviewStats(serviceId: $serviceId, serviceType: $serviceType) {
      ...ServiceReviewStats
    }
  }
  ${SERVICE_REVIEW_STATS_FRAGMENT}
`;

/**
 * Get review response for a specific review
 */
export const GET_REVIEW_RESPONSE = gql`
  query GetReviewResponse($reviewId: ID!) {
    getReviewResponse(reviewId: $reviewId) {
      ...ReviewResponseComplete
    }
  }
  ${REVIEW_RESPONSE_COMPLETE_FRAGMENT}
`;

// ==================== ADMIN QUERIES ====================

/**
 * Get all reviews (Admin only)
 */
export const GET_ALL_REVIEWS = gql`
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
  ${ADMIN_REVIEW_FRAGMENT}
`;

/**
 * Get pending reviews for moderation (Admin only)
 */
export const GET_PENDING_REVIEWS = gql`
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
  ${ADMIN_REVIEW_FRAGMENT}
`;

/**
 * Get flagged reviews (Admin only)
 */
export const GET_FLAGGED_REVIEWS = gql`
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
  ${ADMIN_REVIEW_FRAGMENT}
`;

// ==================== SPECIALIZED QUERIES ====================

/**
 * Get reviews for a specific service
 */
export const GET_SERVICE_REVIEWS = gql`
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
  ${REVIEW_COMPLETE_FRAGMENT}
`;

/**
 * Get verified reviews only
 */
export const GET_VERIFIED_REVIEWS = gql`
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
  ${REVIEW_COMPLETE_FRAGMENT}
`;

/**
 * Get recent reviews
 */
export const GET_RECENT_REVIEWS = gql`
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
  ${REVIEW_SUMMARY_FRAGMENT}
`;

/**
 * Get top-rated reviews
 */
export const GET_TOP_RATED_REVIEWS = gql`
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
  ${REVIEW_COMPLETE_FRAGMENT}
`;

// ==================== REAL-TIME POLLING QUERIES ====================

/**
 * Poll vendor reviews for real-time updates
 */
export const POLL_VENDOR_REVIEWS = gql`
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
export const POLL_REVIEW_RESPONSES = gql`
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
export const POLL_ADMIN_REVIEWS = gql`
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
export const GET_REVIEW_ANALYTICS = gql`
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
export const GET_REVIEW_COMPARISON = gql`
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
export const SEARCH_REVIEWS = gql`
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
  ${REVIEW_COMPLETE_FRAGMENT}
`;

// ==================== EXPORT ALL QUERIES ====================

export const ALL_REVIEW_QUERIES = {
  // Basic queries
  GET_REVIEWS,
  GET_REVIEW,
  GET_VENDOR_REVIEWS,
  GET_USER_REVIEWS,
  GET_MY_REVIEWS,
  
  // Statistics queries
  GET_VENDOR_REVIEW_STATS,
  GET_SERVICE_REVIEW_STATS,
  GET_REVIEW_RESPONSE,
  
  // Admin queries
  GET_ALL_REVIEWS,
  GET_PENDING_REVIEWS,
  GET_FLAGGED_REVIEWS,
  
  // Specialized queries
  GET_SERVICE_REVIEWS,
  GET_VERIFIED_REVIEWS,
  GET_RECENT_REVIEWS,
  GET_TOP_RATED_REVIEWS,
  
  // Real-time polling
  POLL_VENDOR_REVIEWS,
  POLL_REVIEW_RESPONSES,
  POLL_ADMIN_REVIEWS,
  
  // Analytics and aggregation
  GET_REVIEW_ANALYTICS,
  GET_REVIEW_COMPARISON,
  
  // Search
  SEARCH_REVIEWS
};
