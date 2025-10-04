"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET_ADS_BY_AD_TYPE = exports.GET_ADS_BY_ENTITY_TYPE = exports.GET_HOME_PAGE_ADS = exports.GET_FEATURED_ADS_DASHBOARD = exports.GET_SPONSORED_ADS_DASHBOARD = exports.GET_EXTERNAL_ADS_DASHBOARD = exports.GET_ADMIN_ADS_MANAGEMENT_DASHBOARD = exports.GET_ADMIN_COMPLETE_OVERVIEW = exports.GET_ADMIN_AD_DASHBOARD = exports.GET_VENDOR_AD_DASHBOARD = exports.GET_REVENUE_ANALYTICS = exports.GET_TOP_PERFORMING_ADS = exports.GET_DASHBOARD_STATS = exports.GET_AD_ANALYTICS = exports.GET_PAYMENT_BY_ID = exports.GET_AD_PAYMENTS = exports.GET_SERVICE_ADS_BY_TYPE = exports.GET_AD_REQUESTS_BY_TYPE = exports.GET_EXPIRED_EXTERNAL_ADS = exports.GET_EXPIRED_FEATURED_ADS = exports.GET_EXPIRED_SPONSORED_ADS = exports.GET_ALL_RUNNING_EXTERNAL_ADS = exports.GET_ALL_RUNNING_FEATURED_ADS = exports.GET_ALL_RUNNING_SPONSORED_ADS = exports.GET_PENDING_FEATURED_REQUESTS = exports.GET_PENDING_SPONSORED_REQUESTS = exports.GET_ALL_FEATURED_AD_REQUESTS = exports.GET_ALL_SPONSORED_AD_REQUESTS = exports.GET_EXTERNAL_AD_BY_ID = exports.GET_EXTERNAL_ADS = exports.GET_PENDING_AD_REQUESTS = exports.GET_ALL_SERVICE_ADS = exports.GET_ALL_AD_REQUESTS = exports.GET_MY_PAYMENTS = exports.GET_AD_REQUEST_BY_ID = exports.GET_MY_ACTIVE_ADS = exports.GET_MY_AD_REQUESTS = exports.GET_SPONSORED_ADS = exports.GET_FEATURED_ADS = exports.GET_ACTIVE_EXTERNAL_ADS = exports.GET_ACTIVE_ADS = exports.AD_SCHEDULE_INFO_FRAGMENT = exports.TIME_SLOT_AVAILABILITY_FRAGMENT = exports.AD_SCHEDULE_FRAGMENT = exports.TIME_SLOT_FRAGMENT = exports.AD_ANALYTICS_FRAGMENT = exports.AD_PAYMENT_FRAGMENT = exports.EXTERNAL_AD_FRAGMENT = exports.SERVICE_AD_FRAGMENT = exports.AD_REQUEST_FRAGMENT = void 0;
exports.GET_ADMIN_SCHEDULE_OVERVIEW = exports.GET_VENDOR_ADS_WITH_SCHEDULES = exports.GET_EXTERNAL_ADS_PERFORMANCE = exports.GET_AD_APPROVAL_STATISTICS = exports.GET_PLATFORM_REVENUE_BY_TYPE = exports.GET_VENDOR_PERFORMANCE_REPORT = exports.GET_AD_ANALYTICS_BY_TYPE = exports.GET_SCHEDULE_ANALYTICS = exports.GET_TIME_SLOT_DASHBOARD = exports.GET_SERVICE_AD_WITH_SCHEDULES = exports.GET_AD_WITH_TIME_SLOTS = exports.GET_FAILED_SCHEDULES = exports.GET_UPCOMING_SCHEDULES = exports.GET_AD_SCHEDULES = exports.GET_EXTERNAL_AD_WITH_SCHEDULES = exports.GET_EXTERNAL_AD_SCHEDULES = exports.GET_SCHEDULES_BY_AD_TYPE = exports.GET_AVAILABLE_EXTERNAL_TIME_SLOTS = exports.GET_AVAILABLE_FEATURED_TIME_SLOTS = exports.GET_AVAILABLE_SPONSORED_TIME_SLOTS = exports.GET_AVAILABLE_TIME_SLOTS = exports.GET_PLATFORM_STATISTICS_OVERVIEW = exports.GET_VENDOR_ACTIVITY_SUMMARY = exports.GET_ADS_REQUIRING_ATTENTION = exports.GET_ADS_BY_DATE_RANGE = exports.SEARCH_ADS_GLOBAL = exports.GET_ADMIN_REQUESTS_FILTERED = exports.GET_VENDOR_REQUESTS_BY_STATUS = void 0;
const client_1 = require("@apollo/client");
// ==================== FRAGMENT DEFINITIONS ====================
exports.AD_REQUEST_FRAGMENT = (0, client_1.gql) `
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
exports.SERVICE_AD_FRAGMENT = (0, client_1.gql) `
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
exports.EXTERNAL_AD_FRAGMENT = (0, client_1.gql) `
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
exports.AD_PAYMENT_FRAGMENT = (0, client_1.gql) `
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
exports.AD_ANALYTICS_FRAGMENT = (0, client_1.gql) `
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
exports.TIME_SLOT_FRAGMENT = (0, client_1.gql) `
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
exports.AD_SCHEDULE_FRAGMENT = (0, client_1.gql) `
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
exports.TIME_SLOT_AVAILABILITY_FRAGMENT = (0, client_1.gql) `
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
exports.AD_SCHEDULE_INFO_FRAGMENT = (0, client_1.gql) `
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
  ${exports.TIME_SLOT_FRAGMENT}
  ${exports.AD_SCHEDULE_FRAGMENT}
`;
// ==================== PUBLIC QUERIES ====================
// Get active ads visible to all users
exports.GET_ACTIVE_ADS = (0, client_1.gql) `
  query GetActiveAds($adType: AdType, $entityType: EntityType) {
    getActiveAds(adType: $adType, entityType: $entityType) {
      ...ServiceAdFields
    }
  }
  ${exports.SERVICE_AD_FRAGMENT}
`;
// Get active external ads
exports.GET_ACTIVE_EXTERNAL_ADS = (0, client_1.gql) `
  query GetActiveExternalAds {
    getActiveExternalAds {
      ...ExternalAdFields
    }
  }
  ${exports.EXTERNAL_AD_FRAGMENT}
`;
// Get featured ads for homepage
exports.GET_FEATURED_ADS = (0, client_1.gql) `
  query GetFeaturedAds {
    getFeaturedAds {
      ...ServiceAdFields
    }
  }
  ${exports.SERVICE_AD_FRAGMENT}
`;
// Get sponsored ads for promotions
exports.GET_SPONSORED_ADS = (0, client_1.gql) `
  query GetSponsoredAds {
    getSponsoredAds {
      ...ServiceAdFields
    }
  }
  ${exports.SERVICE_AD_FRAGMENT}
`;
// ==================== VENDOR QUERIES ====================
// Get vendor's ad requests
exports.GET_MY_AD_REQUESTS = (0, client_1.gql) `
  query GetMyAdRequests($status: RequestStatus) {
    getMyAdRequests(status: $status) {
      ...AdRequestFields
    }
  }
  ${exports.AD_REQUEST_FRAGMENT}
`;
// Get vendor's active ads
exports.GET_MY_ACTIVE_ADS = (0, client_1.gql) `
  query GetMyActiveAds {
    getMyActiveAds {
      ...ServiceAdFields
    }
  }
  ${exports.SERVICE_AD_FRAGMENT}
`;
// Get specific ad request by ID
exports.GET_AD_REQUEST_BY_ID = (0, client_1.gql) `
  query GetAdRequestById($id: ID!) {
    getAdRequestById(id: $id) {
      ...AdRequestFields
    }
  }
  ${exports.AD_REQUEST_FRAGMENT}
`;
// Get vendor's payment history
exports.GET_MY_PAYMENTS = (0, client_1.gql) `
  query GetMyPayments {
    getMyPayments {
      ...AdPaymentFields
    }
  }
  ${exports.AD_PAYMENT_FRAGMENT}
`;
// ==================== ADMIN QUERIES ====================
// Get all ad requests (admin only)
exports.GET_ALL_AD_REQUESTS = (0, client_1.gql) `
  query GetAllAdRequests($status: RequestStatus, $vendorId: ID) {
    getAllAdRequests(status: $status, vendorId: $vendorId) {
      ...AdRequestFields
    }
  }
  ${exports.AD_REQUEST_FRAGMENT}
`;
// Get all service ads (admin only)
exports.GET_ALL_SERVICE_ADS = (0, client_1.gql) `
  query GetAllServiceAds($status: ServiceAdStatus, $vendorId: ID) {
    getAllServiceAds(status: $status, vendorId: $vendorId) {
      ...ServiceAdFields
    }
  }
  ${exports.SERVICE_AD_FRAGMENT}
`;
// Get pending ad requests for admin review
exports.GET_PENDING_AD_REQUESTS = (0, client_1.gql) `
  query GetPendingAdRequests {
    getPendingAdRequests {
      ...AdRequestFields
    }
  }
  ${exports.AD_REQUEST_FRAGMENT}
`;
// Get external ads (admin only)
exports.GET_EXTERNAL_ADS = (0, client_1.gql) `
  query GetExternalAds($status: ExternalAdStatus) {
    getExternalAds(status: $status) {
      ...ExternalAdFields
    }
  }
  ${exports.EXTERNAL_AD_FRAGMENT}
`;
// Get external ad by ID (admin only)
exports.GET_EXTERNAL_AD_BY_ID = (0, client_1.gql) `
  query GetExternalAdById($id: ID!) {
    getExternalAdById(id: $id) {
      ...ExternalAdFields
    }
  }
  ${exports.EXTERNAL_AD_FRAGMENT}
`;
// ==================== ADMIN AD TYPE MANAGEMENT ====================
// Get all sponsored ads requests (admin only)
exports.GET_ALL_SPONSORED_AD_REQUESTS = (0, client_1.gql) `
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
  ${exports.AD_REQUEST_FRAGMENT}
`;
// Get all featured ads requests (admin only)
exports.GET_ALL_FEATURED_AD_REQUESTS = (0, client_1.gql) `
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
  ${exports.AD_REQUEST_FRAGMENT}
`;
// Get pending sponsored ad requests (admin only)
exports.GET_PENDING_SPONSORED_REQUESTS = (0, client_1.gql) `
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
  ${exports.AD_REQUEST_FRAGMENT}
`;
// Get pending featured ad requests (admin only)
exports.GET_PENDING_FEATURED_REQUESTS = (0, client_1.gql) `
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
  ${exports.AD_REQUEST_FRAGMENT}
`;
// Get all running sponsored ads (admin only)
exports.GET_ALL_RUNNING_SPONSORED_ADS = (0, client_1.gql) `
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
  ${exports.SERVICE_AD_FRAGMENT}
`;
// Get all running featured ads (admin only)
exports.GET_ALL_RUNNING_FEATURED_ADS = (0, client_1.gql) `
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
  ${exports.SERVICE_AD_FRAGMENT}
`;
// Get all running external ads (admin only)
exports.GET_ALL_RUNNING_EXTERNAL_ADS = (0, client_1.gql) `
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
  ${exports.EXTERNAL_AD_FRAGMENT}
`;
// Get expired sponsored ads (admin only)
exports.GET_EXPIRED_SPONSORED_ADS = (0, client_1.gql) `
  query GetExpiredSponsoredAds($limit: Int) {
    getExpiredSponsoredAds(limit: $limit) {
      ...ServiceAdFields
      vendor {
        id
        businessName
      }
    }
  }
  ${exports.SERVICE_AD_FRAGMENT}
`;
// Get expired featured ads (admin only)
exports.GET_EXPIRED_FEATURED_ADS = (0, client_1.gql) `
  query GetExpiredFeaturedAds($limit: Int) {
    getExpiredFeaturedAds(limit: $limit) {
      ...ServiceAdFields
      vendor {
        id
        businessName
      }
    }
  }
  ${exports.SERVICE_AD_FRAGMENT}
`;
// Get expired external ads (admin only)
exports.GET_EXPIRED_EXTERNAL_ADS = (0, client_1.gql) `
  query GetExpiredExternalAds($limit: Int) {
    getExpiredExternalAds(limit: $limit) {
      ...ExternalAdFields
    }
  }
  ${exports.EXTERNAL_AD_FRAGMENT}
`;
// Get ad requests by ad type (admin only)
exports.GET_AD_REQUESTS_BY_TYPE = (0, client_1.gql) `
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
  ${exports.AD_REQUEST_FRAGMENT}
`;
// Get service ads by ad type (admin only)
exports.GET_SERVICE_ADS_BY_TYPE = (0, client_1.gql) `
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
  ${exports.SERVICE_AD_FRAGMENT}
`;
// ==================== PAYMENT QUERIES ====================
// Get ad payments (admin only)
exports.GET_AD_PAYMENTS = (0, client_1.gql) `
  query GetAdPayments($adId: ID, $externalAdId: ID) {
    getAdPayments(adId: $adId, externalAdId: $externalAdId) {
      ...AdPaymentFields
    }
  }
  ${exports.AD_PAYMENT_FRAGMENT}
`;
// Get payment by ID (admin only)
exports.GET_PAYMENT_BY_ID = (0, client_1.gql) `
  query GetPaymentById($id: ID!) {
    getPaymentById(id: $id) {
      ...AdPaymentFields
    }
  }
  ${exports.AD_PAYMENT_FRAGMENT}
`;
// ==================== ANALYTICS QUERIES ====================
// Get detailed analytics for a specific ad
exports.GET_AD_ANALYTICS = (0, client_1.gql) `
  query GetAdAnalytics($adId: ID!) {
    getAdAnalytics(adId: $adId) {
      ...AdAnalyticsFields
    }
  }
  ${exports.AD_ANALYTICS_FRAGMENT}
`;
// Get dashboard statistics (admin only)
exports.GET_DASHBOARD_STATS = (0, client_1.gql) `
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
exports.GET_TOP_PERFORMING_ADS = (0, client_1.gql) `
  query GetTopPerformingAds($limit: Int) {
    getTopPerformingAds(limit: $limit) {
      ...ServiceAdFields
    }
  }
  ${exports.SERVICE_AD_FRAGMENT}
`;
// Get revenue analytics (admin only)
exports.GET_REVENUE_ANALYTICS = (0, client_1.gql) `
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
  ${exports.SERVICE_AD_FRAGMENT}
`;
// ==================== COMBINED QUERIES ====================
// Get vendor dashboard data in one query
exports.GET_VENDOR_AD_DASHBOARD = (0, client_1.gql) `
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
  ${exports.AD_REQUEST_FRAGMENT}
  ${exports.SERVICE_AD_FRAGMENT}
  ${exports.AD_PAYMENT_FRAGMENT}
`;
// Get admin dashboard data in one query
exports.GET_ADMIN_AD_DASHBOARD = (0, client_1.gql) `
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
  ${exports.AD_REQUEST_FRAGMENT}
  ${exports.SERVICE_AD_FRAGMENT}
`;
// ==================== COMPREHENSIVE ADMIN DASHBOARDS ====================
// Get complete admin overview for all ad types
exports.GET_ADMIN_COMPLETE_OVERVIEW = (0, client_1.gql) `
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
  ${exports.AD_REQUEST_FRAGMENT}
  ${exports.SERVICE_AD_FRAGMENT}
  ${exports.EXTERNAL_AD_FRAGMENT}
`;
// Get admin ads management dashboard
exports.GET_ADMIN_ADS_MANAGEMENT_DASHBOARD = (0, client_1.gql) `
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
  ${exports.AD_REQUEST_FRAGMENT}
  ${exports.SERVICE_AD_FRAGMENT}
  ${exports.EXTERNAL_AD_FRAGMENT}
`;
// Get external ads management dashboard (admin only)
exports.GET_EXTERNAL_ADS_DASHBOARD = (0, client_1.gql) `
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
  ${exports.EXTERNAL_AD_FRAGMENT}
`;
// Get sponsored ads management dashboard (admin only)
exports.GET_SPONSORED_ADS_DASHBOARD = (0, client_1.gql) `
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
  ${exports.AD_REQUEST_FRAGMENT}
  ${exports.SERVICE_AD_FRAGMENT}
`;
// Get featured ads management dashboard (admin only)
exports.GET_FEATURED_ADS_DASHBOARD = (0, client_1.gql) `
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
  ${exports.AD_REQUEST_FRAGMENT}
  ${exports.SERVICE_AD_FRAGMENT}
`;
// Get home page ads data
exports.GET_HOME_PAGE_ADS = (0, client_1.gql) `
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
  ${exports.SERVICE_AD_FRAGMENT}
  ${exports.EXTERNAL_AD_FRAGMENT}
`;
// ==================== FILTERED QUERIES ====================
// Get ads by specific entity type
exports.GET_ADS_BY_ENTITY_TYPE = (0, client_1.gql) `
  query GetAdsByEntityType($entityType: EntityType!) {
    getActiveAds(entityType: $entityType) {
      ...ServiceAdFields
    }
  }
  ${exports.SERVICE_AD_FRAGMENT}
`;
// Get ads by specific ad type
exports.GET_ADS_BY_AD_TYPE = (0, client_1.gql) `
  query GetAdsByAdType($adType: AdType!) {
    getActiveAds(adType: $adType) {
      ...ServiceAdFields
    }
  }
  ${exports.SERVICE_AD_FRAGMENT}
`;
// Get vendor's requests by status
exports.GET_VENDOR_REQUESTS_BY_STATUS = (0, client_1.gql) `
  query GetVendorRequestsByStatus($status: RequestStatus!) {
    getMyAdRequests(status: $status) {
      ...AdRequestFields
    }
  }
  ${exports.AD_REQUEST_FRAGMENT}
`;
// Get admin requests by vendor and status
exports.GET_ADMIN_REQUESTS_FILTERED = (0, client_1.gql) `
  query GetAdminRequestsFiltered($status: RequestStatus, $vendorId: ID) {
    getAllAdRequests(status: $status, vendorId: $vendorId) {
      ...AdRequestFields
    }
  }
  ${exports.AD_REQUEST_FRAGMENT}
`;
// ==================== ADVANCED ADMIN FILTERING ====================
// Search ads across all types (admin only)
exports.SEARCH_ADS_GLOBAL = (0, client_1.gql) `
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
  ${exports.SERVICE_AD_FRAGMENT}
  ${exports.EXTERNAL_AD_FRAGMENT}
  ${exports.AD_REQUEST_FRAGMENT}
`;
// Get ads by date range (admin only)
exports.GET_ADS_BY_DATE_RANGE = (0, client_1.gql) `
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
  ${exports.SERVICE_AD_FRAGMENT}
  ${exports.EXTERNAL_AD_FRAGMENT}
`;
// Get ads requiring attention (admin only)
exports.GET_ADS_REQUIRING_ATTENTION = (0, client_1.gql) `
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
  ${exports.AD_REQUEST_FRAGMENT}
  ${exports.SERVICE_AD_FRAGMENT}
`;
// Get vendor activity summary (admin only)
exports.GET_VENDOR_ACTIVITY_SUMMARY = (0, client_1.gql) `
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
exports.GET_PLATFORM_STATISTICS_OVERVIEW = (0, client_1.gql) `
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
exports.GET_AVAILABLE_TIME_SLOTS = (0, client_1.gql) `
  query GetAvailableTimeSlots($date: String!, $adType: String) {
    getAvailableTimeSlots(date: $date, adType: $adType) {
      ...TimeSlotAvailabilityFields
    }
  }
  ${exports.TIME_SLOT_AVAILABILITY_FRAGMENT}
`;
// Get available time slots for sponsored ads
exports.GET_AVAILABLE_SPONSORED_TIME_SLOTS = (0, client_1.gql) `
  query GetAvailableSponsoredTimeSlots($date: String!) {
    getAvailableTimeSlots(date: $date, adType: "SPONSORED") {
      ...TimeSlotAvailabilityFields
    }
  }
  ${exports.TIME_SLOT_AVAILABILITY_FRAGMENT}
`;
// Get available time slots for featured ads
exports.GET_AVAILABLE_FEATURED_TIME_SLOTS = (0, client_1.gql) `
  query GetAvailableFeaturedTimeSlots($date: String!) {
    getAvailableTimeSlots(date: $date, adType: "FEATURED") {
      ...TimeSlotAvailabilityFields
    }
  }
  ${exports.TIME_SLOT_AVAILABILITY_FRAGMENT}
`;
// Get available time slots for external ads
exports.GET_AVAILABLE_EXTERNAL_TIME_SLOTS = (0, client_1.gql) `
  query GetAvailableExternalTimeSlots($date: String!) {
    getAvailableTimeSlots(date: $date, adType: "EXTERNAL") {
      ...TimeSlotAvailabilityFields
    }
  }
  ${exports.TIME_SLOT_AVAILABILITY_FRAGMENT}
`;
// Get schedules by ad type
exports.GET_SCHEDULES_BY_AD_TYPE = (0, client_1.gql) `
  query GetSchedulesByAdType($adType: String!, $status: ScheduleStatus, $date: String) {
    getSchedulesByAdType(adType: $adType, status: $status, date: $date) {
      ...AdScheduleInfoFields
    }
  }
  ${exports.AD_SCHEDULE_INFO_FRAGMENT}
`;
// Get external ad schedules (admin only)
exports.GET_EXTERNAL_AD_SCHEDULES = (0, client_1.gql) `
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
exports.GET_EXTERNAL_AD_WITH_SCHEDULES = (0, client_1.gql) `
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
  ${exports.EXTERNAL_AD_FRAGMENT}
`;
// Get ad schedules with filters
exports.GET_AD_SCHEDULES = (0, client_1.gql) `
  query GetAdSchedules($adId: ID, $status: ScheduleStatus, $date: String) {
    getAdSchedules(adId: $adId, status: $status, date: $date) {
      ...AdScheduleInfoFields
    }
  }
  ${exports.AD_SCHEDULE_INFO_FRAGMENT}
`;
// Get upcoming schedules
exports.GET_UPCOMING_SCHEDULES = (0, client_1.gql) `
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
  ${exports.AD_SCHEDULE_FRAGMENT}
  ${exports.TIME_SLOT_FRAGMENT}
`;
// Get failed schedules
exports.GET_FAILED_SCHEDULES = (0, client_1.gql) `
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
  ${exports.AD_SCHEDULE_FRAGMENT}
  ${exports.TIME_SLOT_FRAGMENT}
`;
// Get ad with time slots and schedule information
exports.GET_AD_WITH_TIME_SLOTS = (0, client_1.gql) `
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
  ${exports.AD_REQUEST_FRAGMENT}
  ${exports.TIME_SLOT_FRAGMENT}
  ${exports.AD_SCHEDULE_FRAGMENT}
`;
// Get service ad with complete schedule information
exports.GET_SERVICE_AD_WITH_SCHEDULES = (0, client_1.gql) `
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
  ${exports.SERVICE_AD_FRAGMENT}
  ${exports.TIME_SLOT_FRAGMENT}
  ${exports.AD_SCHEDULE_FRAGMENT}
`;
// ==================== TIME SLOT DASHBOARD QUERIES ====================
// Get complete time slot dashboard data
exports.GET_TIME_SLOT_DASHBOARD = (0, client_1.gql) `
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
  ${exports.AD_SCHEDULE_FRAGMENT}
  ${exports.AD_SCHEDULE_INFO_FRAGMENT}
`;
// Get schedule analytics for a specific period
exports.GET_SCHEDULE_ANALYTICS = (0, client_1.gql) `
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
exports.GET_AD_ANALYTICS_BY_TYPE = (0, client_1.gql) `
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
exports.GET_VENDOR_PERFORMANCE_REPORT = (0, client_1.gql) `
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
exports.GET_PLATFORM_REVENUE_BY_TYPE = (0, client_1.gql) `
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
exports.GET_AD_APPROVAL_STATISTICS = (0, client_1.gql) `
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
exports.GET_EXTERNAL_ADS_PERFORMANCE = (0, client_1.gql) `
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
  ${exports.EXTERNAL_AD_FRAGMENT}
`;
// ==================== COMBINED TIME SLOT QUERIES ====================
// Get vendor's ads with their time slots and schedules
exports.GET_VENDOR_ADS_WITH_SCHEDULES = (0, client_1.gql) `
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
  ${exports.SERVICE_AD_FRAGMENT}
  ${exports.TIME_SLOT_FRAGMENT}
  ${exports.AD_SCHEDULE_FRAGMENT}
`;
// Get admin overview of all schedules
exports.GET_ADMIN_SCHEDULE_OVERVIEW = (0, client_1.gql) `
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
  ${exports.AD_SCHEDULE_INFO_FRAGMENT}
  ${exports.AD_SCHEDULE_FRAGMENT}
  ${exports.TIME_SLOT_AVAILABILITY_FRAGMENT}
`;
