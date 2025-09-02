// src/Features/Vouchers/Types/index.ts

export type DiscountType = "Percentage" | "Fixed Amount";
export type ApplicableFor = "All Services" | "Specific Services";
export type ServiceType = "FarmHouse" | "Venue" | "Catering" | "Photography";

// Admin-specific enums
export type FlagType = "HIGH_USAGE" | "SUSPICIOUS_PATTERN" | "FRAUD_DETECTED" | "POLICY_VIOLATION" | "EXPIRED_OVERUSE";
export type TrendPeriod = "DAILY" | "WEEKLY" | "MONTHLY" | "QUARTERLY" | "YEARLY";
export type TrendGroupBy = "VENDOR" | "SERVICE_TYPE" | "DISCOUNT_TYPE" | "TIME_PERIOD";
export type SystemAlertType = "FRAUD_DETECTION" | "SYSTEM_OVERLOAD" | "POLICY_VIOLATION" | "MAINTENANCE_REQUIRED";

export interface Voucher {
  id: string;
  vendorId: string;
  couponCode: string;
  title: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  maxDiscountAmount?: number;
  minOrderValue?: number;
  applicableFor: ApplicableFor;
  serviceTypes?: ServiceType[];
  specificServiceIds?: string[];
  totalUsageLimit?: number;
  usagePerUser: number;
  currentUsageCount: number;
  validFrom: Date;
  validUntil: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Admin fields
  flagged?: boolean;
  flagType?: FlagType;
  flagReason?: string;
  flaggedAt?: Date;
  suspendedUntil?: Date;
}

export interface VoucherUsage {
  id: string;
  voucherId: string;
  userId: string;
  bookingId: string;
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
  serviceType: ServiceType;
  serviceId: string;
  appliedAt: Date;
  // Admin fields
  fraudulent?: boolean;
  fraudReason?: string;
  refunded?: boolean;
  refundAmount?: number;
  investigatedBy?: string;
  investigatedAt?: Date;
}

export interface CreateVoucherInput {
  couponCode: string;
  title: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  maxDiscountAmount?: number;
  minOrderValue?: number;
  applicableFor: ApplicableFor;
  serviceTypes?: ServiceType[];
  specificServiceIds?: string[];
  totalUsageLimit?: number;
  usagePerUser?: number;
  validFrom: Date;
  validUntil: Date;
}

export interface UpdateVoucherInput {
  id: string;
  couponCode?: string;
  title?: string;
  description?: string;
  discountType?: DiscountType;
  discountValue?: number;
  maxDiscountAmount?: number;
  minOrderValue?: number;
  applicableFor?: ApplicableFor;
  serviceTypes?: ServiceType[];
  specificServiceIds?: string[];
  totalUsageLimit?: number;
  usagePerUser?: number;
  validFrom?: Date;
  validUntil?: Date;
  isActive?: boolean;
}

export interface ValidateVoucherInput {
  couponCode: string;
  vendorId: string;
  serviceType: ServiceType;
  serviceId: string;
  orderAmount: number;
}

export interface ApplyVoucherInput {
  couponCode: string;
  vendorId: string;
  bookingId: string;
  serviceType: ServiceType;
  serviceId: string;
  originalAmount: number;
}

export interface VoucherValidationResult {
  isValid: boolean;
  voucher?: Voucher;
  discountAmount?: number;
  finalAmount?: number;
  error?: string;
}

export interface VoucherFilters {
  vendorId?: string;
  isActive?: boolean;
  serviceType?: ServiceType;
  validNow?: boolean;
  couponCode?: string;
}

export interface VoucherUsageFilters {
  voucherId?: string;
  userId?: string;
  serviceType?: ServiceType;
  dateFrom?: Date;
  dateTo?: Date;
}

// ========== ADMIN-SPECIFIC TYPES ==========

export interface AdminVoucherFilters extends VoucherFilters {
  vendorIds?: string[];
  discountType?: DiscountType;
  expired?: boolean;
  minDiscountValue?: number;
  maxDiscountValue?: number;
  createdFrom?: Date;
  createdTo?: Date;
  hasUsage?: boolean;
  flagged?: boolean;
  flagType?: FlagType;
  minUsageCount?: number;
  maxUsageCount?: number;
}

export interface PaginationInput {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export interface VoucherListResponse {
  vouchers: Voucher[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface AdminVoucherAnalytics {
  totalSystemVouchers: number;
  totalSystemUsage: number;
  totalSystemDiscountGiven: number;
  totalSystemRevenueLost: number;
  averageDiscountPerVoucher: number;
  topPerformingVendors: VendorPerformance[];
  voucherDistributionByType: VoucherTypeDistribution[];
  monthlyTrends: MonthlyVoucherTrend[];
  fraudulentUsageCount: number;
  suspiciousActivities: SuspiciousActivity[];
}

export interface VendorPerformance {
  vendorId: string;
  vendorName: string;
  totalVouchers: number;
  totalUsage: number;
  totalDiscountGiven: number;
  averageVoucherValue: number;
  successRate: number;
}

export interface VoucherTypeDistribution {
  discountType: DiscountType;
  count: number;
  totalValue: number;
  percentage: number;
}

export interface MonthlyVoucherTrend {
  month: string;
  year: number;
  vouchersCreated: number;
  vouchersUsed: number;
  totalDiscountGiven: number;
  uniqueUsers: number;
}

export interface SuspiciousActivity {
  id: string;
  type: FlagType;
  description: string;
  voucherId?: string;
  userId?: string;
  vendorId?: string;
  severity: number;
  detectedAt: Date;
  status: string;
}

export interface FlaggedVoucher {
  voucher: Voucher;
  flagType: FlagType;
  flagReason: string;
  flaggedAt: Date;
  severity: number;
  investigationStatus: string;
  investigatorId?: string;
}

export interface VendorVoucherPerformance {
  vendorId: string;
  vendorName: string;
  totalVouchers: number;
  activeVouchers: number;
  totalUsage: number;
  totalDiscountGiven: number;
  averageUsagePerVoucher: number;
  topPerformingVoucher?: Voucher;
  conversionRate: number;
  fraudIncidents: number;
}

export interface VoucherFraudReport {
  id: string;
  voucherId: string;
  userId: string;
  vendorId: string;
  fraudType: string;
  description: string;
  detectedAt: Date;
  investigatedAt?: Date;
  status: string;
  investigatorId?: string;
  refundAmount?: number;
  voucher: Voucher;
  user?: any;
}

export interface VoucherTrendAnalysis {
  period: TrendPeriod;
  groupBy: TrendGroupBy;
  dataPoints: TrendDataPoint[];
  summary: TrendSummary;
}

export interface TrendDataPoint {
  label: string;
  value: number;
  count: number;
  date?: string;
  percentage: number;
}

export interface TrendSummary {
  totalCount: number;
  totalValue: number;
  averageValue: number;
  growthRate: number;
  peakPeriod: string;
}

export interface VoucherComplianceReport {
  vendorId: string;
  vendorName: string;
  totalVouchers: number;
  compliantVouchers: number;
  violationCount: number;
  complianceScore: number;
  violations: ComplianceViolation[];
  recommendations: string[];
}

export interface ComplianceViolation {
  voucherId: string;
  violationType: string;
  description: string;
  severity: string;
  detectedAt: Date;
  resolved: boolean;
}

export interface VoucherRefund {
  id: string;
  voucherUsageId: string;
  refundAmount: number;
  reason: string;
  processedBy: string;
  processedAt: Date;
  status: string;
  voucherUsage: VoucherUsage;
}

export interface BulkVoucherUpdateInput {
  isActive?: boolean;
  validUntil?: Date;
  maxDiscountAmount?: number;
  totalUsageLimit?: number;
  usagePerUser?: number;
}

export interface VoucherLimitOverride {
  totalUsageLimit?: number;
  usagePerUser?: number;
  maxDiscountAmount?: number;
  removeExpiryDate?: boolean;
  extendExpiryDays?: number;
}

export interface SystemPromotionInput {
  vendorIds: string[];
  title: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  maxDiscountAmount?: number;
  minOrderValue?: number;
  applicableFor: ApplicableFor;
  serviceTypes?: ServiceType[];
  totalUsageLimit?: number;
  usagePerUser: number;
  validFrom: Date;
  validUntil: Date;
  autoGenerateCodes: boolean;
  codePrefix?: string;
}

export interface VoucherFraudAlert {
  id: string;
  voucherId: string;
  userId?: string;
  vendorId: string;
  alertType: string;
  description: string;
  severity: number;
  triggeredAt: Date;
  voucher: Voucher;
}

export interface VoucherSystemAlert {
  id: string;
  alertType: SystemAlertType;
  message: string;
  severity: number;
  timestamp: Date;
  affectedVouchers?: number;
  affectedVendors?: number;
  requiresAction: boolean;
}