// ==================== ENUM TYPES ====================

export enum AdType {
  Featured = 'Featured',
  Sponsored = 'Sponsored',
  Premium = 'Premium'
}

export enum ScheduleStatus {
  SCHEDULED = 'Scheduled',
  RUNNING = 'Running',
  COMPLETED = 'Completed',
  FAILED = 'Failed',
  CANCELLED = 'Cancelled',
  PAUSED = 'Paused'
}

export enum EntityType {
  Farmhouse = 'Farmhouse',
  Venue = 'Venue',
  PhotographyPackage = 'PhotographyPackage',
  CateringPackage = 'CateringPackage'
}

export enum RequestStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
  Under_Review = 'Under_Review'
}

export enum ServiceAdStatus {
  Scheduled = 'Scheduled',
  Active = 'Active',
  Paused = 'Paused',
  Expired = 'Expired',
  Cancelled = 'Cancelled'
}

export enum ExternalAdStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Expired = 'Expired'
}

export enum PaymentStatus {
  Pending = 'Pending',
  Paid = 'Paid',
  Failed = 'Failed',
  Refunded = 'Refunded'
}

export enum PaymentMethod {
  CreditCard = 'CreditCard',
  DebitCard = 'DebitCard',
  BankTransfer = 'BankTransfer',
  MobilePayment = 'MobilePayment',
  Other = 'Other'
}

// ==================== CORE ENTITY TYPES ====================

export interface AdRequest {
  id: string;
  vendorId: string;
  adType: AdType;
  entityType: EntityType;
  entityId: string;
  adTitle: string;
  adDescription?: string;
  adImage?: string;
  requestedPrice: number;
  requestedStartDate: string;
  requestedEndDate: string;
  requestedDuration: number;
  targetAudience?: string[];
  vendorNotes?: string;
  status: RequestStatus;
  adminNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceAd {
  id: string;
  requestId: string;
  vendorId: string;
  adType: AdType;
  entityType: EntityType;
  entityId: string;
  adTitle: string;
  adDescription?: string;
  adImage?: string;
  finalPrice: number;
  status: ServiceAdStatus;
  adminStartDate: string;
  adminEndDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  impressionCount: number;
  clickCount: number;
  conversionCount: number;
  targetAudience?: string[];
  scheduledBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExternalAd {
  id: string;
  advertiserName: string;
  advertiserEmail: string;
  advertiserPhone?: string;
  imageUrl: string;
  redirectUrl: string;
  adTitle: string;
  adDescription?: string;
  price: number;
  status: ExternalAdStatus;
  startDate?: string;
  endDate?: string;
  impressionCount: number;
  clickCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdPayment {
  id: string;
  adId?: string;
  externalAdId?: string;
  vendorId?: string;
  amountPaid: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  transactionId?: string;
  paidAt?: string;
  invoiceNumber?: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== ANALYTICS TYPES ====================

export interface AdAnalytics {
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number; // Click-through rate
  conversionRate: number;
  totalSpent: number;
  averageDailyCost: number;
  daysActive: number;
}

export interface DashboardStats {
  totalAdRequests: number;
  pendingRequests: number;
  activeAds: number;
  totalRevenue: number;
  totalImpressions: number;
  totalClicks: number;
  averageCTR: number;
}

export interface DailyRevenue {
  date: string;
  revenue: number;
  adCount: number;
}

export interface RevenueAnalytics {
  totalRevenue: number;
  dailyRevenue: DailyRevenue[];
  averageDailyRevenue: number;
  revenueGrowth: number;
  topRevenueAds: ServiceAd[];
}

// ==================== INPUT TYPES ====================

export interface CreateAdRequestInput {
  adType: AdType;
  entityType: EntityType;
  entityId: string;
  adTitle: string;
  adDescription?: string;
  adImage?: string;
  requestedPrice: number;
  requestedStartDate: string;
  requestedEndDate: string;
  targetAudience?: string[];
  vendorNotes?: string;
}

export interface UpdateAdRequestInput {
  adTitle?: string;
  adDescription?: string;
  adImage?: string;
  requestedPrice?: number;
  requestedStartDate?: string;
  requestedEndDate?: string;
  targetAudience?: string[];
  vendorNotes?: string;
}

export interface ApproveAdRequestInput {
  finalPrice: number;
  adminStartDate: string;
  adminEndDate: string;
  adminNotes?: string;
}

export interface UpdateServiceAdInput {
  adTitle?: string;
  adDescription?: string;
  adImage?: string;
  finalPrice?: number;
  adminStartDate?: string;
  adminEndDate?: string;
  targetAudience?: string[];
}

export interface CreateExternalAdInput {
  advertiserName: string;
  advertiserEmail: string;
  advertiserPhone?: string;
  imageUrl: string;
  redirectUrl: string;
  adTitle: string;
  adDescription?: string;
  price: number;
  startDate?: string;
  endDate?: string;
}

export interface UpdateExternalAdInput {
  advertiserName?: string;
  advertiserEmail?: string;
  advertiserPhone?: string;
  imageUrl?: string;
  redirectUrl?: string;
  adTitle?: string;
  adDescription?: string;
  price?: number;
  status?: ExternalAdStatus;
  startDate?: string;
  endDate?: string;
}

export interface CreatePaymentInput {
  adId?: string;
  externalAdId?: string;
  amountPaid: number;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  invoiceNumber?: string;
}

// ==================== QUERY VARIABLE TYPES ====================

export interface GetActiveAdsVariables {
  adType?: AdType;
  entityType?: EntityType;
}

export interface GetMyAdRequestsVariables {
  status?: RequestStatus;
}

export interface GetAdRequestByIdVariables {
  id: string;
}

export interface GetAllAdRequestsVariables {
  status?: RequestStatus;
  vendorId?: string;
}

export interface GetAllServiceAdsVariables {
  status?: ServiceAdStatus;
  vendorId?: string;
}

export interface GetExternalAdsVariables {
  status?: ExternalAdStatus;
}

export interface GetExternalAdByIdVariables {
  id: string;
}

export interface GetAdPaymentsVariables {
  adId?: string;
  externalAdId?: string;
}

export interface GetPaymentByIdVariables {
  id: string;
}

export interface GetAdAnalyticsVariables {
  adId: string;
}

export interface GetTopPerformingAdsVariables {
  limit?: number;
}

export interface GetRevenueAnalyticsVariables {
  startDate?: string;
  endDate?: string;
}

// ==================== MUTATION VARIABLE TYPES ====================

export interface CreateAdRequestVariables {
  input: CreateAdRequestInput;
}

export interface UpdateAdRequestVariables {
  id: string;
  input: UpdateAdRequestInput;
}

export interface CancelAdRequestVariables {
  id: string;
}

export interface ApproveAdRequestVariables {
  id: string;
  input: ApproveAdRequestInput;
}

export interface RejectAdRequestVariables {
  id: string;
  adminNotes?: string;
}

export interface ReviewAdRequestVariables {
  id: string;
  status: RequestStatus;
  adminNotes: string;
}

export interface ActivateServiceAdVariables {
  id: string;
}

export interface ExpireServiceAdVariables {
  id: string;
}

export interface UpdateServiceAdVariables {
  id: string;
  input: UpdateServiceAdInput;
}

export interface PauseServiceAdVariables {
  id: string;
}

export interface ResumeServiceAdVariables {
  id: string;
}

export interface CancelServiceAdVariables {
  id: string;
}

export interface ExtendServiceAdVariables {
  id: string;
  newEndDate: string;
}

export interface CreateExternalAdVariables {
  input: CreateExternalAdInput;
}

export interface UpdateExternalAdVariables {
  id: string;
  input: UpdateExternalAdInput;
}

export interface DeleteExternalAdVariables {
  id: string;
}

export interface CreatePaymentVariables {
  input: CreatePaymentInput;
}

export interface UpdatePaymentStatusVariables {
  id: string;
  status: PaymentStatus;
}

export interface RecordImpressionVariables {
  adId: string;
  isExternal: boolean;
}

export interface RecordClickVariables {
  adId: string;
  isExternal: boolean;
}

export interface RecordConversionVariables {
  adId: string;
}

// ==================== RESPONSE TYPES ====================

export interface AdRequestResponse {
  adRequest: AdRequest;
}

export interface ServiceAdResponse {
  serviceAd: ServiceAd;
}

export interface ExternalAdResponse {
  externalAd: ExternalAd;
}

export interface AdPaymentResponse {
  payment: AdPayment;
}

export interface AdAnalyticsResponse {
  analytics: AdAnalytics;
}

export interface DashboardStatsResponse {
  dashboardStats: DashboardStats;
}

export interface RevenueAnalyticsResponse {
  revenueAnalytics: RevenueAnalytics;
}

// ==================== BULK OPERATION TYPES ====================

export interface BulkOperationResult {
  id: string;
  success: boolean;
  message: string;
  ad?: ServiceAd;
  request?: AdRequest;
}

export interface BulkOperationResponse {
  success: boolean;
  processedCount: number;
  failedCount: number;
  results: BulkOperationResult[];
}

export interface BulkApproveAdRequestsVariables {
  ids: string[];
  input: ApproveAdRequestInput;
}

export interface BulkRejectAdRequestsVariables {
  ids: string[];
  adminNotes?: string;
}

export interface BulkUpdateServiceAdsVariables {
  ids: string[];
  status: ServiceAdStatus;
}

// ==================== COMPLEX OPERATION TYPES ====================

export interface CreateAdRequestWithPaymentVariables {
  adInput: CreateAdRequestInput;
  paymentInput: CreatePaymentInput;
}

export interface ApproveRequestWithPaymentVariables {
  id: string;
  approveInput: ApproveAdRequestInput;
  paymentInput: CreatePaymentInput;
}

export interface UpdateAdWithInteractionVariables {
  adId: string;
  updateInput: UpdateServiceAdInput;
  interactionType: string;
  isExternal: boolean;
}

export interface CompleteAdReviewVariables {
  requestId: string;
  action: 'approve' | 'reject';
  approveInput?: ApproveAdRequestInput;
  adminNotes?: string;
}

export interface ManageAdLifecycleVariables {
  adId: string;
  action: 'activate' | 'pause' | 'resume' | 'expire' | 'cancel' | 'extend';
  newEndDate?: string;
}

export interface GenerateAdReportVariables {
  adId: string;
  startDate: string;
  endDate: string;
  includeDetails: boolean;
}

export interface ExportAdsDataVariables {
  format: 'csv' | 'excel' | 'pdf';
  dateRange: string;
  filters?: string;
}

// ==================== DASHBOARD DATA TYPES ====================

export interface VendorAdDashboard {
  myAdRequests: AdRequest[];
  myActiveAds: ServiceAd[];
  myPayments: AdPayment[];
}

export interface AdminAdDashboard {
  dashboardStats: DashboardStats;
  pendingRequests: AdRequest[];
  topPerformingAds: ServiceAd[];
}

export interface HomePageAds {
  featuredAds: ServiceAd[];
  sponsoredAds: ServiceAd[];
  externalAds: ExternalAd[];
}

// ==================== FILTER AND SEARCH TYPES ====================

export interface AdFilter {
  adType?: AdType;
  entityType?: EntityType;
  status?: RequestStatus | ServiceAdStatus | ExternalAdStatus;
  vendorId?: string;
  startDate?: string;
  endDate?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  searchTerm?: string;
}

export interface AdSearchParams {
  query?: string;
  filters?: AdFilter;
  sortBy?: 'createdAt' | 'price' | 'impressions' | 'clicks' | 'ctr';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// ==================== ERROR TYPES ====================

export interface AdError {
  code: string;
  message: string;
  field?: string;
}

export interface AdOperationResult {
  success: boolean;
  message?: string;
  errors?: AdError[];
  data?: any;
}

// ==================== FORM TYPES ====================

export interface AdRequestFormData {
  adType: AdType;
  entityType: EntityType;
  entityId: string;
  adTitle: string;
  adDescription?: string;
  adImage?: File | string;
  requestedPrice: number;
  requestedStartDate: Date;
  requestedEndDate: Date;
  targetAudience: string[];
  vendorNotes?: string;
}

export interface ExternalAdFormData {
  advertiserName: string;
  advertiserEmail: string;
  advertiserPhone?: string;
  imageUrl: string;
  redirectUrl: string;
  adTitle: string;
  adDescription?: string;
  price: number;
  startDate?: Date;
  endDate?: Date;
}

export interface PaymentFormData {
  amountPaid: number;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  invoiceNumber?: string;
}

// ==================== UI STATE TYPES ====================

export interface AdUIState {
  loading: boolean;
  error?: string;
  selectedAds: string[];
  filters: AdFilter;
  searchTerm: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  currentPage: number;
  itemsPerPage: number;
}

export interface AdModalState {
  isOpen: boolean;
  mode: 'create' | 'edit' | 'view' | 'approve' | 'reject';
  selectedAd?: AdRequest | ServiceAd | ExternalAd;
}

// ==================== NOTIFICATION TYPES ====================

export interface AdNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  action?: {
    label: string;
    handler: () => void;
  };
  autoClose?: boolean;
  duration?: number;
}

// ==================== UTILITY TYPES ====================

export type AdEntityUnion = AdRequest | ServiceAd | ExternalAd;
export type AdStatusUnion = RequestStatus | ServiceAdStatus | ExternalAdStatus;
export type AnyAdInput = CreateAdRequestInput | UpdateAdRequestInput | CreateExternalAdInput | UpdateExternalAdInput;

// ==================== TIME SLOT MANAGEMENT TYPES ====================

export interface TimeSlotInput {
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  daysOfWeek: number[]; // Array of 0-6 (Sunday-Saturday)
  priority: number; // 1-5 (1 = highest priority)
}

export interface TimeSlot {
  id: string;
  adId: string;
  startTime: string;
  endTime: string;
  daysOfWeek: number[];
  priority: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApproveAdRequestWithTimeSlotsInput {
  finalPrice: number;
  adminStartDate: string; // YYYY-MM-DD format
  adminEndDate: string; // YYYY-MM-DD format
  adminNotes?: string;
  timeSlots: TimeSlotInput[];
}

export interface AdSchedule {
  id: string;
  adId: string;
  timeSlotId: string;
  scheduledDate: string; // YYYY-MM-DD format
  status: ScheduleStatus;
  executedAt?: string;
  retryCount: number;
  maxRetries: number;
  nextRetry?: string;
  failureReason?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ConflictingAd {
  id: string;
  title: string;
  vendor: {
    id: string;
    businessName: string;
  };
}

export interface TimeSlotAvailabilityInfo {
  isAvailable: boolean;
  conflictingAds: ConflictingAd[];
}

export interface TimeSlotAvailability {
  timeSlot: string; // "HH:MM - HH:MM" format
  availability: TimeSlotAvailabilityInfo;
}

export interface AdScheduleInfo {
  ad: {
    id: string;
    title: string;
    vendor: {
      id: string;
      businessName: string;
    };
  };
  timeSlot: TimeSlot;
  schedule: AdSchedule;
}

export interface ScheduleStatistics {
  totalRuns: number;
  successfulRuns: number;
  failedRuns: number;
  successRate: number;
  averageExecutionTime?: number;
}

export interface AdWithTimeSlots {
  id: string;
  title: string;
  description: string;
  status: string;
  timeSlots: TimeSlot[];
  currentSchedule?: AdSchedule;
  totalScheduledRuns: number;
  successfulRuns: number;
  failedRuns: number;
  scheduleStatistics?: ScheduleStatistics;
}

export interface TimeSlotFormData {
  startTime: string;
  endTime: string;
  selectedDays: boolean[]; // [Sunday, Monday, ..., Saturday]
  priority: number;
}

export interface BulkScheduleFormData {
  adIds: string[];
  timeSlots: TimeSlotInput[];
  startDate: string;
  endDate: string;
}

export interface TimeSlotDashboard {
  upcomingSchedules: AdSchedule[];
  failedSchedules: AdSchedule[];
  todaySchedules: AdScheduleInfo[];
  runningSchedules: AdScheduleInfo[];
}

// ==================== TIME SLOT CONSTANTS ====================

export const DAYS_OF_WEEK = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
] as const;

export const SCHEDULE_STATUS_COLORS = {
  [ScheduleStatus.SCHEDULED]: '#3498db',
  [ScheduleStatus.RUNNING]: '#2ecc71',
  [ScheduleStatus.COMPLETED]: '#27ae60',
  [ScheduleStatus.FAILED]: '#e74c3c',
  [ScheduleStatus.CANCELLED]: '#95a5a6',
  [ScheduleStatus.PAUSED]: '#f39c12'
} as const;

export const PRIORITY_LABELS = {
  1: 'Highest', 2: 'High', 3: 'Medium', 4: 'Low', 5: 'Lowest'
} as const;
