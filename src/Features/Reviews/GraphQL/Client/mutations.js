"use strict";
// GraphQL Mutations for Reviews System (Apollo Client Free Version)
// Comprehensive mutations for review management
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALL_REVIEW_MUTATIONS = exports.REJECT_REVIEW = exports.APPROVE_REVIEW = exports.SUBMIT_FOR_MODERATION = exports.EXPORT_REVIEWS = exports.IMPORT_REVIEWS = exports.MARK_REVIEW_HELPFUL = exports.TRACK_REVIEW_VIEW = exports.ADDRESS_REVIEW_CONCERNS = exports.THANK_FOR_REVIEW = exports.CREATE_QUICK_RESPONSE = exports.UNLIKE_REVIEW = exports.LIKE_REVIEW = exports.REPORT_REVIEW = exports.FLAG_REVIEW = exports.CREATE_PHOTOGRAPHY_REVIEW = exports.CREATE_CATERING_REVIEW = exports.CREATE_VENUE_REVIEW = exports.CREATE_BOOKING_REVIEW = exports.BULK_DELETE_REVIEWS = exports.BULK_UNPUBLISH_REVIEWS = exports.BULK_PUBLISH_REVIEWS = exports.BULK_UNVERIFY_REVIEWS = exports.BULK_VERIFY_REVIEWS = exports.DELETE_REVIEW_RESPONSE_ADMIN = exports.DELETE_REVIEW_ADMIN = exports.UNPUBLISH_REVIEW = exports.PUBLISH_REVIEW = exports.UNVERIFY_REVIEW = exports.VERIFY_REVIEW = exports.DELETE_REVIEW_RESPONSE = exports.UPDATE_REVIEW_RESPONSE = exports.CREATE_REVIEW_RESPONSE = exports.DELETE_REVIEW = exports.UPDATE_REVIEW = exports.CREATE_REVIEW = void 0;
const client_1 = require("@apollo/client");
const fragments_1 = require("./fragments");
// ==================== REVIEW CRUD MUTATIONS ====================
/**
 * Create a new review
 */
exports.CREATE_REVIEW = (0, client_1.gql) `
  mutation CreateReview($input: CreateReviewInput!) {
    createReview(input: $input) {
      ...ReviewComplete
    }
  }
  ${fragments_1.REVIEW_COMPLETE_FRAGMENT}
`;
/**
 * Update an existing review
 */
exports.UPDATE_REVIEW = (0, client_1.gql) `
  mutation UpdateReview($input: UpdateReviewInput!) {
    updateReview(input: $input) {
      ...ReviewComplete
    }
  }
  ${fragments_1.REVIEW_COMPLETE_FRAGMENT}
`;
/**
 * Delete a review (user can delete their own review)
 */
exports.DELETE_REVIEW = (0, client_1.gql) `
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
exports.CREATE_REVIEW_RESPONSE = (0, client_1.gql) `
  mutation CreateReviewResponse($input: CreateReviewResponseInput!) {
    createReviewResponse(input: $input) {
      ...ReviewResponseComplete
    }
  }
  ${fragments_1.REVIEW_RESPONSE_COMPLETE_FRAGMENT}
`;
/**
 * Update a review response
 */
exports.UPDATE_REVIEW_RESPONSE = (0, client_1.gql) `
  mutation UpdateReviewResponse($input: UpdateReviewResponseInput!) {
    updateReviewResponse(input: $input) {
      ...ReviewResponseComplete
    }
  }
  ${fragments_1.REVIEW_RESPONSE_COMPLETE_FRAGMENT}
`;
/**
 * Delete a review response
 */
exports.DELETE_REVIEW_RESPONSE = (0, client_1.gql) `
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
exports.VERIFY_REVIEW = (0, client_1.gql) `
  mutation VerifyReview($id: ID!) {
    verifyReview(id: $id) {
      ...AdminReview
    }
  }
  ${fragments_1.ADMIN_REVIEW_FRAGMENT}
`;
/**
 * Unverify a review (Admin only)
 */
exports.UNVERIFY_REVIEW = (0, client_1.gql) `
  mutation UnverifyReview($id: ID!) {
    unverifyReview(id: $id) {
      ...AdminReview
    }
  }
  ${fragments_1.ADMIN_REVIEW_FRAGMENT}
`;
/**
 * Publish a review (Admin only)
 */
exports.PUBLISH_REVIEW = (0, client_1.gql) `
  mutation PublishReview($id: ID!) {
    publishReview(id: $id) {
      ...AdminReview
    }
  }
  ${fragments_1.ADMIN_REVIEW_FRAGMENT}
`;
/**
 * Unpublish a review (Admin only)
 */
exports.UNPUBLISH_REVIEW = (0, client_1.gql) `
  mutation UnpublishReview($id: ID!) {
    unpublishReview(id: $id) {
      ...AdminReview
    }
  }
  ${fragments_1.ADMIN_REVIEW_FRAGMENT}
`;
/**
 * Delete a review as admin (Admin only)
 */
exports.DELETE_REVIEW_ADMIN = (0, client_1.gql) `
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
exports.DELETE_REVIEW_RESPONSE_ADMIN = (0, client_1.gql) `
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
exports.BULK_VERIFY_REVIEWS = (0, client_1.gql) `
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
  ${fragments_1.REVIEW_BASIC_FRAGMENT}
`;
/**
 * Bulk unverify reviews (Admin only)
 */
exports.BULK_UNVERIFY_REVIEWS = (0, client_1.gql) `
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
  ${fragments_1.REVIEW_BASIC_FRAGMENT}
`;
/**
 * Bulk publish reviews (Admin only)
 */
exports.BULK_PUBLISH_REVIEWS = (0, client_1.gql) `
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
  ${fragments_1.REVIEW_BASIC_FRAGMENT}
`;
/**
 * Bulk unpublish reviews (Admin only)
 */
exports.BULK_UNPUBLISH_REVIEWS = (0, client_1.gql) `
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
  ${fragments_1.REVIEW_BASIC_FRAGMENT}
`;
/**
 * Bulk delete reviews (Admin only)
 */
exports.BULK_DELETE_REVIEWS = (0, client_1.gql) `
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
exports.CREATE_BOOKING_REVIEW = (0, client_1.gql) `
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
  ${fragments_1.REVIEW_COMPLETE_FRAGMENT}
`;
/**
 * Create a venue review
 */
exports.CREATE_VENUE_REVIEW = (0, client_1.gql) `
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
  ${fragments_1.REVIEW_COMPLETE_FRAGMENT}
`;
/**
 * Create a catering review
 */
exports.CREATE_CATERING_REVIEW = (0, client_1.gql) `
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
  ${fragments_1.REVIEW_COMPLETE_FRAGMENT}
`;
/**
 * Create a photography review
 */
exports.CREATE_PHOTOGRAPHY_REVIEW = (0, client_1.gql) `
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
  ${fragments_1.REVIEW_COMPLETE_FRAGMENT}
`;
// ==================== REVIEW INTERACTION MUTATIONS ====================
/**
 * Flag a review for moderation
 */
exports.FLAG_REVIEW = (0, client_1.gql) `
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
exports.REPORT_REVIEW = (0, client_1.gql) `
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
exports.LIKE_REVIEW = (0, client_1.gql) `
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
exports.UNLIKE_REVIEW = (0, client_1.gql) `
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
exports.CREATE_QUICK_RESPONSE = (0, client_1.gql) `
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
  ${fragments_1.REVIEW_RESPONSE_COMPLETE_FRAGMENT}
`;
/**
 * Thank customer for positive review
 */
exports.THANK_FOR_REVIEW = (0, client_1.gql) `
  mutation ThankForReview($reviewId: ID!, $personalMessage: String) {
    createReviewResponse(input: {
      reviewId: $reviewId
      responseText: $personalMessage
      templateType: THANK_YOU
    }) {
      ...ReviewResponseComplete
    }
  }
  ${fragments_1.REVIEW_RESPONSE_COMPLETE_FRAGMENT}
`;
/**
 * Address negative review concerns
 */
exports.ADDRESS_REVIEW_CONCERNS = (0, client_1.gql) `
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
  ${fragments_1.REVIEW_RESPONSE_COMPLETE_FRAGMENT}
`;
// ==================== REVIEW ANALYTICS MUTATIONS ====================
/**
 * Track review view
 */
exports.TRACK_REVIEW_VIEW = (0, client_1.gql) `
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
exports.MARK_REVIEW_HELPFUL = (0, client_1.gql) `
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
exports.IMPORT_REVIEWS = (0, client_1.gql) `
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
  ${fragments_1.REVIEW_BASIC_FRAGMENT}
`;
/**
 * Export reviews to external format
 */
exports.EXPORT_REVIEWS = (0, client_1.gql) `
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
exports.SUBMIT_FOR_MODERATION = (0, client_1.gql) `
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
exports.APPROVE_REVIEW = (0, client_1.gql) `
  mutation ApproveReview($reviewId: ID!, $moderationNotes: String) {
    approveReview(reviewId: $reviewId, moderationNotes: $moderationNotes) {
      ...AdminReview
    }
  }
  ${fragments_1.ADMIN_REVIEW_FRAGMENT}
`;
/**
 * Reject review after moderation
 */
exports.REJECT_REVIEW = (0, client_1.gql) `
  mutation RejectReview($reviewId: ID!, $reason: String!, $moderationNotes: String) {
    rejectReview(
      reviewId: $reviewId
      reason: $reason
      moderationNotes: $moderationNotes
    ) {
      ...AdminReview
    }
  }
  ${fragments_1.ADMIN_REVIEW_FRAGMENT}
`;
// ==================== EXPORT ALL MUTATIONS ====================
exports.ALL_REVIEW_MUTATIONS = {
    // Basic CRUD
    CREATE_REVIEW: exports.CREATE_REVIEW,
    UPDATE_REVIEW: exports.UPDATE_REVIEW,
    DELETE_REVIEW: exports.DELETE_REVIEW,
    // Review responses
    CREATE_REVIEW_RESPONSE: exports.CREATE_REVIEW_RESPONSE,
    UPDATE_REVIEW_RESPONSE: exports.UPDATE_REVIEW_RESPONSE,
    DELETE_REVIEW_RESPONSE: exports.DELETE_REVIEW_RESPONSE,
    // Admin moderation
    VERIFY_REVIEW: exports.VERIFY_REVIEW,
    UNVERIFY_REVIEW: exports.UNVERIFY_REVIEW,
    PUBLISH_REVIEW: exports.PUBLISH_REVIEW,
    UNPUBLISH_REVIEW: exports.UNPUBLISH_REVIEW,
    DELETE_REVIEW_ADMIN: exports.DELETE_REVIEW_ADMIN,
    DELETE_REVIEW_RESPONSE_ADMIN: exports.DELETE_REVIEW_RESPONSE_ADMIN,
    // Bulk operations
    BULK_VERIFY_REVIEWS: exports.BULK_VERIFY_REVIEWS,
    BULK_UNVERIFY_REVIEWS: exports.BULK_UNVERIFY_REVIEWS,
    BULK_PUBLISH_REVIEWS: exports.BULK_PUBLISH_REVIEWS,
    BULK_UNPUBLISH_REVIEWS: exports.BULK_UNPUBLISH_REVIEWS,
    BULK_DELETE_REVIEWS: exports.BULK_DELETE_REVIEWS,
    // Specialized reviews
    CREATE_BOOKING_REVIEW: exports.CREATE_BOOKING_REVIEW,
    CREATE_VENUE_REVIEW: exports.CREATE_VENUE_REVIEW,
    CREATE_CATERING_REVIEW: exports.CREATE_CATERING_REVIEW,
    CREATE_PHOTOGRAPHY_REVIEW: exports.CREATE_PHOTOGRAPHY_REVIEW,
    // Review interactions
    FLAG_REVIEW: exports.FLAG_REVIEW,
    REPORT_REVIEW: exports.REPORT_REVIEW,
    LIKE_REVIEW: exports.LIKE_REVIEW,
    UNLIKE_REVIEW: exports.UNLIKE_REVIEW,
    // Vendor responses
    CREATE_QUICK_RESPONSE: exports.CREATE_QUICK_RESPONSE,
    THANK_FOR_REVIEW: exports.THANK_FOR_REVIEW,
    ADDRESS_REVIEW_CONCERNS: exports.ADDRESS_REVIEW_CONCERNS,
    // Analytics
    TRACK_REVIEW_VIEW: exports.TRACK_REVIEW_VIEW,
    MARK_REVIEW_HELPFUL: exports.MARK_REVIEW_HELPFUL,
    // Import/Export
    IMPORT_REVIEWS: exports.IMPORT_REVIEWS,
    EXPORT_REVIEWS: exports.EXPORT_REVIEWS,
    // Moderation workflows
    SUBMIT_FOR_MODERATION: exports.SUBMIT_FOR_MODERATION,
    APPROVE_REVIEW: exports.APPROVE_REVIEW,
    REJECT_REVIEW: exports.REJECT_REVIEW
};
