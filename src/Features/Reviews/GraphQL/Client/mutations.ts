// GraphQL Mutations for Reviews System (Apollo Client Free Version)
// Comprehensive mutations for review management

import { gql } from '@apollo/client';
import {
  REVIEW_COMPLETE_FRAGMENT,
  REVIEW_RESPONSE_COMPLETE_FRAGMENT,
  REVIEW_BASIC_FRAGMENT,
  ADMIN_REVIEW_FRAGMENT
} from './fragments';

// ==================== REVIEW CRUD MUTATIONS ====================

/**
 * Create a new review
 */
export const CREATE_REVIEW = gql`
  mutation CreateReview($input: CreateReviewInput!) {
    createReview(input: $input) {
      ...ReviewComplete
    }
  }
  ${REVIEW_COMPLETE_FRAGMENT}
`;

/**
 * Update an existing review
 */
export const UPDATE_REVIEW = gql`
  mutation UpdateReview($input: UpdateReviewInput!) {
    updateReview(input: $input) {
      ...ReviewComplete
    }
  }
  ${REVIEW_COMPLETE_FRAGMENT}
`;

/**
 * Delete a review (user can delete their own review)
 */
export const DELETE_REVIEW = gql`
  mutation DeleteReview($id: ID!) {
    deleteReview(id: $id) {
      success
      message
      deletedReviewId: id
    }
  }
`;

// ==================== REVIEW RESPONSE MUTATIONS ====================

/**
 * Create a review response (vendor responding to review)
 */
export const CREATE_REVIEW_RESPONSE = gql`
  mutation CreateReviewResponse($input: CreateReviewResponseInput!) {
    createReviewResponse(input: $input) {
      ...ReviewResponseComplete
    }
  }
  ${REVIEW_RESPONSE_COMPLETE_FRAGMENT}
`;

/**
 * Update a review response
 */
export const UPDATE_REVIEW_RESPONSE = gql`
  mutation UpdateReviewResponse($input: UpdateReviewResponseInput!) {
    updateReviewResponse(input: $input) {
      ...ReviewResponseComplete
    }
  }
  ${REVIEW_RESPONSE_COMPLETE_FRAGMENT}
`;

/**
 * Delete a review response
 */
export const DELETE_REVIEW_RESPONSE = gql`
  mutation DeleteReviewResponse($id: ID!) {
    deleteReviewResponse(id: $id) {
      success
      message
      deletedResponseId: id
    }
  }
`;

// ==================== ADMIN MODERATION MUTATIONS ====================

/**
 * Verify a review (Admin only)
 */
export const VERIFY_REVIEW = gql`
  mutation VerifyReview($id: ID!) {
    verifyReview(id: $id) {
      ...AdminReview
    }
  }
  ${ADMIN_REVIEW_FRAGMENT}
`;

/**
 * Unverify a review (Admin only)
 */
export const UNVERIFY_REVIEW = gql`
  mutation UnverifyReview($id: ID!) {
    unverifyReview(id: $id) {
      ...AdminReview
    }
  }
  ${ADMIN_REVIEW_FRAGMENT}
`;

/**
 * Publish a review (Admin only)
 */
export const PUBLISH_REVIEW = gql`
  mutation PublishReview($id: ID!) {
    publishReview(id: $id) {
      ...AdminReview
    }
  }
  ${ADMIN_REVIEW_FRAGMENT}
`;

/**
 * Unpublish a review (Admin only)
 */
export const UNPUBLISH_REVIEW = gql`
  mutation UnpublishReview($id: ID!) {
    unpublishReview(id: $id) {
      ...AdminReview
    }
  }
  ${ADMIN_REVIEW_FRAGMENT}
`;

/**
 * Delete a review as admin (Admin only)
 */
export const DELETE_REVIEW_ADMIN = gql`
  mutation DeleteReviewAdmin($id: ID!) {
    deleteReviewAdmin(id: $id) {
      success
      message
      deletedReviewId: id
    }
  }
`;

/**
 * Delete a review response as admin (Admin only)
 */
export const DELETE_REVIEW_RESPONSE_ADMIN = gql`
  mutation DeleteReviewResponseAdmin($id: ID!) {
    deleteReviewResponseAdmin(id: $id) {
      success
      message
      deletedResponseId: id
    }
  }
`;

// ==================== BULK ADMIN OPERATIONS ====================

/**
 * Bulk verify reviews (Admin only)
 */
export const BULK_VERIFY_REVIEWS = gql`
  mutation BulkVerifyReviews($reviewIds: [ID!]!) {
    bulkVerifyReviews(reviewIds: $reviewIds) {
      successCount
      failureCount
      errors {
        reviewId
        message
      }
      verifiedReviews {
        ...ReviewBasic
      }
    }
  }
  ${REVIEW_BASIC_FRAGMENT}
`;

/**
 * Bulk unverify reviews (Admin only)
 */
export const BULK_UNVERIFY_REVIEWS = gql`
  mutation BulkUnverifyReviews($reviewIds: [ID!]!) {
    bulkUnverifyReviews(reviewIds: $reviewIds) {
      successCount
      failureCount
      errors {
        reviewId
        message
      }
      unverifiedReviews {
        ...ReviewBasic
      }
    }
  }
  ${REVIEW_BASIC_FRAGMENT}
`;

/**
 * Bulk publish reviews (Admin only)
 */
export const BULK_PUBLISH_REVIEWS = gql`
  mutation BulkPublishReviews($reviewIds: [ID!]!) {
    bulkPublishReviews(reviewIds: $reviewIds) {
      successCount
      failureCount
      errors {
        reviewId
        message
      }
      publishedReviews {
        ...ReviewBasic
      }
    }
  }
  ${REVIEW_BASIC_FRAGMENT}
`;

/**
 * Bulk unpublish reviews (Admin only)
 */
export const BULK_UNPUBLISH_REVIEWS = gql`
  mutation BulkUnpublishReviews($reviewIds: [ID!]!) {
    bulkUnpublishReviews(reviewIds: $reviewIds) {
      successCount
      failureCount
      errors {
        reviewId
        message
      }
      unpublishedReviews {
        ...ReviewBasic
      }
    }
  }
  ${REVIEW_BASIC_FRAGMENT}
`;

/**
 * Bulk delete reviews (Admin only)
 */
export const BULK_DELETE_REVIEWS = gql`
  mutation BulkDeleteReviews($reviewIds: [ID!]!) {
    bulkDeleteReviews(reviewIds: $reviewIds) {
      successCount
      failureCount
      deletedIds
      errors {
        reviewId
        message
      }
    }
  }
`;

// ==================== SPECIALIZED REVIEW MUTATIONS ====================

/**
 * Create a booking review (after booking completion)
 */
export const CREATE_BOOKING_REVIEW = gql`
  mutation CreateBookingReview(
    $bookingId: ID!
    $rating: Int!
    $comment: String!
    $serviceAspects: ServiceAspectsInput
    $attachments: [String!]
  ) {
    createReview(input: {
      serviceId: $bookingId
      serviceType: "BOOKING"
      rating: $rating
      comment: $comment
      serviceAspects: $serviceAspects
      attachments: $attachments
    }) {
      ...ReviewComplete
    }
  }
  ${REVIEW_COMPLETE_FRAGMENT}
`;

/**
 * Create a venue review
 */
export const CREATE_VENUE_REVIEW = gql`
  mutation CreateVenueReview(
    $venueId: ID!
    $rating: Int!
    $comment: String!
    $venueAspects: VenueAspectsInput
    $attachments: [String!]
  ) {
    createReview(input: {
      serviceId: $venueId
      serviceType: "VENUE"
      rating: $rating
      comment: $comment
      venueAspects: $venueAspects
      attachments: $attachments
    }) {
      ...ReviewComplete
    }
  }
  ${REVIEW_COMPLETE_FRAGMENT}
`;

/**
 * Create a catering review
 */
export const CREATE_CATERING_REVIEW = gql`
  mutation CreateCateringReview(
    $cateringId: ID!
    $rating: Int!
    $comment: String!
    $cateringAspects: CateringAspectsInput
    $attachments: [String!]
  ) {
    createReview(input: {
      serviceId: $cateringId
      serviceType: "CATERING"
      rating: $rating
      comment: $comment
      cateringAspects: $cateringAspects
      attachments: $attachments
    }) {
      ...ReviewComplete
    }
  }
  ${REVIEW_COMPLETE_FRAGMENT}
`;

/**
 * Create a photography review
 */
export const CREATE_PHOTOGRAPHY_REVIEW = gql`
  mutation CreatePhotographyReview(
    $photographyId: ID!
    $rating: Int!
    $comment: String!
    $photographyAspects: PhotographyAspectsInput
    $attachments: [String!]
  ) {
    createReview(input: {
      serviceId: $photographyId
      serviceType: "PHOTOGRAPHY"
      rating: $rating
      comment: $comment
      photographyAspects: $photographyAspects
      attachments: $attachments
    }) {
      ...ReviewComplete
    }
  }
  ${REVIEW_COMPLETE_FRAGMENT}
`;

// ==================== REVIEW INTERACTION MUTATIONS ====================

/**
 * Flag a review for moderation
 */
export const FLAG_REVIEW = gql`
  mutation FlagReview($reviewId: ID!, $reason: String!, $description: String) {
    flagReview(
      reviewId: $reviewId
      reason: $reason
      description: $description
    ) {
      success
      message
      flaggedReview {
        id
        moderationStatus
        flaggedCount
      }
    }
  }
`;

/**
 * Report a review as inappropriate
 */
export const REPORT_REVIEW = gql`
  mutation ReportReview($reviewId: ID!, $reason: String!, $description: String) {
    reportReview(
      reviewId: $reviewId
      reason: $reason
      description: $description
    ) {
      success
      message
      reportedReview {
        id
        moderationStatus
        reportedCount
      }
    }
  }
`;

/**
 * Like a review
 */
export const LIKE_REVIEW = gql`
  mutation LikeReview($reviewId: ID!) {
    likeReview(reviewId: $reviewId) {
      success
      isLiked
      likeCount
      review {
        id
        likesCount
        isLikedByUser
      }
    }
  }
`;

/**
 * Unlike a review
 */
export const UNLIKE_REVIEW = gql`
  mutation UnlikeReview($reviewId: ID!) {
    unlikeReview(reviewId: $reviewId) {
      success
      isLiked
      likeCount
      review {
        id
        likesCount
        isLikedByUser
      }
    }
  }
`;

// ==================== VENDOR RESPONSE MANAGEMENT ====================

/**
 * Quick response templates for vendors
 */
export const CREATE_QUICK_RESPONSE = gql`
  mutation CreateQuickResponse(
    $reviewId: ID!
    $templateType: ResponseTemplateType!
    $customization: String
  ) {
    createReviewResponse(input: {
      reviewId: $reviewId
      responseText: $customization
      templateType: $templateType
    }) {
      ...ReviewResponseComplete
    }
  }
  ${REVIEW_RESPONSE_COMPLETE_FRAGMENT}
`;

/**
 * Thank customer for positive review
 */
export const THANK_FOR_REVIEW = gql`
  mutation ThankForReview($reviewId: ID!, $personalMessage: String) {
    createReviewResponse(input: {
      reviewId: $reviewId
      responseText: $personalMessage
      templateType: THANK_YOU
    }) {
      ...ReviewResponseComplete
    }
  }
  ${REVIEW_RESPONSE_COMPLETE_FRAGMENT}
`;

/**
 * Address negative review concerns
 */
export const ADDRESS_REVIEW_CONCERNS = gql`
  mutation AddressReviewConcerns(
    $reviewId: ID!
    $response: String!
    $actionPlan: String
    $offerCompensation: Boolean
  ) {
    createReviewResponse(input: {
      reviewId: $reviewId
      responseText: $response
      actionPlan: $actionPlan
      offerCompensation: $offerCompensation
      templateType: ADDRESS_CONCERNS
    }) {
      ...ReviewResponseComplete
    }
  }
  ${REVIEW_RESPONSE_COMPLETE_FRAGMENT}
`;

// ==================== REVIEW ANALYTICS MUTATIONS ====================

/**
 * Track review view
 */
export const TRACK_REVIEW_VIEW = gql`
  mutation TrackReviewView($reviewId: ID!) {
    trackReviewView(reviewId: $reviewId) {
      success
      viewCount
    }
  }
`;

/**
 * Track review helpfulness
 */
export const MARK_REVIEW_HELPFUL = gql`
  mutation MarkReviewHelpful($reviewId: ID!, $isHelpful: Boolean!) {
    markReviewHelpful(reviewId: $reviewId, isHelpful: $isHelpful) {
      success
      helpfulCount
      unhelpfulCount
      userMarkedHelpful
    }
  }
`;

// ==================== REVIEW IMPORT/EXPORT MUTATIONS ====================

/**
 * Import reviews from external platform
 */
export const IMPORT_REVIEWS = gql`
  mutation ImportReviews($source: String!, $reviews: [ExternalReviewInput!]!) {
    importReviews(source: $source, reviews: $reviews) {
      successCount
      failureCount
      importedReviews {
        ...ReviewBasic
      }
      errors {
        index
        message
        externalId
      }
    }
  }
  ${REVIEW_BASIC_FRAGMENT}
`;

/**
 * Export reviews to external format
 */
export const EXPORT_REVIEWS = gql`
  mutation ExportReviews(
    $format: ExportFormat!
    $filters: ReviewFilters
    $includeResponses: Boolean = true
  ) {
    exportReviews(
      format: $format
      filters: $filters
      includeResponses: $includeResponses
    ) {
      success
      downloadUrl
      fileName
      recordCount
      expiresAt
    }
  }
`;

// ==================== REVIEW MODERATION WORKFLOWS ====================

/**
 * Submit review for moderation
 */
export const SUBMIT_FOR_MODERATION = gql`
  mutation SubmitForModeration($reviewId: ID!, $priority: ModerationPriority) {
    submitForModeration(reviewId: $reviewId, priority: $priority) {
      success
      moderationTicket {
        id
        reviewId
        priority
        status
        assignedTo
        createdAt
      }
    }
  }
`;

/**
 * Approve review after moderation
 */
export const APPROVE_REVIEW = gql`
  mutation ApproveReview($reviewId: ID!, $moderationNotes: String) {
    approveReview(reviewId: $reviewId, moderationNotes: $moderationNotes) {
      ...AdminReview
    }
  }
  ${ADMIN_REVIEW_FRAGMENT}
`;

/**
 * Reject review after moderation
 */
export const REJECT_REVIEW = gql`
  mutation RejectReview($reviewId: ID!, $reason: String!, $moderationNotes: String) {
    rejectReview(
      reviewId: $reviewId
      reason: $reason
      moderationNotes: $moderationNotes
    ) {
      ...AdminReview
    }
  }
  ${ADMIN_REVIEW_FRAGMENT}
`;

// ==================== EXPORT ALL MUTATIONS ====================

export const ALL_REVIEW_MUTATIONS = {
  // Basic CRUD
  CREATE_REVIEW,
  UPDATE_REVIEW,
  DELETE_REVIEW,
  
  // Review responses
  CREATE_REVIEW_RESPONSE,
  UPDATE_REVIEW_RESPONSE,
  DELETE_REVIEW_RESPONSE,
  
  // Admin moderation
  VERIFY_REVIEW,
  UNVERIFY_REVIEW,
  PUBLISH_REVIEW,
  UNPUBLISH_REVIEW,
  DELETE_REVIEW_ADMIN,
  DELETE_REVIEW_RESPONSE_ADMIN,
  
  // Bulk operations
  BULK_VERIFY_REVIEWS,
  BULK_UNVERIFY_REVIEWS,
  BULK_PUBLISH_REVIEWS,
  BULK_UNPUBLISH_REVIEWS,
  BULK_DELETE_REVIEWS,
  
  // Specialized reviews
  CREATE_BOOKING_REVIEW,
  CREATE_VENUE_REVIEW,
  CREATE_CATERING_REVIEW,
  CREATE_PHOTOGRAPHY_REVIEW,
  
  // Review interactions
  FLAG_REVIEW,
  REPORT_REVIEW,
  LIKE_REVIEW,
  UNLIKE_REVIEW,
  
  // Vendor responses
  CREATE_QUICK_RESPONSE,
  THANK_FOR_REVIEW,
  ADDRESS_REVIEW_CONCERNS,
  
  // Analytics
  TRACK_REVIEW_VIEW,
  MARK_REVIEW_HELPFUL,
  
  // Import/Export
  IMPORT_REVIEWS,
  EXPORT_REVIEWS,
  
  // Moderation workflows
  SUBMIT_FOR_MODERATION,
  APPROVE_REVIEW,
  REJECT_REVIEW
};
