

import { and, eq, gte, lte, desc } from 'drizzle-orm';
import { DrizzleDB } from '../../../Config/db';
import { 
  bookings,
  venues,
  venueAvailability,
  farmhouses,
  farmhouseAvailability,
  cateringPackages,
  photographyPackages,
  vendors
} from '../../../Schema';
import { 
  Booking, 
  ServiceType,
  BookingFiltersInput
} from '../Types';

/**
 * BookingModel class that handles all database operations
 */
export class BookingModel {
  getFarmhouseAvailability(serviceId: string, dateObj: Date): boolean | PromiseLike<boolean> {
    throw new Error('Method not implemented.');
  }
  private db: DrizzleDB;
  
  constructor(db: DrizzleDB) {
    this.db = db;
  }
  
  /**
   * Get venue availability for a specific date
   */
  async getVenueAvailability(venueId: string, date: Date): Promise<boolean> {
    const dateStr = date.toISOString().split('T')[0]; // Convert to YYYY-MM-DD format
    const availability = await this.db.select()
      .from(venueAvailability)
      .where(
        and(
          eq(venueAvailability.venueId, venueId),
          eq(venueAvailability.date, dateStr),
          eq(venueAvailability.isBooked, false)
        )
      )
      .limit(1);
    return availability.length > 0;
  }
  
  /**
   * Update venue availability for a specific date
   */
  async updateVenueAvailability(venueId: string, date: Date): Promise<void> {
    const dateStr = date.toISOString().split('T')[0]; // Convert to YYYY-MM-DD format
    await this.db.update(venueAvailability)
      .set({ isBooked: true })
      .where(
        and(
          eq(venueAvailability.venueId, venueId),
          eq(venueAvailability.date, dateStr)
        )
      );
  }

  /**
   * Update farmhouse availability for a specific date
   */
  async updateFarmhouseAvailability(farmhouseId: string, date: Date): Promise<void> {
    const dateStr = date.toISOString().split('T')[0]; // Convert to YYYY-MM-DD format
    await this.db.update(farmhouseAvailability)
      .set({ isBooked: true })
      .where(
        and(
          eq(farmhouseAvailability.farmhouseId, farmhouseId),
          eq(farmhouseAvailability.date, dateStr)
        )
      );
  }
  /**
   * Get farmhouse availability for a specific date
  async getFarmhouseAvailability(farmhouseId: string, date: Date): Promise<boolean> {
    const dateStr = date.toISOString().split('T')[0]; // Convert to YYYY-MM-DD format
    const availability = await this.db.select()
      .from(farmhouseAvailability)
      .where(
        and(
          eq(farmhouseAvailability.farmhouseId, farmhouseId),
          eq(farmhouseAvailability.date, dateStr),
          eq(farmhouseAvailability.isBooked, false)
        )
      )
      .limit(1);
    return availability.length > 0;
  }
  }
  
  /**
   * Get venue price
   */
  async getVenuePrice(venueId: string): Promise<number> {
    const venue = await this.db.select({ price: venues.price })
      .from(venues)
      .where(eq(venues.id, venueId))
      .limit(1);
    
    if (venue.length === 0) throw new Error('Venue not found');
    return parseFloat(venue[0].price);
  }
  
  /**
   * Get farmhouse price
   */
  async getFarmhousePrice(farmhouseId: string): Promise<number> {
    const farmhouse = await this.db.select({ price: farmhouses.perNightPrice })
      .from(farmhouses)
      .where(eq(farmhouses.id, farmhouseId))
      .limit(1);
    
    if (farmhouse.length === 0) throw new Error('Farmhouse not found');
    return Number(farmhouse[0].price);
  }
  
  /**
   * Get catering package price
   */
  async getCateringPrice(cateringId: string): Promise<number> {
    const catering = await this.db.select({ price: cateringPackages.price })
      .from(cateringPackages)
      .where(eq(cateringPackages.id, cateringId))
      .limit(1);
    
    if (catering.length === 0) throw new Error('Catering package not found');
    return Number(catering[0].price);
  }
  
  /**
   * Get photography package price
   */
  async getPhotographyPrice(photographyId: string): Promise<number> {
    const photography = await this.db.select({ price: photographyPackages.price })
      .from(photographyPackages)
      .where(eq(photographyPackages.id, photographyId))
      .limit(1);
    
    if (photography.length === 0) throw new Error('Photography package not found');
    return Number(photography[0].price);
  }
  
  /**
  async updateVenueAvailability(venueId: string, date: Date): Promise<void> {
    const dateStr = date.toISOString().split('T')[0]; // Convert to YYYY-MM-DD format
    await this.db.update(venueAvailability)
      .set({ isBooked: true })
      .where(
        and(
          eq(venueAvailability.venueId, venueId),
          eq(venueAvailability.date, dateStr)
        )
      );
  }
      );
  }
  
  async updateFarmhouseAvailability(farmhouseId: string, date: Date): Promise<void> {
    const dateStr = date.toISOString().split('T')[0]; // Convert to YYYY-MM-DD format
    await this.db.update(farmhouseAvailability)
      .set({ isBooked: true })
      .where(
        and(
          eq(farmhouseAvailability.farmhouseId, farmhouseId),
          eq(farmhouseAvailability.date, dateStr)
        )
      );
  }
        )
      );
  }
  
  /**
   * Get venue details
   */
  async getVenueDetails(venueId: string): Promise<any> {
    const venueDetails = await this.db.select()
      .from(venues)
      .where(eq(venues.id, venueId))
      .limit(1);
    
    if (venueDetails.length === 0) throw new Error('Venue not found');
    return venueDetails[0];
  }
  
  /**
   * Get farmhouse details
   */
  async getFarmhouseDetails(farmhouseId: string): Promise<any> {
    const farmhouseDetails = await this.db.select()
      .from(farmhouses)
      .where(eq(farmhouses.id, farmhouseId))
      .limit(1);
    
    if (farmhouseDetails.length === 0) throw new Error('Farmhouse not found');
    return farmhouseDetails[0];
  }
  
  /**
   * Get catering package details
   */
  async getCateringDetails(cateringId: string): Promise<any> {
    const cateringDetails = await this.db.select()
      .from(cateringPackages)
      .where(eq(cateringPackages.id, cateringId))
      .limit(1);
    
    if (cateringDetails.length === 0) throw new Error('Catering package not found');
    return cateringDetails[0];
  }
  
  /**
   * Get photography package details
   */
  async getPhotographyDetails(photographyId: string): Promise<any> {
    const photographyDetails = await this.db.select()
      .from(photographyPackages)
      .where(eq(photographyPackages.id, photographyId))
      .limit(1);
    
    if (photographyDetails.length === 0) throw new Error('Photography package not found');
    return photographyDetails[0];
  }
  
  /**
   * Get vendor details
   */
  async getVendorDetails(vendorId: string): Promise<any> {
    const vendorRecord = await this.db.select({
      id: vendors.id,
      vendorName: vendors.vendorName,
      vendorEmail: vendors.vendorEmail,
      vendorPhone: vendors.vendorPhone,
      profileImage: vendors.profileImage
    })
      .from(vendors)
      .where(eq(vendors.id, vendorId))
      .limit(1);
    
    if (vendorRecord.length === 0) throw new Error('Vendor not found');
    return vendorRecord[0];
  }
  
  /**
   * Insert a new booking
   */
  async insertBooking(bookingData: any): Promise<Booking> {
    const result = await this.db.insert(bookings).values(bookingData).returning();
    return result[0] as unknown as Booking;
  }
  
  /**
   * Get booking by ID
   */
  async getBookingById(whereClause: any): Promise<Booking | null> {
    const bookingRecord = await this.db.select()
      .from(bookings)
      .where(whereClause)
      .limit(1);
    
    return bookingRecord.length > 0 ? bookingRecord[0] as unknown as Booking : null;
  }
  
  /**
   * Update booking
   */
  async updateBooking(bookingId: string, updateData: Record<string, any>): Promise<Booking> {
    const updatedBooking = await this.db.update(bookings)
      .set(updateData)
      .where(eq(bookings.id, bookingId))
      .returning();
    
    return updatedBooking[0] as unknown as Booking;
  }
  
  /**
   * Get bookings with filters
   */
  async getBookings(whereClause: any, filters: BookingFiltersInput): Promise<Booking[]> {
    const limit = filters.limit || 10;
    const offset = filters.offset || 0;
    
    const bookingRecords = await this.db.select()
      .from(bookings)
      .where(whereClause)
      .orderBy(desc(bookings.createdAt))
      .limit(limit)
      .offset(offset);
    
    return bookingRecords as unknown as Booking[];
  }
}