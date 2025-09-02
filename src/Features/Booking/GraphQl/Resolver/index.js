"use strict";
// src/Features/Booking/Resolvers.ts
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
exports.BookingResolvers = void 0;
const Service_1 = require("../../Service");
const Types_1 = require("../../Types");
const apollo_server_express_1 = require("apollo-server-express");
const Validator_1 = require("../../Validator");
const Model_1 = require("../../Model");
exports.BookingResolvers = {
    // Type resolvers for GraphQL union
    ServiceDetails: {
        __resolveType(obj) {
            if (obj.packageName && obj.duration)
                return 'PhotographyPackage';
            if (obj.packageName && !obj.duration)
                return 'CateringPackage';
            if (obj.perNightPrice)
                return 'FarmHouse';
            if (obj.minPersonLimit)
                return 'Venue';
            return null;
        },
    },
    // Query resolvers
    Query: {
        // Get a single booking by ID (accessible to the booking owner, vendor, or admin)
        booking: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            var _b, _c;
            if (!context.user && !context.vendor && !context.Admin) {
                throw new apollo_server_express_1.AuthenticationError('You must be logged in to view a booking');
            }
            try {
                const bookingModel = new Model_1.BookingModel(context.db);
                const bookingService = new Service_1.BookingService(bookingModel);
                return yield bookingService.getBookingById(id, (_b = context.user) === null || _b === void 0 ? void 0 : _b.id, (_c = context.vendor) === null || _c === void 0 ? void 0 : _c.id, !!context.Admin);
            }
            catch (error) {
                throw new apollo_server_express_1.UserInputError(error.message);
            }
        }),
        // Get bookings with filters (context dependent)
        bookings: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { filters }, context) {
            if (!context.user && !context.vendor && !context.Admin) {
                throw new apollo_server_express_1.AuthenticationError('You must be logged in to view bookings');
            }
            try {
                // Validate filters
                (0, Validator_1.validateBookingFiltersInput)(filters);
                const bookingModel = new Model_1.BookingModel(context.db);
                const bookingService = new Service_1.BookingService(bookingModel);
                // Route to appropriate service method based on context
                if (context.user) {
                    return yield bookingService.getBookings(filters, context.user.id);
                }
                else if (context.vendor) {
                    return yield bookingService.getBookings(filters, undefined, context.vendor.id);
                }
                else if (context.Admin) {
                    return yield bookingService.getBookings(filters, undefined, undefined, true);
                }
                return [];
            }
            catch (error) {
                throw new apollo_server_express_1.UserInputError(error.message);
            }
        }),
        // Get user's bookings (user only)
        myBookings: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { filters }, context) {
            if (!context.user) {
                throw new apollo_server_express_1.AuthenticationError('You must be logged in as a user to view your bookings');
            }
            try {
                // Validate filters
                (0, Validator_1.validateBookingFiltersInput)(filters);
                const bookingModel = new Model_1.BookingModel(context.db);
                const bookingService = new Service_1.BookingService(bookingModel);
                return yield bookingService.getBookings(filters, context.user.id);
            }
            catch (error) {
                throw new apollo_server_express_1.UserInputError(error.message);
            }
        }),
        // Get vendor's bookings (vendor only)
        vendorBookings: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { filters }, context) {
            if (!context.vendor) {
                throw new apollo_server_express_1.AuthenticationError('You must be logged in as a vendor to view your bookings');
            }
            try {
                // Validate filters
                (0, Validator_1.validateBookingFiltersInput)(filters);
                const bookingModel = new Model_1.BookingModel(context.db);
                const bookingService = new Service_1.BookingService(bookingModel);
                return yield bookingService.getBookings(filters, undefined, context.vendor.id);
            }
            catch (error) {
                throw new apollo_server_express_1.UserInputError(error.message);
            }
        }),
        // Get all bookings (admin only)
        allBookings: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { filters }, context) {
            if (!context.Admin) {
                throw new apollo_server_express_1.ForbiddenError('Admin access required');
            }
            try {
                // Validate filters
                (0, Validator_1.validateBookingFiltersInput)(filters);
                const bookingModel = new Model_1.BookingModel(context.db);
                const bookingService = new Service_1.BookingService(bookingModel);
                return yield bookingService.getBookings(filters, undefined, undefined, true);
            }
            catch (error) {
                throw new apollo_server_express_1.UserInputError(error.message);
            }
        }),
        // Get vendor visiting requests (vendor only)
        vendorVisitingRequests: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { filters }, context) {
            if (!context.vendor) {
                throw new apollo_server_express_1.AuthenticationError('You must be logged in as a vendor to view visiting requests');
            }
            try {
                // Validate filters
                (0, Validator_1.validateBookingFiltersInput)(filters);
                const bookingModel = new Model_1.BookingModel(context.db);
                const bookingService = new Service_1.BookingService(bookingModel);
                return yield bookingService.getVendorVisitingRequests(context.vendor.id, filters);
            }
            catch (error) {
                throw new apollo_server_express_1.UserInputError(error.message);
            }
        }),
        // Get vendor scheduled visits (vendor only)
        vendorScheduledVisits: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { filters }, context) {
            if (!context.vendor) {
                throw new apollo_server_express_1.AuthenticationError('You must be logged in as a vendor to view scheduled visits');
            }
            try {
                // Validate filters
                (0, Validator_1.validateBookingFiltersInput)(filters);
                const bookingModel = new Model_1.BookingModel(context.db);
                const bookingService = new Service_1.BookingService(bookingModel);
                return yield bookingService.getVendorScheduledVisits(context.vendor.id, filters);
            }
            catch (error) {
                throw new apollo_server_express_1.UserInputError(error.message);
            }
        }),
        // Get all visiting requests (admin only)
        allVisitingRequests: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { filters }, context) {
            if (!context.Admin) {
                throw new apollo_server_express_1.ForbiddenError('Admin access required');
            }
            try {
                // Validate filters
                (0, Validator_1.validateBookingFiltersInput)(filters);
                const bookingModel = new Model_1.BookingModel(context.db);
                const bookingService = new Service_1.BookingService(bookingModel);
                return yield bookingService.getAllVisitingRequests(filters);
            }
            catch (error) {
                throw new apollo_server_express_1.UserInputError(error.message);
            }
        }),
        // Get all scheduled visits (admin only)
        allScheduledVisits: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { filters }, context) {
            if (!context.Admin) {
                throw new apollo_server_express_1.ForbiddenError('Admin access required');
            }
            try {
                // Validate filters
                (0, Validator_1.validateBookingFiltersInput)(filters);
                const bookingModel = new Model_1.BookingModel(context.db);
                const bookingService = new Service_1.BookingService(bookingModel);
                return yield bookingService.getAllScheduledVisits(filters);
            }
            catch (error) {
                throw new apollo_server_express_1.UserInputError(error.message);
            }
        }),
    },
    // Mutation resolvers
    Mutation: {
        // Create a new booking (user only)
        createBooking: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { input }, context) {
            if (!context.user) {
                throw new apollo_server_express_1.AuthenticationError('You must be logged in as a user to create a booking');
            }
            try {
                // Validate input
                (0, Validator_1.validateCreateBookingInput)(input);
                // Service type validation
                if (!Object.values(Types_1.ServiceType).includes(input.serviceType)) {
                    throw new apollo_server_express_1.UserInputError('Invalid service type');
                }
                const bookingModel = new Model_1.BookingModel(context.db);
                const bookingService = new Service_1.BookingService(bookingModel);
                return yield bookingService.createBooking(input, context.user.id);
            }
            catch (error) {
                throw new apollo_server_express_1.UserInputError(error.message);
            }
        }),
        // Request a visit (user only)
        requestVisit: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { input }, context) {
            if (!context.user) {
                throw new apollo_server_express_1.AuthenticationError('You must be logged in as a user to request a visit');
            }
            try {
                // Validate input
                (0, Validator_1.validateRequestVisitInput)(input);
                const bookingModel = new Model_1.BookingModel(context.db);
                const bookingService = new Service_1.BookingService(bookingModel);
                return yield bookingService.requestVisit(input, context.user.id);
            }
            catch (error) {
                throw new apollo_server_express_1.UserInputError(error.message);
            }
        }),
        // Schedule a visit (vendor/admin only)
        scheduleVisit: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { input }, context) {
            if (!context.vendor && !context.Admin) {
                throw new apollo_server_express_1.AuthenticationError('You must be logged in as a vendor or admin to schedule a visit');
            }
            try {
                // Validate input
                (0, Validator_1.validateScheduleVisitInput)(input);
                const bookingModel = new Model_1.BookingModel(context.db);
                const bookingService = new Service_1.BookingService(bookingModel);
                if (context.Admin) {
                    // If admin, we need to get the booking first to find out the vendor
                    const booking = yield bookingService.getBookingById(input.bookingId, undefined, undefined, true);
                    return yield bookingService.scheduleVisit(input, booking.vendorId);
                }
                else if (context.vendor) {
                    return yield bookingService.scheduleVisit(input, context.vendor.id);
                }
                throw new apollo_server_express_1.ForbiddenError('Unauthorized');
            }
            catch (error) {
                throw new apollo_server_express_1.UserInputError(error.message);
            }
        }),
        // Complete a visit (vendor/admin only)
        completeVisit: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { bookingId }, context) {
            if (!context.vendor && !context.Admin) {
                throw new apollo_server_express_1.AuthenticationError('You must be logged in as a vendor or admin to complete a visit');
            }
            try {
                if (!bookingId) {
                    throw new apollo_server_express_1.UserInputError('Booking ID is required');
                }
                const bookingModel = new Model_1.BookingModel(context.db);
                const bookingService = new Service_1.BookingService(bookingModel);
                if (context.Admin) {
                    // If admin, we need to get the booking first to find out the vendor
                    const booking = yield bookingService.getBookingById(bookingId, undefined, undefined, true);
                    return yield bookingService.completeVisit(bookingId, booking.vendorId);
                }
                else if (context.vendor) {
                    return yield bookingService.completeVisit(bookingId, context.vendor.id);
                }
                throw new apollo_server_express_1.ForbiddenError('Unauthorized');
            }
            catch (error) {
                throw new apollo_server_express_1.UserInputError(error.message);
            }
        }),
        // Update payment (all roles)
        updatePayment: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { input }, context) {
            var _b, _c;
            if (!context.user && !context.vendor && !context.Admin) {
                throw new apollo_server_express_1.AuthenticationError('You must be logged in to update payment');
            }
            try {
                // Validate input
                (0, Validator_1.validateUpdatePaymentInput)(input);
                // Payment status validation if provided
                if (input.paymentStatus && !Object.values(Types_1.PaymentStatus).includes(input.paymentStatus)) {
                    throw new apollo_server_express_1.UserInputError('Invalid payment status');
                }
                const bookingModel = new Model_1.BookingModel(context.db);
                const bookingService = new Service_1.BookingService(bookingModel);
                return yield bookingService.updatePayment(input, (_b = context.user) === null || _b === void 0 ? void 0 : _b.id, (_c = context.vendor) === null || _c === void 0 ? void 0 : _c.id, !!context.Admin);
            }
            catch (error) {
                throw new apollo_server_express_1.UserInputError(error.message);
            }
        }),
        // Cancel booking (all roles)
        cancelBooking: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { input }, context) {
            var _b, _c;
            if (!context.user && !context.vendor && !context.Admin) {
                throw new apollo_server_express_1.AuthenticationError('You must be logged in to cancel a booking');
            }
            try {
                // Validate input
                (0, Validator_1.validateCancelBookingInput)(input);
                const bookingModel = new Model_1.BookingModel(context.db);
                const bookingService = new Service_1.BookingService(bookingModel);
                return yield bookingService.cancelBooking(input, (_b = context.user) === null || _b === void 0 ? void 0 : _b.id, (_c = context.vendor) === null || _c === void 0 ? void 0 : _c.id, !!context.Admin);
            }
            catch (error) {
                throw new apollo_server_express_1.UserInputError(error.message);
            }
        }),
    },
};
