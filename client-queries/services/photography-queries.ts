// Client-side GraphQL operations for Photography Packages

import { gql } from '@apollo/client';

// ============== FRAGMENTS ==============

export const PHOTOGRAPHY_PACKAGE_FRAGMENT = gql`
  fragment PhotographyPackageFragment on PhotographyPackage {
    id
    vendorId
    packageName
    description
    price
    duration
    shootingStyle
    packageType
    deliveryTimeframe
    numberOfPhotographers
    numberOfEditedPhotos
    numberOfRawPhotos
    includesVideo
    videoDuration
    equipment
    location
    travelCharges
    cancellationPolicy
    features
    images
    portfolio
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

export const PHOTOGRAPHY_PACKAGE_SUMMARY_FRAGMENT = gql`
  fragment PhotographyPackageSummaryFragment on PhotographyPackage {
    id
    vendorId
    packageName
    description
    price
    duration
    shootingStyle
    packageType
    numberOfPhotographers
    numberOfEditedPhotos
    includesVideo
    rating
    reviewCount
    images
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

// Get all photography packages with filters
export const GET_PHOTOGRAPHY_PACKAGES = gql`
  ${PHOTOGRAPHY_PACKAGE_SUMMARY_FRAGMENT}
  query GetPhotographyPackages(
    $filters: PhotographyPackageFiltersInput
    $pagination: PaginationInput
    $sortBy: PhotographyPackageSortInput
  ) {
    photographyPackages(
      filters: $filters
      pagination: $pagination
      sortBy: $sortBy
    ) {
      packages {
        ...PhotographyPackageSummaryFragment
      }
      totalCount
      hasMore
      currentPage
      totalPages
    }
  }
`;

// Get single photography package by ID
export const GET_PHOTOGRAPHY_PACKAGE = gql`
  ${PHOTOGRAPHY_PACKAGE_FRAGMENT}
  query GetPhotographyPackage($id: ID!) {
    photographyPackage(id: $id) {
      ...PhotographyPackageFragment
      reviews {
        id
        userId
        rating
        comment
        createdAt
        user {
          id
          userName
        }
      }
    }
  }
`;

// Get vendor's photography packages
export const GET_VENDOR_PHOTOGRAPHY_PACKAGES = gql`
  ${PHOTOGRAPHY_PACKAGE_FRAGMENT}
  query GetVendorPhotographyPackages(
    $filters: PhotographyPackageFiltersInput
    $pagination: PaginationInput
  ) {
    vendorPhotographyPackages(filters: $filters, pagination: $pagination) {
      packages {
        ...PhotographyPackageFragment
      }
      totalCount
      hasMore
      currentPage
      totalPages
    }
  }
`;

// Search photography packages
export const SEARCH_PHOTOGRAPHY_PACKAGES = gql`
  ${PHOTOGRAPHY_PACKAGE_SUMMARY_FRAGMENT}
  query SearchPhotographyPackages(
    $searchTerm: String!
    $filters: PhotographyPackageFiltersInput
    $pagination: PaginationInput
  ) {
    searchPhotographyPackages(
      searchTerm: $searchTerm
      filters: $filters
      pagination: $pagination
    ) {
      packages {
        ...PhotographyPackageSummaryFragment
      }
      totalCount
      hasMore
      currentPage
      totalPages
    }
  }
`;

// Get photography packages by location
export const GET_PHOTOGRAPHY_PACKAGES_BY_LOCATION = gql`
  ${PHOTOGRAPHY_PACKAGE_SUMMARY_FRAGMENT}
  query GetPhotographyPackagesByLocation(
    $location: String!
    $radius: Float
    $filters: PhotographyPackageFiltersInput
    $pagination: PaginationInput
  ) {
    photographyPackagesByLocation(
      location: $location
      radius: $radius
      filters: $filters
      pagination: $pagination
    ) {
      packages {
        ...PhotographyPackageSummaryFragment
        distance
      }
      totalCount
      hasMore
      currentPage
      totalPages
    }
  }
`;

// Get featured photography packages
export const GET_FEATURED_PHOTOGRAPHY_PACKAGES = gql`
  ${PHOTOGRAPHY_PACKAGE_SUMMARY_FRAGMENT}
  query GetFeaturedPhotographyPackages($limit: Int) {
    featuredPhotographyPackages(limit: $limit) {
      ...PhotographyPackageSummaryFragment
    }
  }
`;

// Get popular photography packages
export const GET_POPULAR_PHOTOGRAPHY_PACKAGES = gql`
  ${PHOTOGRAPHY_PACKAGE_SUMMARY_FRAGMENT}
  query GetPopularPhotographyPackages($limit: Int) {
    popularPhotographyPackages(limit: $limit) {
      ...PhotographyPackageSummaryFragment
    }
  }
`;

// Get photographer portfolio
export const GET_PHOTOGRAPHER_PORTFOLIO = gql`
  query GetPhotographerPortfolio($vendorId: ID!) {
    photographerPortfolio(vendorId: $vendorId) {
      id
      vendorId
      title
      description
      category
      images
      shootingDate
      location
      packageUsed
      createdAt
    }
  }
`;

// ============== MUTATIONS ==============

// Create photography package (vendor only)
export const CREATE_PHOTOGRAPHY_PACKAGE = gql`
  ${PHOTOGRAPHY_PACKAGE_FRAGMENT}
  mutation CreatePhotographyPackage($input: CreatePhotographyPackageInput!) {
    createPhotographyPackage(input: $input) {
      ...PhotographyPackageFragment
    }
  }
`;

// Update photography package (vendor only)
export const UPDATE_PHOTOGRAPHY_PACKAGE = gql`
  ${PHOTOGRAPHY_PACKAGE_FRAGMENT}
  mutation UpdatePhotographyPackage($id: ID!, $input: UpdatePhotographyPackageInput!) {
    updatePhotographyPackage(id: $id, input: $input) {
      ...PhotographyPackageFragment
    }
  }
`;

// Delete photography package (vendor only)
export const DELETE_PHOTOGRAPHY_PACKAGE = gql`
  mutation DeletePhotographyPackage($id: ID!) {
    deletePhotographyPackage(id: $id) {
      success
      message
    }
  }
`;

// Toggle photography package active status (vendor only)
export const TOGGLE_PHOTOGRAPHY_PACKAGE_STATUS = gql`
  ${PHOTOGRAPHY_PACKAGE_FRAGMENT}
  mutation TogglePhotographyPackageStatus($id: ID!) {
    togglePhotographyPackageStatus(id: $id) {
      ...PhotographyPackageFragment
    }
  }
`;

// Upload photography package images (vendor only)
export const UPLOAD_PHOTOGRAPHY_PACKAGE_IMAGES = gql`
  mutation UploadPhotographyPackageImages($packageId: ID!, $images: [Upload!]!) {
    uploadPhotographyPackageImages(packageId: $packageId, images: $images) {
      id
      images
    }
  }
`;

// Upload portfolio images (vendor only)
export const UPLOAD_PORTFOLIO_IMAGES = gql`
  mutation UploadPortfolioImages($packageId: ID!, $portfolio: [Upload!]!) {
    uploadPortfolioImages(packageId: $packageId, portfolio: $portfolio) {
      id
      portfolio
    }
  }
`;

// Add portfolio item (vendor only)
export const ADD_PORTFOLIO_ITEM = gql`
  mutation AddPortfolioItem($input: AddPortfolioItemInput!) {
    addPortfolioItem(input: $input) {
      id
      vendorId
      title
      description
      category
      images
      shootingDate
      location
      packageUsed
      createdAt
    }
  }
`;

// Update portfolio item (vendor only)
export const UPDATE_PORTFOLIO_ITEM = gql`
  mutation UpdatePortfolioItem($id: ID!, $input: UpdatePortfolioItemInput!) {
    updatePortfolioItem(id: $id, input: $input) {
      id
      title
      description
      category
      images
      shootingDate
      location
      packageUsed
      updatedAt
    }
  }
`;

// Delete portfolio item (vendor only)
export const DELETE_PORTFOLIO_ITEM = gql`
  mutation DeletePortfolioItem($id: ID!) {
    deletePortfolioItem(id: $id) {
      success
      message
    }
  }
`;

// Add photography package review (user only)
export const ADD_PHOTOGRAPHY_PACKAGE_REVIEW = gql`
  mutation AddPhotographyPackageReview($input: AddReviewInput!) {
    addPhotographyPackageReview(input: $input) {
      id
      userId
      packageId
      rating
      comment
      createdAt
      user {
        id
        userName
      }
    }
  }
`;

// Book photography package (user only)
export const BOOK_PHOTOGRAPHY_PACKAGE = gql`
  mutation BookPhotographyPackage($input: BookPhotographyPackageInput!) {
    bookPhotographyPackage(input: $input) {
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

// Request custom photography quote (user only)
export const REQUEST_PHOTOGRAPHY_QUOTE = gql`
  mutation RequestPhotographyQuote($input: PhotographyQuoteRequestInput!) {
    requestPhotographyQuote(input: $input) {
      id
      userId
      vendorId
      eventType
      eventDate
      eventLocation
      duration
      requirements
      budget
      status
      createdAt
    }
  }
`;

// Respond to photography quote (vendor only)
export const RESPOND_TO_PHOTOGRAPHY_QUOTE = gql`
  mutation RespondToPhotographyQuote($id: ID!, $response: QuoteResponseInput!) {
    respondToPhotographyQuote(id: $id, response: $response) {
      id
      vendorResponse
      quotedPrice
      proposedPackage
      status
      respondedAt
    }
  }
`;

// ============== TYPESCRIPT INTERFACES ==============

export interface PhotographyPackage {
  id: string;
  vendorId: string;
  packageName: string;
  description?: string;
  price: number;
  duration: number; // in hours
  shootingStyle: ShootingStyle[];
  packageType: PackageType;
  deliveryTimeframe: number; // in days
  numberOfPhotographers: number;
  numberOfEditedPhotos: number;
  numberOfRawPhotos?: number;
  includesVideo: boolean;
  videoDuration?: number; // in minutes
  equipment?: string[];
  location?: Location[];
  travelCharges?: number;
  cancellationPolicy?: string;
  features?: string[];
  images?: string[];
  portfolio?: string[];
  rating?: number;
  reviewCount?: number;
  availabilityStatus: AvailabilityStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  vendor?: Vendor;
  reviews?: Review[];
  distance?: number;
}

export interface CreatePhotographyPackageInput {
  packageName: string;
  description?: string;
  price: number;
  duration: number;
  shootingStyle: ShootingStyle[];
  packageType: PackageType;
  deliveryTimeframe: number;
  numberOfPhotographers: number;
  numberOfEditedPhotos: number;
  numberOfRawPhotos?: number;
  includesVideo?: boolean;
  videoDuration?: number;
  equipment?: string[];
  location?: Location[];
  travelCharges?: number;
  cancellationPolicy?: string;
  features?: string[];
}

export interface UpdatePhotographyPackageInput {
  packageName?: string;
  description?: string;
  price?: number;
  duration?: number;
  shootingStyle?: ShootingStyle[];
  packageType?: PackageType;
  deliveryTimeframe?: number;
  numberOfPhotographers?: number;
  numberOfEditedPhotos?: number;
  numberOfRawPhotos?: number;
  includesVideo?: boolean;
  videoDuration?: number;
  equipment?: string[];
  location?: Location[];
  travelCharges?: number;
  cancellationPolicy?: string;
  features?: string[];
}

export interface PhotographyPackageFiltersInput {
  vendorId?: string;
  shootingStyle?: ShootingStyle[];
  packageType?: PackageType[];
  location?: Location[];
  minPrice?: number;
  maxPrice?: number;
  minDuration?: number;
  maxDuration?: number;
  includesVideo?: boolean;
  minRating?: number;
  availabilityStatus?: AvailabilityStatus[];
  isActive?: boolean;
  radius?: number;
}

export interface PhotographyPackageSortInput {
  field: PhotographyPackageSortField;
  direction: SortDirection;
}

export interface BookPhotographyPackageInput {
  packageId: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  eventType: string;
  specialRequests?: string;
  duration?: number;
}

export interface PhotographyQuoteRequestInput {
  vendorId: string;
  eventType: string;
  eventDate: string;
  eventLocation: string;
  duration: number;
  requirements: string;
  budget?: number;
}

export interface QuoteResponseInput {
  vendorResponse: string;
  quotedPrice: number;
  proposedPackage?: string;
}

export interface AddPortfolioItemInput {
  vendorId: string;
  title: string;
  description?: string;
  category: PortfolioCategory;
  images: string[];
  shootingDate?: string;
  location?: string;
  packageUsed?: string;
}

export interface UpdatePortfolioItemInput {
  title?: string;
  description?: string;
  category?: PortfolioCategory;
  images?: string[];
  shootingDate?: string;
  location?: string;
  packageUsed?: string;
}

export interface PortfolioItem {
  id: string;
  vendorId: string;
  title: string;
  description?: string;
  category: PortfolioCategory;
  images: string[];
  shootingDate?: string;
  location?: string;
  packageUsed?: string;
  createdAt: string;
}

export type ShootingStyle = 
  | 'Traditional'
  | 'Candid'
  | 'Documentary'
  | 'Artistic'
  | 'Fashion'
  | 'Portrait'
  | 'Lifestyle'
  | 'Fine Art';

export type PackageType = 
  | 'Wedding'
  | 'Engagement'
  | 'Birthday'
  | 'Corporate'
  | 'Fashion'
  | 'Product'
  | 'Event'
  | 'Portrait'
  | 'Family'
  | 'Maternity'
  | 'Newborn';

export type Location = 
  | 'Studio'
  | 'Outdoor'
  | 'Indoor'
  | 'Destination'
  | 'Client Location';

export type AvailabilityStatus = 
  | 'Available'
  | 'Busy'
  | 'Unavailable';

export type PhotographyPackageSortField = 
  | 'packageName'
  | 'price'
  | 'rating'
  | 'reviewCount'
  | 'createdAt'
  | 'distance';

export type SortDirection = 'ASC' | 'DESC';

export type PortfolioCategory = 
  | 'Wedding'
  | 'Engagement'
  | 'Birthday'
  | 'Corporate'
  | 'Fashion'
  | 'Product'
  | 'Event'
  | 'Portrait'
  | 'Family'
  | 'Maternity'
  | 'Newborn'
  | 'Other';

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
  packageId: string;
  rating: number;
  comment?: string;
}
