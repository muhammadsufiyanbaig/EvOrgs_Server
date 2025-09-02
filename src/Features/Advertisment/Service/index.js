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
exports.AdService = void 0;
const graphql_1 = require("graphql");
const uuid_1 = require("uuid");
class AdService {
    createAdRequest(input, vendor) {
        throw new Error('Method not implemented.');
    }
    constructor(model) {
        this.model = model;
    }
    getActiveAds(adType, entityType) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.getActiveAds(adType, entityType);
        });
    }
    getActiveExternalAds() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.getActiveExternalAds();
        });
    }
    getFeaturedAds() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.getFeaturedAds();
        });
    }
    getSponsoredAds() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.getSponsoredAds();
        });
    }
    getMyAdRequests(vendor, status) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!vendor) {
                throw new graphql_1.GraphQLError('Vendor authentication required', {
                    extensions: { code: 'UNAUTHENTICATED' }
                });
            }
            return yield this.model.getMyAdRequests(vendor.id, status);
        });
    }
    getMyActiveAds(vendor) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!vendor) {
                throw new graphql_1.GraphQLError('Vendor authentication required', {
                    extensions: { code: 'UNAUTHENTICATED' }
                });
            }
            return yield this.model.getMyActiveAds(vendor.id);
        });
    }
    getAdRequestById(id, vendor) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!vendor) {
                throw new graphql_1.GraphQLError('Vendor authentication required', {
                    extensions: { code: 'UNAUTHENTICATED' }
                });
            }
            return yield this.model.getAdRequestById(id, vendor.id);
        });
    }
    getMyPayments(vendor) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!vendor) {
                throw new graphql_1.GraphQLError('Vendor authentication required', {
                    extensions: { code: 'UNAUTHENTICATED' }
                });
            }
            return yield this.model.getMyPayments(vendor.id);
        });
    }
    getAllAdRequests(admin, status, vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!admin) {
                throw new graphql_1.GraphQLError('Admin access required', {
                    extensions: { code: 'FORBIDDEN' }
                });
            }
            return yield this.model.getAllAdRequests(status, vendorId);
        });
    }
    getAllServiceAds(admin, status, vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!admin) {
                throw new graphql_1.GraphQLError('Admin access required', {
                    extensions: { code: 'FORBIDDEN' }
                });
            }
            return yield this.model.getAllServiceAds(status, vendorId);
        });
    }
    getPendingAdRequests(admin) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!admin) {
                throw new graphql_1.GraphQLError('Admin access required', {
                    extensions: { code: 'FORBIDDEN' }
                });
            }
            return yield this.model.getPendingAdRequests();
        });
    }
    getExternalAds(admin, status) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!admin) {
                throw new graphql_1.GraphQLError('Admin access required', {
                    extensions: { code: 'FORBIDDEN' }
                });
            }
            return yield this.model.getExternalAds(status);
        });
    }
    getExternalAdById(admin, id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!admin) {
                throw new graphql_1.GraphQLError('Admin access required', {
                    extensions: { code: 'FORBIDDEN' }
                });
            }
            return yield this.model.getExternalAdById(id);
        });
    }
    getAdPayments(admin, adId, externalAdId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!admin) {
                throw new graphql_1.GraphQLError('Admin access required', {
                    extensions: { code: 'FORBIDDEN' }
                });
            }
            return yield this.model.getAdPayments(adId, externalAdId);
        });
    }
    getPaymentById(admin, id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!admin) {
                throw new graphql_1.GraphQLError('Admin access required', {
                    extensions: { code: 'FORBIDDEN' }
                });
            }
            return yield this.model.getPaymentById(id);
        });
    }
    getAdAnalytics(_a, _b) {
        return __awaiter(this, arguments, void 0, function* ({ adId }, { vendor, Admin }) {
            var _c, _d, _e;
            if (!vendor && !Admin) {
                throw new graphql_1.GraphQLError('Authentication required', {
                    extensions: { code: 'UNAUTHENTICATED' },
                });
            }
            const ad = yield this.model.getAdForAnalytics(adId);
            if (!ad) {
                throw new graphql_1.GraphQLError('Ad not found', {
                    extensions: { code: 'NOT_FOUND' },
                });
            }
            if (vendor && ad.vendorId !== vendor.id && !Admin) {
                throw new graphql_1.GraphQLError('Access denied', {
                    extensions: { code: 'FORBIDDEN' },
                });
            }
            const totalSpent = yield this.model.getTotalSpent(adId);
            const impressions = Number((_c = ad.impressionCount) !== null && _c !== void 0 ? _c : 0);
            const clicks = Number((_d = ad.clickCount) !== null && _d !== void 0 ? _d : 0);
            const conversions = Number((_e = ad.conversionCount) !== null && _e !== void 0 ? _e : 0);
            const { startDate, endDate } = ad;
            const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
            const conversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0;
            let daysActive = 0;
            if (startDate && endDate) {
                const start = new Date(startDate);
                const end = new Date(endDate);
                if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
                    const now = new Date();
                    const effectiveEndDate = end > now ? now : end;
                    daysActive = Math.max(1, Math.ceil((effectiveEndDate.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
                }
            }
            const averageDailyCost = daysActive > 0 ? totalSpent / daysActive : 0;
            return {
                impressions,
                clicks,
                conversions,
                ctr: Number(ctr.toFixed(2)),
                conversionRate: Number(conversionRate.toFixed(2)),
                totalSpent,
                averageDailyCost: Number(averageDailyCost.toFixed(2)),
                daysActive,
            };
        });
    }
    getDashboardStats(admin) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!admin) {
                throw new graphql_1.GraphQLError('Admin access required', {
                    extensions: { code: 'FORBIDDEN' }
                });
            }
            const { requestStats, adStats, paymentStats } = yield this.model.getDashboardStats();
            const totalImpressions = adStats[0].totalImpressions;
            const totalClicks = adStats[0].totalClicks;
            const averageCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
            return {
                totalAdRequests: requestStats[0].total,
                pendingRequests: requestStats[0].pending,
                activeAds: adStats[0].active,
                totalRevenue: parseFloat(paymentStats[0].totalRevenue.toString()),
                totalImpressions,
                totalClicks,
                averageCTR: parseFloat(averageCTR.toFixed(2))
            };
        });
    }
    getTopPerformingAds(admin_1) {
        return __awaiter(this, arguments, void 0, function* (admin, limit = 10) {
            if (!admin) {
                throw new graphql_1.GraphQLError('Admin access required', {
                    extensions: { code: 'FORBIDDEN' }
                });
            }
            return yield this.model.getTopPerformingAds(limit);
        });
    }
    getRevenueAnalytics(admin, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!admin) {
                throw new graphql_1.GraphQLError('Admin access required', {
                    extensions: { code: 'FORBIDDEN' }
                });
            }
            return yield this.model.getRevenueAnalytics(startDate, endDate);
        });
    }
    createExternalAd(input, admin) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!admin) {
                throw new graphql_1.GraphQLError('Admin access required', {
                    extensions: { code: 'FORBIDDEN' }
                });
            }
            // Check required fields
            if (!input.adTitle) {
                throw new graphql_1.GraphQLError('Ad title is required', {
                    extensions: { code: 'BAD_REQUEST' }
                });
            }
            if (!input.redirectUrl) {
                throw new graphql_1.GraphQLError('Redirect URL is required', {
                    extensions: { code: 'BAD_REQUEST' }
                });
            }
            if (!input.price) {
                throw new graphql_1.GraphQLError('Price is required', {
                    extensions: { code: 'BAD_REQUEST' }
                });
            }
            if (!input.advertiserName) {
                throw new graphql_1.GraphQLError('Advertiser name is required', {
                    extensions: { code: 'BAD_REQUEST' }
                });
            }
            if (!input.advertiserEmail) {
                throw new graphql_1.GraphQLError('Advertiser email is required', {
                    extensions: { code: 'BAD_REQUEST' }
                });
            }
            if (!input.imageUrl) {
                throw new graphql_1.GraphQLError('Image URL is required', {
                    extensions: { code: 'BAD_REQUEST' }
                });
            }
            const newExternalAd = Object.assign(Object.assign({ id: (0, uuid_1.v4)() }, input), { adTitle: input.adTitle, redirectUrl: input.redirectUrl, price: input.price, advertiserName: input.advertiserName, advertiserEmail: input.advertiserEmail, imageUrl: input.imageUrl, advertiserPhone: input.advertiserPhone || null, adDescription: (_a = input.adDescription) !== null && _a !== void 0 ? _a : null, status: input.status || 'Active', impressionCount: 0, clickCount: 0, startDate: input.startDate ? new Date(input.startDate) : null, endDate: input.endDate ? new Date(input.endDate) : null, createdAt: new Date(), updatedAt: new Date() });
            return yield this.model.createExternalAd(newExternalAd);
        });
    }
    updateAdRequest(id, input, vendor) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!vendor) {
                throw new graphql_1.GraphQLError('Vendor authentication required', {
                    extensions: { code: 'UNAUTHENTICATED' }
                });
            }
            const adRequest = yield this.model.getAdById(id);
            if (!adRequest || adRequest.vendorId !== vendor.id) {
                throw new graphql_1.GraphQLError('Request not found or access denied', {
                    extensions: { code: 'FORBIDDEN' }
                });
            }
            if (adRequest.status !== 'Pending') {
                throw new graphql_1.GraphQLError('Cannot update non-pending request', {
                    extensions: { code: 'BAD_REQUEST' }
                });
            }
            const updateData = Object.assign(Object.assign({}, input), { startDate: input.startDate ? new Date(input.startDate) : undefined, endDate: input.endDate ? new Date(input.endDate) : undefined, updatedAt: new Date() });
            return yield this.model.updateAdRequest(id, updateData);
        });
    }
    cancelAdRequest(id, vendor) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!vendor) {
                throw new graphql_1.GraphQLError('Vendor authentication required', {
                    extensions: { code: 'UNAUTHENTICATED' }
                });
            }
            const adRequest = yield this.model.getAdById(id);
            if (!adRequest || adRequest.vendorId !== vendor.id) {
                throw new graphql_1.GraphQLError('Request not found or access denied', {
                    extensions: { code: 'FORBIDDEN' }
                });
            }
            if (adRequest.status !== 'Pending') {
                throw new graphql_1.GraphQLError('Only pending requests can be cancelled', {
                    extensions: { code: 'BAD_REQUEST' }
                });
            }
            const result = yield this.model.updateAdRequest(id, {
                status: 'Rejected',
                updatedAt: new Date()
            });
            return !!result;
        });
    }
    approveAdRequest(id, input, admin) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!admin) {
                throw new graphql_1.GraphQLError('Admin access required', {
                    extensions: { code: 'FORBIDDEN' }
                });
            }
            const adRequest = yield this.model.getAdById(id);
            if (!adRequest) {
                throw new graphql_1.GraphQLError('Request not found', {
                    extensions: { code: 'NOT_FOUND' }
                });
            }
            if (adRequest.status !== 'Pending') {
                throw new graphql_1.GraphQLError('Can only approve pending requests', {
                    extensions: { code: 'BAD_REQUEST' }
                });
            }
            return yield this.model.updateAdRequest(id, {
                status: 'Approved',
                price: input.finalPrice !== undefined ? String(input.finalPrice) : adRequest.price,
                startDate: input.startDate ? new Date(input.startDate) : adRequest.startDate,
                endDate: input.endDate ? new Date(input.endDate) : adRequest.endDate,
                updatedAt: new Date()
            });
        });
    }
    rejectAdRequest(id, admin) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!admin) {
                throw new graphql_1.GraphQLError('Admin access required', {
                    extensions: { code: 'FORBIDDEN' }
                });
            }
            const adRequest = yield this.model.getAdById(id);
            if (!adRequest) {
                throw new graphql_1.GraphQLError('Request not found', {
                    extensions: { code: 'NOT_FOUND' }
                });
            }
            if (adRequest.status !== 'Pending') {
                throw new graphql_1.GraphQLError('Can only reject pending requests', {
                    extensions: { code: 'BAD_REQUEST' }
                });
            }
            return yield this.model.updateAdRequest(id, {
                status: 'Rejected',
                updatedAt: new Date()
            });
        });
    }
    reviewAdRequest(id, status, adminNotes, admin) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!admin) {
                throw new graphql_1.GraphQLError('Admin access required', {
                    extensions: { code: 'FORBIDDEN' }
                });
            }
            const adRequest = yield this.model.getAdById(id);
            if (!adRequest) {
                throw new graphql_1.GraphQLError('Request not found', {
                    extensions: { code: 'NOT_FOUND' }
                });
            }
            if (adRequest.status !== 'Pending') {
                throw new graphql_1.GraphQLError('Can only review pending requests', {
                    extensions: { code: 'BAD_REQUEST' }
                });
            }
            return yield this.model.updateAdRequest(id, {
                status,
                adminNotes, // assuming this field exists in the database schema
                reviewedBy: admin.id,
                reviewedAt: new Date(),
                updatedAt: new Date()
            }); // Type assertion to bypass TypeScript check
        });
    }
    activateServiceAd(id, admin) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!admin) {
                throw new graphql_1.GraphQLError('Admin access required', {
                    extensions: { code: 'FORBIDDEN' }
                });
            }
            const ad = yield this.model.getAdById(id);
            if (!ad) {
                throw new graphql_1.GraphQLError('Ad not found', {
                    extensions: { code: 'NOT_FOUND' }
                });
            }
            if (ad.status !== 'Approved') {
                throw new graphql_1.GraphQLError('Can only activate approved ads', {
                    extensions: { code: 'BAD_REQUEST' }
                });
            }
            return yield this.model.updateAdRequest(id, {
                status: 'Active',
                updatedAt: new Date()
            });
        });
    }
    expireServiceAd(id, admin) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!admin) {
                throw new graphql_1.GraphQLError('Admin access required', {
                    extensions: { code: 'FORBIDDEN' }
                });
            }
            const ad = yield this.model.getAdById(id);
            if (!ad) {
                throw new graphql_1.GraphQLError('Ad not found', {
                    extensions: { code: 'NOT_FOUND' }
                });
            }
            if (ad.status === 'Expired') {
                throw new graphql_1.GraphQLError('Ad is already expired', {
                    extensions: { code: 'BAD_REQUEST' }
                });
            }
            return yield this.model.updateAdRequest(id, {
                status: 'Expired',
                updatedAt: new Date()
            });
        });
    }
    updateServiceAd(id, input, admin) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!admin) {
                throw new graphql_1.GraphQLError('Admin access required', {
                    extensions: { code: 'FORBIDDEN' }
                });
            }
            const ad = yield this.model.getAdById(id);
            if (!ad) {
                throw new graphql_1.GraphQLError('Ad not found', {
                    extensions: { code: 'NOT_FOUND' }
                });
            }
            const updateData = Object.assign(Object.assign({}, input), { startDate: input.startDate ? new Date(input.startDate) : undefined, endDate: input.endDate ? new Date(input.endDate) : undefined, updatedAt: new Date() });
            return yield this.model.updateAdRequest(id, updateData);
        });
    }
    pauseServiceAd(id, admin) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!admin) {
                throw new graphql_1.GraphQLError('Admin access required', {
                    extensions: { code: 'FORBIDDEN' }
                });
            }
            const ad = yield this.model.getAdById(id);
            if (!ad) {
                throw new graphql_1.GraphQLError('Ad not found', {
                    extensions: { code: 'NOT_FOUND' }
                });
            }
            if (ad.status !== 'Active') {
                throw new graphql_1.GraphQLError('Can only pause active ads', {
                    extensions: { code: 'BAD_REQUEST' }
                });
            }
            return yield this.model.updateAdRequest(id, {
                status: 'Approved',
                updatedAt: new Date()
            });
        });
    }
    resumeServiceAd(id, admin) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!admin) {
                throw new graphql_1.GraphQLError('Admin access required', {
                    extensions: { code: 'FORBIDDEN' }
                });
            }
            const ad = yield this.model.getAdById(id);
            if (!ad) {
                throw new graphql_1.GraphQLError('Ad not found', {
                    extensions: { code: 'NOT_FOUND' }
                });
            }
            if (ad.status !== 'Approved') {
                throw new graphql_1.GraphQLError('Can only resume paused ads', {
                    extensions: { code: 'BAD_REQUEST' }
                });
            }
            return yield this.model.updateAdRequest(id, {
                status: 'Active',
                updatedAt: new Date()
            });
        });
    }
    cancelServiceAd(id, admin) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!admin) {
                throw new graphql_1.GraphQLError('Admin access required', {
                    extensions: { code: 'FORBIDDEN' }
                });
            }
            const ad = yield this.model.getAdById(id);
            if (!ad) {
                throw new graphql_1.GraphQLError('Ad not found', {
                    extensions: { code: 'NOT_FOUND' }
                });
            }
            if (!['Active', 'Approved'].includes((_a = ad.status) !== null && _a !== void 0 ? _a : '')) {
                throw new graphql_1.GraphQLError('Can only cancel active or paused ads', {
                    extensions: { code: 'BAD_REQUEST' }
                });
            }
            return yield this.model.updateAdRequest(id, {
                status: 'Rejected',
                updatedAt: new Date()
            });
        });
    }
    extendServiceAd(id, newEndDate, admin) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!admin) {
                throw new graphql_1.GraphQLError('Admin access required', {
                    extensions: { code: 'FORBIDDEN' }
                });
            }
            const ad = yield this.model.getAdById(id);
            if (!ad) {
                throw new graphql_1.GraphQLError('Ad not found', {
                    extensions: { code: 'NOT_FOUND' }
                });
            }
            if (!['Active', 'Approved'].includes((_a = ad.status) !== null && _a !== void 0 ? _a : '')) {
                throw new graphql_1.GraphQLError('Can only extend active or paused ads', {
                    extensions: { code: 'BAD_REQUEST' }
                });
            }
            const parsedNewEndDate = new Date(newEndDate);
            if (isNaN(parsedNewEndDate.getTime())) {
                throw new graphql_1.GraphQLError('Invalid new end date', {
                    extensions: { code: 'BAD_REQUEST' }
                });
            }
            if (ad.endDate && parsedNewEndDate <= new Date(ad.endDate)) {
                throw new graphql_1.GraphQLError('New end date must be after current end date', {
                    extensions: { code: 'BAD_REQUEST' }
                });
            }
            return yield this.model.updateAdRequest(id, {
                endDate: parsedNewEndDate,
                updatedAt: new Date()
            });
        });
    }
    updateExternalAd(id, input, admin) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!admin) {
                throw new graphql_1.GraphQLError('Admin access required', {
                    extensions: { code: 'FORBIDDEN' }
                });
            }
            const externalAd = yield this.model.getExternalAdById(id);
            if (!externalAd) {
                throw new graphql_1.GraphQLError('External ad not found', {
                    extensions: { code: 'NOT_FOUND' }
                });
            }
            const updateData = Object.assign(Object.assign({}, input), { startDate: input.startDate ? new Date(input.startDate) : undefined, endDate: input.endDate ? new Date(input.endDate) : undefined, updatedAt: new Date() });
            return yield this.model.updateExternalAd(id, updateData);
        });
    }
    deleteExternalAd(id, admin) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!admin) {
                throw new graphql_1.GraphQLError('Admin access required', {
                    extensions: { code: 'FORBIDDEN' }
                });
            }
            const externalAd = yield this.model.getExternalAdById(id);
            if (!externalAd) {
                throw new graphql_1.GraphQLError('External ad not found', {
                    extensions: { code: 'NOT_FOUND' }
                });
            }
            return yield this.model.deleteExternalAd(id);
        });
    }
    createPayment(input, admin) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!admin) {
                throw new graphql_1.GraphQLError('Admin access required', {
                    extensions: { code: 'FORBIDDEN' }
                });
            }
            if (!input.adId && !input.externalAdId) {
                throw new graphql_1.GraphQLError('Either adId or externalAdId must be provided', {
                    extensions: { code: 'BAD_REQUEST' }
                });
            }
            let vendorId = null;
            if (input.adId) {
                const serviceAd = yield this.model.getAdById(input.adId);
                if (!serviceAd) {
                    throw new graphql_1.GraphQLError('Service ad not found', {
                        extensions: { code: 'NOT_FOUND' }
                    });
                }
                vendorId = serviceAd.vendorId;
            }
            const newPayment = {
                id: (0, uuid_1.v4)(),
                vendorId,
                adId: input.adId || null,
                externalAdId: input.externalAdId || null,
                amountPaid: input.amountPaid || '0',
                paymentMethod: input.paymentMethod || null,
                transactionId: input.transactionId || null,
                paymentStatus: 'Pending',
                invoiceNumber: input.invoiceNumber || `INV-${Date.now()}`, // Add the missing required property
                paidAt: new Date(),
                createdAt: new Date(),
                updatedAt: new Date()
            };
            return yield this.model.createPayment(newPayment);
        });
    }
    updatePaymentStatus(id, status, admin) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!admin) {
                throw new graphql_1.GraphQLError('Admin access required', {
                    extensions: { code: 'FORBIDDEN' }
                });
            }
            const payment = yield this.model.getPaymentById(id);
            if (!payment) {
                throw new graphql_1.GraphQLError('Payment not found', {
                    extensions: { code: 'NOT_FOUND' }
                });
            }
            const updateData = {
                paymentStatus: status,
                updatedAt: new Date()
            };
            if (status === 'Paid' && payment.paymentStatus !== 'Paid') {
                updateData.paidAt = new Date();
            }
            return yield this.model.updatePaymentStatus(id, updateData);
        });
    }
    recordImpression(adId, isExternal) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.recordImpression(adId, isExternal);
            }
            catch (error) {
                console.error('Error recording impression:', error);
                return false;
            }
        });
    }
    recordClick(adId, isExternal) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.recordClick(adId, isExternal);
            }
            catch (error) {
                console.error('Error recording click:', error);
                return false;
            }
        });
    }
    recordConversion(adId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.recordConversion(adId);
            }
            catch (error) {
                console.error('Error recording conversion:', error);
                return false;
            }
        });
    }
    // ==================== TIME SLOT MANAGEMENT ====================
    updateAdTimeSlots(adId, timeSlots, admin) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!admin) {
                throw new graphql_1.GraphQLError('Admin access required', {
                    extensions: { code: 'FORBIDDEN' }
                });
            }
            // Validate time slots
            for (const slot of timeSlots) {
                if (!this.isValidTimeFormat(slot.startTime) || !this.isValidTimeFormat(slot.endTime)) {
                    throw new graphql_1.GraphQLError('Invalid time format. Use HH:MM format', {
                        extensions: { code: 'INVALID_INPUT' }
                    });
                }
                if (slot.startTime >= slot.endTime) {
                    throw new graphql_1.GraphQLError('Start time must be before end time', {
                        extensions: { code: 'INVALID_INPUT' }
                    });
                }
                if (!Array.isArray(slot.daysOfWeek) || slot.daysOfWeek.some(day => day < 0 || day > 6)) {
                    throw new graphql_1.GraphQLError('Invalid days of week. Use numbers 0-6 (Sunday-Saturday)', {
                        extensions: { code: 'INVALID_INPUT' }
                    });
                }
                if (slot.priority < 1 || slot.priority > 5) {
                    throw new graphql_1.GraphQLError('Priority must be between 1 (highest) and 5 (lowest)', {
                        extensions: { code: 'INVALID_INPUT' }
                    });
                }
            }
            // Check if ad exists
            const ad = yield this.model.getAdById(adId);
            if (!ad) {
                throw new graphql_1.GraphQLError('Ad not found', {
                    extensions: { code: 'NOT_FOUND' }
                });
            }
            // Update time slots
            yield this.model.updateTimeSlots(adId, timeSlots);
            // Return updated ad with time slots
            return yield this.getAdWithTimeSlots(adId);
        });
    }
    getAvailableTimeSlots(date, adType) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isValidDateFormat(date)) {
                throw new graphql_1.GraphQLError('Invalid date format. Use YYYY-MM-DD format', {
                    extensions: { code: 'INVALID_INPUT' }
                });
            }
            return yield this.model.getAvailableTimeSlots(date, adType);
        });
    }
    scheduleAdRun(adId, timeSlotId, scheduledDate, admin) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!admin) {
                throw new graphql_1.GraphQLError('Admin access required', {
                    extensions: { code: 'FORBIDDEN' }
                });
            }
            if (!this.isValidDateFormat(scheduledDate)) {
                throw new graphql_1.GraphQLError('Invalid date format. Use YYYY-MM-DD format', {
                    extensions: { code: 'INVALID_INPUT' }
                });
            }
            // Check if ad and time slot exist
            const ad = yield this.model.getAdById(adId);
            if (!ad) {
                throw new graphql_1.GraphQLError('Ad not found', {
                    extensions: { code: 'NOT_FOUND' }
                });
            }
            const timeSlots = yield this.model.getTimeSlotsByAdId(adId);
            const timeSlot = timeSlots.find(ts => ts.id === timeSlotId);
            if (!timeSlot) {
                throw new graphql_1.GraphQLError('Time slot not found for this ad', {
                    extensions: { code: 'NOT_FOUND' }
                });
            }
            // Check availability
            const availability = yield this.model.checkTimeSlotAvailability(scheduledDate, timeSlot.startTime, timeSlot.endTime);
            if (!availability.isAvailable) {
                throw new graphql_1.GraphQLError('Time slot is not available for the selected date', {
                    extensions: {
                        code: 'CONFLICT',
                        conflictingAds: availability.conflictingAds
                    }
                });
            }
            // Create schedule
            const schedule = yield this.model.createSchedule(adId, timeSlotId, scheduledDate);
            return schedule[0];
        });
    }
    cancelScheduledRun(scheduleId, admin) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!admin) {
                throw new graphql_1.GraphQLError('Admin access required', {
                    extensions: { code: 'FORBIDDEN' }
                });
            }
            const result = yield this.model.cancelSchedule(scheduleId);
            if (!result || result.length === 0) {
                throw new graphql_1.GraphQLError('Schedule not found or already cancelled', {
                    extensions: { code: 'NOT_FOUND' }
                });
            }
            return result[0];
        });
    }
    rescheduleAdRun(scheduleId, newDate, newTimeSlotId, admin) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!admin) {
                throw new graphql_1.GraphQLError('Admin access required', {
                    extensions: { code: 'FORBIDDEN' }
                });
            }
            if (!this.isValidDateFormat(newDate)) {
                throw new graphql_1.GraphQLError('Invalid date format. Use YYYY-MM-DD format', {
                    extensions: { code: 'INVALID_INPUT' }
                });
            }
            const result = yield this.model.rescheduleAd(scheduleId, newDate, newTimeSlotId);
            if (!result || result.length === 0) {
                throw new graphql_1.GraphQLError('Schedule not found', {
                    extensions: { code: 'NOT_FOUND' }
                });
            }
            return result[0];
        });
    }
    getAdSchedules(adId, status, date, admin) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!admin) {
                throw new graphql_1.GraphQLError('Admin access required', {
                    extensions: { code: 'FORBIDDEN' }
                });
            }
            if (adId) {
                return yield this.model.getSchedulesByAdId(adId, status, date);
            }
            else {
                return yield this.model.getAllSchedules(status, date);
            }
        });
    }
    getUpcomingSchedules() {
        return __awaiter(this, arguments, void 0, function* (limit = 10) {
            const schedules = yield this.model.getAllSchedules('Scheduled', undefined, limit);
            return schedules.map(s => s.schedule);
        });
    }
    getFailedSchedules() {
        return __awaiter(this, arguments, void 0, function* (limit = 10) {
            const schedules = yield this.model.getAllSchedules('Failed', undefined, limit);
            return schedules.map(s => s.schedule);
        });
    }
    retryFailedSchedule(scheduleId, admin) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!admin) {
                throw new graphql_1.GraphQLError('Admin access required', {
                    extensions: { code: 'FORBIDDEN' }
                });
            }
            const result = yield this.model.updateScheduleStatus(scheduleId, 'Scheduled', {
                retryCount: 0,
                nextRetry: null,
                failureReason: null,
            });
            if (!result || result.length === 0) {
                throw new graphql_1.GraphQLError('Schedule not found', {
                    extensions: { code: 'NOT_FOUND' }
                });
            }
            return result[0];
        });
    }
    pauseAdSchedule(adId, admin) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!admin) {
                throw new graphql_1.GraphQLError('Admin access required', {
                    extensions: { code: 'FORBIDDEN' }
                });
            }
            // Update all scheduled runs for this ad to paused
            const schedules = yield this.model.getSchedulesByAdId(adId, 'Scheduled');
            const pausedSchedules = [];
            for (const schedule of schedules) {
                const result = yield this.model.updateScheduleStatus(schedule.schedule.id, 'Paused');
                pausedSchedules.push(result[0]);
            }
            // Return updated ad
            return yield this.getAdWithTimeSlots(adId);
        });
    }
    resumeAdSchedule(adId, admin) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!admin) {
                throw new graphql_1.GraphQLError('Admin access required', {
                    extensions: { code: 'FORBIDDEN' }
                });
            }
            // Update all paused runs for this ad to scheduled
            const schedules = yield this.model.getSchedulesByAdId(adId, 'Paused');
            const resumedSchedules = [];
            for (const schedule of schedules) {
                const result = yield this.model.updateScheduleStatus(schedule.schedule.id, 'Scheduled');
                resumedSchedules.push(result[0]);
            }
            // Return updated ad
            return yield this.getAdWithTimeSlots(adId);
        });
    }
    bulkScheduleAds(adIds, timeSlots, dateRange, admin) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!admin) {
                throw new graphql_1.GraphQLError('Admin access required', {
                    extensions: { code: 'FORBIDDEN' }
                });
            }
            const schedules = [];
            const [startDate, endDate] = dateRange.split(',');
            if (!this.isValidDateFormat(startDate) || !this.isValidDateFormat(endDate)) {
                throw new graphql_1.GraphQLError('Invalid date range format. Use YYYY-MM-DD,YYYY-MM-DD', {
                    extensions: { code: 'INVALID_INPUT' }
                });
            }
            for (const adId of adIds) {
                // Update time slots for each ad
                yield this.model.updateTimeSlots(adId, timeSlots);
                // Create schedules for each day in the range
                const start = new Date(startDate);
                const end = new Date(endDate);
                for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
                    const dateString = date.toISOString().split('T')[0];
                    const dayOfWeek = date.getDay();
                    // Check if any time slot applies to this day
                    for (const slot of timeSlots) {
                        if (slot.daysOfWeek.includes(dayOfWeek)) {
                            try {
                                // Find the time slot ID for this ad
                                const adTimeSlots = yield this.model.getTimeSlotsByAdId(adId);
                                const matchingSlot = adTimeSlots.find(ts => ts.startTime === slot.startTime &&
                                    ts.endTime === slot.endTime);
                                if (matchingSlot) {
                                    const schedule = yield this.model.createSchedule(adId, matchingSlot.id, dateString);
                                    schedules.push(schedule[0]);
                                }
                            }
                            catch (error) {
                                console.error(`Failed to schedule ad ${adId} for ${dateString}:`, error);
                            }
                        }
                    }
                }
            }
            return schedules;
        });
    }
    // ==================== ENHANCED APPROVE WITH TIME SLOTS ====================
    approveAdRequestWithTimeSlots(id, input, admin) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!admin) {
                throw new graphql_1.GraphQLError('Admin access required', {
                    extensions: { code: 'FORBIDDEN' }
                });
            }
            // First approve the ad request
            const approvedAd = yield this.approveAdRequest(id, input, admin);
            // Then add time slots
            yield this.model.createTimeSlots(approvedAd.id, input.timeSlots);
            // Return ad with time slots
            return yield this.getAdWithTimeSlots(approvedAd.id);
        });
    }
    // ==================== HELPER METHODS ====================
    getAdWithTimeSlots(adId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const performance = yield this.model.getAdPerformanceWithSchedule(adId);
            return Object.assign(Object.assign({}, performance.ad), { timeSlots: performance.timeSlots, currentSchedule: ((_a = performance.schedules.find(s => s.schedule.status === 'Running')) === null || _a === void 0 ? void 0 : _a.schedule) || null, totalScheduledRuns: performance.statistics.totalRuns, successfulRuns: performance.statistics.successfulRuns, failedRuns: performance.statistics.failedRuns });
        });
    }
    isValidTimeFormat(time) {
        return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
    }
    isValidDateFormat(date) {
        return /^\d{4}-\d{2}-\d{2}$/.test(date) && !isNaN(Date.parse(date));
    }
}
exports.AdService = AdService;
