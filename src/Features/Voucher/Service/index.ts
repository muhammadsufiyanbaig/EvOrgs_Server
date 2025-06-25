// src/Features/Vouchers/Services/VoucherService.ts
import { GraphQLError } from 'graphql';
import { v4 as uuidv4 } from 'uuid';
import { VoucherModel } from '../Model';
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
} from '../Types';

export class VoucherService {
    constructor(private voucherModel: VoucherModel) {}

    // Helper methods
    private calculateDiscount(
        discountType: DiscountType,
        discountValue: number,
        orderAmount: number,
        maxDiscountAmount?: number
    ): number {
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
    }

    private async checkVoucherEligibility(
        voucher: any,
        serviceType: ServiceType,
        serviceId: string,
        orderAmount: number,
        userId?: string
    ): Promise<{ isValid: boolean; error?: string }> {
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
        if (userId) {
            const userUsageCount = await this.voucherModel.getUserVoucherUsageCount(voucher.id, userId);
            
            if (userUsageCount >= voucher.usagePerUser) {
                return { isValid: false, error: 'You have reached the usage limit for this voucher' };
            }
        }
        
        return { isValid: true };
    }

    private async notifyVoucherEvent(eventType: string, data: any): Promise<void> {
        // Implement your preferred notification method here
        console.log(`Event: ${eventType}`, data);
        
        // Example webhook implementation:
        // const webhookEndpoints = await getWebhooksForVendor(data.vendorId);
        // webhookEndpoints.forEach(endpoint => {
        //   axios.post(endpoint, { eventType, data }).catch(err => console.error('Webhook error:', err));
        // });
    }

    // Query service methods
    async getVouchers(filters?: VoucherFilters, vendorId?: string, isAdmin?: boolean): Promise<Voucher[]> {
        if (!vendorId && !isAdmin) {
            throw new GraphQLError('Unauthorized', { extensions: { code: 'UNAUTHORIZED' } });
        }

        return await this.voucherModel.findVouchers(filters, vendorId);
    }

    async getVoucher(id: string, vendorId?: string, isAdmin?: boolean): Promise<Voucher | null> {
        if (!vendorId && !isAdmin) {
            throw new GraphQLError('Unauthorized', { extensions: { code: 'UNAUTHORIZED' } });
        }

        return await this.voucherModel.findVoucherById(id, vendorId);
    }

    async getVoucherByCouponCode(couponCode: string, vendorId: string): Promise<Voucher | null> {
        return await this.voucherModel.findVoucherByCouponCode(couponCode, vendorId);
    }

    async validateVoucher(input: ValidateVoucherInput, userId?: string): Promise<VoucherValidationResult> {
        try {
            const voucher = await this.voucherModel.findVoucherByCouponCode(input.couponCode, input.vendorId);
            
            if (!voucher) {
                return {
                    isValid: false,
                    error: 'Voucher not found'
                };
            }
            
            const eligibility = await this.checkVoucherEligibility(
                voucher,
                input.serviceType,
                input.serviceId,
                input.orderAmount,
                userId
            );
            
            if (!eligibility.isValid) {
                return {
                    isValid: false,
                    error: eligibility.error
                };
            }
            
            const discountAmount = this.calculateDiscount(
                voucher.discountType as DiscountType,
                Number(voucher.discountValue),
                input.orderAmount,
                voucher.maxDiscountAmount ? Number(voucher.maxDiscountAmount) : undefined
            );
            
            const finalAmount = input.orderAmount - discountAmount;
            
            return {
                isValid: true,
                voucher: voucher,
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
    }

    async getVoucherUsage(filters?: VoucherUsageFilters, vendorId?: string, isAdmin?: boolean): Promise<VoucherUsage[]> {
        if (!vendorId && !isAdmin) {
            throw new GraphQLError('Unauthorized', { extensions: { code: 'UNAUTHORIZED' } });
        }

        let vendorVoucherIds: string[] | undefined;
        if (vendorId) {
            vendorVoucherIds = await this.voucherModel.getVendorVoucherIds(vendorId);
            if (vendorVoucherIds && vendorVoucherIds.length === 0) {
                return [];
            }
        }

        return await this.voucherModel.findVoucherUsage(filters, vendorVoucherIds);
    }

    async getUserVoucherUsage(userId: string, voucherId?: string): Promise<VoucherUsage[]> {
        return await this.voucherModel.findUserVoucherUsage(userId, voucherId);
    }

    async getVoucherStatistics(vendorId?: string, dateFrom?: string, dateTo?: string, isAdmin?: boolean): Promise<any> {
        if (!vendorId && !isAdmin) {
            throw new GraphQLError('Vendor ID required', { extensions: { code: 'BAD_USER_INPUT' } });
        }

        const stats = await this.voucherModel.getVoucherStatistics(vendorId, dateFrom, dateTo);
        
        return {
            ...stats,
            topPerformingVouchers: [] // Could be implemented separately
        };
    }

    // Mutation service methods
    async createVoucher(input: CreateVoucherInput, vendorId: string): Promise<Voucher> {
        // Check for duplicate coupon code
        const isDuplicate = await this.voucherModel.checkDuplicateCouponCode(input.couponCode, vendorId);
        if (isDuplicate) {
            throw new GraphQLError('Coupon code already exists for this vendor', { extensions: { code: 'BAD_USER_INPUT' } });
        }
        
        // Validate dates
        if (new Date(input.validFrom) >= new Date(input.validUntil)) {
            throw new GraphQLError('Valid from date must be before valid until date', { extensions: { code: 'BAD_USER_INPUT' } });
        }
        
        const newVoucher = {
            id: uuidv4(),
            vendorId,
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
        
        const result = await this.voucherModel.createVoucher(newVoucher);
        
        await this.notifyVoucherEvent('VOUCHER_CREATED', {
            voucher: result,
            vendorId
        });
        
        return result;
    }

    async updateVoucher(input: UpdateVoucherInput, vendorId: string): Promise<Voucher> {
        const existingVoucher = await this.voucherModel.findVoucherById(input.id, vendorId);
        if (!existingVoucher) {
            throw new GraphQLError('Voucher not found or access denied', { extensions: { code: 'NOT_FOUND' } });
        }
        
        // Check for duplicate coupon code if updating
        if (input.couponCode && input.couponCode !== existingVoucher.couponCode) {
            const isDuplicate = await this.voucherModel.checkDuplicateCouponCode(input.couponCode, vendorId, input.id);
            if (isDuplicate) {
                throw new GraphQLError('Coupon code already exists for this vendor', { extensions: { code: 'BAD_USER_INPUT' } });
            }
        }
        
        // Validate dates if updating
        const validFrom = input.validFrom ? new Date(input.validFrom) : new Date(existingVoucher.validFrom);
        const validUntil = input.validUntil ? new Date(input.validUntil) : new Date(existingVoucher.validUntil);
        
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
        
        const result = await this.voucherModel.updateVoucher(input.id, updateData);
        
        await this.notifyVoucherEvent('VOUCHER_UPDATED', {
            voucher: result,
            vendorId
        });
        
        return result;
    }

    async deleteVoucher(id: string, vendorId: string): Promise<boolean> {
        const voucherWithUsage = await this.voucherModel.getVoucherWithUsageCount(id, vendorId);
        
        if (!voucherWithUsage) {
            throw new GraphQLError('Voucher not found or access denied', { extensions: { code: 'NOT_FOUND' } });
        }
        
        if (voucherWithUsage.usageCount > 0) {
            throw new GraphQLError('Cannot delete voucher that has been used', { extensions: { code: 'BAD_USER_INPUT' } });
        }
        
        await this.voucherModel.deleteVoucher(id);
        
        await this.notifyVoucherEvent('VOUCHER_DELETED', {
            voucherId: id,
            vendorId
        });
        
        return true;
    }

    async toggleVoucherStatus(id: string, vendorId: string): Promise<Voucher> {
        const existingVoucher = await this.voucherModel.findVoucherById(id, vendorId);
        if (!existingVoucher) {
            throw new GraphQLError('Voucher not found or access denied', { extensions: { code: 'NOT_FOUND' } });
        }
        
        const result = await this.voucherModel.updateVoucher(id, { 
            isActive: !existingVoucher.isActive,
            updatedAt: new Date()
        });
        
        await this.notifyVoucherEvent('VOUCHER_UPDATED', {
            voucher: result,
            vendorId
        });
        
        return result;
    }

    async applyVoucher(input: ApplyVoucherInput, userId: string): Promise<VoucherUsage> {
        return await this.voucherModel.executeInTransaction(async (tx: any) => {
            const voucherModel = new VoucherModel(tx);
            
            const voucher = await voucherModel.findVoucherByCouponCode(input.couponCode, input.vendorId);
            if (!voucher) {
                throw new GraphQLError('Voucher not found', { extensions: { code: 'NOT_FOUND' } });
            }
            
            const eligibility = await this.checkVoucherEligibility(
                voucher,
                input.serviceType,
                input.serviceId,
                input.originalAmount,
                userId
            );
            
            if (!eligibility.isValid) {
                throw new GraphQLError(eligibility.error || 'Voucher is not valid', { extensions: { code: 'BAD_USER_INPUT' } });
            }
            
            const discountAmount = this.calculateDiscount(
                voucher.discountType as DiscountType,
                Number(voucher.discountValue),
                input.originalAmount,
                voucher.maxDiscountAmount ? Number(voucher.maxDiscountAmount) : undefined
            );
            
            const finalAmount = input.originalAmount - discountAmount;
            
            const usageRecord = {
                id: uuidv4(),
                voucherId: voucher.id,
                userId,
                bookingId: input.bookingId,
                originalAmount: String(input.originalAmount),
                discountAmount: String(discountAmount),
                finalAmount: String(finalAmount),
                serviceType: input.serviceType,
                serviceId: input.serviceId,
                appliedAt: new Date()
            };
            
            const usageResult = await voucherModel.createVoucherUsage(usageRecord);
            await voucherModel.incrementVoucherUsageCount(voucher.id);
            
            await this.notifyVoucherEvent('VOUCHER_USED', {
                voucherUsage: usageResult,
                vendorId: input.vendorId
            });
            
            return usageResult;
        });
    }

    async deactivateVoucher(id: string): Promise<Voucher> {
        const result = await this.voucherModel.updateVoucher(id, { 
            isActive: false,
            updatedAt: new Date()
        });
        
        if (!result) {
            throw new GraphQLError('Voucher not found', { extensions: { code: 'NOT_FOUND' } });
        }
        
        await this.notifyVoucherEvent('VOUCHER_UPDATED', {
            voucher: result
        });
        
        return result;
    }

    // Field resolver helpers
    async getVoucherForUsage(voucherId: string): Promise<Voucher | null> {
        return await this.voucherModel.findVoucherById(voucherId);
    }

    async getUserForUsage(userId: string): Promise<any> {
        return await this.voucherModel.findUserById(userId);
    }
}