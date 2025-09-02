// src/Features/Vouchers/Models/VoucherModel.ts
import { eq, and, or, gte, lte, sql, desc, asc } from 'drizzle-orm';
import { vouchers, voucherUsage, users } from '../../../Schema';
import {
    Voucher,
    VoucherUsage,
    VoucherFilters,
    VoucherUsageFilters,
    CreateVoucherInput,
    UpdateVoucherInput,
    ServiceType,
    AdminVoucherFilters,
    PaginationInput,
    VoucherListResponse,
    AdminVoucherAnalytics,
    FlagType,
    FlaggedVoucher,
    VendorVoucherPerformance,
    VoucherFraudReport,
    TrendPeriod,
    TrendGroupBy,
    VoucherTrendAnalysis,
    VoucherComplianceReport,
    VoucherRefund,
    BulkVoucherUpdateInput,
    SystemPromotionInput
} from '../Types';

export class VoucherModel {
    constructor(private db: any) {}

    // Voucher CRUD operations
    async createVoucher(voucherData: any): Promise<Voucher> {
        const result = await this.db.insert(vouchers).values(voucherData).returning();
        return result[0] as unknown as Voucher;
    }

    async updateVoucher(id: string, updateData: any): Promise<Voucher> {
        const result = await this.db.update(vouchers)
            .set(updateData)
            .where(eq(vouchers.id, id))
            .returning();
        return result[0] as unknown as Voucher;
    }

    async deleteVoucher(id: string): Promise<void> {
        await this.db.delete(vouchers).where(eq(vouchers.id, id));
    }

    async findVoucherById(id: string, vendorId?: string): Promise<Voucher | null> {
        const conditions = [eq(vouchers.id, id)];
        
        if (vendorId) {
            conditions.push(eq(vouchers.vendorId, vendorId));
        }

        const result = await this.db.select()
            .from(vouchers)
            .where(and(...conditions))
            .limit(1);
        
        return result[0] as unknown as Voucher || null;
    }

    async findVoucherByCouponCode(couponCode: string, vendorId: string): Promise<Voucher | null> {
        const result = await this.db.select()
            .from(vouchers)
            .where(and(
                eq(vouchers.couponCode, couponCode),
                eq(vouchers.vendorId, vendorId)
            ))
            .limit(1);
        
        return result[0] as unknown as Voucher || null;
    }

    async findVouchers(filters?: VoucherFilters, vendorId?: string): Promise<Voucher[]> {
        const conditions = [];
        
        if (vendorId) {
            conditions.push(eq(vouchers.vendorId, vendorId));
        }
        
        if (filters?.vendorId && !vendorId) {
            conditions.push(eq(vouchers.vendorId, filters.vendorId));
        }
        
        if (filters?.isActive !== undefined) {
            conditions.push(eq(vouchers.isActive, filters.isActive));
        }
        
        if (filters?.couponCode) {
            conditions.push(eq(vouchers.couponCode, filters.couponCode));
        }
        
        if (filters?.validNow) {
            const now = new Date();
            conditions.push(
                and(
                    lte(vouchers.validFrom, now),
                    gte(vouchers.validUntil, now)
                )
            );
        }
        
        if (filters?.serviceType) {
            conditions.push(
                or(
                    eq(vouchers.applicableFor, 'All Services'),
                    sql`${filters.serviceType} = ANY(${vouchers.serviceTypes})`
                )
            );
        }
        
        const result = await this.db.select()
            .from(vouchers)
            .where(and(...conditions))
            .orderBy(desc(vouchers.createdAt));
        
        return result as unknown as Voucher[];
    }

    async checkDuplicateCouponCode(couponCode: string, vendorId: string, excludeId?: string): Promise<boolean> {
        const conditions = [
            eq(vouchers.vendorId, vendorId),
            eq(vouchers.couponCode, couponCode)
        ];

        if (excludeId) {
            conditions.push(sql`${vouchers.id} != ${excludeId}`);
        }

        const result = await this.db.select()
            .from(vouchers)
            .where(and(...conditions))
            .limit(1);
        
        return result.length > 0;
    }

    // Voucher Usage operations
    async createVoucherUsage(usageData: any): Promise<VoucherUsage> {
        const result = await this.db.insert(voucherUsage).values(usageData).returning();
        return result[0] as unknown as VoucherUsage;
    }

    async findVoucherUsage(filters?: VoucherUsageFilters, vendorVoucherIds?: string[]): Promise<VoucherUsage[]> {
        const conditions = [];
        
        if (filters?.voucherId) {
            conditions.push(eq(voucherUsage.voucherId, filters.voucherId));
        }
        
        if (filters?.userId) {
            conditions.push(eq(voucherUsage.userId, filters.userId));
        }
        
        if (filters?.serviceType) {
            conditions.push(eq(voucherUsage.serviceType, filters.serviceType));
        }
        
        if (filters?.dateFrom) {
            conditions.push(gte(voucherUsage.appliedAt, new Date(filters.dateFrom)));
        }
        
        if (filters?.dateTo) {
            conditions.push(lte(voucherUsage.appliedAt, new Date(filters.dateTo)));
        }
        
        if (vendorVoucherIds && vendorVoucherIds.length > 0) {
            conditions.push(sql`${voucherUsage.voucherId} = ANY(${vendorVoucherIds})`);
        }
        
        const result = await this.db.select()
            .from(voucherUsage)
            .where(and(...conditions))
            .orderBy(desc(voucherUsage.appliedAt));
        
        return result as unknown as VoucherUsage[];
    }

    async getUserVoucherUsageCount(voucherId: string, userId: string): Promise<number> {
        const result = await this.db.select({ count: sql<number>`count(*)` })
            .from(voucherUsage)
            .where(and(
                eq(voucherUsage.voucherId, voucherId),
                eq(voucherUsage.userId, userId)
            ));
        
        return result[0]?.count || 0;
    }

    async findUserVoucherUsage(userId: string, voucherId?: string): Promise<VoucherUsage[]> {
        const conditions = [eq(voucherUsage.userId, userId)];
        
        if (voucherId) {
            conditions.push(eq(voucherUsage.voucherId, voucherId));
        }
        
        const result = await this.db.select()
            .from(voucherUsage)
            .where(and(...conditions))
            .orderBy(desc(voucherUsage.appliedAt));
        
        return result as unknown as VoucherUsage[];
    }

    async getVoucherWithUsageCount(id: string, vendorId: string): Promise<{ voucher: any; usageCount: number } | null> {
        const result = await this.db.select({
            voucher: vouchers,
            usageCount: sql<number>`count(${voucherUsage.id})`
        })
            .from(vouchers)
            .leftJoin(voucherUsage, eq(vouchers.id, voucherUsage.voucherId))
            .where(and(
                eq(vouchers.id, id),
                eq(vouchers.vendorId, vendorId)
            ))
            .groupBy(vouchers.id)
            .limit(1);
        
        return result[0] || null;
    }

    async incrementVoucherUsageCount(voucherId: string): Promise<void> {
        await this.db.update(vouchers)
            .set({ 
                currentUsageCount: sql`${vouchers.currentUsageCount} + 1`,
                updatedAt: new Date()
            })
            .where(eq(vouchers.id, voucherId));
    }

    // Statistics operations
    async getVendorVoucherIds(vendorId: string): Promise<string[]> {
        const result = await this.db.select({ id: vouchers.id })
            .from(vouchers)
            .where(eq(vouchers.vendorId, vendorId));
        
        return result.map((v: { id: any; }) => v.id);
    }

    async getVoucherStatistics(vendorId?: string, dateFrom?: string, dateTo?: string): Promise<{
        totalVouchers: number;
        activeVouchers: number;
        totalUsage: number;
        totalDiscountGiven: number;
    }> {
        const conditions = [];
        if (vendorId) {
            conditions.push(eq(vouchers.vendorId, vendorId));
        }
        
        // Get total vouchers count
        const totalVouchersResult = await this.db.select({ count: sql<number>`count(*)` })
            .from(vouchers)
            .where(and(...conditions));
        
        // Get active vouchers count
        const activeVouchersResult = await this.db.select({ count: sql<number>`count(*)` })
            .from(vouchers)
            .where(and(...conditions, eq(vouchers.isActive, true)));
        
        // Get usage statistics
        const usageConditions = [...conditions];
        if (dateFrom) {
            usageConditions.push(gte(voucherUsage.appliedAt, new Date(dateFrom)));
        }
        if (dateTo) {
            usageConditions.push(lte(voucherUsage.appliedAt, new Date(dateTo)));
        }
        
        const usageStatsQuery = this.db.select({
            totalUsage: sql<number>`count(*)`,
            totalDiscountGiven: sql<number>`sum(${voucherUsage.discountAmount})`
        })
            .from(voucherUsage)
            .innerJoin(vouchers, eq(voucherUsage.voucherId, vouchers.id))
            .where(and(...usageConditions));
        
        const usageStats = await usageStatsQuery;
        
        return {
            totalVouchers: totalVouchersResult[0].count || 0,
            activeVouchers: activeVouchersResult[0].count || 0,
            totalUsage: usageStats[0]?.totalUsage || 0,
            totalDiscountGiven: usageStats[0]?.totalDiscountGiven || 0
        };
    }

    // Relation resolvers
    async findUserById(userId: string): Promise<any> {
        const result = await this.db.select()
            .from(users)
            .where(eq(users.id, userId))
            .limit(1);
        
        return result[0] || null;
    }

    // Transaction support
    async executeInTransaction<T>(callback: (tx: any) => Promise<T>): Promise<T> {
        return await this.db.transaction(callback);
    }

    // ========== ADMIN-SPECIFIC METHODS ==========
    // Note: Some methods require additional schema fields to be fully functional

    // Advanced voucher queries for admin
    async adminFindAllVouchers(filters?: AdminVoucherFilters, pagination?: PaginationInput): Promise<VoucherListResponse> {
        const conditions = [];
        
        // Apply all filters
        if (filters?.vendorId) {
            conditions.push(eq(vouchers.vendorId, filters.vendorId));
        }
        
        if (filters?.vendorIds && filters.vendorIds.length > 0) {
            conditions.push(sql`${vouchers.vendorId} = ANY(${filters.vendorIds})`);
        }
        
        if (filters?.isActive !== undefined) {
            conditions.push(eq(vouchers.isActive, filters.isActive));
        }
        
        if (filters?.discountType) {
            conditions.push(eq(vouchers.discountType, filters.discountType));
        }
        
        if (filters?.expired !== undefined) {
            const now = new Date();
            if (filters.expired) {
                conditions.push(sql`${vouchers.validUntil} < ${now}`);
            } else {
                conditions.push(sql`${vouchers.validUntil} >= ${now}`);
            }
        }
        
        if (filters?.minDiscountValue) {
            conditions.push(sql`CAST(${vouchers.discountValue} AS DECIMAL) >= ${filters.minDiscountValue}`);
        }
        
        if (filters?.maxDiscountValue) {
            conditions.push(sql`CAST(${vouchers.discountValue} AS DECIMAL) <= ${filters.maxDiscountValue}`);
        }
        
        if (filters?.createdFrom) {
            conditions.push(gte(vouchers.createdAt, filters.createdFrom));
        }
        
        if (filters?.createdTo) {
            conditions.push(lte(vouchers.createdAt, filters.createdTo));
        }
        
        // TODO: Add flagged and flagType filters when schema is updated
        // if (filters?.flagged !== undefined) {
        //     conditions.push(eq(vouchers.flagged, filters.flagged));
        // }
        
        // Count total records
        const countResult = await this.db.select({ count: sql<number>`count(*)` })
            .from(vouchers)
            .where(and(...conditions));
        
        const totalCount = countResult[0]?.count || 0;
        
        // Apply pagination
        const page = pagination?.page || 1;
        const limit = pagination?.limit || 10;
        const offset = (page - 1) * limit;
        
        // Get paginated results
        let query = this.db.select()
            .from(vouchers)
            .where(and(...conditions))
            .limit(limit)
            .offset(offset);
        
        // Apply sorting with safe column access
        if (pagination?.sortBy && pagination.sortBy === 'createdAt') {
            const sortOrder = pagination.sortOrder === 'ASC' ? asc : desc;
            query = query.orderBy(sortOrder(vouchers.createdAt));
        } else if (pagination?.sortBy && pagination.sortBy === 'updatedAt') {
            const sortOrder = pagination.sortOrder === 'ASC' ? asc : desc;
            query = query.orderBy(sortOrder(vouchers.updatedAt));
        } else {
            query = query.orderBy(desc(vouchers.createdAt));
        }
        
        const result = await query;
        
        const totalPages = Math.ceil(totalCount / limit);
        
        return {
            vouchers: result as unknown as Voucher[],
            totalCount,
            currentPage: page,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1
        };
    }

    // Get comprehensive analytics for admin dashboard
    async getAdminVoucherAnalytics(dateFrom?: string, dateTo?: string): Promise<AdminVoucherAnalytics> {
        const conditions = [];
        
        if (dateFrom) {
            conditions.push(gte(vouchers.createdAt, new Date(dateFrom)));
        }
        
        if (dateTo) {
            conditions.push(lte(vouchers.createdAt, new Date(dateTo)));
        }
        
        // Get total system vouchers
        const totalVouchersResult = await this.db.select({ count: sql<number>`count(*)` })
            .from(vouchers)
            .where(and(...conditions));
        
        // Get total system usage
        const usageConditions = [...conditions];
        const totalUsageResult = await this.db.select({ 
            count: sql<number>`count(*)`,
            totalDiscount: sql<number>`sum(${voucherUsage.discountAmount})`
        })
            .from(voucherUsage)
            .innerJoin(vouchers, eq(voucherUsage.voucherId, vouchers.id))
            .where(and(...usageConditions));
        
        // TODO: Add fraudulent usage count when schema supports it
        // const fraudulentUsageResult = await this.db.select({ count: sql<number>`count(*)` })
        //     .from(voucherUsage)
        //     .where(eq(voucherUsage.fraudulent, true));
        
        // Get vendor performance data
        const vendorPerformanceResult = await this.db.select({
            vendorId: vouchers.vendorId,
            totalVouchers: sql<number>`count(DISTINCT ${vouchers.id})`,
            totalUsage: sql<number>`count(${voucherUsage.id})`,
            totalDiscountGiven: sql<number>`sum(${voucherUsage.discountAmount})`
        })
            .from(vouchers)
            .leftJoin(voucherUsage, eq(vouchers.id, voucherUsage.voucherId))
            .groupBy(vouchers.vendorId)
            .limit(10)
            .orderBy(desc(sql`sum(${voucherUsage.discountAmount})`));
        
        // Get voucher distribution by type
        const typeDistributionResult = await this.db.select({
            discountType: vouchers.discountType,
            count: sql<number>`count(*)`,
            totalValue: sql<number>`sum(CAST(${vouchers.discountValue} AS DECIMAL))`
        })
            .from(vouchers)
            .groupBy(vouchers.discountType);
        
        return {
            totalSystemVouchers: totalVouchersResult[0]?.count || 0,
            totalSystemUsage: totalUsageResult[0]?.count || 0,
            totalSystemDiscountGiven: totalUsageResult[0]?.totalDiscount || 0,
            totalSystemRevenueLost: totalUsageResult[0]?.totalDiscount || 0,
            averageDiscountPerVoucher: (totalUsageResult[0]?.totalDiscount || 0) / (totalVouchersResult[0]?.count || 1),
            topPerformingVendors: vendorPerformanceResult.map((v: any) => ({
                vendorId: v.vendorId,
                vendorName: `Vendor ${v.vendorId}`,
                totalVouchers: v.totalVouchers,
                totalUsage: v.totalUsage,
                totalDiscountGiven: v.totalDiscountGiven,
                averageVoucherValue: v.totalDiscountGiven / (v.totalVouchers || 1),
                successRate: (v.totalUsage / (v.totalVouchers || 1)) * 100
            })),
            voucherDistributionByType: typeDistributionResult.map((t: any) => ({
                discountType: t.discountType,
                count: t.count,
                totalValue: t.totalValue,
                percentage: (t.count / (totalVouchersResult[0]?.count || 1)) * 100
            })),
            monthlyTrends: [], // Would require more complex date aggregation
            fraudulentUsageCount: 0, // TODO: Implement when schema supports it
            suspiciousActivities: [] // Would come from separate fraud detection system
        };
    }

    // Get flagged vouchers for admin review (simplified version)
    async getFlaggedVouchers(flagType?: FlagType): Promise<FlaggedVoucher[]> {
        // TODO: This would require additional schema fields for flagging
        // For now, return vouchers that might need attention (high usage, expired but active, etc.)
        
        const suspiciousConditions = [
            sql`${vouchers.currentUsageCount} > 100`, // High usage
            and(eq(vouchers.isActive, true), sql`${vouchers.validUntil} < ${new Date()}`), // Active but expired
        ];
        
        const result = await this.db.select()
            .from(vouchers)
            .where(or(...suspiciousConditions))
            .orderBy(desc(vouchers.createdAt))
            .limit(50);
        
        return result.map((v: any) => ({
            voucher: v as unknown as Voucher,
            flagType: 'SUSPICIOUS_PATTERN' as FlagType,
            flagReason: 'High usage or expired but active',
            flaggedAt: new Date(),
            severity: 3,
            investigationStatus: 'PENDING',
            investigatorId: undefined
        }));
    }

    // Bulk operations for admin
    async bulkUpdateVouchers(voucherIds: string[], updates: BulkVoucherUpdateInput): Promise<Voucher[]> {
        const updateData: any = {
            ...updates,
            updatedAt: new Date()
        };
        
        // Remove undefined values
        Object.keys(updateData).forEach(key => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });
        
        const result = await this.db.update(vouchers)
            .set(updateData)
            .where(sql`${vouchers.id} = ANY(${voucherIds})`)
            .returning();
        
        return result as unknown as Voucher[];
    }

    async bulkDeactivateVouchers(voucherIds: string[], reason: string): Promise<number> {
        await this.db.update(vouchers)
            .set({ 
                isActive: false,
                // TODO: Add flagged fields when schema supports it
                updatedAt: new Date()
            })
            .where(sql`${vouchers.id} = ANY(${voucherIds})`);
        
        return voucherIds.length;
    }

    // Fraud detection and management (simplified)
    async markVoucherUsageAsFraud(usageId: string, reason: string, investigatorId: string): Promise<VoucherUsage> {
        // TODO: This would require additional schema fields
        // For now, we could use description field or create separate fraud table
        
        const result = await this.db.select()
            .from(voucherUsage)
            .where(eq(voucherUsage.id, usageId))
            .limit(1);
        
        if (result.length === 0) {
            throw new Error('Voucher usage not found');
        }
        
        // Would update fraud fields when schema supports it
        return result[0] as unknown as VoucherUsage;
    }

    // System maintenance operations
    async getExpiredVouchers(daysOld: number): Promise<Voucher[]> {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);
        
        const result = await this.db.select()
            .from(vouchers)
            .where(sql`${vouchers.validUntil} < ${cutoffDate}`)
            .orderBy(asc(vouchers.validUntil));
        
        return result as unknown as Voucher[];
    }

    async cleanupExpiredVouchers(daysOld: number): Promise<number> {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);
        
        // Only delete vouchers that are expired and have no usage
        const vouchersToDelete = await this.db.select({ id: vouchers.id })
            .from(vouchers)
            .leftJoin(voucherUsage, eq(vouchers.id, voucherUsage.voucherId))
            .where(and(
                sql`${vouchers.validUntil} < ${cutoffDate}`,
                eq(vouchers.isActive, false),
                sql`${voucherUsage.id} IS NULL` // No usage records
            ));
        
        if (vouchersToDelete.length === 0) {
            return 0;
        }
        
        const idsToDelete = vouchersToDelete.map((v: { id: any; }) => v.id);
        
        await this.db.delete(vouchers)
            .where(sql`${vouchers.id} = ANY(${idsToDelete})`);
        
        return idsToDelete.length;
    }

    // Vendor management operations
    async suspendVendorVouchers(vendorId: string, reason: string, durationDays?: number): Promise<boolean> {
        await this.db.update(vouchers)
            .set({
                isActive: false,
                // TODO: Add suspension fields when schema supports it
                updatedAt: new Date()
            })
            .where(eq(vouchers.vendorId, vendorId));
        
        return true;
    }

    async restoreVendorVouchers(vendorId: string): Promise<boolean> {
        await this.db.update(vouchers)
            .set({
                isActive: true,
                updatedAt: new Date()
            })
            .where(and(
                eq(vouchers.vendorId, vendorId),
                gte(vouchers.validUntil, new Date()) // Only restore non-expired vouchers
            ));
        
        return true;
    }

    // Advanced analytics methods
    async getVendorVoucherComparison(vendorIds: string[], dateFrom?: string, dateTo?: string): Promise<VendorVoucherPerformance[]> {
        const conditions = [sql`${vouchers.vendorId} = ANY(${vendorIds})`];
        
        if (dateFrom) {
            conditions.push(gte(vouchers.createdAt, new Date(dateFrom)));
        }
        
        if (dateTo) {
            conditions.push(lte(vouchers.createdAt, new Date(dateTo)));
        }
        
        const result = await this.db.select({
            vendorId: vouchers.vendorId,
            totalVouchers: sql<number>`count(DISTINCT ${vouchers.id})`,
            activeVouchers: sql<number>`count(DISTINCT CASE WHEN ${vouchers.isActive} = true THEN ${vouchers.id} END)`,
            totalUsage: sql<number>`count(${voucherUsage.id})`,
            totalDiscountGiven: sql<number>`sum(${voucherUsage.discountAmount})`
        })
            .from(vouchers)
            .leftJoin(voucherUsage, eq(vouchers.id, voucherUsage.voucherId))
            .where(and(...conditions))
            .groupBy(vouchers.vendorId);
        
        return result.map((r: any) => ({
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
    }

    // Emergency operations
    async emergencyDisableAllVouchers(reason: string): Promise<boolean> {
        await this.db.update(vouchers)
            .set({
                isActive: false,
                updatedAt: new Date()
            })
            .where(eq(vouchers.isActive, true));
        
        return true;
    }

    async emergencyEnableAllVouchers(): Promise<boolean> {
        await this.db.update(vouchers)
            .set({
                isActive: true,
                updatedAt: new Date()
            })
            .where(and(
                eq(vouchers.isActive, false),
                gte(vouchers.validUntil, new Date()) // Only enable non-expired vouchers
            ));
        
        return true;
    }

    // Create system-wide promotional vouchers
    async createSystemPromotionVouchers(promotion: SystemPromotionInput): Promise<Voucher[]> {
        const createdVouchers: Voucher[] = [];
        
        for (const vendorId of promotion.vendorIds) {
            const couponCode = promotion.autoGenerateCodes 
                ? `${promotion.codePrefix || 'PROMO'}_${vendorId}_${Date.now()}`
                : `${promotion.title.toUpperCase()}_${vendorId}`;
            
            const voucherData = {
                id: sql`gen_random_uuid()`,
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
            
            const result = await this.db.insert(vouchers).values(voucherData).returning();
            createdVouchers.push(result[0] as unknown as Voucher);
        }
        
        return createdVouchers;
    }
}
