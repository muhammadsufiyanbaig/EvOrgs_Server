import { GraphQLError } from 'graphql';
import { v4 as uuidv4 } from 'uuid';
import { AdModel } from '../Model';
import { InferSelectModel } from 'drizzle-orm';
import { servicesAds, externalAds, adPayments } from '../../../Schema';
import { Context } from '../../../GraphQL/Context';
import { Vendor } from '../../Auth/Vendor/Types';

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
  createAdRequest(input: any, vendor: Vendor | undefined) {
    throw new Error('Method not implemented.');
  }
  private model: AdModel;

  constructor(model: AdModel) {
    this.model = model;
  }

  async getActiveAds(adType?: "Featured" | "Sponsored" | "Premium", entityType?: "Venue" | "Farmhouse" | "Photography Package" | "Catering Package") {
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

  async getMyAdRequests(vendor: Context['vendor'], status?: "Pending" | "Approved" | "Rejected" | "Active" | "Expired") {
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

  async getAllAdRequests(admin: Context['Admin'], status?: "Pending" | "Approved" | "Rejected" | "Active" | "Expired", vendorId?: string) {
    if (!admin) {
      throw new GraphQLError('Admin access required', {
        extensions: { code: 'FORBIDDEN' }
      });
    }
    return await this.model.getAllAdRequests(status, vendorId);
  }

  async getAllServiceAds(admin: Context['Admin'], status?: "Pending" | "Approved" | "Rejected" | "Active" | "Expired", vendorId?: string) {
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

  async getExternalAds(admin: Context['Admin'], status?: "Active" | "Expired" | "Inactive") {
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
  async createExternalAd(input: Partial<InferSelectModel<typeof externalAds>>, admin: Context['Admin']) {
    if (!admin) {
      throw new GraphQLError('Admin access required', {
        extensions: { code: 'FORBIDDEN' }
      });
    }

    // Check required fields
    if (!input.adTitle) {
      throw new GraphQLError('Ad title is required', {
        extensions: { code: 'BAD_REQUEST' }
      });
    }

    if (!input.redirectUrl) {
      throw new GraphQLError('Redirect URL is required', {
        extensions: { code: 'BAD_REQUEST' }
      });
    }

    if (!input.price) {
      throw new GraphQLError('Price is required', {
        extensions: { code: 'BAD_REQUEST' }
      });
    }

    if (!input.advertiserName) {
      throw new GraphQLError('Advertiser name is required', {
        extensions: { code: 'BAD_REQUEST' }
      });
    }

    if (!input.advertiserEmail) {
      throw new GraphQLError('Advertiser email is required', {
        extensions: { code: 'BAD_REQUEST' }
      });
    }

    if (!input.imageUrl) {
      throw new GraphQLError('Image URL is required', {
        extensions: { code: 'BAD_REQUEST' }
      });
    }

    const newExternalAd = {
      id: uuidv4(),
      ...input,
      adTitle: input.adTitle, // Ensure adTitle is explicitly set as a string
      redirectUrl: input.redirectUrl, // Ensure redirectUrl is explicitly set
      price: input.price, // Ensure price is explicitly set
      advertiserName: input.advertiserName, // Ensure advertiserName is explicitly set as a string
      advertiserEmail: input.advertiserEmail, // Ensure advertiserEmail is explicitly set
      imageUrl: input.imageUrl, // Ensure imageUrl is explicitly set
      advertiserPhone: input.advertiserPhone || null, // Can be null according to schema
      adDescription: input.adDescription ?? null, // Explicitly handle undefined to null
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
      adId: input.adId || null,
      externalAdId: input.externalAdId || null,
      amountPaid: input.amountPaid || '0',
      paymentMethod: input.paymentMethod || null,
      transactionId: input.transactionId || null,
      paymentStatus: 'Pending' as const,
      invoiceNumber: input.invoiceNumber || `INV-${Date.now()}`, // Add the missing required property
      paidAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return await this.model.createPayment(newPayment);
  }

  async updatePaymentStatus(id: string, status: "Pending" | "Paid" | "Failed" | "Refunded", admin: Context['Admin']) {
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

  // ==================== TIME SLOT MANAGEMENT ====================

  async updateAdTimeSlots(adId: string, timeSlots: Array<{
    startTime: string;
    endTime: string;
    daysOfWeek: number[];
    priority: number;
  }>, admin: Context['Admin']) {
    if (!admin) {
      throw new GraphQLError('Admin access required', {
        extensions: { code: 'FORBIDDEN' }
      });
    }

    // Validate time slots
    for (const slot of timeSlots) {
      if (!this.isValidTimeFormat(slot.startTime) || !this.isValidTimeFormat(slot.endTime)) {
        throw new GraphQLError('Invalid time format. Use HH:MM format', {
          extensions: { code: 'INVALID_INPUT' }
        });
      }

      if (slot.startTime >= slot.endTime) {
        throw new GraphQLError('Start time must be before end time', {
          extensions: { code: 'INVALID_INPUT' }
        });
      }

      if (!Array.isArray(slot.daysOfWeek) || slot.daysOfWeek.some(day => day < 0 || day > 6)) {
        throw new GraphQLError('Invalid days of week. Use numbers 0-6 (Sunday-Saturday)', {
          extensions: { code: 'INVALID_INPUT' }
        });
      }

      if (slot.priority < 1 || slot.priority > 5) {
        throw new GraphQLError('Priority must be between 1 (highest) and 5 (lowest)', {
          extensions: { code: 'INVALID_INPUT' }
        });
      }
    }

    // Check if ad exists
    const ad = await this.model.getAdById(adId);
    if (!ad) {
      throw new GraphQLError('Ad not found', {
        extensions: { code: 'NOT_FOUND' }
      });
    }

    // Update time slots
    await this.model.updateTimeSlots(adId, timeSlots);

    // Return updated ad with time slots
    return await this.getAdWithTimeSlots(adId);
  }

  async getAvailableTimeSlots(date: string, adType?: string) {
    if (!this.isValidDateFormat(date)) {
      throw new GraphQLError('Invalid date format. Use YYYY-MM-DD format', {
        extensions: { code: 'INVALID_INPUT' }
      });
    }

    return await this.model.getAvailableTimeSlots(date, adType);
  }

  async scheduleAdRun(adId: string, timeSlotId: string, scheduledDate: string, admin: Context['Admin']) {
    if (!admin) {
      throw new GraphQLError('Admin access required', {
        extensions: { code: 'FORBIDDEN' }
      });
    }

    if (!this.isValidDateFormat(scheduledDate)) {
      throw new GraphQLError('Invalid date format. Use YYYY-MM-DD format', {
        extensions: { code: 'INVALID_INPUT' }
      });
    }

    // Check if ad and time slot exist
    const ad = await this.model.getAdById(adId);
    if (!ad) {
      throw new GraphQLError('Ad not found', {
        extensions: { code: 'NOT_FOUND' }
      });
    }

    const timeSlots = await this.model.getTimeSlotsByAdId(adId);
    const timeSlot = timeSlots.find(ts => ts.id === timeSlotId);
    if (!timeSlot) {
      throw new GraphQLError('Time slot not found for this ad', {
        extensions: { code: 'NOT_FOUND' }
      });
    }

    // Check availability
    const availability = await this.model.checkTimeSlotAvailability(
      scheduledDate, 
      timeSlot.startTime, 
      timeSlot.endTime
    );

    if (!availability.isAvailable) {
      throw new GraphQLError('Time slot is not available for the selected date', {
        extensions: { 
          code: 'CONFLICT',
          conflictingAds: availability.conflictingAds
        }
      });
    }

    // Create schedule
    const schedule = await this.model.createSchedule(adId, timeSlotId, scheduledDate);
    return schedule[0];
  }

  async cancelScheduledRun(scheduleId: string, admin: Context['Admin']) {
    if (!admin) {
      throw new GraphQLError('Admin access required', {
        extensions: { code: 'FORBIDDEN' }
      });
    }

    const result = await this.model.cancelSchedule(scheduleId);
    if (!result || result.length === 0) {
      throw new GraphQLError('Schedule not found or already cancelled', {
        extensions: { code: 'NOT_FOUND' }
      });
    }

    return result[0];
  }

  async rescheduleAdRun(scheduleId: string, newDate: string, newTimeSlotId?: string, admin?: Context['Admin']) {
    if (!admin) {
      throw new GraphQLError('Admin access required', {
        extensions: { code: 'FORBIDDEN' }
      });
    }

    if (!this.isValidDateFormat(newDate)) {
      throw new GraphQLError('Invalid date format. Use YYYY-MM-DD format', {
        extensions: { code: 'INVALID_INPUT' }
      });
    }

    const result = await this.model.rescheduleAd(scheduleId, newDate, newTimeSlotId);
    if (!result || result.length === 0) {
      throw new GraphQLError('Schedule not found', {
        extensions: { code: 'NOT_FOUND' }
      });
    }

    return result[0];
  }

  async getAdSchedules(adId?: string, status?: string, date?: string, admin?: Context['Admin']) {
    if (!admin) {
      throw new GraphQLError('Admin access required', {
        extensions: { code: 'FORBIDDEN' }
      });
    }

    if (adId) {
      return await this.model.getSchedulesByAdId(adId, status, date);
    } else {
      return await this.model.getAllSchedules(status, date);
    }
  }

  async getUpcomingSchedules(limit: number = 10) {
    const schedules = await this.model.getAllSchedules('Scheduled', undefined, limit);
    return schedules.map(s => s.schedule);
  }

  async getFailedSchedules(limit: number = 10) {
    const schedules = await this.model.getAllSchedules('Failed', undefined, limit);
    return schedules.map(s => s.schedule);
  }

  async retryFailedSchedule(scheduleId: string, admin: Context['Admin']) {
    if (!admin) {
      throw new GraphQLError('Admin access required', {
        extensions: { code: 'FORBIDDEN' }
      });
    }

    const result = await this.model.updateScheduleStatus(scheduleId, 'Scheduled', {
      retryCount: 0,
      nextRetry: null,
      failureReason: null,
    });

    if (!result || result.length === 0) {
      throw new GraphQLError('Schedule not found', {
        extensions: { code: 'NOT_FOUND' }
      });
    }

    return result[0];
  }

  async pauseAdSchedule(adId: string, admin: Context['Admin']) {
    if (!admin) {
      throw new GraphQLError('Admin access required', {
        extensions: { code: 'FORBIDDEN' }
      });
    }

    // Update all scheduled runs for this ad to paused
    const schedules = await this.model.getSchedulesByAdId(adId, 'Scheduled');
    const pausedSchedules = [];

    for (const schedule of schedules) {
      const result = await this.model.updateScheduleStatus(schedule.schedule.id, 'Paused');
      pausedSchedules.push(result[0]);
    }

    // Return updated ad
    return await this.getAdWithTimeSlots(adId);
  }

  async resumeAdSchedule(adId: string, admin: Context['Admin']) {
    if (!admin) {
      throw new GraphQLError('Admin access required', {
        extensions: { code: 'FORBIDDEN' }
      });
    }

    // Update all paused runs for this ad to scheduled
    const schedules = await this.model.getSchedulesByAdId(adId, 'Paused');
    const resumedSchedules = [];

    for (const schedule of schedules) {
      const result = await this.model.updateScheduleStatus(schedule.schedule.id, 'Scheduled');
      resumedSchedules.push(result[0]);
    }

    // Return updated ad
    return await this.getAdWithTimeSlots(adId);
  }

  async bulkScheduleAds(adIds: string[], timeSlots: Array<{
    startTime: string;
    endTime: string;
    daysOfWeek: number[];
    priority: number;
  }>, dateRange: string, admin: Context['Admin']) {
    if (!admin) {
      throw new GraphQLError('Admin access required', {
        extensions: { code: 'FORBIDDEN' }
      });
    }

    const schedules = [];
    const [startDate, endDate] = dateRange.split(',');

    if (!this.isValidDateFormat(startDate) || !this.isValidDateFormat(endDate)) {
      throw new GraphQLError('Invalid date range format. Use YYYY-MM-DD,YYYY-MM-DD', {
        extensions: { code: 'INVALID_INPUT' }
      });
    }

    for (const adId of adIds) {
      // Update time slots for each ad
      await this.model.updateTimeSlots(adId, timeSlots);
      
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
              const adTimeSlots = await this.model.getTimeSlotsByAdId(adId);
              const matchingSlot = adTimeSlots.find(ts => 
                ts.startTime === slot.startTime && 
                ts.endTime === slot.endTime
              );
              
              if (matchingSlot) {
                const schedule = await this.model.createSchedule(adId, matchingSlot.id, dateString);
                schedules.push(schedule[0]);
              }
            } catch (error) {
              console.error(`Failed to schedule ad ${adId} for ${dateString}:`, error);
            }
          }
        }
      }
    }

    return schedules;
  }

  // ==================== ENHANCED APPROVE WITH TIME SLOTS ====================

  async approveAdRequestWithTimeSlots(id: string, input: {
    finalPrice: number;
    adminStartDate: string;
    adminEndDate: string;
    adminNotes?: string;
    timeSlots: Array<{
      startTime: string;
      endTime: string;
      daysOfWeek: number[];
      priority: number;
    }>;
  }, admin: Context['Admin']) {
    if (!admin) {
      throw new GraphQLError('Admin access required', {
        extensions: { code: 'FORBIDDEN' }
      });
    }

    // First approve the ad request
    const approvedAd = await this.approveAdRequest(id, input, admin);
    
    // Then add time slots
    await this.model.createTimeSlots(approvedAd.id, input.timeSlots);
    
    // Return ad with time slots
    return await this.getAdWithTimeSlots(approvedAd.id);
  }

  // ==================== HELPER METHODS ====================

  private async getAdWithTimeSlots(adId: string) {
    const performance = await this.model.getAdPerformanceWithSchedule(adId);
    return {
      ...performance.ad,
      timeSlots: performance.timeSlots,
      currentSchedule: performance.schedules.find(s => s.schedule.status === 'Running')?.schedule || null,
      totalScheduledRuns: performance.statistics.totalRuns,
      successfulRuns: performance.statistics.successfulRuns,
      failedRuns: performance.statistics.failedRuns,
    };
  }

  private isValidTimeFormat(time: string): boolean {
    return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
  }

  private isValidDateFormat(date: string): boolean {
    return /^\d{4}-\d{2}-\d{2}$/.test(date) && !isNaN(Date.parse(date));
  }
}