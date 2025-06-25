// src/Features/Vouchers/Resolvers/index.ts
import { Context } from '../../../../GraphQL/Context';
import { vouchers, voucherUsage, users } from '../../../../Schema';
import { eq, and, or, gte, lte, sql, desc, asc } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import {
    CreateVoucherInput,
    UpdateVoucherInput,
    ValidateVoucherInput,
    ApplyVoucherInput,
    VoucherFilters,
    VoucherUsageFilters,
    Voucher,
    VoucherUsage,
    VoucherValidationResult,
    DiscountType,
    ServiceType,
    ApplicableFor
} from '../../Types';
import { GraphQLError } from 'graphql';

// Helper function to calculate discount
const calculateDiscount = (
    discountType: DiscountType,
    discountValue: number,
    orderAmount: number,
    maxDiscountAmount?: number
): number => {
    let discount = 0;
    
    if (discountType === 'Percentage') {
        discount = (orderAmount * discountValue) / 100;
    } else {
        discount = discountValue;
    }
    
    // Apply max discount limit if specified
    if (maxDiscountAmount && discount > maxDiscountAmount) {
        discount = maxDiscountAmount;
    }
    
    return Math.min(discount, orderAmount); // Discount cannot exceed order amount
};

// Helper function to check voucher eligibility
const checkVoucherEligibility = async (
    voucher: any,
    serviceType: ServiceType,
    serviceId: string,
    orderAmount: number,
    userId?: string,
    db?: any
): Promise<{ isValid: boolean; error?: string }> => {
    const now = new Date();
    
    // Check if voucher is active
    if (!voucher.isActive) {
        return { isValid: false, error: 'Voucher is not active' };
    }
    
    // Check validity dates
    if (now < new Date(voucher.validFrom) || now > new Date(voucher.validUntil)) {
        return { isValid: false, error: 'Voucher is expired or not yet valid' };
    }
    
    // Check minimum order value
    if (voucher.minOrderValue && orderAmount < voucher.minOrderValue) {
        return { isValid: false, error: `Minimum order value of ${voucher.minOrderValue} required` };
    }
    
    // Check service applicability
    if (voucher.applicableFor === 'Specific Services') {
        const isServiceTypeApplicable = voucher.serviceTypes?.includes(serviceType);
        const isSpecificServiceApplicable = voucher.specificServiceIds?.includes(serviceId);
        
        if (!isServiceTypeApplicable && !isSpecificServiceApplicable) {
            return { isValid: false, error: 'Voucher is not applicable for this service' };
        }
    }
    
    // Check total usage limit
    if (voucher.totalUsageLimit && voucher.currentUsageCount >= voucher.totalUsageLimit) {
        return { isValid: false, error: 'Voucher usage limit exceeded' };
    }
    
    // Check per-user usage limit
    if (userId && db) {
        const userUsageCount = await db.select({ count: sql<number>`count(*)` })
            .from(voucherUsage)
            .where(and(
                eq(voucherUsage.voucherId, voucher.id),
                eq(voucherUsage.userId, userId)
            ));
        
        if (userUsageCount[0]?.count >= voucher.usagePerUser) {
            return { isValid: false, error: 'You have reached the usage limit for this voucher' };
        }
    }
    
    return { isValid: true };
};

// Note: Function to notify about voucher events
// This could be implemented using a message queue, webhook system, or direct database polling
const notifyVoucherEvent = async (eventType: string, data: any) => {
    // Implement your preferred notification method here
    // Examples:
    // - Send to a message queue (Redis, RabbitMQ, Kafka)
    // - Store in a notifications table for polling
    // - Trigger webhooks to registered endpoints
    // - Use server-sent events (SSE)
    
    console.log(`Event: ${eventType}`, data);
    
    // Example webhook implementation:
    // const webhookEndpoints = await getWebhooksForVendor(data.vendorId);
    // webhookEndpoints.forEach(endpoint => {
    //   axios.post(endpoint, { eventType, data }).catch(err => console.error('Webhook error:', err));
    // });
};

export const voucherResolvers = {
    Query: {
        // Query resolvers remain the same
        getVouchers: async (
            _: any,
            { filters }: { filters?: VoucherFilters },
            { db, vendor, Admin }: Context
        ): Promise<Voucher[]> => {
            // Build where conditions
            const conditions = [];
            
            // Vendor can only see their vouchers, Admin can see all
            if (vendor) {
                conditions.push(eq(vouchers.vendorId, vendor.id));
            } else if (Admin) {
                // Admin can see all vouchers, optionally filter by vendorId
                if (filters?.vendorId) {
                    conditions.push(eq(vouchers.vendorId, filters.vendorId));
                }
            } else {
                throw new GraphQLError('Unauthorized', { extensions: { code: 'UNAUTHORIZED' } });
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
            
            const result = await db.select()
                .from(vouchers)
                .where(and(...conditions))
                .orderBy(desc(vouchers.createdAt));
            
            return result as unknown as Voucher[];
        },

        getVoucher: async (
            _: any,
            { id }: { id: string },
            { db, vendor, Admin }: Context
        ): Promise<Voucher | null> => {
            const conditions = [eq(vouchers.id, id)];
            
            // Access control
            if (vendor) {
                conditions.push(eq(vouchers.vendorId, vendor.id));
            } else if (!Admin) {
                throw new GraphQLError('Unauthorized', { extensions: { code: 'UNAUTHORIZED' } });
            }
            
            const result = await db.select()
                .from(vouchers)
                .where(and(...conditions))
                .limit(1);
            
            return result[0] as unknown as Voucher || null;
        },

        getVoucherByCouponCode: async (
            _: any,
            { couponCode, vendorId }: { couponCode: string; vendorId: string },
            { db }: Context
        ): Promise<Voucher | null> => {
            const result = await db.select()
                .from(vouchers)
                .where(and(
                    eq(vouchers.couponCode, couponCode),
                    eq(vouchers.vendorId, vendorId)
                ))
                .limit(1);
            
            return result[0] as unknown as Voucher || null;
        },

        validateVoucher: async (
            _: any,
            { input }: { input: ValidateVoucherInput },
            { db, user }: Context
        ): Promise<VoucherValidationResult> => {
            try {
                // Find voucher
                const voucherResult = await db.select()
                    .from(vouchers)
                    .where(and(
                        eq(vouchers.couponCode, input.couponCode),
                        eq(vouchers.vendorId, input.vendorId)
                    ))
                    .limit(1);
                
                if (voucherResult.length === 0) {
                    return {
                        isValid: false,
                        error: 'Voucher not found'
                    };
                }
                
                const voucher = voucherResult[0];
                
                // Check eligibility
                const eligibility = await checkVoucherEligibility(
                    voucher,
                    input.serviceType,
                    input.serviceId,
                    input.orderAmount,
                    user?.id,
                    db
                );
                
                if (!eligibility.isValid) {
                    return {
                        isValid: false,
                        error: eligibility.error
                    };
                }
                
                // Calculate discount
                const discountAmount = calculateDiscount(
                    voucher.discountType as DiscountType,
                    Number(voucher.discountValue),
                    input.orderAmount,
                    voucher.maxDiscountAmount ? Number(voucher.maxDiscountAmount) : undefined
                );
                
                const finalAmount = input.orderAmount - discountAmount;
                
                return {
                    isValid: true,
                    voucher: voucher as unknown as Voucher,
                    discountAmount,
                    finalAmount
                };
            } catch (error) {
                console.error('Error validating voucher:', error);
                return {
                    isValid: false,
                    error: 'Failed to validate voucher'
                };
            }
        },

        getVoucherUsage: async (
            _: any,
            { filters }: { filters?: VoucherUsageFilters },
            { db, vendor, Admin }: Context
        ): Promise<VoucherUsage[]> => {
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
            
            // Vendor can only see usage for their vouchers
            if (vendor) {
                const vendorVouchers = await db.select({ id: vouchers.id })
                    .from(vouchers)
                    .where(eq(vouchers.vendorId, vendor.id));
                
                const vendorVoucherIds = vendorVouchers.map(v => v.id);
                if (vendorVoucherIds.length === 0) {
                    return [];
                }
                
                conditions.push(sql`${voucherUsage.voucherId} = ANY(${vendorVoucherIds})`);
            } else if (!Admin) {
                throw new GraphQLError('Unauthorized', { extensions: { code: 'UNAUTHORIZED' } });
            }
            
            const result = await db.select()
                .from(voucherUsage)
                .where(and(...conditions))
                .orderBy(desc(voucherUsage.appliedAt));
            
            return result as unknown as VoucherUsage[];
        },

        getUserVoucherUsage: async (
            _: any,
            { voucherId }: { voucherId?: string },
            { db, user }: Context
        ): Promise<VoucherUsage[]> => {
            if (!user) {
                throw new GraphQLError('Authentication required', { extensions: { code: 'UNAUTHENTICATED' } });
            }
            
            const conditions = [eq(voucherUsage.userId, user.id)];
            
            if (voucherId) {
                conditions.push(eq(voucherUsage.voucherId, voucherId));
            }
            
            const result = await db.select()
                .from(voucherUsage)
                .where(and(...conditions))
                .orderBy(desc(voucherUsage.appliedAt));
            
            return result as unknown as VoucherUsage[];
        },

        getVoucherStatistics: async (
            _: any,
            { vendorId, dateFrom, dateTo }: { vendorId?: string; dateFrom?: string; dateTo?: string },
            { db, vendor, Admin }: Context
        ) => {
            const targetVendorId = vendorId || vendor?.id;
            
            if (!targetVendorId && !Admin) {
                throw new GraphQLError('Vendor ID required', { extensions: { code: 'BAD_USER_INPUT' } });
            }
            
            // Vendor can only see their own stats
            if (vendor && targetVendorId !== vendor.id) {
                throw new GraphQLError('Unauthorized', { extensions: { code: 'UNAUTHORIZED' } });
            }
            
            const conditions = [];
            if (targetVendorId) {
                conditions.push(eq(vouchers.vendorId, targetVendorId));
            }
            
            // Get total vouchers count
            const totalVouchersResult = await db.select({ count: sql<number>`count(*)` })
                .from(vouchers)
                .where(and(...conditions));
            
            // Get active vouchers count
            const activeVouchersResult = await db.select({ count: sql<number>`count(*)` })
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
            
            const usageStatsQuery = db.select({
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
                totalDiscountGiven: usageStats[0]?.totalDiscountGiven || 0,
                topPerformingVouchers: [] // Could be implemented separately
            };
        }
    },

    Mutation: {
        createVoucher: async (
            _: any,
            { input }: { input: CreateVoucherInput },
            { db, vendor }: Context
        ): Promise<Voucher> => {
            if (!vendor) {
                throw new GraphQLError('Vendor authentication required', { extensions: { code: 'UNAUTHENTICATED' } });
            }
            
            // Check for duplicate coupon code
            const existingVoucher = await db.select()
                .from(vouchers)
                .where(and(
                    eq(vouchers.vendorId, vendor.id),
                    eq(vouchers.couponCode, input.couponCode)
                ))
                .limit(1);
            
            if (existingVoucher.length > 0) {
                throw new GraphQLError('Coupon code already exists for this vendor', { extensions: { code: 'BAD_USER_INPUT' } });
            }
            
            // Validate dates
            if (new Date(input.validFrom) >= new Date(input.validUntil)) {
                throw new GraphQLError('Valid from date must be before valid until date', { extensions: { code: 'BAD_USER_INPUT' } });
            }
            
            const newVoucher = {
                id: uuidv4(),
                vendorId: vendor.id,
                ...input,
                discountValue: String(input.discountValue),
                maxDiscountAmount: input.maxDiscountAmount ? String(input.maxDiscountAmount) : undefined,
                minOrderValue: input.minOrderValue ? String(input.minOrderValue) : undefined,
                usagePerUser: input.usagePerUser || 1,
                currentUsageCount: 0,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            
            const result = await db.insert(vouchers).values(newVoucher).returning();
            
            // Notify about the voucher creation
            await notifyVoucherEvent('VOUCHER_CREATED', {
                voucher: result[0],
                vendorId: vendor.id
            });
            
            return result[0] as unknown as Voucher;
        },

        updateVoucher: async (
            _: any,
            { input }: { input: UpdateVoucherInput },
            { db, vendor }: Context
        ): Promise<Voucher> => {
            if (!vendor) {
                throw new GraphQLError('Vendor authentication required', { extensions: { code: 'UNAUTHENTICATED' } });
            }
            
            // Check ownership
            const existingVoucher = await db.select()
                .from(vouchers)
                .where(and(
                    eq(vouchers.id, input.id),
                    eq(vouchers.vendorId, vendor.id)
                ))
                .limit(1);
            
            if (existingVoucher.length === 0) {
                throw new GraphQLError('Voucher not found or access denied', { extensions: { code: 'NOT_FOUND' } });
            }
            
            // Check for duplicate coupon code if updating
            if (input.couponCode && input.couponCode !== existingVoucher[0].couponCode) {
                const duplicateCheck = await db.select()
                    .from(vouchers)
                    .where(and(
                        eq(vouchers.vendorId, vendor.id),
                        eq(vouchers.couponCode, input.couponCode)
                    ))
                    .limit(1);
                
                if (duplicateCheck.length > 0) {
                    throw new GraphQLError('Coupon code already exists for this vendor', { extensions: { code: 'BAD_USER_INPUT' } });
                }
            }
            
            // Validate dates if updating
            const validFrom = input.validFrom ? new Date(input.validFrom) : new Date(existingVoucher[0].validFrom);
            const validUntil = input.validUntil ? new Date(input.validUntil) : new Date(existingVoucher[0].validUntil);
            
            if (validFrom >= validUntil) {
                throw new GraphQLError('Valid from date must be before valid until date', { extensions: { code: 'BAD_USER_INPUT' } });
            }
            
            const updateData = {
                ...input,
                discountValue: input.discountValue !== undefined ? String(input.discountValue) : undefined,
                maxDiscountAmount: input.maxDiscountAmount !== undefined ? String(input.maxDiscountAmount) : undefined,
                minOrderValue: input.minOrderValue !== undefined ? String(input.minOrderValue) : undefined,
                updatedAt: new Date()
            };
            
            // Remove undefined values
            Object.keys(updateData).forEach(key => {
                if (updateData[key as keyof typeof updateData] === undefined) {
                    delete updateData[key as keyof typeof updateData];
                }
            });
            
            const result = await db.update(vouchers)
                .set(updateData)
                .where(eq(vouchers.id, input.id))
                .returning();
            
            // Notify about the voucher update
            await notifyVoucherEvent('VOUCHER_UPDATED', {
                voucher: result[0],
                vendorId: vendor.id
            });
            
            return result[0] as unknown as Voucher;
        },

        deleteVoucher: async (
            _: any,
            { id }: { id: string },
            { db, vendor }: Context
        ): Promise<boolean> => {
            if (!vendor) {
                throw new GraphQLError('Vendor authentication required', { extensions: { code: 'UNAUTHENTICATED' } });
            }
            
            // Check ownership and if voucher has been used
            const voucherWithUsage = await db.select({
                voucher: vouchers,
                usageCount: sql<number>`count(${voucherUsage.id})`
            })
                .from(vouchers)
                .leftJoin(voucherUsage, eq(vouchers.id, voucherUsage.voucherId))
                .where(and(
                    eq(vouchers.id, id),
                    eq(vouchers.vendorId, vendor.id)
                ))
                .groupBy(vouchers.id)
                .limit(1);
            
            if (voucherWithUsage.length === 0) {
                throw new GraphQLError('Voucher not found or access denied', { extensions: { code: 'NOT_FOUND' } });
            }
            
            if (voucherWithUsage[0].usageCount > 0) {
                throw new GraphQLError('Cannot delete voucher that has been used', { extensions: { code: 'BAD_USER_INPUT' } });
            }
            
            await db.delete(vouchers).where(eq(vouchers.id, id));
            
            // Notify about the voucher deletion
            await notifyVoucherEvent('VOUCHER_DELETED', {
                voucherId: id,
                vendorId: vendor.id
            });
            
            return true;
        },

        toggleVoucherStatus: async (
            _: any,
            { id }: { id: string },
            { db, vendor }: Context
        ): Promise<Voucher> => {
            if (!vendor) {
                throw new GraphQLError('Vendor authentication required', { extensions: { code: 'UNAUTHENTICATED' } });
            }
            
            // Check ownership
            const existingVoucher = await db.select()
                .from(vouchers)
                .where(and(
                    eq(vouchers.id, id),
                    eq(vouchers.vendorId, vendor.id)
                ))
                .limit(1);
            
            if (existingVoucher.length === 0) {
                throw new GraphQLError('Voucher not found or access denied', { extensions: { code: 'NOT_FOUND' } });
            }
            
            const result = await db.update(vouchers)
                .set({ 
                    isActive: !existingVoucher[0].isActive,
                    updatedAt: new Date()
                })
                .where(eq(vouchers.id, id))
                .returning();
            
            // Notify about the voucher status update
            await notifyVoucherEvent('VOUCHER_UPDATED', {
                voucher: result[0],
                vendorId: vendor.id
            });
            
            return result[0] as unknown as Voucher;
        },

        applyVoucher: async (
            _: any,
            { input }: { input: ApplyVoucherInput },
            { db, user }: Context
        ): Promise<VoucherUsage> => {
            if (!user) {
                throw new GraphQLError('User authentication required', { extensions: { code: 'UNAUTHENTICATED' } });
            }
            
            // Start transaction
            return await db.transaction(async (tx) => {
                // Find and lock voucher
                const voucherResult = await tx.select()
                    .from(vouchers)
                    .where(and(
                        eq(vouchers.couponCode, input.couponCode),
                        eq(vouchers.vendorId, input.vendorId)
                    ))
                    .limit(1);
                
                if (voucherResult.length === 0) {
                    throw new GraphQLError('Voucher not found', { extensions: { code: 'NOT_FOUND' } });
                }
                
                const voucher = voucherResult[0];
                
                // Check eligibility
                const eligibility = await checkVoucherEligibility(
                    voucher,
                    input.serviceType,
                    input.serviceId,
                    input.originalAmount,
                    user.id,
                    tx
                );
                
                if (!eligibility.isValid) {
                    throw new GraphQLError(eligibility.error || 'Voucher is not valid', { extensions: { code: 'BAD_USER_INPUT' } });
                }
                
                // Calculate discount
                const discountAmount = calculateDiscount(
                    voucher.discountType as DiscountType,
                    Number(voucher.discountValue),
                    input.originalAmount,
                    voucher.maxDiscountAmount ? Number(voucher.maxDiscountAmount) : undefined
                );
                
                const finalAmount = input.originalAmount - discountAmount;
                
                // Create usage record
                const usageRecord = {
                    id: uuidv4(),
                    voucherId: voucher.id,
                    userId: user.id,
                    bookingId: input.bookingId,
                    originalAmount: String(input.originalAmount), // Convert to string
                    discountAmount: String(discountAmount), // Convert to string
                    finalAmount: String(finalAmount), // Convert to string
                    serviceType: input.serviceType,
                    serviceId: input.serviceId,
                    appliedAt: new Date()
                };
                
                const usageResult = await tx.insert(voucherUsage).values(usageRecord).returning();
                
                // Update voucher usage count
                await tx.update(vouchers)
                    .set({ 
                        currentUsageCount: sql`${vouchers.currentUsageCount} + 1`,
                        updatedAt: new Date()
                    })
                    .where(eq(vouchers.id, voucher.id));
                
                // Notify about the voucher usage
                await notifyVoucherEvent('VOUCHER_USED', {
                    voucherUsage: usageResult[0],
                    vendorId: input.vendorId
                });
                
                return usageResult[0] as unknown as VoucherUsage;
            });
        },

        deactivateVoucher: async (
            _: any,
            { id }: { id: string },
            { db, Admin }: Context
        ): Promise<Voucher> => {
            if (!Admin) {
                throw new GraphQLError('Admin authentication required', { extensions: { code: 'UNAUTHENTICATED' } });
            }
            
            const result = await db.update(vouchers)
                .set({ 
                    isActive: false,
                    updatedAt: new Date()
                })
                .where(eq(vouchers.id, id))
                .returning();
            
            if (result.length === 0) {
                throw new GraphQLError('Voucher not found', { extensions: { code: 'NOT_FOUND' } });
            }
            
            // Notify about the voucher deactivation
            await notifyVoucherEvent('VOUCHER_UPDATED', {
                voucher: result[0]
            });
            
            return result[0] as unknown as Voucher;
        }
    },

    // Field resolvers
    VoucherUsage: {
        voucher: async (parent: any, _: any, { db }: Context) => {
            const result = await db.select()
                .from(vouchers)
                .where(eq(vouchers.id, parent.voucherId))
                .limit(1);
            
            return result[0] as unknown as Voucher || null;
        },

        user: async (parent: any, _: any, { db }: Context) => {
            const result = await db.select()
                .from(users)
                .where(eq(users.id, parent.userId))
                .limit(1);
            
            return result[0] || null;
        }
    }
    
    // Subscription section removed and replaced with the notification system above
};
