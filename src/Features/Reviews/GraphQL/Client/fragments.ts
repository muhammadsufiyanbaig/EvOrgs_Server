// GraphQL Fragments for Reviews System
// Reusable fragments for consistent data fetching across queries and mutations

import { gql } from '@apollo/client';

// ==================== CORE FRAGMENTS ====================

/**
 * Basic review information
 */
export const REVIEW_BASIC_FRAGMENT = gql`
  fragment ReviewBasic on Review {
    id
    rating
    comment
    serviceType
    serviceId
    isVerified
    isPublished
    createdAt
    updatedAt
  }
`;

/**
 * Complete review information with user and vendor details
 */
export const REVIEW_COMPLETE_FRAGMENT = gql`
  fragment ReviewComplete on Review {
    ...ReviewBasic
    user {
      id
      firstName
      lastName
      profileImage
    }
    vendor {
      id
      vendorName
      logo
      businessType
    }
    response {
      id
      responseText
      createdAt
      updatedAt
    }
  }
  ${REVIEW_BASIC_FRAGMENT}
`;

/**
 * Review with detailed user information
 */
export const REVIEW_WITH_USER_FRAGMENT = gql`
  fragment ReviewWithUser on Review {
    ...ReviewBasic
    user {
      id
      firstName
      lastName
      profileImage
      email
      phone
      isActive
    }
  }
  ${REVIEW_BASIC_FRAGMENT}
`;

/**
 * Review with detailed vendor information
 */
export const REVIEW_WITH_VENDOR_FRAGMENT = gql`
  fragment ReviewWithVendor on Review {
    ...ReviewBasic
    vendor {
      id
      vendorName
      logo
      businessType
      email
      phone
      address
      city
      state
      country
      isActive
      isVerified
    }
  }
  ${REVIEW_BASIC_FRAGMENT}
`;

/**
 * Review response fragment
 */
export const REVIEW_RESPONSE_FRAGMENT = gql`
  fragment ReviewResponse on ReviewResponse {
    id
    responseText
    reviewId
    vendorId
    createdAt
    updatedAt
  }
`;

/**
 * Complete review response with vendor details
 */
export const REVIEW_RESPONSE_COMPLETE_FRAGMENT = gql`
  fragment ReviewResponseComplete on ReviewResponse {
    ...ReviewResponse
    vendor {
      id
      vendorName
      logo
      businessType
    }
    review {
      id
      rating
      comment
      serviceType
      serviceId
    }
  }
  ${REVIEW_RESPONSE_FRAGMENT}
`;

/**
 * Review statistics fragment
 */
export const REVIEW_STATS_FRAGMENT = gql`
  fragment ReviewStats on ReviewStats {
    totalReviews
    averageRating
    ratingDistribution {
      rating
      count
      percentage
    }
    verifiedReviews
    publishedReviews
    responseRate
    averageResponseTime
  }
`;

/**
 * Vendor review statistics fragment
 */
export const VENDOR_REVIEW_STATS_FRAGMENT = gql`
  fragment VendorReviewStats on VendorReviewStats {
    vendorId
    totalReviews
    averageRating
    ratingDistribution {
      rating
      count
      percentage
    }
    verifiedReviews
    publishedReviews
    responseRate
    averageResponseTime
    recentReviews {
      ...ReviewBasic
    }
    topRatedServices {
      serviceType
      serviceId
      averageRating
      totalReviews
    }
  }
  ${REVIEW_BASIC_FRAGMENT}
`;

/**
 * Service review statistics fragment
 */
export const SERVICE_REVIEW_STATS_FRAGMENT = gql`
  fragment ServiceReviewStats on ServiceReviewStats {
    serviceId
    serviceType
    totalReviews
    averageRating
    ratingDistribution {
      rating
      count
      percentage
    }
    verifiedReviews
    publishedReviews
    recentReviews {
      ...ReviewComplete
    }
  }
  ${REVIEW_COMPLETE_FRAGMENT}
`;

/**
 * Paginated reviews fragment
 */
export const PAGINATED_REVIEWS_FRAGMENT = gql`
  fragment PaginatedReviews on PaginatedReviews {
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
    filters {
      rating
      serviceType
      isVerified
      isPublished
      dateFrom
      dateTo
      vendorId
      userId
    }
  }
  ${REVIEW_COMPLETE_FRAGMENT}
`;

// ==================== ADMIN FRAGMENTS ====================

/**
 * Admin review with extended information
 */
export const ADMIN_REVIEW_FRAGMENT = gql`
  fragment AdminReview on Review {
    ...ReviewComplete
    moderationStatus
    moderationNotes
    moderatedBy
    moderatedAt
    flaggedCount
    reportedCount
    lastModified
    ipAddress
    userAgent
  }
  ${REVIEW_COMPLETE_FRAGMENT}
`;

/**
 * Review audit log fragment
 */
export const REVIEW_AUDIT_FRAGMENT = gql`
  fragment ReviewAudit on ReviewAudit {
    id
    reviewId
    action
    previousValue
    newValue
    performedBy
    performedAt
    reason
    ipAddress
  }
`;

// ==================== FORM FRAGMENTS ====================

/**
 * Review form data fragment
 */
export const REVIEW_FORM_FRAGMENT = gql`
  fragment ReviewForm on Review {
    id
    rating
    comment
    serviceType
    serviceId
    attachments
  }
`;

/**
 * Review response form data fragment
 */
export const REVIEW_RESPONSE_FORM_FRAGMENT = gql`
  fragment ReviewResponseForm on ReviewResponse {
    id
    responseText
    reviewId
    attachments
  }
`;

// ==================== SUMMARY FRAGMENTS ====================

/**
 * Review summary for lists
 */
export const REVIEW_SUMMARY_FRAGMENT = gql`
  fragment ReviewSummary on Review {
    id
    rating
    comment
    serviceType
    isVerified
    isPublished
    createdAt
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
`;

/**
 * Review metrics fragment
 */
export const REVIEW_METRICS_FRAGMENT = gql`
  fragment ReviewMetrics on ReviewMetrics {
    totalReviews
    totalRating
    averageRating
    fiveStarCount
    fourStarCount
    threeStarCount
    twoStarCount
    oneStarCount
    verifiedPercentage
    responsePercentage
  }
`;

// ==================== EXPORT ALL FRAGMENTS ====================

export const ALL_REVIEW_FRAGMENTS = {
  REVIEW_BASIC_FRAGMENT,
  REVIEW_COMPLETE_FRAGMENT,
  REVIEW_WITH_USER_FRAGMENT,
  REVIEW_WITH_VENDOR_FRAGMENT,
  REVIEW_RESPONSE_FRAGMENT,
  REVIEW_RESPONSE_COMPLETE_FRAGMENT,
  REVIEW_STATS_FRAGMENT,
  VENDOR_REVIEW_STATS_FRAGMENT,
  SERVICE_REVIEW_STATS_FRAGMENT,
  PAGINATED_REVIEWS_FRAGMENT,
  ADMIN_REVIEW_FRAGMENT,
  REVIEW_AUDIT_FRAGMENT,
  REVIEW_FORM_FRAGMENT,
  REVIEW_RESPONSE_FORM_FRAGMENT,
  REVIEW_SUMMARY_FRAGMENT,
  REVIEW_METRICS_FRAGMENT
};
