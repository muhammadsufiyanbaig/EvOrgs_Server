// Shared types across all services

export interface PaginationInput {
  page?: number;
  limit?: number;
}

export interface PaginationResult<T> {
  items: T[];
  totalCount: number;
  hasMore: boolean;
  currentPage: number;
  totalPages: number;
}

export type SortDirection = 'ASC' | 'DESC';

export type AvailabilityStatus = 'Available' | 'Busy' | 'Unavailable';

export interface Vendor {
  id: string;
  vendorName: string;
  vendorEmail: string;
  vendorPhone?: string;
  vendorAddress?: string;
  vendorType: string;
  vendorStatus: string;
  rating?: number;
  reviewCount?: number;
}

export interface Review {
  id: string;
  userId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  user?: {
    id: string;
    userName: string;
  };
}

export interface AddReviewInput {
  packageId?: string;
  venueId?: string;
  farmHouseId?: string;
  serviceId?: string;
  rating: number;
  comment?: string;
}

export interface UpdateReviewInput {
  rating?: number;
  comment?: string;
}

export interface MutationResponse {
  success: boolean;
  message: string;
}

export interface UploadResponse {
  id: string;
  images?: string[];
  portfolio?: string[];
  virtualTour?: string;
  floorPlan?: string;
}

// Accessibility and Policy Types (shared between Venue and FarmHouse)
export type AccessibilityFeature = 
  | 'WheelchairAccessible'
  | 'Elevator'
  | 'HandicapParking'
  | 'AccessibleRestrooms'
  | 'HearingLoop'
  | 'Braille'
  | 'ServiceAnimalsAllowed'
  | 'RampAccess'
  | 'WideDoorbells'
  | 'AccessibleBathroom'
  | 'GrabBars'
  | 'LoweredCounters'
  | 'AccessibleParking'
  | 'ElevatorAccess'
  | 'BrailleSignage'
  | 'ServiceAnimalsWelcome'
  | 'AccessibleSwimmingPool'
  | 'RollInShower'
  | 'AccessibleBedroom';

export type PetPolicy = 
  | 'Allowed'
  | 'ServiceAnimalsOnly'
  | 'CaseByCase'
  | 'NotAllowed'
  | 'PetsWelcome'
  | 'DogsOnly'
  | 'CatsOnly'
  | 'SmallPetsOnly'
  | 'PetFeeRequired'
  | 'PetDepositRequired'
  | 'PetsOnLeash'
  | 'IndoorPetsOnly'
  | 'OutdoorPetsOnly'
  | 'NoPets';

export type SmokingPolicy = 
  | 'Allowed'
  | 'DesignatedAreas'
  | 'OutdoorOnly'
  | 'NotAllowed'
  | 'SmokingAllowed'
  | 'OutdoorSmokingOnly'
  | 'DesignatedSmokingAreas'
  | 'NoSmoking';

// Service Types
export type ServiceType = 
  | 'Catering'
  | 'Photography'
  | 'Venue'
  | 'FarmHouse';

export type PaymentStatus = 
  | 'Pending'
  | 'Paid'
  | 'PartiallyPaid'
  | 'Failed'
  | 'Refunded';

export type BookingStatus = 
  | 'Pending'
  | 'Confirmed'
  | 'InProgress'
  | 'Completed'
  | 'Cancelled'
  | 'Refunded';

export type QuoteStatus = 
  | 'Pending'
  | 'Responded'
  | 'Accepted'
  | 'Rejected'
  | 'Expired';

// Common Interfaces
export interface ServiceBooking {
  id: string;
  userId: string;
  vendorId: string;
  serviceType: ServiceType;
  serviceId: string;
  eventDate: string;
  eventTime?: string;
  duration?: number;
  guestCount?: number;
  totalAmount: number;
  advanceAmount: number;
  remainingAmount: number;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  specialRequests?: string;
  createdAt: string;
}

export interface ServiceReview {
  id: string;
  userId: string;
  serviceId: string;
  serviceType: ServiceType;
  rating: number;
  comment?: string;
  createdAt: string;
  user: {
    id: string;
    userName: string;
  };
}

export interface QuoteRequest {
  id: string;
  userId: string;
  vendorId: string;
  serviceId: string;
  serviceType: ServiceType;
  status: QuoteStatus;
  createdAt: string;
  respondedAt?: string;
}

export interface QuoteResponse {
  id: string;
  vendorResponse: string;
  quotedPrice: number;
  status: QuoteStatus;
  respondedAt: string;
}

// Location and Coordinates
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationFilter {
  location?: string;
  coordinates?: Coordinates;
  radius?: number; // in km
  city?: string[];
  state?: string[];
}

// Universal Service Filters
export interface UniversalServiceFilters extends LocationFilter {
  serviceTypes?: ServiceType[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  availabilityStatus?: AvailabilityStatus[];
  isActive?: boolean;
  vendorId?: string;
}

export interface UniversalServiceSort {
  field: 'price' | 'rating' | 'reviewCount' | 'createdAt' | 'distance';
  direction: SortDirection;
}

// Service Provider Interface
export interface ServiceProvider {
  id: string;
  vendorId: string;
  serviceType: ServiceType;
  name: string;
  description?: string;
  price: number;
  location: string;
  rating?: number;
  reviewCount?: number;
  images?: string[];
  isActive: boolean;
  vendor: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
  };
}

// Analytics Interfaces
export interface ServiceAnalytics {
  serviceId: string;
  serviceType: ServiceType;
  totalBookings: number;
  totalRevenue: number;
  averageRating: number;
  totalReviews: number;
  popularityScore: number;
  conversionRate: number;
  peakSeasons: string[];
  topLocations: string[];
}

export interface VendorAnalytics {
  vendorId: string;
  totalServices: number;
  totalBookings: number;
  totalRevenue: number;
  averageRating: number;
  totalReviews: number;
  responseRate: number;
  completionRate: number;
  customerRetentionRate: number;
  serviceBreakdown: {
    serviceType: ServiceType;
    count: number;
    revenue: number;
  }[];
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Search Result Interfaces
export interface ServiceSearchResult<T> {
  results: T[];
  totalCount: number;
  hasMore: boolean;
  currentPage: number;
  totalPages: number;
}

export interface LocationBasedResult<T> {
  items: T[];
  totalCount: number;
  hasMore: boolean;
  currentPage: number;
  totalPages: number;
}
