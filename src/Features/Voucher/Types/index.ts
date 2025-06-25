// src/Features/Vouchers/Types/index.ts

export type DiscountType = "Percentage" | "Fixed Amount";
export type ApplicableFor = "All Services" | "Specific Services";
export type ServiceType = "FarmHouse" | "Venue" | "Catering" | "Photography";

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