import { Context } from '../../../GraphQL/Context';
import { AnalyticsModel } from '../Model';
import { v4 as uuidv4 } from 'uuid';

interface CreateAnalyticsEventInput {
  eventType: string;
  objectId?: string;
  objectType?: string;
  metadata?: any;
}

interface CreateReportInput {
  reportName: string;
  reportType: string;
  dateRange?: any;
  parameters?: any;
  reportFormat?: string;
  isScheduled?: boolean;
  scheduleFrequency?: string;
}

export class AnalyticsService {
  private model: AnalyticsModel;

  constructor(db: Context['db']) {
    this.model = new AnalyticsModel(db);
  }

  async getAnalyticsEvents(args: any, context: Context) {
    if (!context.Admin) {
      throw new Error('Unauthorized: Admin access required');
    }
    return this.model.getAnalyticsEvents(args);
  }

  async getAnalyticsStats(args: any, context: Context) {
    if (!context.Admin) {
      throw new Error('Unauthorized: Admin access required');
    }

    const { totalEventsResult, eventsByType, eventsByDate, topUsers, topVendors } = await this.model.getAnalyticsStats(args);
    
    return {
      totalEvents: totalEventsResult[0]?.count || 0,
      eventsByType: eventsByType.map(e => ({ eventType: e.eventType, count: e.count })),
      eventsByDate: eventsByDate.map(e => ({ date: e.date, count: e.count })),
      topUsers: topUsers.filter(u => u.userId).map(u => ({ userId: u.userId, count: u.count })),
      topVendors: topVendors.filter(v => v.vendorId).map(v => ({ vendorId: v.vendorId, count: v.count }))
    };
  }

  async getReports(args: any, context: Context) {
    if (!context.Admin) {
      throw new Error('Unauthorized: Admin access required');
    }
    return this.model.getReports(args);
  }

  async getReport(id: string, context: Context) {
    if (!context.Admin) {
      throw new Error('Unauthorized: Admin access required');
    }
    return this.model.getReport(id);
  }

  async getMyReports(args: any, context: Context) {
    if (!context.Admin) {
      throw new Error('Unauthorized: Admin access required');
    }
    return this.model.getMyReports(context.Admin.id, args);
  }

  async getScheduledReports(context: Context) {
    if (!context.Admin) {
      throw new Error('Unauthorized: Admin access required');
    }
    return this.model.getScheduledReports();
  }

  async trackEvent(input: CreateAnalyticsEventInput, context: Context, info: any) {
    const request = info.variableValues?.request || {};
    const ipAddress = request.ip || request.connection?.remoteAddress;

    const eventData = {
      id: uuidv4(),
      eventType: input.eventType,
      userId: context.user?.id,
      vendorId: context.vendor?.id,
      objectId: input.objectId,
      objectType: input.objectType,
      metadata: input.metadata,
      ipAddress,
      createdAt: new Date()
    };

    return this.model.trackEvent(eventData);
  }

  async createReport(input: CreateReportInput, context: Context) {
    if (!context.Admin) {
      throw new Error('Unauthorized: Admin access required');
    }

    const reportData = {
      id: uuidv4(),
      reportName: input.reportName,
      reportType: input.reportType,
      generatedBy: context.Admin.id,
      dateRange: input.dateRange,
      parameters: input.parameters,
      reportFormat: input.reportFormat || 'PDF',
      status: 'Generating' as const,
      isScheduled: input.isScheduled || false,
      scheduleFrequency: input.scheduleFrequency,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const newReport = await this.model.createReport(reportData);
    // Optionally trigger async report generation
    // this.generateReportAsync(newReport.id);
    return newReport;
  }

  async updateReport(id: string, input: CreateReportInput, context: Context) {
    if (!context.Admin) {
      throw new Error('Unauthorized: Admin access required');
    }

    const updateData = {
      reportName: input.reportName,
      reportType: input.reportType,
      dateRange: input.dateRange,
      parameters: input.parameters,
      reportFormat: input.reportFormat || 'PDF',
      isScheduled: input.isScheduled || false,
      scheduleFrequency: input.scheduleFrequency,
      updatedAt: new Date()
    };

    const updatedReport = await this.model.updateReport(id, updateData);
    if (!updatedReport) {
      throw new Error('Report not found');
    }
    return updatedReport;
  }

  async deleteReport(id: string, context: Context) {
    if (!context.Admin) {
      throw new Error('Unauthorized: Admin access required');
    }

    const deletedReport = await this.model.deleteReport(id);
    return deletedReport.length > 0;
  }

  async generateReport(id: string, context: Context) {
    if (!context.Admin) {
      throw new Error('Unauthorized: Admin access required');
    }

    await this.model.updateReportStatus(id, 'Generating');

    try {
      // Implement report generation logic
      const reportUrl = `https://your-storage.com/reports/${id}.pdf`;
      const updatedReport = await this.model.updateReportStatus(id, 'Generated');
      await this.model.updateReportUrl(id, reportUrl);
      return updatedReport;
    } catch (error) {
      await this.model.updateReportStatus(id, 'Failed');
      throw new Error('Report generation failed');
    }
  }

  async downloadReport(id: string, context: Context) {
    if (!context.Admin) {
      throw new Error('Unauthorized: Admin access required');
    }

    const report = await this.model.getReport(id);
    if (!report) {
      throw new Error('Report not found');
    }

    if (report.status !== 'Generated' || !report.reportUrl) {
      throw new Error('Report not available for download');
    }

    await this.model.trackEvent({
      id: uuidv4(),
      eventType: 'report_download',
      userId: context.Admin.id,
      objectId: id,
      objectType: 'report',
      createdAt: new Date()
    });

    return report.reportUrl;
  }
}