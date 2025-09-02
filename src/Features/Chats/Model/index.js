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
exports.ChatModel = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const db_1 = require("../../../Config/db");
const Schema_1 = require("../../../Schema");
class ChatModel {
    // Basic Chat Operations
    static getAllChats(filter, limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            const senderUsers = (0, pg_core_1.alias)(Schema_1.users, 'sender_users');
            const senderVendors = (0, pg_core_1.alias)(Schema_1.vendors, 'sender_vendors');
            const receiverUsers = (0, pg_core_1.alias)(Schema_1.users, 'receiver_users');
            const receiverVendors = (0, pg_core_1.alias)(Schema_1.vendors, 'receiver_vendors');
            // Build conditions array
            const conditions = [];
            if (filter) {
                if (filter.status) {
                    conditions.push((0, drizzle_orm_1.eq)(Schema_1.chats.status, filter.status));
                }
                if (filter.messageType) {
                    conditions.push((0, drizzle_orm_1.eq)(Schema_1.chats.messageType, filter.messageType));
                }
                if (filter.serviceType) {
                    conditions.push((0, drizzle_orm_1.eq)(Schema_1.chats.serviceType, filter.serviceType));
                }
                if (filter.senderId) {
                    conditions.push((0, drizzle_orm_1.eq)(Schema_1.chats.senderId, filter.senderId));
                }
                if (filter.receiverId) {
                    conditions.push((0, drizzle_orm_1.eq)(Schema_1.chats.receiverId, filter.receiverId));
                }
                if (filter.dateFrom) {
                    conditions.push((0, drizzle_orm_1.gte)(Schema_1.chats.sentAt, filter.dateFrom));
                }
                if (filter.dateTo) {
                    conditions.push((0, drizzle_orm_1.lte)(Schema_1.chats.sentAt, filter.dateTo));
                }
            }
            // Create the base query builder
            const baseQuery = db_1.db.select({
                id: Schema_1.chats.id,
                bookingId: Schema_1.chats.bookingId,
                senderId: Schema_1.chats.senderId,
                receiverId: Schema_1.chats.receiverId,
                message: Schema_1.chats.message,
                messageType: Schema_1.chats.messageType,
                parentMessageId: Schema_1.chats.parentMessageId,
                attachmentUrl: Schema_1.chats.attachmentUrl,
                serviceType: Schema_1.chats.serviceType,
                venueId: Schema_1.chats.venueId,
                farmhouseId: Schema_1.chats.farmhouseId,
                cateringPackageId: Schema_1.chats.cateringPackageId,
                photographyPackageId: Schema_1.chats.photographyPackageId,
                serviceAdId: Schema_1.chats.serviceAdId,
                status: Schema_1.chats.status,
                sentAt: Schema_1.chats.sentAt,
                deliveredAt: Schema_1.chats.deliveredAt,
                readAt: Schema_1.chats.readAt,
                deletedAt: Schema_1.chats.deletedAt,
                // Sender details
                senderName: (0, drizzle_orm_1.sql) `CASE 
        WHEN sender_users.first_name IS NOT NULL THEN sender_users.first_name || ' ' || sender_users.last_name
        ELSE sender_vendors.vendor_name
      END`,
                senderType: (0, drizzle_orm_1.sql) `CASE 
        WHEN sender_users.id IS NOT NULL THEN 'user'
        ELSE 'vendor'
      END`,
                // Receiver details
                receiverName: (0, drizzle_orm_1.sql) `CASE 
        WHEN receiver_users.first_name IS NOT NULL THEN receiver_users.first_name || ' ' || receiver_users.last_name
        ELSE receiver_vendors.vendor_name
      END`,
                receiverType: (0, drizzle_orm_1.sql) `CASE 
        WHEN receiver_users.id IS NOT NULL THEN 'user'
        ELSE 'vendor'
      END`,
            })
                .from(Schema_1.chats)
                .leftJoin(senderUsers, (0, drizzle_orm_1.eq)(Schema_1.chats.senderId, senderUsers.id))
                .leftJoin(senderVendors, (0, drizzle_orm_1.eq)(Schema_1.chats.senderId, senderVendors.id))
                .leftJoin(receiverUsers, (0, drizzle_orm_1.eq)(Schema_1.chats.receiverId, receiverUsers.id))
                .leftJoin(receiverVendors, (0, drizzle_orm_1.eq)(Schema_1.chats.receiverId, receiverVendors.id))
                .$dynamic();
            // Apply where conditions if they exist
            if (conditions.length > 0) {
                baseQuery.where((0, drizzle_orm_1.and)(...conditions));
            }
            // Apply ordering and pagination
            baseQuery.orderBy((0, drizzle_orm_1.desc)(Schema_1.chats.sentAt));
            if (limit) {
                baseQuery.limit(limit);
            }
            if (offset) {
                baseQuery.offset(offset);
            }
            return yield baseQuery;
        });
    }
    static getChatById(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.db.select()
                .from(Schema_1.chats)
                .where((0, drizzle_orm_1.eq)(Schema_1.chats.id, chatId))
                .limit(1);
        });
    }
    static deleteChat(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.db.update(Schema_1.chats)
                .set({
                status: 'Deleted',
                deletedAt: new Date()
            })
                .where((0, drizzle_orm_1.eq)(Schema_1.chats.id, chatId))
                .returning();
        });
    }
    static bulkDeleteChats(chatIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.db.update(Schema_1.chats)
                .set({
                status: 'Deleted',
                deletedAt: new Date()
            })
                .where((0, drizzle_orm_1.sql) `id = ANY(${chatIds})`)
                .returning();
        });
    }
    // Service Inquiries Operations
    static getAllServiceInquiries(filter, limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            // Build conditions array
            const conditions = [];
            if (filter) {
                if (filter.status) {
                    conditions.push((0, drizzle_orm_1.eq)(Schema_1.serviceInquiries.status, filter.status));
                }
                if (filter.serviceType) {
                    conditions.push((0, drizzle_orm_1.eq)(Schema_1.serviceInquiries.serviceType, filter.serviceType));
                }
                if (filter.userId) {
                    conditions.push((0, drizzle_orm_1.eq)(Schema_1.serviceInquiries.userId, filter.userId));
                }
                if (filter.vendorId) {
                    conditions.push((0, drizzle_orm_1.eq)(Schema_1.serviceInquiries.vendorId, filter.vendorId));
                }
                if (filter.dateFrom) {
                    conditions.push((0, drizzle_orm_1.gte)(Schema_1.serviceInquiries.createdAt, filter.dateFrom));
                }
                if (filter.dateTo) {
                    conditions.push((0, drizzle_orm_1.lte)(Schema_1.serviceInquiries.createdAt, filter.dateTo));
                }
            }
            const baseQuery = db_1.db.select({
                id: Schema_1.serviceInquiries.id,
                chatId: Schema_1.serviceInquiries.chatId,
                userId: Schema_1.serviceInquiries.userId,
                vendorId: Schema_1.serviceInquiries.vendorId,
                serviceType: Schema_1.serviceInquiries.serviceType,
                serviceId: Schema_1.serviceInquiries.serviceId,
                inquiryText: Schema_1.serviceInquiries.inquiryText,
                status: Schema_1.serviceInquiries.status,
                convertedToBookingId: Schema_1.serviceInquiries.convertedToBookingId,
                createdAt: Schema_1.serviceInquiries.createdAt,
                updatedAt: Schema_1.serviceInquiries.updatedAt,
                closedAt: Schema_1.serviceInquiries.closedAt,
                // User details
                userName: (0, drizzle_orm_1.sql) `users.first_name || ' ' || users.last_name`,
                userEmail: Schema_1.users.email,
                // Vendor details
                vendorName: Schema_1.vendors.vendorName,
                vendorEmail: Schema_1.vendors.vendorEmail,
            })
                .from(Schema_1.serviceInquiries)
                .leftJoin(Schema_1.users, (0, drizzle_orm_1.eq)(Schema_1.serviceInquiries.userId, Schema_1.users.id))
                .leftJoin(Schema_1.vendors, (0, drizzle_orm_1.eq)(Schema_1.serviceInquiries.vendorId, Schema_1.vendors.id))
                .$dynamic();
            if (conditions.length > 0) {
                baseQuery.where((0, drizzle_orm_1.and)(...conditions));
            }
            baseQuery.orderBy((0, drizzle_orm_1.desc)(Schema_1.serviceInquiries.createdAt));
            if (limit) {
                baseQuery.limit(limit);
            }
            if (offset) {
                baseQuery.offset(offset);
            }
            return yield baseQuery;
        });
    }
    static updateServiceInquiryStatus(inquiryId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.db.update(Schema_1.serviceInquiries)
                .set(Object.assign({ status: status, updatedAt: new Date() }, (status === 'Closed' && { closedAt: new Date() })))
                .where((0, drizzle_orm_1.eq)(Schema_1.serviceInquiries.id, inquiryId))
                .returning();
        });
    }
    // Ad Inquiries Operations
    static getAllAdInquiries(filter, limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            // Build conditions array
            const conditions = [];
            if (filter) {
                if (filter.status) {
                    conditions.push((0, drizzle_orm_1.eq)(Schema_1.adInquiries.status, filter.status));
                }
                if (filter.userId) {
                    conditions.push((0, drizzle_orm_1.eq)(Schema_1.adInquiries.userId, filter.userId));
                }
                if (filter.vendorId) {
                    conditions.push((0, drizzle_orm_1.eq)(Schema_1.adInquiries.vendorId, filter.vendorId));
                }
                if (filter.dateFrom) {
                    conditions.push((0, drizzle_orm_1.gte)(Schema_1.adInquiries.createdAt, filter.dateFrom));
                }
                if (filter.dateTo) {
                    conditions.push((0, drizzle_orm_1.lte)(Schema_1.adInquiries.createdAt, filter.dateTo));
                }
            }
            const baseQuery = db_1.db.select({
                id: Schema_1.adInquiries.id,
                chatId: Schema_1.adInquiries.chatId,
                userId: Schema_1.adInquiries.userId,
                vendorId: Schema_1.adInquiries.vendorId,
                adId: Schema_1.adInquiries.adId,
                inquiryText: Schema_1.adInquiries.inquiryText,
                status: Schema_1.adInquiries.status,
                convertedToBookingId: Schema_1.adInquiries.convertedToBookingId,
                createdAt: Schema_1.adInquiries.createdAt,
                updatedAt: Schema_1.adInquiries.updatedAt,
                closedAt: Schema_1.adInquiries.closedAt,
                // User details
                userName: (0, drizzle_orm_1.sql) `users.first_name || ' ' || users.last_name`,
                userEmail: Schema_1.users.email,
                // Vendor details
                vendorName: Schema_1.vendors.vendorName,
                vendorEmail: Schema_1.vendors.vendorEmail,
            })
                .from(Schema_1.adInquiries)
                .leftJoin(Schema_1.users, (0, drizzle_orm_1.eq)(Schema_1.adInquiries.userId, Schema_1.users.id))
                .leftJoin(Schema_1.vendors, (0, drizzle_orm_1.eq)(Schema_1.adInquiries.vendorId, Schema_1.vendors.id))
                .$dynamic();
            if (conditions.length > 0) {
                baseQuery.where((0, drizzle_orm_1.and)(...conditions));
            }
            baseQuery.orderBy((0, drizzle_orm_1.desc)(Schema_1.adInquiries.createdAt));
            if (limit) {
                baseQuery.limit(limit);
            }
            if (offset) {
                baseQuery.offset(offset);
            }
            return yield baseQuery;
        });
    }
    static updateAdInquiryStatus(inquiryId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.db.update(Schema_1.adInquiries)
                .set(Object.assign({ status: status, updatedAt: new Date() }, (status === 'Closed' && { closedAt: new Date() })))
                .where((0, drizzle_orm_1.eq)(Schema_1.adInquiries.id, inquiryId))
                .returning();
        });
    }
    // Analytics and Statistics
    static getChatStatistics(dateFrom, dateTo) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const conditions = [];
            if (dateFrom) {
                conditions.push((0, drizzle_orm_1.gte)(Schema_1.chats.sentAt, dateFrom));
            }
            if (dateTo) {
                conditions.push((0, drizzle_orm_1.lte)(Schema_1.chats.sentAt, dateTo));
            }
            // Total messages
            const totalMessages = yield db_1.db.select({ count: (0, drizzle_orm_1.count)() })
                .from(Schema_1.chats)
                .where(conditions.length > 0 ? (0, drizzle_orm_1.and)(...conditions) : undefined);
            // Messages by type
            const messagesByType = yield db_1.db.select({
                messageType: Schema_1.chats.messageType,
                count: (0, drizzle_orm_1.count)()
            })
                .from(Schema_1.chats)
                .where(conditions.length > 0 ? (0, drizzle_orm_1.and)(...conditions) : undefined)
                .groupBy(Schema_1.chats.messageType);
            // Messages by status
            const messagesByStatus = yield db_1.db.select({
                status: Schema_1.chats.status,
                count: (0, drizzle_orm_1.count)()
            })
                .from(Schema_1.chats)
                .where(conditions.length > 0 ? (0, drizzle_orm_1.and)(...conditions) : undefined)
                .groupBy(Schema_1.chats.status);
            // Daily message count (last 30 days)
            const dailyMessages = yield db_1.db.select({
                date: (0, drizzle_orm_1.sql) `DATE(sent_at)`,
                count: (0, drizzle_orm_1.count)()
            })
                .from(Schema_1.chats)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.gte)(Schema_1.chats.sentAt, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)), ...(conditions.length > 0 ? conditions : [])))
                .groupBy((0, drizzle_orm_1.sql) `DATE(sent_at)`)
                .orderBy((0, drizzle_orm_1.sql) `DATE(sent_at)`);
            return {
                totalMessages: ((_a = totalMessages[0]) === null || _a === void 0 ? void 0 : _a.count) || 0,
                totalByType: messagesByType.reduce((acc, item) => {
                    acc[item.messageType || 'Unknown'] = item.count;
                    return acc;
                }, {}),
                totalByStatus: messagesByStatus.reduce((acc, item) => {
                    acc[item.status || 'Unknown'] = item.count;
                    return acc;
                }, {}),
                dailyMessageCount: dailyMessages.map(item => ({
                    date: item.date,
                    count: item.count
                }))
            };
        });
    }
    // Search functionality
    static searchChats(searchTerm_1) {
        return __awaiter(this, arguments, void 0, function* (searchTerm, limit = 20) {
            return yield db_1.db.select()
                .from(Schema_1.chats)
                .where((0, drizzle_orm_1.like)(Schema_1.chats.message, `%${searchTerm}%`))
                .orderBy((0, drizzle_orm_1.desc)(Schema_1.chats.sentAt))
                .limit(limit);
        });
    }
    static getConversation(userId1_1, userId2_1) {
        return __awaiter(this, arguments, void 0, function* (userId1, userId2, limit = 50) {
            return yield db_1.db.select()
                .from(Schema_1.chats)
                .where((0, drizzle_orm_1.or)((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.chats.senderId, userId1), (0, drizzle_orm_1.eq)(Schema_1.chats.receiverId, userId2)), (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.chats.senderId, userId2), (0, drizzle_orm_1.eq)(Schema_1.chats.receiverId, userId1))))
                .orderBy((0, drizzle_orm_1.desc)(Schema_1.chats.sentAt))
                .limit(limit);
        });
    }
}
exports.ChatModel = ChatModel;
