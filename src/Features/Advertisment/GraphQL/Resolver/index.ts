import { AdService } from '../../Service';
import { AdModel } from '../../Model';
import { Context } from '../../../../GraphQL/Context';

interface AdAnalyticsInput {
  adId: string;
}

// Helper function to create service instance
const createAdService = (context: Context) => {
  const adModel = new AdModel(context.db); // Assuming AdModel needs db connection
  return new AdService(adModel);
};

export const adResolvers = {
  Query: {
    getActiveAds: async (_: any, { adType, entityType }: any, context: Context) => {
      const adService = createAdService(context);
      return await adService.getActiveAds(adType, entityType);
    },

    getActiveExternalAds: async (_: any, __: any, context: Context) => {
      const adService = createAdService(context);
      return await adService.getActiveExternalAds();
    },

    getFeaturedAds: async (_: any, __: any, context: Context) => {
      const adService = createAdService(context);
      return await adService.getFeaturedAds();
    },

    getSponsoredAds: async (_: any, __: any, context: Context) => {
      const adService = createAdService(context);
      return await adService.getSponsoredAds();
    },

    getMyAdRequests: async (_: any, { status }: any, context: Context) => {
      const adService = createAdService(context);
      return await adService.getMyAdRequests(context.vendor, status);
    },

    getMyActiveAds: async (_: any, __: any, context: Context) => {
      const adService = createAdService(context);
      return await adService.getMyActiveAds(context.vendor);
    },

    getAdRequestById: async (_: any, { id }: any, context: Context) => {
      const adService = createAdService(context);
      return await adService.getAdRequestById(id, context.vendor);
    },

    getMyPayments: async (_: any, __: any, context: Context) => {
      const adService = createAdService(context);
      return await adService.getMyPayments(context.vendor);
    },

    getAllAdRequests: async (_: any, { status, vendorId }: any, context: Context) => {
      const adService = createAdService(context);
      return await adService.getAllAdRequests(context.Admin, status, vendorId);
    },

    getAllServiceAds: async (_: any, { status, vendorId }: any, context: Context) => {
      const adService = createAdService(context);
      return await adService.getAllServiceAds(context.Admin, status, vendorId);
    },

    getPendingAdRequests: async (_: any, __: any, context: Context) => {
      const adService = createAdService(context);
      return await adService.getPendingAdRequests(context.Admin);
    },

    getExternalAds: async (_: any, { status }: any, context: Context) => {
      const adService = createAdService(context);
      return await adService.getExternalAds(context.Admin, status);
    },

    getExternalAdById: async (_: any, { id }: any, context: Context) => {
      const adService = createAdService(context);
      return await adService.getExternalAdById(context.Admin, id);
    },

    getAdPayments: async (_: any, { adId, externalAdId }: any, context: Context) => {
      const adService = createAdService(context);
      return await adService.getAdPayments(context.Admin, adId, externalAdId);
    },

    getPaymentById: async (_: any, { id }: any, context: Context) => {
      const adService = createAdService(context);
      return await adService.getPaymentById(context.Admin, id);
    },

    getAdAnalytics: async (_: any, { adId }: AdAnalyticsInput, context: Context) => {
      const adService = createAdService(context);
      return await adService.getAdAnalytics({ adId }, context);
    },

    getDashboardStats: async (_: any, __: any, context: Context) => {
      const adService = createAdService(context);
      return await adService.getDashboardStats(context.Admin);
    },

    getTopPerformingAds: async (_: any, { limit }: any, context: Context) => {
      const adService = createAdService(context);
      return await adService.getTopPerformingAds(context.Admin, limit);
    },

    getRevenueAnalytics: async (_: any, { startDate, endDate }: any, context: Context) => {
      const adService = createAdService(context);
      return await adService.getRevenueAnalytics(context.Admin, startDate, endDate);
    },

    // ==================== TIME SLOT QUERIES ====================

    getAvailableTimeSlots: async (_: any, { date, adType }: any, context: Context) => {
      const adService = createAdService(context);
      return await adService.getAvailableTimeSlots(date, adType);
    },

    getAdSchedules: async (_: any, { adId, status, date }: any, context: Context) => {
      const adService = createAdService(context);
      return await adService.getAdSchedules(adId, status, date, context.Admin);
    },

    getUpcomingSchedules: async (_: any, { limit }: any, context: Context) => {
      const adService = createAdService(context);
      return await adService.getUpcomingSchedules(limit);
    },

    getFailedSchedules: async (_: any, { limit }: any, context: Context) => {
      const adService = createAdService(context);
      return await adService.getFailedSchedules(limit);
    }
  },

  Mutation: {
    createAdRequest: async (_: any, { input }: any, context: Context) => {
      const adService = createAdService(context);
      return await adService.createAdRequest(input, context.vendor);
    },

    updateAdRequest: async (_: any, { id, input }: any, context: Context) => {
      const adService = createAdService(context);
      return await adService.updateAdRequest(id, input, context.vendor);
    },

    cancelAdRequest: async (_: any, { id }: any, context: Context) => {
      const adService = createAdService(context);
      return await adService.cancelAdRequest(id, context.vendor);
    },

    approveAdRequest: async (_: any, { id, input }: any, context: Context) => {
      const adService = createAdService(context);
      return await adService.approveAdRequest(id, input, context.Admin);
    },

    rejectAdRequest: async (_: any, { id }: any, context: Context) => {
      const adService = createAdService(context);
      return await adService.rejectAdRequest(id, context.Admin);
    },

    reviewAdRequest: async (_: any, { id, status, adminNotes }: any, context: Context) => {
      const adService = createAdService(context);
      return await adService.reviewAdRequest(id, status, adminNotes, context.Admin);
    },

    activateServiceAd: async (_: any, { id }: any, context: Context) => {
      const adService = createAdService(context);
      return await adService.activateServiceAd(id, context.Admin);
    },

    expireServiceAd: async (_: any, { id }: any, context: Context) => {
      const adService = createAdService(context);
      return await adService.expireServiceAd(id, context.Admin);
    },

    updateServiceAd: async (_: any, { id, input }: any, context: Context) => {
      const adService = createAdService(context);
      return await adService.updateServiceAd(id, input, context.Admin);
    },

    pauseServiceAd: async (_: any, { id }: any, context: Context) => {
      const adService = createAdService(context);
      return await adService.pauseServiceAd(id, context.Admin);
    },

    resumeServiceAd: async (_: any, { id }: any, context: Context) => {
      const adService = createAdService(context);
      return await adService.resumeServiceAd(id, context.Admin);
    },

    cancelServiceAd: async (_: any, { id }: any, context: Context) => {
      const adService = createAdService(context);
      return await adService.cancelServiceAd(id, context.Admin);
    },

    extendServiceAd: async (_: any, { id, newEndDate }: any, context: Context) => {
      const adService = createAdService(context);
      return await adService.extendServiceAd(id, newEndDate, context.Admin);
    },

    createExternalAd: async (_: any, { input }: any, context: Context) => {
      const adService = createAdService(context);
      return await adService.createExternalAd(input, context.Admin);
    },

    updateExternalAd: async (_: any, { id, input }: any, context: Context) => {
      const adService = createAdService(context);
      return await adService.updateExternalAd(id, input, context.Admin);
    },

    deleteExternalAd: async (_: any, { id }: any, context: Context) => {
      const adService = createAdService(context);
      return await adService.deleteExternalAd(id, context.Admin);
    },

    createPayment: async (_: any, { input }: any, context: Context) => {
      const adService = createAdService(context);
      return await adService.createPayment(input, context.Admin);
    },

    updatePaymentStatus: async (_: any, { id, status }: any, context: Context) => {
      const adService = createAdService(context);
      return await adService.updatePaymentStatus(id, status, context.Admin);
    },

    recordImpression: async (_: any, { adId, isExternal }: any, context: Context) => {
      const adService = createAdService(context);
      return await adService.recordImpression(adId, isExternal);
    },

    recordClick: async (_: any, { adId, isExternal }: any, context: Context) => {
      const adService = createAdService(context);
      return await adService.recordClick(adId, isExternal);
    },

    recordConversion: async (_: any, { adId }: any, context: Context) => {
      const adService = createAdService(context);
      return await adService.recordConversion(adId);
    },

    // ==================== TIME SLOT MUTATIONS ====================

    approveAdRequestWithTimeSlots: async (_: any, { id, input }: any, context: Context) => {
      const adService = createAdService(context);
      return await adService.approveAdRequestWithTimeSlots(id, input, context.Admin);
    },

    updateAdTimeSlots: async (_: any, { adId, timeSlots }: any, context: Context) => {
      const adService = createAdService(context);
      return await adService.updateAdTimeSlots(adId, timeSlots, context.Admin);
    },

    scheduleAdRun: async (_: any, { adId, timeSlotId, scheduledDate }: any, context: Context) => {
      const adService = createAdService(context);
      return await adService.scheduleAdRun(adId, timeSlotId, scheduledDate, context.Admin);
    },

    cancelScheduledRun: async (_: any, { scheduleId }: any, context: Context) => {
      const adService = createAdService(context);
      return await adService.cancelScheduledRun(scheduleId, context.Admin);
    },

    rescheduleAdRun: async (_: any, { scheduleId, newDate, newTimeSlotId }: any, context: Context) => {
      const adService = createAdService(context);
      return await adService.rescheduleAdRun(scheduleId, newDate, newTimeSlotId, context.Admin);
    },

    retryFailedSchedule: async (_: any, { scheduleId }: any, context: Context) => {
      const adService = createAdService(context);
      return await adService.retryFailedSchedule(scheduleId, context.Admin);
    },

    pauseAdSchedule: async (_: any, { adId }: any, context: Context) => {
      const adService = createAdService(context);
      return await adService.pauseAdSchedule(adId, context.Admin);
    },

    resumeAdSchedule: async (_: any, { adId }: any, context: Context) => {
      const adService = createAdService(context);
      return await adService.resumeAdSchedule(adId, context.Admin);
    },

    bulkScheduleAds: async (_: any, { adIds, timeSlots, dateRange }: any, context: Context) => {
      const adService = createAdService(context);
      return await adService.bulkScheduleAds(adIds, timeSlots, dateRange, context.Admin);
    }
  }
};