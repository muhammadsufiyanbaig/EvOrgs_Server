"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BULK_ACTIVATE_ADS = exports.RESCHEDULE_EXTERNAL_AD = exports.CANCEL_EXTERNAL_AD_SCHEDULE = exports.SCHEDULE_EXTERNAL_AD = exports.EXPIRE_EXTERNAL_AD = exports.EXPIRE_FEATURED_AD = exports.EXPIRE_SPONSORED_AD = exports.RESUME_EXTERNAL_AD = exports.RESUME_FEATURED_AD = exports.RESUME_SPONSORED_AD = exports.PAUSE_EXTERNAL_AD = exports.PAUSE_FEATURED_AD = exports.PAUSE_SPONSORED_AD = exports.ACTIVATE_EXTERNAL_AD = exports.ACTIVATE_FEATURED_AD = exports.ACTIVATE_SPONSORED_AD = exports.REJECT_FEATURED_AD_REQUEST = exports.REJECT_SPONSORED_AD_REQUEST = exports.APPROVE_FEATURED_AD_REQUEST = exports.APPROVE_SPONSORED_AD_REQUEST = exports.BULK_SCHEDULE_ADS = exports.RESUME_AD_SCHEDULE = exports.PAUSE_AD_SCHEDULE = exports.RETRY_FAILED_SCHEDULE = exports.RESCHEDULE_AD_RUN = exports.CANCEL_SCHEDULED_RUN = exports.SCHEDULE_AD_RUN = exports.UPDATE_AD_TIME_SLOTS = exports.APPROVE_AD_REQUEST_WITH_TIME_SLOTS = exports.RECORD_CONVERSION = exports.RECORD_CLICK = exports.RECORD_IMPRESSION = exports.UPDATE_PAYMENT_STATUS = exports.CREATE_PAYMENT = exports.DELETE_EXTERNAL_AD = exports.UPDATE_EXTERNAL_AD = exports.CREATE_EXTERNAL_AD = exports.EXTEND_SERVICE_AD = exports.CANCEL_SERVICE_AD = exports.RESUME_SERVICE_AD = exports.PAUSE_SERVICE_AD = exports.UPDATE_SERVICE_AD = exports.EXPIRE_SERVICE_AD = exports.ACTIVATE_SERVICE_AD = exports.REVIEW_AD_REQUEST = exports.REJECT_AD_REQUEST = exports.APPROVE_AD_REQUEST = exports.CANCEL_AD_REQUEST = exports.UPDATE_AD_REQUEST = exports.CREATE_AD_REQUEST = void 0;
exports.RESOLVE_FLAGGED_AD = exports.FLAG_AD_FOR_REVIEW = exports.CREATE_AUDIT_LOG = exports.BROADCAST_ADMIN_ANNOUNCEMENT = exports.SEND_AD_STATUS_NOTIFICATION = exports.REBUILD_AD_INDEXES = exports.CLEANUP_EXPIRED_SCHEDULES = exports.ARCHIVE_OLD_ADS = exports.APPLY_AD_DISCOUNT = exports.PROCESS_PENDING_PAYMENTS = exports.CREATE_AD_REFUND = exports.EXPORT_ADS_DATA = exports.RESET_AD_ANALYTICS = exports.GENERATE_AD_PERFORMANCE_REPORT = exports.EXTEND_AD_DURATION = exports.UPDATE_AD_PRICING = exports.FORCE_EXPIRE_ADS = exports.TRANSFER_AD_OWNERSHIP = exports.CLONE_EXTERNAL_AD = exports.GENERATE_AD_REPORT = exports.MANAGE_AD_LIFECYCLE = exports.COMPLETE_AD_REVIEW = exports.UPDATE_AD_WITH_INTERACTION = exports.APPROVE_REQUEST_WITH_PAYMENT = exports.CREATE_AD_REQUEST_WITH_PAYMENT = exports.BULK_UPDATE_SERVICE_ADS = exports.BULK_REJECT_AD_REQUESTS = exports.BULK_APPROVE_AD_REQUESTS = exports.UNBAN_VENDOR_ADS = exports.BAN_VENDOR_ADS = exports.REMOVE_FEATURED_STATUS = exports.SET_AD_AS_FEATURED = exports.UPDATE_VENDOR_AD_PRIORITY = exports.BULK_EXPIRE_ADS = exports.BULK_PAUSE_ADS = void 0;
const client_1 = require("@apollo/client");
const queries_1 = require("./queries");
// ==================== VENDOR MUTATIONS ====================
// Create new ad request
exports.CREATE_AD_REQUEST = (0, client_1.gql) `
  mutation CreateAdRequest($input: CreateAdRequestInput!) {
    createAdRequest(input: $input) {
      ...AdRequestFields
    }
  }
  ${queries_1.AD_REQUEST_FRAGMENT}
`;
// Update existing ad request
exports.UPDATE_AD_REQUEST = (0, client_1.gql) `
  mutation UpdateAdRequest($id: ID!, $input: UpdateAdRequestInput!) {
    updateAdRequest(id: $id, input: $input) {
      ...AdRequestFields
    }
  }
  ${queries_1.AD_REQUEST_FRAGMENT}
`;
// Cancel ad request
exports.CANCEL_AD_REQUEST = (0, client_1.gql) `
  mutation CancelAdRequest($id: ID!) {
    cancelAdRequest(id: $id)
  }
`;
// ==================== ADMIN AD REQUEST MANAGEMENT ====================
// Approve ad request
exports.APPROVE_AD_REQUEST = (0, client_1.gql) `
  mutation ApproveAdRequest($id: ID!, $input: ApproveAdRequestInput!) {
    approveAdRequest(id: $id, input: $input) {
      ...ServiceAdFields
    }
  }
  ${queries_1.SERVICE_AD_FRAGMENT}
`;
// Reject ad request
exports.REJECT_AD_REQUEST = (0, client_1.gql) `
  mutation RejectAdRequest($id: ID!, $adminNotes: String) {
    rejectAdRequest(id: $id, adminNotes: $adminNotes) {
      ...AdRequestFields
    }
  }
  ${queries_1.AD_REQUEST_FRAGMENT}
`;
// Review ad request with status update
exports.REVIEW_AD_REQUEST = (0, client_1.gql) `
  mutation ReviewAdRequest($id: ID!, $status: RequestStatus!, $adminNotes: String!) {
    reviewAdRequest(id: $id, status: $status, adminNotes: $adminNotes) {
      ...AdRequestFields
    }
  }
  ${queries_1.AD_REQUEST_FRAGMENT}
`;
// ==================== ADMIN SERVICE AD MANAGEMENT ====================
// Activate service ad
exports.ACTIVATE_SERVICE_AD = (0, client_1.gql) `
  mutation ActivateServiceAd($id: ID!) {
    activateServiceAd(id: $id) {
      ...ServiceAdFields
    }
  }
  ${queries_1.SERVICE_AD_FRAGMENT}
`;
// Expire service ad
exports.EXPIRE_SERVICE_AD = (0, client_1.gql) `
  mutation ExpireServiceAd($id: ID!) {
    expireServiceAd(id: $id) {
      ...ServiceAdFields
    }
  }
  ${queries_1.SERVICE_AD_FRAGMENT}
`;
// Update service ad details
exports.UPDATE_SERVICE_AD = (0, client_1.gql) `
  mutation UpdateServiceAd($id: ID!, $input: UpdateServiceAdInput!) {
    updateServiceAd(id: $id, input: $input) {
      ...ServiceAdFields
    }
  }
  ${queries_1.SERVICE_AD_FRAGMENT}
`;
// Pause service ad
exports.PAUSE_SERVICE_AD = (0, client_1.gql) `
  mutation PauseServiceAd($id: ID!) {
    pauseServiceAd(id: $id) {
      ...ServiceAdFields
    }
  }
  ${queries_1.SERVICE_AD_FRAGMENT}
`;
// Resume service ad
exports.RESUME_SERVICE_AD = (0, client_1.gql) `
  mutation ResumeServiceAd($id: ID!) {
    resumeServiceAd(id: $id) {
      ...ServiceAdFields
    }
  }
  ${queries_1.SERVICE_AD_FRAGMENT}
`;
// Cancel service ad
exports.CANCEL_SERVICE_AD = (0, client_1.gql) `
  mutation CancelServiceAd($id: ID!) {
    cancelServiceAd(id: $id) {
      ...ServiceAdFields
    }
  }
  ${queries_1.SERVICE_AD_FRAGMENT}
`;
// Extend service ad duration
exports.EXTEND_SERVICE_AD = (0, client_1.gql) `
  mutation ExtendServiceAd($id: ID!, $newEndDate: String!) {
    extendServiceAd(id: $id, newEndDate: $newEndDate) {
      ...ServiceAdFields
    }
  }
  ${queries_1.SERVICE_AD_FRAGMENT}
`;
// ==================== EXTERNAL AD MANAGEMENT ====================
// Create external ad (admin only)
exports.CREATE_EXTERNAL_AD = (0, client_1.gql) `
  mutation CreateExternalAd($input: CreateExternalAdInput!) {
    createExternalAd(input: $input) {
      ...ExternalAdFields
    }
  }
  ${queries_1.EXTERNAL_AD_FRAGMENT}
`;
// Update external ad (admin only)
exports.UPDATE_EXTERNAL_AD = (0, client_1.gql) `
  mutation UpdateExternalAd($id: ID!, $input: UpdateExternalAdInput!) {
    updateExternalAd(id: $id, input: $input) {
      ...ExternalAdFields
    }
  }
  ${queries_1.EXTERNAL_AD_FRAGMENT}
`;
// Delete external ad (admin only)
exports.DELETE_EXTERNAL_AD = (0, client_1.gql) `
  mutation DeleteExternalAd($id: ID!) {
    deleteExternalAd(id: $id)
  }
`;
// ==================== PAYMENT MANAGEMENT ====================
// Create payment record
exports.CREATE_PAYMENT = (0, client_1.gql) `
  mutation CreatePayment($input: CreatePaymentInput!) {
    createPayment(input: $input) {
      ...AdPaymentFields
    }
  }
  ${queries_1.AD_PAYMENT_FRAGMENT}
`;
// Update payment status
exports.UPDATE_PAYMENT_STATUS = (0, client_1.gql) `
  mutation UpdatePaymentStatus($id: ID!, $status: PaymentStatus!) {
    updatePaymentStatus(id: $id, status: $status) {
      ...AdPaymentFields
    }
  }
  ${queries_1.AD_PAYMENT_FRAGMENT}
`;
// ==================== AD INTERACTION TRACKING ====================
// Record ad impression
exports.RECORD_IMPRESSION = (0, client_1.gql) `
  mutation RecordImpression($adId: ID!, $isExternal: Boolean!) {
    recordImpression(adId: $adId, isExternal: $isExternal)
  }
`;
// Record ad click
exports.RECORD_CLICK = (0, client_1.gql) `
  mutation RecordClick($adId: ID!, $isExternal: Boolean!) {
    recordClick(adId: $adId, isExternal: $isExternal)
  }
`;
// Record ad conversion
exports.RECORD_CONVERSION = (0, client_1.gql) `
  mutation RecordConversion($adId: ID!) {
    recordConversion(adId: $adId)
  }
`;
// ==================== TIME SLOT MANAGEMENT ====================
// Approve ad request with time slots
exports.APPROVE_AD_REQUEST_WITH_TIME_SLOTS = (0, client_1.gql) `
  mutation ApproveAdRequestWithTimeSlots($id: ID!, $input: ApproveAdRequestWithTimeSlotsInput!) {
    approveAdRequestWithTimeSlots(id: $id, input: $input) {
      id
      title
      description
      status
      finalPrice
      adminStartDate
      adminEndDate
      adminNotes
      timeSlots {
        id
        startTime
        endTime
        daysOfWeek
        priority
        createdAt
        updatedAt
      }
      totalScheduledRuns
      successfulRuns
      failedRuns
      vendor {
        id
        businessName
      }
    }
  }
`;
// Update ad time slots
exports.UPDATE_AD_TIME_SLOTS = (0, client_1.gql) `
  mutation UpdateAdTimeSlots($adId: ID!, $timeSlots: [TimeSlotInput!]!) {
    updateAdTimeSlots(adId: $adId, timeSlots: $timeSlots) {
      id
      title
      timeSlots {
        id
        startTime
        endTime
        daysOfWeek
        priority
        createdAt
        updatedAt
      }
    }
  }
`;
// Schedule ad run
exports.SCHEDULE_AD_RUN = (0, client_1.gql) `
  mutation ScheduleAdRun($adId: ID!, $timeSlotId: ID!, $scheduledDate: String!) {
    scheduleAdRun(adId: $adId, timeSlotId: $timeSlotId, scheduledDate: $scheduledDate) {
      id
      scheduledDate
      status
      executedAt
      retryCount
      failureReason
      nextRetry
      ad {
        id
        title
        vendor {
          businessName
        }
      }
      timeSlot {
        id
        startTime
        endTime
        daysOfWeek
        priority
      }
    }
  }
`;
// Cancel scheduled run
exports.CANCEL_SCHEDULED_RUN = (0, client_1.gql) `
  mutation CancelScheduledRun($scheduleId: ID!) {
    cancelScheduledRun(scheduleId: $scheduleId) {
      id
      status
      scheduledDate
      ad {
        title
      }
    }
  }
`;
// Reschedule ad run
exports.RESCHEDULE_AD_RUN = (0, client_1.gql) `
  mutation RescheduleAdRun($scheduleId: ID!, $newDate: String!, $newTimeSlotId: ID) {
    rescheduleAdRun(scheduleId: $scheduleId, newDate: $newDate, newTimeSlotId: $newTimeSlotId) {
      id
      scheduledDate
      status
      ad {
        id
        title
      }
      timeSlot {
        id
        startTime
        endTime
      }
    }
  }
`;
// Retry failed schedule
exports.RETRY_FAILED_SCHEDULE = (0, client_1.gql) `
  mutation RetryFailedSchedule($scheduleId: ID!) {
    retryFailedSchedule(scheduleId: $scheduleId) {
      id
      status
      retryCount
      nextRetry
      failureReason
    }
  }
`;
// Pause ad schedule
exports.PAUSE_AD_SCHEDULE = (0, client_1.gql) `
  mutation PauseAdSchedule($adId: ID!) {
    pauseAdSchedule(adId: $adId) {
      id
      title
      status
      timeSlots {
        id
        startTime
        endTime
        daysOfWeek
      }
    }
  }
`;
// Resume ad schedule
exports.RESUME_AD_SCHEDULE = (0, client_1.gql) `
  mutation ResumeAdSchedule($adId: ID!) {
    resumeAdSchedule(adId: $adId) {
      id
      title
      status
      timeSlots {
        id
        startTime
        endTime
        daysOfWeek
      }
    }
  }
`;
// Bulk schedule ads
exports.BULK_SCHEDULE_ADS = (0, client_1.gql) `
  mutation BulkScheduleAds($adIds: [ID!]!, $timeSlots: [TimeSlotInput!]!, $dateRange: String!) {
    bulkScheduleAds(adIds: $adIds, timeSlots: $timeSlots, dateRange: $dateRange) {
      successfulSchedules {
        adId
        scheduleId
        scheduledDate
      }
      failedSchedules {
        adId
        error
      }
      totalRequested
      totalSuccessful
      totalFailed
    }
  }
`;
// ==================== ADMIN AD TYPE MANAGEMENT MUTATIONS ====================
// Approve sponsored ad request (admin only)
exports.APPROVE_SPONSORED_AD_REQUEST = (0, client_1.gql) `
  mutation ApproveSponsoredAdRequest($id: ID!, $input: ApproveAdRequestInput!) {
    approveSponsoredAdRequest(id: $id, input: $input) {
      ...ServiceAdFields
      vendor {
        id
        businessName
      }
    }
  }
  ${queries_1.SERVICE_AD_FRAGMENT}
`;
// Approve featured ad request (admin only)
exports.APPROVE_FEATURED_AD_REQUEST = (0, client_1.gql) `
  mutation ApproveFeaturedAdRequest($id: ID!, $input: ApproveAdRequestInput!) {
    approveFeaturedAdRequest(id: $id, input: $input) {
      ...ServiceAdFields
      vendor {
        id
        businessName
      }
    }
  }
  ${queries_1.SERVICE_AD_FRAGMENT}
`;
// Reject sponsored ad request (admin only)
exports.REJECT_SPONSORED_AD_REQUEST = (0, client_1.gql) `
  mutation RejectSponsoredAdRequest($id: ID!, $adminNotes: String) {
    rejectSponsoredAdRequest(id: $id, adminNotes: $adminNotes) {
      ...AdRequestFields
    }
  }
  ${queries_1.AD_REQUEST_FRAGMENT}
`;
// Reject featured ad request (admin only)
exports.REJECT_FEATURED_AD_REQUEST = (0, client_1.gql) `
  mutation RejectFeaturedAdRequest($id: ID!, $adminNotes: String) {
    rejectFeaturedAdRequest(id: $id, adminNotes: $adminNotes) {
      ...AdRequestFields
    }
  }
  ${queries_1.AD_REQUEST_FRAGMENT}
`;
// Activate sponsored ad (admin only)
exports.ACTIVATE_SPONSORED_AD = (0, client_1.gql) `
  mutation ActivateSponsoredAd($id: ID!) {
    activateSponsoredAd(id: $id) {
      ...ServiceAdFields
    }
  }
  ${queries_1.SERVICE_AD_FRAGMENT}
`;
// Activate featured ad (admin only)
exports.ACTIVATE_FEATURED_AD = (0, client_1.gql) `
  mutation ActivateFeaturedAd($id: ID!) {
    activateFeaturedAd(id: $id) {
      ...ServiceAdFields
    }
  }
  ${queries_1.SERVICE_AD_FRAGMENT}
`;
// Activate external ad (admin only)
exports.ACTIVATE_EXTERNAL_AD = (0, client_1.gql) `
  mutation ActivateExternalAd($id: ID!) {
    activateExternalAd(id: $id) {
      ...ExternalAdFields
    }
  }
  ${queries_1.EXTERNAL_AD_FRAGMENT}
`;
// Pause sponsored ad (admin only)
exports.PAUSE_SPONSORED_AD = (0, client_1.gql) `
  mutation PauseSponsoredAd($id: ID!) {
    pauseSponsoredAd(id: $id) {
      ...ServiceAdFields
    }
  }
  ${queries_1.SERVICE_AD_FRAGMENT}
`;
// Pause featured ad (admin only)
exports.PAUSE_FEATURED_AD = (0, client_1.gql) `
  mutation PauseFeaturedAd($id: ID!) {
    pauseFeaturedAd(id: $id) {
      ...ServiceAdFields
    }
  }
  ${queries_1.SERVICE_AD_FRAGMENT}
`;
// Pause external ad (admin only)
exports.PAUSE_EXTERNAL_AD = (0, client_1.gql) `
  mutation PauseExternalAd($id: ID!) {
    pauseExternalAd(id: $id) {
      ...ExternalAdFields
    }
  }
  ${queries_1.EXTERNAL_AD_FRAGMENT}
`;
// Resume sponsored ad (admin only)
exports.RESUME_SPONSORED_AD = (0, client_1.gql) `
  mutation ResumeSponsoredAd($id: ID!) {
    resumeSponsoredAd(id: $id) {
      ...ServiceAdFields
    }
  }
  ${queries_1.SERVICE_AD_FRAGMENT}
`;
// Resume featured ad (admin only)
exports.RESUME_FEATURED_AD = (0, client_1.gql) `
  mutation ResumeFeaturedAd($id: ID!) {
    resumeFeaturedAd(id: $id) {
      ...ServiceAdFields
    }
  }
  ${queries_1.SERVICE_AD_FRAGMENT}
`;
// Resume external ad (admin only)
exports.RESUME_EXTERNAL_AD = (0, client_1.gql) `
  mutation ResumeExternalAd($id: ID!) {
    resumeExternalAd(id: $id) {
      ...ExternalAdFields
    }
  }
  ${queries_1.EXTERNAL_AD_FRAGMENT}
`;
// Expire sponsored ad (admin only)
exports.EXPIRE_SPONSORED_AD = (0, client_1.gql) `
  mutation ExpireSponsoredAd($id: ID!) {
    expireSponsoredAd(id: $id) {
      ...ServiceAdFields
    }
  }
  ${queries_1.SERVICE_AD_FRAGMENT}
`;
// Expire featured ad (admin only)
exports.EXPIRE_FEATURED_AD = (0, client_1.gql) `
  mutation ExpireFeaturedAd($id: ID!) {
    expireFeaturedAd(id: $id) {
      ...ServiceAdFields
    }
  }
  ${queries_1.SERVICE_AD_FRAGMENT}
`;
// Expire external ad (admin only)
exports.EXPIRE_EXTERNAL_AD = (0, client_1.gql) `
  mutation ExpireExternalAd($id: ID!) {
    expireExternalAd(id: $id) {
      ...ExternalAdFields
    }
  }
  ${queries_1.EXTERNAL_AD_FRAGMENT}
`;
// ==================== EXTERNAL AD MANAGEMENT MUTATIONS ====================
// Schedule external ad (admin only)
exports.SCHEDULE_EXTERNAL_AD = (0, client_1.gql) `
  mutation ScheduleExternalAd($externalAdId: ID!, $scheduledDate: String!, $timeSlot: String!) {
    scheduleExternalAd(externalAdId: $externalAdId, scheduledDate: $scheduledDate, timeSlot: $timeSlot) {
      id
      externalAdId
      scheduledDate
      status
      timeSlot
      externalAd {
        id
        adTitle
        advertiserName
      }
    }
  }
`;
// Cancel external ad schedule (admin only)
exports.CANCEL_EXTERNAL_AD_SCHEDULE = (0, client_1.gql) `
  mutation CancelExternalAdSchedule($scheduleId: ID!) {
    cancelExternalAdSchedule(scheduleId: $scheduleId) {
      id
      status
      externalAd {
        adTitle
      }
    }
  }
`;
// Reschedule external ad (admin only)
exports.RESCHEDULE_EXTERNAL_AD = (0, client_1.gql) `
  mutation RescheduleExternalAd($scheduleId: ID!, $newDate: String!, $newTimeSlot: String!) {
    rescheduleExternalAd(scheduleId: $scheduleId, newDate: $newDate, newTimeSlot: $newTimeSlot) {
      id
      scheduledDate
      timeSlot
      status
      externalAd {
        id
        adTitle
      }
    }
  }
`;
// Bulk activate ads (admin only)
exports.BULK_ACTIVATE_ADS = (0, client_1.gql) `
  mutation BulkActivateAds($adIds: [ID!]!, $adType: String!) {
    bulkActivateAds(adIds: $adIds, adType: $adType) {
      successfulActivations {
        adId
        adTitle
      }
      failedActivations {
        adId
        error
      }
      totalRequested
      totalSuccessful
      totalFailed
    }
  }
`;
// Bulk pause ads (admin only)
exports.BULK_PAUSE_ADS = (0, client_1.gql) `
  mutation BulkPauseAds($adIds: [ID!]!, $adType: String!) {
    bulkPauseAds(adIds: $adIds, adType: $adType) {
      successfulPauses {
        adId
        adTitle
      }
      failedPauses {
        adId
        error
      }
      totalRequested
      totalSuccessful
      totalFailed
    }
  }
`;
// Bulk expire ads (admin only)
exports.BULK_EXPIRE_ADS = (0, client_1.gql) `
  mutation BulkExpireAds($adIds: [ID!]!, $adType: String!) {
    bulkExpireAds(adIds: $adIds, adType: $adType) {
      successfulExpirations {
        adId
        adTitle
      }
      failedExpirations {
        adId
        error
      }
      totalRequested
      totalSuccessful
      totalFailed
    }
  }
`;
// ==================== VENDOR MANAGEMENT MUTATIONS ====================
// Update vendor ad priority (admin only)
exports.UPDATE_VENDOR_AD_PRIORITY = (0, client_1.gql) `
  mutation UpdateVendorAdPriority($adId: ID!, $priority: Int!) {
    updateVendorAdPriority(adId: $adId, priority: $priority) {
      ...ServiceAdFields
      priority
    }
  }
  ${queries_1.SERVICE_AD_FRAGMENT}
`;
// Set vendor ad as featured (admin only)
exports.SET_AD_AS_FEATURED = (0, client_1.gql) `
  mutation SetAdAsFeatured($adId: ID!, $featuredUntil: String!) {
    setAdAsFeatured(adId: $adId, featuredUntil: $featuredUntil) {
      ...ServiceAdFields
      isFeatured
      featuredUntil
    }
  }
  ${queries_1.SERVICE_AD_FRAGMENT}
`;
// Remove featured status (admin only)
exports.REMOVE_FEATURED_STATUS = (0, client_1.gql) `
  mutation RemoveFeaturedStatus($adId: ID!) {
    removeFeaturedStatus(adId: $adId) {
      ...ServiceAdFields
      isFeatured
    }
  }
  ${queries_1.SERVICE_AD_FRAGMENT}
`;
// Ban vendor ads (admin only)
exports.BAN_VENDOR_ADS = (0, client_1.gql) `
  mutation BanVendorAds($vendorId: ID!, $reason: String!) {
    banVendorAds(vendorId: $vendorId, reason: $reason) {
      vendorId
      bannedAdsCount
      reason
      bannedAt
    }
  }
`;
// Unban vendor ads (admin only)
exports.UNBAN_VENDOR_ADS = (0, client_1.gql) `
  mutation UnbanVendorAds($vendorId: ID!) {
    unbanVendorAds(vendorId: $vendorId) {
      vendorId
      unbannedAdsCount
      unbannedAt
    }
  }
`;
// ==================== BULK OPERATIONS ====================
// Bulk approve ad requests
exports.BULK_APPROVE_AD_REQUESTS = (0, client_1.gql) `
  mutation BulkApproveAdRequests($ids: [ID!]!, $input: ApproveAdRequestInput!) {
    bulkApproveAdRequests(ids: $ids, input: $input) {
      success
      processedCount
      failedCount
      results {
        id
        success
        message
        ad {
          ...ServiceAdFields
        }
      }
    }
  }
  ${queries_1.SERVICE_AD_FRAGMENT}
`;
// Bulk reject ad requests
exports.BULK_REJECT_AD_REQUESTS = (0, client_1.gql) `
  mutation BulkRejectAdRequests($ids: [ID!]!, $adminNotes: String) {
    bulkRejectAdRequests(ids: $ids, adminNotes: $adminNotes) {
      success
      processedCount
      failedCount
      results {
        id
        success
        message
        request {
          ...AdRequestFields
        }
      }
    }
  }
  ${queries_1.AD_REQUEST_FRAGMENT}
`;
// Bulk update service ads
exports.BULK_UPDATE_SERVICE_ADS = (0, client_1.gql) `
  mutation BulkUpdateServiceAds($ids: [ID!]!, $status: ServiceAdStatus!) {
    bulkUpdateServiceAds(ids: $ids, status: $status) {
      success
      processedCount
      failedCount
      results {
        id
        success
        message
        ad {
          ...ServiceAdFields
        }
      }
    }
  }
  ${queries_1.SERVICE_AD_FRAGMENT}
`;
// ==================== COMPLEX OPERATIONS ====================
// Create ad request with payment
exports.CREATE_AD_REQUEST_WITH_PAYMENT = (0, client_1.gql) `
  mutation CreateAdRequestWithPayment(
    $adInput: CreateAdRequestInput!
    $paymentInput: CreatePaymentInput!
  ) {
    createAdRequest(input: $adInput) {
      ...AdRequestFields
    }
    createPayment(input: $paymentInput) {
      ...AdPaymentFields
    }
  }
  ${queries_1.AD_REQUEST_FRAGMENT}
  ${queries_1.AD_PAYMENT_FRAGMENT}
`;
// Approve request and create payment
exports.APPROVE_REQUEST_WITH_PAYMENT = (0, client_1.gql) `
  mutation ApproveRequestWithPayment(
    $id: ID!
    $approveInput: ApproveAdRequestInput!
    $paymentInput: CreatePaymentInput!
  ) {
    serviceAd: approveAdRequest(id: $id, input: $approveInput) {
      ...ServiceAdFields
    }
    payment: createPayment(input: $paymentInput) {
      ...AdPaymentFields
    }
  }
  ${queries_1.SERVICE_AD_FRAGMENT}
  ${queries_1.AD_PAYMENT_FRAGMENT}
`;
// Update ad and track interaction
exports.UPDATE_AD_WITH_INTERACTION = (0, client_1.gql) `
  mutation UpdateAdWithInteraction(
    $adId: ID!
    $updateInput: UpdateServiceAdInput!
    $interactionType: String!
    $isExternal: Boolean!
  ) {
    updateAd: updateServiceAd(id: $adId, input: $updateInput) {
      ...ServiceAdFields
    }
    recordInteraction: recordImpression(adId: $adId, isExternal: $isExternal)
  }
  ${queries_1.SERVICE_AD_FRAGMENT}
`;
// ==================== ADMIN WORKFLOW MUTATIONS ====================
// Complete ad review workflow
exports.COMPLETE_AD_REVIEW = (0, client_1.gql) `
  mutation CompleteAdReview(
    $requestId: ID!
    $action: String! # "approve" or "reject"
    $approveInput: ApproveAdRequestInput
    $adminNotes: String
  ) {
    completeAdReview(
      requestId: $requestId
      action: $action
      approveInput: $approveInput
      adminNotes: $adminNotes
    ) {
      success
      message
      adRequest {
        ...AdRequestFields
      }
      serviceAd {
        ...ServiceAdFields
      }
    }
  }
  ${queries_1.AD_REQUEST_FRAGMENT}
  ${queries_1.SERVICE_AD_FRAGMENT}
`;
// Manage ad lifecycle
exports.MANAGE_AD_LIFECYCLE = (0, client_1.gql) `
  mutation ManageAdLifecycle(
    $adId: ID!
    $action: String! # "activate", "pause", "resume", "expire", "cancel", "extend"
    $newEndDate: String
  ) {
    manageAdLifecycle(adId: $adId, action: $action, newEndDate: $newEndDate) {
      success
      message
      ad {
        ...ServiceAdFields
      }
    }
  }
  ${queries_1.SERVICE_AD_FRAGMENT}
`;
// ==================== ANALYTICS MUTATIONS ====================
// Generate ad performance report
exports.GENERATE_AD_REPORT = (0, client_1.gql) `
  mutation GenerateAdReport(
    $adId: ID!
    $startDate: String!
    $endDate: String!
    $includeDetails: Boolean!
  ) {
    generateAdReport(
      adId: $adId
      startDate: $startDate
      endDate: $endDate
      includeDetails: $includeDetails
    ) {
      success
      reportUrl
      analytics {
        ...AdAnalyticsFields
      }
      message
    }
  }
`;
// ==================== ADVANCED ADMIN OPERATIONS ====================
// Clone external ad (admin only)
exports.CLONE_EXTERNAL_AD = (0, client_1.gql) `
  mutation CloneExternalAd($id: ID!, $modifications: CloneExternalAdInput) {
    cloneExternalAd(id: $id, modifications: $modifications) {
      original {
        ...ExternalAdFields
      }
      cloned {
        ...ExternalAdFields
      }
    }
  }
  ${queries_1.EXTERNAL_AD_FRAGMENT}
`;
// Transfer ad ownership (admin only)
exports.TRANSFER_AD_OWNERSHIP = (0, client_1.gql) `
  mutation TransferAdOwnership($adId: ID!, $newVendorId: ID!, $reason: String!) {
    transferAdOwnership(adId: $adId, newVendorId: $newVendorId, reason: $reason) {
      ...ServiceAdFields
      previousVendor {
        id
        businessName
      }
      newVendor {
        id
        businessName
      }
      transferReason
      transferredAt
    }
  }
  ${queries_1.SERVICE_AD_FRAGMENT}
`;
// Force expire ads (admin only)
exports.FORCE_EXPIRE_ADS = (0, client_1.gql) `
  mutation ForceExpireAds($adIds: [ID!]!, $reason: String!) {
    forceExpireAds(adIds: $adIds, reason: $reason) {
      expiredAds {
        adId
        adTitle
        previousStatus
      }
      failedExpirations {
        adId
        error
      }
      totalRequested
      totalSuccessful
    }
  }
`;
// Update ad pricing (admin only)
exports.UPDATE_AD_PRICING = (0, client_1.gql) `
  mutation UpdateAdPricing($adId: ID!, $newPrice: Float!, $reason: String) {
    updateAdPricing(adId: $adId, newPrice: $newPrice, reason: $reason) {
      ...ServiceAdFields
      previousPrice
      priceChangedAt
      priceChangeReason
    }
  }
  ${queries_1.SERVICE_AD_FRAGMENT}
`;
// Extend ad duration (admin only)
exports.EXTEND_AD_DURATION = (0, client_1.gql) `
  mutation ExtendAdDuration($adId: ID!, $additionalDays: Int!, $reason: String) {
    extendAdDuration(adId: $adId, additionalDays: $additionalDays, reason: $reason) {
      ...ServiceAdFields
      previousEndDate
      extensionReason
      extendedAt
    }
  }
  ${queries_1.SERVICE_AD_FRAGMENT}
`;
// ==================== ANALYTICS & REPORTING MUTATIONS ====================
// Generate ad performance report (admin only)
exports.GENERATE_AD_PERFORMANCE_REPORT = (0, client_1.gql) `
  mutation GenerateAdPerformanceReport($input: AdPerformanceReportInput!) {
    generateAdPerformanceReport(input: $input) {
      reportId
      reportType
      generatedAt
      reportUrl
      emailSent
      reportData {
        totalAds
        activeAds
        expiredAds
        totalRevenue
        totalImpressions
        totalClicks
        averageCTR
      }
    }
  }
`;
// Reset ad analytics (admin only)
exports.RESET_AD_ANALYTICS = (0, client_1.gql) `
  mutation ResetAdAnalytics($adId: ID!, $reason: String!) {
    resetAdAnalytics(adId: $adId, reason: $reason) {
      ...ServiceAdFields
      previousAnalytics {
        impressions
        clicks
        conversions
      }
      resetAt
      resetReason
    }
  }
  ${queries_1.SERVICE_AD_FRAGMENT}
`;
// Export ads data (admin only)
exports.EXPORT_ADS_DATA = (0, client_1.gql) `
  mutation ExportAdsData($input: ExportAdsDataInput!) {
    exportAdsData(input: $input) {
      exportId
      fileName
      exportUrl
      recordCount
      exportFormat
      exportedAt
      expiresAt
    }
  }
`;
// ==================== PAYMENT & FINANCIAL MUTATIONS ====================
// Create refund for ad (admin only)
exports.CREATE_AD_REFUND = (0, client_1.gql) `
  mutation CreateAdRefund($paymentId: ID!, $refundAmount: Float!, $reason: String!) {
    createAdRefund(paymentId: $paymentId, refundAmount: $refundAmount, reason: $reason) {
      refundId
      originalPayment {
        ...AdPaymentFields
      }
      refundAmount
      refundReason
      refundStatus
      processedAt
    }
  }
  ${queries_1.AD_PAYMENT_FRAGMENT}
`;
// Process pending payments (admin only)
exports.PROCESS_PENDING_PAYMENTS = (0, client_1.gql) `
  mutation ProcessPendingPayments($paymentIds: [ID!]!) {
    processPendingPayments(paymentIds: $paymentIds) {
      processedPayments {
        paymentId
        status
        processedAt
      }
      failedPayments {
        paymentId
        error
      }
      totalProcessed
      totalFailed
    }
  }
`;
// Apply ad discount (admin only)
exports.APPLY_AD_DISCOUNT = (0, client_1.gql) `
  mutation ApplyAdDiscount($adId: ID!, $discountPercentage: Float!, $reason: String!) {
    applyAdDiscount(adId: $adId, discountPercentage: $discountPercentage, reason: $reason) {
      ...ServiceAdFields
      originalPrice
      discountedPrice
      discountPercentage
      discountReason
      discountAppliedAt
    }
  }
  ${queries_1.SERVICE_AD_FRAGMENT}
`;
// ==================== SYSTEM MAINTENANCE MUTATIONS ====================
// Archive old ads (admin only)
exports.ARCHIVE_OLD_ADS = (0, client_1.gql) `
  mutation ArchiveOldAds($olderThan: String!, $adTypes: [String!]) {
    archiveOldAds(olderThan: $olderThan, adTypes: $adTypes) {
      archivedCount
      serviceAdsArchived
      externalAdsArchived
      archiveDate
      archivedIds
    }
  }
`;
// Cleanup expired schedules (admin only)
exports.CLEANUP_EXPIRED_SCHEDULES = (0, client_1.gql) `
  mutation CleanupExpiredSchedules($olderThan: String!) {
    cleanupExpiredSchedules(olderThan: $olderThan) {
      cleanedCount
      cleanupDate
      cleanedScheduleIds
    }
  }
`;
// Rebuild ad indexes (admin only)
exports.REBUILD_AD_INDEXES = (0, client_1.gql) `
  mutation RebuildAdIndexes {
    rebuildAdIndexes {
      success
      rebuiltIndexes
      rebuildTime
      recordsReindexed
    }
  }
`;
// ==================== NOTIFICATION MUTATIONS ====================
// Send ad status notification (admin only)
exports.SEND_AD_STATUS_NOTIFICATION = (0, client_1.gql) `
  mutation SendAdStatusNotification($adId: ID!, $message: String!, $notificationType: String!) {
    sendAdStatusNotification(adId: $adId, message: $message, notificationType: $notificationType) {
      notificationId
      sentTo {
        vendorId
        email
        businessName
      }
      message
      sentAt
      deliveryStatus
    }
  }
`;
// Broadcast admin announcement (admin only)
exports.BROADCAST_ADMIN_ANNOUNCEMENT = (0, client_1.gql) `
  mutation BroadcastAdminAnnouncement($announcement: AdminAnnouncementInput!) {
    broadcastAdminAnnouncement(announcement: $announcement) {
      announcementId
      title
      message
      targetAudience
      sentCount
      broadcastAt
      expiresAt
    }
  }
`;
// ==================== AUDIT & LOGGING MUTATIONS ====================
// Create audit log entry (admin only)
exports.CREATE_AUDIT_LOG = (0, client_1.gql) `
  mutation CreateAuditLog($input: AuditLogInput!) {
    createAuditLog(input: $input) {
      logId
      action
      entityType
      entityId
      adminId
      changes
      timestamp
    }
  }
`;
// Flag ad for review (admin only)
exports.FLAG_AD_FOR_REVIEW = (0, client_1.gql) `
  mutation FlagAdForReview($adId: ID!, $flagReason: String!, $priority: String!) {
    flagAdForReview(adId: $adId, flagReason: $flagReason, priority: $priority) {
      flagId
      ad {
        ...ServiceAdFields
      }
      flagReason
      priority
      flaggedAt
      reviewStatus
    }
  }
  ${queries_1.SERVICE_AD_FRAGMENT}
`;
// Resolve flagged ad (admin only)
exports.RESOLVE_FLAGGED_AD = (0, client_1.gql) `
  mutation ResolveFlaggedAd($flagId: ID!, $resolution: String!, $action: String!) {
    resolveFlaggedAd(flagId: $flagId, resolution: $resolution, action: $action) {
      flagId
      resolution
      action
      resolvedAt
      resolvedBy {
        id
        name
      }
    }
  }
`;
