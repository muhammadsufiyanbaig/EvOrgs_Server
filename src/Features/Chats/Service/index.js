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
exports.ChatService = void 0;
const Model_1 = require("../Model");
const db_1 = require("../../../Config/db");
const Schema_1 = require("../../../Schema");
const drizzle_orm_1 = require("drizzle-orm");
const uuid_1 = require("uuid");
class ChatService {
    // Core Chat Operations
    static createMessage(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const messageId = (0, uuid_1.v4)();
            const messageData = {
                id: messageId,
                senderId: input.senderId,
                receiverId: input.receiverId,
                message: input.message,
                messageType: input.messageType || 'Text',
                bookingId: input.bookingId,
                serviceType: input.serviceType,
                parentMessageId: input.parentMessageId,
                attachmentUrl: input.attachmentUrl,
                status: 'Sent',
                sentAt: new Date(),
            };
            // Add service-specific fields
            if (input.serviceType && input.serviceId) {
                switch (input.serviceType) {
                    case 'Venue':
                        messageData.venueId = input.serviceId;
                        break;
                    case 'Farmhouse':
                        messageData.farmhouseId = input.serviceId;
                        break;
                    case 'CateringPackage':
                        messageData.cateringPackageId = input.serviceId;
                        break;
                    case 'PhotographyPackage':
                        messageData.photographyPackageId = input.serviceId;
                        break;
                    case 'Advertisement':
                        messageData.serviceAdId = input.serviceId;
                        break;
                }
            }
            const result = yield db_1.db.insert(Schema_1.chats).values(messageData).returning();
            return result[0];
        });
    }
    static updateMessageStatus(chatId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateData = { status };
            if (status === 'Delivered') {
                updateData.deliveredAt = new Date();
            }
            else if (status === 'Read') {
                updateData.readAt = new Date();
            }
            else if (status === 'Deleted') {
                updateData.deletedAt = new Date();
            }
            return yield db_1.db.update(Schema_1.chats)
                .set(updateData)
                .where((0, drizzle_orm_1.eq)(Schema_1.chats.id, chatId))
                .returning();
        });
    }
    // Admin-specific operations
    static getAllChatsForAdmin(filter, pagination) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Model_1.ChatModel.getAllChats(filter, pagination === null || pagination === void 0 ? void 0 : pagination.limit, pagination === null || pagination === void 0 ? void 0 : pagination.offset);
        });
    }
    static getAllServiceInquiriesForAdmin(filter, pagination) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Model_1.ChatModel.getAllServiceInquiries(filter, pagination === null || pagination === void 0 ? void 0 : pagination.limit, pagination === null || pagination === void 0 ? void 0 : pagination.offset);
        });
    }
    static getAllAdInquiriesForAdmin(filter, pagination) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Model_1.ChatModel.getAllAdInquiries(filter, pagination === null || pagination === void 0 ? void 0 : pagination.limit, pagination === null || pagination === void 0 ? void 0 : pagination.offset);
        });
    }
    static getChatStatistics(dateFrom, dateTo) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Model_1.ChatModel.getChatStatistics(dateFrom, dateTo);
        });
    }
    static searchChats(searchTerm_1) {
        return __awaiter(this, arguments, void 0, function* (searchTerm, limit = 20) {
            return yield Model_1.ChatModel.searchChats(searchTerm, limit);
        });
    }
    static getConversation(userId1_1, userId2_1) {
        return __awaiter(this, arguments, void 0, function* (userId1, userId2, limit = 50) {
            return yield Model_1.ChatModel.getConversation(userId1, userId2, limit);
        });
    }
    static deleteChat(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Model_1.ChatModel.deleteChat(chatId);
        });
    }
    static bulkDeleteChats(chatIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Model_1.ChatModel.bulkDeleteChats(chatIds);
        });
    }
    // Service Inquiry Management
    static updateServiceInquiryStatus(inquiryId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Model_1.ChatModel.updateServiceInquiryStatus(inquiryId, status);
        });
    }
    static updateAdInquiryStatus(inquiryId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Model_1.ChatModel.updateAdInquiryStatus(inquiryId, status);
        });
    }
    static bulkUpdateInquiryStatus(inquiryIds, status, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const promises = inquiryIds.map(id => type === 'service'
                ? Model_1.ChatModel.updateServiceInquiryStatus(id, status)
                : Model_1.ChatModel.updateAdInquiryStatus(id, status));
            return yield Promise.all(promises);
        });
    }
    // Content Moderation
    static flagMessage(chatId, reason, flaggedBy) {
        return __awaiter(this, void 0, void 0, function* () {
            // This would typically create a moderation record
            // For now, we'll update the message status to indicate it's flagged
            const message = yield Model_1.ChatModel.getChatById(chatId);
            if (!message.length) {
                throw new Error('Message not found');
            }
            // In a real implementation, you'd create a separate moderation table
            console.log(`Message ${chatId} flagged by ${flaggedBy} for: ${reason}`);
            return {
                success: true,
                message: 'Message flagged for review',
                flaggedAt: new Date(),
                reason
            };
        });
    }
    static escalateConversation(userId1, userId2, priority, escalatedBy) {
        return __awaiter(this, void 0, void 0, function* () {
            const conversation = yield this.getConversation(userId1, userId2);
            // In a real implementation, you'd create an escalation record
            console.log(`Conversation between ${userId1} and ${userId2} escalated by ${escalatedBy} with priority: ${priority}`);
            return {
                success: true,
                message: 'Conversation escalated to support team',
                escalatedAt: new Date(),
                priority,
                conversationLength: conversation.length
            };
        });
    }
    // Analytics and Reporting
    static generateChatReport(dateFrom, dateTo) {
        return __awaiter(this, void 0, void 0, function* () {
            const stats = yield this.getChatStatistics(dateFrom, dateTo);
            const serviceInquiries = yield Model_1.ChatModel.getAllServiceInquiries({ dateFrom, dateTo });
            const adInquiries = yield Model_1.ChatModel.getAllAdInquiries({ dateFrom, dateTo });
            return {
                period: { from: dateFrom, to: dateTo },
                chatStatistics: stats,
                inquiries: {
                    service: {
                        total: serviceInquiries.length,
                        byStatus: serviceInquiries.reduce((acc, inquiry) => {
                            const status = inquiry.status || 'Unknown';
                            acc[status] = (acc[status] || 0) + 1;
                            return acc;
                        }, {}),
                        byServiceType: serviceInquiries.reduce((acc, inquiry) => {
                            const serviceType = inquiry.serviceType || 'Unknown';
                            acc[serviceType] = (acc[serviceType] || 0) + 1;
                            return acc;
                        }, {})
                    },
                    advertisement: {
                        total: adInquiries.length,
                        byStatus: adInquiries.reduce((acc, inquiry) => {
                            const status = inquiry.status || 'Unknown';
                            acc[status] = (acc[status] || 0) + 1;
                            return acc;
                        }, {})
                    }
                },
                generatedAt: new Date()
            };
        });
    }
    // User and Vendor specific operations
    static getUserChats(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Model_1.ChatModel.getAllChats({
                senderId: userId
            });
        });
    }
    static getVendorChats(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Model_1.ChatModel.getAllChats({
                senderId: vendorId
            });
        });
    }
    static getUserServiceInquiries(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Model_1.ChatModel.getAllServiceInquiries({ userId });
        });
    }
    static getVendorServiceInquiries(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Model_1.ChatModel.getAllServiceInquiries({ vendorId });
        });
    }
    static getUserAdInquiries(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Model_1.ChatModel.getAllAdInquiries({ userId });
        });
    }
    static getVendorAdInquiries(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Model_1.ChatModel.getAllAdInquiries({ vendorId });
        });
    }
    // Real-time notification helpers
    static getUnreadMessageCount(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const messages = yield Model_1.ChatModel.getAllChats({
                receiverId: userId
            });
            return messages.filter(msg => msg.status !== 'Read').length;
        });
    }
    static markConversationAsRead(userId1, userId2) {
        return __awaiter(this, void 0, void 0, function* () {
            const conversation = yield Model_1.ChatModel.getConversation(userId1, userId2);
            const unreadMessages = conversation.filter(msg => msg.receiverId === userId1 && msg.status !== 'Read');
            const promises = unreadMessages.map(msg => this.updateMessageStatus(msg.id, 'Read'));
            return yield Promise.all(promises);
        });
    }
}
exports.ChatService = ChatService;
