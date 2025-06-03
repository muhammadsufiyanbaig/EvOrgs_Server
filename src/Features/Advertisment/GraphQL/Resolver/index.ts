import { eq, and, sql } from 'drizzle-orm';
import { servicesAds, externalAds, adPayments } from '../../../../Schema';
import { GraphQLError } from 'graphql';
import { v4 as uuidv4 } from 'uuid';
import { Context } from '../../../../GraphQL/Context';


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

export const adResolvers = {
  Query: {
    // PUBLIC QUERIES
    getActiveAds: async (_: any, { adType, entityType }: any, { db }: Context) => {
      const conditions = [eq(servicesAds.status, 'Active')];
      if (adType) conditions.push(eq(servicesAds.adType, adType));
      if (entityType) conditions.push(eq(servicesAds.entityType, entityType));

      return await db.select()
        .from(servicesAds)
        .where(and(...conditions))
        .orderBy(sql`${servicesAds.createdAt} DESC`);
    },

    getActiveExternalAds: async (_: any, __: any, { db }: Context) => {
      return await db.select()
        .from(externalAds)
        .where(eq(externalAds.status, 'Active'))
        .orderBy(sql`${externalAds.createdAt} DESC`);
    },

    getFeaturedAds: async (_: any, __: any, { db }: Context) => {
      return await db.select()
        .from(servicesAds)
        .where(and(
          eq(servicesAds.status, 'Active'),
          eq(servicesAds.adType, 'Featured')
        ))
        .orderBy(sql`${servicesAds.createdAt} DESC`);
    },

    getSponsoredAds: async (_: any, __: any, { db }: Context) => {
      return await db.select()
        .from(servicesAds)
        .where(and(
          eq(servicesAds.status, 'Active'),
          eq(servicesAds.adType, 'Sponsored')
        ))
        .orderBy(sql`${servicesAds.createdAt} DESC`);
    },

    // VENDOR QUERIES
    getMyAdRequests: async (_: any, { status }: any, { db, vendor }: Context) => {
      if (!vendor) {
        throw new GraphQLError('Vendor authentication required', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      const conditions = [
        eq(servicesAds.vendorId, vendor.id),
        sql`${servicesAds.status} IN ('Pending', 'Rejected')`
      ];
      if (status) conditions.push(eq(servicesAds.status, status));

      return await db.select()
        .from(servicesAds)
        .where(and(...conditions))
        .orderBy(sql`${servicesAds.createdAt} DESC`);
    },

    getMyActiveAds: async (_: any, __: any, { db, vendor }: Context) => {
      if (!vendor) {
        throw new GraphQLError('Vendor authentication required', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      return await db.select()
        .from(servicesAds)
        .where(and(
          eq(servicesAds.vendorId, vendor.id),
          sql`${servicesAds.status} IN ('Active', 'Approved')`
        ))
        .orderBy(sql`${servicesAds.createdAt} DESC`);
    },

    getAdRequestById: async (_: any, { id }: any, { db, vendor }: Context) => {
      if (!vendor) {
        throw new GraphQLError('Vendor authentication required', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      const result = await db.select()
        .from(servicesAds)
        .where(and(
          eq(servicesAds.id, id),
          eq(servicesAds.vendorId, vendor.id)
        ))
        .limit(1);

      return result[0] || null;
    },

    getMyPayments: async (_: any, __: any, { db, vendor }: Context) => {
      if (!vendor) {
        throw new GraphQLError('Vendor authentication required', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      return await db.select()
        .from(adPayments)
        .where(eq(adPayments.vendorId, vendor.id))
        .orderBy(sql`${adPayments.createdAt} DESC`);
    },

    // ADMIN QUERIES
    getAllAdRequests: async (_: any, { status, vendorId }: any, { db, Admin }: Context) => {
      if (!Admin) {
        throw new GraphQLError('Admin access required', {
          extensions: { code: 'FORBIDDEN' }
        });
      }

      const conditions = [
        sql`${servicesAds.status} IN ('Pending', 'Rejected')`
      ];
      if (status) conditions.push(eq(servicesAds.status, status));
      if (vendorId) conditions.push(eq(servicesAds.vendorId, vendorId));

      return await db.select()
        .from(servicesAds)
        .where(and(...conditions))
        .orderBy(sql`${servicesAds.createdAt} DESC`);
    },

    getAllServiceAds: async (_: any, { status, vendorId }: any, { db, Admin }: Context) => {
      if (!Admin) {
        throw new GraphQLError('Admin access required', {
          extensions: { code: 'FORBIDDEN' }
        });
      }

      const conditions = [];
      if (status) conditions.push(eq(servicesAds.status, status));
      if (vendorId) conditions.push(eq(servicesAds.vendorId, vendorId));

      const query = conditions.length > 0
        ? db.select().from(servicesAds).where(and(...conditions))
        : db.select().from(servicesAds);

      return await query.orderBy(sql`${servicesAds.createdAt} DESC`);
    },

    getPendingAdRequests: async (_: any, __: any, { db, Admin }: Context) => {
      if (!Admin) {
        throw new GraphQLError('Admin access required', {
          extensions: { code: 'FORBIDDEN' }
        });
      }

      return await db.select()
        .from(servicesAds)
        .where(eq(servicesAds.status, 'Pending'))
        .orderBy(sql`${servicesAds.createdAt} ASC`);
    },

    getExternalAds: async (_: any, { status }: any, { db, Admin }: Context) => {
      if (!Admin) {
        throw new GraphQLError('Admin access required', {
          extensions: { code: 'FORBIDDEN' }
        });
      }

      const query = status
        ? db.select().from(externalAds).where(eq(externalAds.status, status))
        : db.select().from(externalAds);

      return await query.orderBy(sql`${externalAds.createdAt} DESC`);
    },

    getExternalAdById: async (_: any, { id }: any, { db, Admin }: Context) => {
      if (!Admin) {
        throw new GraphQLError('Admin access required', {
          extensions: { code: 'FORBIDDEN' }
        });
      }

      const result = await db.select()
        .from(externalAds)
        .where(eq(externalAds.id, id))
        .limit(1);

      return result[0] || null;
    },

    getAdPayments: async (_: any, { adId, externalAdId }: any, { db, Admin }: Context) => {
      if (!Admin) {
        throw new GraphQLError('Admin access required', {
          extensions: { code: 'FORBIDDEN' }
        });
      }

      const conditions = [];
      if (adId) conditions.push(eq(adPayments.adId, adId));
      if (externalAdId) conditions.push(eq(adPayments.externalAdId, externalAdId));

      const query = conditions.length > 0
        ? db.select().from(adPayments).where(and(...conditions))
        : db.select().from(adPayments);

      return await query.orderBy(sql`${adPayments.createdAt} DESC`);
    },

    getPaymentById: async (_: any, { id }: any, { db, Admin }: Context) => {
      if (!Admin) {
        throw new GraphQLError('Admin access required', {
          extensions: { code: 'FORBIDDEN' }
        });
      }

      const result = await db.select()
        .from(adPayments)
        .where(eq(adPayments.id, id))
        .limit(1);

      return result[0] || null;
    },

  getAdAnalytics: async (
  _: unknown,
  { adId }: AdAnalyticsInput,
  { db, vendor, Admin }: Context
): Promise<AdAnalyticsResponse> => {
  // Authentication check
  if (!vendor && !Admin) {
    throw new GraphQLError('Authentication required', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }

  try {
    // Fetch ad
    const ad = await db
      .select()
      .from(servicesAds)
      .where(eq(servicesAds.id, adId))
      .limit(1);

    if (!ad[0]) {
      throw new GraphQLError('Ad not found', {
        extensions: { code: 'NOT_FOUND' },
      });
    }

    // Authorization check
    if (vendor && ad[0].vendorId !== vendor.id && !Admin) {
      throw new GraphQLError('Access denied', {
        extensions: { code: 'FORBIDDEN' },
      });
    }

    // Fetch total spent
    const totalSpentResult = await db
      .select({
        total: sql<number>`COALESCE(SUM(${adPayments.amountPaid}), 0)`.as('total'),
      })
      .from(adPayments)
      .where(eq(adPayments.adId, adId));

    // Extract and ensure numeric values for counts
    const impressions = Number(ad[0].impressionCount ?? 0);
    const clicks = Number(ad[0].clickCount ?? 0);
    const conversions = Number(ad[0].conversionCount ?? 0);
    const { startDate, endDate } = ad[0];

    // Calculate CTR and conversion rate
    const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
    const conversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0;

    // Calculate days active
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

    const totalSpent = Number(totalSpentResult[0].total) || 0;
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
  } catch (error) {
    // Handle database or unexpected errors
    throw new GraphQLError('Failed to fetch ad analytics', {
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
        originalError: error instanceof Error ? error.message : 'Unknown error',
      },
    });
  }
},

    getDashboardStats: async (_: any, __: any, { db, Admin }: Context) => {
      if (!Admin) {
        throw new GraphQLError('Admin access required', {
          extensions: { code: 'FORBIDDEN' }
        });
      }

      const [requestStats, adStats, paymentStats] = await Promise.all([
        db.select({
          total: sql<number>`COUNT(*)`.as('total'),
          pending: sql<number>`COUNT(*) FILTER (WHERE ${servicesAds.status} = 'Pending')`.as('pending')
        }).from(servicesAds).where(
          sql`${servicesAds.status} IN ('Pending', 'Rejected')`
        ),

        db.select({
          active: sql<number>`COUNT(*) FILTER (WHERE ${servicesAds.status} = 'Active')`.as('active'),
          totalImpressions: sql<number>`COALESCE(SUM(${servicesAds.impressionCount}), 0)`.as('totalImpressions'),
          totalClicks: sql<number>`COALESCE(SUM(${servicesAds.clickCount}), 0)`.as('totalClicks')
        }).from(servicesAds),

        db.select({
          totalRevenue: sql<number>`COALESCE(SUM(${adPayments.amountPaid}), 0)`.as('totalRevenue')
        }).from(adPayments).where(eq(adPayments.paymentStatus, 'Paid'))
      ]);

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
    },

    getTopPerformingAds: async (_: any, { limit = 10 }: any, { db, Admin }: Context) => {
      if (!Admin) {
        throw new GraphQLError('Admin access required', {
          extensions: { code: 'FORBIDDEN' }
        });
      }

      return await db.select({
        id: servicesAds.id,
        adTitle: servicesAds.adTitle,
        adType: servicesAds.adType,
        impressions: servicesAds.impressionCount,
        clicks: servicesAds.clickCount,
        conversions: servicesAds.conversionCount,
        ctr: sql<number>`
          CASE 
            WHEN ${servicesAds.impressionCount} > 0 
            THEN (${servicesAds.clickCount}::float / ${servicesAds.impressionCount}) * 100 
            ELSE 0 
          END
        `.as('ctr')
      })
        .from(servicesAds)
        .where(eq(servicesAds.status, 'Active'))
        .orderBy(sql`ctr DESC`)
        .limit(limit);
    },

    getRevenueAnalytics: async (_: any, { startDate, endDate }: any, { db, Admin }: Context) => {
      if (!Admin) {
        throw new GraphQLError('Admin access required', {
          extensions: { code: 'FORBIDDEN' }
        });
      }

      let conditions = [eq(adPayments.paymentStatus, 'Paid')];
      
      if (startDate && endDate) {
        conditions.push(sql`${adPayments.createdAt} >= ${startDate}`);
        conditions.push(sql`${adPayments.createdAt} <= ${endDate}`);
      }

      let query = db.select({
        date: sql<string>`DATE(${adPayments.createdAt})`.as('date'),
        revenue: sql<number>`SUM(${adPayments.amountPaid})`.as('revenue'),
        transactions: sql<number>`COUNT(*)`.as('transactions')
      })
        .from(adPayments)
        .where(and(...conditions))
        .groupBy(sql`DATE(${adPayments.createdAt})`)
        .orderBy(sql`DATE(${adPayments.createdAt}) DESC`);

      return await query;
    },
  },

  Mutation: {
    // VENDOR MUTATIONS
    createAdRequest: async (_: any, { input }: any, { db, vendor }: Context) => {
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

      const result = await db.insert(servicesAds).values(newAdRequest).returning();
      return result[0];
    },

    updateAdRequest: async (_: any, { id, input }: any, { db, vendor }: Context) => {
      if (!vendor) {
        throw new GraphQLError('Vendor authentication required', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      const adRequest = await db.select()
        .from(servicesAds)
        .where(eq(servicesAds.id, id))
        .limit(1);

      if (!adRequest[0] || adRequest[0].vendorId !== vendor.id) {
        throw new GraphQLError('Request not found or access denied', {
          extensions: { code: 'FORBIDDEN' }
        });
      }

      if (adRequest[0].status !== 'Pending') {
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

      const result = await db.update(servicesAds)
        .set(updateData)
        .where(eq(servicesAds.id, id))
        .returning();

      return result[0];
    },

    cancelAdRequest: async (_: any, { id }: any, { db, vendor }: Context) => {
      if (!vendor) {
        throw new GraphQLError('Vendor authentication required', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      const adRequest = await db.select()
        .from(servicesAds)
        .where(eq(servicesAds.id, id))
        .limit(1);

      if (!adRequest[0] || adRequest[0].vendorId !== vendor.id) {
        throw new GraphQLError('Request not found or access denied', {
          extensions: { code: 'FORBIDDEN' }
        });
      }

      if (adRequest[0].status !== 'Pending') {
        throw new GraphQLError('Only pending requests can be cancelled', {
          extensions: { code: 'BAD_REQUEST' }
        });
      }

      const result = await db.update(servicesAds)
        .set({
          status: 'Rejected',
          updatedAt: new Date()
        })
        .where(eq(servicesAds.id, id))
        .returning();

      return result.length > 0;
    },

    // ADMIN MUTATIONS
    approveAdRequest: async (_: any, { id, input }: any, { db, Admin }: Context) => {
      if (!Admin) {
        throw new GraphQLError('Admin access required', {
          extensions: { code: 'FORBIDDEN' }
        });
      }

      const adRequest = await db.select()
        .from(servicesAds)
        .where(eq(servicesAds.id, id))
        .limit(1);

      if (!adRequest[0]) {
        throw new GraphQLError('Request not found', {
          extensions: { code: 'NOT_FOUND' }
        });
      }

      if (adRequest[0].status !== 'Pending') {
        throw new GraphQLError('Can only approve pending requests', {
          extensions: { code: 'BAD_REQUEST' }
        });
      }

      const result = await db.update(servicesAds)
        .set({
          status: 'Approved',
          price: input.finalPrice || adRequest[0].price,
          startDate: input.startDate ? new Date(input.startDate) : adRequest[0].startDate,
          endDate: input.endDate ? new Date(input.endDate) : adRequest[0].endDate,
          updatedAt: new Date()
        })
        .where(eq(servicesAds.id, id))
        .returning();

      return result[0];
    },

    rejectAdRequest: async (_: any, { id, reason }: any, { db, Admin }: Context) => {
      if (!Admin) {
        throw new GraphQLError('Admin access required', {
          extensions: { code: 'FORBIDDEN' }
        });
      }

      const adRequest = await db.select()
        .from(servicesAds)
        .where(eq(servicesAds.id, id))
        .limit(1);

      if (!adRequest[0]) {
        throw new GraphQLError('Request not found', {
          extensions: { code: 'NOT_FOUND' }
        });
      }

      if (adRequest[0].status !== 'Pending') {
        throw new GraphQLError('Can only reject pending requests', {
          extensions: { code: 'BAD_REQUEST' }
        });
      }

      const result = await db.update(servicesAds)
        .set({
          status: 'Rejected',
          updatedAt: new Date()
        })
        .where(eq(servicesAds.id, id))
        .returning();

      return result[0];
    },

    reviewAdRequest: async (_: any, { id, status, adminNotes }: any, { db, Admin }: Context) => {
      if (!Admin) {
        throw new GraphQLError('Admin access required', {
          extensions: { code: 'FORBIDDEN' }
        });
      }

      const adRequest = await db.select()
        .from(servicesAds)
        .where(eq(servicesAds.id, id))
        .limit(1);

      if (!adRequest[0]) {
        throw new GraphQLError('Request not found', {
          extensions: { code: 'NOT_FOUND' }
        });
      }

      if (adRequest[0].status !== 'Pending') {
        throw new GraphQLError('Can only review pending requests', {
          extensions: { code: 'BAD_REQUEST' }
        });
      }

      const updateData = {
        status,
        adminNotes,
        reviewedBy: Admin.id,
        reviewedAt: new Date(),
        updatedAt: new Date()
      };

      const result = await db.update(servicesAds)
        .set(updateData)
        .where(eq(servicesAds.id, id))
        .returning();

      return result[0];
    },

    // SERVICE AD MANAGEMENT
    activateServiceAd: async (_: any, { id }: any, { db, Admin }: Context) => {
      if (!Admin) {
        throw new GraphQLError('Admin access required', {
          extensions: { code: 'FORBIDDEN' }
        });
      }

      const ad = await db.select()
        .from(servicesAds)
        .where(eq(servicesAds.id, id))
        .limit(1);

      if (!ad[0]) {
        throw new GraphQLError('Ad not found', {
          extensions: { code: 'NOT_FOUND' }
        });
      }

      if (ad[0].status !== 'Approved') {
        throw new GraphQLError('Can only activate approved ads', {
          extensions: { code: 'BAD_REQUEST' }
        });
      }

      const result = await db.update(servicesAds)
        .set({
          status: 'Active',
          updatedAt: new Date()
        })
        .where(eq(servicesAds.id, id))
        .returning();

      return result[0];
    },

    expireServiceAd: async (_: any, { id }: any, { db, Admin }: Context) => {
      if (!Admin) {
        throw new GraphQLError('Admin access required', {
          extensions: { code: 'FORBIDDEN' }
        });
      }

      const ad = await db.select()
        .from(servicesAds)
        .where(eq(servicesAds.id, id))
        .limit(1);

      if (!ad[0]) {
        throw new GraphQLError('Ad not found', {
          extensions: { code: 'NOT_FOUND' }
        });
      }

      if (ad[0].status === 'Expired') {
        throw new GraphQLError('Ad is already expired', {
          extensions: { code: 'BAD_REQUEST' }
        });
      }

      const result = await db.update(servicesAds)
        .set({
          status: 'Expired',
          updatedAt: new Date()
        })
        .where(eq(servicesAds.id, id))
        .returning();

      return result[0];
    },

    updateServiceAd: async (_: any, { id, input }: any, { db, Admin }: Context) => {
      if (!Admin) {
        throw new GraphQLError('Admin access required', {
          extensions: { code: 'FORBIDDEN' }
        });
      }

      const ad = await db.select()
        .from(servicesAds)
        .where(eq(servicesAds.id, id))
        .limit(1);

      if (!ad[0]) {
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

      const result = await db.update(servicesAds)
        .set(updateData)
        .where(eq(servicesAds.id, id))
        .returning();

      return result[0];
    },

    pauseServiceAd: async (_: any, { id }: any, { db, Admin }: Context) => {
      if (!Admin) {
        throw new GraphQLError('Admin access required', {
          extensions: { code: 'FORBIDDEN' }
        });
      }

      const ad = await db.select()
        .from(servicesAds)
        .where(eq(servicesAds.id, id))
        .limit(1);

      if (!ad[0]) {
        throw new GraphQLError('Ad not found', {
          extensions: { code: 'NOT_FOUND' }
        });
      }

      if (ad[0].status !== 'Active') {
        throw new GraphQLError('Can only pause active ads', {
          extensions: { code: 'BAD_REQUEST' }
        });
      }

      const result = await db.update(servicesAds)
        .set({
          status: 'Approved',
          updatedAt: new Date()
        })
        .where(eq(servicesAds.id, id))
        .returning();

      return result[0];
    },

    resumeServiceAd: async (_: any, { id }: any, { db, Admin }: Context) => {
      if (!Admin) {
        throw new GraphQLError('Admin access required', {
          extensions: { code: 'FORBIDDEN' }
        });
      }

      const ad = await db.select()
        .from(servicesAds)
        .where(eq(servicesAds.id, id))
        .limit(1);

      if (!ad[0]) {
        throw new GraphQLError('Ad not found', {
          extensions: { code: 'NOT_FOUND' }
        });
      }

      if (ad[0].status !== 'Approved') {
        throw new GraphQLError('Can only resume paused ads', {
          extensions: { code: 'BAD_REQUEST' }
        });
      }

      const result = await db.update(servicesAds)
        .set({
          status: 'Active',
          updatedAt: new Date()
        })
        .where(eq(servicesAds.id, id))
        .returning();

      return result[0];
    },

    cancelServiceAd: async (_: any, { id }: any, { db, Admin }: Context) => {
      if (!Admin) {
        throw new GraphQLError('Admin access required', {
          extensions: { code: 'FORBIDDEN' }
        });
      }

      const ad = await db.select()
        .from(servicesAds)
        .where(eq(servicesAds.id, id))
        .limit(1);

      if (!ad[0]) {
        throw new GraphQLError('Ad not found', {
          extensions: { code: 'NOT_FOUND' }
        });
      }

      if (!['Active', 'Approved'].includes(ad[0].status ?? '')) {
        throw new GraphQLError('Can only cancel active or paused ads', {
          extensions: { code: 'BAD_REQUEST' }
        });
      }

      const result = await db.update(servicesAds)
        .set({
          status: 'Rejected',
          updatedAt: new Date()
        })
        .where(eq(servicesAds.id, id))
        .returning();

      return result[0];
    },

    extendServiceAd: async (_: any, { id, newEndDate }: any, { db, Admin }: Context) => {
      if (!Admin) {
        throw new GraphQLError('Admin access required', {
          extensions: { code: 'FORBIDDEN' }
        });
      }

      const ad = await db.select()
        .from(servicesAds)
        .where(eq(servicesAds.id, id))
        .limit(1);

      if (!ad[0]) {
        throw new GraphQLError('Ad not found', {
          extensions: { code: 'NOT_FOUND' }
        });
      }

      if (!['Active', 'Approved'].includes(ad[0].status ?? '')) {
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

      if (ad[0].endDate && parsedNewEndDate <= new Date(ad[0].endDate)) {
        throw new GraphQLError('New end date must be after current end date', {
          extensions: { code: 'BAD_REQUEST' }
        });
      }

      const result = await db.update(servicesAds)
        .set({
          endDate: parsedNewEndDate,
          updatedAt: new Date()
        })
        .where(eq(servicesAds.id, id))
        .returning();

      return result[0];
    },

    // EXTERNAL ADS
    createExternalAd: async (_: any, { input }: any, { db, Admin }: Context) => {
      if (!Admin) {
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

      const result = await db.insert(externalAds).values(newExternalAd).returning();
      return result[0];
    },

    updateExternalAd: async (_: any, { id, input }: any, { db, Admin }: Context) => {
      if (!Admin) {
        throw new GraphQLError('Admin access required', {
          extensions: { code: 'FORBIDDEN' }
        });
      }

      const externalAd = await db.select()
        .from(externalAds)
        .where(eq(externalAds.id, id))
        .limit(1);

      if (!externalAd[0]) {
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

      const result = await db.update(externalAds)
        .set(updateData)
        .where(eq(externalAds.id, id))
        .returning();

      return result[0];
    },

    deleteExternalAd: async (_: any, { id }: any, { db, Admin }: Context) => {
      if (!Admin) {
        throw new GraphQLError('Admin access required', {
          extensions: { code: 'FORBIDDEN' }
        });
      }

      const ad = await db.select()
        .from(externalAds)
        .where(eq(externalAds.id, id))
        .limit(1);

      if (!ad[0]) {
        throw new GraphQLError('External ad not found', {
          extensions: { code: 'NOT_FOUND' }
        });
      }

      await db.delete(externalAds).where(eq(externalAds.id, id));
      return true;
    },

    // PAYMENTS
    createPayment: async (_: any, { input }: any, { db, Admin }: Context) => {
      if (!Admin) {
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
        const serviceAd = await db.select({ vendorId: servicesAds.vendorId })
          .from(servicesAds)
          .where(eq(servicesAds.id, input.adId))
          .limit(1);
        
        if (!serviceAd[0]) {
          throw new GraphQLError('Service ad not found', {
            extensions: { code: 'NOT_FOUND' }
          });
        }
        vendorId = serviceAd[0].vendorId;
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

      const result = await db.insert(adPayments).values(newPayment).returning();
      return result[0];
    },

    updatePaymentStatus: async (_: any, { id, status }: any, { db, Admin }: Context) => {
      if (!Admin) {
        throw new GraphQLError('Admin access required', {
          extensions: { code: 'FORBIDDEN' }
        });
      }

      const payment = await db.select()
        .from(adPayments)
        .where(eq(adPayments.id, id))
        .limit(1);

      if (!payment[0]) {
        throw new GraphQLError('Payment not found', {
          extensions: { code: 'NOT_FOUND' }
        });
      }

      const updateData: any = {
        paymentStatus: status,
        updatedAt: new Date()
      };

      if (status === 'Paid' && payment[0].paymentStatus !== 'Paid') {
        updateData.paidAt = new Date();
      }

      const result = await db.update(adPayments)
        .set(updateData)
        .where(eq(adPayments.id, id))
        .returning();

      return result[0];
    },

    // AD INTERACTIONS
    recordImpression: async (_: any, { adId, isExternal }: any, { db }: Context) => {
      try {
        if (isExternal) {
          await db.update(externalAds)
            .set({
              impressionCount: sql`${externalAds.impressionCount} + 1`,
              updatedAt: new Date()
            })
            .where(eq(externalAds.id, adId));
        } else {
          await db.update(servicesAds)
            .set({
              impressionCount: sql`${servicesAds.impressionCount} + 1`,
              updatedAt: new Date()
            })
            .where(eq(servicesAds.id, adId));
        }
        return true;
      } catch (error) {
        console.error('Error recording impression:', error);
        return false;
      }
    },

    recordClick: async (_: any, { adId, isExternal }: any, { db }: Context) => {
      try {
        if (isExternal) {
          await db.update(externalAds)
            .set({
              clickCount: sql`${externalAds.clickCount} + 1`,
              updatedAt: new Date()
            })
            .where(eq(externalAds.id, adId));
        } else {
          await db.update(servicesAds)
            .set({
              clickCount: sql`${servicesAds.clickCount} + 1`,
              updatedAt: new Date()
            })
            .where(eq(servicesAds.id, adId));
        }
        return true;
      } catch (error) {
        console.error('Error recording click:', error);
        return false;
      }
    },

    recordConversion: async (_: any, { adId }: any, { db }: Context) => {
      try {
        await db.update(servicesAds)
          .set({
            conversionCount: sql`${servicesAds.conversionCount} + 1`,
            updatedAt: new Date()
          })
          .where(eq(servicesAds.id, adId));
        
        return true;
      } catch (error) {
        console.error('Error recording conversion:', error);
        return false;
      }
    }
  }
};