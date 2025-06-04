import { AdService } from '../../Service';
import { Context } from '../../../../GraphQL/Context';

interface AdAnalyticsInput {
  adId: string;
}

export const adResolvers = (adService: AdService) => ({
  Query: {
    getActiveAds: async (_: any, { adType, entityType }: any, { db }: Context) => {
      return await adService.getActiveAds(adType, entityType);
    },

    getActiveExternalAds: async (_: any, __: any, { db }: Context) => {
      return await adService.getActiveExternalAds();
    },

    getFeaturedAds: async (_: any, __: any, { db }: Context) => {
      return await adService.getFeaturedAds();
    },

    getSponsoredAds: async (_: any, __: any, { db }: Context) => {
      return await adService.getSponsoredAds();
    },

    getMyAdRequests: async (_: any, { status }: any, { vendor }: Context) => {
      return await adService.getMyAdRequests(vendor, status);
    },

    getMyActiveAds: async (_: any, __: any, { vendor }: Context) => {
      return await adService.getMyActiveAds(vendor);
    },

    getAdRequestById: async (_: any, { id }: any, { vendor }: Context) => {
      return await adService.getAdRequestById(id, vendor);
    },

    getMyPayments: async (_: any, __: any, { vendor }: Context) => {
      return await adService.getMyPayments(vendor);
    },

    getAllAdRequests: async (_: any, { status, vendorId }: any, { Admin }: Context) => {
      return await adService.getAllAdRequests(Admin, status, vendorId);
    },

    getAllServiceAds: async (_: any, { status, vendorId }: any, { Admin }: Context) => {
      return await adService.getAllServiceAds(Admin, status, vendorId);
    },

    getPendingAdRequests: async (_: any, __: any, { Admin }: Context) => {
      return await adService.getPendingAdRequests(Admin);
    },

    getExternalAds: async (_: any, { status }: any, { Admin }: Context) => {
      return await adService.getExternalAds(Admin, status);
    },

    getExternalAdById: async (_: any, { id }: any, { Admin }: Context) => {
      return await adService.getExternalAdById(Admin, id);
    },

    getAdPayments: async (_: any, { adId, externalAdId }: any, { Admin }: Context) => {
      return await adService.getAdPayments(Admin, adId, externalAdId);
    },

    getPaymentById: async (_: any, { id }: any, { Admin }: Context) => {
      return await adService.getPaymentById(Admin, id);
    },

    getAdAnalytics: async (_: any, { adId }: AdAnalyticsInput, context: Context) => {
      return await adService.getAdAnalytics({ adId }, context);
    },

    getDashboardStats: async (_: any, __: any, { Admin }: Context) => {
      return await adService.getDashboardStats(Admin);
    },

    getTopPerformingAds: async (_: any, { limit }: any, { Admin }: Context) => {
      return await adService.getTopPerformingAds(Admin, limit);
    },

    getRevenueAnalytics: async (_: any, { startDate, endDate }: any, { Admin }: Context) => {
      return await adService.getRevenueAnalytics(Admin, startDate, endDate);
    },
  },

  Mutation: {
    createAdRequest: async (_: any, { input }: any, { vendor }: Context) => {
      return await adService.createAdRequest(input, vendor);
    },

    updateAdRequest: async (_: any, { id, input }: any, { vendor }: Context) => {
      return await adService.updateAdRequest(id, input, vendor);
    },

    cancelAdRequest: async (_: any, { id }: any, { vendor }: Context) => {
      return await adService.cancelAdRequest(id, vendor);
    },

    approveAdRequest: async (_: any, { id, input }: any, { Admin }: Context) => {
      return await adService.approveAdRequest(id, input, Admin);
    },

    rejectAdRequest: async (_: any, { id }: any, { Admin }: Context) => {
      return await adService.rejectAdRequest(id, Admin);
    },

    reviewAdRequest: async (_: any, { id, status, adminNotes }: any, { Admin }: Context) => {
      return await adService.reviewAdRequest(id, status, adminNotes, Admin);
    },

    activateServiceAd: async (_: any, { id }: any, { Admin }: Context) => {
      return await adService.activateServiceAd(id, Admin);
    },

    expireServiceAd: async (_: any, { id }: any, { Admin }: Context) => {
      return await adService.expireServiceAd(id, Admin);
    },

    updateServiceAd: async (_: any, { id, input }: any, { Admin }: Context) => {
      return await adService.updateServiceAd(id, input, Admin);
    },

    pauseServiceAd: async (_: any, { id }: any, { Admin }: Context) => {
      return await adService.pauseServiceAd(id, Admin);
    },

    resumeServiceAd: async (_: any, { id }: any, { Admin }: Context) => {
      return await adService.resumeServiceAd(id, Admin);
    },

    cancelServiceAd: async (_: any, { id }: any, { Admin }: Context) => {
      return await adService.cancelServiceAd(id, Admin);
    },

    extendServiceAd: async (_: any, { id, newEndDate }: any, { Admin }: Context) => {
      return await adService.extendServiceAd(id, newEndDate, Admin);
    },

    createExternalAd: async (_: any, { input }: any, { Admin }: Context) => {
      return await adService.createExternalAd(input, Admin);
    },

    updateExternalAd: async (_: any, { id, input }: any, { Admin }: Context) => {
      return await adService.updateExternalAd(id, input, Admin);
    },

    deleteExternalAd: async (_: any, { id }: any, { Admin }: Context) => {
      return await adService.deleteExternalAd(id, Admin);
    },

    createPayment: async (_: any, { input }: any, { Admin }: Context) => {
      return await adService.createPayment(input, Admin);
    },

    updatePaymentStatus: async (_: any, { id, status }: any, { Admin }: Context) => {
      return await adService.updatePaymentStatus(id, status, Admin);
    },

    recordImpression: async (_: any, { adId, isExternal }: any, { db }: Context) => {
      return await adService.recordImpression(adId, isExternal);
    },

    recordClick: async (_: any, { adId, isExternal }: any, { db }: Context) => {
      return await adService.recordClick(adId, isExternal);
    },

    recordConversion: async (_: any, { adId }: any, { db }: Context) => {
      return await adService.recordConversion(adId);
    }
  }
});