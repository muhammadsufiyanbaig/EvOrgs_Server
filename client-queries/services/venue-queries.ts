// Client-side GraphQL operations for Venues

import { gql } from '@apollo/client';

// ============== FRAGMENTS ==============

export const VENUE_FRAGMENT = gql`
  fragment VenueFragment on Venue {
    id
    vendorId
    venueName
    description
    venueType
    capacity
    location
    address
    city
    state
    zipCode
    coordinates {
      latitude
      longitude
    }
    pricePerHour
    pricePerDay
    pricePerEvent
    minimumBookingHours
    setupTime
    cleanupTime
    availableAmenities
    cateringOptions
    parkingSpaces
    accessibilityFeatures
    indoorOutdoor
    floorArea
    ceilingHeight
    audioVisualEquipment
    decorationPolicy
    alcoholPolicy
    smokingPolicy
    petPolicy
    cancellationPolicy
    rules
    images
    floorPlan
    rating
    reviewCount
    availabilityStatus
    isActive
    createdAt
    updatedAt
    vendor {
      id
      vendorName
      vendorEmail
      vendorPhone
      vendorAddress
      vendorType
      vendorStatus
      rating
      reviewCount
    }
  }
`;

export const VENUE_SUMMARY_FRAGMENT = gql`
  fragment VenueSummaryFragment on Venue {
    id
    vendorId
    venueName
    description
    venueType
    capacity
    location
    address
    city
    pricePerHour
    pricePerDay
    pricePerEvent
    indoorOutdoor
    availableAmenities
    images
    rating
    reviewCount
    availabilityStatus
    vendor {
      id
      vendorName
      vendorAddress
      rating
    }
  }
`;

// ============== QUERIES ==============

// Get all venues with filters
export const GET_VENUES = gql`
  ${VENUE_SUMMARY_FRAGMENT}
  query GetVenues(
    $filters: VenueFiltersInput
    $pagination: PaginationInput
    $sortBy: VenueSortInput
  ) {
    venues(
      filters: $filters
      pagination: $pagination
      sortBy: $sortBy
    ) {
      venues {
        ...VenueSummaryFragment
      }
      totalCount
      hasMore
      currentPage
      totalPages
    }
  }
`;

// Get single venue by ID
export const GET_VENUE = gql`
  ${VENUE_FRAGMENT}
  query GetVenue($id: ID!) {
    venue(id: $id) {
      ...VenueFragment
      reviews {
        id
        userId
        rating
        comment
        eventType
        eventDate
        createdAt
        user {
          id
          userName
        }
      }
      availability {
        date
        timeSlots {
          startTime
          endTime
          isAvailable
          bookingId
        }
      }
    }
  }
`;

// Get vendor's venues
export const GET_VENDOR_VENUES = gql`
  ${VENUE_FRAGMENT}
  query GetVendorVenues(
    $filters: VenueFiltersInput
    $pagination: PaginationInput
  ) {
    vendorVenues(filters: $filters, pagination: $pagination) {
      venues {
        ...VenueFragment
      }
      totalCount
      hasMore
      currentPage
      totalPages
    }
  }
`;

// Search venues
export const SEARCH_VENUES = gql`
  ${VENUE_SUMMARY_FRAGMENT}
  query SearchVenues(
    $searchTerm: String!
    $filters: VenueFiltersInput
    $pagination: PaginationInput
  ) {
    searchVenues(
      searchTerm: $searchTerm
      filters: $filters
      pagination: $pagination
    ) {
      venues {
        ...VenueSummaryFragment
      }
      totalCount
      hasMore
      currentPage
      totalPages
    }
  }
`;

// Get venues by location
export const GET_VENUES_BY_LOCATION = gql`
  ${VENUE_SUMMARY_FRAGMENT}
  query GetVenuesByLocation(
    $location: String!
    $radius: Float
    $filters: VenueFiltersInput
    $pagination: PaginationInput
  ) {
    venuesByLocation(
      location: $location
      radius: $radius
      filters: $filters
      pagination: $pagination
    ) {
      venues {
        ...VenueSummaryFragment
        distance
      }
      totalCount
      hasMore
      currentPage
      totalPages
    }
  }
`;

// Get venues by coordinates
export const GET_VENUES_BY_COORDINATES = gql`
  ${VENUE_SUMMARY_FRAGMENT}
  query GetVenuesByCoordinates(
    $latitude: Float!
    $longitude: Float!
    $radius: Float!
    $filters: VenueFiltersInput
    $pagination: PaginationInput
  ) {
    venuesByCoordinates(
      latitude: $latitude
      longitude: $longitude
      radius: $radius
      filters: $filters
      pagination: $pagination
    ) {
      venues {
        ...VenueSummaryFragment
        distance
      }
      totalCount
      hasMore
      currentPage
      totalPages
    }
  }
`;

// Get featured venues
export const GET_FEATURED_VENUES = gql`
  ${VENUE_SUMMARY_FRAGMENT}
  query GetFeaturedVenues($limit: Int) {
    featuredVenues(limit: $limit) {
      ...VenueSummaryFragment
    }
  }
`;

// Get popular venues
export const GET_POPULAR_VENUES = gql`
  ${VENUE_SUMMARY_FRAGMENT}
  query GetPopularVenues($limit: Int) {
    popularVenues(limit: $limit) {
      ...VenueSummaryFragment
    }
  }
`;

// Get venue availability
export const GET_VENUE_AVAILABILITY = gql`
  query GetVenueAvailability($venueId: ID!, $startDate: String!, $endDate: String!) {
    venueAvailability(venueId: $venueId, startDate: $startDate, endDate: $endDate) {
      date
      timeSlots {
        startTime
        endTime
        isAvailable
        bookingId
        eventType
      }
    }
  }
`;

// Get venues by amenities
export const GET_VENUES_BY_AMENITIES = gql`
  ${VENUE_SUMMARY_FRAGMENT}
  query GetVenuesByAmenities(
    $amenities: [VenueAmenity!]!
    $filters: VenueFiltersInput
    $pagination: PaginationInput
  ) {
    venuesByAmenities(
      amenities: $amenities
      filters: $filters
      pagination: $pagination
    ) {
      venues {
        ...VenueSummaryFragment
      }
      totalCount
      hasMore
      currentPage
      totalPages
    }
  }
`;

// ============== MUTATIONS ==============

// Create venue (vendor only)
export const CREATE_VENUE = gql`
  ${VENUE_FRAGMENT}
  mutation CreateVenue($input: CreateVenueInput!) {
    createVenue(input: $input) {
      ...VenueFragment
    }
  }
`;

// Update venue (vendor only)
export const UPDATE_VENUE = gql`
  ${VENUE_FRAGMENT}
  mutation UpdateVenue($id: ID!, $input: UpdateVenueInput!) {
    updateVenue(id: $id, input: $input) {
      ...VenueFragment
    }
  }
`;

// Delete venue (vendor only)
export const DELETE_VENUE = gql`
  mutation DeleteVenue($id: ID!) {
    deleteVenue(id: $id) {
      success
      message
    }
  }
`;

// Toggle venue active status (vendor only)
export const TOGGLE_VENUE_STATUS = gql`
  ${VENUE_FRAGMENT}
  mutation ToggleVenueStatus($id: ID!) {
    toggleVenueStatus(id: $id) {
      ...VenueFragment
    }
  }
`;

// Upload venue images (vendor only)
export const UPLOAD_VENUE_IMAGES = gql`
  mutation UploadVenueImages($venueId: ID!, $images: [Upload!]!) {
    uploadVenueImages(venueId: $venueId, images: $images) {
      id
      images
    }
  }
`;

// Upload venue floor plan (vendor only)
export const UPLOAD_VENUE_FLOOR_PLAN = gql`
  mutation UploadVenueFloorPlan($venueId: ID!, $floorPlan: Upload!) {
    uploadVenueFloorPlan(venueId: $venueId, floorPlan: $floorPlan) {
      id
      floorPlan
    }
  }
`;

// Remove venue image (vendor only)
export const REMOVE_VENUE_IMAGE = gql`
  mutation RemoveVenueImage($venueId: ID!, $imageUrl: String!) {
    removeVenueImage(venueId: $venueId, imageUrl: $imageUrl) {
      id
      images
    }
  }
`;

// Update venue availability (vendor only)
export const UPDATE_VENUE_AVAILABILITY = gql`
  mutation UpdateVenueAvailability($input: UpdateVenueAvailabilityInput!) {
    updateVenueAvailability(input: $input) {
      success
      message
    }
  }
`;

// Block venue dates (vendor only)
export const BLOCK_VENUE_DATES = gql`
  mutation BlockVenueDates($input: BlockVenueDatesInput!) {
    blockVenueDates(input: $input) {
      success
      message
    }
  }
`;

// Unblock venue dates (vendor only)
export const UNBLOCK_VENUE_DATES = gql`
  mutation UnblockVenueDates($input: UnblockVenueDatesInput!) {
    unblockVenueDates(input: $input) {
      success
      message
    }
  }
`;

// Add venue review (user only)
export const ADD_VENUE_REVIEW = gql`
  mutation AddVenueReview($input: AddVenueReviewInput!) {
    addVenueReview(input: $input) {
      id
      userId
      venueId
      rating
      comment
      eventType
      eventDate
      createdAt
      user {
        id
        userName
      }
    }
  }
`;

// Update venue review (user only)
export const UPDATE_VENUE_REVIEW = gql`
  mutation UpdateVenueReview($id: ID!, $input: UpdateVenueReviewInput!) {
    updateVenueReview(id: $id, input: $input) {
      id
      rating
      comment
      eventType
      eventDate
      updatedAt
    }
  }
`;

// Delete venue review (user only)
export const DELETE_VENUE_REVIEW = gql`
  mutation DeleteVenueReview($id: ID!) {
    deleteVenueReview(id: $id) {
      success
      message
    }
  }
`;

// Book venue (user only)
export const BOOK_VENUE = gql`
  mutation BookVenue($input: BookVenueInput!) {
    bookVenue(input: $input) {
      id
      userId
      vendorId
      serviceType
      serviceId
      eventDate
      eventTime
      eventDuration
      guestCount
      specialRequests
      totalAmount
      advanceAmount
      remainingAmount
      paymentStatus
      bookingStatus
      createdAt
    }
  }
`;

// Request venue quote (user only)
export const REQUEST_VENUE_QUOTE = gql`
  mutation RequestVenueQuote($input: VenueQuoteRequestInput!) {
    requestVenueQuote(input: $input) {
      id
      userId
      venueId
      eventType
      eventDate
      startTime
      endTime
      guestCount
      requirements
      budget
      status
      createdAt
    }
  }
`;

// Respond to venue quote (vendor only)
export const RESPOND_TO_VENUE_QUOTE = gql`
  mutation RespondToVenueQuote($id: ID!, $response: VenueQuoteResponseInput!) {
    respondToVenueQuote(id: $id, response: $response) {
      id
      vendorResponse
      quotedPrice
      availablePackages
      status
      respondedAt
    }
  }
`;

// ============== TYPESCRIPT INTERFACES ==============

export interface Venue {
  id: string;
  vendorId: string;
  venueName: string;
  description?: string;
  venueType: VenueType;
  capacity: number;
  location: string;
  address: string;
  city: string;
  state?: string;
  zipCode?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  pricePerHour?: number;
  pricePerDay?: number;
  pricePerEvent?: number;
  minimumBookingHours?: number;
  setupTime?: number; // in minutes
  cleanupTime?: number; // in minutes
  availableAmenities: VenueAmenity[];
  cateringOptions?: CateringOption[];
  parkingSpaces?: number;
  accessibilityFeatures?: AccessibilityFeature[];
  indoorOutdoor: IndoorOutdoor;
  floorArea?: number; // in square feet
  ceilingHeight?: number; // in feet
  audioVisualEquipment?: AVEquipment[];
  decorationPolicy?: string;
  alcoholPolicy?: AlcoholPolicy;
  smokingPolicy?: SmokingPolicy;
  petPolicy?: PetPolicy;
  cancellationPolicy?: string;
  rules?: string[];
  images?: string[];
  floorPlan?: string;
  rating?: number;
  reviewCount?: number;
  availabilityStatus: AvailabilityStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  vendor?: Vendor;
  reviews?: VenueReview[];
  availability?: VenueAvailability[];
  distance?: number;
}

export interface CreateVenueInput {
  venueName: string;
  description?: string;
  venueType: VenueType;
  capacity: number;
  location: string;
  address: string;
  city: string;
  state?: string;
  zipCode?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  pricePerHour?: number;
  pricePerDay?: number;
  pricePerEvent?: number;
  minimumBookingHours?: number;
  setupTime?: number;
  cleanupTime?: number;
  availableAmenities: VenueAmenity[];
  cateringOptions?: CateringOption[];
  parkingSpaces?: number;
  accessibilityFeatures?: AccessibilityFeature[];
  indoorOutdoor: IndoorOutdoor;
  floorArea?: number;
  ceilingHeight?: number;
  audioVisualEquipment?: AVEquipment[];
  decorationPolicy?: string;
  alcoholPolicy?: AlcoholPolicy;
  smokingPolicy?: SmokingPolicy;
  petPolicy?: PetPolicy;
  cancellationPolicy?: string;
  rules?: string[];
}

export interface UpdateVenueInput {
  venueName?: string;
  description?: string;
  venueType?: VenueType;
  capacity?: number;
  location?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  pricePerHour?: number;
  pricePerDay?: number;
  pricePerEvent?: number;
  minimumBookingHours?: number;
  setupTime?: number;
  cleanupTime?: number;
  availableAmenities?: VenueAmenity[];
  cateringOptions?: CateringOption[];
  parkingSpaces?: number;
  accessibilityFeatures?: AccessibilityFeature[];
  indoorOutdoor?: IndoorOutdoor;
  floorArea?: number;
  ceilingHeight?: number;
  audioVisualEquipment?: AVEquipment[];
  decorationPolicy?: string;
  alcoholPolicy?: AlcoholPolicy;
  smokingPolicy?: SmokingPolicy;
  petPolicy?: PetPolicy;
  cancellationPolicy?: string;
  rules?: string[];
}

export interface VenueFiltersInput {
  vendorId?: string;
  venueType?: VenueType[];
  city?: string[];
  state?: string[];
  minCapacity?: number;
  maxCapacity?: number;
  minPricePerHour?: number;
  maxPricePerHour?: number;
  minPricePerDay?: number;
  maxPricePerDay?: number;
  minPricePerEvent?: number;
  maxPricePerEvent?: number;
  amenities?: VenueAmenity[];
  indoorOutdoor?: IndoorOutdoor[];
  cateringOptions?: CateringOption[];
  alcoholPolicy?: AlcoholPolicy[];
  accessibilityFeatures?: AccessibilityFeature[];
  minRating?: number;
  availabilityStatus?: AvailabilityStatus[];
  isActive?: boolean;
  coordinates?: {
    latitude: number;
    longitude: number;
    radius: number; // in km
  };
}

export interface VenueSortInput {
  field: VenueSortField;
  direction: SortDirection;
}

export interface BookVenueInput {
  venueId: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  eventType: string;
  guestCount: number;
  specialRequests?: string;
  setupRequired?: boolean;
  cateringRequired?: boolean;
}

export interface VenueQuoteRequestInput {
  venueId: string;
  eventType: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  guestCount: number;
  requirements: string;
  budget?: number;
}

export interface VenueQuoteResponseInput {
  vendorResponse: string;
  quotedPrice: number;
  availablePackages?: string[];
}

export interface UpdateVenueAvailabilityInput {
  venueId: string;
  date: string;
  timeSlots: TimeSlotInput[];
}

export interface BlockVenueDatesInput {
  venueId: string;
  startDate: string;
  endDate: string;
  reason?: string;
}

export interface UnblockVenueDatesInput {
  venueId: string;
  startDate: string;
  endDate: string;
}

export interface TimeSlotInput {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface VenueAvailability {
  date: string;
  timeSlots: TimeSlot[];
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  bookingId?: string;
  eventType?: string;
}

export interface AddVenueReviewInput {
  venueId: string;
  rating: number;
  comment?: string;
  eventType?: string;
  eventDate?: string;
}

export interface UpdateVenueReviewInput {
  rating?: number;
  comment?: string;
  eventType?: string;
  eventDate?: string;
}

export interface VenueReview {
  id: string;
  userId: string;
  venueId: string;
  rating: number;
  comment?: string;
  eventType?: string;
  eventDate?: string;
  createdAt: string;
  user?: {
    id: string;
    userName: string;
  };
}

export type VenueType = 
  | 'BanquetHall'
  | 'WeddingVenue'
  | 'ConferenceCenter'
  | 'Restaurant'
  | 'Hotel'
  | 'GardenVenue'
  | 'Rooftop'
  | 'Ballroom'
  | 'CommunityCenter'
  | 'Warehouse'
  | 'Beach'
  | 'Mountain'
  | 'Historic'
  | 'Modern'
  | 'Rustic'
  | 'Outdoor'
  | 'Indoor'
  | 'Other';

export type VenueAmenity = 
  | 'WiFi'
  | 'Parking'
  | 'AirConditioning'
  | 'Heating'
  | 'Kitchen'
  | 'Bar'
  | 'DanceFloor'
  | 'Stage'
  | 'SoundSystem'
  | 'Projector'
  | 'Screen'
  | 'Microphones'
  | 'Lighting'
  | 'PhotoBooth'
  | 'BridalSuite'
  | 'GreenRoom'
  | 'SecuritySystem'
  | 'Catering'
  | 'Tables'
  | 'Chairs'
  | 'Linens'
  | 'Generator'
  | 'Restrooms'
  | 'Wheelchair Access'
  | 'Elevator'
  | 'Coat Check'
  | 'Valet Parking'
  | 'Garden'
  | 'Pool'
  | 'Fireplace'
  | 'Piano'
  | 'Photography Area';

export type CateringOption = 
  | 'InHouseCatering'
  | 'PreferredVendors'
  | 'ExternalAllowed'
  | 'KitchenAvailable'
  | 'NoFoodAllowed';

export type AccessibilityFeature = 
  | 'WheelchairAccessible'
  | 'Elevator'
  | 'HandicapParking'
  | 'AccessibleRestrooms'
  | 'HearingLoop'
  | 'Braille'
  | 'ServiceAnimalsAllowed';

export type IndoorOutdoor = 
  | 'Indoor'
  | 'Outdoor'
  | 'Both'
  | 'CoveredOutdoor';

export type AVEquipment = 
  | 'SoundSystem'
  | 'Microphones'
  | 'Projector'
  | 'Screen'
  | 'TV'
  | 'LightingSystem'
  | 'DJ Booth'
  | 'Piano'
  | 'Stage'
  | 'BackgroundMusic';

export type AlcoholPolicy = 
  | 'Allowed'
  | 'LicenseRequired'
  | 'BYOBAllowed'
  | 'FullBarAvailable'
  | 'NotAllowed';

export type SmokingPolicy = 
  | 'Allowed'
  | 'DesignatedAreas'
  | 'OutdoorOnly'
  | 'NotAllowed';

export type PetPolicy = 
  | 'Allowed'
  | 'ServiceAnimalsOnly'
  | 'CaseByCase'
  | 'NotAllowed';

export type AvailabilityStatus = 
  | 'Available'
  | 'Busy'
  | 'Unavailable';

export type VenueSortField = 
  | 'venueName'
  | 'capacity'
  | 'pricePerHour'
  | 'pricePerDay'
  | 'pricePerEvent'
  | 'rating'
  | 'reviewCount'
  | 'createdAt'
  | 'distance';

export type SortDirection = 'ASC' | 'DESC';

export interface PaginationInput {
  page?: number;
  limit?: number;
}

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
