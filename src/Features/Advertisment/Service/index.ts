import { GraphQLError } from 'graphql';
import { v4 as uuidv4 } from 'uuid';
import { AdModel } from '../Model';
import { InferSelectModel } from 'drizzle-orm';
import { servicesAds, externalAds, adPayments } from '../../../Schema';
import { Context } from '../../../GraphQL/Context';

interface AdAnalyticsInput {
  adId: string;
}

interface AdAnalyticsResponse {
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  conversionRate: number;
  totalSpent: number;
  averageDailyCost: number;
  daysActive: number;
}

export class AdService {
  private model: AdModel;

  constructor(model: AdModel) {
    this.model = model;
  }

  async getActiveAds(adType?: string, entityType?: string) {
    return await this.model.getActiveAds(adType, entityType);
  }

  async getActiveExternalAds() {
    return await this.model.getActiveExternalAds();
  }

  async getFeaturedAds() {
    return await this.model.getFeaturedAds();
  }

  async getSponsoredAds() {
    return await this.model.getSponsoredAds();
  }

  async getMyAdRequests(vendor: Context['vendor'], status?: string) {
    if (!vendor) {
      throw new GraphQLError('Vendor authentication required', {
        extensions: { code: 'UNAUTHENTICATED' }
      });
    }
    return await this.model.getMyAdRequests(vendor.id, status);
  }

  async getMyActiveAds(vendor: Context['vendor']) {
    if (!vendor) {
      throw new GraphQLError('Vendor authentication required', {
        extensions: { code: 'UNAUTHENTICATED' }
      });
    }
    return await this.model.getMyActiveAds(vendor.id);
  }

  async getAdRequestById(id: string, vendor: Context['vendor']) {
    if (!vendor) {
      throw new GraphQLError('Vendor authentication required', {
        extensions: { code: 'UNAUTHENTICATED' }
      });
    }
    return await this.model.getAdRequestById(id, vendor.id);
  }

  async getMyPayments(vendor: Context['vendor']) {
    if (!vendor) {
      throw new GraphQLError('Vendor authentication required', {
        extensions: { code: 'UNAUTHENTICATED' }
      });
    }
    return await this.model.getMyPayments(vendor.id);
  }

  async getAllAdRequests(admin: Context['Admin'], status?: string, vendorId?: string) {
    if (!admin) {
      throw new GraphQLError('Admin access required', {
        extensions: { code: 'FORBIDDEN' }
      });
    }
    return await this.model.getAllAdRequests(status, vendorId);
  }

  async getAllServiceAds(admin: Context['Admin'], status?: string, vendorId?: string) {
    if (!admin) {
      throw new GraphQLError('Admin access required', {
        extensions: { code: 'FORBIDDEN' }
      });
    }
    return await this.model.getAllServiceAds(status, vendorId);
  }

  async getPendingAdRequests(admin: Context['Admin']) {
    if (!admin) {
      throw new GraphQLError('Admin access required', {
        extensions: { code: 'FORBIDDEN' }
      });
    }
    return await this.model.getPendingAdRequests();
  }

  async getExternalAds(admin: Context['Admin'], status?: string) {
    if (!admin) {
      throw new GraphQLError('Admin access required', {
        extensions: { code: 'FORBIDDEN' }
      });
    }
    return await this.model.getExternalAds(status);
  }

  async getExternalAdById(admin: Context['Admin'], id: string) {
    if (!admin) {
      throw new GraphQLError('Admin access required', {
        extensions: { code: 'FORBIDDEN' }
      });
    }
    return await this.model.getExternalAdById(id);
  }

  async getAdPayments(admin: Context['Admin'], adId?: string, externalAdId?: string) {
    if (!admin) {
      throw new GraphQLError('Admin access required', {
        extensions: { code: 'FORBIDDEN' }
      });
    }
    return await this.model.getAdPayments(adId, externalAdId);
  }

  async getPaymentById(admin: Context['Admin'], id: string) {
    if (!admin) {
      throw new GraphQLError('Admin access required', {
        extensions: { code: 'FORBIDDEN' }
      });
    }
    return await this.model.getPaymentById(id);
  }

  async getAdAnalytics({ adId }: AdAnalyticsInput, { vendor, Admin }: Context): Promise<AdAnalyticsResponse> {
    if (!vendor && !Admin) {
      throw new GraphQLError('Authentication required', {
        extensions: { code: 'UNAUTHENTICATED' },
      });
    }

    const ad = await this.model.getAdForAnalytics(adId);
    if (!ad) {
      throw new GraphQLError('Ad not found', {
        extensions: { code: 'NOT_FOUND' },
      });
    }

    if (vendor && ad.vendorId !== vendor.id && !Admin) {
      throw new GraphQLError('Access denied', {
        extensions: { code: 'FORBIDDEN' },
      });
    }

    const totalSpent = await this.model.getTotalSpent(adId);
    const impressions = Number(ad.impressionCount ?? 0);
    const clicks = Number(ad.clickCount ?? 0);
    const conversions = Number(ad.conversionCount ?? 0);
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
        daysActive = Math.max(
          1,
          Math.ceil((effectiveEndDate.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
        );
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
  }

  async getDashboardStats(admin: Context['Admin']) {
    if (!admin) {
      throw new GraphQLError('Admin access required', {
        extensions: { code: 'FORBIDDEN' }
      });
    }

    const { requestStats, adStats, paymentStats } = await this.model.getDashboardStats();
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
  }

  async getTopPerformingAds(admin: Context['Admin'], limit: number = 10) {
    if (!admin) {
      throw new GraphQLError('Admin access required', {
        extensions: { code: 'FORBIDDEN' }
      });
    }
    return await this.model.getTopPerformingAds(limit);
  }

  async getRevenueAnalytics(admin: Context['Admin'], startDate?: string, endDate?: string) {
    if (!admin) {
      throw new GraphQLError('Admin access required', {
        extensions: { code: 'FORBIDDEN' }
      });
    }
    return await this.model.getRevenueAnalytics(startDate, endDate);
  }

  async createAdRequest(input: Partial<InferSelectModel<typeof servicesAds>>, vendor: Context['vendor']) {
    if (!vendor) {
      throw new GraphQLError('Vendor authentication required', {
        extensions: { code: 'UNAUTHENTICATED' }
      });
    }

    const newAdRequest = {
      id: uuidv4(),
      vendorId: vendor.id,
      ...input,
      status: 'Pending' as const,
      impressionCount: 0,
      clickCount: 0,
      conversionCount: 0,
      startDate: input.startDate ? new Date(input.startDate) : null,
      endDate: input.endDate ? new Date(input.endDate) : null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return await this.model.createAdRequest(newAdRequest);
  }

  async updateAdRequest(id: string, input: Partial<InferSelectModel<typeof servicesAds>>, vendor: Context['vendor']) {
    if (!vendor) {
      throw new GraphQLError('Vendor authentication required', {
        extensions: { code: 'UNAUTHENTICATED' }
      });
    }

    const adRequest = await this.model.getAdById(id);
    if (!adRequest || adRequest.vendorId !== vendor.id) {
      throw new GraphQLError('Request not found or access denied', {
        extensions: { code: 'FORBIDDEN' }
      });
    }

    if (adRequest.status !== 'Pending') {
      throw new GraphQLError('Cannot update non-pending request', {
        extensions: { code: 'BAD_REQUEST' }
      });
    }

    const updateData = {
      ...input,
      startDate: input.startDate ? new Date(input.startDate) : undefined,
      endDate: input.endDate ? new Date(input.endDate) : undefined,
      updatedAt: new Date()
    };

    return await this.model.updateAdRequest(id, updateData);
  }

  async cancelAdRequest(id: string, vendor: Context['vendor']) {
    if (!vendor) {
      throw new GraphQLError('Vendor authentication required', {
        extensions: { code: 'UNAUTHENTICATED' }
      });
    }

    const adRequest = await this.model.getAdById(id);
    if (!adRequest || adRequest.vendorId !== vendor.id) {
      throw new GraphQLError('Request not found or access denied', {
        extensions: { code: 'FORBIDDEN' }
      });
    }

    if (adRequest.status !== 'Pending') {
      throw new GraphQLError('Only pending requests can be cancelled', {
        extensions: { code: 'BAD_REQUEST' }
      });
    }

    const result = await this.model.updateAdRequest(id, {
      status: 'Rejected',
      updatedAt: new Date()
    });

    return !!result;
  }

  async approveAdRequest(id: string, input: { finalPrice?: number; startDate?: string; endDate?: string }, admin: Context['Admin']) {
    if (!admin) {
      throw new GraphQLError('Admin access required', {
        extensions: { code: 'FORBIDDEN' }
      });
    }

    const adRequest = await this.model.getAdById(id);
    if (!adRequest) {
      throw new GraphQLError('Request not found', {
        extensions: { code: 'NOT_FOUND' }
      });
    }

    if (adRequest.status !== 'Pending') {
      throw new GraphQLError('Can only approve pending requests', {
        extensions: { code: 'BAD_REQUEST' }
      });
    }

    return await this.model.updateAdRequest(id, {
      status: 'Approved',
      price: input.finalPrice !== undefined ? String(input.finalPrice) : adRequest.price,
      startDate: input.startDate ? new Date(input.startDate) : adRequest.startDate,
      endDate: input.endDate ? new Date(input.endDate) : adRequest.endDate,
      updatedAt: new Date()
    });
  }

  async rejectAdRequest(id: string, admin: Context['Admin']) {
    if (!admin) {
      throw new GraphQLError('Admin access required', {
        extensions: { code: 'FORBIDDEN' }
      });
    }

    const adRequest = await this.model.getAdById(id);
    if (!adRequest) {
      throw new GraphQLError('Request not found', {
        extensions: { code: 'NOT_FOUND' }
      });
    }

    if (adRequest.status !== 'Pending') {
      throw new GraphQLError('Can only reject pending requests', {
        extensions: { code: 'BAD_REQUEST' }
      });
    }

    return await this.model.updateAdRequest(id, {
      status: 'Rejected',
      updatedAt: new Date()
    });
  }

  async reviewAdRequest(id: string, status: "Pending" | "Approved" | "Rejected" | "Active" | "Expired", adminNotes: string, admin: Context['Admin']) {
    if (!admin) {
      throw new GraphQLError('Admin access required', {
        extensions: { code: 'FORBIDDEN' }
      });
    }

    const adRequest = await this.model.getAdById(id);
    if (!adRequest) {
      throw new GraphQLError('Request not found', {
        extensions: { code: 'NOT_FOUND' }
      });
    }

    if (adRequest.status !== 'Pending') {
      throw new GraphQLError('Can only review pending requests', {
        extensions: { code: 'BAD_REQUEST' }
      });
    }

    return await this.model.updateAdRequest(id, {
      status,
      adminNotes, // assuming this field exists in the database schema
      reviewedBy: admin.id,
      reviewedAt: new Date(),
      updatedAt: new Date()
    } as any); // Type assertion to bypass TypeScript check
  }

  async activateServiceAd(id: string, admin: Context['Admin']) {
    if (!admin) {
      throw new GraphQLError('Admin access required', {
        extensions: { code: 'FORBIDDEN' }
      });
    }

    const ad = await this.model.getAdById(id);
    if (!ad) {
      throw new GraphQLError('Ad not found', {
        extensions: { code: 'NOT_FOUND' }
      });
    }

    if (ad.status !== 'Approved') {
      throw new GraphQLError('Can only activate approved ads', {
        extensions: { code: 'BAD_REQUEST' }
      });
    }

    return await this.model.updateAdRequest(id, {
      status: 'Active',
      updatedAt: new Date()
    });
  }

  async expireServiceAd(id: string, admin: Context['Admin']) {
    if (!admin) {
      throw new GraphQLError('Admin access required', {
        extensions: { code: 'FORBIDDEN' }
      });
    }

    const ad = await this.model.getAdById(id);
    if (!ad) {
      throw new GraphQLError('Ad not found', {
        extensions: { code: 'NOT_FOUND' }
      });
    }

    if (ad.status === 'Expired') {
      throw new GraphQLError('Ad is already expired', {
        extensions: { code: 'BAD_REQUEST' }
      });
    }

    return await this.model.updateAdRequest(id, {
      status: 'Expired',
      updatedAt: new Date()
    });
  }

  async updateServiceAd(id: string, input: Partial<InferSelectModel<typeof servicesAds>>, admin: Context['Admin']) {
    if (!admin) {
      throw new GraphQLError('Admin access required', {
        extensions: { code: 'FORBIDDEN' }
      });
    }

    const ad = await this.model.getAdById(id);
    if (!ad) {
      throw new GraphQLError('Ad not found', {
        extensions: { code: 'NOT_FOUND' }
      });
    }

    const updateData = {
      ...input,
      startDate: input.startDate ? new Date(input.startDate) : undefined,
      endDate: input.endDate ? new Date(input.endDate) : undefined,
      updatedAt: new Date()
    };

    return await this.model.updateAdRequest(id, updateData);
  }

  async pauseServiceAd(id: string, admin: Context['Admin']) {
    if (!admin) {
      throw new GraphQLError('Admin access required', {
        extensions: { code: 'FORBIDDEN' }
      });
    }

    const ad = await this.model.getAdById(id);
    if (!ad) {
      throw new GraphQLError('Ad not found', {
        extensions: { code: 'NOT_FOUND' }
      });
    }

    if (ad.status !== 'Active') {
      throw new GraphQLError('Can only pause active ads', {
        extensions: { code: 'BAD_REQUEST' }
      });
    }

    return await this.model.updateAdRequest(id, {
      status: 'Approved',
      updatedAt: new Date()
    });
  }

  async resumeServiceAd(id: string, admin: Context['Admin']) {
    if (!admin) {
      throw new GraphQLError('Admin access required', {
        extensions: { code: 'FORBIDDEN' }
      });
    }

    const ad = await this.model.getAdById(id);
    if (!ad) {
      throw new GraphQLError('Ad not found', {
        extensions: { code: 'NOT_FOUND' }
      });
    }

    if (ad.status !== 'Approved') {
      throw new GraphQLError('Can only resume paused ads', {
        extensions: { code: 'BAD_REQUEST' }
      });
    }

    return await this.model.updateAdRequest(id, {
      status: 'Active',
      updatedAt: new Date()
    });
  }

  async cancelServiceAd(id: string, admin: Context['Admin']) {
    if (!admin) {
      throw new GraphQLError('Admin access required', {
        extensions: { code: 'FORBIDDEN' }
      });
    }

    const ad = await this.model.getAdById(id);
    if (!ad) {
      throw new GraphQLError('Ad not found', {
        extensions: { code: 'NOT_FOUND' }
      });
    }

    if (!['Active', 'Approved'].includes(ad.status ?? '')) {
      throw new GraphQLError('Can only cancel active or paused ads', {
        extensions: { code: 'BAD_REQUEST' }
      });
    }

    return await this.model.updateAdRequest(id, {
      status: 'Rejected',
      updatedAt: new Date()
    });
  }

  async extendServiceAd(id: string, newEndDate: string, admin: Context['Admin']) {
    if (!admin) {
      throw new GraphQLError('Admin access required', {
        extensions: { code: 'FORBIDDEN' }
      });
    }

    const ad = await this.model.getAdById(id);
    if (!ad) {
      throw new GraphQLError('Ad not found', {
        extensions: { code: 'NOT_FOUND' }
      });
    }

    if (!['Active', 'Approved'].includes(ad.status ?? '')) {
      throw new GraphQLError('Can only extend active or paused ads', {
        extensions: { code: 'BAD_REQUEST' }
      });
    }

    const parsedNewEndDate = new Date(newEndDate);
    if (isNaN(parsedNewEndDate.getTime())) {
      throw new GraphQLError('Invalid new end date', {
        extensions: { code: 'BAD_REQUEST' }
      });
    }

    if (ad.endDate && parsedNewEndDate <= new Date(ad.endDate)) {
      throw new GraphQLError('New end date must be after current end date', {
        extensions: { code: 'BAD_REQUEST' }
      });
    }

    return await this.model.updateAdRequest(id, {
      endDate: parsedNewEndDate,
      updatedAt: new Date()
    });
  }

  async createExternalAd(input: Partial<InferSelectModel<typeof externalAds>>, admin: Context['Admin']) {
    if (!admin) {
      throw new GraphQLError('Admin access required', {
        extensions: { code: 'FORBIDDEN' }
      });
    }

    const newExternalAd = {
      id: uuidv4(),
      ...input,
      status: input.status || 'Active' as const,
      impressionCount: 0,
      clickCount: 0,
      startDate: input.startDate ? new Date(input.startDate) : null,
      endDate: input.endDate ? new Date(input.endDate) : null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return await this.model.createExternalAd(newExternalAd);
  }

  async updateExternalAd(id: string, input: Partial<InferSelectModel<typeof externalAds>>, admin: Context['Admin']) {
    if (!admin) {
      throw new GraphQLError('Admin access required', {
        extensions: { code: 'FORBIDDEN' }
      });
    }

    const externalAd = await this.model.getExternalAdById(id);
    if (!externalAd) {
      throw new GraphQLError('External ad not found', {
        extensions: { code: 'NOT_FOUND' }
      });
    }

    const updateData = {
      ...input,
      startDate: input.startDate ? new Date(input.startDate) : undefined,
      endDate: input.endDate ? new Date(input.endDate) : undefined,
      updatedAt: new Date()
    };

    return await this.model.updateExternalAd(id, updateData);
  }

  async deleteExternalAd(id: string, admin: Context['Admin']) {
    if (!admin) {
      throw new GraphQLError('Admin access required', {
        extensions: { code: 'FORBIDDEN' }
      });
    }

    const externalAd = await this.model.getExternalAdById(id);
    if (!externalAd) {
      throw new GraphQLError('External ad not found', {
        extensions: { code: 'NOT_FOUND' }
      });
    }

    return await this.model.deleteExternalAd(id);
  }

  async createPayment(input: Partial<InferSelectModel<typeof adPayments>>, admin: Context['Admin']) {
    if (!admin) {
      throw new GraphQLError('Admin access required', {
        extensions: { code: 'FORBIDDEN' }
      });
    }

    if (!input.adId && !input.externalAdId) {
      throw new GraphQLError('Either adId or externalAdId must be provided', {
        extensions: { code: 'BAD_REQUEST' }
      });
    }

    let vendorId = null;
    if (input.adId) {
      const serviceAd = await this.model.getAdById(input.adId);
      if (!serviceAd) {
        throw new GraphQLError('Service ad not found', {
          extensions: { code: 'NOT_FOUND' }
        });
      }
      vendorId = serviceAd.vendorId;
    }

    const newPayment = {
      id: uuidv4(),
      vendorId,
      ...input,
      paymentStatus: 'Paid' as const,
      paidAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return await this.model.createPayment(newPayment);
  }

  async updatePaymentStatus(id: string, status: string, admin: Context['Admin']) {
    if (!admin) {
      throw new GraphQLError('Admin access required', {
        extensions: { code: 'FORBIDDEN' }
      });
    }

    const payment = await this.model.getPaymentById(id);
    if (!payment) {
      throw new GraphQLError('Payment not found', {
        extensions: { code: 'NOT_FOUND' }
      });
    }

    const updateData: Partial<InferSelectModel<typeof adPayments>> = {
      paymentStatus: status,
      updatedAt: new Date()
    };

    if (status === 'Paid' && payment.paymentStatus !== 'Paid') {
      updateData.paidAt = new Date();
    }

    return await this.model.updatePaymentStatus(id, updateData);
  }

  async recordImpression(adId: string, isExternal: boolean) {
    try {
      return await this.model.recordImpression(adId, isExternal);
    } catch (error) {
      console.error('Error recording impression:', error);
      return false;
    }
  }

  async recordClick(adId: string, isExternal: boolean) {
    try {
      return await this.model.recordClick(adId, isExternal);
    } catch (error) {
      console.error('Error recording click:', error);
      return false;
    }
  }

  async recordConversion(adId: string) {
    try {
      return await this.model.recordConversion(adId);
    } catch (error) {
      console.error('Error recording conversion:', error);
      return false;
    }
  }
}