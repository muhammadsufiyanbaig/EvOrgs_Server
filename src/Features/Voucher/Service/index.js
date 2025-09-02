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
exports.VoucherService = void 0;
// src/Features/Vouchers/Services/VoucherService.ts
const graphql_1 = require("graphql");
const uuid_1 = require("uuid");
const Model_1 = require("../Model");
class VoucherService {
    constructor(voucherModel) {
        this.voucherModel = voucherModel;
    }
    // Helper methods
    calculateDiscount(discountType, discountValue, orderAmount, maxDiscountAmount) {
        let discount = 0;
        if (discountType === 'Percentage') {
            discount = (orderAmount * discountValue) / 100;
        }
        else {
            discount = discountValue;
        }
        // Apply max discount limit if specified
        if (maxDiscountAmount && discount > maxDiscountAmount) {
            discount = maxDiscountAmount;
        }
        return Math.min(discount, orderAmount); // Discount cannot exceed order amount
    }
    checkVoucherEligibility(voucher, serviceType, serviceId, orderAmount, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
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
                const isServiceTypeApplicable = (_a = voucher.serviceTypes) === null || _a === void 0 ? void 0 : _a.includes(serviceType);
                const isSpecificServiceApplicable = (_b = voucher.specificServiceIds) === null || _b === void 0 ? void 0 : _b.includes(serviceId);
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
                const userUsageCount = yield this.voucherModel.getUserVoucherUsageCount(voucher.id, userId);
                if (userUsageCount >= voucher.usagePerUser) {
                    return { isValid: false, error: 'You have reached the usage limit for this voucher' };
                }
            }
            return { isValid: true };
        });
    }
    notifyVoucherEvent(eventType, data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Implement your preferred notification method here
            console.log(`Event: ${eventType}`, data);
            // Example webhook implementation:
            // const webhookEndpoints = await getWebhooksForVendor(data.vendorId);
            // webhookEndpoints.forEach(endpoint => {
            //   axios.post(endpoint, { eventType, data }).catch(err => console.error('Webhook error:', err));
            // });
        });
    }
    getVouchers(filters, vendorId, isAdmin) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!vendorId && !isAdmin) {
                throw new graphql_1.GraphQLError('Unauthorized', { extensions: { code: 'UNAUTHORIZED' } });
            }
            return yield this.voucherModel.findVouchers(filters, vendorId);
        });
    }
    getVoucher(id, vendorId, isAdmin) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!vendorId && !isAdmin) {
                throw new graphql_1.GraphQLError('Unauthorized', { extensions: { code: 'UNAUTHORIZED' } });
            }
            return yield this.voucherModel.findVoucherById(id, vendorId);
        });
    }
    getVoucherByCouponCode(couponCode, vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.voucherModel.findVoucherByCouponCode(couponCode, vendorId);
        });
    }
    validateVoucher(input, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const voucher = yield this.voucherModel.findVoucherByCouponCode(input.couponCode, input.vendorId);
                if (!voucher) {
                    return {
                        isValid: false,
                        error: 'Voucher not found'
                    };
                }
                const eligibility = yield this.checkVoucherEligibility(voucher, input.serviceType, input.serviceId, input.orderAmount, userId);
                if (!eligibility.isValid) {
                    return {
                        isValid: false,
                        error: eligibility.error
                    };
                }
                const discountAmount = this.calculateDiscount(voucher.discountType, Number(voucher.discountValue), input.orderAmount, voucher.maxDiscountAmount ? Number(voucher.maxDiscountAmount) : undefined);
                const finalAmount = input.orderAmount - discountAmount;
                return {
                    isValid: true,
                    voucher: voucher,
                    discountAmount,
                    finalAmount
                };
            }
            catch (error) {
                console.error('Error validating voucher:', error);
                return {
                    isValid: false,
                    error: 'Failed to validate voucher'
                };
            }
        });
    }
    getVoucherUsage(filters, vendorId, isAdmin) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!vendorId && !isAdmin) {
                throw new graphql_1.GraphQLError('Unauthorized', { extensions: { code: 'UNAUTHORIZED' } });
            }
            let vendorVoucherIds;
            if (vendorId) {
                vendorVoucherIds = yield this.voucherModel.getVendorVoucherIds(vendorId);
                if (vendorVoucherIds && vendorVoucherIds.length === 0) {
                    return [];
                }
            }
            return yield this.voucherModel.findVoucherUsage(filters, vendorVoucherIds);
        });
    }
    getUserVoucherUsage(userId, voucherId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.voucherModel.findUserVoucherUsage(userId, voucherId);
        });
    }
    getVoucherStatistics(vendorId, dateFrom, dateTo, isAdmin) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!vendorId && !isAdmin) {
                throw new graphql_1.GraphQLError('Vendor ID required', { extensions: { code: 'BAD_USER_INPUT' } });
            }
            const stats = yield this.voucherModel.getVoucherStatistics(vendorId, dateFrom, dateTo);
            return Object.assign(Object.assign({}, stats), { topPerformingVouchers: [] // Could be implemented separately
             });
        });
    }
    // Mutation service methods
    createVoucher(input, vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check for duplicate coupon code
            const isDuplicate = yield this.voucherModel.checkDuplicateCouponCode(input.couponCode, vendorId);
            if (isDuplicate) {
                throw new graphql_1.GraphQLError('Coupon code already exists for this vendor', { extensions: { code: 'BAD_USER_INPUT' } });
            }
            // Validate dates
            if (new Date(input.validFrom) >= new Date(input.validUntil)) {
                throw new graphql_1.GraphQLError('Valid from date must be before valid until date', { extensions: { code: 'BAD_USER_INPUT' } });
            }
            const newVoucher = Object.assign(Object.assign({ id: (0, uuid_1.v4)(), vendorId }, input), { discountValue: String(input.discountValue), maxDiscountAmount: input.maxDiscountAmount ? String(input.maxDiscountAmount) : undefined, minOrderValue: input.minOrderValue ? String(input.minOrderValue) : undefined, usagePerUser: input.usagePerUser || 1, currentUsageCount: 0, isActive: true, createdAt: new Date(), updatedAt: new Date() });
            const result = yield this.voucherModel.createVoucher(newVoucher);
            yield this.notifyVoucherEvent('VOUCHER_CREATED', {
                voucher: result,
                vendorId
            });
            return result;
        });
    }
    updateVoucher(input, vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingVoucher = yield this.voucherModel.findVoucherById(input.id, vendorId);
            if (!existingVoucher) {
                throw new graphql_1.GraphQLError('Voucher not found or access denied', { extensions: { code: 'NOT_FOUND' } });
            }
            // Check for duplicate coupon code if updating
            if (input.couponCode && input.couponCode !== existingVoucher.couponCode) {
                const isDuplicate = yield this.voucherModel.checkDuplicateCouponCode(input.couponCode, vendorId, input.id);
                if (isDuplicate) {
                    throw new graphql_1.GraphQLError('Coupon code already exists for this vendor', { extensions: { code: 'BAD_USER_INPUT' } });
                }
            }
            // Validate dates if updating
            const validFrom = input.validFrom ? new Date(input.validFrom) : new Date(existingVoucher.validFrom);
            const validUntil = input.validUntil ? new Date(input.validUntil) : new Date(existingVoucher.validUntil);
            if (validFrom >= validUntil) {
                throw new graphql_1.GraphQLError('Valid from date must be before valid until date', { extensions: { code: 'BAD_USER_INPUT' } });
            }
            const updateData = Object.assign(Object.assign({}, input), { discountValue: input.discountValue !== undefined ? String(input.discountValue) : undefined, maxDiscountAmount: input.maxDiscountAmount !== undefined ? String(input.maxDiscountAmount) : undefined, minOrderValue: input.minOrderValue !== undefined ? String(input.minOrderValue) : undefined, updatedAt: new Date() });
            // Remove undefined values
            Object.keys(updateData).forEach(key => {
                if (updateData[key] === undefined) {
                    delete updateData[key];
                }
            });
            const result = yield this.voucherModel.updateVoucher(input.id, updateData);
            yield this.notifyVoucherEvent('VOUCHER_UPDATED', {
                voucher: result,
                vendorId
            });
            return result;
        });
    }
    deleteVoucher(id, vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const voucherWithUsage = yield this.voucherModel.getVoucherWithUsageCount(id, vendorId);
            if (!voucherWithUsage) {
                throw new graphql_1.GraphQLError('Voucher not found or access denied', { extensions: { code: 'NOT_FOUND' } });
            }
            if (voucherWithUsage.usageCount > 0) {
                throw new graphql_1.GraphQLError('Cannot delete voucher that has been used', { extensions: { code: 'BAD_USER_INPUT' } });
            }
            yield this.voucherModel.deleteVoucher(id);
            yield this.notifyVoucherEvent('VOUCHER_DELETED', {
                voucherId: id,
                vendorId
            });
            return true;
        });
    }
    toggleVoucherStatus(id, vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingVoucher = yield this.voucherModel.findVoucherById(id, vendorId);
            if (!existingVoucher) {
                throw new graphql_1.GraphQLError('Voucher not found or access denied', { extensions: { code: 'NOT_FOUND' } });
            }
            const result = yield this.voucherModel.updateVoucher(id, {
                isActive: !existingVoucher.isActive,
                updatedAt: new Date()
            });
            yield this.notifyVoucherEvent('VOUCHER_UPDATED', {
                voucher: result,
                vendorId
            });
            return result;
        });
    }
    applyVoucher(input, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.voucherModel.executeInTransaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const voucherModel = new Model_1.VoucherModel(tx);
                const voucher = yield voucherModel.findVoucherByCouponCode(input.couponCode, input.vendorId);
                if (!voucher) {
                    throw new graphql_1.GraphQLError('Voucher not found', { extensions: { code: 'NOT_FOUND' } });
                }
                const eligibility = yield this.checkVoucherEligibility(voucher, input.serviceType, input.serviceId, input.originalAmount, userId);
                if (!eligibility.isValid) {
                    throw new graphql_1.GraphQLError(eligibility.error || 'Voucher is not valid', { extensions: { code: 'BAD_USER_INPUT' } });
                }
                const discountAmount = this.calculateDiscount(voucher.discountType, Number(voucher.discountValue), input.originalAmount, voucher.maxDiscountAmount ? Number(voucher.maxDiscountAmount) : undefined);
                const finalAmount = input.originalAmount - discountAmount;
                const usageRecord = {
                    id: (0, uuid_1.v4)(),
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
                const usageResult = yield voucherModel.createVoucherUsage(usageRecord);
                yield voucherModel.incrementVoucherUsageCount(voucher.id);
                yield this.notifyVoucherEvent('VOUCHER_USED', {
                    voucherUsage: usageResult,
                    vendorId: input.vendorId
                });
                return usageResult;
            }));
        });
    }
    deactivateVoucher(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.voucherModel.updateVoucher(id, {
                isActive: false,
                updatedAt: new Date()
            });
            if (!result) {
                throw new graphql_1.GraphQLError('Voucher not found', { extensions: { code: 'NOT_FOUND' } });
            }
            yield this.notifyVoucherEvent('VOUCHER_UPDATED', {
                voucher: result
            });
            return result;
        });
    }
    // Field resolver helpers
    getVoucherForUsage(voucherId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.voucherModel.findVoucherById(voucherId);
        });
    }
    getUserForUsage(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.voucherModel.findUserById(userId);
        });
    }
    // ========== ADMIN-SPECIFIC SERVICE METHODS ==========
    // Admin query methods
    adminGetAllVouchers(filters, pagination) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.voucherModel.adminFindAllVouchers(filters, pagination);
        });
    }
    adminGetVoucherAnalytics(dateFrom, dateTo) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.voucherModel.getAdminVoucherAnalytics(dateFrom, dateTo);
        });
    }
    adminGetFlaggedVouchers(flagType) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.voucherModel.getFlaggedVouchers(flagType);
        });
    }
    adminGetVendorVoucherComparison(vendorIds, dateFrom, dateTo) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.voucherModel.getVendorVoucherComparison(vendorIds, dateFrom, dateTo);
        });
    }
    adminGetVoucherFraudReports(dateFrom, dateTo) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Implement fraud reporting system
            // This would typically query a separate fraud_reports table
            return [];
        });
    }
    adminGetExpiredVouchers(daysOld) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.voucherModel.getExpiredVouchers(daysOld);
        });
    }
    adminGetVoucherTrends(period, groupBy) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Implement comprehensive trend analysis
            // This would require complex data aggregation and analysis
            return {
                period,
                groupBy,
                dataPoints: [],
                summary: {
                    totalCount: 0,
                    totalValue: 0,
                    averageValue: 0,
                    growthRate: 0,
                    peakPeriod: ''
                }
            };
        });
    }
    adminGetVoucherComplianceReport(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Implement compliance checking system
            // This would check vouchers against business rules and policies
            return {
                vendorId,
                vendorName: `Vendor ${vendorId}`,
                totalVouchers: 0,
                compliantVouchers: 0,
                violationCount: 0,
                complianceScore: 100,
                violations: [],
                recommendations: []
            };
        });
    }
    // Admin mutation methods
    adminCreateVoucher(vendorId, input) {
        return __awaiter(this, void 0, void 0, function* () {
            // Admin can create vouchers for any vendor without ownership checks
            return yield this.createVoucher(input, vendorId);
        });
    }
    adminUpdateVoucher(input) {
        return __awaiter(this, void 0, void 0, function* () {
            // Admin can update any voucher without vendor ownership checks
            const existingVoucher = yield this.voucherModel.findVoucherById(input.id);
            if (!existingVoucher) {
                throw new graphql_1.GraphQLError('Voucher not found', { extensions: { code: 'NOT_FOUND' } });
            }
            // Check for duplicate coupon code if updating
            if (input.couponCode && input.couponCode !== existingVoucher.couponCode) {
                const isDuplicate = yield this.voucherModel.checkDuplicateCouponCode(input.couponCode, existingVoucher.vendorId, input.id);
                if (isDuplicate) {
                    throw new graphql_1.GraphQLError('Coupon code already exists for this vendor', {
                        extensions: { code: 'BAD_USER_INPUT' }
                    });
                }
            }
            const updateData = Object.assign(Object.assign({}, input), { discountValue: input.discountValue !== undefined ? String(input.discountValue) : undefined, maxDiscountAmount: input.maxDiscountAmount !== undefined ? String(input.maxDiscountAmount) : undefined, minOrderValue: input.minOrderValue !== undefined ? String(input.minOrderValue) : undefined, updatedAt: new Date() });
            // Remove undefined values
            Object.keys(updateData).forEach(key => {
                if (updateData[key] === undefined) {
                    delete updateData[key];
                }
            });
            const result = yield this.voucherModel.updateVoucher(input.id, updateData);
            yield this.notifyVoucherEvent('VOUCHER_UPDATED', {
                voucher: result,
                vendorId: existingVoucher.vendorId,
                updatedBy: 'ADMIN'
            });
            return result;
        });
    }
    adminForceDeleteVoucher(id, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            // Admin can force delete any voucher regardless of usage
            const existingVoucher = yield this.voucherModel.findVoucherById(id);
            if (!existingVoucher) {
                throw new graphql_1.GraphQLError('Voucher not found', { extensions: { code: 'NOT_FOUND' } });
            }
            yield this.voucherModel.deleteVoucher(id);
            yield this.notifyVoucherEvent('VOUCHER_FORCE_DELETED', {
                voucherId: id,
                vendorId: existingVoucher.vendorId,
                reason,
                deletedBy: 'ADMIN'
            });
            return true;
        });
    }
    adminBulkUpdateVouchers(voucherIds, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            if (voucherIds.length === 0) {
                throw new graphql_1.GraphQLError('No voucher IDs provided', { extensions: { code: 'BAD_USER_INPUT' } });
            }
            const result = yield this.voucherModel.bulkUpdateVouchers(voucherIds, updates);
            yield this.notifyVoucherEvent('VOUCHER_BULK_UPDATED', {
                voucherIds,
                updates,
                count: result.length,
                updatedBy: 'ADMIN'
            });
            return result;
        });
    }
    adminBulkDeactivateVouchers(voucherIds, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            if (voucherIds.length === 0) {
                throw new graphql_1.GraphQLError('No voucher IDs provided', { extensions: { code: 'BAD_USER_INPUT' } });
            }
            const count = yield this.voucherModel.bulkDeactivateVouchers(voucherIds, reason);
            yield this.notifyVoucherEvent('VOUCHER_BULK_DEACTIVATED', {
                voucherIds,
                reason,
                count,
                deactivatedBy: 'ADMIN'
            });
            return count;
        });
    }
    adminSuspendVendorVouchers(vendorId, reason, duration) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.voucherModel.suspendVendorVouchers(vendorId, reason, duration);
            yield this.notifyVoucherEvent('VENDOR_VOUCHERS_SUSPENDED', {
                vendorId,
                reason,
                duration,
                suspendedBy: 'ADMIN'
            });
            return result;
        });
    }
    adminRestoreVendorVouchers(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.voucherModel.restoreVendorVouchers(vendorId);
            yield this.notifyVoucherEvent('VENDOR_VOUCHERS_RESTORED', {
                vendorId,
                restoredBy: 'ADMIN'
            });
            return result;
        });
    }
    adminOverrideVoucherLimits(voucherId, newLimits) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingVoucher = yield this.voucherModel.findVoucherById(voucherId);
            if (!existingVoucher) {
                throw new graphql_1.GraphQLError('Voucher not found', { extensions: { code: 'NOT_FOUND' } });
            }
            const updateData = {};
            if (newLimits.totalUsageLimit !== undefined) {
                updateData.totalUsageLimit = newLimits.totalUsageLimit;
            }
            if (newLimits.usagePerUser !== undefined) {
                updateData.usagePerUser = newLimits.usagePerUser;
            }
            if (newLimits.maxDiscountAmount !== undefined) {
                updateData.maxDiscountAmount = String(newLimits.maxDiscountAmount);
            }
            if (newLimits.removeExpiryDate) {
                // Set expiry to far future
                updateData.validUntil = new Date('2099-12-31');
            }
            else if (newLimits.extendExpiryDays) {
                const currentExpiry = new Date(existingVoucher.validUntil);
                currentExpiry.setDate(currentExpiry.getDate() + newLimits.extendExpiryDays);
                updateData.validUntil = currentExpiry;
            }
            updateData.updatedAt = new Date();
            const result = yield this.voucherModel.updateVoucher(voucherId, updateData);
            yield this.notifyVoucherEvent('VOUCHER_LIMITS_OVERRIDDEN', {
                voucher: result,
                newLimits,
                overriddenBy: 'ADMIN'
            });
            return result;
        });
    }
    adminMarkVoucherUsageAsFraud(usageId, reason, investigatorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.voucherModel.markVoucherUsageAsFraud(usageId, reason, investigatorId);
            yield this.notifyVoucherEvent('VOUCHER_USAGE_MARKED_FRAUD', {
                usageId,
                reason,
                investigatorId
            });
            return result;
        });
    }
    adminRefundVoucherUsage(usageId, reason, refundAmount, processedBy) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Implement refund system
            // This would typically involve:
            // 1. Creating a refund record
            // 2. Processing the actual refund through payment system
            // 3. Updating voucher usage status
            const refund = {
                id: (0, uuid_1.v4)(),
                voucherUsageId: usageId,
                refundAmount,
                reason,
                processedBy,
                processedAt: new Date(),
                status: 'PROCESSED',
                voucherUsage: {} // Would be populated from DB
            };
            yield this.notifyVoucherEvent('VOUCHER_USAGE_REFUNDED', {
                refund,
                processedBy
            });
            return refund;
        });
    }
    adminCleanupExpiredVouchers(daysOld) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedCount = yield this.voucherModel.cleanupExpiredVouchers(daysOld);
            yield this.notifyVoucherEvent('EXPIRED_VOUCHERS_CLEANED', {
                daysOld,
                deletedCount,
                cleanedBy: 'ADMIN'
            });
            return deletedCount;
        });
    }
    adminRecalculateVoucherStatistics(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Implement statistics recalculation
            // This would typically involve:
            // 1. Recalculating usage counts
            // 2. Updating cached statistics
            // 3. Fixing any data inconsistencies
            yield this.notifyVoucherEvent('VOUCHER_STATISTICS_RECALCULATED', {
                vendorId,
                recalculatedBy: 'ADMIN'
            });
            return true;
        });
    }
    adminCreateSystemPromotion(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdVouchers = yield this.voucherModel.createSystemPromotionVouchers(input);
            yield this.notifyVoucherEvent('SYSTEM_PROMOTION_CREATED', {
                promotion: input,
                vouchersCreated: createdVouchers.length,
                createdBy: 'ADMIN'
            });
            return createdVouchers;
        });
    }
    adminEmergencyDisableAllVouchers(reason) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.voucherModel.emergencyDisableAllVouchers(reason);
            yield this.notifyVoucherEvent('EMERGENCY_ALL_VOUCHERS_DISABLED', {
                reason,
                disabledBy: 'ADMIN',
                timestamp: new Date()
            });
            return result;
        });
    }
    adminEmergencyEnableAllVouchers() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.voucherModel.emergencyEnableAllVouchers();
            yield this.notifyVoucherEvent('EMERGENCY_ALL_VOUCHERS_ENABLED', {
                enabledBy: 'ADMIN',
                timestamp: new Date()
            });
            return result;
        });
    }
    // Admin helper methods
    requireAdminPermission(context) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Implement proper admin permission checking
            // This would typically check JWT tokens, roles, permissions, etc.
            if (!(context === null || context === void 0 ? void 0 : context.isAdmin)) {
                throw new graphql_1.GraphQLError('Admin permission required', {
                    extensions: { code: 'FORBIDDEN' }
                });
            }
        });
    }
    logAdminAction(action, adminId, details) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Implement admin action logging
            // This would typically log to an audit trail system
            console.log(`ADMIN ACTION: ${action} by ${adminId}`, details);
        });
    }
}
exports.VoucherService = VoucherService;
