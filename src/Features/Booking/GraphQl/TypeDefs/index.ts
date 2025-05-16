// src/Features/Booking/Schema.ts

import { gql } from 'apollo-server-express';

export const BookingTypeDefs = gql`
  # Enums
  enum ServiceType {
    FarmHouse
    Venue
    Catering
    Photography
  }

  enum BookingStatus {
    Pending
    Confirmed
    Completed
    Canceled
  }

  enum PaymentStatus {
    Awaiting_Advance
    Advance_Paid
    Partially_Paid
    Fully_Paid
    Refunded
    Canceled
  }

  enum VisitStatus {
    Not_Requested
    Requested
    Scheduled
    Completed
  }

  # Input Types
  input CreateBookingInput {
    vendorId: ID!
    serviceType: ServiceType!
    serviceId: ID!
    eventDate: String
    eventStartTime: String
    eventEndTime: String
    numberOfGuests: Int
    specialRequests: String
    visitRequested: Boolean
  }

  input RequestVisitInput {
    bookingId: ID!
    preferredDate: String!
    preferredTime: String!
  }

  input ScheduleVisitInput {
    bookingId: ID!
    scheduledDate: String!
    scheduledTime: String!
  }

  input UpdatePaymentInput {
    bookingId: ID!
    advanceAmount: Float
    balanceAmount: Float
    paymentStatus: PaymentStatus
  }

  input CancelBookingInput {
    bookingId: ID!
    cancellationReason: String!
  }

  input BookingFiltersInput {
    status: BookingStatus
    serviceType: ServiceType
    from: String
    to: String
    limit: Int
    offset: Int
  }

  # Vendor Brief Info
  type VendorInfo {
    id: ID!
    vendorName: String!
    vendorEmail: String!
    vendorPhone: String
    profileImage: String
  }

  # Service Union
  union ServiceDetails = Venue | FarmHouse | CateringPackage | PhotographyPackage

  # Booking Type
  type Booking {
    id: ID!
    userId: ID!
    vendorId: ID!
    serviceType: ServiceType!
    serviceId: ID!
    eventDate: String
    eventStartTime: String
    eventEndTime: String
    numberOfGuests: Int
    totalAmount: Float!
    advanceAmount: Float
    balanceAmount: Float
    status: BookingStatus!
    paymentStatus: PaymentStatus!
    visitRequested: Boolean!
    visitStatus: VisitStatus
    visitScheduledFor: String
    specialRequests: String
    createdAt: String!
    updatedAt: String!
    canceledAt: String
    cancellationReason: String
    bookingReference: String
    isReviewed: Boolean!
    
    # Resolved fields
    service: ServiceDetails
    vendor: VendorInfo
  }

  # Already defined types (assumed to exist in other schemas)
  type Venue {
    id: ID!
    name: String!
    location: String!
    description: String!
    imageUrl: [String!]!
    price: String!
    tags: [String!]!
    amenities: [String!]!
    minPersonLimit: Int!
    maxPersonLimit: Int!
    isAvailable: Boolean!
    rating: Float
    reviewCount: Int!
  }

  type FarmHouse {
    id: ID!
    name: String!
    location: String!
    description: String!
    imageUrl: [String!]!
    perNightPrice: Float!
    minNights: Int!
    maxNights: Int
    maxGuests: Int!
    amenities: [String!]!
    isAvailable: Boolean!
    rating: Float
    reviewCount: Int!
  }

  type CateringPackage {
    id: ID!
    packageName: String!
    serviceArea: [String!]!
    description: String!
    imageUrl: [String!]!
    price: Float!
    minGuests: Int!
    maxGuests: Int!
    menuItems: [String!]
    dietaryOptions: [String!]
    amenities: [String!]!
    isAvailable: Boolean!
    rating: Float
    reviewCount: Int!
  }

  type PhotographyPackage {
    id: ID!
    packageName: String!
    serviceArea: [String!]!
    description: String!
    imageUrl: [String!]!
    price: Float!
    duration: Int!
    photographerCount: Int!
    deliverables: [String!]
    amenities: [String!]!
    isAvailable: Boolean!
    rating: Float
    reviewCount: Int!
  }

  # Queries
  type Query {
    # Get a single booking by ID
    booking(id: ID!): Booking!
    
    # Get bookings with filters (user context dependent)
    bookings(filters: BookingFiltersInput): [Booking!]!
    
    # Get user bookings (user only)
    myBookings(filters: BookingFiltersInput): [Booking!]!
    
    # Get vendor bookings (vendor only)
    vendorBookings(filters: BookingFiltersInput): [Booking!]!
    
    # Get all bookings (admin only)
    allBookings(filters: BookingFiltersInput): [Booking!]!
  }

  # Mutations
  type Mutation {
    # Create a new booking (user only)
    createBooking(input: CreateBookingInput!): Booking!
    
    # Request a visit (user only)
    requestVisit(input: RequestVisitInput!): Booking!
    
    # Schedule a visit (vendor/admin only)
    scheduleVisit(input: ScheduleVisitInput!): Booking!
    
    # Complete a visit (vendor/admin only)
    completeVisit(bookingId: ID!): Booking!
    
    # Update payment (all roles)
    updatePayment(input: UpdatePaymentInput!): Booking!
    
    # Cancel booking (all roles)
    cancelBooking(input: CancelBookingInput!): Booking!
  }
`;