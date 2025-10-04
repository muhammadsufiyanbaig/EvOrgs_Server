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
exports.PhotographyCustomOrderModel = void 0;
// src/Features/Photography/Models/PhotographyCustomOrderModel.ts
const drizzle_orm_1 = require("drizzle-orm");
const Schema_1 = require("../../../../../Schema");
// Helper function to convert database result to interface
function mapToCustomOrder(dbOrder) {
    return {
        id: dbOrder.id,
        vendorId: dbOrder.vendorId,
        userId: dbOrder.userId,
        orderDetails: dbOrder.orderDetails,
        eventDate: dbOrder.eventDate ? new Date(dbOrder.eventDate) : undefined,
        eventDuration: dbOrder.eventDuration || undefined,
        price: parseFloat(dbOrder.price),
        status: dbOrder.status || 'Requested',
        createdAt: dbOrder.createdAt || new Date(),
        updatedAt: dbOrder.updatedAt || new Date()
    };
}
class PhotographyCustomOrderModel {
    constructor(db) {
        this.db = db;
    }
    insertOrder(orderData) {
        return __awaiter(this, void 0, void 0, function* () {
            const [newOrder] = yield this.db
                .insert(Schema_1.photographyCustomOrders)
                .values(orderData)
                .returning();
            return newOrder;
        });
    }
    findOrdersByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const orders = yield this.db
                .select()
                .from(Schema_1.photographyCustomOrders)
                .where((0, drizzle_orm_1.eq)(Schema_1.photographyCustomOrders.userId, userId))
                .orderBy((0, drizzle_orm_1.desc)(Schema_1.photographyCustomOrders.createdAt));
            return orders;
        });
    }
    findOrdersByVendorId(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const orders = yield this.db
                .select()
                .from(Schema_1.photographyCustomOrders)
                .where((0, drizzle_orm_1.eq)(Schema_1.photographyCustomOrders.vendorId, vendorId))
                .orderBy((0, drizzle_orm_1.desc)(Schema_1.photographyCustomOrders.createdAt));
            return orders;
        });
    }
    findOrderById(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [order] = yield this.db
                .select()
                .from(Schema_1.photographyCustomOrders)
                .where((0, drizzle_orm_1.eq)(Schema_1.photographyCustomOrders.id, orderId))
                .limit(1);
            return order;
        });
    }
    findQuotableOrder(orderId, vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [order] = yield this.db
                .select()
                .from(Schema_1.photographyCustomOrders)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.photographyCustomOrders.id, orderId), (0, drizzle_orm_1.eq)(Schema_1.photographyCustomOrders.vendorId, vendorId), (0, drizzle_orm_1.eq)(Schema_1.photographyCustomOrders.status, 'Requested')))
                .limit(1);
            return order;
        });
    }
    findOrderByIdAndUserWithStatus(orderId, userId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const [order] = yield this.db
                .select()
                .from(Schema_1.photographyCustomOrders)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.photographyCustomOrders.id, orderId), (0, drizzle_orm_1.eq)(Schema_1.photographyCustomOrders.userId, userId), (0, drizzle_orm_1.eq)(Schema_1.photographyCustomOrders.status, status)))
                .limit(1);
            return order;
        });
    }
    /**
     * Update an order's price and status
     */
    updateOrderPriceAndStatus(orderId, price, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const [updatedOrder] = yield this.db
                .update(Schema_1.photographyCustomOrders)
                .set({
                price: price,
                status: status,
                updatedAt: new Date(),
            })
                .where((0, drizzle_orm_1.eq)(Schema_1.photographyCustomOrders.id, orderId))
                .returning();
            return updatedOrder;
        });
    }
    updateOrderStatus(orderId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const [updatedOrder] = yield this.db
                .update(Schema_1.photographyCustomOrders)
                .set({
                status: status,
                updatedAt: new Date(),
            })
                .where((0, drizzle_orm_1.eq)(Schema_1.photographyCustomOrders.id, orderId))
                .returning();
            return updatedOrder;
        });
    }
    searchOrdersWithConditions(conditions) {
        return __awaiter(this, void 0, void 0, function* () {
            const orders = yield this.db
                .select()
                .from(Schema_1.photographyCustomOrders)
                .where((0, drizzle_orm_1.and)(...conditions))
                .orderBy((0, drizzle_orm_1.desc)(Schema_1.photographyCustomOrders.createdAt));
            return orders;
        });
    }
    findUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [user] = yield this.db
                .select()
                .from(Schema_1.users)
                .where((0, drizzle_orm_1.eq)(Schema_1.users.id, userId))
                .limit(1);
            return user;
        });
    }
    findVendorById(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [vendor] = yield this.db
                .select()
                .from(Schema_1.vendors)
                .where((0, drizzle_orm_1.eq)(Schema_1.vendors.id, vendorId))
                .limit(1);
            return vendor;
        });
    }
    // Admin functionality - Get all orders with filters and pagination
    getAllOrdersForAdmin() {
        return __awaiter(this, arguments, void 0, function* (filters = {}) {
            const { vendorId, userId, status, minPrice, maxPrice, minDuration, maxDuration, startDate, endDate, searchTerm, page = 1, limit = 10, sortBy = 'created_at_desc' } = filters;
            const offset = (page - 1) * limit;
            // Build conditions array
            const conditions = [];
            if (vendorId) {
                conditions.push((0, drizzle_orm_1.eq)(Schema_1.photographyCustomOrders.vendorId, vendorId));
            }
            if (userId) {
                conditions.push((0, drizzle_orm_1.eq)(Schema_1.photographyCustomOrders.userId, userId));
            }
            if (status) {
                conditions.push((0, drizzle_orm_1.eq)(Schema_1.photographyCustomOrders.status, status));
            }
            if (minPrice !== undefined) {
                conditions.push((0, drizzle_orm_1.gte)(Schema_1.photographyCustomOrders.price, minPrice.toString()));
            }
            if (maxPrice !== undefined) {
                conditions.push((0, drizzle_orm_1.lte)(Schema_1.photographyCustomOrders.price, maxPrice.toString()));
            }
            if (minDuration !== undefined) {
                conditions.push((0, drizzle_orm_1.gte)(Schema_1.photographyCustomOrders.eventDuration, minDuration));
            }
            if (maxDuration !== undefined) {
                conditions.push((0, drizzle_orm_1.lte)(Schema_1.photographyCustomOrders.eventDuration, maxDuration));
            }
            if (startDate) {
                const start = new Date(startDate);
                conditions.push((0, drizzle_orm_1.gte)(Schema_1.photographyCustomOrders.eventDate, start.toISOString().split('T')[0]));
            }
            if (endDate) {
                const end = new Date(endDate);
                conditions.push((0, drizzle_orm_1.lte)(Schema_1.photographyCustomOrders.eventDate, end.toISOString().split('T')[0]));
            }
            if (searchTerm) {
                conditions.push((0, drizzle_orm_1.ilike)(Schema_1.photographyCustomOrders.orderDetails, `%${searchTerm}%`));
            }
            // Determine sort order
            let orderBy;
            switch (sortBy) {
                case 'price_asc':
                    orderBy = (0, drizzle_orm_1.asc)(Schema_1.photographyCustomOrders.price);
                    break;
                case 'price_desc':
                    orderBy = (0, drizzle_orm_1.desc)(Schema_1.photographyCustomOrders.price);
                    break;
                case 'event_date_asc':
                    orderBy = (0, drizzle_orm_1.asc)(Schema_1.photographyCustomOrders.eventDate);
                    break;
                case 'event_date_desc':
                    orderBy = (0, drizzle_orm_1.desc)(Schema_1.photographyCustomOrders.eventDate);
                    break;
                case 'duration_asc':
                    orderBy = (0, drizzle_orm_1.asc)(Schema_1.photographyCustomOrders.eventDuration);
                    break;
                case 'duration_desc':
                    orderBy = (0, drizzle_orm_1.desc)(Schema_1.photographyCustomOrders.eventDuration);
                    break;
                case 'created_at_asc':
                    orderBy = (0, drizzle_orm_1.asc)(Schema_1.photographyCustomOrders.createdAt);
                    break;
                case 'created_at_desc':
                default:
                    orderBy = (0, drizzle_orm_1.desc)(Schema_1.photographyCustomOrders.createdAt);
                    break;
            }
            // Get orders with pagination
            const ordersPromise = this.db.select()
                .from(Schema_1.photographyCustomOrders)
                .where(conditions.length ? (0, drizzle_orm_1.and)(...conditions) : undefined)
                .orderBy(orderBy)
                .limit(limit)
                .offset(offset);
            // Get total count
            const totalCountPromise = this.db.select({
                count: (0, drizzle_orm_1.sql) `cast(count(*) as integer)`
            })
                .from(Schema_1.photographyCustomOrders)
                .where(conditions.length ? (0, drizzle_orm_1.and)(...conditions) : undefined);
            // Execute both queries in parallel
            const [dbOrders, [{ count: total }]] = yield Promise.all([ordersPromise, totalCountPromise]);
            // Convert database results to interface format
            const orders = dbOrders.map(order => mapToCustomOrder(order));
            return {
                orders,
                total,
                page,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page < Math.ceil(total / limit),
                hasPreviousPage: page > 1
            };
        });
    }
    // Admin functionality - Update order status
    updateOrderStatusByAdmin(orderId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const [updatedOrder] = yield this.db
                .update(Schema_1.photographyCustomOrders)
                .set({
                status: status,
                updatedAt: new Date(),
            })
                .where((0, drizzle_orm_1.eq)(Schema_1.photographyCustomOrders.id, orderId))
                .returning();
            return updatedOrder;
        });
    }
    // Admin functionality - Delete order
    deleteOrderByAdmin(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db
                .delete(Schema_1.photographyCustomOrders)
                .where((0, drizzle_orm_1.eq)(Schema_1.photographyCustomOrders.id, orderId))
                .returning();
            return result.length > 0;
        });
    }
}
exports.PhotographyCustomOrderModel = PhotographyCustomOrderModel;
