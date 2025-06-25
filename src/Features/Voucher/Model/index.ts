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
    ServiceType
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
}