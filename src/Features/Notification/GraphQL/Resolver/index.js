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
exports.notificationResolvers = void 0;
const Service_1 = require("../../Service");
exports.notificationResolvers = {
    Query: {
        getMyNotifications: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { filter, pagination }, context) {
            const service = new Service_1.NotificationService(context.db);
            return yield service.getMyNotifications(filter, pagination, context);
        }),
        getAllNotifications: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { filter, pagination }, context) {
            const service = new Service_1.NotificationService(context.db);
            return yield service.getAllNotifications(filter, pagination, context);
        }),
        getNotification: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            const service = new Service_1.NotificationService(context.db);
            return yield service.getNotification(id, context);
        }),
        getUnreadCount: (_, __, context) => __awaiter(void 0, void 0, void 0, function* () {
            const service = new Service_1.NotificationService(context.db);
            return yield service.getUnreadCount(context);
        }),
        getNotificationStats: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { dateFrom, dateTo }, context) {
            const service = new Service_1.NotificationService(context.db);
            return yield service.getNotificationStats(dateFrom, dateTo, context);
        })
    },
    Mutation: {
        createNotification: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { input }, context) {
            const service = new Service_1.NotificationService(context.db);
            return yield service.createNotification(input, context);
        }),
        sendNotification: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            const service = new Service_1.NotificationService(context.db);
            return yield service.sendNotification(id, context);
        }),
        markAsRead: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { notificationId }, context) {
            const service = new Service_1.NotificationService(context.db);
            return yield service.markAsRead(notificationId, context);
        }),
        markMultipleAsRead: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { notificationIds }, context) {
            const service = new Service_1.NotificationService(context.db);
            return yield service.markMultipleAsRead(notificationIds, context);
        }),
        markAllAsRead: (_, __, context) => __awaiter(void 0, void 0, void 0, function* () {
            const service = new Service_1.NotificationService(context.db);
            return yield service.markAllAsRead(context);
        }),
        updateFCMToken: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { input }, context) {
            const service = new Service_1.NotificationService(context.db);
            return yield service.updateFCMToken(input, context);
        }),
        sendTestNotification: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { title, message, targetUserId, targetVendorId }, context) {
            const service = new Service_1.NotificationService(context.db);
            return yield service.sendTestNotification(title, message, targetUserId, targetVendorId, context);
        })
    },
    Notification: {
        targetUser: (parent, _, context) => __awaiter(void 0, void 0, void 0, function* () {
            const service = new Service_1.NotificationService(context.db);
            return yield service.getTargetUser(parent);
        }),
        targetVendor: (parent, _, context) => __awaiter(void 0, void 0, void 0, function* () {
            const service = new Service_1.NotificationService(context.db);
            return yield service.getTargetVendor(parent);
        }),
        creator: (parent, _, context) => __awaiter(void 0, void 0, void 0, function* () {
            const service = new Service_1.NotificationService(context.db);
            return yield service.getCreator(parent);
        })
    }
};
