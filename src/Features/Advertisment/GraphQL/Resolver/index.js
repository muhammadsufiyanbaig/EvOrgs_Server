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
exports.adResolvers = void 0;
const Service_1 = require("../../Service");
const Model_1 = require("../../Model");
// Helper function to create service instance
const createAdService = (context) => {
    const adModel = new Model_1.AdModel(context.db); // Assuming AdModel needs db connection
    return new Service_1.AdService(adModel);
};
exports.adResolvers = {
    Query: {
        getActiveAds: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { adType, entityType }, context) {
            const adService = createAdService(context);
            return yield adService.getActiveAds(adType, entityType);
        }),
        getActiveExternalAds: (_, __, context) => __awaiter(void 0, void 0, void 0, function* () {
            const adService = createAdService(context);
            return yield adService.getActiveExternalAds();
        }),
        getFeaturedAds: (_, __, context) => __awaiter(void 0, void 0, void 0, function* () {
            const adService = createAdService(context);
            return yield adService.getFeaturedAds();
        }),
        getSponsoredAds: (_, __, context) => __awaiter(void 0, void 0, void 0, function* () {
            const adService = createAdService(context);
            return yield adService.getSponsoredAds();
        }),
        getMyAdRequests: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { status }, context) {
            const adService = createAdService(context);
            return yield adService.getMyAdRequests(context.vendor, status);
        }),
        getMyActiveAds: (_, __, context) => __awaiter(void 0, void 0, void 0, function* () {
            const adService = createAdService(context);
            return yield adService.getMyActiveAds(context.vendor);
        }),
        getAdRequestById: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            const adService = createAdService(context);
            return yield adService.getAdRequestById(id, context.vendor);
        }),
        getMyPayments: (_, __, context) => __awaiter(void 0, void 0, void 0, function* () {
            const adService = createAdService(context);
            return yield adService.getMyPayments(context.vendor);
        }),
        getAllAdRequests: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { status, vendorId }, context) {
            const adService = createAdService(context);
            return yield adService.getAllAdRequests(context.Admin, status, vendorId);
        }),
        getAllServiceAds: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { status, vendorId }, context) {
            const adService = createAdService(context);
            return yield adService.getAllServiceAds(context.Admin, status, vendorId);
        }),
        getPendingAdRequests: (_, __, context) => __awaiter(void 0, void 0, void 0, function* () {
            const adService = createAdService(context);
            return yield adService.getPendingAdRequests(context.Admin);
        }),
        getExternalAds: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { status }, context) {
            const adService = createAdService(context);
            return yield adService.getExternalAds(context.Admin, status);
        }),
        getExternalAdById: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            const adService = createAdService(context);
            return yield adService.getExternalAdById(context.Admin, id);
        }),
        getAdPayments: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { adId, externalAdId }, context) {
            const adService = createAdService(context);
            return yield adService.getAdPayments(context.Admin, adId, externalAdId);
        }),
        getPaymentById: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            const adService = createAdService(context);
            return yield adService.getPaymentById(context.Admin, id);
        }),
        getAdAnalytics: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { adId }, context) {
            const adService = createAdService(context);
            return yield adService.getAdAnalytics({ adId }, context);
        }),
        getDashboardStats: (_, __, context) => __awaiter(void 0, void 0, void 0, function* () {
            const adService = createAdService(context);
            return yield adService.getDashboardStats(context.Admin);
        }),
        getTopPerformingAds: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { limit }, context) {
            const adService = createAdService(context);
            return yield adService.getTopPerformingAds(context.Admin, limit);
        }),
        getRevenueAnalytics: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { startDate, endDate }, context) {
            const adService = createAdService(context);
            return yield adService.getRevenueAnalytics(context.Admin, startDate, endDate);
        }),
        // ==================== TIME SLOT QUERIES ====================
        getAvailableTimeSlots: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { date, adType }, context) {
            const adService = createAdService(context);
            return yield adService.getAvailableTimeSlots(date, adType);
        }),
        getAdSchedules: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { adId, status, date }, context) {
            const adService = createAdService(context);
            return yield adService.getAdSchedules(adId, status, date, context.Admin);
        }),
        getUpcomingSchedules: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { limit }, context) {
            const adService = createAdService(context);
            return yield adService.getUpcomingSchedules(limit);
        }),
        getFailedSchedules: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { limit }, context) {
            const adService = createAdService(context);
            return yield adService.getFailedSchedules(limit);
        })
    },
    Mutation: {
        createAdRequest: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { input }, context) {
            const adService = createAdService(context);
            return yield adService.createAdRequest(input, context.vendor);
        }),
        updateAdRequest: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id, input }, context) {
            const adService = createAdService(context);
            return yield adService.updateAdRequest(id, input, context.vendor);
        }),
        cancelAdRequest: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            const adService = createAdService(context);
            return yield adService.cancelAdRequest(id, context.vendor);
        }),
        approveAdRequest: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id, input }, context) {
            const adService = createAdService(context);
            return yield adService.approveAdRequest(id, input, context.Admin);
        }),
        rejectAdRequest: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            const adService = createAdService(context);
            return yield adService.rejectAdRequest(id, context.Admin);
        }),
        reviewAdRequest: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id, status, adminNotes }, context) {
            const adService = createAdService(context);
            return yield adService.reviewAdRequest(id, status, adminNotes, context.Admin);
        }),
        activateServiceAd: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            const adService = createAdService(context);
            return yield adService.activateServiceAd(id, context.Admin);
        }),
        expireServiceAd: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            const adService = createAdService(context);
            return yield adService.expireServiceAd(id, context.Admin);
        }),
        updateServiceAd: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id, input }, context) {
            const adService = createAdService(context);
            return yield adService.updateServiceAd(id, input, context.Admin);
        }),
        pauseServiceAd: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            const adService = createAdService(context);
            return yield adService.pauseServiceAd(id, context.Admin);
        }),
        resumeServiceAd: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            const adService = createAdService(context);
            return yield adService.resumeServiceAd(id, context.Admin);
        }),
        cancelServiceAd: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            const adService = createAdService(context);
            return yield adService.cancelServiceAd(id, context.Admin);
        }),
        extendServiceAd: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id, newEndDate }, context) {
            const adService = createAdService(context);
            return yield adService.extendServiceAd(id, newEndDate, context.Admin);
        }),
        createExternalAd: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { input }, context) {
            const adService = createAdService(context);
            return yield adService.createExternalAd(input, context.Admin);
        }),
        updateExternalAd: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id, input }, context) {
            const adService = createAdService(context);
            return yield adService.updateExternalAd(id, input, context.Admin);
        }),
        deleteExternalAd: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            const adService = createAdService(context);
            return yield adService.deleteExternalAd(id, context.Admin);
        }),
        createPayment: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { input }, context) {
            const adService = createAdService(context);
            return yield adService.createPayment(input, context.Admin);
        }),
        updatePaymentStatus: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id, status }, context) {
            const adService = createAdService(context);
            return yield adService.updatePaymentStatus(id, status, context.Admin);
        }),
        recordImpression: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { adId, isExternal }, context) {
            const adService = createAdService(context);
            return yield adService.recordImpression(adId, isExternal);
        }),
        recordClick: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { adId, isExternal }, context) {
            const adService = createAdService(context);
            return yield adService.recordClick(adId, isExternal);
        }),
        recordConversion: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { adId }, context) {
            const adService = createAdService(context);
            return yield adService.recordConversion(adId);
        }),
        // ==================== TIME SLOT MUTATIONS ====================
        approveAdRequestWithTimeSlots: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id, input }, context) {
            const adService = createAdService(context);
            return yield adService.approveAdRequestWithTimeSlots(id, input, context.Admin);
        }),
        updateAdTimeSlots: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { adId, timeSlots }, context) {
            const adService = createAdService(context);
            return yield adService.updateAdTimeSlots(adId, timeSlots, context.Admin);
        }),
        scheduleAdRun: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { adId, timeSlotId, scheduledDate }, context) {
            const adService = createAdService(context);
            return yield adService.scheduleAdRun(adId, timeSlotId, scheduledDate, context.Admin);
        }),
        cancelScheduledRun: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { scheduleId }, context) {
            const adService = createAdService(context);
            return yield adService.cancelScheduledRun(scheduleId, context.Admin);
        }),
        rescheduleAdRun: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { scheduleId, newDate, newTimeSlotId }, context) {
            const adService = createAdService(context);
            return yield adService.rescheduleAdRun(scheduleId, newDate, newTimeSlotId, context.Admin);
        }),
        retryFailedSchedule: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { scheduleId }, context) {
            const adService = createAdService(context);
            return yield adService.retryFailedSchedule(scheduleId, context.Admin);
        }),
        pauseAdSchedule: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { adId }, context) {
            const adService = createAdService(context);
            return yield adService.pauseAdSchedule(adId, context.Admin);
        }),
        resumeAdSchedule: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { adId }, context) {
            const adService = createAdService(context);
            return yield adService.resumeAdSchedule(adId, context.Admin);
        }),
        bulkScheduleAds: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { adIds, timeSlots, dateRange }, context) {
            const adService = createAdService(context);
            return yield adService.bulkScheduleAds(adIds, timeSlots, dateRange, context.Admin);
        })
    }
};
