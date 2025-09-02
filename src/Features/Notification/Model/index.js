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
exports.NotificationModel = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const Schema_1 = require("../../../Schema");
const uuid_1 = require("uuid");
class NotificationModel {
    constructor(db) {
        this.db = db;
    }
    getNotifications(filter, pagination, context) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            const { user, vendor, Admin } = context;
            const page = (_a = pagination === null || pagination === void 0 ? void 0 : pagination.page) !== null && _a !== void 0 ? _a : 1;
            const limit = Math.min((_b = pagination === null || pagination === void 0 ? void 0 : pagination.limit) !== null && _b !== void 0 ? _b : 10, 100);
            const offset = (page - 1) * limit;
            const whereConditions = [];
            if (user) {
                whereConditions.push((0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(Schema_1.notifications.notificationType, 'General'), (0, drizzle_orm_1.eq)(Schema_1.notifications.notificationType, 'All Users'), (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.notifications.notificationType, 'User Personal'), (0, drizzle_orm_1.eq)(Schema_1.notifications.targetUserId, user.id))));
            }
            else if (vendor) {
                whereConditions.push((0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(Schema_1.notifications.notificationType, 'General'), (0, drizzle_orm_1.eq)(Schema_1.notifications.notificationType, 'All Vendors'), (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.notifications.notificationType, 'Vendor Personal'), (0, drizzle_orm_1.eq)(Schema_1.notifications.targetVendorId, vendor.id))));
            }
            else if (Admin) {
                whereConditions.push((0, drizzle_orm_1.eq)(Schema_1.notifications.isActive, true));
            }
            if (filter) {
                if (filter.category)
                    whereConditions.push((0, drizzle_orm_1.eq)(Schema_1.notifications.category, filter.category));
                if (filter.priority)
                    whereConditions.push((0, drizzle_orm_1.eq)(Schema_1.notifications.priority, filter.priority));
                if (filter.dateFrom)
                    whereConditions.push((0, drizzle_orm_1.sql) `${Schema_1.notifications.createdAt} >= ${filter.dateFrom}`);
                if (filter.dateTo)
                    whereConditions.push((0, drizzle_orm_1.sql) `${Schema_1.notifications.createdAt} <= ${filter.dateTo}`);
            }
            const totalResult = yield this.db
                .select({ count: (0, drizzle_orm_1.count)() })
                .from(Schema_1.notifications)
                .where((0, drizzle_orm_1.and)(...whereConditions));
            const total = (_d = (_c = totalResult[0]) === null || _c === void 0 ? void 0 : _c.count) !== null && _d !== void 0 ? _d : 0;
            const validSortColumns = {
                createdAt: Schema_1.notifications.createdAt,
                updatedAt: Schema_1.notifications.updatedAt,
                title: Schema_1.notifications.title,
                notificationType: Schema_1.notifications.notificationType,
                category: Schema_1.notifications.category,
                priority: Schema_1.notifications.priority,
                sentAt: Schema_1.notifications.sentAt,
            };
            const sortBy = (pagination === null || pagination === void 0 ? void 0 : pagination.sortBy) && validSortColumns[pagination.sortBy] ? pagination.sortBy : 'createdAt';
            const sortOrder = ((_e = pagination === null || pagination === void 0 ? void 0 : pagination.sortOrder) === null || _e === void 0 ? void 0 : _e.toUpperCase()) === 'ASC' ? drizzle_orm_1.asc : drizzle_orm_1.desc;
            const orderByColumn = validSortColumns[sortBy];
            const notificationList = yield this.db
                .select()
                .from(Schema_1.notifications)
                .where((0, drizzle_orm_1.and)(...whereConditions))
                .orderBy(sortOrder(orderByColumn))
                .limit(limit)
                .offset(offset);
            const notificationIds = notificationList.map((n) => n.id);
            let readStatuses = [];
            if (notificationIds.length > 0) {
                readStatuses = yield this.db
                    .select()
                    .from(Schema_1.notificationReadStatus)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.inArray)(Schema_1.notificationReadStatus.notificationId, notificationIds), user ? (0, drizzle_orm_1.eq)(Schema_1.notificationReadStatus.userId, user.id) :
                    vendor ? (0, drizzle_orm_1.eq)(Schema_1.notificationReadStatus.vendorId, vendor.id) :
                        Admin ? (0, drizzle_orm_1.eq)(Schema_1.notificationReadStatus.adminId, Admin.id) : (0, drizzle_orm_1.sql) `false`));
            }
            const notificationsWithReadStatus = notificationList.map((notification) => {
                var _a;
                return (Object.assign(Object.assign({}, notification), { isRead: readStatuses.some((rs) => rs.notificationId === notification.id), readAt: (_a = readStatuses.find((rs) => rs.notificationId === notification.id)) === null || _a === void 0 ? void 0 : _a.readAt }));
            });
            const totalPages = Math.ceil(total / limit);
            return {
                notifications: notificationsWithReadStatus,
                total,
                page,
                limit,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
            };
        });
    }
    getAllNotifications(filter, pagination) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const page = (pagination === null || pagination === void 0 ? void 0 : pagination.page) || 1;
            const limit = Math.min((pagination === null || pagination === void 0 ? void 0 : pagination.limit) || 10, 100);
            const offset = (page - 1) * limit;
            let whereConditions = [];
            if (filter) {
                if (filter.notificationType)
                    whereConditions.push((0, drizzle_orm_1.eq)(Schema_1.notifications.notificationType, filter.notificationType));
                if (filter.category)
                    whereConditions.push((0, drizzle_orm_1.eq)(Schema_1.notifications.category, filter.category));
                if (filter.priority)
                    whereConditions.push((0, drizzle_orm_1.eq)(Schema_1.notifications.priority, filter.priority));
                if (filter.isActive !== undefined)
                    whereConditions.push((0, drizzle_orm_1.eq)(Schema_1.notifications.isActive, filter.isActive));
                if (filter.createdBy)
                    whereConditions.push((0, drizzle_orm_1.eq)(Schema_1.notifications.createdBy, filter.createdBy));
                if (filter.dateFrom)
                    whereConditions.push((0, drizzle_orm_1.sql) `${Schema_1.notifications.createdAt} >= ${filter.dateFrom}`);
                if (filter.dateTo)
                    whereConditions.push((0, drizzle_orm_1.sql) `${Schema_1.notifications.createdAt} <= ${filter.dateTo}`);
            }
            const whereClause = whereConditions.length > 0 ? (0, drizzle_orm_1.and)(...whereConditions) : undefined;
            const totalResult = yield this.db
                .select({ count: (0, drizzle_orm_1.count)() })
                .from(Schema_1.notifications)
                .where(whereClause);
            const total = ((_a = totalResult[0]) === null || _a === void 0 ? void 0 : _a.count) || 0;
            const sortBy = (pagination === null || pagination === void 0 ? void 0 : pagination.sortBy) || 'createdAt';
            const sortOrder = (pagination === null || pagination === void 0 ? void 0 : pagination.sortOrder) || 'DESC';
            const orderByFn = sortOrder === 'ASC' ? drizzle_orm_1.asc : drizzle_orm_1.desc;
            const validSortColumns = {
                createdAt: Schema_1.notifications.createdAt,
                updatedAt: Schema_1.notifications.updatedAt,
                title: Schema_1.notifications.title,
                notificationType: Schema_1.notifications.notificationType,
                category: Schema_1.notifications.category,
                priority: Schema_1.notifications.priority,
                sentAt: Schema_1.notifications.sentAt,
            };
            const orderByColumn = validSortColumns[sortBy] || Schema_1.notifications.createdAt;
            const notificationList = yield this.db
                .select()
                .from(Schema_1.notifications)
                .where(whereClause)
                .orderBy(orderByFn(orderByColumn))
                .limit(limit)
                .offset(offset);
            const totalPages = Math.ceil(total / limit);
            return {
                notifications: notificationList,
                total,
                page,
                limit,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1
            };
        });
    }
    getNotification(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const notification = yield this.db
                .select()
                .from(Schema_1.notifications)
                .where((0, drizzle_orm_1.eq)(Schema_1.notifications.id, id))
                .limit(1);
            return notification[0] || null;
        });
    }
    getUnreadCount(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user, vendor, Admin } = context;
            let whereConditions = [];
            if (user) {
                whereConditions.push((0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(Schema_1.notifications.notificationType, 'General'), (0, drizzle_orm_1.eq)(Schema_1.notifications.notificationType, 'All Users'), (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.notifications.notificationType, 'User Personal'), (0, drizzle_orm_1.eq)(Schema_1.notifications.targetUserId, user.id))));
            }
            else if (vendor) {
                whereConditions.push((0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(Schema_1.notifications.notificationType, 'General'), (0, drizzle_orm_1.eq)(Schema_1.notifications.notificationType, 'All Vendors'), (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.notifications.notificationType, 'Vendor Personal'), (0, drizzle_orm_1.eq)(Schema_1.notifications.targetVendorId, vendor.id))));
            }
            else if (Admin) {
                whereConditions.push((0, drizzle_orm_1.eq)(Schema_1.notifications.isActive, true));
            }
            const accessibleNotifications = yield this.db
                .select({ id: Schema_1.notifications.id })
                .from(Schema_1.notifications)
                .where((0, drizzle_orm_1.and)(...whereConditions));
            if (accessibleNotifications.length === 0)
                return 0;
            const notificationIds = accessibleNotifications.map((n) => n.id);
            const readNotifications = yield this.db
                .select({ notificationId: Schema_1.notificationReadStatus.notificationId })
                .from(Schema_1.notificationReadStatus)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.inArray)(Schema_1.notificationReadStatus.notificationId, notificationIds), user ? (0, drizzle_orm_1.eq)(Schema_1.notificationReadStatus.userId, user.id) :
                vendor ? (0, drizzle_orm_1.eq)(Schema_1.notificationReadStatus.vendorId, vendor.id) :
                    Admin ? (0, drizzle_orm_1.eq)(Schema_1.notificationReadStatus.adminId, Admin.id) : (0, drizzle_orm_1.sql) `false`));
            const readNotificationIds = readNotifications.map((rn) => rn.notificationId);
            return notificationIds.length - readNotificationIds.length;
        });
    }
    getNotificationStats(dateFrom, dateTo) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            let whereConditions = [];
            if (dateFrom)
                whereConditions.push((0, drizzle_orm_1.sql) `${Schema_1.notifications.createdAt} >= ${dateFrom}`);
            if (dateTo)
                whereConditions.push((0, drizzle_orm_1.sql) `${Schema_1.notifications.createdAt} <= ${dateTo}`);
            const whereClause = whereConditions.length > 0 ? (0, drizzle_orm_1.and)(...whereConditions) : undefined;
            const totalResult = yield this.db
                .select({ count: (0, drizzle_orm_1.count)() })
                .from(Schema_1.notifications)
                .where(whereClause);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            const todayResult = yield this.db
                .select({ count: (0, drizzle_orm_1.count)() })
                .from(Schema_1.notifications)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.sql) `${Schema_1.notifications.createdAt} >= ${today}`, (0, drizzle_orm_1.sql) `${Schema_1.notifications.createdAt} < ${tomorrow}`, whereClause));
            const categoryStats = yield this.db
                .select({
                category: Schema_1.notifications.category,
                count: (0, drizzle_orm_1.count)()
            })
                .from(Schema_1.notifications)
                .where(whereClause)
                .groupBy(Schema_1.notifications.category);
            const typeStats = yield this.db
                .select({
                type: Schema_1.notifications.notificationType,
                count: (0, drizzle_orm_1.count)()
            })
                .from(Schema_1.notifications)
                .where(whereClause)
                .groupBy(Schema_1.notifications.notificationType);
            return {
                totalNotifications: ((_a = totalResult[0]) === null || _a === void 0 ? void 0 : _a.count) || 0,
                totalSentToday: ((_b = todayResult[0]) === null || _b === void 0 ? void 0 : _b.count) || 0,
                totalReadToday: 0,
                totalUnread: 0,
                byCategory: categoryStats.map((stat) => ({
                    category: stat.category,
                    count: stat.count
                })),
                byType: typeStats.map((stat) => ({
                    type: stat.type,
                    count: stat.count
                }))
            };
        });
    }
    createNotification(input, adminId) {
        return __awaiter(this, void 0, void 0, function* () {
            const notificationId = (0, uuid_1.v4)();
            const now = new Date();
            const newNotification = yield this.db
                .insert(Schema_1.notifications)
                .values({
                id: notificationId,
                notificationType: input.notificationType,
                targetUserId: input.targetUserId,
                targetVendorId: input.targetVendorId,
                title: input.title,
                message: input.message,
                category: input.category,
                data: input.data,
                linkTo: input.linkTo,
                relatedId: input.relatedId,
                relatedType: input.relatedType,
                priority: input.priority || 'medium',
                isActive: true,
                scheduledAt: input.scheduledAt,
                createdBy: adminId,
                createdAt: now,
                updatedAt: now,
                totalRecipients: 0,
                successfulSends: 0,
                failedSends: 0
            })
                .returning();
            return newNotification[0];
        });
    }
    getUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRecord = yield this.db
                .select({ id: Schema_1.users.id })
                .from(Schema_1.users)
                .where((0, drizzle_orm_1.eq)(Schema_1.users.id, id))
                .limit(1);
            return userRecord[0] || null;
        });
    }
    getVendor(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const vendorRecord = yield this.db
                .select({ id: Schema_1.vendors.id })
                .from(Schema_1.vendors)
                .where((0, drizzle_orm_1.eq)(Schema_1.vendors.id, id))
                .limit(1);
            return vendorRecord[0] || null;
        });
    }
    updateNotificationSendStatus(id, result) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db
                .update(Schema_1.notifications)
                .set({
                sentAt: new Date(),
                totalRecipients: result.successCount + result.failureCount,
                successfulSends: result.successCount,
                failedSends: result.failureCount,
                updatedAt: new Date()
            })
                .where((0, drizzle_orm_1.eq)(Schema_1.notifications.id, id));
        });
    }
    markAsRead(notificationId, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user, vendor, Admin } = context;
            const existingRead = yield this.db
                .select()
                .from(Schema_1.notificationReadStatus)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.notificationReadStatus.notificationId, notificationId), user ? (0, drizzle_orm_1.eq)(Schema_1.notificationReadStatus.userId, user.id) :
                vendor ? (0, drizzle_orm_1.eq)(Schema_1.notificationReadStatus.vendorId, vendor.id) :
                    Admin ? (0, drizzle_orm_1.eq)(Schema_1.notificationReadStatus.adminId, Admin.id) : (0, drizzle_orm_1.sql) `false`))
                .limit(1);
            if (existingRead[0])
                return true;
            const readAt = new Date();
            yield this.db
                .insert(Schema_1.notificationReadStatus)
                .values({
                id: (0, uuid_1.v4)(),
                notificationId,
                userId: user === null || user === void 0 ? void 0 : user.id,
                vendorId: vendor === null || vendor === void 0 ? void 0 : vendor.id,
                adminId: Admin === null || Admin === void 0 ? void 0 : Admin.id,
                readAt
            });
            return true;
        });
    }
    markMultipleAsRead(notificationIds, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user, vendor, Admin } = context;
            if (!notificationIds || notificationIds.length === 0)
                return true;
            const existingReads = yield this.db
                .select({ notificationId: Schema_1.notificationReadStatus.notificationId })
                .from(Schema_1.notificationReadStatus)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.inArray)(Schema_1.notificationReadStatus.notificationId, notificationIds), user ? (0, drizzle_orm_1.eq)(Schema_1.notificationReadStatus.userId, user.id) :
                vendor ? (0, drizzle_orm_1.eq)(Schema_1.notificationReadStatus.vendorId, vendor.id) :
                    Admin ? (0, drizzle_orm_1.eq)(Schema_1.notificationReadStatus.adminId, Admin.id) : (0, drizzle_orm_1.sql) `false`));
            const alreadyReadIds = existingReads.map((er) => er.notificationId);
            const unreadIds = notificationIds.filter(id => !alreadyReadIds.includes(id));
            if (unreadIds.length === 0)
                return true;
            const readAt = new Date();
            const readStatusRecords = unreadIds.map(notificationId => ({
                id: (0, uuid_1.v4)(),
                notificationId,
                userId: user === null || user === void 0 ? void 0 : user.id,
                vendorId: vendor === null || vendor === void 0 ? void 0 : vendor.id,
                adminId: Admin === null || Admin === void 0 ? void 0 : Admin.id,
                readAt
            }));
            yield this.db
                .insert(Schema_1.notificationReadStatus)
                .values(readStatusRecords);
            return true;
        });
    }
    markAllAsRead(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user, vendor, Admin } = context;
            let whereConditions = [];
            if (user) {
                whereConditions.push((0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(Schema_1.notifications.notificationType, 'General'), (0, drizzle_orm_1.eq)(Schema_1.notifications.notificationType, 'All Users'), (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.notifications.notificationType, 'User Personal'), (0, drizzle_orm_1.eq)(Schema_1.notifications.targetUserId, user.id))));
            }
            else if (vendor) {
                whereConditions.push((0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(Schema_1.notifications.notificationType, 'General'), (0, drizzle_orm_1.eq)(Schema_1.notifications.notificationType, 'All Vendors'), (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.notifications.notificationType, 'Vendor Personal'), (0, drizzle_orm_1.eq)(Schema_1.notifications.targetVendorId, vendor.id))));
            }
            else if (Admin) {
                whereConditions.push((0, drizzle_orm_1.eq)(Schema_1.notifications.isActive, true));
            }
            const accessibleNotifications = yield this.db
                .select({ id: Schema_1.notifications.id })
                .from(Schema_1.notifications)
                .where((0, drizzle_orm_1.and)(...whereConditions));
            if (accessibleNotifications.length === 0)
                return true;
            const notificationIds = accessibleNotifications.map((n) => n.id);
            const existingReads = yield this.db
                .select({ notificationId: Schema_1.notificationReadStatus.notificationId })
                .from(Schema_1.notificationReadStatus)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.inArray)(Schema_1.notificationReadStatus.notificationId, notificationIds), user ? (0, drizzle_orm_1.eq)(Schema_1.notificationReadStatus.userId, user.id) :
                vendor ? (0, drizzle_orm_1.eq)(Schema_1.notificationReadStatus.vendorId, vendor.id) :
                    Admin ? (0, drizzle_orm_1.eq)(Schema_1.notificationReadStatus.adminId, Admin.id) : (0, drizzle_orm_1.sql) `false`));
            const alreadyReadIds = existingReads.map((er) => er.notificationId);
            const unreadIds = notificationIds.filter((id) => !alreadyReadIds.includes(id));
            if (unreadIds.length === 0)
                return true;
            const readAt = new Date();
            const readStatusRecords = unreadIds.map((notificationId) => ({
                id: (0, uuid_1.v4)(),
                notificationId,
                userId: user === null || user === void 0 ? void 0 : user.id,
                vendorId: vendor === null || vendor === void 0 ? void 0 : vendor.id,
                adminId: Admin === null || Admin === void 0 ? void 0 : Admin.id,
                readAt
            }));
            yield this.db
                .insert(Schema_1.notificationReadStatus)
                .values(readStatusRecords);
            return true;
        });
    }
    updateFCMToken(input, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user, vendor } = context;
            if (user || input.userId) {
                const targetUserId = input.userId || user.id;
                const userRecord = yield this.db
                    .select({ fcmToken: Schema_1.users.fcmToken })
                    .from(Schema_1.users)
                    .where((0, drizzle_orm_1.eq)(Schema_1.users.id, targetUserId))
                    .limit(1);
                if (!userRecord[0])
                    return false;
                const currentTokens = userRecord[0].fcmToken || [];
                const updatedTokens = currentTokens.includes(input.token)
                    ? currentTokens
                    : [...currentTokens, input.token];
                yield this.db
                    .update(Schema_1.users)
                    .set({
                    fcmToken: updatedTokens.slice(-10),
                    updatedAt: new Date()
                })
                    .where((0, drizzle_orm_1.eq)(Schema_1.users.id, targetUserId));
            }
            if (vendor || input.vendorId) {
                const targetVendorId = input.vendorId || vendor.id;
                const vendorRecord = yield this.db
                    .select({ fcmToken: Schema_1.vendors.fcmToken })
                    .from(Schema_1.vendors)
                    .where((0, drizzle_orm_1.eq)(Schema_1.vendors.id, targetVendorId))
                    .limit(1);
                if (!vendorRecord[0])
                    return false;
                const currentTokens = vendorRecord[0].fcmToken || [];
                const updatedTokens = currentTokens.includes(input.token)
                    ? currentTokens
                    : [...currentTokens, input.token];
                yield this.db
                    .update(Schema_1.vendors)
                    .set({
                    fcmToken: updatedTokens.slice(-10),
                    updatedAt: new Date()
                })
                    .where((0, drizzle_orm_1.eq)(Schema_1.vendors.id, targetVendorId));
            }
            return true;
        });
    }
    getTestNotificationTokens(targetUserId, targetVendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            let tokens = [];
            if (targetUserId) {
                const userRecord = yield this.db
                    .select({ fcmToken: Schema_1.users.fcmToken })
                    .from(Schema_1.users)
                    .where((0, drizzle_orm_1.eq)(Schema_1.users.id, targetUserId))
                    .limit(1);
                if ((_a = userRecord[0]) === null || _a === void 0 ? void 0 : _a.fcmToken)
                    tokens.push(...userRecord[0].fcmToken);
            }
            if (targetVendorId) {
                const vendorRecord = yield this.db
                    .select({ fcmToken: Schema_1.vendors.fcmToken })
                    .from(Schema_1.vendors)
                    .where((0, drizzle_orm_1.eq)(Schema_1.vendors.id, targetVendorId))
                    .limit(1);
                if ((_b = vendorRecord[0]) === null || _b === void 0 ? void 0 : _b.fcmToken)
                    tokens.push(...vendorRecord[0].fcmToken);
            }
            return tokens;
        });
    }
    getTargetUser(parent) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!parent.targetUserId)
                return null;
            const userRecord = yield this.db
                .select()
                .from(Schema_1.users)
                .where((0, drizzle_orm_1.eq)(Schema_1.users.id, parent.targetUserId))
                .limit(1);
            return userRecord[0] || null;
        });
    }
    getTargetVendor(parent) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!parent.targetVendorId)
                return null;
            const vendorRecord = yield this.db
                .select()
                .from(Schema_1.vendors)
                .where((0, drizzle_orm_1.eq)(Schema_1.vendors.id, parent.targetVendorId))
                .limit(1);
            return vendorRecord[0] || null;
        });
    }
    getCreator(parent) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!parent.createdBy)
                return null;
            const adminRecord = yield this.db
                .select()
                .from(Schema_1.admin)
                .where((0, drizzle_orm_1.eq)(Schema_1.admin.id, parent.createdBy))
                .limit(1);
            return adminRecord[0] || null;
        });
    }
    getRecipientTokens(notification) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            let tokens = [];
            switch (notification.notificationType) {
                case 'General':
                    const allUsers = yield this.db.select({ fcmToken: Schema_1.users.fcmToken }).from(Schema_1.users);
                    const allVendors = yield this.db.select({ fcmToken: Schema_1.vendors.fcmToken }).from(Schema_1.vendors);
                    allUsers.forEach((user) => {
                        if (user.fcmToken)
                            tokens.push(...user.fcmToken);
                    });
                    allVendors.forEach((vendor) => {
                        if (vendor.fcmToken)
                            tokens.push(...vendor.fcmToken);
                    });
                    break;
                case 'All Users':
                    const usersData = yield this.db.select({ fcmToken: Schema_1.users.fcmToken }).from(Schema_1.users);
                    usersData.forEach((user) => {
                        if (user.fcmToken)
                            tokens.push(...user.fcmToken);
                    });
                    break;
                case 'All Vendors':
                    const vendorsData = yield this.db.select({ fcmToken: Schema_1.vendors.fcmToken }).from(Schema_1.vendors);
                    vendorsData.forEach((vendor) => {
                        if (vendor.fcmToken)
                            tokens.push(...vendor.fcmToken);
                    });
                    break;
                case 'User Personal':
                    if (notification.targetUserId) {
                        const userData = yield this.db
                            .select({ fcmToken: Schema_1.users.fcmToken })
                            .from(Schema_1.users)
                            .where((0, drizzle_orm_1.eq)(Schema_1.users.id, notification.targetUserId))
                            .limit(1);
                        if ((_a = userData[0]) === null || _a === void 0 ? void 0 : _a.fcmToken)
                            tokens.push(...userData[0].fcmToken);
                    }
                    break;
                case 'Vendor Personal':
                    if (notification.targetVendorId) {
                        const vendorData = yield this.db
                            .select({ fcmToken: Schema_1.vendors.fcmToken })
                            .from(Schema_1.vendors)
                            .where((0, drizzle_orm_1.eq)(Schema_1.vendors.id, notification.targetVendorId))
                            .limit(1);
                        if ((_b = vendorData[0]) === null || _b === void 0 ? void 0 : _b.fcmToken)
                            tokens.push(...vendorData[0].fcmToken);
                    }
                    break;
            }
            return [...new Set(tokens)];
        });
    }
}
exports.NotificationModel = NotificationModel;
