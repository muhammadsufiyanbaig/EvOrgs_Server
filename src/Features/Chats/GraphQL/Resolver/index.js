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
exports.chatResolvers = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../../../../Config/db");
const Schema_1 = require("../../../../Schema");
const Service_1 = require("../../Service");
const graphql_type_json_1 = require("graphql-type-json");
exports.chatResolvers = {
    JSON: graphql_type_json_1.GraphQLJSON,
    Query: {
        // User-specific queries
        getUserChats: (_1, __1, _a) => __awaiter(void 0, [_1, __1, _a], void 0, function* (_, __, { user, vendor }) {
            if (!user || vendor)
                throw new Error('Unauthorized: Must be a user');
            return yield Service_1.ChatService.getUserChats(user.id);
        }),
        getUserServiceInquiries: (_1, __1, _a) => __awaiter(void 0, [_1, __1, _a], void 0, function* (_, __, { user, vendor }) {
            if (!user || vendor)
                throw new Error('Unauthorized: Must be a user');
            return yield Service_1.ChatService.getUserServiceInquiries(user.id);
        }),
        getUserAdInquiries: (_1, __1, _a) => __awaiter(void 0, [_1, __1, _a], void 0, function* (_, __, { user, vendor }) {
            if (!user || vendor)
                throw new Error('Unauthorized: Must be a user');
            return yield Service_1.ChatService.getUserAdInquiries(user.id);
        }),
        getUnreadMessageCount: (_1, __1, _a) => __awaiter(void 0, [_1, __1, _a], void 0, function* (_, __, { user, vendor }) {
            if (!user || vendor)
                throw new Error('Unauthorized: Must be a user');
            return yield Service_1.ChatService.getUnreadMessageCount(user.id);
        }),
        // Vendor-specific queries
        getVendorChats: (_1, __1, _a) => __awaiter(void 0, [_1, __1, _a], void 0, function* (_, __, { user, vendor }) {
            if (!vendor || user)
                throw new Error('Unauthorized: Must be a vendor');
            return yield Service_1.ChatService.getVendorChats(vendor.id);
        }),
        getVendorServiceInquiries: (_1, __1, _a) => __awaiter(void 0, [_1, __1, _a], void 0, function* (_, __, { user, vendor }) {
            if (!vendor || user)
                throw new Error('Unauthorized: Must be a vendor');
            return yield Service_1.ChatService.getVendorServiceInquiries(vendor.id);
        }),
        getVendorAdInquiries: (_1, __1, _a) => __awaiter(void 0, [_1, __1, _a], void 0, function* (_, __, { user, vendor }) {
            if (!vendor || user)
                throw new Error('Unauthorized: Must be a vendor');
            return yield Service_1.ChatService.getVendorAdInquiries(vendor.id);
        }),
        // Admin-specific queries
        getAllChats: (_1, _a, _b) => __awaiter(void 0, [_1, _a, _b], void 0, function* (_, { filter, pagination }, { Admin }) {
            if (!Admin)
                throw new Error('Unauthorized: Admin access required');
            const chatFilter = filter ? {
                status: filter.status,
                messageType: filter.messageType,
                serviceType: filter.serviceType,
                senderId: filter.senderId,
                receiverId: filter.receiverId,
                dateFrom: filter.dateFrom ? new Date(filter.dateFrom) : undefined,
                dateTo: filter.dateTo ? new Date(filter.dateTo) : undefined,
            } : undefined;
            return yield Service_1.ChatService.getAllChatsForAdmin(chatFilter, pagination);
        }),
        getAllServiceInquiries: (_1, _a, _b) => __awaiter(void 0, [_1, _a, _b], void 0, function* (_, { filter, pagination }, { Admin }) {
            if (!Admin)
                throw new Error('Unauthorized: Admin access required');
            const inquiryFilter = filter ? {
                status: filter.status,
                serviceType: filter.serviceType,
                userId: filter.userId,
                vendorId: filter.vendorId,
                dateFrom: filter.dateFrom ? new Date(filter.dateFrom) : undefined,
                dateTo: filter.dateTo ? new Date(filter.dateTo) : undefined,
            } : undefined;
            return yield Service_1.ChatService.getAllServiceInquiriesForAdmin(inquiryFilter, pagination);
        }),
        getAllAdInquiries: (_1, _a, _b) => __awaiter(void 0, [_1, _a, _b], void 0, function* (_, { filter, pagination }, { Admin }) {
            if (!Admin)
                throw new Error('Unauthorized: Admin access required');
            const inquiryFilter = filter ? {
                status: filter.status,
                userId: filter.userId,
                vendorId: filter.vendorId,
                dateFrom: filter.dateFrom ? new Date(filter.dateFrom) : undefined,
                dateTo: filter.dateTo ? new Date(filter.dateTo) : undefined,
            } : undefined;
            return yield Service_1.ChatService.getAllAdInquiriesForAdmin(inquiryFilter, pagination);
        }),
        // Admin analytics and reporting
        getChatStatistics: (_1, _a, _b) => __awaiter(void 0, [_1, _a, _b], void 0, function* (_, { dateFrom, dateTo }, { Admin }) {
            if (!Admin)
                throw new Error('Unauthorized: Admin access required');
            return yield Service_1.ChatService.getChatStatistics(dateFrom ? new Date(dateFrom) : undefined, dateTo ? new Date(dateTo) : undefined);
        }),
        generateChatReport: (_1, _a, _b) => __awaiter(void 0, [_1, _a, _b], void 0, function* (_, { dateFrom, dateTo }, { Admin }) {
            if (!Admin)
                throw new Error('Unauthorized: Admin access required');
            return yield Service_1.ChatService.generateChatReport(new Date(dateFrom), new Date(dateTo));
        }),
        // Admin search and monitoring
        searchChats: (_1, _a, _b) => __awaiter(void 0, [_1, _a, _b], void 0, function* (_, { searchTerm, limit }, { Admin }) {
            if (!Admin)
                throw new Error('Unauthorized: Admin access required');
            return yield Service_1.ChatService.searchChats(searchTerm, limit);
        }),
        getConversation: (_1, _a, _b) => __awaiter(void 0, [_1, _a, _b], void 0, function* (_, { userId1, userId2, limit }, { Admin }) {
            if (!Admin)
                throw new Error('Unauthorized: Admin access required');
            return yield Service_1.ChatService.getConversation(userId1, userId2, limit);
        }),
        getChatById: (_1, _a, _b) => __awaiter(void 0, [_1, _a, _b], void 0, function* (_, { chatId }, { Admin }) {
            if (!Admin)
                throw new Error('Unauthorized: Admin access required');
            const chat = yield db_1.db.select()
                .from(Schema_1.chats)
                .where((0, drizzle_orm_1.eq)(Schema_1.chats.id, chatId))
                .limit(1);
            return chat[0] || null;
        }),
        // Admin dashboard queries
        getRecentChats: (_1, _a, _b) => __awaiter(void 0, [_1, _a, _b], void 0, function* (_, { limit = 10 }, { Admin }) {
            if (!Admin)
                throw new Error('Unauthorized: Admin access required');
            return yield Service_1.ChatService.getAllChatsForAdmin(undefined, { limit, offset: 0 });
        }),
        getPendingInquiries: (_1, __1, _a) => __awaiter(void 0, [_1, __1, _a], void 0, function* (_, __, { Admin }) {
            if (!Admin)
                throw new Error('Unauthorized: Admin access required');
            return yield Service_1.ChatService.getAllServiceInquiriesForAdmin({ status: 'Open' });
        }),
        getFlaggedMessages: (_1, __1, _a) => __awaiter(void 0, [_1, __1, _a], void 0, function* (_, __, { Admin }) {
            if (!Admin)
                throw new Error('Unauthorized: Admin access required');
            // This would require a separate flagged messages system
            // For now, return deleted messages as an example
            return yield Service_1.ChatService.getAllChatsForAdmin({ status: 'Deleted' });
        }),
    },
    Mutation: {
        // User/Vendor mutations
        updateMessageStatus: (_1, _a, _b) => __awaiter(void 0, [_1, _a, _b], void 0, function* (_, { chatId, status }, { user, vendor }) {
            if (!user && !vendor)
                throw new Error('Unauthorized');
            const updated = yield Service_1.ChatService.updateMessageStatus(chatId, status);
            return updated[0];
        }),
        markConversationAsRead: (_1, _a, _b) => __awaiter(void 0, [_1, _a, _b], void 0, function* (_, { otherUserId }, { user, vendor }) {
            const currentUserId = (user === null || user === void 0 ? void 0 : user.id) || (vendor === null || vendor === void 0 ? void 0 : vendor.id);
            if (!currentUserId)
                throw new Error('Unauthorized');
            yield Service_1.ChatService.markConversationAsRead(currentUserId, otherUserId);
            return {
                success: true,
                message: 'Conversation marked as read',
                data: null
            };
        }),
        // Admin-specific mutations
        deleteChat: (_1, _a, _b) => __awaiter(void 0, [_1, _a, _b], void 0, function* (_, { chatId }, { Admin }) {
            if (!Admin)
                throw new Error('Unauthorized: Admin access required');
            const result = yield Service_1.ChatService.deleteChat(chatId);
            return {
                success: result.length > 0,
                message: result.length > 0 ? 'Chat deleted successfully' : 'Chat not found',
                data: result[0] || null
            };
        }),
        bulkDeleteChats: (_1, _a, _b) => __awaiter(void 0, [_1, _a, _b], void 0, function* (_, { chatIds }, { Admin }) {
            if (!Admin)
                throw new Error('Unauthorized: Admin access required');
            try {
                const result = yield Service_1.ChatService.bulkDeleteChats(chatIds);
                return {
                    success: true,
                    affectedCount: result.length,
                    message: `${result.length} chats deleted successfully`,
                    errors: []
                };
            }
            catch (error) {
                return {
                    success: false,
                    affectedCount: 0,
                    message: 'Failed to delete chats',
                    errors: [error instanceof Error ? error.message : 'Unknown error']
                };
            }
        }),
        // Inquiry management
        updateServiceInquiryStatus: (_1, _a, _b) => __awaiter(void 0, [_1, _a, _b], void 0, function* (_, { inquiryId, status }, { Admin, vendor }) {
            if (!Admin && !vendor)
                throw new Error('Unauthorized: Admin or vendor access required');
            const result = yield Service_1.ChatService.updateServiceInquiryStatus(inquiryId, status);
            return result[0];
        }),
        updateAdInquiryStatus: (_1, _a, _b) => __awaiter(void 0, [_1, _a, _b], void 0, function* (_, { inquiryId, status }, { Admin, vendor }) {
            if (!Admin && !vendor)
                throw new Error('Unauthorized: Admin or vendor access required');
            const result = yield Service_1.ChatService.updateAdInquiryStatus(inquiryId, status);
            return result[0];
        }),
        bulkUpdateInquiryStatus: (_1, _a, _b) => __awaiter(void 0, [_1, _a, _b], void 0, function* (_, { inquiryIds, status, type }, { Admin }) {
            if (!Admin)
                throw new Error('Unauthorized: Admin access required');
            try {
                yield Service_1.ChatService.bulkUpdateInquiryStatus(inquiryIds, status, type);
                return {
                    success: true,
                    affectedCount: inquiryIds.length,
                    message: `${inquiryIds.length} inquiries updated successfully`,
                    errors: []
                };
            }
            catch (error) {
                return {
                    success: false,
                    affectedCount: 0,
                    message: 'Failed to update inquiries',
                    errors: [error instanceof Error ? error.message : 'Unknown error']
                };
            }
        }),
        // Content moderation
        flagMessage: (_1, _a, _b) => __awaiter(void 0, [_1, _a, _b], void 0, function* (_, { chatId, reason }, { Admin }) {
            if (!Admin)
                throw new Error('Unauthorized: Admin access required');
            const result = yield Service_1.ChatService.flagMessage(chatId, reason, Admin.id);
            return {
                success: result.success,
                message: result.message,
                data: result
            };
        }),
        escalateConversation: (_1, _a, _b) => __awaiter(void 0, [_1, _a, _b], void 0, function* (_, { userId1, userId2, priority }, { Admin }) {
            if (!Admin)
                throw new Error('Unauthorized: Admin access required');
            const result = yield Service_1.ChatService.escalateConversation(userId1, userId2, priority, Admin.id);
            return {
                success: result.success,
                message: result.message,
                data: result
            };
        }),
        // Admin message management
        sendAdminMessage: (_1, _a, _b) => __awaiter(void 0, [_1, _a, _b], void 0, function* (_, { receiverId, message, messageType }, { Admin }) {
            if (!Admin)
                throw new Error('Unauthorized: Admin access required');
            const newMessage = yield Service_1.ChatService.createMessage({
                senderId: Admin.id,
                receiverId,
                message,
                messageType: messageType || 'Text'
            });
            return newMessage;
        }),
        broadcastMessage: (_1, _a, _b) => __awaiter(void 0, [_1, _a, _b], void 0, function* (_, { userIds, message, messageType }, { Admin }) {
            if (!Admin)
                throw new Error('Unauthorized: Admin access required');
            try {
                const promises = userIds.map((userId) => Service_1.ChatService.createMessage({
                    senderId: Admin.id,
                    receiverId: userId,
                    message,
                    messageType: messageType || 'Text'
                }));
                yield Promise.all(promises);
                return {
                    success: true,
                    affectedCount: userIds.length,
                    message: `Message broadcast to ${userIds.length} users`,
                    errors: []
                };
            }
            catch (error) {
                return {
                    success: false,
                    affectedCount: 0,
                    message: 'Failed to broadcast message',
                    errors: [error instanceof Error ? error.message : 'Unknown error']
                };
            }
        }),
    },
};
