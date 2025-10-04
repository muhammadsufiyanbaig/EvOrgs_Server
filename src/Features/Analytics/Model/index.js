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
exports.AnalyticsModel = void 0;
const Schema_1 = require("../../../Schema");
const drizzle_orm_1 = require("drizzle-orm");
class AnalyticsModel {
    constructor(db) {
        this.db = db;
    }
    getAnalyticsEvents(_a) {
        return __awaiter(this, arguments, void 0, function* ({ limit = 50, offset = 0, eventType, dateFrom, dateTo }) {
            const conditions = [];
            if (eventType) {
                conditions.push((0, drizzle_orm_1.eq)(Schema_1.analyticsEvents.eventType, eventType));
            }
            if (dateFrom) {
                conditions.push((0, drizzle_orm_1.gte)(Schema_1.analyticsEvents.createdAt, new Date(dateFrom)));
            }
            if (dateTo) {
                conditions.push((0, drizzle_orm_1.lte)(Schema_1.analyticsEvents.createdAt, new Date(dateTo)));
            }
            const baseQuery = this.db.select().from(Schema_1.analyticsEvents);
            const queryWithWhere = conditions.length > 0
                ? baseQuery.where((0, drizzle_orm_1.and)(...conditions))
                : baseQuery;
            return queryWithWhere
                .orderBy((0, drizzle_orm_1.desc)(Schema_1.analyticsEvents.createdAt))
                .limit(limit)
                .offset(offset);
        });
    }
    getAnalyticsStats(_a) {
        return __awaiter(this, arguments, void 0, function* ({ dateFrom, dateTo }) {
            const conditions = [];
            if (dateFrom) {
                conditions.push((0, drizzle_orm_1.gte)(Schema_1.analyticsEvents.createdAt, new Date(dateFrom)));
            }
            if (dateTo) {
                conditions.push((0, drizzle_orm_1.lte)(Schema_1.analyticsEvents.createdAt, new Date(dateTo)));
            }
            const whereClause = conditions.length > 0 ? (0, drizzle_orm_1.and)(...conditions) : undefined;
            const totalEventsResult = yield this.db
                .select({ count: (0, drizzle_orm_1.count)() })
                .from(Schema_1.analyticsEvents)
                .where(whereClause);
            const eventsByType = yield this.db
                .select({
                eventType: Schema_1.analyticsEvents.eventType,
                count: (0, drizzle_orm_1.count)()
            })
                .from(Schema_1.analyticsEvents)
                .where(whereClause)
                .groupBy(Schema_1.analyticsEvents.eventType);
            const eventsByDate = yield this.db
                .select({
                date: (0, drizzle_orm_1.sql) `DATE(${Schema_1.analyticsEvents.createdAt})`.as('date'),
                count: (0, drizzle_orm_1.count)()
            })
                .from(Schema_1.analyticsEvents)
                .where(whereClause)
                .groupBy((0, drizzle_orm_1.sql) `DATE(${Schema_1.analyticsEvents.createdAt})`)
                .orderBy((0, drizzle_orm_1.sql) `DATE(${Schema_1.analyticsEvents.createdAt})`);
            const topUsers = yield this.db
                .select({
                userId: Schema_1.analyticsEvents.userId,
                count: (0, drizzle_orm_1.count)()
            })
                .from(Schema_1.analyticsEvents)
                .where((0, drizzle_orm_1.and)(whereClause, (0, drizzle_orm_1.sql) `${Schema_1.analyticsEvents.userId} IS NOT NULL`))
                .groupBy(Schema_1.analyticsEvents.userId)
                .orderBy((0, drizzle_orm_1.desc)((0, drizzle_orm_1.count)()))
                .limit(10);
            const topVendors = yield this.db
                .select({
                vendorId: Schema_1.analyticsEvents.vendorId,
                count: (0, drizzle_orm_1.count)()
            })
                .from(Schema_1.analyticsEvents)
                .where((0, drizzle_orm_1.and)(whereClause, (0, drizzle_orm_1.sql) `${Schema_1.analyticsEvents.vendorId} IS NOT NULL`))
                .groupBy(Schema_1.analyticsEvents.vendorId)
                .orderBy((0, drizzle_orm_1.desc)((0, drizzle_orm_1.count)()))
                .limit(10);
            return { totalEventsResult, eventsByType, eventsByDate, topUsers, topVendors };
        });
    }
    getReports(_a) {
        return __awaiter(this, arguments, void 0, function* ({ filters, limit = 50, offset = 0 }) {
            const conditions = [];
            if (filters === null || filters === void 0 ? void 0 : filters.reportType) {
                conditions.push((0, drizzle_orm_1.eq)(Schema_1.reports.reportType, filters.reportType));
            }
            if (filters === null || filters === void 0 ? void 0 : filters.status) {
                conditions.push((0, drizzle_orm_1.eq)(Schema_1.reports.status, filters.status));
            }
            if ((filters === null || filters === void 0 ? void 0 : filters.isScheduled) !== undefined) {
                conditions.push((0, drizzle_orm_1.eq)(Schema_1.reports.isScheduled, filters.isScheduled));
            }
            if (filters === null || filters === void 0 ? void 0 : filters.dateFrom) {
                conditions.push((0, drizzle_orm_1.gte)(Schema_1.reports.createdAt, new Date(filters.dateFrom)));
            }
            if (filters === null || filters === void 0 ? void 0 : filters.dateTo) {
                conditions.push((0, drizzle_orm_1.lte)(Schema_1.reports.createdAt, new Date(filters.dateTo)));
            }
            const whereClause = conditions.length > 0 ? (0, drizzle_orm_1.and)(...conditions) : undefined;
            return this.db
                .select()
                .from(Schema_1.reports)
                .where(whereClause)
                .orderBy((0, drizzle_orm_1.desc)(Schema_1.reports.createdAt))
                .limit(limit)
                .offset(offset);
        });
    }
    getReport(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const report = yield this.db
                .select()
                .from(Schema_1.reports)
                .where((0, drizzle_orm_1.eq)(Schema_1.reports.id, id))
                .limit(1);
            return report[0] || null;
        });
    }
    getMyReports(adminId_1, _a) {
        return __awaiter(this, arguments, void 0, function* (adminId, { limit = 50, offset = 0 }) {
            return this.db
                .select()
                .from(Schema_1.reports)
                .where((0, drizzle_orm_1.eq)(Schema_1.reports.generatedBy, adminId))
                .orderBy((0, drizzle_orm_1.desc)(Schema_1.reports.createdAt))
                .limit(limit)
                .offset(offset);
        });
    }
    getScheduledReports() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db
                .select()
                .from(Schema_1.reports)
                .where((0, drizzle_orm_1.eq)(Schema_1.reports.isScheduled, true))
                .orderBy((0, drizzle_orm_1.desc)(Schema_1.reports.createdAt));
        });
    }
    trackEvent(eventData) {
        return __awaiter(this, void 0, void 0, function* () {
            const [newEvent] = yield this.db
                .insert(Schema_1.analyticsEvents)
                .values(eventData)
                .returning();
            return newEvent;
        });
    }
    createReport(reportData) {
        return __awaiter(this, void 0, void 0, function* () {
            const [newReport] = yield this.db
                .insert(Schema_1.reports)
                .values(reportData)
                .returning();
            return newReport;
        });
    }
    updateReport(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            const [updatedReport] = yield this.db
                .update(Schema_1.reports)
                .set(updateData)
                .where((0, drizzle_orm_1.eq)(Schema_1.reports.id, id))
                .returning();
            return updatedReport;
        });
    }
    deleteReport(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedReport = yield this.db
                .delete(Schema_1.reports)
                .where((0, drizzle_orm_1.eq)(Schema_1.reports.id, id))
                .returning();
            return deletedReport;
        });
    }
    updateReportStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const [updatedReport] = yield this.db
                .update(Schema_1.reports)
                .set({ status, updatedAt: new Date() })
                .where((0, drizzle_orm_1.eq)(Schema_1.reports.id, id))
                .returning();
            return updatedReport;
        });
    }
    updateReportUrl(id, reportUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const [updatedReport] = yield this.db
                .update(Schema_1.reports)
                .set({ reportUrl, updatedAt: new Date() })
                .where((0, drizzle_orm_1.eq)(Schema_1.reports.id, id))
                .returning();
            return updatedReport;
        });
    }
}
exports.AnalyticsModel = AnalyticsModel;
