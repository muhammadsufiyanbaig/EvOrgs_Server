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
exports.customPhotographyResolver = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const Service_1 = require("../../Service");
exports.customPhotographyResolver = {
    Query: {
        // User Queries
        getUserCustomOrders: (_, __, context) => __awaiter(void 0, void 0, void 0, function* () {
            if (!context.user)
                throw new apollo_server_express_1.AuthenticationError('You must be logged in as a user');
            const orderService = new Service_1.customPhotographyService(context.db);
            return orderService.getUserOrders(context.user.id);
        }),
        // Vendor Queries
        getVendorCustomOrders: (_, __, context) => __awaiter(void 0, void 0, void 0, function* () {
            if (!context.vendor)
                throw new apollo_server_express_1.AuthenticationError('You must be logged in as a vendor');
            const orderService = new Service_1.customPhotographyService(context.db);
            return orderService.getVendorOrders(context.vendor.id);
        }),
        getCustomOrderById: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { orderId }, context) {
            var _b, _c;
            if (!context.user && !context.vendor) {
                throw new apollo_server_express_1.AuthenticationError('Authentication required');
            }
            const orderService = new Service_1.customPhotographyService(context.db);
            try {
                return yield orderService.getOrderById(orderId, (_b = context.user) === null || _b === void 0 ? void 0 : _b.id, (_c = context.vendor) === null || _c === void 0 ? void 0 : _c.id);
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new apollo_server_express_1.ForbiddenError(error.message);
                }
                throw new apollo_server_express_1.ForbiddenError('An unknown error occurred');
            }
        }),
        searchCustomOrders: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { input }, context) {
            if (!context.vendor)
                throw new apollo_server_express_1.AuthenticationError('You must be logged in as a vendor');
            const orderService = new Service_1.customPhotographyService(context.db);
            return orderService.searchOrders(input, context.vendor.id);
        }),
        // Admin Query: Get all custom orders with filters and pagination
        adminGetAllCustomOrders: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { filters }, context) {
            if (!context.Admin) {
                throw new apollo_server_express_1.AuthenticationError('Admin authentication required');
            }
            const orderService = new Service_1.customPhotographyService(context.db);
            return orderService.getAllOrdersForAdmin(filters);
        }),
        // Admin Query: Get a specific custom order by ID
        adminGetCustomOrder: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { orderId }, context) {
            if (!context.Admin) {
                throw new apollo_server_express_1.AuthenticationError('Admin authentication required');
            }
            const orderService = new Service_1.customPhotographyService(context.db);
            try {
                return yield orderService.getOrderByIdForAdmin(orderId);
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new apollo_server_express_1.ForbiddenError(error.message);
                }
                throw new apollo_server_express_1.ForbiddenError('An unknown error occurred');
            }
        }),
    },
    Mutation: {
        // User Mutations
        createCustomOrder: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { input }, context) {
            if (!context.user)
                throw new apollo_server_express_1.AuthenticationError('You must be logged in as a user');
            if (!input.orderDetails) {
                throw new apollo_server_express_1.UserInputError('Order details are required');
            }
            const orderService = new Service_1.customPhotographyService(context.db);
            return orderService.createCustomOrder(input, context.user.id);
        }),
        acceptCustomOrderQuote: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { orderId }, context) {
            if (!context.user)
                throw new apollo_server_express_1.AuthenticationError('You must be logged in as a user');
            const orderService = new Service_1.customPhotographyService(context.db);
            try {
                return yield orderService.acceptOrderQuote(orderId, context.user.id);
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new apollo_server_express_1.ForbiddenError(error.message);
                }
                throw new apollo_server_express_1.ForbiddenError('An unknown error occurred');
            }
        }),
        rejectCustomOrderQuote: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { orderId }, context) {
            if (!context.user)
                throw new apollo_server_express_1.AuthenticationError('You must be logged in as a user');
            const orderService = new Service_1.customPhotographyService(context.db);
            try {
                return yield orderService.rejectOrderQuote(orderId, context.user.id);
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new apollo_server_express_1.ForbiddenError(error.message);
                }
                throw new apollo_server_express_1.ForbiddenError('An unknown error occurred');
            }
        }),
        quoteCustomOrder: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { input }, context) {
            if (!context.vendor)
                throw new apollo_server_express_1.AuthenticationError('You must be logged in as a vendor');
            if (!input.price || input.price <= 0) {
                throw new apollo_server_express_1.UserInputError('Valid price is required');
            }
            const orderService = new Service_1.customPhotographyService(context.db);
            try {
                return yield orderService.quoteOrder(input, context.vendor.id);
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new apollo_server_express_1.ForbiddenError(error.message);
                }
                throw new apollo_server_express_1.ForbiddenError('An unknown error occurred');
            }
        }),
        // Admin Mutation: Update order status
        adminUpdateOrderStatus: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { orderId, status }, context) {
            if (!context.Admin) {
                throw new apollo_server_express_1.AuthenticationError('Admin authentication required');
            }
            const orderService = new Service_1.customPhotographyService(context.db);
            try {
                return yield orderService.updateOrderStatusByAdmin(orderId, status);
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new apollo_server_express_1.ForbiddenError(error.message);
                }
                throw new apollo_server_express_1.ForbiddenError('An unknown error occurred');
            }
        }),
        // Admin Mutation: Delete order
        adminDeleteOrder: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { orderId }, context) {
            if (!context.Admin) {
                throw new apollo_server_express_1.AuthenticationError('Admin authentication required');
            }
            const orderService = new Service_1.customPhotographyService(context.db);
            try {
                return yield orderService.deleteOrderByAdmin(orderId);
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new apollo_server_express_1.ForbiddenError(error.message);
                }
                throw new apollo_server_express_1.ForbiddenError('An unknown error occurred');
            }
        }),
    },
    CustomOrder: {
        // Resolve related user data
        user: (parent, _, context) => __awaiter(void 0, void 0, void 0, function* () {
            const orderService = new Service_1.customPhotographyService(context.db);
            return orderService.getUserForOrder(parent.userId);
        }),
        // Resolve related vendor data
        vendor: (parent, _, context) => __awaiter(void 0, void 0, void 0, function* () {
            const orderService = new Service_1.customPhotographyService(context.db);
            return orderService.getVendorForOrder(parent.vendorId);
        }),
    }
};
