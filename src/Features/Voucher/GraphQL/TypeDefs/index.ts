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
  }
`;