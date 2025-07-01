import { Context } from '../../../GraphQL/Context';
import { analyticsEvents, reports } from '../../../Schema';
import { eq, and, gte, lte, desc, sql, count } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export class AnalyticsModel {
  private db: Context['db'];

  constructor(db: Context['db']) {
    this.db = db;
  }

  async getAnalyticsEvents({ limit = 50, offset = 0, eventType, dateFrom, dateTo }: any) {
    const conditions = [];

    if (eventType) {
      conditions.push(eq(analyticsEvents.eventType, eventType));
    }

    if (dateFrom) {
      conditions.push(gte(analyticsEvents.createdAt, new Date(dateFrom)));
    }

    if (dateTo) {
      conditions.push(lte(analyticsEvents.createdAt, new Date(dateTo)));
    }

    const baseQuery = this.db.select().from(analyticsEvents);
    
    const queryWithWhere = conditions.length > 0 
      ? baseQuery.where(and(...conditions)) 
      : baseQuery;

    return queryWithWhere
      .orderBy(desc(analyticsEvents.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getAnalyticsStats({ dateFrom, dateTo }: any) {
    const conditions = [];
    if (dateFrom) {
      conditions.push(gte(analyticsEvents.createdAt, new Date(dateFrom)));
    }
    if (dateTo) {
      conditions.push(lte(analyticsEvents.createdAt, new Date(dateTo)));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const totalEventsResult = await this.db
      .select({ count: count() })
      .from(analyticsEvents)
      .where(whereClause);

    const eventsByType = await this.db
      .select({
        eventType: analyticsEvents.eventType,
        count: count()
      })
      .from(analyticsEvents)
      .where(whereClause)
      .groupBy(analyticsEvents.eventType);

    const eventsByDate = await this.db
      .select({
        date: sql`DATE(${analyticsEvents.createdAt})`.as('date'),
        count: count()
      })
      .from(analyticsEvents)
      .where(whereClause)
      .groupBy(sql`DATE(${analyticsEvents.createdAt})`)
      .orderBy(sql`DATE(${analyticsEvents.createdAt})`);

    const topUsers = await this.db
      .select({
        userId: analyticsEvents.userId,
        count: count()
      })
      .from(analyticsEvents)
      .where(and(whereClause, sql`${analyticsEvents.userId} IS NOT NULL`))
      .groupBy(analyticsEvents.userId)
      .orderBy(desc(count()))
      .limit(10);

    const topVendors = await this.db
      .select({
        vendorId: analyticsEvents.vendorId,
        count: count()
      })
      .from(analyticsEvents)
      .where(and(whereClause, sql`${analyticsEvents.vendorId} IS NOT NULL`))
      .groupBy(analyticsEvents.vendorId)
      .orderBy(desc(count()))
      .limit(10);

    return { totalEventsResult, eventsByType, eventsByDate, topUsers, topVendors };
  }

  async getReports({ filters, limit = 50, offset = 0 }: any) {
    const conditions = [];

    if (filters?.reportType) {
      conditions.push(eq(reports.reportType, filters.reportType));
    }

    if (filters?.status) {
      conditions.push(eq(reports.status, filters.status));
    }

    if (filters?.isScheduled !== undefined) {
      conditions.push(eq(reports.isScheduled, filters.isScheduled));
    }

    if (filters?.dateFrom) {
      conditions.push(gte(reports.createdAt, new Date(filters.dateFrom)));
    }

    if (filters?.dateTo) {
      conditions.push(lte(reports.createdAt, new Date(filters.dateTo)));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    return this.db
      .select()
      .from(reports)
      .where(whereClause)
      .orderBy(desc(reports.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getReport(id: string) {
    const report = await this.db
      .select()
      .from(reports)
      .where(eq(reports.id, id))
      .limit(1);
    return report[0] || null;
  }

  async getMyReports(adminId: string, { limit = 50, offset = 0 }: any) {
    return this.db
      .select()
      .from(reports)
      .where(eq(reports.generatedBy, adminId))
      .orderBy(desc(reports.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getScheduledReports() {
    return this.db
      .select()
      .from(reports)
      .where(eq(reports.isScheduled, true))
      .orderBy(desc(reports.createdAt));
  }

  async trackEvent(eventData: any) {
    const [newEvent] = await this.db
      .insert(analyticsEvents)
      .values(eventData)
      .returning();
    return newEvent;
  }

  async createReport(reportData: any) {
    const [newReport] = await this.db
      .insert(reports)
      .values(reportData)
      .returning();
    return newReport;
  }

  async updateReport(id: string, updateData: any) {
    const [updatedReport] = await this.db
      .update(reports)
      .set(updateData)
      .where(eq(reports.id, id))
      .returning();
    return updatedReport;
  }

  async deleteReport(id: string) {
    const deletedReport = await this.db
      .delete(reports)
      .where(eq(reports.id, id))
      .returning();
    return deletedReport;
  }

  async updateReportStatus(id: string, status: "Generating" | "Generated" | "Failed") {
    const [updatedReport] = await this.db
      .update(reports)
      .set({ status, updatedAt: new Date() })
      .where(eq(reports.id, id))
      .returning();
    return updatedReport;
  }

  async updateReportUrl(id: string, reportUrl: string) {
    const [updatedReport] = await this.db
      .update(reports)
      .set({ reportUrl, updatedAt: new Date() })
      .where(eq(reports.id, id))
      .returning();
    return updatedReport;
  }
}