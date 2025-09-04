"use strict";
// src/Features/Booking/Service.ts
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
exports.BookingService = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const uuid_1 = require("uuid");
const Schema_1 = require("../../../Schema");
const Types_1 = require("../Types");
/**
 * BookingService class containing business logic for booking management
 */
class BookingService {
    constructor(model) {
        this.model = model;
    }
    /**
     * Check if a service is available on the requested date
     */
    checkServiceAvailability(serviceType, serviceId, eventDate) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!eventDate)
                return true;
            const dateObj = new Date(eventDate);
            switch (serviceType) {
                case Types_1.ServiceType.VENUE:
                    return this.model.getVenueAvailability(serviceId, dateObj);
                case Types_1.ServiceType.FARMHOUSE:
                    return this.model.getFarmhouseAvailability(serviceId, dateObj); // <-- FIXED
                // For catering and photography, we assume they manage their own availability
                default:
                    return true;
            }
        });
    }
    /**
     * Get the price of a service based on its type and ID
     */
    getServicePrice(serviceType, serviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (serviceType) {
                case Types_1.ServiceType.VENUE:
                    return this.model.getVenuePrice(serviceId);
                case Types_1.ServiceType.FARMHOUSE:
                    return this.model.getFarmhousePrice(serviceId);
                case Types_1.ServiceType.CATERING:
                    return this.model.getCateringPrice(serviceId);
                case Types_1.ServiceType.PHOTOGRAPHY:
                    return this.model.getPhotographyPrice(serviceId);
                default:
                    throw new Error('Invalid service type');
            }
        });
    }
    /**
     * Update service availability after booking
     */
    updateServiceAvailability(serviceType, serviceId, eventDate) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!eventDate)
                return;
            const dateObj = new Date(eventDate);
            switch (serviceType) {
                case Types_1.ServiceType.VENUE:
                    yield this.model.updateVenueAvailability(serviceId, dateObj);
                    break;
                case Types_1.ServiceType.FARMHOUSE:
                    yield this.model.updateFarmhouseAvailability(serviceId, dateObj);
                    break;
                // For catering and photography, availability is managed differently
                default:
                    break;
            }
        });
    }
    /**
     * Get the service details based on service type and ID
     */
    getServiceDetails(serviceType, serviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (serviceType) {
                case Types_1.ServiceType.VENUE:
                    return this.model.getVenueDetails(serviceId);
                case Types_1.ServiceType.FARMHOUSE:
                    return this.model.getFarmhouseDetails(serviceId);
                case Types_1.ServiceType.CATERING:
                    return this.model.getCateringDetails(serviceId);
                case Types_1.ServiceType.PHOTOGRAPHY:
                    return this.model.getPhotographyDetails(serviceId);
                default:
                    throw new Error('Invalid service type');
            }
        });
    }
    /**
     * Generate a unique booking reference
     */
    generateBookingReference() {
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `BK-${timestamp}-${random}`;
    }
    /**
     * Create a new booking
     */
    createBooking(input, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if service is available
            const isAvailable = yield this.checkServiceAvailability(input.serviceType, input.serviceId, input.eventDate);
            if (!isAvailable) {
                throw new Error('Service is not available on the requested date');
            }
            // Get service price
            const servicePrice = yield this.getServicePrice(input.serviceType, input.serviceId);
            // Calculate advance amount (30% of total)
            const totalAmount = servicePrice;
            const advanceAmount = totalAmount * 0.3;
            const balanceAmount = totalAmount - advanceAmount;
            // Generate booking reference
            const bookingReference = this.generateBookingReference();
            // Determine initial visit status
            const visitStatus = input.visitRequested ? Types_1.VisitStatus.REQUESTED : null;
            // Prepare booking data
            const newBooking = {
                id: (0, uuid_1.v4)(),
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
                status: Types_1.BookingStatus.PENDING,
                paymentStatus: Types_1.PaymentStatus.AWAITING_ADVANCE,
                visitRequested: input.visitRequested || false,
                visitStatus,
                visitScheduledFor: null,
                specialRequests: input.specialRequests || null,
                bookingReference,
                isReviewed: false
            };
            // Insert booking record
            const result = yield this.model.insertBooking(newBooking);
            // Update service availability
            yield this.updateServiceAvailability(input.serviceType, input.serviceId, input.eventDate);
            return result;
        });
    }
    /**
     * Request a visit for venue or farmhouse
     */
    requestVisit(input, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get the booking
            const whereClause = (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.bookings.id, input.bookingId), (0, drizzle_orm_1.eq)(Schema_1.bookings.userId, userId));
            const booking = yield this.model.getBookingById(whereClause);
            if (!booking) {
                throw new Error('Booking not found');
            }
            // Validate service type
            if (booking.serviceType !== Types_1.ServiceType.VENUE && booking.serviceType !== Types_1.ServiceType.FARMHOUSE) {
                throw new Error('Visit can only be requested for venues and farmhouses');
            }
            // Combine date and time
            const preferredDateTime = new Date(`${input.preferredDate}T${input.preferredTime}`);
            // Update booking with visit request
            const updateData = {
                visitRequested: true,
                visitStatus: Types_1.VisitStatus.REQUESTED,
                visitScheduledFor: preferredDateTime,
                updatedAt: new Date()
            };
            return this.model.updateBooking(input.bookingId, updateData);
        });
    }
    /**
     * Schedule a visit (vendor/admin only)
     */
    scheduleVisit(input, vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get the booking
            const whereClause = (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.bookings.id, input.bookingId), (0, drizzle_orm_1.eq)(Schema_1.bookings.vendorId, vendorId));
            const booking = yield this.model.getBookingById(whereClause);
            if (!booking) {
                throw new Error('Booking not found');
            }
            // Combine date and time
            const scheduledDateTime = new Date(`${input.scheduledDate}T${input.scheduledTime}`);
            // Update booking with scheduled visit
            const updateData = {
                visitStatus: Types_1.VisitStatus.SCHEDULED,
                visitScheduledFor: scheduledDateTime,
                updatedAt: new Date()
            };
            return this.model.updateBooking(input.bookingId, updateData);
        });
    }
    /**
     * Complete a visit (vendor/admin only)
     */
    completeVisit(bookingId, vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get the booking
            const whereClause = (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.bookings.id, bookingId), (0, drizzle_orm_1.eq)(Schema_1.bookings.vendorId, vendorId));
            const booking = yield this.model.getBookingById(whereClause);
            if (!booking) {
                throw new Error('Booking not found');
            }
            // Update booking with completed visit
            const updateData = {
                visitStatus: Types_1.VisitStatus.COMPLETED,
                updatedAt: new Date()
            };
            return this.model.updateBooking(bookingId, updateData);
        });
    }
    /**
     * Update payment details
     */
    updatePayment(input, userId, vendorId, isAdmin) {
        return __awaiter(this, void 0, void 0, function* () {
            // Prepare where clause based on who is making the update
            let whereClause;
            if (isAdmin) {
                whereClause = (0, drizzle_orm_1.eq)(Schema_1.bookings.id, input.bookingId);
            }
            else if (userId) {
                whereClause = (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.bookings.id, input.bookingId), (0, drizzle_orm_1.eq)(Schema_1.bookings.userId, userId));
            }
            else if (vendorId) {
                whereClause = (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.bookings.id, input.bookingId), (0, drizzle_orm_1.eq)(Schema_1.bookings.vendorId, vendorId));
            }
            else {
                throw new Error('Unauthorized to update payment');
            }
            // Get the booking
            const booking = yield this.model.getBookingById(whereClause);
            if (!booking) {
                throw new Error('Booking not found');
            }
            // Prepare update data
            const updateData = {
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
                if (input.paymentStatus === Types_1.PaymentStatus.FULLY_PAID) {
                    updateData.status = Types_1.BookingStatus.CONFIRMED;
                }
                else if (input.paymentStatus === Types_1.PaymentStatus.CANCELED) {
                    updateData.status = Types_1.BookingStatus.CANCELED;
                    updateData.canceledAt = new Date();
                }
            }
            // Update booking payment details
            return this.model.updateBooking(input.bookingId, updateData);
        });
    }
    /**
     * Cancel a booking
     */
    cancelBooking(input, userId, vendorId, isAdmin) {
        return __awaiter(this, void 0, void 0, function* () {
            // Prepare where clause based on who is making the update
            let whereClause;
            if (isAdmin) {
                whereClause = (0, drizzle_orm_1.eq)(Schema_1.bookings.id, input.bookingId);
            }
            else if (userId) {
                whereClause = (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.bookings.id, input.bookingId), (0, drizzle_orm_1.eq)(Schema_1.bookings.userId, userId));
            }
            else if (vendorId) {
                whereClause = (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.bookings.id, input.bookingId), (0, drizzle_orm_1.eq)(Schema_1.bookings.vendorId, vendorId));
            }
            else {
                throw new Error('Unauthorized to cancel booking');
            }
            // Get the booking
            const booking = yield this.model.getBookingById(whereClause);
            if (!booking) {
                throw new Error('Booking not found');
            }
            // Update booking as canceled
            const updateData = {
                status: Types_1.BookingStatus.CANCELED,
                paymentStatus: Types_1.PaymentStatus.CANCELED,
                canceledAt: new Date(),
                cancellationReason: input.cancellationReason,
                updatedAt: new Date()
            };
            return this.model.updateBooking(input.bookingId, updateData);
        });
    }
    /**
     * Get a single booking by ID with service details
     */
    getBookingById(bookingId, userId, vendorId, isAdmin) {
        return __awaiter(this, void 0, void 0, function* () {
            // Prepare where clause based on who is requesting
            let whereClause;
            if (isAdmin) {
                whereClause = (0, drizzle_orm_1.eq)(Schema_1.bookings.id, bookingId);
            }
            else if (userId) {
                whereClause = (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.bookings.id, bookingId), (0, drizzle_orm_1.eq)(Schema_1.bookings.userId, userId));
            }
            else if (vendorId) {
                whereClause = (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.bookings.id, bookingId), (0, drizzle_orm_1.eq)(Schema_1.bookings.vendorId, vendorId));
            }
            else {
                throw new Error('Unauthorized to view booking');
            }
            // Get the booking
            const booking = yield this.model.getBookingById(whereClause);
            if (!booking) {
                throw new Error('Booking not found');
            }
            // Get service details
            const service = yield this.getServiceDetails(booking.serviceType, booking.serviceId);
            // Get vendor details
            const vendor = yield this.model.getVendorDetails(booking.vendorId);
            return Object.assign(Object.assign({}, booking), { service,
                vendor });
        });
    }
    /**
     * Get bookings with filters
     */
    getBookings(filters, userId, vendorId, isAdmin) {
        return __awaiter(this, void 0, void 0, function* () {
            // Prepare where clauses
            const whereConditions = [];
            // User or vendor specific filter
            if (userId) {
                whereConditions.push((0, drizzle_orm_1.eq)(Schema_1.bookings.userId, userId));
            }
            else if (vendorId) {
                whereConditions.push((0, drizzle_orm_1.eq)(Schema_1.bookings.vendorId, vendorId));
            }
            else if (!isAdmin) {
                throw new Error('Unauthorized to view bookings');
            }
            // Status filter
            if (filters.status) {
                whereConditions.push((0, drizzle_orm_1.eq)(Schema_1.bookings.status, filters.status));
            }
            // Service type filter
            if (filters.serviceType) {
                whereConditions.push((0, drizzle_orm_1.eq)(Schema_1.bookings.serviceType, filters.serviceType));
            }
            // Date range filter
            if (filters.from) {
                const fromDate = new Date(filters.from);
                whereConditions.push((0, drizzle_orm_1.gte)(Schema_1.bookings.eventDate, fromDate.toISOString().split('T')[0]));
            }
            if (filters.to) {
                const toDate = new Date(filters.to);
                whereConditions.push((0, drizzle_orm_1.lte)(Schema_1.bookings.eventDate, toDate.toISOString().split('T')[0]));
            }
            // Build final where clause
            const whereClause = whereConditions.length > 0
                ? (0, drizzle_orm_1.and)(...whereConditions)
                : undefined;
            // Get bookings
            const bookingResults = yield this.model.getBookings(whereClause, filters);
            // Fetch service and vendor details for each booking
            const result = [];
            for (const booking of bookingResults) {
                const service = yield this.getServiceDetails(booking.serviceType, booking.serviceId);
                const vendor = yield this.model.getVendorDetails(booking.vendorId);
                result.push(Object.assign(Object.assign({}, booking), { service,
                    vendor }));
            }
            return result;
        });
    }
    /**
     * Get vendor visiting requests (vendor only)
     */
    getVendorVisitingRequests(vendorId_1) {
        return __awaiter(this, arguments, void 0, function* (vendorId, filters = {}) {
            return this.model.getVendorVisitingRequests(vendorId, filters);
        });
    }
    /**
     * Get vendor scheduled visits (vendor only)
     */
    getVendorScheduledVisits(vendorId_1) {
        return __awaiter(this, arguments, void 0, function* (vendorId, filters = {}) {
            return this.model.getVendorScheduledVisits(vendorId, filters);
        });
    }
    /**
     * Get all visiting requests (admin only)
     */
    getAllVisitingRequests() {
        return __awaiter(this, arguments, void 0, function* (filters = {}) {
            return this.model.getAllVisitingRequests(filters);
        });
    }
    /**
     * Get all scheduled visits (admin only)
     */
    getAllScheduledVisits() {
        return __awaiter(this, arguments, void 0, function* (filters = {}) {
            return this.model.getAllScheduledVisits(filters);
        });
    }
}
exports.BookingService = BookingService;
