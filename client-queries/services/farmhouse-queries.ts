// Client-side GraphQL operations for FarmHouses

import { gql } from '@apollo/client';

// ============== FRAGMENTS ==============

export const FARMHOUSE_FRAGMENT = gql`
  fragment FarmHouseFragment on FarmHouse {
    id
    vendorId
    farmHouseName
    description
    location
    address
    city
    state
    zipCode
    coordinates {
      latitude
      longitude
    }
    farmHouseType
    capacity
    numberOfRooms
    numberOfBathrooms
    perNightPrice
    perDayPrice
    weekendSurcharge
    holidaySurcharge
    minimumStayNights
    checkInTime
    checkOutTime
    amenities
    outdoorActivities
    indoorActivities
    nearbyAttractions
    diningOptions
    kitchenFacilities
    entertainmentOptions
    safetyFeatures
    accessibility
    petPolicy
    smokingPolicy
    cancellationPolicy
    houseRules
    images
    virtualTour
    floorPlan
    rating
    reviewCount
    availability
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

export const FARMHOUSE_SUMMARY_FRAGMENT = gql`
  fragment FarmHouseSummaryFragment on FarmHouse {
    id
    vendorId
    farmHouseName
    description
    location
    address
    city
    farmHouseType
    capacity
    numberOfRooms
    perNightPrice
    perDayPrice
    amenities
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

// Get all farmhouses with filters
export const GET_FARMHOUSES = gql`
  ${FARMHOUSE_SUMMARY_FRAGMENT}
  query GetFarmHouses(
    $filters: FarmHouseFiltersInput
    $pagination: PaginationInput
    $sortBy: FarmHouseSortInput
  ) {
    farmHouses(
      filters: $filters
      pagination: $pagination
      sortBy: $sortBy
    ) {
      farmHouses {
        ...FarmHouseSummaryFragment
      }
      totalCount
      hasMore
      currentPage
      totalPages
    }
  }
`;

// Get single farmhouse by ID
export const GET_FARMHOUSE = gql`
  ${FARMHOUSE_FRAGMENT}
  query GetFarmHouse($id: ID!) {
    farmHouse(id: $id) {
      ...FarmHouseFragment
      reviews {
        id
        userId
        rating
        comment
        stayDuration
        visitPurpose
        checkInDate
        checkOutDate
        createdAt
        user {
          id
          userName
        }
      }
      availability {
        date
        isAvailable
        price
        minimumStay
        bookingId
      }
    }
  }
`;

// Get vendor's farmhouses
export const GET_VENDOR_FARMHOUSES = gql`
  ${FARMHOUSE_FRAGMENT}
  query GetVendorFarmHouses(
    $filters: FarmHouseFiltersInput
    $pagination: PaginationInput
  ) {
    vendorFarmHouses(filters: $filters, pagination: $pagination) {
      farmHouses {
        ...FarmHouseFragment
      }
      totalCount
      hasMore
      currentPage
      totalPages
    }
  }
`;

// Search farmhouses
export const SEARCH_FARMHOUSES = gql`
  ${FARMHOUSE_SUMMARY_FRAGMENT}
  query SearchFarmHouses(
    $searchTerm: String!
    $filters: FarmHouseFiltersInput
    $pagination: PaginationInput
  ) {
    searchFarmHouses(
      searchTerm: $searchTerm
      filters: $filters
      pagination: $pagination
    ) {
      farmHouses {
        ...FarmHouseSummaryFragment
      }
      totalCount
      hasMore
      currentPage
      totalPages
    }
  }
`;

// Get farmhouses by location
export const GET_FARMHOUSES_BY_LOCATION = gql`
  ${FARMHOUSE_SUMMARY_FRAGMENT}
  query GetFarmHousesByLocation(
    $location: String!
    $radius: Float
    $filters: FarmHouseFiltersInput
    $pagination: PaginationInput
  ) {
    farmHousesByLocation(
      location: $location
      radius: $radius
      filters: $filters
      pagination: $pagination
    ) {
      farmHouses {
        ...FarmHouseSummaryFragment
        distance
      }
      totalCount
      hasMore
      currentPage
      totalPages
    }
  }
`;

// Get farmhouses by coordinates
export const GET_FARMHOUSES_BY_COORDINATES = gql`
  ${FARMHOUSE_SUMMARY_FRAGMENT}
  query GetFarmHousesByCoordinates(
    $latitude: Float!
    $longitude: Float!
    $radius: Float!
    $filters: FarmHouseFiltersInput
    $pagination: PaginationInput
  ) {
    farmHousesByCoordinates(
      latitude: $latitude
      longitude: $longitude
      radius: $radius
      filters: $filters
      pagination: $pagination
    ) {
      farmHouses {
        ...FarmHouseSummaryFragment
        distance
      }
      totalCount
      hasMore
      currentPage
      totalPages
    }
  }
`;

// Get featured farmhouses
export const GET_FEATURED_FARMHOUSES = gql`
  ${FARMHOUSE_SUMMARY_FRAGMENT}
  query GetFeaturedFarmHouses($limit: Int) {
    featuredFarmHouses(limit: $limit) {
      ...FarmHouseSummaryFragment
    }
  }
`;

// Get popular farmhouses
export const GET_POPULAR_FARMHOUSES = gql`
  ${FARMHOUSE_SUMMARY_FRAGMENT}
  query GetPopularFarmHouses($limit: Int) {
    popularFarmHouses(limit: $limit) {
      ...FarmHouseSummaryFragment
    }
  }
`;

// Get farmhouse availability
export const GET_FARMHOUSE_AVAILABILITY = gql`
  query GetFarmHouseAvailability($farmHouseId: ID!, $startDate: String!, $endDate: String!) {
    farmHouseAvailability(farmHouseId: $farmHouseId, startDate: $startDate, endDate: $endDate) {
      date
      isAvailable
      price
      minimumStay
      bookingId
      specialEvent
    }
  }
`;

// Get farmhouses by amenities
export const GET_FARMHOUSES_BY_AMENITIES = gql`
  ${FARMHOUSE_SUMMARY_FRAGMENT}
  query GetFarmHousesByAmenities(
    $amenities: [FarmHouseAmenity!]!
    $filters: FarmHouseFiltersInput
    $pagination: PaginationInput
  ) {
    farmHousesByAmenities(
      amenities: $amenities
      filters: $filters
      pagination: $pagination
    ) {
      farmHouses {
        ...FarmHouseSummaryFragment
      }
      totalCount
      hasMore
      currentPage
      totalPages
    }
  }
`;

// Get farmhouses by activities
export const GET_FARMHOUSES_BY_ACTIVITIES = gql`
  ${FARMHOUSE_SUMMARY_FRAGMENT}
  query GetFarmHousesByActivities(
    $activities: [Activity!]!
    $filters: FarmHouseFiltersInput
    $pagination: PaginationInput
  ) {
    farmHousesByActivities(
      activities: $activities
      filters: $filters
      pagination: $pagination
    ) {
      farmHouses {
        ...FarmHouseSummaryFragment
      }
      totalCount
      hasMore
      currentPage
      totalPages
    }
  }
`;

// ============== MUTATIONS ==============

// Create farmhouse (vendor only)
export const CREATE_FARMHOUSE = gql`
  ${FARMHOUSE_FRAGMENT}
  mutation CreateFarmHouse($input: CreateFarmHouseInput!) {
    createFarmHouse(input: $input) {
      ...FarmHouseFragment
    }
  }
`;

// Update farmhouse (vendor only)
export const UPDATE_FARMHOUSE = gql`
  ${FARMHOUSE_FRAGMENT}
  mutation UpdateFarmHouse($id: ID!, $input: UpdateFarmHouseInput!) {
    updateFarmHouse(id: $id, input: $input) {
      ...FarmHouseFragment
    }
  }
`;

// Delete farmhouse (vendor only)
export const DELETE_FARMHOUSE = gql`
  mutation DeleteFarmHouse($id: ID!) {
    deleteFarmHouse(id: $id) {
      success
      message
    }
  }
`;

// Toggle farmhouse active status (vendor only)
export const TOGGLE_FARMHOUSE_STATUS = gql`
  ${FARMHOUSE_FRAGMENT}
  mutation ToggleFarmHouseStatus($id: ID!) {
    toggleFarmHouseStatus(id: $id) {
      ...FarmHouseFragment
    }
  }
`;

// Upload farmhouse images (vendor only)
export const UPLOAD_FARMHOUSE_IMAGES = gql`
  mutation UploadFarmHouseImages($farmHouseId: ID!, $images: [Upload!]!) {
    uploadFarmHouseImages(farmHouseId: $farmHouseId, images: $images) {
      id
      images
    }
  }
`;

// Upload farmhouse virtual tour (vendor only)
export const UPLOAD_FARMHOUSE_VIRTUAL_TOUR = gql`
  mutation UploadFarmHouseVirtualTour($farmHouseId: ID!, $virtualTour: Upload!) {
    uploadFarmHouseVirtualTour(farmHouseId: $farmHouseId, virtualTour: $virtualTour) {
      id
      virtualTour
    }
  }
`;

// Upload farmhouse floor plan (vendor only)
export const UPLOAD_FARMHOUSE_FLOOR_PLAN = gql`
  mutation UploadFarmHouseFloorPlan($farmHouseId: ID!, $floorPlan: Upload!) {
    uploadFarmHouseFloorPlan(farmHouseId: $farmHouseId, floorPlan: $floorPlan) {
      id
      floorPlan
    }
  }
`;

// Remove farmhouse image (vendor only)
export const REMOVE_FARMHOUSE_IMAGE = gql`
  mutation RemoveFarmHouseImage($farmHouseId: ID!, $imageUrl: String!) {
    removeFarmHouseImage(farmHouseId: $farmHouseId, imageUrl: $imageUrl) {
      id
      images
    }
  }
`;

// Update farmhouse availability (vendor only)
export const UPDATE_FARMHOUSE_AVAILABILITY = gql`
  mutation UpdateFarmHouseAvailability($input: UpdateFarmHouseAvailabilityInput!) {
    updateFarmHouseAvailability(input: $input) {
      success
      message
    }
  }
`;

// Set farmhouse pricing (vendor only)
export const SET_FARMHOUSE_PRICING = gql`
  ${FARMHOUSE_FRAGMENT}
  mutation SetFarmHousePricing($id: ID!, $pricing: FarmHousePricingInput!) {
    setFarmHousePricing(id: $id, pricing: $pricing) {
      ...FarmHouseFragment
    }
  }
`;

// Block farmhouse dates (vendor only)
export const BLOCK_FARMHOUSE_DATES = gql`
  mutation BlockFarmHouseDates($input: BlockFarmHouseDatesInput!) {
    blockFarmHouseDates(input: $input) {
      success
      message
    }
  }
`;

// Unblock farmhouse dates (vendor only)
export const UNBLOCK_FARMHOUSE_DATES = gql`
  mutation UnblockFarmHouseDates($input: UnblockFarmHouseDatesInput!) {
    unblockFarmHouseDates(input: $input) {
      success
      message
    }
  }
`;

// Add farmhouse review (user only)
export const ADD_FARMHOUSE_REVIEW = gql`
  mutation AddFarmHouseReview($input: AddFarmHouseReviewInput!) {
    addFarmHouseReview(input: $input) {
      id
      userId
      farmHouseId
      rating
      comment
      stayDuration
      visitPurpose
      checkInDate
      checkOutDate
      createdAt
      user {
        id
        userName
      }
    }
  }
`;

// Update farmhouse review (user only)
export const UPDATE_FARMHOUSE_REVIEW = gql`
  mutation UpdateFarmHouseReview($id: ID!, $input: UpdateFarmHouseReviewInput!) {
    updateFarmHouseReview(id: $id, input: $input) {
      id
      rating
      comment
      stayDuration
      visitPurpose
      updatedAt
    }
  }
`;

// Delete farmhouse review (user only)
export const DELETE_FARMHOUSE_REVIEW = gql`
  mutation DeleteFarmHouseReview($id: ID!) {
    deleteFarmHouseReview(id: $id) {
      success
      message
    }
  }
`;

// Book farmhouse (user only)
export const BOOK_FARMHOUSE = gql`
  mutation BookFarmHouse($input: BookFarmHouseInput!) {
    bookFarmHouse(input: $input) {
      id
      userId
      vendorId
      serviceType
      serviceId
      checkInDate
      checkOutDate
      numberOfNights
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

// Request farmhouse quote (user only)
export const REQUEST_FARMHOUSE_QUOTE = gql`
  mutation RequestFarmHouseQuote($input: FarmHouseQuoteRequestInput!) {
    requestFarmHouseQuote(input: $input) {
      id
      userId
      farmHouseId
      checkInDate
      checkOutDate
      guestCount
      purpose
      requirements
      budget
      status
      createdAt
    }
  }
`;

// Respond to farmhouse quote (vendor only)
export const RESPOND_TO_FARMHOUSE_QUOTE = gql`
  mutation RespondToFarmHouseQuote($id: ID!, $response: FarmHouseQuoteResponseInput!) {
    respondToFarmHouseQuote(id: $id, response: $response) {
      id
      vendorResponse
      quotedPrice
      availablePackages
      specialOffers
      status
      respondedAt
    }
  }
`;

// ============== TYPESCRIPT INTERFACES ==============

export interface FarmHouse {
  id: string;
  vendorId: string;
  farmHouseName: string;
  description?: string;
  location: string;
  address: string;
  city: string;
  state?: string;
  zipCode?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  farmHouseType: FarmHouseType;
  capacity: number;
  numberOfRooms: number;
  numberOfBathrooms: number;
  perNightPrice: number;
  perDayPrice?: number;
  weekendSurcharge?: number;
  holidaySurcharge?: number;
  minimumStayNights: number;
  checkInTime: string;
  checkOutTime: string;
  amenities: FarmHouseAmenity[];
  outdoorActivities?: Activity[];
  indoorActivities?: Activity[];
  nearbyAttractions?: string[];
  diningOptions?: DiningOption[];
  kitchenFacilities?: KitchenFacility[];
  entertainmentOptions?: Entertainment[];
  safetyFeatures?: SafetyFeature[];
  accessibility?: AccessibilityFeature[];
  petPolicy: PetPolicy;
  smokingPolicy: SmokingPolicy;
  cancellationPolicy?: string;
  houseRules?: string[];
  images?: string[];
  virtualTour?: string;
  floorPlan?: string;
  rating?: number;
  reviewCount?: number;
  availability?: FarmHouseAvailability[];
  availabilityStatus: AvailabilityStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  vendor?: Vendor;
  reviews?: FarmHouseReview[];
  distance?: number;
}

export interface CreateFarmHouseInput {
  farmHouseName: string;
  description?: string;
  location: string;
  address: string;
  city: string;
  state?: string;
  zipCode?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  farmHouseType: FarmHouseType;
  capacity: number;
  numberOfRooms: number;
  numberOfBathrooms: number;
  perNightPrice: number;
  perDayPrice?: number;
  weekendSurcharge?: number;
  holidaySurcharge?: number;
  minimumStayNights: number;
  checkInTime: string;
  checkOutTime: string;
  amenities: FarmHouseAmenity[];
  outdoorActivities?: Activity[];
  indoorActivities?: Activity[];
  nearbyAttractions?: string[];
  diningOptions?: DiningOption[];
  kitchenFacilities?: KitchenFacility[];
  entertainmentOptions?: Entertainment[];
  safetyFeatures?: SafetyFeature[];
  accessibility?: AccessibilityFeature[];
  petPolicy: PetPolicy;
  smokingPolicy: SmokingPolicy;
  cancellationPolicy?: string;
  houseRules?: string[];
}

export interface UpdateFarmHouseInput {
  farmHouseName?: string;
  description?: string;
  location?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  farmHouseType?: FarmHouseType;
  capacity?: number;
  numberOfRooms?: number;
  numberOfBathrooms?: number;
  perNightPrice?: number;
  perDayPrice?: number;
  weekendSurcharge?: number;
  holidaySurcharge?: number;
  minimumStayNights?: number;
  checkInTime?: string;
  checkOutTime?: string;
  amenities?: FarmHouseAmenity[];
  outdoorActivities?: Activity[];
  indoorActivities?: Activity[];
  nearbyAttractions?: string[];
  diningOptions?: DiningOption[];
  kitchenFacilities?: KitchenFacility[];
  entertainmentOptions?: Entertainment[];
  safetyFeatures?: SafetyFeature[];
  accessibility?: AccessibilityFeature[];
  petPolicy?: PetPolicy;
  smokingPolicy?: SmokingPolicy;
  cancellationPolicy?: string;
  houseRules?: string[];
}

export interface FarmHouseFiltersInput {
  vendorId?: string;
  farmHouseType?: FarmHouseType[];
  city?: string[];
  state?: string[];
  minCapacity?: number;
  maxCapacity?: number;
  minRooms?: number;
  maxRooms?: number;
  minPricePerNight?: number;
  maxPricePerNight?: number;
  amenities?: FarmHouseAmenity[];
  outdoorActivities?: Activity[];
  indoorActivities?: Activity[];
  diningOptions?: DiningOption[];
  petPolicy?: PetPolicy[];
  smokingPolicy?: SmokingPolicy[];
  accessibility?: AccessibilityFeature[];
  minRating?: number;
  availabilityStatus?: AvailabilityStatus[];
  isActive?: boolean;
  checkInDate?: string;
  checkOutDate?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
    radius: number; // in km
  };
}

export interface FarmHouseSortInput {
  field: FarmHouseSortField;
  direction: SortDirection;
}

export interface BookFarmHouseInput {
  farmHouseId: string;
  checkInDate: string;
  checkOutDate: string;
  guestCount: number;
  specialRequests?: string;
  purpose?: string;
}

export interface FarmHouseQuoteRequestInput {
  farmHouseId: string;
  checkInDate: string;
  checkOutDate: string;
  guestCount: number;
  purpose: string;
  requirements: string;
  budget?: number;
}

export interface FarmHouseQuoteResponseInput {
  vendorResponse: string;
  quotedPrice: number;
  availablePackages?: string[];
  specialOffers?: string[];
}

export interface UpdateFarmHouseAvailabilityInput {
  farmHouseId: string;
  startDate: string;
  endDate: string;
  availabilityData: FarmHouseAvailabilityInput[];
}

export interface FarmHouseAvailabilityInput {
  date: string;
  isAvailable: boolean;
  price?: number;
  minimumStay?: number;
}

export interface FarmHousePricingInput {
  perNightPrice?: number;
  perDayPrice?: number;
  weekendSurcharge?: number;
  holidaySurcharge?: number;
  minimumStayNights?: number;
}

export interface BlockFarmHouseDatesInput {
  farmHouseId: string;
  startDate: string;
  endDate: string;
  reason?: string;
}

export interface UnblockFarmHouseDatesInput {
  farmHouseId: string;
  startDate: string;
  endDate: string;
}

export interface FarmHouseAvailability {
  date: string;
  isAvailable: boolean;
  price?: number;
  minimumStay?: number;
  bookingId?: string;
  specialEvent?: string;
}

export interface AddFarmHouseReviewInput {
  farmHouseId: string;
  rating: number;
  comment?: string;
  stayDuration?: number;
  visitPurpose?: string;
  checkInDate?: string;
  checkOutDate?: string;
}

export interface UpdateFarmHouseReviewInput {
  rating?: number;
  comment?: string;
  stayDuration?: number;
  visitPurpose?: string;
}

export interface FarmHouseReview {
  id: string;
  userId: string;
  farmHouseId: string;
  rating: number;
  comment?: string;
  stayDuration?: number;
  visitPurpose?: string;
  checkInDate?: string;
  checkOutDate?: string;
  createdAt: string;
  user?: {
    id: string;
    userName: string;
  };
}

export type FarmHouseType = 
  | 'TraditionalFarm'
  | 'ModernFarmHouse'
  | 'RusticCottage'
  | 'LuxuryVilla'
  | 'CountryEstate'
  | 'WineryFarm'
  | 'OrganicFarm'
  | 'RanchHouse'
  | 'BarnConversion'
  | 'EcoFarm'
  | 'HistoricFarm'
  | 'MountainRetreat'
  | 'LakehouseFarm'
  | 'DesertRanch'
  | 'Other';

export type FarmHouseAmenity = 
  | 'WiFi'
  | 'Parking'
  | 'AirConditioning'
  | 'Heating'
  | 'FullKitchen'
  | 'Kitchenette'
  | 'Fireplace'
  | 'Garden'
  | 'Balcony'
  | 'Terrace'
  | 'Pool'
  | 'Jacuzzi'
  | 'Barbecue'
  | 'OutdoorDining'
  | 'Playground'
  | 'PettingZoo'
  | 'HorseRiding'
  | 'Fishing'
  | 'Hiking'
  | 'Cycling'
  | 'GameRoom'
  | 'Library'
  | 'Spa'
  | 'Gym'
  | 'LaundryFacility'
  | 'DryerFacility'
  | 'SafetyDeposit'
  | 'FirstAidKit'
  | 'SecuritySystem'
  | 'Generator'
  | 'SolarPower'
  | 'OrganicGarden'
  | 'FarmAnimals'
  | 'Greenhouse'
  | 'Workshop'
  | 'EventSpace';

export type Activity = 
  | 'HorseRiding'
  | 'Fishing'
  | 'Hiking'
  | 'Cycling'
  | 'Swimming'
  | 'Boating'
  | 'Kayaking'
  | 'RockClimbing'
  | 'ZipLining'
  | 'AnimalFeeding'
  | 'FarmTour'
  | 'CookingClass'
  | 'Pottery'
  | 'Painting'
  | 'Photography'
  | 'Stargazing'
  | 'Campfire'
  | 'BBQ'
  | 'GameNight'
  | 'MovieNight'
  | 'Spa'
  | 'Yoga'
  | 'Meditation'
  | 'BookReading'
  | 'BoardGames'
  | 'CardGames'
  | 'BilliardPool'
  | 'TableTennis'
  | 'Badminton'
  | 'Volleyball';

export type DiningOption = 
  | 'SelfCatering'
  | 'BreakfastIncluded'
  | 'HalfBoard'
  | 'FullBoard'
  | 'FarmToTable'
  | 'OrganicMeals'
  | 'VegetarianOptions'
  | 'VeganOptions'
  | 'LocalCuisine'
  | 'BBQFacility'
  | 'OutdoorDining'
  | 'PrivateChef'
  | 'CookingClass'
  | 'WineTasting'
  | 'LocalProduce';

export type KitchenFacility = 
  | 'FullKitchen'
  | 'Kitchenette'
  | 'Refrigerator'
  | 'Microwave'
  | 'Stove'
  | 'Oven'
  | 'Dishwasher'
  | 'CoffeeMaker'
  | 'Toaster'
  | 'Blender'
  | 'CookingUtensils'
  | 'Dinnerware'
  | 'Glassware'
  | 'CuttingBoard'
  | 'KitchenIsland'
  | 'BreakfastBar'
  | 'PantryStorage';

export type Entertainment = 
  | 'Television'
  | 'CableTV'
  | 'Streaming'
  | 'SoundSystem'
  | 'BoardGames'
  | 'CardGames'
  | 'BookLibrary'
  | 'GameConsole'
  | 'BilliardTable'
  | 'TableTennis'
  | 'Dartboard'
  | 'Piano'
  | 'Guitar'
  | 'Karaoke'
  | 'ProjectorScreen'
  | 'OutdoorSpeakers'
  | 'MusicalInstruments';

export type SafetyFeature = 
  | 'SmokeDetector'
  | 'CarbonMonoxideDetector'
  | 'FirstAidKit'
  | 'FireExtinguisher'
  | 'SecuritySystem'
  | 'SecurityCameras'
  | 'MotionLights'
  | 'SafetyDeposit'
  | 'ChildSafetyGates'
  | 'PoolFencing'
  | 'EmergencyContacts'
  | 'EmergencyKit'
  | 'WellLitPathways'
  | 'HandRails'
  | 'NonSlipSurfaces';

export type AccessibilityFeature = 
  | 'WheelchairAccessible'
  | 'RampAccess'
  | 'WideDoorbells'
  | 'AccessibleBathroom'
  | 'GrabBars'
  | 'LoweredCounters'
  | 'AccessibleParking'
  | 'ElevatorAccess'
  | 'BrailleSignage'
  | 'HearingLoop'
  | 'ServiceAnimalsWelcome'
  | 'AccessibleSwimmingPool'
  | 'RollInShower'
  | 'AccessibleBedroom';

export type PetPolicy = 
  | 'PetsWelcome'
  | 'DogsOnly'
  | 'CatsOnly'
  | 'SmallPetsOnly'
  | 'ServiceAnimalsOnly'
  | 'PetFeeRequired'
  | 'PetDepositRequired'
  | 'PetsOnLeash'
  | 'IndoorPetsOnly'
  | 'OutdoorPetsOnly'
  | 'NoPets';

export type SmokingPolicy = 
  | 'SmokingAllowed'
  | 'OutdoorSmokingOnly'
  | 'DesignatedSmokingAreas'
  | 'NoSmoking';

export type AvailabilityStatus = 
  | 'Available'
  | 'Busy'
  | 'Unavailable'
  | 'Maintenance';

export type FarmHouseSortField = 
  | 'farmHouseName'
  | 'capacity'
  | 'numberOfRooms'
  | 'perNightPrice'
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
