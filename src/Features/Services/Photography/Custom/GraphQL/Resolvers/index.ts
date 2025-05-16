// src/Features/Photography/Resolvers/index.ts
import { AuthenticationError, ForbiddenError, UserInputError } from 'apollo-server-express';
import { customPhotographyService } from '../../Service';
import { CreateCustomOrderInput, QuoteOrderInput, SearchOrdersInput } from '../../Types';
import { Context } from '../../../../../../GraphQL/Context';

export const customPhotographyResolver = {
    Query: {
        // User Queries
        getUserCustomOrders: async (_: any, __: any, context: Context) => {
            if (!context.user) throw new AuthenticationError('You must be logged in as a user');

            const orderService = new customPhotographyService(context.db);
            return orderService.getUserOrders(context.user.id);
        },

        // Vendor Queries
        getVendorCustomOrders: async (_: any, __: any, context: Context) => {
            if (!context.vendor) throw new AuthenticationError('You must be logged in as a vendor');

            const orderService = new customPhotographyService(context.db);
            return orderService.getVendorOrders(context.vendor.id);
        },

        getCustomOrderById: async (_: any, { orderId }: { orderId: string }, context: Context) => {
            if (!context.user && !context.vendor) {
                throw new AuthenticationError('Authentication required');
            }

            const orderService = new customPhotographyService(context.db);
            try {
                return await orderService.getOrderById(
                    orderId,
                    context.user?.id,
                    context.vendor?.id
                );
            } catch (error: unknown) {
                if (error instanceof Error) {
                    throw new ForbiddenError(error.message);
                }
                throw new ForbiddenError('An unknown error occurred');
            }
        },

        searchCustomOrders: async (_: any, { input }: { input: SearchOrdersInput }, context: Context) => {
            if (!context.vendor) throw new AuthenticationError('You must be logged in as a vendor');

            const orderService = new customPhotographyService(context.db);
            return orderService.searchOrders(input, context.vendor.id);
        },
    },

    Mutation: {
        // User Mutations
        createCustomOrder: async (_: any, { input }: { input: CreateCustomOrderInput }, context: Context) => {
            if (!context.user) throw new AuthenticationError('You must be logged in as a user');

            if (!input.orderDetails) {
                throw new UserInputError('Order details are required');
            }

            const orderService = new customPhotographyService(context.db);
            return orderService.createCustomOrder(input, context.user.id);
        },

        acceptCustomOrderQuote: async (_: any, { orderId }: { orderId: string }, context: Context) => {
            if (!context.user) throw new AuthenticationError('You must be logged in as a user');

            const orderService = new customPhotographyService(context.db);
            try {
                return await orderService.acceptOrderQuote(orderId, context.user.id);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    throw new ForbiddenError(error.message);
                }
                throw new ForbiddenError('An unknown error occurred');
            }
        },

        rejectCustomOrderQuote: async (_: any, { orderId }: { orderId: string }, context: Context) => {
            if (!context.user) throw new AuthenticationError('You must be logged in as a user');

            const orderService = new customPhotographyService(context.db);
            try {
                return await orderService.rejectOrderQuote(orderId, context.user.id);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    throw new ForbiddenError(error.message);
                }
                throw new ForbiddenError('An unknown error occurred');
            }
        },

        quoteCustomOrder: async (_: any, { input }: { input: QuoteOrderInput }, context: Context) => {
            if (!context.vendor) throw new AuthenticationError('You must be logged in as a vendor');

            if (!input.price || input.price <= 0) {
                throw new UserInputError('Valid price is required');
            }

            const orderService = new customPhotographyService(context.db);
            try {
                return await orderService.quoteOrder(input, context.vendor.id);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    throw new ForbiddenError(error.message);
                }
                throw new ForbiddenError('An unknown error occurred');
            }
        },
    },

    CustomOrder: {
        // Resolve related user data
        user: async (parent: { userId: string }, _: any, context: Context) => {
            const orderService = new customPhotographyService(context.db);
            return orderService.getUserForOrder(parent.userId);
        },

        // Resolve related vendor data
        vendor: async (parent: { vendorId: string }, _: any, context: Context) => {
            const orderService = new customPhotographyService(context.db);
            return orderService.getVendorForOrder(parent.vendorId);
        },
    }
};