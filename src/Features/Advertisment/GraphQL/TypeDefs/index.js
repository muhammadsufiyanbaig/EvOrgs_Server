"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adTypeDefs = void 0;
const apollo_server_express_1 = require("apollo-server-express");
exports.adTypeDefs = (0, apollo_server_express_1.gql) `
  enum AdType {
    Featured
    Sponsored
    Premium
  }

  enum EntityType {
    Farmhouse
    Venue
    PhotographyPackage
    CateringPackage
  }

  enum RequestStatus {
    Pending
    Approved
    Rejected
    Under_Review
  }

  enum ServiceAdStatus {
    Scheduled
    Active
    Paused
    Expired
    Cancelled
  }

  enum ExternalAdStatus {
    Active
    Inactive
    Expired
  }

  enum PaymentStatus {
    Pending
    Paid
    Failed
    Refunded
  }

  enum PaymentMethod {
    CreditCard
    DebitCard
    BankTransfer
    MobilePayment
    Other
  }

  # AD REQUEST TYPE - Vendor requests to run ads
  type AdRequest {
    id: ID!
    vendorId: ID!
    adType: AdType!
    entityType: EntityType!
    entityId: ID!
    adTitle: String!
    adDescription: String
    adImage: String
    requestedPrice: Float!
    requestedStartDate: String!
    requestedEndDate: String!
    requestedDuration: Int!
    targetAudience: [String!]
    vendorNotes: String
    status: RequestStatus!
    adminNotes: String
    reviewedBy: ID
    reviewedAt: String
    createdAt: String!
    updatedAt: String!
  }

  # SERVICE AD TYPE - Active ads that users can see
  type ServiceAd {
    id: ID!
    requestId: ID!
    vendorId: ID!
    adType: AdType!
    entityType: EntityType!
    entityId: ID!
    adTitle: String!
    adDescription: String
    adImage: String
    finalPrice: Float!
    status: ServiceAdStatus!
    adminStartDate: String!
    adminEndDate: String!
    actualStartDate: String
    actualEndDate: String
    impressionCount: Int!
    clickCount: Int!
    conversionCount: Int!
    targetAudience: [String!]
    scheduledBy: ID!
    # NEW: Time slot fields
    timeSlots: [TimeSlot!]!
    currentSchedule: AdSchedule
    totalScheduledRuns: Int!
    successfulRuns: Int!
    failedRuns: Int!
    createdAt: String!
    updatedAt: String!
  }

  type ExternalAd {
    id: ID!
    advertiserName: String!
    advertiserEmail: String!
    advertiserPhone: String
    imageUrl: String!
    redirectUrl: String!
    adTitle: String!
    adDescription: String
    price: Float!
    status: ExternalAdStatus!
    startDate: String
    endDate: String
    impressionCount: Int!
    clickCount: Int!
    createdAt: String!
    updatedAt: String!
  }

  type AdPayment {
    id: ID!
    adId: ID
    externalAdId: ID
    vendorId: ID
    amountPaid: Float!
    paymentStatus: PaymentStatus!
    paymentMethod: PaymentMethod
    transactionId: String
    paidAt: String
    invoiceNumber: String
    createdAt: String!
    updatedAt: String!
  }

  # INPUT TYPES
  input CreateAdRequestInput {
    adType: AdType!
    entityType: EntityType!
    entityId: ID!
    adTitle: String!
    adDescription: String
    adImage: String
    requestedPrice: Float!
    requestedStartDate: String!
    requestedEndDate: String!
    targetAudience: [String!]
    vendorNotes: String
  }

  input UpdateAdRequestInput {
    adTitle: String
    adDescription: String
    adImage: String
    requestedPrice: Float
    requestedStartDate: String
    requestedEndDate: String
    targetAudience: [String!]
    vendorNotes: String
  }

  input ApproveAdRequestInput {
    finalPrice: Float!
    adminStartDate: String!
    adminEndDate: String!
    adminNotes: String
    # NEW: Time slot allocation
    timeSlots: [TimeSlotInput!]!
  }

  # NEW: Time slot types
  type TimeSlot {
    id: ID!
    startTime: String! # Format: "HH:MM"
    endTime: String!   # Format: "HH:MM"
    daysOfWeek: [Int!]! # 0-6 (Sunday-Saturday)
    priority: Int!      # 1-5 (1 = highest priority)
    isActive: Boolean!
    createdAt: String!
  }

  input TimeSlotInput {
    startTime: String! # Format: "HH:MM"
    endTime: String!   # Format: "HH:MM"
    daysOfWeek: [Int!]! # 0-6 (Sunday-Saturday)
    priority: Int!      # 1-5 (1 = highest priority)
  }

  # NEW: Time slot management types
  type TimeSlotAvailability {
    timeSlot: String! # "HH:MM-HH:MM"
    dayOfWeek: Int!
    isAvailable: Boolean!
    currentAd: ServiceAd
    conflictingAds: [ServiceAd!]!
  }

  type AdSchedule {
    id: ID!
    adId: ID!
    timeSlot: TimeSlot!
    scheduledDate: String!
    status: ScheduleStatus!
    executedAt: String
    failureReason: String
    retryCount: Int!
    nextRetry: String
    createdAt: String!
    updatedAt: String!
  }

  enum ScheduleStatus {
    Scheduled
    Running
    Completed
    Failed
    Cancelled
    Paused
  }

  # NEW: Missing input type for updateServiceAd mutation
  input UpdateServiceAdInput {
    adTitle: String
    adDescription: String
    adImage: String
    finalPrice: Float
    adminStartDate: String
    adminEndDate: String
    targetAudience: [String!]
  }

  input CreateExternalAdInput {
    advertiserName: String!
    advertiserEmail: String!
    advertiserPhone: String
    imageUrl: String!
    redirectUrl: String!
    adTitle: String!
    adDescription: String
    price: Float!
    startDate: String
    endDate: String
  }

  input UpdateExternalAdInput {
    advertiserName: String
    advertiserEmail: String
    advertiserPhone: String
    imageUrl: String
    redirectUrl: String
    adTitle: String
    adDescription: String
    price: Float
    status: ExternalAdStatus
    startDate: String
    endDate: String
  }

  input CreatePaymentInput {
    adId: ID
    externalAdId: ID
    amountPaid: Float!
    paymentMethod: PaymentMethod!
    transactionId: String
    invoiceNumber: String
  }

  type Query {
    # PUBLIC QUERIES - Users can see only active ads
    getActiveAds(adType: AdType, entityType: EntityType): [ServiceAd!]!
    getActiveExternalAds: [ExternalAd!]!
    getFeaturedAds: [ServiceAd!]!
    getSponsoredAds: [ServiceAd!]!
    
    # VENDOR QUERIES - Vendors can see their requests and ads
    getMyAdRequests(status: RequestStatus): [AdRequest!]!
    getMyActiveAds: [ServiceAd!]!
    getAdRequestById(id: ID!): AdRequest
    getMyPayments: [AdPayment!]!
    
    # ADMIN QUERIES - Admins can see everything
    getAllAdRequests(status: RequestStatus, vendorId: ID): [AdRequest!]!
    getAllServiceAds(status: ServiceAdStatus, vendorId: ID): [ServiceAd!]!
    getPendingAdRequests: [AdRequest!]!
    getExternalAds(status: ExternalAdStatus): [ExternalAd!]!
    getExternalAdById(id: ID!): ExternalAd
    
    # PAYMENT QUERIES
    getAdPayments(adId: ID, externalAdId: ID): [AdPayment!]!
    getPaymentById(id: ID!): AdPayment
    
    # ANALYTICS
    getAdAnalytics(adId: ID!): AdAnalytics
    getDashboardStats: DashboardStats
    getTopPerformingAds(limit: Int): [ServiceAd!]!
    getRevenueAnalytics(startDate: String, endDate: String): RevenueAnalytics
    
    # NEW: TIME SLOT QUERIES
    getAvailableTimeSlots(date: String!, adType: AdType): [TimeSlotAvailability!]!
    getAdSchedules(adId: ID, status: ScheduleStatus, date: String): [AdSchedule!]!
    getScheduleById(id: ID!): AdSchedule
    getUpcomingSchedules(limit: Int): [AdSchedule!]!
    getFailedSchedules(limit: Int): [AdSchedule!]!
    getTimeSlotConflicts(startDate: String!, endDate: String!): [TimeSlotAvailability!]!
    
    # VENDOR QUERIES - Vendors can see their requests and ads
    getMyAdRequests(status: RequestStatus): [AdRequest!]!
    getMyActiveAds: [ServiceAd!]!
    getAdRequestById(id: ID!): AdRequest
    getMyPayments: [AdPayment!]!
    
    # ADMIN QUERIES - Admins can see everything
    getAllAdRequests(status: RequestStatus, vendorId: ID): [AdRequest!]!
    getAllServiceAds(status: ServiceAdStatus, vendorId: ID): [ServiceAd!]!
    getPendingAdRequests: [AdRequest!]!
    getExternalAds(status: ExternalAdStatus): [ExternalAd!]!
    getExternalAdById(id: ID!): ExternalAd
    
    # PAYMENT QUERIES
    getAdPayments(adId: ID, externalAdId: ID): [AdPayment!]!
    getPaymentById(id: ID!): AdPayment
    
    # ANALYTICS
    getAdAnalytics(adId: ID!): AdAnalytics
    getDashboardStats: DashboardStats
    
    # NEW: Missing queries from resolvers
    getTopPerformingAds(limit: Int): [ServiceAd!]!
    getRevenueAnalytics(startDate: String, endDate: String): RevenueAnalytics
  }

  type Mutation {
    # VENDOR MUTATIONS - Request ads
    createAdRequest(input: CreateAdRequestInput!): AdRequest!
    updateAdRequest(id: ID!, input: UpdateAdRequestInput!): AdRequest!
    cancelAdRequest(id: ID!): Boolean!
    
    # ADMIN MUTATIONS - Approve/manage ads with time slots
    approveAdRequest(id: ID!, input: ApproveAdRequestInput!): ServiceAd!
    rejectAdRequest(id: ID!, adminNotes: String): AdRequest!
    reviewAdRequest(id: ID!, status: RequestStatus!, adminNotes: String): AdRequest!
    
    # ADMIN SERVICE AD MANAGEMENT
    pauseServiceAd(id: ID!): ServiceAd!
    resumeServiceAd(id: ID!): ServiceAd!
    cancelServiceAd(id: ID!): ServiceAd!
    extendServiceAd(id: ID!, newEndDate: String!): ServiceAd!
    activateServiceAd(id: ID!): ServiceAd!
    expireServiceAd(id: ID!): ServiceAd!
    updateServiceAd(id: ID!, input: UpdateServiceAdInput!): ServiceAd!
    
    # NEW: TIME SLOT MANAGEMENT MUTATIONS
    updateAdTimeSlots(adId: ID!, timeSlots: [TimeSlotInput!]!): ServiceAd!
    scheduleAdRun(adId: ID!, timeSlotId: ID!, scheduledDate: String!): AdSchedule!
    cancelScheduledRun(scheduleId: ID!): AdSchedule!
    rescheduleAdRun(scheduleId: ID!, newDate: String!, newTimeSlotId: ID): AdSchedule!
    pauseAdSchedule(adId: ID!): ServiceAd!
    resumeAdSchedule(adId: ID!): ServiceAd!
    retryFailedSchedule(scheduleId: ID!): AdSchedule!
    bulkScheduleAds(adIds: [ID!]!, timeSlots: [TimeSlotInput!]!, dateRange: String!): [AdSchedule!]!
    
    # EXTERNAL ADS (Admin only)
    createExternalAd(input: CreateExternalAdInput!): ExternalAd!
    updateExternalAd(id: ID!, input: UpdateExternalAdInput!): ExternalAd!
    deleteExternalAd(id: ID!): Boolean!
    
    # PAYMENTS
    createPayment(input: CreatePaymentInput!): AdPayment!
    updatePaymentStatus(id: ID!, status: PaymentStatus!): AdPayment!
    
    # AD INTERACTIONS (Public)
    recordImpression(adId: ID!, isExternal: Boolean!): Boolean!
    recordClick(adId: ID!, isExternal: Boolean!): Boolean!
    recordConversion(adId: ID!): Boolean!
    pauseServiceAd(id: ID!): ServiceAd!
    resumeServiceAd(id: ID!): ServiceAd!
    cancelServiceAd(id: ID!): ServiceAd!
    extendServiceAd(id: ID!, newEndDate: String!): ServiceAd!
    
    # NEW: Missing mutations from resolvers
    activateServiceAd(id: ID!): ServiceAd!
    expireServiceAd(id: ID!): ServiceAd!
    updateServiceAd(id: ID!, input: UpdateServiceAdInput!): ServiceAd!
    
    # EXTERNAL ADS (Admin only)
    createExternalAd(input: CreateExternalAdInput!): ExternalAd!
    updateExternalAd(id: ID!, input: UpdateExternalAdInput!): ExternalAd!
    deleteExternalAd(id: ID!): Boolean!
    
    # PAYMENTS
    createPayment(input: CreatePaymentInput!): AdPayment!
    updatePaymentStatus(id: ID!, status: PaymentStatus!): AdPayment!
    
    # AD INTERACTIONS (Public)
    recordImpression(adId: ID!, isExternal: Boolean!): Boolean!
    recordClick(adId: ID!, isExternal: Boolean!): Boolean!
    recordConversion(adId: ID!): Boolean!
  }

  type AdAnalytics {
    impressions: Int!
    clicks: Int!
    conversions: Int!
    ctr: Float! # Click-through rate
    conversionRate: Float!
    totalSpent: Float!
    averageDailyCost: Float!
    daysActive: Int!
  }

  type DashboardStats {
    totalAdRequests: Int!
    pendingRequests: Int!
    activeAds: Int!
    totalRevenue: Float!
    totalImpressions: Int!
    totalClicks: Int!
    averageCTR: Float!
  }

  # NEW: Missing type for revenue analytics
  type RevenueAnalytics {
    totalRevenue: Float!
    dailyRevenue: [DailyRevenue!]!
    averageDailyRevenue: Float!
    revenueGrowth: Float!
    topRevenueAds: [ServiceAd!]!
  }

  # NEW: Supporting type for daily revenue data
  type DailyRevenue {
    date: String!
    revenue: Float!
    adCount: Int!
  }
`;
