// src/Features/Booking/Types.ts

// Service types enum
export enum ServiceType {
  FARMHOUSE = "FarmHouse",
  VENUE = "Venue",
  CATERING = "Catering",
  PHOTOGRAPHY = "Photography"
}

// Booking status enum
export enum BookingStatus {
  PENDING = "Pending",
  CONFIRMED = "Confirmed",
  COMPLETED = "Completed",
  CANCELED = "Canceled"
}

// Payment status enum
export enum PaymentStatus {
  AWAITING_ADVANCE = "Awaiting Advance",
  ADVANCE_PAID = "Advance Paid",
  PARTIALLY_PAID = "Partially Paid",
  FULLY_PAID = "Fully Paid",
  REFUNDED = "Refunded",
  CANCELED = "Canceled"
}

// Visit status enum
export enum VisitStatus {
  NOT_REQUESTED = "Not Requested",
  REQUESTED = "Requested",
  SCHEDULED = "Scheduled",
  COMPLETED = "Completed"
}

// Input interfaces for GraphQL resolvers
export interface CreateBookingInput {
  vendorId: string;
  serviceType: ServiceType;
  serviceId: string;
  eventDate?: string; // ISO format date string
  eventStartTime?: string; // ISO format datetime string
  eventEndTime?: string; // ISO format datetime string
  numberOfGuests?: number;
  specialRequests?: string;
  visitRequested?: boolean;
}

export interface RequestVisitInput {
  bookingId: string;
  preferredDate: string; // ISO format date string
  preferredTime: string; // ISO format time string (HH:MM)
}

export interface ScheduleVisitInput {
  bookingId: string;
  scheduledDate: string; // ISO format date string
  scheduledTime: string; // ISO format time string (HH:MM)
}

export interface UpdatePaymentInput {
  bookingId: string;
  advanceAmount?: number;
  balanceAmount?: number;
  paymentStatus?: PaymentStatus;
}

export interface CancelBookingInput {
  bookingId: string;
  cancellationReason: string;
}

export interface BookingFiltersInput {
  status?: BookingStatus;
  serviceType?: ServiceType;
  from?: string; // ISO format date string
  to?: string; // ISO format date string
  limit?: number;
  offset?: number;
}

// Booking type for GraphQL
export interface Booking {
  id: string;
  userId: string;
  vendorId: string;
  serviceType: ServiceType;
  serviceId: string;
  eventDate: Date | null;
  eventStartTime: Date | null;
  eventEndTime: Date | null;
  numberOfGuests: number | null;
  totalAmount: number;
  advanceAmount: number | null;
  balanceAmount: number | null;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  visitRequested: boolean;
  visitStatus: VisitStatus | null;
  visitScheduledFor: Date | null;
  specialRequests: string | null;
  createdAt: Date;
  updatedAt: Date;
  canceledAt: Date | null;
  cancellationReason: string | null;
  bookingReference: string | null;
  isReviewed: boolean;
}

// Type for booking with service details
export interface BookingWithService extends Booking {
  service: any; // This will be populated with the actual service details based on serviceType
  vendor: {
    id: string;
    vendorName: string;
    vendorEmail: string;
    vendorPhone: string | null;
    profileImage: string | null;
  };
}