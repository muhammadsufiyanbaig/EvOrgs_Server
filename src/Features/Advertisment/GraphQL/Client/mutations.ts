import { gql } from '@apollo/client';
import { 
  AD_REQUEST_FRAGMENT, 
  SERVICE_AD_FRAGMENT, 
  EXTERNAL_AD_FRAGMENT, 
  AD_PAYMENT_FRAGMENT 
} from './queries';

// ==================== VENDOR MUTATIONS ====================

// Create new ad request
export const CREATE_AD_REQUEST = gql`
  mutation CreateAdRequest($input: CreateAdRequestInput!) {
    createAdRequest(input: $input) {
      ...AdRequestFields
    }
  }
  ${AD_REQUEST_FRAGMENT}
`;

// Update existing ad request
export const UPDATE_AD_REQUEST = gql`
  mutation UpdateAdRequest($id: ID!, $input: UpdateAdRequestInput!) {
    updateAdRequest(id: $id, input: $input) {
      ...AdRequestFields
    }
  }
  ${AD_REQUEST_FRAGMENT}
`;

// Cancel ad request
export const CANCEL_AD_REQUEST = gql`
  mutation CancelAdRequest($id: ID!) {
    cancelAdRequest(id: $id)
  }
`;

// ==================== ADMIN AD REQUEST MANAGEMENT ====================

// Approve ad request
export const APPROVE_AD_REQUEST = gql`
  mutation ApproveAdRequest($id: ID!, $input: ApproveAdRequestInput!) {
    approveAdRequest(id: $id, input: $input) {
      ...ServiceAdFields
    }
  }
  ${SERVICE_AD_FRAGMENT}
`;

// Reject ad request
export const REJECT_AD_REQUEST = gql`
  mutation RejectAdRequest($id: ID!, $adminNotes: String) {
    rejectAdRequest(id: $id, adminNotes: $adminNotes) {
      ...AdRequestFields
    }
  }
  ${AD_REQUEST_FRAGMENT}
`;

// Review ad request with status update
export const REVIEW_AD_REQUEST = gql`
  mutation ReviewAdRequest($id: ID!, $status: RequestStatus!, $adminNotes: String!) {
    reviewAdRequest(id: $id, status: $status, adminNotes: $adminNotes) {
      ...AdRequestFields
    }
  }
  ${AD_REQUEST_FRAGMENT}
`;

// ==================== ADMIN SERVICE AD MANAGEMENT ====================

// Activate service ad
export const ACTIVATE_SERVICE_AD = gql`
  mutation ActivateServiceAd($id: ID!) {
    activateServiceAd(id: $id) {
      ...ServiceAdFields
    }
  }
  ${SERVICE_AD_FRAGMENT}
`;

// Expire service ad
export const EXPIRE_SERVICE_AD = gql`
  mutation ExpireServiceAd($id: ID!) {
    expireServiceAd(id: $id) {
      ...ServiceAdFields
    }
  }
  ${SERVICE_AD_FRAGMENT}
`;

// Update service ad details
export const UPDATE_SERVICE_AD = gql`
  mutation UpdateServiceAd($id: ID!, $input: UpdateServiceAdInput!) {
    updateServiceAd(id: $id, input: $input) {
      ...ServiceAdFields
    }
  }
  ${SERVICE_AD_FRAGMENT}
`;

// Pause service ad
export const PAUSE_SERVICE_AD = gql`
  mutation PauseServiceAd($id: ID!) {
    pauseServiceAd(id: $id) {
      ...ServiceAdFields
    }
  }
  ${SERVICE_AD_FRAGMENT}
`;

// Resume service ad
export const RESUME_SERVICE_AD = gql`
  mutation ResumeServiceAd($id: ID!) {
    resumeServiceAd(id: $id) {
      ...ServiceAdFields
    }
  }
  ${SERVICE_AD_FRAGMENT}
`;

// Cancel service ad
export const CANCEL_SERVICE_AD = gql`
  mutation CancelServiceAd($id: ID!) {
    cancelServiceAd(id: $id) {
      ...ServiceAdFields
    }
  }
  ${SERVICE_AD_FRAGMENT}
`;

// Extend service ad duration
export const EXTEND_SERVICE_AD = gql`
  mutation ExtendServiceAd($id: ID!, $newEndDate: String!) {
    extendServiceAd(id: $id, newEndDate: $newEndDate) {
      ...ServiceAdFields
    }
  }
  ${SERVICE_AD_FRAGMENT}
`;

// ==================== EXTERNAL AD MANAGEMENT ====================

// Create external ad (admin only)
export const CREATE_EXTERNAL_AD = gql`
  mutation CreateExternalAd($input: CreateExternalAdInput!) {
    createExternalAd(input: $input) {
      ...ExternalAdFields
    }
  }
  ${EXTERNAL_AD_FRAGMENT}
`;

// Update external ad (admin only)
export const UPDATE_EXTERNAL_AD = gql`
  mutation UpdateExternalAd($id: ID!, $input: UpdateExternalAdInput!) {
    updateExternalAd(id: $id, input: $input) {
      ...ExternalAdFields
    }
  }
  ${EXTERNAL_AD_FRAGMENT}
`;

// Delete external ad (admin only)
export const DELETE_EXTERNAL_AD = gql`
  mutation DeleteExternalAd($id: ID!) {
    deleteExternalAd(id: $id)
  }
`;

// ==================== PAYMENT MANAGEMENT ====================

// Create payment record
export const CREATE_PAYMENT = gql`
  mutation CreatePayment($input: CreatePaymentInput!) {
    createPayment(input: $input) {
      ...AdPaymentFields
    }
  }
  ${AD_PAYMENT_FRAGMENT}
`;

// Update payment status
export const UPDATE_PAYMENT_STATUS = gql`
  mutation UpdatePaymentStatus($id: ID!, $status: PaymentStatus!) {
    updatePaymentStatus(id: $id, status: $status) {
      ...AdPaymentFields
    }
  }
  ${AD_PAYMENT_FRAGMENT}
`;

// ==================== AD INTERACTION TRACKING ====================

// Record ad impression
export const RECORD_IMPRESSION = gql`
  mutation RecordImpression($adId: ID!, $isExternal: Boolean!) {
    recordImpression(adId: $adId, isExternal: $isExternal)
  }
`;

// Record ad click
export const RECORD_CLICK = gql`
  mutation RecordClick($adId: ID!, $isExternal: Boolean!) {
    recordClick(adId: $adId, isExternal: $isExternal)
  }
`;

// Record ad conversion
export const RECORD_CONVERSION = gql`
  mutation RecordConversion($adId: ID!) {
    recordConversion(adId: $adId)
  }
`;

// ==================== TIME SLOT MANAGEMENT ====================

// Approve ad request with time slots
export const APPROVE_AD_REQUEST_WITH_TIME_SLOTS = gql`
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
export const UPDATE_AD_TIME_SLOTS = gql`
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
export const SCHEDULE_AD_RUN = gql`
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
export const CANCEL_SCHEDULED_RUN = gql`
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
export const RESCHEDULE_AD_RUN = gql`
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
export const RETRY_FAILED_SCHEDULE = gql`
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
export const PAUSE_AD_SCHEDULE = gql`
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
export const RESUME_AD_SCHEDULE = gql`
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
export const BULK_SCHEDULE_ADS = gql`
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
export const APPROVE_SPONSORED_AD_REQUEST = gql`
  mutation ApproveSponsoredAdRequest($id: ID!, $input: ApproveAdRequestInput!) {
    approveSponsoredAdRequest(id: $id, input: $input) {
      ...ServiceAdFields
      vendor {
        id
        businessName
      }
    }
  }
  ${SERVICE_AD_FRAGMENT}
`;

// Approve featured ad request (admin only)
export const APPROVE_FEATURED_AD_REQUEST = gql`
  mutation ApproveFeaturedAdRequest($id: ID!, $input: ApproveAdRequestInput!) {
    approveFeaturedAdRequest(id: $id, input: $input) {
      ...ServiceAdFields
      vendor {
        id
        businessName
      }
    }
  }
  ${SERVICE_AD_FRAGMENT}
`;

// Reject sponsored ad request (admin only)
export const REJECT_SPONSORED_AD_REQUEST = gql`
  mutation RejectSponsoredAdRequest($id: ID!, $adminNotes: String) {
    rejectSponsoredAdRequest(id: $id, adminNotes: $adminNotes) {
      ...AdRequestFields
    }
  }
  ${AD_REQUEST_FRAGMENT}
`;

// Reject featured ad request (admin only)
export const REJECT_FEATURED_AD_REQUEST = gql`
  mutation RejectFeaturedAdRequest($id: ID!, $adminNotes: String) {
    rejectFeaturedAdRequest(id: $id, adminNotes: $adminNotes) {
      ...AdRequestFields
    }
  }
  ${AD_REQUEST_FRAGMENT}
`;

// Activate sponsored ad (admin only)
export const ACTIVATE_SPONSORED_AD = gql`
  mutation ActivateSponsoredAd($id: ID!) {
    activateSponsoredAd(id: $id) {
      ...ServiceAdFields
    }
  }
  ${SERVICE_AD_FRAGMENT}
`;

// Activate featured ad (admin only)
export const ACTIVATE_FEATURED_AD = gql`
  mutation ActivateFeaturedAd($id: ID!) {
    activateFeaturedAd(id: $id) {
      ...ServiceAdFields
    }
  }
  ${SERVICE_AD_FRAGMENT}
`;

// Activate external ad (admin only)
export const ACTIVATE_EXTERNAL_AD = gql`
  mutation ActivateExternalAd($id: ID!) {
    activateExternalAd(id: $id) {
      ...ExternalAdFields
    }
  }
  ${EXTERNAL_AD_FRAGMENT}
`;

// Pause sponsored ad (admin only)
export const PAUSE_SPONSORED_AD = gql`
  mutation PauseSponsoredAd($id: ID!) {
    pauseSponsoredAd(id: $id) {
      ...ServiceAdFields
    }
  }
  ${SERVICE_AD_FRAGMENT}
`;

// Pause featured ad (admin only)
export const PAUSE_FEATURED_AD = gql`
  mutation PauseFeaturedAd($id: ID!) {
    pauseFeaturedAd(id: $id) {
      ...ServiceAdFields
    }
  }
  ${SERVICE_AD_FRAGMENT}
`;

// Pause external ad (admin only)
export const PAUSE_EXTERNAL_AD = gql`
  mutation PauseExternalAd($id: ID!) {
    pauseExternalAd(id: $id) {
      ...ExternalAdFields
    }
  }
  ${EXTERNAL_AD_FRAGMENT}
`;

// Resume sponsored ad (admin only)
export const RESUME_SPONSORED_AD = gql`
  mutation ResumeSponsoredAd($id: ID!) {
    resumeSponsoredAd(id: $id) {
      ...ServiceAdFields
    }
  }
  ${SERVICE_AD_FRAGMENT}
`;

// Resume featured ad (admin only)
export const RESUME_FEATURED_AD = gql`
  mutation ResumeFeaturedAd($id: ID!) {
    resumeFeaturedAd(id: $id) {
      ...ServiceAdFields
    }
  }
  ${SERVICE_AD_FRAGMENT}
`;

// Resume external ad (admin only)
export const RESUME_EXTERNAL_AD = gql`
  mutation ResumeExternalAd($id: ID!) {
    resumeExternalAd(id: $id) {
      ...ExternalAdFields
    }
  }
  ${EXTERNAL_AD_FRAGMENT}
`;

// Expire sponsored ad (admin only)
export const EXPIRE_SPONSORED_AD = gql`
  mutation ExpireSponsoredAd($id: ID!) {
    expireSponsoredAd(id: $id) {
      ...ServiceAdFields
    }
  }
  ${SERVICE_AD_FRAGMENT}
`;

// Expire featured ad (admin only)
export const EXPIRE_FEATURED_AD = gql`
  mutation ExpireFeaturedAd($id: ID!) {
    expireFeaturedAd(id: $id) {
      ...ServiceAdFields
    }
  }
  ${SERVICE_AD_FRAGMENT}
`;

// Expire external ad (admin only)
export const EXPIRE_EXTERNAL_AD = gql`
  mutation ExpireExternalAd($id: ID!) {
    expireExternalAd(id: $id) {
      ...ExternalAdFields
    }
  }
  ${EXTERNAL_AD_FRAGMENT}
`;

// ==================== EXTERNAL AD MANAGEMENT MUTATIONS ====================

// Schedule external ad (admin only)
export const SCHEDULE_EXTERNAL_AD = gql`
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
export const CANCEL_EXTERNAL_AD_SCHEDULE = gql`
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
export const RESCHEDULE_EXTERNAL_AD = gql`
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
export const BULK_ACTIVATE_ADS = gql`
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
export const BULK_PAUSE_ADS = gql`
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
export const BULK_EXPIRE_ADS = gql`
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
export const UPDATE_VENDOR_AD_PRIORITY = gql`
  mutation UpdateVendorAdPriority($adId: ID!, $priority: Int!) {
    updateVendorAdPriority(adId: $adId, priority: $priority) {
      ...ServiceAdFields
      priority
    }
  }
  ${SERVICE_AD_FRAGMENT}
`;

// Set vendor ad as featured (admin only)
export const SET_AD_AS_FEATURED = gql`
  mutation SetAdAsFeatured($adId: ID!, $featuredUntil: String!) {
    setAdAsFeatured(adId: $adId, featuredUntil: $featuredUntil) {
      ...ServiceAdFields
      isFeatured
      featuredUntil
    }
  }
  ${SERVICE_AD_FRAGMENT}
`;

// Remove featured status (admin only)
export const REMOVE_FEATURED_STATUS = gql`
  mutation RemoveFeaturedStatus($adId: ID!) {
    removeFeaturedStatus(adId: $adId) {
      ...ServiceAdFields
      isFeatured
    }
  }
  ${SERVICE_AD_FRAGMENT}
`;

// Ban vendor ads (admin only)
export const BAN_VENDOR_ADS = gql`
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
export const UNBAN_VENDOR_ADS = gql`
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
export const BULK_APPROVE_AD_REQUESTS = gql`
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
  ${SERVICE_AD_FRAGMENT}
`;

// Bulk reject ad requests
export const BULK_REJECT_AD_REQUESTS = gql`
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
  ${AD_REQUEST_FRAGMENT}
`;

// Bulk update service ads
export const BULK_UPDATE_SERVICE_ADS = gql`
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
  ${SERVICE_AD_FRAGMENT}
`;

// ==================== COMPLEX OPERATIONS ====================

// Create ad request with payment
export const CREATE_AD_REQUEST_WITH_PAYMENT = gql`
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
  ${AD_REQUEST_FRAGMENT}
  ${AD_PAYMENT_FRAGMENT}
`;

// Approve request and create payment
export const APPROVE_REQUEST_WITH_PAYMENT = gql`
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
  ${SERVICE_AD_FRAGMENT}
  ${AD_PAYMENT_FRAGMENT}
`;

// Update ad and track interaction
export const UPDATE_AD_WITH_INTERACTION = gql`
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
  ${SERVICE_AD_FRAGMENT}
`;

// ==================== ADMIN WORKFLOW MUTATIONS ====================

// Complete ad review workflow
export const COMPLETE_AD_REVIEW = gql`
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
  ${AD_REQUEST_FRAGMENT}
  ${SERVICE_AD_FRAGMENT}
`;

// Manage ad lifecycle
export const MANAGE_AD_LIFECYCLE = gql`
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
  ${SERVICE_AD_FRAGMENT}
`;

// ==================== ANALYTICS MUTATIONS ====================

// Generate ad performance report
export const GENERATE_AD_REPORT = gql`
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
export const CLONE_EXTERNAL_AD = gql`
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
  ${EXTERNAL_AD_FRAGMENT}
`;

// Transfer ad ownership (admin only)
export const TRANSFER_AD_OWNERSHIP = gql`
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
  ${SERVICE_AD_FRAGMENT}
`;

// Force expire ads (admin only)
export const FORCE_EXPIRE_ADS = gql`
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
export const UPDATE_AD_PRICING = gql`
  mutation UpdateAdPricing($adId: ID!, $newPrice: Float!, $reason: String) {
    updateAdPricing(adId: $adId, newPrice: $newPrice, reason: $reason) {
      ...ServiceAdFields
      previousPrice
      priceChangedAt
      priceChangeReason
    }
  }
  ${SERVICE_AD_FRAGMENT}
`;

// Extend ad duration (admin only)
export const EXTEND_AD_DURATION = gql`
  mutation ExtendAdDuration($adId: ID!, $additionalDays: Int!, $reason: String) {
    extendAdDuration(adId: $adId, additionalDays: $additionalDays, reason: $reason) {
      ...ServiceAdFields
      previousEndDate
      extensionReason
      extendedAt
    }
  }
  ${SERVICE_AD_FRAGMENT}
`;

// ==================== ANALYTICS & REPORTING MUTATIONS ====================

// Generate ad performance report (admin only)
export const GENERATE_AD_PERFORMANCE_REPORT = gql`
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
export const RESET_AD_ANALYTICS = gql`
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
  ${SERVICE_AD_FRAGMENT}
`;

// Export ads data (admin only)
export const EXPORT_ADS_DATA = gql`
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
export const CREATE_AD_REFUND = gql`
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
  ${AD_PAYMENT_FRAGMENT}
`;

// Process pending payments (admin only)
export const PROCESS_PENDING_PAYMENTS = gql`
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
export const APPLY_AD_DISCOUNT = gql`
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
  ${SERVICE_AD_FRAGMENT}
`;

// ==================== SYSTEM MAINTENANCE MUTATIONS ====================

// Archive old ads (admin only)
export const ARCHIVE_OLD_ADS = gql`
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
export const CLEANUP_EXPIRED_SCHEDULES = gql`
  mutation CleanupExpiredSchedules($olderThan: String!) {
    cleanupExpiredSchedules(olderThan: $olderThan) {
      cleanedCount
      cleanupDate
      cleanedScheduleIds
    }
  }
`;

// Rebuild ad indexes (admin only)
export const REBUILD_AD_INDEXES = gql`
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
export const SEND_AD_STATUS_NOTIFICATION = gql`
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
export const BROADCAST_ADMIN_ANNOUNCEMENT = gql`
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
export const CREATE_AUDIT_LOG = gql`
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
export const FLAG_AD_FOR_REVIEW = gql`
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
  ${SERVICE_AD_FRAGMENT}
`;

// Resolve flagged ad (admin only)
export const RESOLVE_FLAGGED_AD = gql`
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
