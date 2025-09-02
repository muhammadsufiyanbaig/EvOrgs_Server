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
exports.NotificationService = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const Model_1 = require("../Model");
const PushNotification_1 = require("../PushNotification");
const Utils_1 = require("../Utils");
class NotificationService {
    getCreator(parent) {
        throw new Error('Method not implemented.');
    }
    getTargetVendor(parent) {
        throw new Error('Method not implemented.');
    }
    getTargetUser(parent) {
        throw new Error('Method not implemented.');
    }
    constructor(db) {
        this.model = new Model_1.NotificationModel(db);
    }
    getMyNotifications(filter, pagination, context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!context.user && !context.vendor && !context.Admin) {
                throw new apollo_server_express_1.AuthenticationError('Authentication required');
            }
            return yield this.model.getNotifications(filter, pagination, context);
        });
    }
    getAllNotifications(filter, pagination, context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!context.Admin) {
                throw new apollo_server_express_1.ForbiddenError('Admin access required');
            }
            return yield this.model.getAllNotifications(filter, pagination);
        });
    }
    getNotification(id, context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!context.user && !context.vendor && !context.Admin) {
                throw new apollo_server_express_1.AuthenticationError('Authentication required');
            }
            const notification = yield this.model.getNotification(id);
            if (!notification) {
                throw new apollo_server_express_1.UserInputError('Notification not found');
            }
            let hasAccess = false;
            if (context.Admin) {
                hasAccess = true;
            }
            else if (context.user) {
                hasAccess = (notification.notificationType === 'General' ||
                    notification.notificationType === 'All Users' ||
                    (notification.notificationType === 'User Personal' && notification.targetUserId === context.user.id));
            }
            else if (context.vendor) {
                hasAccess = (notification.notificationType === 'General' ||
                    notification.notificationType === 'All Vendors' ||
                    (notification.notificationType === 'Vendor Personal' && notification.targetVendorId === context.vendor.id));
            }
            if (!hasAccess) {
                throw new apollo_server_express_1.ForbiddenError('Access denied');
            }
            return notification;
        });
    }
    getUnreadCount(context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!context.user && !context.vendor && !context.Admin) {
                throw new apollo_server_express_1.AuthenticationError('Authentication required');
            }
            return yield this.model.getUnreadCount(context);
        });
    }
    getNotificationStats(dateFrom, dateTo, context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!context.Admin) {
                throw new apollo_server_express_1.ForbiddenError('Admin access required');
            }
            return yield this.model.getNotificationStats(dateFrom, dateTo);
        });
    }
    createNotification(input, context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!context.Admin) {
                throw new apollo_server_express_1.ForbiddenError('Admin access required');
            }
            if (input.notificationType === 'User Personal' && !input.targetUserId) {
                throw new apollo_server_express_1.UserInputError('targetUserId is required for User Personal notifications');
            }
            if (input.notificationType === 'Vendor Personal' && !input.targetVendorId) {
                throw new apollo_server_express_1.UserInputError('targetVendorId is required for Vendor Personal notifications');
            }
            if (input.targetUserId) {
                const userExists = yield this.model.getUser(input.targetUserId);
                if (!userExists) {
                    throw new apollo_server_express_1.UserInputError('Target user not found');
                }
            }
            if (input.targetVendorId) {
                const vendorExists = yield this.model.getVendor(input.targetVendorId);
                if (!vendorExists) {
                    throw new apollo_server_express_1.UserInputError('Target vendor not found');
                }
            }
            const notification = yield this.model.createNotification(input, context.Admin.id);
            if (!input.scheduledAt) {
                yield this.sendNotificationToRecipients(notification);
            }
            yield Utils_1.NotificationBroadcaster.broadcastNotificationCreated(notification);
            return notification;
        });
    }
    sendNotification(id, context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!context.Admin) {
                throw new apollo_server_express_1.ForbiddenError('Admin access required');
            }
            const notification = yield this.model.getNotification(id);
            if (!notification) {
                throw new apollo_server_express_1.UserInputError('Notification not found');
            }
            const result = yield this.sendNotificationToRecipients(notification);
            yield this.model.updateNotificationSendStatus(id, result);
            return result;
        });
    }
    markAsRead(notificationId, context) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            if (!context.user && !context.vendor && !context.Admin) {
                throw new apollo_server_express_1.AuthenticationError('Authentication required');
            }
            const notification = yield this.model.getNotification(notificationId);
            if (!notification) {
                throw new apollo_server_express_1.UserInputError('Notification not found');
            }
            const result = yield this.model.markAsRead(notificationId, context);
            yield Utils_1.NotificationBroadcaster.broadcastReadStatus({
                notificationId,
                userId: (_a = context.user) === null || _a === void 0 ? void 0 : _a.id,
                vendorId: (_b = context.vendor) === null || _b === void 0 ? void 0 : _b.id,
                adminId: (_c = context.Admin) === null || _c === void 0 ? void 0 : _c.id,
                readAt: new Date()
            });
            return result;
        });
    }
    markMultipleAsRead(notificationIds, context) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            if (!context.user && !context.vendor && !context.Admin) {
                throw new apollo_server_express_1.AuthenticationError('Authentication required');
            }
            const result = yield this.model.markMultipleAsRead(notificationIds, context);
            for (const notificationId of notificationIds) {
                yield Utils_1.NotificationBroadcaster.broadcastReadStatus({
                    notificationId,
                    userId: (_a = context.user) === null || _a === void 0 ? void 0 : _a.id,
                    vendorId: (_b = context.vendor) === null || _b === void 0 ? void 0 : _b.id,
                    adminId: (_c = context.Admin) === null || _c === void 0 ? void 0 : _c.id,
                    readAt: new Date()
                });
            }
            return result;
        });
    }
    markAllAsRead(context) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            if (!context.user && !context.vendor && !context.Admin) {
                throw new apollo_server_express_1.AuthenticationError('Authentication required');
            }
            const result = yield this.model.markAllAsRead(context);
            const notificationIds = (yield this.model.getNotifications(undefined, undefined, context))
                .notifications.map((n) => n.id);
            yield Utils_1.NotificationBroadcaster.broadcastReadStatus({
                bulkRead: true,
                notificationIds,
                userId: (_a = context.user) === null || _a === void 0 ? void 0 : _a.id,
                vendorId: (_b = context.vendor) === null || _b === void 0 ? void 0 : _b.id,
                adminId: (_c = context.Admin) === null || _c === void 0 ? void 0 : _c.id,
                readAt: new Date()
            });
            return result;
        });
    }
    updateFCMToken(input, context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!context.user && !context.vendor) {
                throw new apollo_server_express_1.AuthenticationError('Authentication required');
            }
            if (input.userId && context.user && input.userId !== context.user.id) {
                throw new apollo_server_express_1.ForbiddenError('Cannot update token for another user');
            }
            if (input.vendorId && context.vendor && input.vendorId !== context.vendor.id) {
                throw new apollo_server_express_1.ForbiddenError('Cannot update token for another vendor');
            }
            return yield this.model.updateFCMToken(input, context);
        });
    }
    sendTestNotification(title, message, targetUserId, targetVendorId, context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!context.Admin) {
                throw new apollo_server_express_1.ForbiddenError('Admin access required');
            }
            const tokens = yield this.model.getTestNotificationTokens(targetUserId, targetVendorId);
            if (tokens.length === 0) {
                return {
                    success: false,
                    message: 'No FCM tokens found for target recipients',
                    successCount: 0,
                    failureCount: 0
                };
            }
            const payload = PushNotification_1.fcmService.createPayload(title, message, 'medium');
            return yield PushNotification_1.fcmService.sendToMultipleDevices(tokens, payload);
        });
    }
    sendNotificationToRecipients(notification) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokens = yield this.model.getRecipientTokens(notification);
            if (tokens.length === 0) {
                return {
                    success: false,
                    message: 'No FCM tokens found for recipients',
                    successCount: 0,
                    failureCount: 0
                };
            }
            const payload = PushNotification_1.fcmService.createPayload(notification.title, notification.message, notification.priority, notification.data, notification.linkTo);
            return yield PushNotification_1.fcmService.sendToMultipleDevices(tokens, payload);
        });
    }
}
exports.NotificationService = NotificationService;
