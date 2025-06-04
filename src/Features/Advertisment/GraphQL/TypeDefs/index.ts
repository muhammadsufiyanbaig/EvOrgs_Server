import { gql } from 'apollo-server-express';

export const adTypeDefs = gql`
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
    
    # ADMIN QUERIES - Admins can see everything
    getAllAdRequests(status: RequestStatus, vendorId: ID): [AdRequest!]!
    getAllServiceAds(status: ServiceAdStatus, vendorId: ID): [ServiceAd!]!
    getPendingAdRequests: [AdRequest!]!
    getExternalAds(status: ExternalAdStatus): [ExternalAd!]!
    getExternalAdById(id: ID!): ExternalAd
    
    # PAYMENT QUERIES
    getAdPayments(adId: ID, externalAdId: ID): [AdPayment!]!
    getPaymentById(id: ID!): AdPayment
    getMyPayments: [AdPayment!]!
    
    # ANALYTICS
    getAdAnalytics(adId: ID!): AdAnalytics
    getDashboardStats: DashboardStats
  }

  type Mutation {
    # VENDOR MUTATIONS - Request ads
    createAdRequest(input: CreateAdRequestInput!): AdRequest!
    updateAdRequest(id: ID!, input: UpdateAdRequestInput!): AdRequest!
    cancelAdRequest(id: ID!): Boolean!
    
    # ADMIN MUTATIONS - Approve/manage ads
    approveAdRequest(id: ID!, input: ApproveAdRequestInput!): ServiceAd!
    rejectAdRequest(id: ID!, adminNotes: String): AdRequest!
    reviewAdRequest(id: ID!, status: RequestStatus!, adminNotes: String): AdRequest!
    
    # ADMIN SERVICE AD MANAGEMENT
    pauseServiceAd(id: ID!): ServiceAd!
    resumeServiceAd(id: ID!): ServiceAd!
    cancelServiceAd(id: ID!): ServiceAd!
    extendServiceAd(id: ID!, newEndDate: String!): ServiceAd!
    
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
`;
