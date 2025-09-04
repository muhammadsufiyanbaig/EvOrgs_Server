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
exports.customPhotographyService = void 0;
// src/Features/Photography/Services/customOrderService.ts
const drizzle_orm_1 = require("drizzle-orm");
const Schema_1 = require("../../../../../Schema");
const uuid_1 = require("uuid");
const model_1 = require("../model");
class customPhotographyService {
    constructor(db) {
        this.db = db;
    }
    createCustomOrder(input, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orderData = {
                    id: (0, uuid_1.v4)(),
                    userId,
                    vendorId: input.vendorId,
                    orderDetails: input.orderDetails,
                    eventDate: input.eventDate ? new Date(input.eventDate).toISOString() : null,
                    eventDuration: input.eventDuration || null,
                    price: '0.00',
                    status: 'Requested',
                };
                // const [newOrder] = await this.db
                //   .insert(photographyCustomOrders)
                //   .values(orderData)
                //   .returning();
                const modalClass = new model_1.PhotographyCustomOrderModel(this.db);
                const insertedOrder = yield modalClass.insertOrder(orderData);
                if (!insertedOrder) {
                    throw new Error('Failed to create order');
                }
                return insertedOrder;
            }
            catch (error) {
                console.error('Error creating custom order:', error);
                throw new Error('Failed to create custom order');
            }
        });
    }
    // Get all orders for specific user
    getUserOrders(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const modalClass = new model_1.PhotographyCustomOrderModel(this.db);
                const usersOrder = yield modalClass.findOrdersByUserId(userId);
                // const orders = await this.db
                if (!usersOrder) {
                    throw new Error('Failed to get user order');
                }
                return usersOrder;
            }
            catch (error) {
                console.error('Error fetching user orders:', error);
                throw new Error('Failed to fetch user orders');
            }
        });
    }
    // Get all orders for specific vendor
    getVendorOrders(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const modalClass = new model_1.PhotographyCustomOrderModel(this.db);
                const vendorsOrder = yield modalClass.findOrdersByVendorId(vendorId);
                // const orders = await this.db
                if (!vendorsOrder) {
                    throw new Error('Failed to get vendor order');
                }
                return vendorsOrder;
            }
            catch (error) {
                console.error('Error fetching vendor orders:', error);
                throw new Error('Failed to fetch vendor orders');
            }
        });
    }
    // Get order by ID (with authorization check)
    getOrderById(orderId, userId, vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const modalClass = new model_1.PhotographyCustomOrderModel(this.db);
                const order = yield modalClass.findOrderById(orderId);
                if (!order) {
                    throw new Error('Order not found');
                }
                // Check that the user or vendor requesting the order is associated with it
                if (userId && order.userId !== userId && vendorId && order.vendorId !== vendorId) {
                    throw new Error('Unauthorized to access this order');
                }
                return order;
            }
            catch (error) {
                console.error('Error fetching order by ID:', error);
                throw error;
            }
        });
    }
    // Quote an order (vendor)
    quoteOrder(input, vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const modelClass = new model_1.PhotographyCustomOrderModel(this.db);
                const order = yield modelClass.findQuotableOrder(input.orderId, vendorId);
                if (!order) {
                    throw new Error('Order not found or cannot be quoted');
                }
                const updatedOrder = yield modelClass.updateOrderPriceAndStatus(input.orderId, input.price.toString(), 'Quoted');
                return updatedOrder;
            }
            catch (error) {
                console.error('Error quoting order:', error);
                throw error;
            }
        });
    }
    // Accept order quote (user)
    acceptOrderQuote(orderId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const modelClass = new model_1.PhotographyCustomOrderModel(this.db);
                const order = yield modelClass.findOrderByIdAndUserWithStatus(orderId, userId, 'Quoted');
                if (!order) {
                    throw new Error('Order not found or cannot be accepted');
                }
                const updatedOrder = yield modelClass.updateOrderStatus(orderId, 'Accepted');
                return updatedOrder;
            }
            catch (error) {
                console.error('Error accepting order quote:', error);
                throw error;
            }
        });
    }
    // Reject order quote (user)
    rejectOrderQuote(orderId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const modelClass = new model_1.PhotographyCustomOrderModel(this.db);
                const order = yield modelClass.findOrderByIdAndUserWithStatus(orderId, userId, 'Quoted');
                if (!order) {
                    throw new Error('Order not found or cannot be rejected');
                }
                const updatedOrder = yield modelClass.updateOrderStatus(orderId, 'Rejected');
                return updatedOrder;
            }
            catch (error) {
                console.error('Error rejecting order quote:', error);
                throw error;
            }
        });
    }
    // Search orders (for vendors)
    searchOrders(input, vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Build all conditions first
                const conditions = [(0, drizzle_orm_1.eq)(Schema_1.photographyCustomOrders.vendorId, vendorId)];
                // Apply status filter if provided
                if (input.status) {
                    conditions.push((0, drizzle_orm_1.eq)(Schema_1.photographyCustomOrders.status, input.status));
                }
                // Apply date range filter if provided
                if (input.dateFrom && input.dateTo) {
                    const fromDate = new Date(input.dateFrom);
                    const toDate = new Date(input.dateTo);
                    conditions.push((0, drizzle_orm_1.between)(Schema_1.photographyCustomOrders.createdAt, fromDate, toDate));
                }
                // Apply search term if provided (search in order details)
                if (input.searchTerm) {
                    conditions.push((0, drizzle_orm_1.like)(Schema_1.photographyCustomOrders.orderDetails, `%${input.searchTerm}%`));
                }
                const modelClass = new model_1.PhotographyCustomOrderModel(this.db);
                const orders = yield modelClass.searchOrdersWithConditions(conditions);
                return orders;
            }
            catch (error) {
                console.error('Error searching orders:', error);
                throw new Error('Failed to search orders');
            }
        });
    }
    // Get user info for an order
    getUserForOrder(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const modelClass = new model_1.PhotographyCustomOrderModel(this.db);
                const user = yield modelClass.findUserById(userId);
                return user;
            }
            catch (error) {
                console.error('Error fetching user for order:', error);
                return null;
            }
        });
    }
    // Get vendor info for an order
    getVendorForOrder(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const modelClass = new model_1.PhotographyCustomOrderModel(this.db);
                const vendor = yield modelClass.findVendorById(vendorId);
                return vendor;
            }
            catch (error) {
                console.error('Error fetching vendor for order:', error);
                return null;
            }
        });
    }
    // Admin functionality - Get all orders with filters and pagination
    getAllOrdersForAdmin() {
        return __awaiter(this, arguments, void 0, function* (filters = {}) {
            // Input validation
            if (filters.minPrice !== undefined && filters.minPrice < 0) {
                throw new Error('Minimum price cannot be negative');
            }
            if (filters.maxPrice !== undefined && filters.maxPrice < 0) {
                throw new Error('Maximum price cannot be negative');
            }
            if (filters.minPrice !== undefined && filters.maxPrice !== undefined && filters.minPrice > filters.maxPrice) {
                throw new Error('Minimum price cannot be greater than maximum price');
            }
            if (filters.minDuration !== undefined && filters.minDuration < 0) {
                throw new Error('Minimum duration cannot be negative');
            }
            if (filters.maxDuration !== undefined && filters.maxDuration < 0) {
                throw new Error('Maximum duration cannot be negative');
            }
            if (filters.minDuration !== undefined && filters.maxDuration !== undefined && filters.minDuration > filters.maxDuration) {
                throw new Error('Minimum duration cannot be greater than maximum duration');
            }
            if (filters.startDate && filters.endDate) {
                const startDate = new Date(filters.startDate);
                const endDate = new Date(filters.endDate);
                if (startDate > endDate) {
                    throw new Error('Start date cannot be after end date');
                }
            }
            if (filters.page !== undefined && filters.page < 1) {
                throw new Error('Page number must be positive');
            }
            if (filters.limit !== undefined && (filters.limit < 1 || filters.limit > 100)) {
                throw new Error('Limit must be between 1 and 100');
            }
            try {
                const modelClass = new model_1.PhotographyCustomOrderModel(this.db);
                return yield modelClass.getAllOrdersForAdmin(filters);
            }
            catch (error) {
                console.error('Error fetching all orders for admin:', error);
                throw new Error('Failed to fetch orders');
            }
        });
    }
    // Admin functionality - Get a specific order by ID (no ownership check)
    getOrderByIdForAdmin(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const modelClass = new model_1.PhotographyCustomOrderModel(this.db);
                const order = yield modelClass.findOrderById(orderId);
                if (!order) {
                    throw new Error('Order not found');
                }
                return order;
            }
            catch (error) {
                console.error('Error fetching order by ID for admin:', error);
                throw error;
            }
        });
    }
    // Admin functionality - Update order status
    updateOrderStatusByAdmin(orderId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if order exists
                const modelClass = new model_1.PhotographyCustomOrderModel(this.db);
                const existingOrder = yield modelClass.findOrderById(orderId);
                if (!existingOrder) {
                    throw new Error('Order not found');
                }
                return yield modelClass.updateOrderStatusByAdmin(orderId, status);
            }
            catch (error) {
                console.error('Error updating order status by admin:', error);
                throw error;
            }
        });
    }
    // Admin functionality - Delete order
    deleteOrderByAdmin(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if order exists
                const modelClass = new model_1.PhotographyCustomOrderModel(this.db);
                const existingOrder = yield modelClass.findOrderById(orderId);
                if (!existingOrder) {
                    throw new Error('Order not found');
                }
                return yield modelClass.deleteOrderByAdmin(orderId);
            }
            catch (error) {
                console.error('Error deleting order by admin:', error);
                throw error;
            }
        });
    }
}
exports.customPhotographyService = customPhotographyService;
