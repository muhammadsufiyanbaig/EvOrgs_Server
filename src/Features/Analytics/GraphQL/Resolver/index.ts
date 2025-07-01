import { Context } from '../../../../GraphQL/Context';
import { AnalyticsService } from '../../Service';

export const analyticsResolvers = {
  Query: {
    getAnalyticsEvents: async (_: any, args: any, context: Context) => {
      const service = new AnalyticsService(context.db);
      return service.getAnalyticsEvents(args, context);
    },

    getAnalyticsStats: async (_: any, args: any, context: Context) => {
      const service = new AnalyticsService(context.db);
      return service.getAnalyticsStats(args, context);
    },

    getReports: async (_: any, args: any, context: Context) => {
      const service = new AnalyticsService(context.db);
      return service.getReports(args, context);
    },

    getReport: async (_: any, { id }: any, context: Context) => {
      const service = new AnalyticsService(context.db);
      return service.getReport(id, context);
    },

    getMyReports: async (_: any, args: any, context: Context) => {
      const service = new AnalyticsService(context.db);
      return service.getMyReports(args, context);
    },

    getScheduledReports: async (_: any, __: any, context: Context) => {
      const service = new AnalyticsService(context.db);
      return service.getScheduledReports(context);
    }
  },

  Mutation: {
    trackEvent: async (_: any, { input }: any, context: Context, info: any) => {
      const service = new AnalyticsService(context.db);
      return service.trackEvent(input, context, info);
    },

    createReport: async (_: any, { input }: any, context: Context) => {
      const service = new AnalyticsService(context.db);
      return service.createReport(input, context);
    },

    updateReport: async (_: any, { id, input }: any, context: Context) => {
      const service = new AnalyticsService(context.db);
      return service.updateReport(id, input, context);
    },

    deleteReport: async (_: any, { id }: any, context: Context) => {
      const service = new AnalyticsService(context.db);
      return service.deleteReport(id, context);
    },

    generateReport: async (_: any, { id }: any, context: Context) => {
      const service = new AnalyticsService(context.db);
      return service.generateReport(id, context);
    },

    downloadReport: async (_: any, { id }: any, context: Context) => {
      const service = new AnalyticsService(context.db);
      return service.downloadReport(id, context);
    }
  }
};