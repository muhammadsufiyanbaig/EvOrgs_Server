// src/Features/Booking/Resolvers.ts

import { BookingService } from '../../Service';
import {
    BookingFiltersInput,
    CancelBookingInput,
    CreateBookingInput,
    RequestVisitInput,
    ScheduleVisitInput,
    UpdatePaymentInput,
    ServiceType,
    BookingStatus,
    PaymentStatus
} from '../../Types';
import { Context } from '../../../../GraphQL/Context';
import { AuthenticationError, ForbiddenError, UserInputError } from 'apollo-server-express';
import {
    validateBookingFiltersInput,
    validateCancelBookingInput,
    validateCreateBookingInput,
    validateRequestVisitInput,
    validateScheduleVisitInput,
    validateUpdatePaymentInput
} from '../../Validator';
import { BookingModel } from '../../Model';

export const BookingResolvers = {
    // Type resolvers for GraphQL union
    ServiceDetails: {
        __resolveType(obj: any) {
            if (obj.packageName && obj.duration) return 'PhotographyPackage';
            if (obj.packageName && !obj.duration) return 'CateringPackage';
            if (obj.perNightPrice) return 'FarmHouse';
            if (obj.minPersonLimit) return 'Venue';
            return null;
        },
    },

    // Query resolvers
    Query: {
        // Get a single booking by ID (accessible to the booking owner, vendor, or admin)
        booking: async (_: any, { id }: { id: string }, context: Context) => {
            if (!context.user && !context.vendor && !context.Admin) {
                throw new AuthenticationError('You must be logged in to view a booking');
            }

            try {
                const bookingModel = new BookingModel(context.db);
                const bookingService = new BookingService(bookingModel);

                return await bookingService.getBookingById(
                    id,
                    context.user?.id,
                    context.vendor?.id,
                    !!context.Admin
                );
            } catch (error: any) {
                throw new UserInputError(error.message);
            }
        },

        // Get bookings with filters (context dependent)
        bookings: async (_: any, { filters }: { filters: BookingFiltersInput }, context: Context) => {
            if (!context.user && !context.vendor && !context.Admin) {
                throw new AuthenticationError('You must be logged in to view bookings');
            }

            try {
                // Validate filters
                validateBookingFiltersInput(filters);

                const bookingModel = new BookingModel(context.db);
                const bookingService = new BookingService(bookingModel);

                // Route to appropriate service method based on context
                if (context.user) {
                    return await bookingService.getBookings(filters, context.user.id);
                } else if (context.vendor) {
                    return await bookingService.getBookings(filters, undefined, context.vendor.id);
                } else if (context.Admin) {
                    return await bookingService.getBookings(filters, undefined, undefined, true);
                }

                return [];
            } catch (error: any) {
                throw new UserInputError(error.message);
            }
        },

        // Get user's bookings (user only)
        myBookings: async (_: any, { filters }: { filters: BookingFiltersInput }, context: Context) => {
            if (!context.user) {
                throw new AuthenticationError('You must be logged in as a user to view your bookings');
            }

            try {
                // Validate filters
                validateBookingFiltersInput(filters);

                const bookingModel = new BookingModel(context.db);
                const bookingService = new BookingService(bookingModel);
                return await bookingService.getBookings(filters, context.user.id);
            } catch (error: any) {
                throw new UserInputError(error.message);
            }
        },

        // Get vendor's bookings (vendor only)
        vendorBookings: async (_: any, { filters }: { filters: BookingFiltersInput }, context: Context) => {
            if (!context.vendor) {
                throw new AuthenticationError('You must be logged in as a vendor to view your bookings');
            }

            try {
                // Validate filters
                validateBookingFiltersInput(filters);

                const bookingModel = new BookingModel(context.db);
                const bookingService = new BookingService(bookingModel);
                return await bookingService.getBookings(filters, undefined, context.vendor.id);
            } catch (error: any) {
                throw new UserInputError(error.message);
            }
        },

        // Get all bookings (admin only)
        allBookings: async (_: any, { filters }: { filters: BookingFiltersInput }, context: Context) => {
            if (!context.Admin) {
                throw new ForbiddenError('Admin access required');
            }

            try {
                // Validate filters
                validateBookingFiltersInput(filters);

                const bookingModel = new BookingModel(context.db);
                const bookingService = new BookingService(bookingModel);
                return await bookingService.getBookings(filters, undefined, undefined, true);
            } catch (error: any) {
                throw new UserInputError(error.message);
            }
        },
    },

    // Mutation resolvers
    Mutation: {
        // Create a new booking (user only)
        createBooking: async (_: any, { input }: { input: CreateBookingInput }, context: Context) => {
            if (!context.user) {
                throw new AuthenticationError('You must be logged in as a user to create a booking');
            }

            try {
                // Validate input
                validateCreateBookingInput(input);

                // Service type validation
                if (!Object.values(ServiceType).includes(input.serviceType as ServiceType)) {
                    throw new UserInputError('Invalid service type');
                }

                const bookingModel = new BookingModel(context.db);
                const bookingService = new BookingService(bookingModel);
                return await bookingService.createBooking(input, context.user.id);
            } catch (error: any) {
                throw new UserInputError(error.message);
            }
        },

        // Request a visit (user only)
        requestVisit: async (_: any, { input }: { input: RequestVisitInput }, context: Context) => {
            if (!context.user) {
                throw new AuthenticationError('You must be logged in as a user to request a visit');
            }

            try {
                // Validate input
                validateRequestVisitInput(input);

                const bookingModel = new BookingModel(context.db);
                const bookingService = new BookingService(bookingModel);
                return await bookingService.requestVisit(input, context.user.id);
            } catch (error: any) {
                throw new UserInputError(error.message);
            }
        },

        // Schedule a visit (vendor/admin only)
        scheduleVisit: async (_: any, { input }: { input: ScheduleVisitInput }, context: Context) => {
            if (!context.vendor && !context.Admin) {
                throw new AuthenticationError('You must be logged in as a vendor or admin to schedule a visit');
            }

            try {
                // Validate input
                validateScheduleVisitInput(input);

                const bookingModel = new BookingModel(context.db);
                const bookingService = new BookingService(bookingModel);

                if (context.Admin) {
                    // If admin, we need to get the booking first to find out the vendor
                    const booking = await bookingService.getBookingById(input.bookingId, undefined, undefined, true);
                    return await bookingService.scheduleVisit(input, booking.vendorId);
                } else if (context.vendor) {
                    return await bookingService.scheduleVisit(input, context.vendor.id);
                }

                throw new ForbiddenError('Unauthorized');
            } catch (error: any) {
                throw new UserInputError(error.message);
            }
        },

        // Complete a visit (vendor/admin only)
        completeVisit: async (_: any, { bookingId }: { bookingId: string }, context: Context) => {
            if (!context.vendor && !context.Admin) {
                throw new AuthenticationError('You must be logged in as a vendor or admin to complete a visit');
            }

            try {
                if (!bookingId) {
                    throw new UserInputError('Booking ID is required');
                }

                const bookingModel = new BookingModel(context.db);
                const bookingService = new BookingService(bookingModel);

                if (context.Admin) {
                    // If admin, we need to get the booking first to find out the vendor
                    const booking = await bookingService.getBookingById(bookingId, undefined, undefined, true);
                    return await bookingService.completeVisit(bookingId, booking.vendorId);
                } else if (context.vendor) {
                    return await bookingService.completeVisit(bookingId, context.vendor.id);
                }

                throw new ForbiddenError('Unauthorized');
            } catch (error: any) {
                throw new UserInputError(error.message);
            }
        },

        // Update payment (all roles)
        updatePayment: async (_: any, { input }: { input: UpdatePaymentInput }, context: Context) => {
            if (!context.user && !context.vendor && !context.Admin) {
                throw new AuthenticationError('You must be logged in to update payment');
            }

            try {
                // Validate input
                validateUpdatePaymentInput(input);

                // Payment status validation if provided
                if (input.paymentStatus && !Object.values(PaymentStatus).includes(input.paymentStatus as PaymentStatus)) {
                    throw new UserInputError('Invalid payment status');
                }

                const bookingModel = new BookingModel(context.db);
                const bookingService = new BookingService(bookingModel);

                return await bookingService.updatePayment(
                    input,
                    context.user?.id,
                    context.vendor?.id,
                    !!context.Admin
                );
            } catch (error: any) {
                throw new UserInputError(error.message);
            }
        },

        // Cancel booking (all roles)
        cancelBooking: async (_: any, { input }: { input: CancelBookingInput }, context: Context) => {
            if (!context.user && !context.vendor && !context.Admin) {
                throw new AuthenticationError('You must be logged in to cancel a booking');
            }

            try {
                // Validate input
                validateCancelBookingInput(input);

                const bookingModel = new BookingModel(context.db);
                const bookingService = new BookingService(bookingModel);

                return await bookingService.cancelBooking(
                    input,
                    context.user?.id,
                    context.vendor?.id,
                    !!context.Admin
                );
            } catch (error: any) {
                throw new UserInputError(error.message);
            }
        },
    },
};