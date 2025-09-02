// TypeScript Types and Interfaces for Reviews System
// Complete type definitions for client-side operations

// ==================== CORE REVIEW TYPES ====================

export interface Review {
  id: string;
  rating: number;
  comment: string;
  serviceType: ServiceType;
  serviceId: string;
  userId: string;
  vendorId: string;
  isVerified: boolean;
  isPublished: boolean;
  moderationStatus?: ModerationStatus;
  moderationNotes?: string;
  moderatedBy?: string;
  moderatedAt?: string;
  flaggedCount?: number;
  reportedCount?: number;
  likesCount?: number;
  helpfulCount?: number;
  unhelpfulCount?: number;
  viewsCount?: number;
  isLikedByUser?: boolean;
  userMarkedHelpful?: boolean | null;
  attachments?: string[];
  serviceAspects?: ServiceAspects;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  vendor?: Vendor;
  response?: ReviewResponse;
}

export interface ReviewResponse {
  id: string;
  responseText: string;
  reviewId: string;
  vendorId: string;
  templateType?: ResponseTemplateType;
  actionPlan?: string;
  offerCompensation?: boolean;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
  review?: Review;
  vendor?: Vendor;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  profileImage?: string;
  isActive: boolean;
  isVerified?: boolean;
}

export interface Vendor {
  id: string;
  vendorName: string;
  email: string;
  phone?: string;
  logo?: string;
  businessType: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  isActive: boolean;
  isVerified: boolean;
}

// ==================== ENUMS ====================

export type ServiceType = 
  | 'VENUE'
  | 'CATERING' 
  | 'PHOTOGRAPHY'
  | 'FARMHOUSE'
  | 'BOOKING'
  | 'OTHER';

export type ModerationStatus = 
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'FLAGGED'
  | 'UNDER_REVIEW';

export type ResponseTemplateType = 
  | 'THANK_YOU'
  | 'ADDRESS_CONCERNS'
  | 'APOLOGIZE'
  | 'CLARIFY'
  | 'INVITE_CONTACT'
  | 'CUSTOM';

export type ModerationPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type ExportFormat = 'CSV' | 'JSON' | 'XML' | 'PDF';

export type SortDirection = 'asc' | 'desc';

export type ReviewSortField = 
  | 'createdAt'
  | 'updatedAt'
  | 'rating'
  | 'helpfulCount'
  | 'likesCount'
  | 'viewsCount';

// ==================== SERVICE ASPECTS ====================

export interface ServiceAspects {
  venue?: VenueAspects;
  catering?: CateringAspects;
  photography?: PhotographyAspects;
  farmhouse?: FarmhouseAspects;
  booking?: BookingAspects;
}

export interface VenueAspects {
  location: number;
  ambiance: number;
  cleanliness: number;
  facilities: number;
  staff: number;
  valueForMoney: number;
}

export interface CateringAspects {
  foodQuality: number;
  presentation: number;
  variety: number;
  service: number;
  hygiene: number;
  valueForMoney: number;
}

export interface PhotographyAspects {
  creativity: number;
  technical: number;
  professionalism: number;
  communication: number;
  timeliness: number;
  valueForMoney: number;
}

export interface FarmhouseAspects {
  location: number;
  facilities: number;
  cleanliness: number;
  privacy: number;
  activities: number;
  valueForMoney: number;
}

export interface BookingAspects {
  easeOfBooking: number;
  communication: number;
  flexibility: number;
  support: number;
  valueForMoney: number;
}

// ==================== INPUT TYPES ====================

export interface CreateReviewInput {
  rating: number;
  comment: string;
  serviceType: ServiceType;
  serviceId: string;
  vendorId: string;
  serviceAspects?: ServiceAspects;
  attachments?: string[];
}

export interface UpdateReviewInput {
  id: string;
  rating?: number;
  comment?: string;
  serviceAspects?: ServiceAspects;
  attachments?: string[];
}

export interface CreateReviewResponseInput {
  reviewId: string;
  responseText: string;
  templateType?: ResponseTemplateType;
  actionPlan?: string;
  offerCompensation?: boolean;
  attachments?: string[];
}

export interface UpdateReviewResponseInput {
  id: string;
  responseText?: string;
  actionPlan?: string;
  offerCompensation?: boolean;
  attachments?: string[];
}

export interface VenueAspectsInput {
  location: number;
  ambiance: number;
  cleanliness: number;
  facilities: number;
  staff: number;
  valueForMoney: number;
}

export interface CateringAspectsInput {
  foodQuality: number;
  presentation: number;
  variety: number;
  service: number;
  hygiene: number;
  valueForMoney: number;
}

export interface PhotographyAspectsInput {
  creativity: number;
  technical: number;
  professionalism: number;
  communication: number;
  timeliness: number;
  valueForMoney: number;
}

export interface ServiceAspectsInput {
  venue?: VenueAspectsInput;
  catering?: CateringAspectsInput;
  photography?: PhotographyAspectsInput;
  farmhouse?: FarmhouseAspects;
  booking?: BookingAspects;
}

export interface ExternalReviewInput {
  externalId: string;
  source: string;
  rating: number;
  comment: string;
  reviewerName: string;
  reviewerEmail?: string;
  serviceType: ServiceType;
  serviceId: string;
  vendorId: string;
  reviewDate: string;
  isVerified?: boolean;
}

// ==================== FILTER AND PAGINATION TYPES ====================

export interface ReviewFilters {
  rating?: number[];
  serviceType?: ServiceType[];
  isVerified?: boolean;
  isPublished?: boolean;
  moderationStatus?: ModerationStatus[];
  dateFrom?: string;
  dateTo?: string;
  vendorId?: string;
  userId?: string;
  serviceId?: string;
  searchTerm?: string;
  hasResponse?: boolean;
  minRating?: number;
  maxRating?: number;
  updatedAfter?: string;
  ids?: string[];
}

export interface PaginationInput {
  page: number;
  limit: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ReviewSortOptions {
  field: ReviewSortField;
  direction: SortDirection;
}

// ==================== RESPONSE TYPES ====================

export interface PaginatedReviews {
  reviews: Review[];
  pagination: Pagination;
  filters?: ReviewFilters;
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: RatingDistribution[];
  verifiedReviews: number;
  publishedReviews: number;
  responseRate: number;
  averageResponseTime: number;
}

export interface VendorReviewStats extends ReviewStats {
  vendorId: string;
  recentReviews: Review[];
  topRatedServices: ServiceStats[];
}

export interface ServiceReviewStats extends ReviewStats {
  serviceId: string;
  serviceType: ServiceType;
  recentReviews: Review[];
}

export interface RatingDistribution {
  rating: number;
  count: number;
  percentage: number;
}

export interface ServiceStats {
  serviceType: ServiceType;
  serviceId: string;
  averageRating: number;
  totalReviews: number;
}

export interface ReviewMetrics {
  totalReviews: number;
  totalRating: number;
  averageRating: number;
  fiveStarCount: number;
  fourStarCount: number;
  threeStarCount: number;
  twoStarCount: number;
  oneStarCount: number;
  verifiedPercentage: number;
  responsePercentage: number;
}

// ==================== OPERATION RESULT TYPES ====================

export interface DeleteResult {
  success: boolean;
  message: string;
  deletedReviewId?: string;
  deletedResponseId?: string;
}

export interface BulkOperationResult {
  successCount: number;
  failureCount: number;
  errors: BulkOperationError[];
}

export interface BulkVerifyResult extends BulkOperationResult {
  verifiedReviews: Review[];
}

export interface BulkUnverifyResult extends BulkOperationResult {
  unverifiedReviews: Review[];
}

export interface BulkPublishResult extends BulkOperationResult {
  publishedReviews: Review[];
}

export interface BulkUnpublishResult extends BulkOperationResult {
  unpublishedReviews: Review[];
}

export interface BulkDeleteResult extends BulkOperationResult {
  deletedIds: string[];
}

export interface BulkOperationError {
  reviewId: string;
  message: string;
}

export interface FlagReviewResult {
  success: boolean;
  message: string;
  flaggedReview: {
    id: string;
    moderationStatus: ModerationStatus;
    flaggedCount: number;
  };
}

export interface ReportReviewResult {
  success: boolean;
  message: string;
  reportedReview: {
    id: string;
    moderationStatus: ModerationStatus;
    reportedCount: number;
  };
}

export interface LikeReviewResult {
  success: boolean;
  isLiked: boolean;
  likeCount: number;
  review: {
    id: string;
    likesCount: number;
    isLikedByUser: boolean;
  };
}

export interface TrackViewResult {
  success: boolean;
  viewCount: number;
}

export interface MarkHelpfulResult {
  success: boolean;
  helpfulCount: number;
  unhelpfulCount: number;
  userMarkedHelpful: boolean;
}

export interface ImportResult {
  successCount: number;
  failureCount: number;
  importedReviews: Review[];
  errors: ImportError[];
}

export interface ImportError {
  index: number;
  message: string;
  externalId: string;
}

export interface ExportResult {
  success: boolean;
  downloadUrl: string;
  fileName: string;
  recordCount: number;
  expiresAt: string;
}

export interface ModerationTicket {
  id: string;
  reviewId: string;
  priority: ModerationPriority;
  status: string;
  assignedTo?: string;
  createdAt: string;
}

export interface SubmitModerationResult {
  success: boolean;
  moderationTicket: ModerationTicket;
}

// ==================== REACT HOOK TYPES ====================

export interface UseReviewsResult {
  reviews: Review[];
  pagination?: Pagination;
  loading: boolean;
  error?: Error;
  refetch: () => void;
}

export interface UseReviewResult {
  review?: Review;
  loading: boolean;
  error?: Error;
  refetch: () => void;
}

export interface UseCreateReviewResult {
  createReview: (input: CreateReviewInput) => Promise<Review>;
  loading: boolean;
  error?: Error;
}

export interface UseUpdateReviewResult {
  updateReview: (input: UpdateReviewInput) => Promise<Review>;
  loading: boolean;
  error?: Error;
}

export interface UseDeleteReviewResult {
  deleteReview: (id: string) => Promise<DeleteResult>;
  loading: boolean;
  error?: Error;
}

export interface UseCreateResponseResult {
  createResponse: (input: CreateReviewResponseInput) => Promise<ReviewResponse>;
  loading: boolean;
  error?: Error;
}

export interface UseReviewStatsResult {
  stats?: ReviewStats | VendorReviewStats | ServiceReviewStats;
  loading: boolean;
  error?: Error;
  refetch: () => void;
}

export interface UseReviewModerationResult {
  verifyReview: (id: string) => Promise<Review>;
  unverifyReview: (id: string) => Promise<Review>;
  publishReview: (id: string) => Promise<Review>;
  unpublishReview: (id: string) => Promise<Review>;
  deleteReview: (id: string) => Promise<DeleteResult>;
  loading: boolean;
  error?: Error;
}

export interface UseBulkOperationsResult {
  bulkVerify: (ids: string[]) => Promise<BulkVerifyResult>;
  bulkUnverify: (ids: string[]) => Promise<BulkUnverifyResult>;
  bulkPublish: (ids: string[]) => Promise<BulkPublishResult>;
  bulkUnpublish: (ids: string[]) => Promise<BulkUnpublishResult>;
  bulkDelete: (ids: string[]) => Promise<BulkDeleteResult>;
  loading: boolean;
  error?: Error;
}

export interface UseReviewInteractionsResult {
  flagReview: (reviewId: string, reason: string, description?: string) => Promise<FlagReviewResult>;
  reportReview: (reviewId: string, reason: string, description?: string) => Promise<ReportReviewResult>;
  likeReview: (reviewId: string) => Promise<LikeReviewResult>;
  unlikeReview: (reviewId: string) => Promise<LikeReviewResult>;
  markHelpful: (reviewId: string, isHelpful: boolean) => Promise<MarkHelpfulResult>;
  loading: boolean;
  error?: Error;
}

// ==================== FORM VALIDATION TYPES ====================

export interface ReviewFormData {
  rating: number;
  comment: string;
  serviceType: ServiceType;
  serviceId: string;
  serviceAspects?: ServiceAspects;
  attachments?: string[];
}

export interface ResponseFormData {
  responseText: string;
  templateType?: ResponseTemplateType;
  actionPlan?: string;
  offerCompensation?: boolean;
  attachments?: string[];
}

export interface ReviewFormErrors {
  rating?: string;
  comment?: string;
  serviceType?: string;
  serviceId?: string;
  serviceAspects?: Record<string, string>;
  attachments?: string;
  general?: string;
}

export interface ResponseFormErrors {
  responseText?: string;
  templateType?: string;
  actionPlan?: string;
  attachments?: string;
  general?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// ==================== UTILITY TYPES ====================

export interface ReviewFiltersState extends ReviewFilters {
  sortBy: ReviewSortField;
  sortDirection: SortDirection;
}

export interface ReviewListState {
  reviews: Review[];
  filters: ReviewFiltersState;
  pagination: Pagination;
  loading: boolean;
  error?: string;
  selectedReviews: string[];
}

export interface ReviewDetailState {
  review?: Review;
  responses: ReviewResponse[];
  stats?: ReviewStats;
  loading: boolean;
  error?: string;
}

export interface ReviewAnalytics {
  totalViews: number;
  totalLikes: number;
  totalFlags: number;
  totalReports: number;
  conversionRate: number;
  engagementRate: number;
  responseTime: number;
  satisfactionScore: number;
}

// ==================== CONSTANTS ====================

export const REVIEW_CONSTANTS = {
  MIN_RATING: 1,
  MAX_RATING: 5,
  MIN_COMMENT_LENGTH: 10,
  MAX_COMMENT_LENGTH: 2000,
  MAX_RESPONSE_LENGTH: 1000,
  MAX_ATTACHMENTS: 5,
  RATING_LABELS: {
    1: 'Poor',
    2: 'Fair', 
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent'
  },
  SERVICE_TYPES: [
    'VENUE',
    'CATERING',
    'PHOTOGRAPHY', 
    'FARMHOUSE',
    'BOOKING',
    'OTHER'
  ] as ServiceType[],
  MODERATION_STATUSES: [
    'PENDING',
    'APPROVED',
    'REJECTED',
    'FLAGGED',
    'UNDER_REVIEW'
  ] as ModerationStatus[],
  RESPONSE_TEMPLATES: [
    'THANK_YOU',
    'ADDRESS_CONCERNS',
    'APOLOGIZE',
    'CLARIFY',
    'INVITE_CONTACT',
    'CUSTOM'
  ] as ResponseTemplateType[]
};

// ==================== DEFAULT VALUES ====================

export const DEFAULT_REVIEW_FILTERS: ReviewFilters = {
  rating: [],
  serviceType: [],
  isVerified: undefined,
  isPublished: true,
  moderationStatus: [],
  hasResponse: undefined
};

export const DEFAULT_PAGINATION: PaginationInput = {
  page: 1,
  limit: 10
};

export const DEFAULT_SORT_OPTIONS: ReviewSortOptions = {
  field: 'createdAt',
  direction: 'desc'
};

export const DEFAULT_SERVICE_ASPECTS: ServiceAspects = {
  venue: {
    location: 0,
    ambiance: 0,
    cleanliness: 0,
    facilities: 0,
    staff: 0,
    valueForMoney: 0
  }
};
