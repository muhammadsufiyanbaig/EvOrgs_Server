import { NotificationService } from '../../Service';
import { CreateNotificationInput, NotificationFilter, PaginationInput, NotificationContext, FCMTokenInput, Notification, FCMResponse } from '../../Types';

export const notificationResolvers = {
  Query: {
    getMyNotifications: async (
      _: any,
      { filter, pagination }: { filter?: NotificationFilter; pagination?: PaginationInput },
      context: NotificationContext
    ) => {
      const service = new NotificationService(context.db);
      return await service.getMyNotifications(filter, pagination, context);
    },

    getAllNotifications: async (
      _: any,
      { filter, pagination }: { filter?: NotificationFilter; pagination?: PaginationInput },
      context: NotificationContext
    ) => {
      const service = new NotificationService(context.db);
      return await service.getAllNotifications(filter, pagination, context);
    },

    getNotification: async (
      _: any,
      { id }: { id: string },
      context: NotificationContext
    ) => {
      const service = new NotificationService(context.db);
      return await service.getNotification(id, context);
    },

    getUnreadCount: async (
      _: any,
      __: any,
      context: NotificationContext
    ) => {
      const service = new NotificationService(context.db);
      return await service.getUnreadCount(context);
    },

    getNotificationStats: async (
      _: any,
      { dateFrom, dateTo }: { dateFrom?: Date; dateTo?: Date },
      context: NotificationContext
    ) => {
      const service = new NotificationService(context.db);
      return await service.getNotificationStats(dateFrom, dateTo, context);
    }
  },

  Mutation: {
    createNotification: async (
      _: any,
      { input }: { input: CreateNotificationInput },
      context: NotificationContext
    ) => {
      const service = new NotificationService(context.db);
      return await service.createNotification(input, context);
    },

    sendNotification: async (
      _: any,
      { id }: { id: string },
      context: NotificationContext
    ) => {
      const service = new NotificationService(context.db);
      return await service.sendNotification(id, context);
    },

    markAsRead: async (
      _: any,
      { notificationId }: { notificationId: string },
      context: NotificationContext
    ) => {
      const service = new NotificationService(context.db);
      return await service.markAsRead(notificationId, context);
    },

    markMultipleAsRead: async (
      _: any,
      { notificationIds }: { notificationIds: string[] },
      context: NotificationContext
    ) => {
      const service = new NotificationService(context.db);
      return await service.markMultipleAsRead(notificationIds, context);
    },

    markAllAsRead: async (
      _: any,
      __: any,
      context: NotificationContext
    ) => {
      const service = new NotificationService(context.db);
      return await service.markAllAsRead(context);
    },

    updateFCMToken: async (
      _: any,
      { input }: { input: FCMTokenInput },
      context: NotificationContext
    ) => {
      const service = new NotificationService(context.db);
      return await service.updateFCMToken(input, context);
    },

    sendTestNotification: async (
      _: any,
      { title, message, targetUserId, targetVendorId }: {
        title: string;
        message: string;
        targetUserId?: string;
        targetVendorId?: string;
      },
      context: NotificationContext
    ) => {
      const service = new NotificationService(context.db);
      return await service.sendTestNotification(title, message, targetUserId, targetVendorId, context);
    }
  },

  Notification: {
    targetUser: async (parent: Notification, _: any, context: NotificationContext) => {
      const service = new NotificationService(context.db);
      return await service.getTargetUser(parent);
    },

    targetVendor: async (parent: Notification, _: any, context: NotificationContext) => {
      const service = new NotificationService(context.db);
      return await service.getTargetVendor(parent);
    },

    creator: async (parent: Notification, _: any, context: NotificationContext) => {
      const service = new NotificationService(context.db);
      return await service.getCreator(parent);
    }
  }
};