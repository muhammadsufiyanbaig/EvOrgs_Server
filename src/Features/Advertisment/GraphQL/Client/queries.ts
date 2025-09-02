import { gql } from '@apollo/client';

// ==================== FRAGMENT DEFINITIONS ====================

export const AD_REQUEST_FRAGMENT = gql`
  fragment AdRequestFields on AdRequest {
    id
    vendorId
    adType
    entityType
    entityId
    adTitle
    adDescription
    adImage
    requestedPrice
    requestedStartDate
    requestedEndDate
    requestedDuration
    targetAudience
    vendorNotes
    status
    adminNotes
    reviewedBy
    reviewedAt
    createdAt
    updatedAt
  }
`;

export const SERVICE_AD_FRAGMENT = gql`
  fragment ServiceAdFields on ServiceAd {
    id
    requestId
    vendorId
    adType
    entityType
    entityId
    adTitle
    adDescription
    adImage
    finalPrice
    status
    adminStartDate
    adminEndDate
    actualStartDate
    actualEndDate
    impressionCount
    clickCount
    conversionCount
    targetAudience
    scheduledBy
    createdAt
    updatedAt
  }
`;

export const EXTERNAL_AD_FRAGMENT = gql`
  fragment ExternalAdFields on ExternalAd {
    id
    advertiserName
    advertiserEmail
    advertiserPhone
    imageUrl
    redirectUrl
    adTitle
    adDescription
    price
    status
    startDate
    endDate
    impressionCount
    clickCount
    createdAt
    updatedAt
  }
`;

export const AD_PAYMENT_FRAGMENT = gql`
  fragment AdPaymentFields on AdPayment {
    id
    adId
    externalAdId
    vendorId
    amountPaid
    paymentStatus
    paymentMethod
    transactionId
    paidAt
    invoiceNumber
    createdAt
    updatedAt
  }
`;

export const AD_ANALYTICS_FRAGMENT = gql`
  fragment AdAnalyticsFields on AdAnalytics {
    impressions
    clicks
    conversions
    ctr
    conversionRate
    totalSpent
    averageDailyCost
    daysActive
  }
`;

// Time slot related fragments
export const TIME_SLOT_FRAGMENT = gql`
  fragment TimeSlotFields on TimeSlot {
    id
    adId
    startTime
    endTime
    daysOfWeek
    priority
    createdAt
    updatedAt
  }
`;

export const AD_SCHEDULE_FRAGMENT = gql`
  fragment AdScheduleFields on AdSchedule {
    id
    adId
    timeSlotId
    scheduledDate
    status
    executedAt
    retryCount
    maxRetries
    nextRetry
    failureReason
    metadata
    createdAt
    updatedAt
  }
`;

export const TIME_SLOT_AVAILABILITY_FRAGMENT = gql`
  fragment TimeSlotAvailabilityFields on TimeSlotAvailability {
    timeSlot
    availability {
      isAvailable
      conflictingAds {
        id
        title
        vendor {
          id
          businessName
        }
      }
    }
  }
`;

export const AD_SCHEDULE_INFO_FRAGMENT = gql`
  fragment AdScheduleInfoFields on AdScheduleInfo {
    ad {
      id
      title
      vendor {
        id
        businessName
      }
    }
    timeSlot {
      ...TimeSlotFields
    }
    schedule {
      ...AdScheduleFields
    }
  }
  ${TIME_SLOT_FRAGMENT}
  ${AD_SCHEDULE_FRAGMENT}
`;

// ==================== PUBLIC QUERIES ====================

// Get active ads visible to all users
export const GET_ACTIVE_ADS = gql`
  query GetActiveAds($adType: AdType, $entityType: EntityType) {
    getActiveAds(adType: $adType, entityType: $entityType) {
      ...ServiceAdFields
    }
  }
  ${SERVICE_AD_FRAGMENT}
`;

// Get active external ads
export const GET_ACTIVE_EXTERNAL_ADS = gql`
  query GetActiveExternalAds {
    getActiveExternalAds {
      ...ExternalAdFields
    }
  }
  ${EXTERNAL_AD_FRAGMENT}
`;

// Get featured ads for homepage
export const GET_FEATURED_ADS = gql`
  query GetFeaturedAds {
    getFeaturedAds {
      ...ServiceAdFields
    }
  }
  ${SERVICE_AD_FRAGMENT}
`;

// Get sponsored ads for promotions
export const GET_SPONSORED_ADS = gql`
  query GetSponsoredAds {
    getSponsoredAds {
      ...ServiceAdFields
    }
  }
  ${SERVICE_AD_FRAGMENT}
`;

// ==================== VENDOR QUERIES ====================

// Get vendor's ad requests
export const GET_MY_AD_REQUESTS = gql`
  query GetMyAdRequests($status: RequestStatus) {
    getMyAdRequests(status: $status) {
      ...AdRequestFields
    }
  }
  ${AD_REQUEST_FRAGMENT}
`;

// Get vendor's active ads
export const GET_MY_ACTIVE_ADS = gql`
  query GetMyActiveAds {
    getMyActiveAds {
      ...ServiceAdFields
    }
  }
  ${SERVICE_AD_FRAGMENT}
`;

// Get specific ad request by ID
export const GET_AD_REQUEST_BY_ID = gql`
  query GetAdRequestById($id: ID!) {
    getAdRequestById(id: $id) {
      ...AdRequestFields
    }
  }
  ${AD_REQUEST_FRAGMENT}
`;

// Get vendor's payment history
export const GET_MY_PAYMENTS = gql`
  query GetMyPayments {
    getMyPayments {
      ...AdPaymentFields
    }
  }
  ${AD_PAYMENT_FRAGMENT}
`;

// ==================== ADMIN QUERIES ====================

// Get all ad requests (admin only)
export const GET_ALL_AD_REQUESTS = gql`
  query GetAllAdRequests($status: RequestStatus, $vendorId: ID) {
    getAllAdRequests(status: $status, vendorId: $vendorId) {
      ...AdRequestFields
    }
  }
  ${AD_REQUEST_FRAGMENT}
`;

// Get all service ads (admin only)
export const GET_ALL_SERVICE_ADS = gql`
  query GetAllServiceAds($status: ServiceAdStatus, $vendorId: ID) {
    getAllServiceAds(status: $status, vendorId: $vendorId) {
      ...ServiceAdFields
    }
  }
  ${SERVICE_AD_FRAGMENT}
`;

// Get pending ad requests for admin review
export const GET_PENDING_AD_REQUESTS = gql`
  query GetPendingAdRequests {
    getPendingAdRequests {
      ...AdRequestFields
    }
  }
  ${AD_REQUEST_FRAGMENT}
`;

// Get external ads (admin only)
export const GET_EXTERNAL_ADS = gql`
  query GetExternalAds($status: ExternalAdStatus) {
    getExternalAds(status: $status) {
      ...ExternalAdFields
    }
  }
  ${EXTERNAL_AD_FRAGMENT}
`;

// Get external ad by ID (admin only)
export const GET_EXTERNAL_AD_BY_ID = gql`
  query GetExternalAdById($id: ID!) {
    getExternalAdById(id: $id) {
      ...ExternalAdFields
    }
  }
  ${EXTERNAL_AD_FRAGMENT}
`;

// ==================== ADMIN AD TYPE MANAGEMENT ====================

// Get all sponsored ads requests (admin only)
export const GET_ALL_SPONSORED_AD_REQUESTS = gql`
  query GetAllSponsoredAdRequests($status: RequestStatus, $vendorId: ID) {
    getAllSponsoredAdRequests(status: $status, vendorId: $vendorId) {
      ...AdRequestFields
      vendor {
        id
        businessName
        email
        contactNumber
      }
    }
  }
  ${AD_REQUEST_FRAGMENT}
`;

// Get all featured ads requests (admin only)
export const GET_ALL_FEATURED_AD_REQUESTS = gql`
  query GetAllFeaturedAdRequests($status: RequestStatus, $vendorId: ID) {
    getAllFeaturedAdRequests(status: $status, vendorId: $vendorId) {
      ...AdRequestFields
      vendor {
        id
        businessName
        email
        contactNumber
      }
    }
  }
  ${AD_REQUEST_FRAGMENT}
`;

// Get pending sponsored ad requests (admin only)
export const GET_PENDING_SPONSORED_REQUESTS = gql`
  query GetPendingSponsoredRequests {
    getPendingSponsoredRequests {
      ...AdRequestFields
      vendor {
        id
        businessName
        email
        contactNumber
      }
    }
  }
  ${AD_REQUEST_FRAGMENT}
`;

// Get pending featured ad requests (admin only)
export const GET_PENDING_FEATURED_REQUESTS = gql`
  query GetPendingFeaturedRequests {
    getPendingFeaturedRequests {
      ...AdRequestFields
      vendor {
        id
        businessName
        email
        contactNumber
      }
    }
  }
  ${AD_REQUEST_FRAGMENT}
`;

// Get all running sponsored ads (admin only)
export const GET_ALL_RUNNING_SPONSORED_ADS = gql`
  query GetAllRunningSponsoredAds {
    getAllRunningSponsoredAds {
      ...ServiceAdFields
      vendor {
        id
        businessName
        email
        contactNumber
      }
      analytics {
        impressions
        clicks
        conversions
        ctr
        conversionRate
      }
    }
  }
  ${SERVICE_AD_FRAGMENT}
`;

// Get all running featured ads (admin only)
export const GET_ALL_RUNNING_FEATURED_ADS = gql`
  query GetAllRunningFeaturedAds {
    getAllRunningFeaturedAds {
      ...ServiceAdFields
      vendor {
        id
        businessName
        email
        contactNumber
      }
      analytics {
        impressions
        clicks
        conversions
        ctr
        conversionRate
      }
    }
  }
  ${SERVICE_AD_FRAGMENT}
`;

// Get all running external ads (admin only)
export const GET_ALL_RUNNING_EXTERNAL_ADS = gql`
  query GetAllRunningExternalAds {
    getAllRunningExternalAds {
      ...ExternalAdFields
      analytics {
        impressions
        clicks
        conversions
        ctr
        conversionRate
      }
    }
  }
  ${EXTERNAL_AD_FRAGMENT}
`;

// Get expired sponsored ads (admin only)
export const GET_EXPIRED_SPONSORED_ADS = gql`
  query GetExpiredSponsoredAds($limit: Int) {
    getExpiredSponsoredAds(limit: $limit) {
      ...ServiceAdFields
      vendor {
        id
        businessName
      }
    }
  }
  ${SERVICE_AD_FRAGMENT}
`;

// Get expired featured ads (admin only)
export const GET_EXPIRED_FEATURED_ADS = gql`
  query GetExpiredFeaturedAds($limit: Int) {
    getExpiredFeaturedAds(limit: $limit) {
      ...ServiceAdFields
      vendor {
        id
        businessName
      }
    }
  }
  ${SERVICE_AD_FRAGMENT}
`;

// Get expired external ads (admin only)
export const GET_EXPIRED_EXTERNAL_ADS = gql`
  query GetExpiredExternalAds($limit: Int) {
    getExpiredExternalAds(limit: $limit) {
      ...ExternalAdFields
    }
  }
  ${EXTERNAL_AD_FRAGMENT}
`;

// Get ad requests by ad type (admin only)
export const GET_AD_REQUESTS_BY_TYPE = gql`
  query GetAdRequestsByType($adType: AdType!, $status: RequestStatus) {
    getAdRequestsByType(adType: $adType, status: $status) {
      ...AdRequestFields
      vendor {
        id
        businessName
        email
        contactNumber
      }
    }
  }
  ${AD_REQUEST_FRAGMENT}
`;

// Get service ads by ad type (admin only)
export const GET_SERVICE_ADS_BY_TYPE = gql`
  query GetServiceAdsByType($adType: AdType!, $status: ServiceAdStatus) {
    getServiceAdsByType(adType: $adType, status: $status) {
      ...ServiceAdFields
      vendor {
        id
        businessName
        email
        contactNumber
      }
      analytics {
        impressions
        clicks
        conversions
        ctr
        conversionRate
      }
    }
  }
  ${SERVICE_AD_FRAGMENT}
`;

// ==================== PAYMENT QUERIES ====================

// Get ad payments (admin only)
export const GET_AD_PAYMENTS = gql`
  query GetAdPayments($adId: ID, $externalAdId: ID) {
    getAdPayments(adId: $adId, externalAdId: $externalAdId) {
      ...AdPaymentFields
    }
  }
  ${AD_PAYMENT_FRAGMENT}
`;

// Get payment by ID (admin only)
export const GET_PAYMENT_BY_ID = gql`
  query GetPaymentById($id: ID!) {
    getPaymentById(id: $id) {
      ...AdPaymentFields
    }
  }
  ${AD_PAYMENT_FRAGMENT}
`;

// ==================== ANALYTICS QUERIES ====================

// Get detailed analytics for a specific ad
export const GET_AD_ANALYTICS = gql`
  query GetAdAnalytics($adId: ID!) {
    getAdAnalytics(adId: $adId) {
      ...AdAnalyticsFields
    }
  }
  ${AD_ANALYTICS_FRAGMENT}
`;

// Get dashboard statistics (admin only)
export const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    getDashboardStats {
      totalAdRequests
      pendingRequests
      activeAds
      totalRevenue
      totalImpressions
      totalClicks
      averageCTR
    }
  }
`;

// Get top performing ads (admin only)
export const GET_TOP_PERFORMING_ADS = gql`
  query GetTopPerformingAds($limit: Int) {
    getTopPerformingAds(limit: $limit) {
      ...ServiceAdFields
    }
  }
  ${SERVICE_AD_FRAGMENT}
`;

// Get revenue analytics (admin only)
export const GET_REVENUE_ANALYTICS = gql`
  query GetRevenueAnalytics($startDate: String, $endDate: String) {
    getRevenueAnalytics(startDate: $startDate, endDate: $endDate) {
      totalRevenue
      dailyRevenue {
        date
        revenue
        adCount
      }
      averageDailyRevenue
      revenueGrowth
      topRevenueAds {
        ...ServiceAdFields
      }
    }
  }
  ${SERVICE_AD_FRAGMENT}
`;

// ==================== COMBINED QUERIES ====================

// Get vendor dashboard data in one query
export const GET_VENDOR_AD_DASHBOARD = gql`
  query GetVendorAdDashboard {
    myAdRequests: getMyAdRequests {
      ...AdRequestFields
    }
    myActiveAds: getMyActiveAds {
      ...ServiceAdFields
    }
    myPayments: getMyPayments {
      ...AdPaymentFields
    }
  }
  ${AD_REQUEST_FRAGMENT}
  ${SERVICE_AD_FRAGMENT}
  ${AD_PAYMENT_FRAGMENT}
`;

// Get admin dashboard data in one query
export const GET_ADMIN_AD_DASHBOARD = gql`
  query GetAdminAdDashboard {
    dashboardStats: getDashboardStats {
      totalAdRequests
      pendingRequests
      activeAds
      totalRevenue
      totalImpressions
      totalClicks
      averageCTR
    }
    pendingRequests: getPendingAdRequests {
      ...AdRequestFields
    }
    topPerformingAds: getTopPerformingAds(limit: 5) {
      ...ServiceAdFields
    }
  }
  ${AD_REQUEST_FRAGMENT}
  ${SERVICE_AD_FRAGMENT}
`;

// ==================== COMPREHENSIVE ADMIN DASHBOARDS ====================

// Get complete admin overview for all ad types
export const GET_ADMIN_COMPLETE_OVERVIEW = gql`
  query GetAdminCompleteOverview {
    # Pending requests by type
    pendingSponsoredRequests: getPendingSponsoredRequests {
      ...AdRequestFields
      vendor {
        id
        businessName
      }
    }
    pendingFeaturedRequests: getPendingFeaturedRequests {
      ...AdRequestFields
      vendor {
        id
        businessName
      }
    }
    
    # Running ads by type
    runningSponsoredAds: getAllRunningSponsoredAds {
      ...ServiceAdFields
      vendor {
        businessName
      }
    }
    runningFeaturedAds: getAllRunningFeaturedAds {
      ...ServiceAdFields
      vendor {
        businessName
      }
    }
    runningExternalAds: getAllRunningExternalAds {
      ...ExternalAdFields
    }
    
    # Statistics
    dashboardStats: getDashboardStats {
      totalAdRequests
      pendingRequests
      activeAds
      totalRevenue
      totalImpressions
      totalClicks
      averageCTR
    }
  }
  ${AD_REQUEST_FRAGMENT}
  ${SERVICE_AD_FRAGMENT}
  ${EXTERNAL_AD_FRAGMENT}
`;

// Get admin ads management dashboard
export const GET_ADMIN_ADS_MANAGEMENT_DASHBOARD = gql`
  query GetAdminAdsManagementDashboard {
    # All pending requests
    allPendingRequests: getPendingAdRequests {
      ...AdRequestFields
      vendor {
        id
        businessName
        email
      }
    }
    
    # Running ads summary
    totalRunningAds: getActiveAds {
      ...ServiceAdFields
    }
    activeExternalAds: getActiveExternalAds {
      ...ExternalAdFields
    }
    
    # Recently expired ads
    recentlyExpiredSponsored: getExpiredSponsoredAds(limit: 10) {
      ...ServiceAdFields
      vendor {
        businessName
      }
    }
    recentlyExpiredFeatured: getExpiredFeaturedAds(limit: 10) {
      ...ServiceAdFields
      vendor {
        businessName
      }
    }
    recentlyExpiredExternal: getExpiredExternalAds(limit: 10) {
      ...ExternalAdFields
    }
    
    # Top performing ads
    topPerformingAds: getTopPerformingAds(limit: 10) {
      ...ServiceAdFields
    }
  }
  ${AD_REQUEST_FRAGMENT}
  ${SERVICE_AD_FRAGMENT}
  ${EXTERNAL_AD_FRAGMENT}
`;

// Get external ads management dashboard (admin only)
export const GET_EXTERNAL_ADS_DASHBOARD = gql`
  query GetExternalAdsDashboard {
    activeExternalAds: getActiveExternalAds {
      ...ExternalAdFields
      analytics {
        impressions
        clicks
        conversions
        ctr
        conversionRate
      }
    }
    allExternalAds: getExternalAds {
      ...ExternalAdFields
    }
    expiredExternalAds: getExpiredExternalAds(limit: 20) {
      ...ExternalAdFields
    }
    externalAdsStats: getExternalAdsStatistics {
      totalAds
      activeAds
      expiredAds
      totalImpressions
      totalClicks
      totalRevenue
      averageCTR
    }
  }
  ${EXTERNAL_AD_FRAGMENT}
`;

// Get sponsored ads management dashboard (admin only)
export const GET_SPONSORED_ADS_DASHBOARD = gql`
  query GetSponsoredAdsDashboard {
    pendingSponsoredRequests: getPendingSponsoredRequests {
      ...AdRequestFields
      vendor {
        id
        businessName
        email
      }
    }
    runningSponsoredAds: getAllRunningSponsoredAds {
      ...ServiceAdFields
      vendor {
        businessName
      }
    }
    expiredSponsoredAds: getExpiredSponsoredAds(limit: 20) {
      ...ServiceAdFields
      vendor {
        businessName
      }
    }
    sponsoredAdsStats: getSponsoredAdsStatistics {
      totalRequests
      pendingRequests
      activeAds
      expiredAds
      totalRevenue
      averageRevenue
    }
  }
  ${AD_REQUEST_FRAGMENT}
  ${SERVICE_AD_FRAGMENT}
`;

// Get featured ads management dashboard (admin only)
export const GET_FEATURED_ADS_DASHBOARD = gql`
  query GetFeaturedAdsDashboard {
    pendingFeaturedRequests: getPendingFeaturedRequests {
      ...AdRequestFields
      vendor {
        id
        businessName
        email
      }
    }
    runningFeaturedAds: getAllRunningFeaturedAds {
      ...ServiceAdFields
      vendor {
        businessName
      }
    }
    expiredFeaturedAds: getExpiredFeaturedAds(limit: 20) {
      ...ServiceAdFields
      vendor {
        businessName
      }
    }
    featuredAdsStats: getFeaturedAdsStatistics {
      totalRequests
      pendingRequests
      activeAds
      expiredAds
      totalRevenue
      averageRevenue
    }
  }
  ${AD_REQUEST_FRAGMENT}
  ${SERVICE_AD_FRAGMENT}
`;

// Get home page ads data
export const GET_HOME_PAGE_ADS = gql`
  query GetHomePageAds {
    featuredAds: getFeaturedAds {
      ...ServiceAdFields
    }
    sponsoredAds: getSponsoredAds {
      ...ServiceAdFields
    }
    externalAds: getActiveExternalAds {
      ...ExternalAdFields
    }
  }
  ${SERVICE_AD_FRAGMENT}
  ${EXTERNAL_AD_FRAGMENT}
`;

// ==================== FILTERED QUERIES ====================

// Get ads by specific entity type
export const GET_ADS_BY_ENTITY_TYPE = gql`
  query GetAdsByEntityType($entityType: EntityType!) {
    getActiveAds(entityType: $entityType) {
      ...ServiceAdFields
    }
  }
  ${SERVICE_AD_FRAGMENT}
`;

// Get ads by specific ad type
export const GET_ADS_BY_AD_TYPE = gql`
  query GetAdsByAdType($adType: AdType!) {
    getActiveAds(adType: $adType) {
      ...ServiceAdFields
    }
  }
  ${SERVICE_AD_FRAGMENT}
`;

// Get vendor's requests by status
export const GET_VENDOR_REQUESTS_BY_STATUS = gql`
  query GetVendorRequestsByStatus($status: RequestStatus!) {
    getMyAdRequests(status: $status) {
      ...AdRequestFields
    }
  }
  ${AD_REQUEST_FRAGMENT}
`;

// Get admin requests by vendor and status
export const GET_ADMIN_REQUESTS_FILTERED = gql`
  query GetAdminRequestsFiltered($status: RequestStatus, $vendorId: ID) {
    getAllAdRequests(status: $status, vendorId: $vendorId) {
      ...AdRequestFields
    }
  }
  ${AD_REQUEST_FRAGMENT}
`;

// ==================== ADVANCED ADMIN FILTERING ====================

// Search ads across all types (admin only)
export const SEARCH_ADS_GLOBAL = gql`
  query SearchAdsGlobal($searchTerm: String!, $adType: String, $status: String, $limit: Int) {
    searchAdsGlobal(searchTerm: $searchTerm, adType: $adType, status: $status, limit: $limit) {
      serviceAds {
        ...ServiceAdFields
        vendor {
          businessName
        }
      }
      externalAds {
        ...ExternalAdFields
      }
      adRequests {
        ...AdRequestFields
        vendor {
          businessName
        }
      }
      totalResults
    }
  }
  ${SERVICE_AD_FRAGMENT}
  ${EXTERNAL_AD_FRAGMENT}
  ${AD_REQUEST_FRAGMENT}
`;

// Get ads by date range (admin only)
export const GET_ADS_BY_DATE_RANGE = gql`
  query GetAdsByDateRange($startDate: String!, $endDate: String!, $adType: String, $status: String) {
    getAdsByDateRange(startDate: $startDate, endDate: $endDate, adType: $adType, status: $status) {
      serviceAds {
        ...ServiceAdFields
        vendor {
          businessName
        }
      }
      externalAds {
        ...ExternalAdFields
      }
    }
  }
  ${SERVICE_AD_FRAGMENT}
  ${EXTERNAL_AD_FRAGMENT}
`;

// Get ads requiring attention (admin only)
export const GET_ADS_REQUIRING_ATTENTION = gql`
  query GetAdsRequiringAttention {
    pendingApprovals: getPendingAdRequests {
      ...AdRequestFields
      vendor {
        businessName
        email
      }
      daysPending
    }
    expiringSoon: getExpiringSoonAds(days: 7) {
      ...ServiceAdFields
      vendor {
        businessName
      }
      daysUntilExpiry
    }
    failedPayments: getAdsWithFailedPayments {
      ...ServiceAdFields
      vendor {
        businessName
        email
      }
      paymentIssues {
        issue
        amount
        dueDate
      }
    }
    underperformingAds: getUnderperformingAds(threshold: 0.5) {
      ...ServiceAdFields
      vendor {
        businessName
      }
      performanceMetrics {
        ctr
        conversionRate
        impressions
      }
    }
  }
  ${AD_REQUEST_FRAGMENT}
  ${SERVICE_AD_FRAGMENT}
`;

// Get vendor activity summary (admin only)
export const GET_VENDOR_ACTIVITY_SUMMARY = gql`
  query GetVendorActivitySummary($limit: Int, $days: Int) {
    getVendorActivitySummary(limit: $limit, days: $days) {
      vendor {
        id
        businessName
        email
        registeredAt
      }
      recentActivity {
        totalRequests
        approvedRequests
        rejectedRequests
        activeAds
        totalSpent
        lastActivityDate
      }
      adTypeBreakdown {
        adType
        count
        revenue
      }
      status
      riskLevel
    }
  }
`;

// Get platform statistics overview (admin only)
export const GET_PLATFORM_STATISTICS_OVERVIEW = gql`
  query GetPlatformStatisticsOverview($period: String) {
    getPlatformStatisticsOverview(period: $period) {
      overview {
        totalVendors
        activeVendors
        totalAdRequests
        pendingRequests
        totalActiveAds
        totalRevenue
        totalImpressions
        totalClicks
      }
      adTypeStats {
        sponsored {
          totalRequests
          activeAds
          revenue
          impressions
          clicks
        }
        featured {
          totalRequests
          activeAds
          revenue
          impressions
          clicks
        }
        external {
          totalAds
          activeAds
          revenue
          impressions
          clicks
        }
      }
      trends {
        dailyRequests {
          date
          count
        }
        dailyRevenue {
          date
          amount
        }
        topPerformingCategories {
          category
          adCount
          revenue
          performance
        }
      }
      alerts {
        type
        message
        severity
        count
      }
    }
  }
`;

// ==================== TIME SLOT QUERIES ====================

// Get available time slots for a specific date
export const GET_AVAILABLE_TIME_SLOTS = gql`
  query GetAvailableTimeSlots($date: String!, $adType: String) {
    getAvailableTimeSlots(date: $date, adType: $adType) {
      ...TimeSlotAvailabilityFields
    }
  }
  ${TIME_SLOT_AVAILABILITY_FRAGMENT}
`;

// Get available time slots for sponsored ads
export const GET_AVAILABLE_SPONSORED_TIME_SLOTS = gql`
  query GetAvailableSponsoredTimeSlots($date: String!) {
    getAvailableTimeSlots(date: $date, adType: "SPONSORED") {
      ...TimeSlotAvailabilityFields
    }
  }
  ${TIME_SLOT_AVAILABILITY_FRAGMENT}
`;

// Get available time slots for featured ads
export const GET_AVAILABLE_FEATURED_TIME_SLOTS = gql`
  query GetAvailableFeaturedTimeSlots($date: String!) {
    getAvailableTimeSlots(date: $date, adType: "FEATURED") {
      ...TimeSlotAvailabilityFields
    }
  }
  ${TIME_SLOT_AVAILABILITY_FRAGMENT}
`;

// Get available time slots for external ads
export const GET_AVAILABLE_EXTERNAL_TIME_SLOTS = gql`
  query GetAvailableExternalTimeSlots($date: String!) {
    getAvailableTimeSlots(date: $date, adType: "EXTERNAL") {
      ...TimeSlotAvailabilityFields
    }
  }
  ${TIME_SLOT_AVAILABILITY_FRAGMENT}
`;

// Get schedules by ad type
export const GET_SCHEDULES_BY_AD_TYPE = gql`
  query GetSchedulesByAdType($adType: String!, $status: ScheduleStatus, $date: String) {
    getSchedulesByAdType(adType: $adType, status: $status, date: $date) {
      ...AdScheduleInfoFields
    }
  }
  ${AD_SCHEDULE_INFO_FRAGMENT}
`;

// Get external ad schedules (admin only)
export const GET_EXTERNAL_AD_SCHEDULES = gql`
  query GetExternalAdSchedules($externalAdId: ID, $status: ScheduleStatus, $date: String) {
    getExternalAdSchedules(externalAdId: $externalAdId, status: $status, date: $date) {
      id
      externalAdId
      scheduledDate
      status
      executedAt
      retryCount
      failureReason
      externalAd {
        id
        adTitle
        advertiserName
      }
      createdAt
      updatedAt
    }
  }
`;

// Get external ad with schedules (admin only)
export const GET_EXTERNAL_AD_WITH_SCHEDULES = gql`
  query GetExternalAdWithSchedules($externalAdId: ID!) {
    getExternalAdById(id: $externalAdId) {
      ...ExternalAdFields
      schedules {
        id
        scheduledDate
        status
        executedAt
        retryCount
        failureReason
      }
      scheduleStatistics {
        totalRuns
        successfulRuns
        failedRuns
        successRate
      }
    }
  }
  ${EXTERNAL_AD_FRAGMENT}
`;

// Get ad schedules with filters
export const GET_AD_SCHEDULES = gql`
  query GetAdSchedules($adId: ID, $status: ScheduleStatus, $date: String) {
    getAdSchedules(adId: $adId, status: $status, date: $date) {
      ...AdScheduleInfoFields
    }
  }
  ${AD_SCHEDULE_INFO_FRAGMENT}
`;

// Get upcoming schedules
export const GET_UPCOMING_SCHEDULES = gql`
  query GetUpcomingSchedules($limit: Int) {
    getUpcomingSchedules(limit: $limit) {
      ...AdScheduleFields
      ad {
        id
        title
        vendor {
          id
          businessName
        }
      }
      timeSlot {
        ...TimeSlotFields
      }
    }
  }
  ${AD_SCHEDULE_FRAGMENT}
  ${TIME_SLOT_FRAGMENT}
`;

// Get failed schedules
export const GET_FAILED_SCHEDULES = gql`
  query GetFailedSchedules($limit: Int) {
    getFailedSchedules(limit: $limit) {
      ...AdScheduleFields
      ad {
        id
        title
        vendor {
          id
          businessName
        }
      }
      timeSlot {
        ...TimeSlotFields
      }
    }
  }
  ${AD_SCHEDULE_FRAGMENT}
  ${TIME_SLOT_FRAGMENT}
`;

// Get ad with time slots and schedule information
export const GET_AD_WITH_TIME_SLOTS = gql`
  query GetAdWithTimeSlots($adId: ID!) {
    getAdRequestById(id: $adId) {
      ...AdRequestFields
      timeSlots {
        ...TimeSlotFields
      }
      currentSchedule {
        ...AdScheduleFields
      }
      totalScheduledRuns
      successfulRuns
      failedRuns
    }
  }
  ${AD_REQUEST_FRAGMENT}
  ${TIME_SLOT_FRAGMENT}
  ${AD_SCHEDULE_FRAGMENT}
`;

// Get service ad with complete schedule information
export const GET_SERVICE_AD_WITH_SCHEDULES = gql`
  query GetServiceAdWithSchedules($adId: ID!) {
    getServiceAdById(id: $adId) {
      ...ServiceAdFields
      timeSlots {
        ...TimeSlotFields
      }
      schedules {
        ...AdScheduleFields
      }
      scheduleStatistics {
        totalRuns
        successfulRuns
        failedRuns
        successRate
        averageExecutionTime
      }
    }
  }
  ${SERVICE_AD_FRAGMENT}
  ${TIME_SLOT_FRAGMENT}
  ${AD_SCHEDULE_FRAGMENT}
`;

// ==================== TIME SLOT DASHBOARD QUERIES ====================

// Get complete time slot dashboard data
export const GET_TIME_SLOT_DASHBOARD = gql`
  query GetTimeSlotDashboard($date: String) {
    upcomingSchedules: getUpcomingSchedules(limit: 10) {
      ...AdScheduleFields
      ad {
        id
        title
        vendor {
          businessName
        }
      }
      timeSlot {
        startTime
        endTime
      }
    }
    failedSchedules: getFailedSchedules(limit: 5) {
      ...AdScheduleFields
      ad {
        id
        title
        vendor {
          businessName
        }
      }
    }
    todaySchedules: getAdSchedules(date: $date, status: Scheduled) {
      ...AdScheduleInfoFields
    }
    runningSchedules: getAdSchedules(status: Running) {
      ...AdScheduleInfoFields
    }
  }
  ${AD_SCHEDULE_FRAGMENT}
  ${AD_SCHEDULE_INFO_FRAGMENT}
`;

// Get schedule analytics for a specific period
export const GET_SCHEDULE_ANALYTICS = gql`
  query GetScheduleAnalytics($startDate: String!, $endDate: String!, $adId: ID) {
    getScheduleAnalytics(startDate: $startDate, endDate: $endDate, adId: $adId) {
      totalSchedules
      completedSchedules
      failedSchedules
      cancelledSchedules
      successRate
      averageExecutionTime
      peakHours {
        hour
        scheduleCount
      }
      dailyStats {
        date
        totalSchedules
        successfulSchedules
        failedSchedules
      }
      adPerformance {
        adId
        adTitle
        totalRuns
        successRate
        averagePerformance
      }
    }
  }
`;

// ==================== ADMIN ANALYTICS & REPORTING ====================

// Get comprehensive ad analytics by type (admin only)
export const GET_AD_ANALYTICS_BY_TYPE = gql`
  query GetAdAnalyticsByType($adType: String!, $startDate: String, $endDate: String) {
    getAdAnalyticsByType(adType: $adType, startDate: $startDate, endDate: $endDate) {
      adType
      totalAds
      activeAds
      totalImpressions
      totalClicks
      totalConversions
      averageCTR
      averageConversionRate
      totalRevenue
      averageRevenue
      topPerformingAds {
        id
        title
        impressions
        clicks
        conversions
        revenue
      }
      dailyStats {
        date
        impressions
        clicks
        conversions
        revenue
      }
    }
  }
`;

// Get vendor performance report (admin only)
export const GET_VENDOR_PERFORMANCE_REPORT = gql`
  query GetVendorPerformanceReport($vendorId: ID!, $startDate: String, $endDate: String) {
    getVendorPerformanceReport(vendorId: $vendorId, startDate: $startDate, endDate: $endDate) {
      vendor {
        id
        businessName
        email
        contactNumber
      }
      totalAdRequests
      approvedRequests
      rejectedRequests
      activeAds
      totalSpent
      totalImpressions
      totalClicks
      totalConversions
      averageCTR
      averageConversionRate
      adsByType {
        adType
        count
        totalRevenue
        performance
      }
      monthlyStats {
        month
        adCount
        revenue
        impressions
        clicks
      }
    }
  }
`;

// Get platform revenue report by ad type (admin only)
export const GET_PLATFORM_REVENUE_BY_TYPE = gql`
  query GetPlatformRevenueByType($startDate: String, $endDate: String) {
    getPlatformRevenueByType(startDate: $startDate, endDate: $endDate) {
      totalRevenue
      revenueByType {
        adType
        revenue
        adCount
        averageRevenue
        percentage
      }
      monthlyBreakdown {
        month
        sponsoredRevenue
        featuredRevenue
        externalRevenue
        totalRevenue
      }
      topRevenueGenerators {
        type
        identifier
        revenue
        adCount
      }
    }
  }
`;

// Get ad approval statistics (admin only)
export const GET_AD_APPROVAL_STATISTICS = gql`
  query GetAdApprovalStatistics($startDate: String, $endDate: String) {
    getAdApprovalStatistics(startDate: $startDate, endDate: $endDate) {
      totalRequests
      approvedRequests
      rejectedRequests
      pendingRequests
      approvalRate
      averageProcessingTime
      requestsByType {
        adType
        total
        approved
        rejected
        pending
      }
      dailyStats {
        date
        totalRequests
        approved
        rejected
      }
      adminPerformance {
        adminId
        adminName
        requestsProcessed
        averageProcessingTime
        approvalRate
      }
    }
  }
`;

// Get external ads performance report (admin only)
export const GET_EXTERNAL_ADS_PERFORMANCE = gql`
  query GetExternalAdsPerformance($startDate: String, $endDate: String) {
    getExternalAdsPerformance(startDate: $startDate, endDate: $endDate) {
      totalExternalAds
      activeExternalAds
      totalRevenue
      totalImpressions
      totalClicks
      averageCTR
      topPerformingAds {
        ...ExternalAdFields
        performanceMetrics {
          impressions
          clicks
          ctr
          revenue
        }
      }
      advertiserStats {
        advertiserName
        totalAds
        activeAds
        revenue
        impressions
        clicks
      }
      monthlyPerformance {
        month
        adCount
        revenue
        impressions
        clicks
        ctr
      }
    }
  }
  ${EXTERNAL_AD_FRAGMENT}
`;

// ==================== COMBINED TIME SLOT QUERIES ====================

// Get vendor's ads with their time slots and schedules
export const GET_VENDOR_ADS_WITH_SCHEDULES = gql`
  query GetVendorAdsWithSchedules {
    myActiveAds: getMyActiveAds {
      ...ServiceAdFields
      timeSlots {
        ...TimeSlotFields
      }
      upcomingSchedules: schedules(status: Scheduled) {
        ...AdScheduleFields
      }
      runningSchedules: schedules(status: Running) {
        ...AdScheduleFields
      }
    }
  }
  ${SERVICE_AD_FRAGMENT}
  ${TIME_SLOT_FRAGMENT}
  ${AD_SCHEDULE_FRAGMENT}
`;

// Get admin overview of all schedules
export const GET_ADMIN_SCHEDULE_OVERVIEW = gql`
  query GetAdminScheduleOverview($date: String) {
    allSchedules: getAdSchedules(date: $date) {
      ...AdScheduleInfoFields
    }
    pendingSchedules: getAdSchedules(status: Scheduled) {
      ...AdScheduleInfoFields
    }
    failedSchedules: getFailedSchedules(limit: 20) {
      ...AdScheduleFields
      ad {
        title
        vendor {
          businessName
        }
      }
    }
    availableSlots: getAvailableTimeSlots(date: $date) {
      ...TimeSlotAvailabilityFields
    }
  }
  ${AD_SCHEDULE_INFO_FRAGMENT}
  ${AD_SCHEDULE_FRAGMENT}
  ${TIME_SLOT_AVAILABILITY_FRAGMENT}
`;
