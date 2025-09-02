// src/Features/Booking/Service.ts

import { and, eq, gte, lte } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { bookings } from '../../../Schema';
import { BookingModel } from '../Model';
import { 
  Booking, 
  BookingStatus, 
  BookingWithService, 
  CreateBookingInput, 
  PaymentStatus, 
  RequestVisitInput, 
  ScheduleVisitInput, 
  ServiceType, 
  UpdatePaymentInput, 
  VisitStatus,
  BookingFiltersInput,
  CancelBookingInput 
} from '../Types';

/**
 * BookingService class containing business logic for booking management
 */
export class BookingService {
  private model: BookingModel;
  
  constructor(model: BookingModel) {
    this.model = model;
  }
  
  /**
   * Check if a service is available on the requested date
   */
private async checkServiceAvailability(
    serviceType: ServiceType, 
    serviceId: string, 
    eventDate?: string
  ): Promise<boolean> {
    if (!eventDate) return true;

    const dateObj = new Date(eventDate);

    switch (serviceType) {
      case ServiceType.VENUE:
        return this.model.getVenueAvailability(serviceId, dateObj);
      case ServiceType.FARMHOUSE:
        return this.model.getFarmhouseAvailability(serviceId, dateObj); // <-- FIXED
      // For catering and photography, we assume they manage their own availability
      default:
        return true;
    }
  }
  
  /**
   * Get the price of a service based on its type and ID
   */
  private async getServicePrice(
    serviceType: ServiceType, 
    serviceId: string
  ): Promise<number> {
    switch (serviceType) {
      case ServiceType.VENUE:
        return this.model.getVenuePrice(serviceId);
      case ServiceType.FARMHOUSE:
        return this.model.getFarmhousePrice(serviceId);
      case ServiceType.CATERING:
        return this.model.getCateringPrice(serviceId);
      case ServiceType.PHOTOGRAPHY:
        return this.model.getPhotographyPrice(serviceId);
      default:
        throw new Error('Invalid service type');
    }
  }
  
  /**
   * Update service availability after booking
   */
  private async updateServiceAvailability(
    serviceType: ServiceType, 
    serviceId: string, 
    eventDate?: string
  ): Promise<void> {
    if (!eventDate) return;
    
    const dateObj = new Date(eventDate);
    
    switch (serviceType) {
      case ServiceType.VENUE:
        await this.model.updateVenueAvailability(serviceId, dateObj);
        break;
      case ServiceType.FARMHOUSE:
        await this.model.updateFarmhouseAvailability(serviceId, dateObj);
        break;
      // For catering and photography, availability is managed differently
      default:
        break;
    }
  }
  
  /**
   * Get the service details based on service type and ID
   */
  private async getServiceDetails(
    serviceType: ServiceType, 
    serviceId: string
  ): Promise<any> {
    switch (serviceType) {
      case ServiceType.VENUE:
        return this.model.getVenueDetails(serviceId);
      case ServiceType.FARMHOUSE:
        return this.model.getFarmhouseDetails(serviceId);
      case ServiceType.CATERING:
        return this.model.getCateringDetails(serviceId);
      case ServiceType.PHOTOGRAPHY:
        return this.model.getPhotographyDetails(serviceId);
      default:
        throw new Error('Invalid service type');
    }
  }
  
  /**
   * Generate a unique booking reference
   */
  private generateBookingReference(): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `BK-${timestamp}-${random}`;
  }
  
  /**
   * Create a new booking
   */
  async createBooking(input: CreateBookingInput, userId: string): Promise<Booking> {
    // Check if service is available
    const isAvailable = await this.checkServiceAvailability(
      input.serviceType, 
      input.serviceId, 
      input.eventDate
    );
    
    if (!isAvailable) {
      throw new Error('Service is not available on the requested date');
    }
    
    // Get service price
    const servicePrice = await this.getServicePrice(
      input.serviceType, 
      input.serviceId
    );
    
    // Calculate advance amount (30% of total)
    const totalAmount = servicePrice;
    const advanceAmount = totalAmount * 0.3;
    const balanceAmount = totalAmount - advanceAmount;
    
    // Generate booking reference
    const bookingReference = this.generateBookingReference();
    
    // Determine initial visit status
    const visitStatus = input.visitRequested ? VisitStatus.REQUESTED : null;
    
    // Prepare booking data
    const newBooking = {
      id: uuidv4(),
      userId,
      vendorId: input.vendorId,
      serviceType: input.serviceType,
      serviceId: input.serviceId,
      eventDate: input.eventDate ? new Date(input.eventDate) : null,
      eventStartTime: input.eventStartTime ? new Date(input.eventStartTime) : null,
      eventEndTime: input.eventEndTime ? new Date(input.eventEndTime) : null,
      numberOfGuests: input.numberOfGuests || null,
      totalAmount,
      advanceAmount,
      balanceAmount,
      status: BookingStatus.PENDING,
      paymentStatus: PaymentStatus.AWAITING_ADVANCE,
      visitRequested: input.visitRequested || false,
      visitStatus,
      visitScheduledFor: null,
      specialRequests: input.specialRequests || null,
      bookingReference,
      isReviewed: false
    };
    
    // Insert booking record
    const result = await this.model.insertBooking(newBooking);
    
    // Update service availability
    await this.updateServiceAvailability(
      input.serviceType, 
      input.serviceId, 
      input.eventDate
    );
    
    return result;
  }
  
  /**
   * Request a visit for venue or farmhouse
   */
  async requestVisit(input: RequestVisitInput, userId: string): Promise<Booking> {
    // Get the booking
    const whereClause = and(
      eq(bookings.id, input.bookingId),
      eq(bookings.userId, userId)
    );
    
    const booking = await this.model.getBookingById(whereClause);
    
    if (!booking) {
      throw new Error('Booking not found');
    }
    
    // Validate service type
    if (booking.serviceType !== ServiceType.VENUE && booking.serviceType !== ServiceType.FARMHOUSE) {
      throw new Error('Visit can only be requested for venues and farmhouses');
    }
    
    // Combine date and time
    const preferredDateTime = new Date(`${input.preferredDate}T${input.preferredTime}`);
    
    // Update booking with visit request
    const updateData = {
      visitRequested: true,
      visitStatus: VisitStatus.REQUESTED,
      visitScheduledFor: preferredDateTime,
      updatedAt: new Date()
    };
    
    return this.model.updateBooking(input.bookingId, updateData);
  }
  
  /**
   * Schedule a visit (vendor/admin only)
   */
  async scheduleVisit(input: ScheduleVisitInput, vendorId: string): Promise<Booking> {
    // Get the booking
    const whereClause = and(
      eq(bookings.id, input.bookingId),
      eq(bookings.vendorId, vendorId)
    );
    
    const booking = await this.model.getBookingById(whereClause);
    
    if (!booking) {
      throw new Error('Booking not found');
    }
    
    // Combine date and time
    const scheduledDateTime = new Date(`${input.scheduledDate}T${input.scheduledTime}`);
    
    // Update booking with scheduled visit
    const updateData = {
      visitStatus: VisitStatus.SCHEDULED,
      visitScheduledFor: scheduledDateTime,
      updatedAt: new Date()
    };
    
    return this.model.updateBooking(input.bookingId, updateData);
  }
  
  /**
   * Complete a visit (vendor/admin only)
   */
  async completeVisit(bookingId: string, vendorId: string): Promise<Booking> {
    // Get the booking
    const whereClause = and(
      eq(bookings.id, bookingId),
      eq(bookings.vendorId, vendorId)
    );
    
    const booking = await this.model.getBookingById(whereClause);
    
    if (!booking) {
      throw new Error('Booking not found');
    }
    
    // Update booking with completed visit
    const updateData = {
      visitStatus: VisitStatus.COMPLETED,
      updatedAt: new Date()
    };
    
    return this.model.updateBooking(bookingId, updateData);
  }
  
  /**
   * Update payment details
   */
  async updatePayment(input: UpdatePaymentInput, userId?: string, vendorId?: string, isAdmin?: boolean): Promise<Booking> {
    // Prepare where clause based on who is making the update
    let whereClause;
    
    if (isAdmin) {
      whereClause = eq(bookings.id, input.bookingId);
    } else if (userId) {
      whereClause = and(
        eq(bookings.id, input.bookingId),
        eq(bookings.userId, userId)
      );
    } else if (vendorId) {
      whereClause = and(
        eq(bookings.id, input.bookingId),
        eq(bookings.vendorId, vendorId)
      );
    } else {
      throw new Error('Unauthorized to update payment');
    }
    
    // Get the booking
    const booking = await this.model.getBookingById(whereClause);
    
    if (!booking) {
      throw new Error('Booking not found');
    }
    
    // Prepare update data
    const updateData: Record<string, any> = {
      updatedAt: new Date()
    };
    
    if (input.advanceAmount !== undefined) {
      updateData.advanceAmount = input.advanceAmount;
    }
    
    if (input.balanceAmount !== undefined) {
      updateData.balanceAmount = input.balanceAmount;
    }
    
    if (input.paymentStatus !== undefined) {
      updateData.paymentStatus = input.paymentStatus;
      
      // Auto-update booking status based on payment status
      if (input.paymentStatus === PaymentStatus.FULLY_PAID) {
        updateData.status = BookingStatus.CONFIRMED;
      } else if (input.paymentStatus === PaymentStatus.CANCELED) {
        updateData.status = BookingStatus.CANCELED;
        updateData.canceledAt = new Date();
      }
    }
    
    // Update booking payment details
    return this.model.updateBooking(input.bookingId, updateData);
  }
  
  /**
   * Cancel a booking
   */
  async cancelBooking(input: CancelBookingInput, userId?: string, vendorId?: string, isAdmin?: boolean): Promise<Booking> {
    // Prepare where clause based on who is making the update
    let whereClause;
    
    if (isAdmin) {
      whereClause = eq(bookings.id, input.bookingId);
    } else if (userId) {
      whereClause = and(
        eq(bookings.id, input.bookingId),
        eq(bookings.userId, userId)
      );
    } else if (vendorId) {
      whereClause = and(
        eq(bookings.id, input.bookingId),
        eq(bookings.vendorId, vendorId)
      );
    } else {
      throw new Error('Unauthorized to cancel booking');
    }
    
    // Get the booking
    const booking = await this.model.getBookingById(whereClause);
    
    if (!booking) {
      throw new Error('Booking not found');
    }
    
    // Update booking as canceled
    const updateData = {
      status: BookingStatus.CANCELED,
      paymentStatus: PaymentStatus.CANCELED,
      canceledAt: new Date(),
      cancellationReason: input.cancellationReason,
      updatedAt: new Date()
    };
    
    return this.model.updateBooking(input.bookingId, updateData);
  }
  
  /**
   * Get a single booking by ID with service details
   */
  async getBookingById(bookingId: string, userId?: string, vendorId?: string, isAdmin?: boolean): Promise<BookingWithService> {
    // Prepare where clause based on who is requesting
    let whereClause;
    
    if (isAdmin) {
      whereClause = eq(bookings.id, bookingId);
    } else if (userId) {
      whereClause = and(
        eq(bookings.id, bookingId),
        eq(bookings.userId, userId)
      );
    } else if (vendorId) {
      whereClause = and(
        eq(bookings.id, bookingId),
        eq(bookings.vendorId, vendorId)
      );
    } else {
      throw new Error('Unauthorized to view booking');
    }
    
    // Get the booking
    const booking = await this.model.getBookingById(whereClause);
    
    if (!booking) {
      throw new Error('Booking not found');
    }
    
    // Get service details
    const service = await this.getServiceDetails(
      booking.serviceType as ServiceType, 
      booking.serviceId
    );
    
    // Get vendor details
    const vendor = await this.model.getVendorDetails(booking.vendorId);
    
    return {
      ...booking,
      service,
      vendor
    };
  }

  /**
   * Get bookings with filters
   */
  async getBookings(
    filters: BookingFiltersInput,
    userId?: string,
    vendorId?: string,
    isAdmin?: boolean
  ): Promise<BookingWithService[]> {
    // Prepare where clauses
    const whereConditions = [];
    
    // User or vendor specific filter
    if (userId) {
      whereConditions.push(eq(bookings.userId, userId));
    } else if (vendorId) {
      whereConditions.push(eq(bookings.vendorId, vendorId));
    } else if (!isAdmin) {
      throw new Error('Unauthorized to view bookings');
    }
    
    // Status filter
    if (filters.status) {
      whereConditions.push(eq(bookings.status, filters.status));
    }
    
    // Service type filter
    if (filters.serviceType) {
      whereConditions.push(eq(bookings.serviceType, filters.serviceType));
    }
    
    // Date range filter
    if (filters.from) {
      const fromDate = new Date(filters.from);
      whereConditions.push(gte(bookings.eventDate!, fromDate.toISOString().split('T')[0]));
    }
    
    if (filters.to) {
      const toDate = new Date(filters.to);
      whereConditions.push(lte(bookings.eventDate!, toDate.toISOString().split('T')[0]));
    }
    
    // Build final where clause
    const whereClause = whereConditions.length > 0 
      ? and(...whereConditions) 
      : undefined;
    
    // Get bookings
    const bookingResults = await this.model.getBookings(whereClause, filters);
    
    // Fetch service and vendor details for each booking
    const result: BookingWithService[] = [];
    
    for (const booking of bookingResults) {
      const service = await this.getServiceDetails(
        booking.serviceType as ServiceType, 
        booking.serviceId
      );
      
      const vendor = await this.model.getVendorDetails(booking.vendorId);
      
      result.push({
        ...booking,
        service,
        vendor
      });
    }
    
    return result;
  }

  /**
   * Get vendor visiting requests (vendor only)
   */
  async getVendorVisitingRequests(
    vendorId: string,
    filters: BookingFiltersInput = {}
  ): Promise<any[]> {
    return this.model.getVendorVisitingRequests(vendorId, filters);
  }

  /**
   * Get vendor scheduled visits (vendor only)
   */
  async getVendorScheduledVisits(
    vendorId: string,
    filters: BookingFiltersInput = {}
  ): Promise<any[]> {
    return this.model.getVendorScheduledVisits(vendorId, filters);
  }

  /**
   * Get all visiting requests (admin only)
   */
  async getAllVisitingRequests(
    filters: BookingFiltersInput = {}
  ): Promise<any[]> {
    return this.model.getAllVisitingRequests(filters);
  }

  /**
   * Get all scheduled visits (admin only)
   */
  async getAllScheduledVisits(
    filters: BookingFiltersInput = {}
  ): Promise<any[]> {
    return this.model.getAllScheduledVisits(filters);
  }
}