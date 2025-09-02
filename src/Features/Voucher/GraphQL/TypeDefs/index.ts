// src/Features/Vouchers/TypeDefs/index.ts
import { gql } from 'apollo-server-express';

export const voucherTypeDefs = gql`
  enum DiscountType {
    PERCENTAGE
    FIXED_AMOUNT
  }

  enum ApplicableFor {
    ALL_SERVICES
    SPECIFIC_SERVICES
  }

  enum ServiceType {
    FARMHOUSE
    VENUE
    CATERING
    PHOTOGRAPHY
  }

  type Voucher {
    id: ID!
    vendorId: ID!
    couponCode: String!
    title: String!
    description: String
    discountType: DiscountType!
    discountValue: Float!
    maxDiscountAmount: Float
    minOrderValue: Float
    applicableFor: ApplicableFor!
    serviceTypes: [ServiceType!]
    specificServiceIds: [ID!]
    totalUsageLimit: Int
    usagePerUser: Int!
    currentUsageCount: Int!
    validFrom: String!
    validUntil: String!
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type VoucherUsage {
    id: ID!
    voucherId: ID!
    userId: ID!
    bookingId: ID!
    originalAmount: Float!
    discountAmount: Float!
    finalAmount: Float!
    serviceType: ServiceType!
    serviceId: ID!
    appliedAt: String!
    voucher: Voucher
    user: User
  }

  type VoucherValidationResult {
    isValid: Boolean!
    voucher: Voucher
    discountAmount: Float
    finalAmount: Float
    error: String
  }

  input CreateVoucherInput {
    couponCode: String!
    title: String!
    description: String
    discountType: DiscountType!
    discountValue: Float!
    maxDiscountAmount: Float
    minOrderValue: Float
    applicableFor: ApplicableFor!
    serviceTypes: [ServiceType!]
    specificServiceIds: [ID!]
    totalUsageLimit: Int
    usagePerUser: Int
    validFrom: String!
    validUntil: String!
  }

  input UpdateVoucherInput {
    id: ID!
    couponCode: String
    title: String
    description: String
    discountType: DiscountType
    discountValue: Float
    maxDiscountAmount: Float
    minOrderValue: Float
    applicableFor: ApplicableFor
    serviceTypes: [ServiceType!]
    specificServiceIds: [ID!]
    totalUsageLimit: Int
    usagePerUser: Int
    validFrom: String
    validUntil: String
    isActive: Boolean
  }

  input ValidateVoucherInput {
    couponCode: String!
    vendorId: ID!
    serviceType: ServiceType!
    serviceId: ID!
    orderAmount: Float!
  }

  input ApplyVoucherInput {
    couponCode: String!
    vendorId: ID!
    bookingId: ID!
    serviceType: ServiceType!
    serviceId: ID!
    originalAmount: Float!
  }

  input VoucherFilters {
    vendorId: ID
    isActive: Boolean
    serviceType: ServiceType
    validNow: Boolean
    couponCode: String
  }

  input VoucherUsageFilters {
    voucherId: ID
    userId: ID
    serviceType: ServiceType
    dateFrom: String
    dateTo: String
  }

  type Query {
    # Get vouchers (vendor-specific or admin can see all)
    getVouchers(filters: VoucherFilters): [Voucher!]!
    
    # Get single voucher by ID
    getVoucher(id: ID!): Voucher
    
    # Get voucher by coupon code
    getVoucherByCouponCode(couponCode: String!, vendorId: ID!): Voucher
    
    # Validate voucher before applying
    validateVoucher(input: ValidateVoucherInput!): VoucherValidationResult!
    
    # Get voucher usage history
    getVoucherUsage(filters: VoucherUsageFilters): [VoucherUsage!]!
    
    # Get user's voucher usage history
    getUserVoucherUsage(voucherId: ID): [VoucherUsage!]!
    
    # Get vendor's voucher statistics
    getVoucherStatistics(vendorId: ID, dateFrom: String, dateTo: String): VoucherStatistics!
    
    # ========== ADMIN-ONLY QUERIES ==========
    
    # Get all vouchers across all vendors with advanced filtering
    adminGetAllVouchers(filters: AdminVoucherFilters, pagination: VoucherPaginationInput): VoucherListResponse!
    
    # Get comprehensive system-wide voucher analytics
    adminGetVoucherAnalytics(dateFrom: String, dateTo: String): AdminVoucherAnalytics!
    
    # Get flagged or suspicious voucher activities
    adminGetFlaggedVouchers(flagType: FlagType): [FlaggedVoucher!]!
    
    # Get vendor voucher performance comparison
    adminGetVendorVoucherComparison(vendorIds: [ID!], dateFrom: String, dateTo: String): [VendorVoucherPerformance!]!
    
    # Get voucher fraud detection reports
    adminGetVoucherFraudReports(dateFrom: String, dateTo: String): [VoucherFraudReport!]!
    
    # Get expired vouchers that can be cleaned up
    adminGetExpiredVouchers(daysOld: Int): [Voucher!]!
    
    # Get voucher usage trends and patterns
    adminGetVoucherTrends(period: TrendPeriod, groupBy: TrendGroupBy): VoucherTrendAnalysis!
    
    # Get vendor voucher compliance report
    adminGetVoucherComplianceReport(vendorId: ID): VoucherComplianceReport!
  }

  type Mutation {
    # Create new voucher (vendor only)
    createVoucher(input: CreateVoucherInput!): Voucher!
    
    # Update voucher (vendor only)
    updateVoucher(input: UpdateVoucherInput!): Voucher!
    
    # Delete voucher (vendor only)
    deleteVoucher(id: ID!): Boolean!
    
    # Toggle voucher status
    toggleVoucherStatus(id: ID!): Voucher!
    
    # Apply voucher to booking (user only)
    applyVoucher(input: ApplyVoucherInput!): VoucherUsage!
    
    # Admin: Deactivate voucher
    deactivateVoucher(id: ID!): Voucher!
    
    # ========== ADMIN-ONLY MUTATIONS ==========
    
    # Force create voucher for any vendor (admin override)
    adminCreateVoucher(vendorId: ID!, input: CreateVoucherInput!): Voucher!
    
    # Update any voucher regardless of vendor (admin override)
    adminUpdateVoucher(input: UpdateVoucherInput!): Voucher!
    
    # Force delete any voucher (admin override)
    adminForceDeleteVoucher(id: ID!, reason: String!): Boolean!
    
    # Bulk operations for vouchers
    adminBulkUpdateVouchers(voucherIds: [ID!]!, updates: BulkVoucherUpdateInput!): [Voucher!]!
    adminBulkDeactivateVouchers(voucherIds: [ID!]!, reason: String!): Int!
    
    # Suspend vendor's voucher privileges
    adminSuspendVendorVouchers(vendorId: ID!, reason: String!, duration: Int): Boolean!
    adminRestoreVendorVouchers(vendorId: ID!): Boolean!
    
    # Override voucher limits and restrictions
    adminOverrideVoucherLimits(voucherId: ID!, newLimits: VoucherLimitOverride!): Voucher!
    
    # Mark voucher usage as fraudulent
    adminMarkVoucherUsageAsFraud(usageId: ID!, reason: String!): VoucherUsage!
    
    # Refund voucher usage (creates refund record)
    adminRefundVoucherUsage(usageId: ID!, reason: String!, refundAmount: Float): VoucherRefund!
    
    # System maintenance operations
    adminCleanupExpiredVouchers(daysOld: Int!): Int!
    adminRecalculateVoucherStatistics(vendorId: ID): Boolean!
    
    # Create system-wide promotional vouchers
    adminCreateSystemPromotion(input: SystemPromotionInput!): [Voucher!]!
    
    # Emergency operations
    adminEmergencyDisableAllVouchers(reason: String!): Boolean!
    adminEmergencyEnableAllVouchers: Boolean!
  }

  type VoucherStatistics {
    totalVouchers: Int!
    activeVouchers: Int!
    totalUsage: Int!
    totalDiscountGiven: Float!
    topPerformingVouchers: [VoucherPerformance!]!
  }

  type VoucherPerformance {
    voucher: Voucher!
    usageCount: Int!
    totalDiscountGiven: Float!
    totalSavings: Float!
  }

  # Subscriptions for real-time updates
  type Subscription {
    voucherUsed(vendorId: ID!): VoucherUsage!
    voucherCreated(vendorId: ID!): Voucher!
    voucherUpdated(vendorId: ID!): Voucher!
    
    # Admin-only subscriptions
    adminVoucherFraudAlert: VoucherFraudAlert!
    adminVoucherSystemAlert(alertType: SystemAlertType!): VoucherSystemAlert!
  }

  # ========== ADMIN-SPECIFIC TYPES ==========
  
  enum FlagType {
    HIGH_USAGE
    SUSPICIOUS_PATTERN
    FRAUD_DETECTED
    POLICY_VIOLATION
    EXPIRED_OVERUSE
  }
  
  enum TrendPeriod {
    DAILY
    WEEKLY
    MONTHLY
    QUARTERLY
    YEARLY
  }
  
  enum TrendGroupBy {
    VENDOR
    SERVICE_TYPE
    DISCOUNT_TYPE
    TIME_PERIOD
  }
  
  enum SystemAlertType {
    FRAUD_DETECTION
    SYSTEM_OVERLOAD
    POLICY_VIOLATION
    MAINTENANCE_REQUIRED
  }
  
  type AdminVoucherAnalytics {
    totalSystemVouchers: Int!
    totalSystemUsage: Int!
    totalSystemDiscountGiven: Float!
    totalSystemRevenueLost: Float!
    averageDiscountPerVoucher: Float!
    topPerformingVendors: [VendorPerformance!]!
    voucherDistributionByType: [VoucherTypeDistribution!]!
    monthlyTrends: [MonthlyVoucherTrend!]!
    fraudulentUsageCount: Int!
    suspiciousActivities: [SuspiciousActivity!]!
  }
  
  type VendorPerformance {
    vendorId: ID!
    vendorName: String!
    totalVouchers: Int!
    totalUsage: Int!
    totalDiscountGiven: Float!
    averageVoucherValue: Float!
    successRate: Float!
  }
  
  type VoucherTypeDistribution {
    discountType: DiscountType!
    count: Int!
    totalValue: Float!
    percentage: Float!
  }
  
  type MonthlyVoucherTrend {
    month: String!
    year: Int!
    vouchersCreated: Int!
    vouchersUsed: Int!
    totalDiscountGiven: Float!
    uniqueUsers: Int!
  }
  
  type SuspiciousActivity {
    id: ID!
    type: FlagType!
    description: String!
    voucherId: ID
    userId: ID
    vendorId: ID
    severity: Int!
    detectedAt: String!
    status: String!
  }
  
  type FlaggedVoucher {
    voucher: Voucher!
    flagType: FlagType!
    flagReason: String!
    flaggedAt: String!
    severity: Int!
    investigationStatus: String!
    investigatorId: ID
  }
  
  type VendorVoucherPerformance {
    vendorId: ID!
    vendorName: String!
    totalVouchers: Int!
    activeVouchers: Int!
    totalUsage: Int!
    totalDiscountGiven: Float!
    averageUsagePerVoucher: Float!
    topPerformingVoucher: Voucher
    conversionRate: Float!
    fraudIncidents: Int!
  }
  
  type VoucherFraudReport {
    id: ID!
    voucherId: ID!
    userId: ID!
    vendorId: ID!
    fraudType: String!
    description: String!
    detectedAt: String!
    investigatedAt: String
    status: String!
    investigatorId: ID
    refundAmount: Float
    voucher: Voucher!
    user: User
  }
  
  type VoucherTrendAnalysis {
    period: TrendPeriod!
    groupBy: TrendGroupBy!
    dataPoints: [TrendDataPoint!]!
    summary: TrendSummary!
  }
  
  type TrendDataPoint {
    label: String!
    value: Float!
    count: Int!
    date: String
    percentage: Float!
  }
  
  type TrendSummary {
    totalCount: Int!
    totalValue: Float!
    averageValue: Float!
    growthRate: Float!
    peakPeriod: String!
  }
  
  type VoucherComplianceReport {
    vendorId: ID!
    vendorName: String!
    totalVouchers: Int!
    compliantVouchers: Int!
    violationCount: Int!
    complianceScore: Float!
    violations: [ComplianceViolation!]!
    recommendations: [String!]!
  }
  
  type ComplianceViolation {
    voucherId: ID!
    violationType: String!
    description: String!
    severity: String!
    detectedAt: String!
    resolved: Boolean!
  }
  
  type VoucherListResponse {
    vouchers: [Voucher!]!
    totalCount: Int!
    currentPage: Int!
    totalPages: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }
  
  type VoucherRefund {
    id: ID!
    voucherUsageId: ID!
    refundAmount: Float!
    reason: String!
    processedBy: ID!
    processedAt: String!
    status: String!
    voucherUsage: VoucherUsage!
  }
  
  type VoucherFraudAlert {
    id: ID!
    voucherId: ID!
    userId: ID
    vendorId: ID!
    alertType: String!
    description: String!
    severity: Int!
    triggeredAt: String!
    voucher: Voucher!
  }
  
  type VoucherSystemAlert {
    id: ID!
    alertType: SystemAlertType!
    message: String!
    severity: Int!
    timestamp: String!
    affectedVouchers: Int
    affectedVendors: Int
    requiresAction: Boolean!
  }

  # ========== ADMIN INPUT TYPES ==========
  
  input AdminVoucherFilters {
    vendorId: ID
    vendorIds: [ID!]
    isActive: Boolean
    serviceType: ServiceType
    discountType: DiscountType
    validNow: Boolean
    expired: Boolean
    couponCode: String
    minDiscountValue: Float
    maxDiscountValue: Float
    createdFrom: String
    createdTo: String
    hasUsage: Boolean
    flagged: Boolean
    flagType: FlagType
    minUsageCount: Int
    maxUsageCount: Int
  }
  
  input VoucherPaginationInput {
    page: Int! = 1
    limit: Int! = 10
    sortBy: String = "createdAt"
    sortOrder: String = "DESC"
  }
  
  input BulkVoucherUpdateInput {
    isActive: Boolean
    validUntil: String
    maxDiscountAmount: Float
    totalUsageLimit: Int
    usagePerUser: Int
  }
  
  input VoucherLimitOverride {
    totalUsageLimit: Int
    usagePerUser: Int
    maxDiscountAmount: Float
    removeExpiryDate: Boolean
    extendExpiryDays: Int
  }
  
  input SystemPromotionInput {
    vendorIds: [ID!]
    title: String!
    description: String
    discountType: DiscountType!
    discountValue: Float!
    maxDiscountAmount: Float
    minOrderValue: Float
    applicableFor: ApplicableFor!
    serviceTypes: [ServiceType!]
    totalUsageLimit: Int
    usagePerUser: Int!
    validFrom: String!
    validUntil: String!
    autoGenerateCodes: Boolean!
    codePrefix: String
  }
`;