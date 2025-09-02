"use strict";
// GraphQL Fragments for Reviews System
// Reusable fragments for consistent data fetching across queries and mutations
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALL_REVIEW_FRAGMENTS = exports.REVIEW_METRICS_FRAGMENT = exports.REVIEW_SUMMARY_FRAGMENT = exports.REVIEW_RESPONSE_FORM_FRAGMENT = exports.REVIEW_FORM_FRAGMENT = exports.REVIEW_AUDIT_FRAGMENT = exports.ADMIN_REVIEW_FRAGMENT = exports.PAGINATED_REVIEWS_FRAGMENT = exports.SERVICE_REVIEW_STATS_FRAGMENT = exports.VENDOR_REVIEW_STATS_FRAGMENT = exports.REVIEW_STATS_FRAGMENT = exports.REVIEW_RESPONSE_COMPLETE_FRAGMENT = exports.REVIEW_RESPONSE_FRAGMENT = exports.REVIEW_WITH_VENDOR_FRAGMENT = exports.REVIEW_WITH_USER_FRAGMENT = exports.REVIEW_COMPLETE_FRAGMENT = exports.REVIEW_BASIC_FRAGMENT = void 0;
const client_1 = require("@apollo/client");
// ==================== CORE FRAGMENTS ====================
/**
 * Basic review information
 */
exports.REVIEW_BASIC_FRAGMENT = (0, client_1.gql) `
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
exports.REVIEW_COMPLETE_FRAGMENT = (0, client_1.gql) `
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
  ${exports.REVIEW_BASIC_FRAGMENT}
`;
/**
 * Review with detailed user information
 */
exports.REVIEW_WITH_USER_FRAGMENT = (0, client_1.gql) `
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
  ${exports.REVIEW_BASIC_FRAGMENT}
`;
/**
 * Review with detailed vendor information
 */
exports.REVIEW_WITH_VENDOR_FRAGMENT = (0, client_1.gql) `
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
  ${exports.REVIEW_BASIC_FRAGMENT}
`;
/**
 * Review response fragment
 */
exports.REVIEW_RESPONSE_FRAGMENT = (0, client_1.gql) `
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
exports.REVIEW_RESPONSE_COMPLETE_FRAGMENT = (0, client_1.gql) `
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
  ${exports.REVIEW_RESPONSE_FRAGMENT}
`;
/**
 * Review statistics fragment
 */
exports.REVIEW_STATS_FRAGMENT = (0, client_1.gql) `
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
exports.VENDOR_REVIEW_STATS_FRAGMENT = (0, client_1.gql) `
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
  ${exports.REVIEW_BASIC_FRAGMENT}
`;
/**
 * Service review statistics fragment
 */
exports.SERVICE_REVIEW_STATS_FRAGMENT = (0, client_1.gql) `
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
  ${exports.REVIEW_COMPLETE_FRAGMENT}
`;
/**
 * Paginated reviews fragment
 */
exports.PAGINATED_REVIEWS_FRAGMENT = (0, client_1.gql) `
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
  ${exports.REVIEW_COMPLETE_FRAGMENT}
`;
// ==================== ADMIN FRAGMENTS ====================
/**
 * Admin review with extended information
 */
exports.ADMIN_REVIEW_FRAGMENT = (0, client_1.gql) `
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
  ${exports.REVIEW_COMPLETE_FRAGMENT}
`;
/**
 * Review audit log fragment
 */
exports.REVIEW_AUDIT_FRAGMENT = (0, client_1.gql) `
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
exports.REVIEW_FORM_FRAGMENT = (0, client_1.gql) `
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
exports.REVIEW_RESPONSE_FORM_FRAGMENT = (0, client_1.gql) `
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
exports.REVIEW_SUMMARY_FRAGMENT = (0, client_1.gql) `
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
exports.REVIEW_METRICS_FRAGMENT = (0, client_1.gql) `
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
exports.ALL_REVIEW_FRAGMENTS = {
    REVIEW_BASIC_FRAGMENT: exports.REVIEW_BASIC_FRAGMENT,
    REVIEW_COMPLETE_FRAGMENT: exports.REVIEW_COMPLETE_FRAGMENT,
    REVIEW_WITH_USER_FRAGMENT: exports.REVIEW_WITH_USER_FRAGMENT,
    REVIEW_WITH_VENDOR_FRAGMENT: exports.REVIEW_WITH_VENDOR_FRAGMENT,
    REVIEW_RESPONSE_FRAGMENT: exports.REVIEW_RESPONSE_FRAGMENT,
    REVIEW_RESPONSE_COMPLETE_FRAGMENT: exports.REVIEW_RESPONSE_COMPLETE_FRAGMENT,
    REVIEW_STATS_FRAGMENT: exports.REVIEW_STATS_FRAGMENT,
    VENDOR_REVIEW_STATS_FRAGMENT: exports.VENDOR_REVIEW_STATS_FRAGMENT,
    SERVICE_REVIEW_STATS_FRAGMENT: exports.SERVICE_REVIEW_STATS_FRAGMENT,
    PAGINATED_REVIEWS_FRAGMENT: exports.PAGINATED_REVIEWS_FRAGMENT,
    ADMIN_REVIEW_FRAGMENT: exports.ADMIN_REVIEW_FRAGMENT,
    REVIEW_AUDIT_FRAGMENT: exports.REVIEW_AUDIT_FRAGMENT,
    REVIEW_FORM_FRAGMENT: exports.REVIEW_FORM_FRAGMENT,
    REVIEW_RESPONSE_FORM_FRAGMENT: exports.REVIEW_RESPONSE_FORM_FRAGMENT,
    REVIEW_SUMMARY_FRAGMENT: exports.REVIEW_SUMMARY_FRAGMENT,
    REVIEW_METRICS_FRAGMENT: exports.REVIEW_METRICS_FRAGMENT
};
