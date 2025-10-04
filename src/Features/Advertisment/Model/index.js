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
exports.AdModel = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const Schema_1 = require("../../../Schema");
class AdModel {
    constructor(db) {
        this.db = db;
    }
    // Fetch active ads with optional filters
    getActiveAds(adType, entityType) {
        return __awaiter(this, void 0, void 0, function* () {
            const conditions = [(0, drizzle_orm_1.eq)(Schema_1.servicesAds.status, 'Active')];
            if (adType)
                conditions.push((0, drizzle_orm_1.eq)(Schema_1.servicesAds.adType, adType));
            if (entityType)
                conditions.push((0, drizzle_orm_1.eq)(Schema_1.servicesAds.entityType, entityType));
            return yield this.db
                .select()
                .from(Schema_1.servicesAds)
                .where((0, drizzle_orm_1.and)(...conditions))
                .orderBy((0, drizzle_orm_1.sql) `${Schema_1.servicesAds.createdAt} DESC`);
        });
    }
    // Fetch active external ads
    getActiveExternalAds() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db
                .select()
                .from(Schema_1.externalAds)
                .where((0, drizzle_orm_1.eq)(Schema_1.externalAds.status, 'Active'))
                .orderBy((0, drizzle_orm_1.sql) `${Schema_1.externalAds.createdAt} DESC`);
        });
    }
    // Fetch featured ads
    getFeaturedAds() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db
                .select()
                .from(Schema_1.servicesAds)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.servicesAds.status, 'Active'), (0, drizzle_orm_1.eq)(Schema_1.servicesAds.adType, 'Featured')))
                .orderBy((0, drizzle_orm_1.sql) `${Schema_1.servicesAds.createdAt} DESC`);
        });
    }
    // Fetch sponsored ads
    getSponsoredAds() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db
                .select()
                .from(Schema_1.servicesAds)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.servicesAds.status, 'Active'), (0, drizzle_orm_1.eq)(Schema_1.servicesAds.adType, 'Sponsored')))
                .orderBy((0, drizzle_orm_1.sql) `${Schema_1.servicesAds.createdAt} DESC`);
        });
    }
    // Fetch vendor ad requests
    getMyAdRequests(vendorId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const conditions = [
                (0, drizzle_orm_1.eq)(Schema_1.servicesAds.vendorId, vendorId),
                (0, drizzle_orm_1.sql) `${Schema_1.servicesAds.status} IN ('Pending', 'Rejected')`
            ];
            if (status)
                conditions.push((0, drizzle_orm_1.eq)(Schema_1.servicesAds.status, status));
            return yield this.db
                .select()
                .from(Schema_1.servicesAds)
                .where((0, drizzle_orm_1.and)(...conditions))
                .orderBy((0, drizzle_orm_1.sql) `${Schema_1.servicesAds.createdAt} DESC`);
        });
    }
    // Fetch vendor active ads
    getMyActiveAds(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db
                .select()
                .from(Schema_1.servicesAds)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.servicesAds.vendorId, vendorId), (0, drizzle_orm_1.sql) `${Schema_1.servicesAds.status} IN ('Active', 'Approved')`))
                .orderBy((0, drizzle_orm_1.sql) `${Schema_1.servicesAds.createdAt} DESC`);
        });
    }
    // Fetch ad request by ID
    getAdRequestById(id, vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db
                .select()
                .from(Schema_1.servicesAds)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.servicesAds.id, id), (0, drizzle_orm_1.eq)(Schema_1.servicesAds.vendorId, vendorId)))
                .limit(1);
            return result[0] || null;
        });
    }
    // Fetch vendor payments
    getMyPayments(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db
                .select()
                .from(Schema_1.adPayments)
                .where((0, drizzle_orm_1.eq)(Schema_1.adPayments.vendorId, vendorId))
                .orderBy((0, drizzle_orm_1.sql) `${Schema_1.adPayments.createdAt} DESC`);
        });
    }
    // Fetch all ad requests (admin)
    getAllAdRequests(status, vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const conditions = [(0, drizzle_orm_1.sql) `${Schema_1.servicesAds.status} IN ('Pending', 'Rejected')`];
            if (status)
                conditions.push((0, drizzle_orm_1.eq)(Schema_1.servicesAds.status, status));
            if (vendorId)
                conditions.push((0, drizzle_orm_1.eq)(Schema_1.servicesAds.vendorId, vendorId));
            return yield this.db
                .select()
                .from(Schema_1.servicesAds)
                .where((0, drizzle_orm_1.and)(...conditions))
                .orderBy((0, drizzle_orm_1.sql) `${Schema_1.servicesAds.createdAt} DESC`);
        });
    }
    // Fetch all service ads (admin)
    getAllServiceAds(status, vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const conditions = [];
            if (status)
                conditions.push((0, drizzle_orm_1.eq)(Schema_1.servicesAds.status, status));
            if (vendorId)
                conditions.push((0, drizzle_orm_1.eq)(Schema_1.servicesAds.vendorId, vendorId));
            const query = conditions.length > 0
                ? this.db.select().from(Schema_1.servicesAds).where((0, drizzle_orm_1.and)(...conditions))
                : this.db.select().from(Schema_1.servicesAds);
            return yield query.orderBy((0, drizzle_orm_1.sql) `${Schema_1.servicesAds.createdAt} DESC`);
        });
    }
    // Fetch pending ad requests (admin)
    getPendingAdRequests() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db
                .select()
                .from(Schema_1.servicesAds)
                .where((0, drizzle_orm_1.eq)(Schema_1.servicesAds.status, 'Pending'))
                .orderBy((0, drizzle_orm_1.sql) `${Schema_1.servicesAds.createdAt} ASC`);
        });
    }
    // Fetch external ads (admin)
    getExternalAds(status) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = status
                ? this.db.select().from(Schema_1.externalAds).where((0, drizzle_orm_1.eq)(Schema_1.externalAds.status, status))
                : this.db.select().from(Schema_1.externalAds);
            return yield query.orderBy((0, drizzle_orm_1.sql) `${Schema_1.externalAds.createdAt} DESC`);
        });
    }
    // Fetch external ad by ID
    getExternalAdById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db
                .select()
                .from(Schema_1.externalAds)
                .where((0, drizzle_orm_1.eq)(Schema_1.externalAds.id, id))
                .limit(1);
            return result[0] || null;
        });
    }
    // Fetch ad payments (admin)
    getAdPayments(adId, externalAdId) {
        return __awaiter(this, void 0, void 0, function* () {
            const conditions = [];
            if (adId)
                conditions.push((0, drizzle_orm_1.eq)(Schema_1.adPayments.adId, adId));
            if (externalAdId)
                conditions.push((0, drizzle_orm_1.eq)(Schema_1.adPayments.externalAdId, externalAdId));
            const query = conditions.length > 0
                ? this.db.select().from(Schema_1.adPayments).where((0, drizzle_orm_1.and)(...conditions))
                : this.db.select().from(Schema_1.adPayments);
            return yield query.orderBy((0, drizzle_orm_1.sql) `${Schema_1.adPayments.createdAt} DESC`);
        });
    }
    // Fetch payment by ID
    getPaymentById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db
                .select()
                .from(Schema_1.adPayments)
                .where((0, drizzle_orm_1.eq)(Schema_1.adPayments.id, id))
                .limit(1);
            return result[0] || null;
        });
    }
    // Fetch ad for analytics
    getAdForAnalytics(adId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db
                .select()
                .from(Schema_1.servicesAds)
                .where((0, drizzle_orm_1.eq)(Schema_1.servicesAds.id, adId))
                .limit(1);
            return result[0] || null;
        });
    }
    // Fetch total spent for ad
    getTotalSpent(adId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db
                .select({
                total: (0, drizzle_orm_1.sql) `COALESCE(SUM(${Schema_1.adPayments.amountPaid}), 0)`.as('total'),
            })
                .from(Schema_1.adPayments)
                .where((0, drizzle_orm_1.eq)(Schema_1.adPayments.adId, adId));
            return result[0].total;
        });
    }
    // Fetch dashboard stats
    getDashboardStats() {
        return __awaiter(this, void 0, void 0, function* () {
            const [requestStats, adStats, paymentStats] = yield Promise.all([
                this.db.select({
                    total: (0, drizzle_orm_1.sql) `COUNT(*)`.as('total'),
                    pending: (0, drizzle_orm_1.sql) `COUNT(*) FILTER (WHERE ${Schema_1.servicesAds.status} = 'Pending')`.as('pending')
                }).from(Schema_1.servicesAds).where((0, drizzle_orm_1.sql) `${Schema_1.servicesAds.status} IN ('Pending', 'Rejected')`),
                this.db.select({
                    active: (0, drizzle_orm_1.sql) `COUNT(*) FILTER (WHERE ${Schema_1.servicesAds.status} = 'Active')`.as('active'),
                    totalImpressions: (0, drizzle_orm_1.sql) `COALESCE(SUM(${Schema_1.servicesAds.impressionCount}), 0)`.as('totalImpressions'),
                    totalClicks: (0, drizzle_orm_1.sql) `COALESCE(SUM(${Schema_1.servicesAds.clickCount}), 0)`.as('totalClicks')
                }).from(Schema_1.servicesAds),
                this.db.select({
                    totalRevenue: (0, drizzle_orm_1.sql) `COALESCE(SUM(${Schema_1.adPayments.amountPaid}), 0)`.as('totalRevenue')
                }).from(Schema_1.adPayments).where((0, drizzle_orm_1.eq)(Schema_1.adPayments.paymentStatus, 'Paid'))
            ]);
            return { requestStats, adStats, paymentStats };
        });
    }
    // Fetch top performing ads
    getTopPerformingAds(limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.select({
                id: Schema_1.servicesAds.id,
                adTitle: Schema_1.servicesAds.adTitle,
                adType: Schema_1.servicesAds.adType,
                impressions: Schema_1.servicesAds.impressionCount,
                clicks: Schema_1.servicesAds.clickCount,
                conversions: Schema_1.servicesAds.conversionCount,
                ctr: (0, drizzle_orm_1.sql) `
        CASE 
          WHEN ${Schema_1.servicesAds.impressionCount} > 0 
          THEN (${Schema_1.servicesAds.clickCount}::float / ${Schema_1.servicesAds.impressionCount}) * 100 
          ELSE 0 
        END
      `.as('ctr')
            })
                .from(Schema_1.servicesAds)
                .where((0, drizzle_orm_1.eq)(Schema_1.servicesAds.status, 'Active'))
                .orderBy((0, drizzle_orm_1.sql) `ctr DESC`)
                .limit(limit);
        });
    }
    // Fetch revenue analytics
    getRevenueAnalytics(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            let conditions = [(0, drizzle_orm_1.eq)(Schema_1.adPayments.paymentStatus, 'Paid')];
            if (startDate && endDate) {
                conditions.push((0, drizzle_orm_1.sql) `${Schema_1.adPayments.createdAt} >= ${startDate}`);
                conditions.push((0, drizzle_orm_1.sql) `${Schema_1.adPayments.createdAt} <= ${endDate}`);
            }
            return yield this.db.select({
                date: (0, drizzle_orm_1.sql) `DATE(${Schema_1.adPayments.createdAt})`.as('date'),
                revenue: (0, drizzle_orm_1.sql) `SUM(${Schema_1.adPayments.amountPaid})`.as('revenue'),
                transactions: (0, drizzle_orm_1.sql) `COUNT(*)`.as('transactions')
            })
                .from(Schema_1.adPayments)
                .where((0, drizzle_orm_1.and)(...conditions))
                .groupBy((0, drizzle_orm_1.sql) `DATE(${Schema_1.adPayments.createdAt})`)
                .orderBy((0, drizzle_orm_1.sql) `DATE(${Schema_1.adPayments.createdAt}) DESC`);
        });
    }
    // Create ad request
    createAdRequest(adRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db.insert(Schema_1.servicesAds).values(adRequest).returning();
            return result[0];
        });
    }
    // Update ad request
    updateAdRequest(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db.update(Schema_1.servicesAds)
                .set(updateData)
                .where((0, drizzle_orm_1.eq)(Schema_1.servicesAds.id, id))
                .returning();
            return result[0];
        });
    }
    // Fetch ad by ID
    getAdById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db
                .select()
                .from(Schema_1.servicesAds)
                .where((0, drizzle_orm_1.eq)(Schema_1.servicesAds.id, id))
                .limit(1);
            return result[0] || null;
        });
    }
    // Create external ad
    createExternalAd(externalAd) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db.insert(Schema_1.externalAds).values(externalAd).returning();
            return result[0];
        });
    }
    // Update external ad
    updateExternalAd(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db.update(Schema_1.externalAds)
                .set(updateData)
                .where((0, drizzle_orm_1.eq)(Schema_1.externalAds.id, id))
                .returning();
            return result[0];
        });
    }
    // Delete external ad
    deleteExternalAd(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.delete(Schema_1.externalAds).where((0, drizzle_orm_1.eq)(Schema_1.externalAds.id, id));
            return true;
        });
    }
    // Create payment
    createPayment(payment) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db.insert(Schema_1.adPayments).values(payment).returning();
            return result[0];
        });
    }
    // Update payment status
    updatePaymentStatus(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db.update(Schema_1.adPayments)
                .set(updateData)
                .where((0, drizzle_orm_1.eq)(Schema_1.adPayments.id, id))
                .returning();
            return result[0];
        });
    }
    // Record impression
    recordImpression(adId, isExternal) {
        return __awaiter(this, void 0, void 0, function* () {
            if (isExternal) {
                yield this.db.update(Schema_1.externalAds)
                    .set({
                    impressionCount: (0, drizzle_orm_1.sql) `${Schema_1.externalAds.impressionCount} + 1`,
                    updatedAt: new Date()
                })
                    .where((0, drizzle_orm_1.eq)(Schema_1.externalAds.id, adId));
            }
            else {
                yield this.db.update(Schema_1.servicesAds)
                    .set({
                    impressionCount: (0, drizzle_orm_1.sql) `${Schema_1.servicesAds.impressionCount} + 1`,
                    updatedAt: new Date()
                })
                    .where((0, drizzle_orm_1.eq)(Schema_1.servicesAds.id, adId));
            }
            return true;
        });
    }
    // Record click
    recordClick(adId, isExternal) {
        return __awaiter(this, void 0, void 0, function* () {
            if (isExternal) {
                yield this.db.update(Schema_1.externalAds)
                    .set({
                    clickCount: (0, drizzle_orm_1.sql) `${Schema_1.externalAds.clickCount} + 1`,
                    updatedAt: new Date()
                })
                    .where((0, drizzle_orm_1.eq)(Schema_1.externalAds.id, adId));
            }
            else {
                yield this.db.update(Schema_1.servicesAds)
                    .set({
                    clickCount: (0, drizzle_orm_1.sql) `${Schema_1.servicesAds.clickCount} + 1`,
                    updatedAt: new Date()
                })
                    .where((0, drizzle_orm_1.eq)(Schema_1.servicesAds.id, adId));
            }
            return true;
        });
    }
    // Record conversion
    recordConversion(adId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.update(Schema_1.servicesAds)
                .set({
                conversionCount: (0, drizzle_orm_1.sql) `${Schema_1.servicesAds.conversionCount} + 1`,
                updatedAt: new Date()
            })
                .where((0, drizzle_orm_1.eq)(Schema_1.servicesAds.id, adId));
            return true;
        });
    }
    // ==================== TIME SLOT MANAGEMENT ====================
    // Create time slots for an ad
    createTimeSlots(adId, timeSlots) {
        return __awaiter(this, void 0, void 0, function* () {
            const timeSlotRecords = timeSlots.map(slot => ({
                id: crypto.randomUUID(),
                adId,
                startTime: slot.startTime,
                endTime: slot.endTime,
                daysOfWeek: slot.daysOfWeek,
                priority: slot.priority,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            }));
            return yield this.db.insert(Schema_1.adTimeSlots).values(timeSlotRecords).returning();
        });
    }
    // Get time slots for an ad
    getTimeSlotsByAdId(adId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db
                .select()
                .from(Schema_1.adTimeSlots)
                .where((0, drizzle_orm_1.eq)(Schema_1.adTimeSlots.adId, adId))
                .orderBy(Schema_1.adTimeSlots.priority, Schema_1.adTimeSlots.startTime);
        });
    }
    // Update time slots for an ad
    updateTimeSlots(adId, timeSlots) {
        return __awaiter(this, void 0, void 0, function* () {
            // Delete existing time slots
            yield this.db.delete(Schema_1.adTimeSlots).where((0, drizzle_orm_1.eq)(Schema_1.adTimeSlots.adId, adId));
            // Create new time slots
            return yield this.createTimeSlots(adId, timeSlots);
        });
    }
    // Check time slot availability
    checkTimeSlotAvailability(date, startTime, endTime, adType) {
        return __awaiter(this, void 0, void 0, function* () {
            const dayOfWeek = new Date(date).getDay();
            const conflictingAds = yield this.db
                .select({
                ad: Schema_1.servicesAds,
                timeSlot: Schema_1.adTimeSlots,
                schedule: Schema_1.adSchedules,
            })
                .from(Schema_1.servicesAds)
                .innerJoin(Schema_1.adTimeSlots, (0, drizzle_orm_1.eq)(Schema_1.adTimeSlots.adId, Schema_1.servicesAds.id))
                .innerJoin(Schema_1.adSchedules, (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.adSchedules.adId, Schema_1.servicesAds.id), (0, drizzle_orm_1.eq)(Schema_1.adSchedules.timeSlotId, Schema_1.adTimeSlots.id), (0, drizzle_orm_1.eq)(Schema_1.adSchedules.scheduledDate, date), (0, drizzle_orm_1.sql) `${Schema_1.adSchedules.status} IN ('Scheduled', 'Running')`))
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.servicesAds.status, 'Active'), (0, drizzle_orm_1.eq)(Schema_1.adTimeSlots.isActive, true), (0, drizzle_orm_1.sql) `${Schema_1.adTimeSlots.daysOfWeek} @> ${JSON.stringify([dayOfWeek])}`, 
            // Check for time overlap
            (0, drizzle_orm_1.sql) `(${Schema_1.adTimeSlots.startTime} < ${endTime} AND ${Schema_1.adTimeSlots.endTime} > ${startTime})`));
            return {
                isAvailable: conflictingAds.length === 0,
                conflictingAds: conflictingAds.map(c => c.ad),
            };
        });
    }
    // Get available time slots for a specific date and ad type
    getAvailableTimeSlots(date, adType) {
        return __awaiter(this, void 0, void 0, function* () {
            const dayOfWeek = new Date(date).getDay();
            // Get all possible time slots for the ad type
            const allTimeSlots = yield this.db
                .select({
                timeSlot: Schema_1.adTimeSlots,
                ad: Schema_1.servicesAds,
            })
                .from(Schema_1.adTimeSlots)
                .innerJoin(Schema_1.servicesAds, (0, drizzle_orm_1.eq)(Schema_1.servicesAds.id, Schema_1.adTimeSlots.adId))
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.servicesAds.status, 'Active'), (0, drizzle_orm_1.eq)(Schema_1.adTimeSlots.isActive, true), (0, drizzle_orm_1.sql) `${Schema_1.adTimeSlots.daysOfWeek} @> ${JSON.stringify([dayOfWeek])}`, adType ? (0, drizzle_orm_1.eq)(Schema_1.servicesAds.adType, adType) : (0, drizzle_orm_1.sql) `true`));
            // Check which ones are already scheduled
            const scheduledSlots = yield this.db
                .select({
                timeSlotId: Schema_1.adSchedules.timeSlotId,
            })
                .from(Schema_1.adSchedules)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.adSchedules.scheduledDate, date), (0, drizzle_orm_1.sql) `${Schema_1.adSchedules.status} IN ('Scheduled', 'Running')`));
            const scheduledSlotIds = new Set(scheduledSlots.map(s => s.timeSlotId));
            return allTimeSlots
                .filter(slot => !scheduledSlotIds.has(slot.timeSlot.id))
                .map(slot => ({
                timeSlot: `${slot.timeSlot.startTime}-${slot.timeSlot.endTime}`,
                dayOfWeek,
                isAvailable: true,
                currentAd: null,
                conflictingAds: [],
                timeSlotData: slot.timeSlot,
            }));
        });
    }
    // ==================== SCHEDULE MANAGEMENT ====================
    // Create a schedule for an ad
    createSchedule(adId, timeSlotId, scheduledDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const schedule = {
                id: crypto.randomUUID(),
                adId,
                timeSlotId,
                scheduledDate,
                scheduledDateTime: new Date(`${scheduledDate}T00:00:00`), // Will be updated with actual time
                status: 'Scheduled',
                retryCount: 0,
                maxRetries: 3,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            return yield this.db.insert(Schema_1.adSchedules).values(schedule).returning();
        });
    }
    // Get schedules for an ad
    getSchedulesByAdId(adId, status, date) {
        return __awaiter(this, void 0, void 0, function* () {
            const conditions = [(0, drizzle_orm_1.eq)(Schema_1.adSchedules.adId, adId)];
            if (status)
                conditions.push((0, drizzle_orm_1.eq)(Schema_1.adSchedules.status, status));
            if (date)
                conditions.push((0, drizzle_orm_1.eq)(Schema_1.adSchedules.scheduledDate, date));
            return yield this.db
                .select({
                schedule: Schema_1.adSchedules,
                timeSlot: Schema_1.adTimeSlots,
            })
                .from(Schema_1.adSchedules)
                .innerJoin(Schema_1.adTimeSlots, (0, drizzle_orm_1.eq)(Schema_1.adTimeSlots.id, Schema_1.adSchedules.timeSlotId))
                .where((0, drizzle_orm_1.and)(...conditions))
                .orderBy(Schema_1.adSchedules.scheduledDateTime);
        });
    }
    // Get all schedules with filters
    getAllSchedules(status, date, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const conditions = [];
            if (status)
                conditions.push((0, drizzle_orm_1.eq)(Schema_1.adSchedules.status, status));
            if (date)
                conditions.push((0, drizzle_orm_1.eq)(Schema_1.adSchedules.scheduledDate, date));
            let query = this.db
                .select({
                schedule: Schema_1.adSchedules,
                timeSlot: Schema_1.adTimeSlots,
                ad: Schema_1.servicesAds,
            })
                .from(Schema_1.adSchedules)
                .innerJoin(Schema_1.adTimeSlots, (0, drizzle_orm_1.eq)(Schema_1.adTimeSlots.id, Schema_1.adSchedules.timeSlotId))
                .innerJoin(Schema_1.servicesAds, (0, drizzle_orm_1.eq)(Schema_1.servicesAds.id, Schema_1.adSchedules.adId))
                .where(conditions.length > 0 ? (0, drizzle_orm_1.and)(...conditions) : (0, drizzle_orm_1.sql) `true`)
                .orderBy(Schema_1.adSchedules.scheduledDateTime);
            if (limit) {
                query = query.limit(limit);
            }
            return yield query;
        });
    }
    // Update schedule status
    updateScheduleStatus(scheduleId, status, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateFields = Object.assign({ status: status, updatedAt: new Date() }, updateData);
            return yield this.db
                .update(Schema_1.adSchedules)
                .set(updateFields)
                .where((0, drizzle_orm_1.eq)(Schema_1.adSchedules.id, scheduleId))
                .returning();
        });
    }
    // Cancel schedule
    cancelSchedule(scheduleId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.updateScheduleStatus(scheduleId, 'Cancelled');
        });
    }
    // Reschedule an ad
    rescheduleAd(scheduleId, newDate, newTimeSlotId) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateData = {
                scheduledDate: newDate,
                status: 'Scheduled',
                updatedAt: new Date(),
            };
            if (newTimeSlotId) {
                updateData.timeSlotId = newTimeSlotId;
            }
            return yield this.db
                .update(Schema_1.adSchedules)
                .set(updateData)
                .where((0, drizzle_orm_1.eq)(Schema_1.adSchedules.id, scheduleId))
                .returning();
        });
    }
    // ==================== EXECUTION LOGS ====================
    // Create execution log
    createExecutionLog(logData) {
        return __awaiter(this, void 0, void 0, function* () {
            const log = Object.assign(Object.assign({ id: crypto.randomUUID() }, logData), { status: logData.status, action: logData.action, createdAt: new Date() });
            return yield this.db.insert(Schema_1.adExecutionLogs).values(log).returning();
        });
    }
    // Get execution logs
    getExecutionLogs(scheduleId, adId, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const conditions = [];
            if (scheduleId)
                conditions.push((0, drizzle_orm_1.eq)(Schema_1.adExecutionLogs.scheduleId, scheduleId));
            if (adId)
                conditions.push((0, drizzle_orm_1.eq)(Schema_1.adExecutionLogs.adId, adId));
            let query = this.db
                .select()
                .from(Schema_1.adExecutionLogs)
                .where(conditions.length > 0 ? (0, drizzle_orm_1.and)(...conditions) : (0, drizzle_orm_1.sql) `true`)
                .orderBy((0, drizzle_orm_1.sql) `${Schema_1.adExecutionLogs.createdAt} DESC`);
            if (limit) {
                query = query.limit(limit);
            }
            return yield query;
        });
    }
    // ==================== ANALYTICS WITH TIME SLOTS ====================
    // Get schedule statistics
    getScheduleStatistics() {
        return __awaiter(this, void 0, void 0, function* () {
            const stats = yield this.db
                .select({
                status: Schema_1.adSchedules.status,
                count: (0, drizzle_orm_1.sql) `count(*)`.as('count'),
            })
                .from(Schema_1.adSchedules)
                .groupBy(Schema_1.adSchedules.status);
            return stats.reduce((acc, stat) => {
                if (stat.status) {
                    acc[stat.status] = Number(stat.count);
                }
                return acc;
            }, {});
        });
    }
    // Get ad performance with schedule data
    getAdPerformanceWithSchedule(adId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [adData] = yield this.db
                .select()
                .from(Schema_1.servicesAds)
                .where((0, drizzle_orm_1.eq)(Schema_1.servicesAds.id, adId))
                .limit(1);
            const timeSlots = yield this.getTimeSlotsByAdId(adId);
            const schedules = yield this.getSchedulesByAdId(adId);
            const logs = yield this.getExecutionLogs(undefined, adId, 50);
            const scheduleStats = yield this.db
                .select({
                totalRuns: (0, drizzle_orm_1.sql) `count(*)`.as('totalRuns'),
                successfulRuns: (0, drizzle_orm_1.sql) `count(*) filter (where ${Schema_1.adSchedules.status} = 'Completed')`.as('successfulRuns'),
                failedRuns: (0, drizzle_orm_1.sql) `count(*) filter (where ${Schema_1.adSchedules.status} = 'Failed')`.as('failedRuns'),
            })
                .from(Schema_1.adSchedules)
                .where((0, drizzle_orm_1.eq)(Schema_1.adSchedules.adId, adId));
            return {
                ad: adData,
                timeSlots,
                schedules,
                logs,
                statistics: scheduleStats[0] || { totalRuns: 0, successfulRuns: 0, failedRuns: 0 },
            };
        });
    }
}
exports.AdModel = AdModel;
