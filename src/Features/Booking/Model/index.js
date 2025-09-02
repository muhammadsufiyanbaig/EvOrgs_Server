"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingModel = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const Schema_1 = require("../../../Schema");
/**
 * BookingModel class that handles all database operations
 */
class BookingModel {
    getFarmhouseAvailability(serviceId, dateObj) {
        throw new Error('Method not implemented.');
    }
    constructor(db) {
        this.db = db;
    }
    /**
     * Get venue availability for a specific date
     */
    getVenueAvailability(venueId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            const dateStr = date.toISOString().split('T')[0]; // Convert to YYYY-MM-DD format
            const availability = yield this.db.select()
                .from(Schema_1.venueAvailability)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.venueAvailability.venueId, venueId), (0, drizzle_orm_1.eq)(Schema_1.venueAvailability.date, dateStr), (0, drizzle_orm_1.eq)(Schema_1.venueAvailability.isBooked, false)))
                .limit(1);
            return availability.length > 0;
        });
    }
    /**
     * Update venue availability for a specific date
     */
    updateVenueAvailability(venueId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            const dateStr = date.toISOString().split('T')[0]; // Convert to YYYY-MM-DD format
            yield this.db.update(Schema_1.venueAvailability)
                .set({ isBooked: true })
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.venueAvailability.venueId, venueId), (0, drizzle_orm_1.eq)(Schema_1.venueAvailability.date, dateStr)));
        });
    }
    /**
     * Update farmhouse availability for a specific date
     */
    updateFarmhouseAvailability(farmhouseId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            const dateStr = date.toISOString().split('T')[0]; // Convert to YYYY-MM-DD format
            yield this.db.update(Schema_1.farmhouseAvailability)
                .set({ isBooked: true })
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.farmhouseAvailability.farmhouseId, farmhouseId), (0, drizzle_orm_1.eq)(Schema_1.farmhouseAvailability.date, dateStr)));
        });
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
    getVenuePrice(venueId) {
        return __awaiter(this, void 0, void 0, function* () {
            const venue = yield this.db.select({ price: Schema_1.venues.price })
                .from(Schema_1.venues)
                .where((0, drizzle_orm_1.eq)(Schema_1.venues.id, venueId))
                .limit(1);
            if (venue.length === 0)
                throw new Error('Venue not found');
            return parseFloat(venue[0].price);
        });
    }
    /**
     * Get farmhouse price
     */
    getFarmhousePrice(farmhouseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const farmhouse = yield this.db.select({ price: Schema_1.farmhouses.perNightPrice })
                .from(Schema_1.farmhouses)
                .where((0, drizzle_orm_1.eq)(Schema_1.farmhouses.id, farmhouseId))
                .limit(1);
            if (farmhouse.length === 0)
                throw new Error('Farmhouse not found');
            return Number(farmhouse[0].price);
        });
    }
    /**
     * Get catering package price
     */
    getCateringPrice(cateringId) {
        return __awaiter(this, void 0, void 0, function* () {
            const catering = yield this.db.select({ price: Schema_1.cateringPackages.price })
                .from(Schema_1.cateringPackages)
                .where((0, drizzle_orm_1.eq)(Schema_1.cateringPackages.id, cateringId))
                .limit(1);
            if (catering.length === 0)
                throw new Error('Catering package not found');
            return Number(catering[0].price);
        });
    }
    /**
     * Get photography package price
     */
    getPhotographyPrice(photographyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const photography = yield this.db.select({ price: Schema_1.photographyPackages.price })
                .from(Schema_1.photographyPackages)
                .where((0, drizzle_orm_1.eq)(Schema_1.photographyPackages.id, photographyId))
                .limit(1);
            if (photography.length === 0)
                throw new Error('Photography package not found');
            return Number(photography[0].price);
        });
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
    getVenueDetails(venueId) {
        return __awaiter(this, void 0, void 0, function* () {
            const venueDetails = yield this.db.select()
                .from(Schema_1.venues)
                .where((0, drizzle_orm_1.eq)(Schema_1.venues.id, venueId))
                .limit(1);
            if (venueDetails.length === 0)
                throw new Error('Venue not found');
            return venueDetails[0];
        });
    }
    /**
     * Get farmhouse details
     */
    getFarmhouseDetails(farmhouseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const farmhouseDetails = yield this.db.select()
                .from(Schema_1.farmhouses)
                .where((0, drizzle_orm_1.eq)(Schema_1.farmhouses.id, farmhouseId))
                .limit(1);
            if (farmhouseDetails.length === 0)
                throw new Error('Farmhouse not found');
            return farmhouseDetails[0];
        });
    }
    /**
     * Get catering package details
     */
    getCateringDetails(cateringId) {
        return __awaiter(this, void 0, void 0, function* () {
            const cateringDetails = yield this.db.select()
                .from(Schema_1.cateringPackages)
                .where((0, drizzle_orm_1.eq)(Schema_1.cateringPackages.id, cateringId))
                .limit(1);
            if (cateringDetails.length === 0)
                throw new Error('Catering package not found');
            return cateringDetails[0];
        });
    }
    /**
     * Get photography package details
     */
    getPhotographyDetails(photographyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const photographyDetails = yield this.db.select()
                .from(Schema_1.photographyPackages)
                .where((0, drizzle_orm_1.eq)(Schema_1.photographyPackages.id, photographyId))
                .limit(1);
            if (photographyDetails.length === 0)
                throw new Error('Photography package not found');
            return photographyDetails[0];
        });
    }
    /**
     * Get vendor details
     */
    getVendorDetails(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const vendorRecord = yield this.db.select({
                id: Schema_1.vendors.id,
                vendorName: Schema_1.vendors.vendorName,
                vendorEmail: Schema_1.vendors.vendorEmail,
                vendorPhone: Schema_1.vendors.vendorPhone,
                profileImage: Schema_1.vendors.profileImage
            })
                .from(Schema_1.vendors)
                .where((0, drizzle_orm_1.eq)(Schema_1.vendors.id, vendorId))
                .limit(1);
            if (vendorRecord.length === 0)
                throw new Error('Vendor not found');
            return vendorRecord[0];
        });
    }
    /**
     * Insert a new booking
     */
    insertBooking(bookingData) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db.insert(Schema_1.bookings).values(bookingData).returning();
            return result[0];
        });
    }
    /**
     * Get booking by ID
     */
    getBookingById(whereClause) {
        return __awaiter(this, void 0, void 0, function* () {
            const bookingRecord = yield this.db.select()
                .from(Schema_1.bookings)
                .where(whereClause)
                .limit(1);
            return bookingRecord.length > 0 ? bookingRecord[0] : null;
        });
    }
    /**
     * Update booking
     */
    updateBooking(bookingId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedBooking = yield this.db.update(Schema_1.bookings)
                .set(updateData)
                .where((0, drizzle_orm_1.eq)(Schema_1.bookings.id, bookingId))
                .returning();
            return updatedBooking[0];
        });
    }
    /**
     * Get bookings with filters
     */
    getBookings(whereClause, filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const limit = filters.limit || 10;
            const offset = filters.offset || 0;
            const bookingRecords = yield this.db.select()
                .from(Schema_1.bookings)
                .where(whereClause)
                .orderBy((0, drizzle_orm_1.desc)(Schema_1.bookings.createdAt))
                .limit(limit)
                .offset(offset);
            return bookingRecords;
        });
    }
    /**
     * Get visiting requests for a vendor (requests that need vendor response)
     */
    getVendorVisitingRequests(vendorId_1) {
        return __awaiter(this, arguments, void 0, function* (vendorId, filters = {}) {
            const limit = filters.limit || 10;
            const offset = filters.offset || 0;
            // Build where conditions
            const conditions = [
                (0, drizzle_orm_1.eq)(Schema_1.bookings.vendorId, vendorId),
                (0, drizzle_orm_1.eq)(Schema_1.bookings.visitRequested, true),
                (0, drizzle_orm_1.eq)(Schema_1.bookings.visitStatus, 'Requested')
            ];
            // Add date filters if provided
            if (filters.from) {
                conditions.push((0, drizzle_orm_1.gte)(Schema_1.bookings.createdAt, new Date(filters.from)));
            }
            if (filters.to) {
                conditions.push((0, drizzle_orm_1.lte)(Schema_1.bookings.createdAt, new Date(filters.to)));
            }
            // Add service type filter if provided
            if (filters.serviceType) {
                conditions.push((0, drizzle_orm_1.eq)(Schema_1.bookings.serviceType, filters.serviceType));
            }
            const result = yield this.db.select({
                // Booking details
                id: Schema_1.bookings.id,
                userId: Schema_1.bookings.userId,
                vendorId: Schema_1.bookings.vendorId,
                serviceType: Schema_1.bookings.serviceType,
                serviceId: Schema_1.bookings.serviceId,
                eventDate: Schema_1.bookings.eventDate,
                eventStartTime: Schema_1.bookings.eventStartTime,
                eventEndTime: Schema_1.bookings.eventEndTime,
                numberOfGuests: Schema_1.bookings.numberOfGuests,
                totalAmount: Schema_1.bookings.totalAmount,
                status: Schema_1.bookings.status,
                paymentStatus: Schema_1.bookings.paymentStatus,
                visitRequested: Schema_1.bookings.visitRequested,
                visitStatus: Schema_1.bookings.visitStatus,
                visitScheduledFor: Schema_1.bookings.visitScheduledFor,
                specialRequests: Schema_1.bookings.specialRequests,
                createdAt: Schema_1.bookings.createdAt,
                updatedAt: Schema_1.bookings.updatedAt,
                bookingReference: Schema_1.bookings.bookingReference,
                // User details
                userName: Schema_1.users.firstName,
                userLastName: Schema_1.users.lastName,
                userEmail: Schema_1.users.email,
                userPhone: Schema_1.users.phone
            })
                .from(Schema_1.bookings)
                .leftJoin(Schema_1.users, (0, drizzle_orm_1.eq)(Schema_1.bookings.userId, Schema_1.users.id))
                .where((0, drizzle_orm_1.and)(...conditions))
                .orderBy((0, drizzle_orm_1.desc)(Schema_1.bookings.createdAt))
                .limit(limit)
                .offset(offset);
            return result;
        });
    }
    /**
     * Get scheduled visits for a vendor
     */
    getVendorScheduledVisits(vendorId_1) {
        return __awaiter(this, arguments, void 0, function* (vendorId, filters = {}) {
            const limit = filters.limit || 10;
            const offset = filters.offset || 0;
            // Build where conditions
            const conditions = [
                (0, drizzle_orm_1.eq)(Schema_1.bookings.vendorId, vendorId),
                (0, drizzle_orm_1.eq)(Schema_1.bookings.visitRequested, true),
                (0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(Schema_1.bookings.visitStatus, 'Scheduled'), (0, drizzle_orm_1.eq)(Schema_1.bookings.visitStatus, 'Completed'))
            ];
            // Add date filters if provided
            if (filters.from) {
                conditions.push((0, drizzle_orm_1.gte)(Schema_1.bookings.visitScheduledFor, new Date(filters.from)));
            }
            if (filters.to) {
                conditions.push((0, drizzle_orm_1.lte)(Schema_1.bookings.visitScheduledFor, new Date(filters.to)));
            }
            // Add service type filter if provided
            if (filters.serviceType) {
                conditions.push((0, drizzle_orm_1.eq)(Schema_1.bookings.serviceType, filters.serviceType));
            }
            const result = yield this.db.select({
                // Booking details
                id: Schema_1.bookings.id,
                userId: Schema_1.bookings.userId,
                vendorId: Schema_1.bookings.vendorId,
                serviceType: Schema_1.bookings.serviceType,
                serviceId: Schema_1.bookings.serviceId,
                eventDate: Schema_1.bookings.eventDate,
                eventStartTime: Schema_1.bookings.eventStartTime,
                eventEndTime: Schema_1.bookings.eventEndTime,
                numberOfGuests: Schema_1.bookings.numberOfGuests,
                totalAmount: Schema_1.bookings.totalAmount,
                status: Schema_1.bookings.status,
                paymentStatus: Schema_1.bookings.paymentStatus,
                visitRequested: Schema_1.bookings.visitRequested,
                visitStatus: Schema_1.bookings.visitStatus,
                visitScheduledFor: Schema_1.bookings.visitScheduledFor,
                specialRequests: Schema_1.bookings.specialRequests,
                createdAt: Schema_1.bookings.createdAt,
                updatedAt: Schema_1.bookings.updatedAt,
                bookingReference: Schema_1.bookings.bookingReference,
                // User details
                userName: Schema_1.users.firstName,
                userLastName: Schema_1.users.lastName,
                userEmail: Schema_1.users.email,
                userPhone: Schema_1.users.phone
            })
                .from(Schema_1.bookings)
                .leftJoin(Schema_1.users, (0, drizzle_orm_1.eq)(Schema_1.bookings.userId, Schema_1.users.id))
                .where((0, drizzle_orm_1.and)(...conditions))
                .orderBy((0, drizzle_orm_1.desc)(Schema_1.bookings.visitScheduledFor))
                .limit(limit)
                .offset(offset);
            return result;
        });
    }
    /**
     * Get all visiting requests for admin
     */
    getAllVisitingRequests() {
        return __awaiter(this, arguments, void 0, function* (filters = {}) {
            const limit = filters.limit || 20;
            const offset = filters.offset || 0;
            // Build where conditions
            const conditions = [
                (0, drizzle_orm_1.eq)(Schema_1.bookings.visitRequested, true),
                (0, drizzle_orm_1.eq)(Schema_1.bookings.visitStatus, 'Requested')
            ];
            // Add date filters if provided
            if (filters.from) {
                conditions.push((0, drizzle_orm_1.gte)(Schema_1.bookings.createdAt, new Date(filters.from)));
            }
            if (filters.to) {
                conditions.push((0, drizzle_orm_1.lte)(Schema_1.bookings.createdAt, new Date(filters.to)));
            }
            // Add service type filter if provided
            if (filters.serviceType) {
                conditions.push((0, drizzle_orm_1.eq)(Schema_1.bookings.serviceType, filters.serviceType));
            }
            // Add booking status filter if provided
            if (filters.status) {
                conditions.push((0, drizzle_orm_1.eq)(Schema_1.bookings.status, filters.status));
            }
            const result = yield this.db.select({
                // Booking details
                id: Schema_1.bookings.id,
                userId: Schema_1.bookings.userId,
                vendorId: Schema_1.bookings.vendorId,
                serviceType: Schema_1.bookings.serviceType,
                serviceId: Schema_1.bookings.serviceId,
                eventDate: Schema_1.bookings.eventDate,
                eventStartTime: Schema_1.bookings.eventStartTime,
                eventEndTime: Schema_1.bookings.eventEndTime,
                numberOfGuests: Schema_1.bookings.numberOfGuests,
                totalAmount: Schema_1.bookings.totalAmount,
                status: Schema_1.bookings.status,
                paymentStatus: Schema_1.bookings.paymentStatus,
                visitRequested: Schema_1.bookings.visitRequested,
                visitStatus: Schema_1.bookings.visitStatus,
                visitScheduledFor: Schema_1.bookings.visitScheduledFor,
                specialRequests: Schema_1.bookings.specialRequests,
                createdAt: Schema_1.bookings.createdAt,
                updatedAt: Schema_1.bookings.updatedAt,
                bookingReference: Schema_1.bookings.bookingReference,
                // User details
                userName: Schema_1.users.firstName,
                userLastName: Schema_1.users.lastName,
                userEmail: Schema_1.users.email,
                userPhone: Schema_1.users.phone,
                // Vendor details
                vendorName: Schema_1.vendors.vendorName,
                vendorEmail: Schema_1.vendors.vendorEmail,
                vendorPhone: Schema_1.vendors.vendorPhone
            })
                .from(Schema_1.bookings)
                .leftJoin(Schema_1.users, (0, drizzle_orm_1.eq)(Schema_1.bookings.userId, Schema_1.users.id))
                .leftJoin(Schema_1.vendors, (0, drizzle_orm_1.eq)(Schema_1.bookings.vendorId, Schema_1.vendors.id))
                .where((0, drizzle_orm_1.and)(...conditions))
                .orderBy((0, drizzle_orm_1.desc)(Schema_1.bookings.createdAt))
                .limit(limit)
                .offset(offset);
            return result;
        });
    }
    /**
     * Get all scheduled visits for admin
     */
    getAllScheduledVisits() {
        return __awaiter(this, arguments, void 0, function* (filters = {}) {
            const limit = filters.limit || 20;
            const offset = filters.offset || 0;
            // Build where conditions
            const conditions = [
                (0, drizzle_orm_1.eq)(Schema_1.bookings.visitRequested, true),
                (0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(Schema_1.bookings.visitStatus, 'Scheduled'), (0, drizzle_orm_1.eq)(Schema_1.bookings.visitStatus, 'Completed'))
            ];
            // Add date filters if provided
            if (filters.from) {
                conditions.push((0, drizzle_orm_1.gte)(Schema_1.bookings.visitScheduledFor, new Date(filters.from)));
            }
            if (filters.to) {
                conditions.push((0, drizzle_orm_1.lte)(Schema_1.bookings.visitScheduledFor, new Date(filters.to)));
            }
            // Add service type filter if provided
            if (filters.serviceType) {
                conditions.push((0, drizzle_orm_1.eq)(Schema_1.bookings.serviceType, filters.serviceType));
            }
            // Add booking status filter if provided
            if (filters.status) {
                conditions.push((0, drizzle_orm_1.eq)(Schema_1.bookings.status, filters.status));
            }
            const result = yield this.db.select({
                // Booking details
                id: Schema_1.bookings.id,
                userId: Schema_1.bookings.userId,
                vendorId: Schema_1.bookings.vendorId,
                serviceType: Schema_1.bookings.serviceType,
                serviceId: Schema_1.bookings.serviceId,
                eventDate: Schema_1.bookings.eventDate,
                eventStartTime: Schema_1.bookings.eventStartTime,
                eventEndTime: Schema_1.bookings.eventEndTime,
                numberOfGuests: Schema_1.bookings.numberOfGuests,
                totalAmount: Schema_1.bookings.totalAmount,
                status: Schema_1.bookings.status,
                paymentStatus: Schema_1.bookings.paymentStatus,
                visitRequested: Schema_1.bookings.visitRequested,
                visitStatus: Schema_1.bookings.visitStatus,
                visitScheduledFor: Schema_1.bookings.visitScheduledFor,
                specialRequests: Schema_1.bookings.specialRequests,
                createdAt: Schema_1.bookings.createdAt,
                updatedAt: Schema_1.bookings.updatedAt,
                bookingReference: Schema_1.bookings.bookingReference,
                // User details
                userName: Schema_1.users.firstName,
                userLastName: Schema_1.users.lastName,
                userEmail: Schema_1.users.email,
                userPhone: Schema_1.users.phone,
                // Vendor details
                vendorName: Schema_1.vendors.vendorName,
                vendorEmail: Schema_1.vendors.vendorEmail,
                vendorPhone: Schema_1.vendors.vendorPhone
            })
                .from(Schema_1.bookings)
                .leftJoin(Schema_1.users, (0, drizzle_orm_1.eq)(Schema_1.bookings.userId, Schema_1.users.id))
                .leftJoin(Schema_1.vendors, (0, drizzle_orm_1.eq)(Schema_1.bookings.vendorId, Schema_1.vendors.id))
                .where((0, drizzle_orm_1.and)(...conditions))
                .orderBy((0, drizzle_orm_1.desc)(Schema_1.bookings.visitScheduledFor))
                .limit(limit)
                .offset(offset);
            return result;
        });
    }
}
exports.BookingModel = BookingModel;
