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
exports.VoucherModel = void 0;
// src/Features/Vouchers/Models/VoucherModel.ts
const drizzle_orm_1 = require("drizzle-orm");
const Schema_1 = require("../../../Schema");
class VoucherModel {
    constructor(db) {
        this.db = db;
    }
    // Voucher CRUD operations
    createVoucher(voucherData) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db.insert(Schema_1.vouchers).values(voucherData).returning();
            return result[0];
        });
    }
    updateVoucher(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db.update(Schema_1.vouchers)
                .set(updateData)
                .where((0, drizzle_orm_1.eq)(Schema_1.vouchers.id, id))
                .returning();
            return result[0];
        });
    }
    deleteVoucher(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.delete(Schema_1.vouchers).where((0, drizzle_orm_1.eq)(Schema_1.vouchers.id, id));
        });
    }
    findVoucherById(id, vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const conditions = [(0, drizzle_orm_1.eq)(Schema_1.vouchers.id, id)];
            if (vendorId) {
                conditions.push((0, drizzle_orm_1.eq)(Schema_1.vouchers.vendorId, vendorId));
            }
            const result = yield this.db.select()
                .from(Schema_1.vouchers)
                .where((0, drizzle_orm_1.and)(...conditions))
                .limit(1);
            return result[0] || null;
        });
    }
    findVoucherByCouponCode(couponCode, vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db.select()
                .from(Schema_1.vouchers)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.vouchers.couponCode, couponCode), (0, drizzle_orm_1.eq)(Schema_1.vouchers.vendorId, vendorId)))
                .limit(1);
            return result[0] || null;
        });
    }
    findVouchers(filters, vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const conditions = [];
            if (vendorId) {
                conditions.push((0, drizzle_orm_1.eq)(Schema_1.vouchers.vendorId, vendorId));
            }
            if ((filters === null || filters === void 0 ? void 0 : filters.vendorId) && !vendorId) {
                conditions.push((0, drizzle_orm_1.eq)(Schema_1.vouchers.vendorId, filters.vendorId));
            }
            if ((filters === null || filters === void 0 ? void 0 : filters.isActive) !== undefined) {
                conditions.push((0, drizzle_orm_1.eq)(Schema_1.vouchers.isActive, filters.isActive));
            }
            if (filters === null || filters === void 0 ? void 0 : filters.couponCode) {
                conditions.push((0, drizzle_orm_1.eq)(Schema_1.vouchers.couponCode, filters.couponCode));
            }
            if (filters === null || filters === void 0 ? void 0 : filters.validNow) {
                const now = new Date();
                conditions.push((0, drizzle_orm_1.and)((0, drizzle_orm_1.lte)(Schema_1.vouchers.validFrom, now), (0, drizzle_orm_1.gte)(Schema_1.vouchers.validUntil, now)));
            }
            if (filters === null || filters === void 0 ? void 0 : filters.serviceType) {
                conditions.push((0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(Schema_1.vouchers.applicableFor, 'All Services'), (0, drizzle_orm_1.sql) `${filters.serviceType} = ANY(${Schema_1.vouchers.serviceTypes})`));
            }
            const result = yield this.db.select()
                .from(Schema_1.vouchers)
                .where((0, drizzle_orm_1.and)(...conditions))
                .orderBy((0, drizzle_orm_1.desc)(Schema_1.vouchers.createdAt));
            return result;
        });
    }
    checkDuplicateCouponCode(couponCode, vendorId, excludeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const conditions = [
                (0, drizzle_orm_1.eq)(Schema_1.vouchers.vendorId, vendorId),
                (0, drizzle_orm_1.eq)(Schema_1.vouchers.couponCode, couponCode)
            ];
            if (excludeId) {
                conditions.push((0, drizzle_orm_1.sql) `${Schema_1.vouchers.id} != ${excludeId}`);
            }
            const result = yield this.db.select()
                .from(Schema_1.vouchers)
                .where((0, drizzle_orm_1.and)(...conditions))
                .limit(1);
            return result.length > 0;
        });
    }
    // Voucher Usage operations
    createVoucherUsage(usageData) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db.insert(Schema_1.voucherUsage).values(usageData).returning();
            return result[0];
        });
    }
    findVoucherUsage(filters, vendorVoucherIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const conditions = [];
            if (filters === null || filters === void 0 ? void 0 : filters.voucherId) {
                conditions.push((0, drizzle_orm_1.eq)(Schema_1.voucherUsage.voucherId, filters.voucherId));
            }
            if (filters === null || filters === void 0 ? void 0 : filters.userId) {
                conditions.push((0, drizzle_orm_1.eq)(Schema_1.voucherUsage.userId, filters.userId));
            }
            if (filters === null || filters === void 0 ? void 0 : filters.serviceType) {
                conditions.push((0, drizzle_orm_1.eq)(Schema_1.voucherUsage.serviceType, filters.serviceType));
            }
            if (filters === null || filters === void 0 ? void 0 : filters.dateFrom) {
                conditions.push((0, drizzle_orm_1.gte)(Schema_1.voucherUsage.appliedAt, new Date(filters.dateFrom)));
            }
            if (filters === null || filters === void 0 ? void 0 : filters.dateTo) {
                conditions.push((0, drizzle_orm_1.lte)(Schema_1.voucherUsage.appliedAt, new Date(filters.dateTo)));
            }
            if (vendorVoucherIds && vendorVoucherIds.length > 0) {
                conditions.push((0, drizzle_orm_1.sql) `${Schema_1.voucherUsage.voucherId} = ANY(${vendorVoucherIds})`);
            }
            const result = yield this.db.select()
                .from(Schema_1.voucherUsage)
                .where((0, drizzle_orm_1.and)(...conditions))
                .orderBy((0, drizzle_orm_1.desc)(Schema_1.voucherUsage.appliedAt));
            return result;
        });
    }
    getUserVoucherUsageCount(voucherId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const result = yield this.db.select({ count: (0, drizzle_orm_1.sql) `count(*)` })
                .from(Schema_1.voucherUsage)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.voucherUsage.voucherId, voucherId), (0, drizzle_orm_1.eq)(Schema_1.voucherUsage.userId, userId)));
            return ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.count) || 0;
        });
    }
    findUserVoucherUsage(userId, voucherId) {
        return __awaiter(this, void 0, void 0, function* () {
            const conditions = [(0, drizzle_orm_1.eq)(Schema_1.voucherUsage.userId, userId)];
            if (voucherId) {
                conditions.push((0, drizzle_orm_1.eq)(Schema_1.voucherUsage.voucherId, voucherId));
            }
            const result = yield this.db.select()
                .from(Schema_1.voucherUsage)
                .where((0, drizzle_orm_1.and)(...conditions))
                .orderBy((0, drizzle_orm_1.desc)(Schema_1.voucherUsage.appliedAt));
            return result;
        });
    }
    getVoucherWithUsageCount(id, vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db.select({
                voucher: Schema_1.vouchers,
                usageCount: (0, drizzle_orm_1.sql) `count(${Schema_1.voucherUsage.id})`
            })
                .from(Schema_1.vouchers)
                .leftJoin(Schema_1.voucherUsage, (0, drizzle_orm_1.eq)(Schema_1.vouchers.id, Schema_1.voucherUsage.voucherId))
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.vouchers.id, id), (0, drizzle_orm_1.eq)(Schema_1.vouchers.vendorId, vendorId)))
                .groupBy(Schema_1.vouchers.id)
                .limit(1);
            return result[0] || null;
        });
    }
    incrementVoucherUsageCount(voucherId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.update(Schema_1.vouchers)
                .set({
                currentUsageCount: (0, drizzle_orm_1.sql) `${Schema_1.vouchers.currentUsageCount} + 1`,
                updatedAt: new Date()
            })
                .where((0, drizzle_orm_1.eq)(Schema_1.vouchers.id, voucherId));
        });
    }
    // Statistics operations
    getVendorVoucherIds(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db.select({ id: Schema_1.vouchers.id })
                .from(Schema_1.vouchers)
                .where((0, drizzle_orm_1.eq)(Schema_1.vouchers.vendorId, vendorId));
            return result.map((v) => v.id);
        });
    }
    getVoucherStatistics(vendorId, dateFrom, dateTo) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const conditions = [];
            if (vendorId) {
                conditions.push((0, drizzle_orm_1.eq)(Schema_1.vouchers.vendorId, vendorId));
            }
            // Get total vouchers count
            const totalVouchersResult = yield this.db.select({ count: (0, drizzle_orm_1.sql) `count(*)` })
                .from(Schema_1.vouchers)
                .where((0, drizzle_orm_1.and)(...conditions));
            // Get active vouchers count
            const activeVouchersResult = yield this.db.select({ count: (0, drizzle_orm_1.sql) `count(*)` })
                .from(Schema_1.vouchers)
                .where((0, drizzle_orm_1.and)(...conditions, (0, drizzle_orm_1.eq)(Schema_1.vouchers.isActive, true)));
            // Get usage statistics
            const usageConditions = [...conditions];
            if (dateFrom) {
                usageConditions.push((0, drizzle_orm_1.gte)(Schema_1.voucherUsage.appliedAt, new Date(dateFrom)));
            }
            if (dateTo) {
                usageConditions.push((0, drizzle_orm_1.lte)(Schema_1.voucherUsage.appliedAt, new Date(dateTo)));
            }
            const usageStatsQuery = this.db.select({
                totalUsage: (0, drizzle_orm_1.sql) `count(*)`,
                totalDiscountGiven: (0, drizzle_orm_1.sql) `sum(${Schema_1.voucherUsage.discountAmount})`
            })
                .from(Schema_1.voucherUsage)
                .innerJoin(Schema_1.vouchers, (0, drizzle_orm_1.eq)(Schema_1.voucherUsage.voucherId, Schema_1.vouchers.id))
                .where((0, drizzle_orm_1.and)(...usageConditions));
            const usageStats = yield usageStatsQuery;
            return {
                totalVouchers: totalVouchersResult[0].count || 0,
                activeVouchers: activeVouchersResult[0].count || 0,
                totalUsage: ((_a = usageStats[0]) === null || _a === void 0 ? void 0 : _a.totalUsage) || 0,
                totalDiscountGiven: ((_b = usageStats[0]) === null || _b === void 0 ? void 0 : _b.totalDiscountGiven) || 0
            };
        });
    }
    // Relation resolvers
    findUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db.select()
                .from(Schema_1.users)
                .where((0, drizzle_orm_1.eq)(Schema_1.users.id, userId))
                .limit(1);
            return result[0] || null;
        });
    }
    // Transaction support
    executeInTransaction(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction(callback);
        });
    }
    // ========== ADMIN-SPECIFIC METHODS ==========
    // Note: Some methods require additional schema fields to be fully functional
    // Advanced voucher queries for admin
    adminFindAllVouchers(filters, pagination) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const conditions = [];
            // Apply all filters
            if (filters === null || filters === void 0 ? void 0 : filters.vendorId) {
                conditions.push((0, drizzle_orm_1.eq)(Schema_1.vouchers.vendorId, filters.vendorId));
            }
            if ((filters === null || filters === void 0 ? void 0 : filters.vendorIds) && filters.vendorIds.length > 0) {
                conditions.push((0, drizzle_orm_1.sql) `${Schema_1.vouchers.vendorId} = ANY(${filters.vendorIds})`);
            }
            if ((filters === null || filters === void 0 ? void 0 : filters.isActive) !== undefined) {
                conditions.push((0, drizzle_orm_1.eq)(Schema_1.vouchers.isActive, filters.isActive));
            }
            if (filters === null || filters === void 0 ? void 0 : filters.discountType) {
                conditions.push((0, drizzle_orm_1.eq)(Schema_1.vouchers.discountType, filters.discountType));
            }
            if ((filters === null || filters === void 0 ? void 0 : filters.expired) !== undefined) {
                const now = new Date();
                if (filters.expired) {
                    conditions.push((0, drizzle_orm_1.sql) `${Schema_1.vouchers.validUntil} < ${now}`);
                }
                else {
                    conditions.push((0, drizzle_orm_1.sql) `${Schema_1.vouchers.validUntil} >= ${now}`);
                }
            }
            if (filters === null || filters === void 0 ? void 0 : filters.minDiscountValue) {
                conditions.push((0, drizzle_orm_1.sql) `CAST(${Schema_1.vouchers.discountValue} AS DECIMAL) >= ${filters.minDiscountValue}`);
            }
            if (filters === null || filters === void 0 ? void 0 : filters.maxDiscountValue) {
                conditions.push((0, drizzle_orm_1.sql) `CAST(${Schema_1.vouchers.discountValue} AS DECIMAL) <= ${filters.maxDiscountValue}`);
            }
            if (filters === null || filters === void 0 ? void 0 : filters.createdFrom) {
                conditions.push((0, drizzle_orm_1.gte)(Schema_1.vouchers.createdAt, filters.createdFrom));
            }
            if (filters === null || filters === void 0 ? void 0 : filters.createdTo) {
                conditions.push((0, drizzle_orm_1.lte)(Schema_1.vouchers.createdAt, filters.createdTo));
            }
            // TODO: Add flagged and flagType filters when schema is updated
            // if (filters?.flagged !== undefined) {
            //     conditions.push(eq(vouchers.flagged, filters.flagged));
            // }
            // Count total records
            const countResult = yield this.db.select({ count: (0, drizzle_orm_1.sql) `count(*)` })
                .from(Schema_1.vouchers)
                .where((0, drizzle_orm_1.and)(...conditions));
            const totalCount = ((_a = countResult[0]) === null || _a === void 0 ? void 0 : _a.count) || 0;
            // Apply pagination
            const page = (pagination === null || pagination === void 0 ? void 0 : pagination.page) || 1;
            const limit = (pagination === null || pagination === void 0 ? void 0 : pagination.limit) || 10;
            const offset = (page - 1) * limit;
            // Get paginated results
            let query = this.db.select()
                .from(Schema_1.vouchers)
                .where((0, drizzle_orm_1.and)(...conditions))
                .limit(limit)
                .offset(offset);
            // Apply sorting with safe column access
            if ((pagination === null || pagination === void 0 ? void 0 : pagination.sortBy) && pagination.sortBy === 'createdAt') {
                const sortOrder = pagination.sortOrder === 'ASC' ? drizzle_orm_1.asc : drizzle_orm_1.desc;
                query = query.orderBy(sortOrder(Schema_1.vouchers.createdAt));
            }
            else if ((pagination === null || pagination === void 0 ? void 0 : pagination.sortBy) && pagination.sortBy === 'updatedAt') {
                const sortOrder = pagination.sortOrder === 'ASC' ? drizzle_orm_1.asc : drizzle_orm_1.desc;
                query = query.orderBy(sortOrder(Schema_1.vouchers.updatedAt));
            }
            else {
                query = query.orderBy((0, drizzle_orm_1.desc)(Schema_1.vouchers.createdAt));
            }
            const result = yield query;
            const totalPages = Math.ceil(totalCount / limit);
            return {
                vouchers: result,
                totalCount,
                currentPage: page,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1
            };
        });
    }
    // Get comprehensive analytics for admin dashboard
    getAdminVoucherAnalytics(dateFrom, dateTo) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            const conditions = [];
            if (dateFrom) {
                conditions.push((0, drizzle_orm_1.gte)(Schema_1.vouchers.createdAt, new Date(dateFrom)));
            }
            if (dateTo) {
                conditions.push((0, drizzle_orm_1.lte)(Schema_1.vouchers.createdAt, new Date(dateTo)));
            }
            // Get total system vouchers
            const totalVouchersResult = yield this.db.select({ count: (0, drizzle_orm_1.sql) `count(*)` })
                .from(Schema_1.vouchers)
                .where((0, drizzle_orm_1.and)(...conditions));
            // Get total system usage
            const usageConditions = [...conditions];
            const totalUsageResult = yield this.db.select({
                count: (0, drizzle_orm_1.sql) `count(*)`,
                totalDiscount: (0, drizzle_orm_1.sql) `sum(${Schema_1.voucherUsage.discountAmount})`
            })
                .from(Schema_1.voucherUsage)
                .innerJoin(Schema_1.vouchers, (0, drizzle_orm_1.eq)(Schema_1.voucherUsage.voucherId, Schema_1.vouchers.id))
                .where((0, drizzle_orm_1.and)(...usageConditions));
            // TODO: Add fraudulent usage count when schema supports it
            // const fraudulentUsageResult = await this.db.select({ count: sql<number>`count(*)` })
            //     .from(voucherUsage)
            //     .where(eq(voucherUsage.fraudulent, true));
            // Get vendor performance data
            const vendorPerformanceResult = yield this.db.select({
                vendorId: Schema_1.vouchers.vendorId,
                totalVouchers: (0, drizzle_orm_1.sql) `count(DISTINCT ${Schema_1.vouchers.id})`,
                totalUsage: (0, drizzle_orm_1.sql) `count(${Schema_1.voucherUsage.id})`,
                totalDiscountGiven: (0, drizzle_orm_1.sql) `sum(${Schema_1.voucherUsage.discountAmount})`
            })
                .from(Schema_1.vouchers)
                .leftJoin(Schema_1.voucherUsage, (0, drizzle_orm_1.eq)(Schema_1.vouchers.id, Schema_1.voucherUsage.voucherId))
                .groupBy(Schema_1.vouchers.vendorId)
                .limit(10)
                .orderBy((0, drizzle_orm_1.desc)((0, drizzle_orm_1.sql) `sum(${Schema_1.voucherUsage.discountAmount})`));
            // Get voucher distribution by type
            const typeDistributionResult = yield this.db.select({
                discountType: Schema_1.vouchers.discountType,
                count: (0, drizzle_orm_1.sql) `count(*)`,
                totalValue: (0, drizzle_orm_1.sql) `sum(CAST(${Schema_1.vouchers.discountValue} AS DECIMAL))`
            })
                .from(Schema_1.vouchers)
                .groupBy(Schema_1.vouchers.discountType);
            return {
                totalSystemVouchers: ((_a = totalVouchersResult[0]) === null || _a === void 0 ? void 0 : _a.count) || 0,
                totalSystemUsage: ((_b = totalUsageResult[0]) === null || _b === void 0 ? void 0 : _b.count) || 0,
                totalSystemDiscountGiven: ((_c = totalUsageResult[0]) === null || _c === void 0 ? void 0 : _c.totalDiscount) || 0,
                totalSystemRevenueLost: ((_d = totalUsageResult[0]) === null || _d === void 0 ? void 0 : _d.totalDiscount) || 0,
                averageDiscountPerVoucher: (((_e = totalUsageResult[0]) === null || _e === void 0 ? void 0 : _e.totalDiscount) || 0) / (((_f = totalVouchersResult[0]) === null || _f === void 0 ? void 0 : _f.count) || 1),
                topPerformingVendors: vendorPerformanceResult.map((v) => ({
                    vendorId: v.vendorId,
                    vendorName: `Vendor ${v.vendorId}`,
                    totalVouchers: v.totalVouchers,
                    totalUsage: v.totalUsage,
                    totalDiscountGiven: v.totalDiscountGiven,
                    averageVoucherValue: v.totalDiscountGiven / (v.totalVouchers || 1),
                    successRate: (v.totalUsage / (v.totalVouchers || 1)) * 100
                })),
                voucherDistributionByType: typeDistributionResult.map((t) => {
                    var _a;
                    return ({
                        discountType: t.discountType,
                        count: t.count,
                        totalValue: t.totalValue,
                        percentage: (t.count / (((_a = totalVouchersResult[0]) === null || _a === void 0 ? void 0 : _a.count) || 1)) * 100
                    });
                }),
                monthlyTrends: [], // Would require more complex date aggregation
                fraudulentUsageCount: 0, // TODO: Implement when schema supports it
                suspiciousActivities: [] // Would come from separate fraud detection system
            };
        });
    }
    // Get flagged vouchers for admin review (simplified version)
    getFlaggedVouchers(flagType) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: This would require additional schema fields for flagging
            // For now, return vouchers that might need attention (high usage, expired but active, etc.)
            const suspiciousConditions = [
                (0, drizzle_orm_1.sql) `${Schema_1.vouchers.currentUsageCount} > 100`, // High usage
                (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.vouchers.isActive, true), (0, drizzle_orm_1.sql) `${Schema_1.vouchers.validUntil} < ${new Date()}`), // Active but expired
            ];
            const result = yield this.db.select()
                .from(Schema_1.vouchers)
                .where((0, drizzle_orm_1.or)(...suspiciousConditions))
                .orderBy((0, drizzle_orm_1.desc)(Schema_1.vouchers.createdAt))
                .limit(50);
            return result.map((v) => ({
                voucher: v,
                flagType: 'SUSPICIOUS_PATTERN',
                flagReason: 'High usage or expired but active',
                flaggedAt: new Date(),
                severity: 3,
                investigationStatus: 'PENDING',
                investigatorId: undefined
            }));
        });
    }
    // Bulk operations for admin
    bulkUpdateVouchers(voucherIds, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateData = Object.assign(Object.assign({}, updates), { updatedAt: new Date() });
            // Remove undefined values
            Object.keys(updateData).forEach(key => {
                if (updateData[key] === undefined) {
                    delete updateData[key];
                }
            });
            const result = yield this.db.update(Schema_1.vouchers)
                .set(updateData)
                .where((0, drizzle_orm_1.sql) `${Schema_1.vouchers.id} = ANY(${voucherIds})`)
                .returning();
            return result;
        });
    }
    bulkDeactivateVouchers(voucherIds, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.update(Schema_1.vouchers)
                .set({
                isActive: false,
                // TODO: Add flagged fields when schema supports it
                updatedAt: new Date()
            })
                .where((0, drizzle_orm_1.sql) `${Schema_1.vouchers.id} = ANY(${voucherIds})`);
            return voucherIds.length;
        });
    }
    // Fraud detection and management (simplified)
    markVoucherUsageAsFraud(usageId, reason, investigatorId) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: This would require additional schema fields
            // For now, we could use description field or create separate fraud table
            const result = yield this.db.select()
                .from(Schema_1.voucherUsage)
                .where((0, drizzle_orm_1.eq)(Schema_1.voucherUsage.id, usageId))
                .limit(1);
            if (result.length === 0) {
                throw new Error('Voucher usage not found');
            }
            // Would update fraud fields when schema supports it
            return result[0];
        });
    }
    // System maintenance operations
    getExpiredVouchers(daysOld) {
        return __awaiter(this, void 0, void 0, function* () {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - daysOld);
            const result = yield this.db.select()
                .from(Schema_1.vouchers)
                .where((0, drizzle_orm_1.sql) `${Schema_1.vouchers.validUntil} < ${cutoffDate}`)
                .orderBy((0, drizzle_orm_1.asc)(Schema_1.vouchers.validUntil));
            return result;
        });
    }
    cleanupExpiredVouchers(daysOld) {
        return __awaiter(this, void 0, void 0, function* () {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - daysOld);
            // Only delete vouchers that are expired and have no usage
            const vouchersToDelete = yield this.db.select({ id: Schema_1.vouchers.id })
                .from(Schema_1.vouchers)
                .leftJoin(Schema_1.voucherUsage, (0, drizzle_orm_1.eq)(Schema_1.vouchers.id, Schema_1.voucherUsage.voucherId))
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.sql) `${Schema_1.vouchers.validUntil} < ${cutoffDate}`, (0, drizzle_orm_1.eq)(Schema_1.vouchers.isActive, false), (0, drizzle_orm_1.sql) `${Schema_1.voucherUsage.id} IS NULL` // No usage records
            ));
            if (vouchersToDelete.length === 0) {
                return 0;
            }
            const idsToDelete = vouchersToDelete.map((v) => v.id);
            yield this.db.delete(Schema_1.vouchers)
                .where((0, drizzle_orm_1.sql) `${Schema_1.vouchers.id} = ANY(${idsToDelete})`);
            return idsToDelete.length;
        });
    }
    // Vendor management operations
    suspendVendorVouchers(vendorId, reason, durationDays) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.update(Schema_1.vouchers)
                .set({
                isActive: false,
                // TODO: Add suspension fields when schema supports it
                updatedAt: new Date()
            })
                .where((0, drizzle_orm_1.eq)(Schema_1.vouchers.vendorId, vendorId));
            return true;
        });
    }
    restoreVendorVouchers(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.update(Schema_1.vouchers)
                .set({
                isActive: true,
                updatedAt: new Date()
            })
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.vouchers.vendorId, vendorId), (0, drizzle_orm_1.gte)(Schema_1.vouchers.validUntil, new Date()) // Only restore non-expired vouchers
            ));
            return true;
        });
    }
    // Advanced analytics methods
    getVendorVoucherComparison(vendorIds, dateFrom, dateTo) {
        return __awaiter(this, void 0, void 0, function* () {
            const conditions = [(0, drizzle_orm_1.sql) `${Schema_1.vouchers.vendorId} = ANY(${vendorIds})`];
            if (dateFrom) {
                conditions.push((0, drizzle_orm_1.gte)(Schema_1.vouchers.createdAt, new Date(dateFrom)));
            }
            if (dateTo) {
                conditions.push((0, drizzle_orm_1.lte)(Schema_1.vouchers.createdAt, new Date(dateTo)));
            }
            const result = yield this.db.select({
                vendorId: Schema_1.vouchers.vendorId,
                totalVouchers: (0, drizzle_orm_1.sql) `count(DISTINCT ${Schema_1.vouchers.id})`,
                activeVouchers: (0, drizzle_orm_1.sql) `count(DISTINCT CASE WHEN ${Schema_1.vouchers.isActive} = true THEN ${Schema_1.vouchers.id} END)`,
                totalUsage: (0, drizzle_orm_1.sql) `count(${Schema_1.voucherUsage.id})`,
                totalDiscountGiven: (0, drizzle_orm_1.sql) `sum(${Schema_1.voucherUsage.discountAmount})`
            })
                .from(Schema_1.vouchers)
                .leftJoin(Schema_1.voucherUsage, (0, drizzle_orm_1.eq)(Schema_1.vouchers.id, Schema_1.voucherUsage.voucherId))
                .where((0, drizzle_orm_1.and)(...conditions))
                .groupBy(Schema_1.vouchers.vendorId);
            return result.map((r) => ({
                vendorId: r.vendorId,
                vendorName: `Vendor ${r.vendorId}`,
                totalVouchers: r.totalVouchers,
                activeVouchers: r.activeVouchers,
                totalUsage: r.totalUsage,
                totalDiscountGiven: r.totalDiscountGiven,
                averageUsagePerVoucher: r.totalUsage / (r.totalVouchers || 1),
                topPerformingVoucher: undefined,
                conversionRate: (r.totalUsage / (r.totalVouchers || 1)) * 100,
                fraudIncidents: 0 // TODO: Implement when schema supports it
            }));
        });
    }
    // Emergency operations
    emergencyDisableAllVouchers(reason) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.update(Schema_1.vouchers)
                .set({
                isActive: false,
                updatedAt: new Date()
            })
                .where((0, drizzle_orm_1.eq)(Schema_1.vouchers.isActive, true));
            return true;
        });
    }
    emergencyEnableAllVouchers() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.update(Schema_1.vouchers)
                .set({
                isActive: true,
                updatedAt: new Date()
            })
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.vouchers.isActive, false), (0, drizzle_orm_1.gte)(Schema_1.vouchers.validUntil, new Date()) // Only enable non-expired vouchers
            ));
            return true;
        });
    }
    // Create system-wide promotional vouchers
    createSystemPromotionVouchers(promotion) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdVouchers = [];
            for (const vendorId of promotion.vendorIds) {
                const couponCode = promotion.autoGenerateCodes
                    ? `${promotion.codePrefix || 'PROMO'}_${vendorId}_${Date.now()}`
                    : `${promotion.title.toUpperCase()}_${vendorId}`;
                const voucherData = {
                    id: (0, drizzle_orm_1.sql) `gen_random_uuid()`,
                    vendorId,
                    couponCode,
                    title: promotion.title,
                    description: promotion.description,
                    discountType: promotion.discountType,
                    discountValue: String(promotion.discountValue),
                    maxDiscountAmount: promotion.maxDiscountAmount ? String(promotion.maxDiscountAmount) : undefined,
                    minOrderValue: promotion.minOrderValue ? String(promotion.minOrderValue) : undefined,
                    applicableFor: promotion.applicableFor,
                    serviceTypes: promotion.serviceTypes,
                    totalUsageLimit: promotion.totalUsageLimit,
                    usagePerUser: promotion.usagePerUser,
                    currentUsageCount: 0,
                    validFrom: promotion.validFrom,
                    validUntil: promotion.validUntil,
                    isActive: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
                const result = yield this.db.insert(Schema_1.vouchers).values(voucherData).returning();
                createdVouchers.push(result[0]);
            }
            return createdVouchers;
        });
    }
}
exports.VoucherModel = VoucherModel;
