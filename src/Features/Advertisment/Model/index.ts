import { eq, and, sql, InferSelectModel } from 'drizzle-orm';
import { servicesAds, externalAds, adPayments } from '../../../Schema';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export class AdModel {
  private db: PostgresJsDatabase;

  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  // Fetch active ads with optional filters
  async getActiveAds(adType?: "Featured" | "Sponsored" | "Premium", entityType?: "Venue" | "Farmhouse" | "Photography Package" | "Catering Package") {
    const conditions = [eq(servicesAds.status, 'Active')];
    if (adType) conditions.push(eq(servicesAds.adType, adType));
    if (entityType) conditions.push(eq(servicesAds.entityType, entityType));

    return await this.db
      .select()
      .from(servicesAds)
      .where(and(...conditions))
      .orderBy(sql`${servicesAds.createdAt} DESC`);
  }

  // Fetch active external ads
  async getActiveExternalAds() {
    return await this.db
      .select()
      .from(externalAds)
      .where(eq(externalAds.status, 'Active'))
      .orderBy(sql`${externalAds.createdAt} DESC`);
  }

  // Fetch featured ads
  async getFeaturedAds() {
    return await this.db
      .select()
      .from(servicesAds)
      .where(and(
        eq(servicesAds.status, 'Active'),
        eq(servicesAds.adType, 'Featured')
      ))
      .orderBy(sql`${servicesAds.createdAt} DESC`);
  }

  // Fetch sponsored ads
  async getSponsoredAds() {
    return await this.db
      .select()
      .from(servicesAds)
      .where(and(
        eq(servicesAds.status, 'Active'),
        eq(servicesAds.adType, 'Sponsored')
      ))
      .orderBy(sql`${servicesAds.createdAt} DESC`);
  }

  // Fetch vendor ad requests
  async getMyAdRequests(vendorId: string, status?: "Pending" | "Approved" | "Rejected" | "Active" | "Expired") {
    const conditions = [
      eq(servicesAds.vendorId, vendorId),
      sql`${servicesAds.status} IN ('Pending', 'Rejected')`
    ];
    if (status) conditions.push(eq(servicesAds.status, status));

    return await this.db
      .select()
      .from(servicesAds)
      .where(and(...conditions))
      .orderBy(sql`${servicesAds.createdAt} DESC`);
  }

  // Fetch vendor active ads
  async getMyActiveAds(vendorId: string) {
    return await this.db
      .select()
      .from(servicesAds)
      .where(and(
        eq(servicesAds.vendorId, vendorId),
        sql`${servicesAds.status} IN ('Active', 'Approved')`
      ))
      .orderBy(sql`${servicesAds.createdAt} DESC`);
  }

  // Fetch ad request by ID
  async getAdRequestById(id: string, vendorId: string) {
    const result = await this.db
      .select()
      .from(servicesAds)
      .where(and(
        eq(servicesAds.id, id),
        eq(servicesAds.vendorId, vendorId)
      ))
      .limit(1);
    return result[0] || null;
  }

  // Fetch vendor payments
  async getMyPayments(vendorId: string) {
    return await this.db
      .select()
      .from(adPayments)
      .where(eq(adPayments.vendorId, vendorId))
      .orderBy(sql`${adPayments.createdAt} DESC`);
  }

  // Fetch all ad requests (admin)
  async getAllAdRequests(status?: "Pending" | "Approved" | "Rejected" | "Active" | "Expired", vendorId?: string) {
    const conditions = [sql`${servicesAds.status} IN ('Pending', 'Rejected')`];
    if (status) conditions.push(eq(servicesAds.status, status));
    if (vendorId) conditions.push(eq(servicesAds.vendorId, vendorId));

    return await this.db
      .select()
      .from(servicesAds)
      .where(and(...conditions))
      .orderBy(sql`${servicesAds.createdAt} DESC`);
  }

  // Fetch all service ads (admin)
  async getAllServiceAds(status?: "Pending" | "Approved" | "Rejected" | "Active" | "Expired", vendorId?: string) {
    const conditions = [];
    if (status) conditions.push(eq(servicesAds.status, status));
    if (vendorId) conditions.push(eq(servicesAds.vendorId, vendorId));

    const query = conditions.length > 0
      ? this.db.select().from(servicesAds).where(and(...conditions))
      : this.db.select().from(servicesAds);

    return await query.orderBy(sql`${servicesAds.createdAt} DESC`);
  }

  // Fetch pending ad requests (admin)
  async getPendingAdRequests() {
    return await this.db
      .select()
      .from(servicesAds)
      .where(eq(servicesAds.status, 'Pending'))
      .orderBy(sql`${servicesAds.createdAt} ASC`);
  }

  // Fetch external ads (admin)
  async getExternalAds(status?: "Active" | "Expired" | "Inactive") {
    const query = status
      ? this.db.select().from(externalAds).where(eq(externalAds.status, status))
      : this.db.select().from(externalAds);

    return await query.orderBy(sql`${externalAds.createdAt} DESC`);
  }

  // Fetch external ad by ID
  async getExternalAdById(id: string) {
    const result = await this.db
      .select()
      .from(externalAds)
      .where(eq(externalAds.id, id))
      .limit(1);
    return result[0] || null;
  }

  // Fetch ad payments (admin)
  async getAdPayments(adId?: string, externalAdId?: string) {
    const conditions = [];
    if (adId) conditions.push(eq(adPayments.adId, adId));
    if (externalAdId) conditions.push(eq(adPayments.externalAdId, externalAdId));

    const query = conditions.length > 0
      ? this.db.select().from(adPayments).where(and(...conditions))
      : this.db.select().from(adPayments);

    return await query.orderBy(sql`${adPayments.createdAt} DESC`);
  }

  // Fetch payment by ID
  async getPaymentById(id: string) {
    const result = await this.db
      .select()
      .from(adPayments)
      .where(eq(adPayments.id, id))
      .limit(1);
    return result[0] || null;
  }

  // Fetch ad for analytics
  async getAdForAnalytics(adId: string) {
    const result = await this.db
      .select()
      .from(servicesAds)
      .where(eq(servicesAds.id, adId))
      .limit(1);
    return result[0] || null;
  }

  // Fetch total spent for ad
  async getTotalSpent(adId: string) {
    const result = await this.db
      .select({
        total: sql<number>`COALESCE(SUM(${adPayments.amountPaid}), 0)`.as('total'),
      })
      .from(adPayments)
      .where(eq(adPayments.adId, adId));
    return result[0].total;
  }

  // Fetch dashboard stats
  async getDashboardStats() {
    const [requestStats, adStats, paymentStats] = await Promise.all([
      this.db.select({
        total: sql<number>`COUNT(*)`.as('total'),
        pending: sql<number>`COUNT(*) FILTER (WHERE ${servicesAds.status} = 'Pending')`.as('pending')
      }).from(servicesAds).where(
        sql`${servicesAds.status} IN ('Pending', 'Rejected')`
      ),
      this.db.select({
        active: sql<number>`COUNT(*) FILTER (WHERE ${servicesAds.status} = 'Active')`.as('active'),
        totalImpressions: sql<number>`COALESCE(SUM(${servicesAds.impressionCount}), 0)`.as('totalImpressions'),
        totalClicks: sql<number>`COALESCE(SUM(${servicesAds.clickCount}), 0)`.as('totalClicks')
      }).from(servicesAds),
      this.db.select({
        totalRevenue: sql<number>`COALESCE(SUM(${adPayments.amountPaid}), 0)`.as('totalRevenue')
      }).from(adPayments).where(eq(adPayments.paymentStatus, 'Paid'))
    ]);

    return { requestStats, adStats, paymentStats };
  }

  // Fetch top performing ads
  async getTopPerformingAds(limit: number) {
    return await this.db.select({
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
  }

  // Fetch revenue analytics
  async getRevenueAnalytics(startDate?: string, endDate?: string) {
    let conditions = [eq(adPayments.paymentStatus, 'Paid')];
    if (startDate && endDate) {
      conditions.push(sql`${adPayments.createdAt} >= ${startDate}`);
      conditions.push(sql`${adPayments.createdAt} <= ${endDate}`);
    }

    return await this.db.select({
      date: sql<string>`DATE(${adPayments.createdAt})`.as('date'),
      revenue: sql<number>`SUM(${adPayments.amountPaid})`.as('revenue'),
      transactions: sql<number>`COUNT(*)`.as('transactions')
    })
      .from(adPayments)
      .where(and(...conditions))
      .groupBy(sql`DATE(${adPayments.createdAt})`)
      .orderBy(sql`DATE(${adPayments.createdAt}) DESC`);
  }

  // Create ad request
  async createAdRequest(adRequest: InferSelectModel<typeof servicesAds>) {
    const result = await this.db.insert(servicesAds).values(adRequest).returning();
    return result[0];
  }

  // Update ad request
  async updateAdRequest(id: string, updateData: Partial<InferSelectModel<typeof servicesAds>>) {
    const result = await this.db.update(servicesAds)
      .set(updateData)
      .where(eq(servicesAds.id, id))
      .returning();
    return result[0];
  }

  // Fetch ad by ID
  async getAdById(id: string) {
    const result = await this.db
      .select()
      .from(servicesAds)
      .where(eq(servicesAds.id, id))
      .limit(1);
    return result[0] || null;
  }

  // Create external ad
  async createExternalAd(externalAd: InferSelectModel<typeof externalAds>) {
    const result = await this.db.insert(externalAds).values(externalAd).returning();
    return result[0];
  }

  // Update external ad
  async updateExternalAd(id: string, updateData: Partial<InferSelectModel<typeof externalAds>>) {
    const result = await this.db.update(externalAds)
      .set(updateData)
      .where(eq(externalAds.id, id))
      .returning();
    return result[0];
  }

  // Delete external ad
  async deleteExternalAd(id: string) {
    await this.db.delete(externalAds).where(eq(externalAds.id, id));
    return true;
  }

  // Create payment
  async createPayment(payment: InferSelectModel<typeof adPayments>) {
    const result = await this.db.insert(adPayments).values(payment).returning();
    return result[0];
  }

  // Update payment status
  async updatePaymentStatus(id: string, updateData: Partial<InferSelectModel<typeof adPayments>>) {
    const result = await this.db.update(adPayments)
      .set(updateData)
      .where(eq(adPayments.id, id))
      .returning();
    return result[0];
  }

  // Record impression
  async recordImpression(adId: string, isExternal: boolean) {
    if (isExternal) {
      await this.db.update(externalAds)
        .set({
          impressionCount: sql`${externalAds.impressionCount} + 1`,
          updatedAt: new Date()
        })
        .where(eq(externalAds.id, adId));
    } else {
      await this.db.update(servicesAds)
        .set({
          impressionCount: sql`${servicesAds.impressionCount} + 1`,
          updatedAt: new Date()
        })
        .where(eq(servicesAds.id, adId));
    }
    return true;
  }

  // Record click
  async recordClick(adId: string, isExternal: boolean) {
    if (isExternal) {
      await this.db.update(externalAds)
        .set({
          clickCount: sql`${externalAds.clickCount} + 1`,
          updatedAt: new Date()
        })
        .where(eq(externalAds.id, adId));
    } else {
      await this.db.update(servicesAds)
        .set({
          clickCount: sql`${servicesAds.clickCount} + 1`,
          updatedAt: new Date()
        })
        .where(eq(servicesAds.id, adId));
    }
    return true;
  }

  // Record conversion
  async recordConversion(adId: string) {
    await this.db.update(servicesAds)
      .set({
        conversionCount: sql`${servicesAds.conversionCount} + 1`,
        updatedAt: new Date()
      })
      .where(eq(servicesAds.id, adId));
    return true;
  }
}