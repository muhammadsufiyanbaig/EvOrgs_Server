import { AuthenticationError, ForbiddenError, UserInputError } from 'apollo-server-express';
import { NotificationModel } from '../Model';
import { fcmService } from '../PushNotification';
import { NotificationBroadcaster } from '../Utils';
import { CreateNotificationInput, Notification, FCMResponse, NotificationResponse, NotificationFilter, PaginationInput, NotificationContext, FCMTokenInput } from '../Types';

export class NotificationService {
  getCreator(parent: Notification) {
    throw new Error('Method not implemented.');
  }
  getTargetVendor(parent: Notification) {
    throw new Error('Method not implemented.');
  }
  getTargetUser(parent: Notification) {
    throw new Error('Method not implemented.');
  }
  private model: NotificationModel;

  constructor(db: any) {
    this.model = new NotificationModel(db);
  }

  async getMyNotifications(
    filter: NotificationFilter | undefined,
    pagination: PaginationInput | undefined,
    context: NotificationContext
  ): Promise<NotificationResponse> {
    if (!context.user && !context.vendor && !context.Admin) {
      throw new AuthenticationError('Authentication required');
    }
    return await this.model.getNotifications(filter, pagination, context);
  }

  async getAllNotifications(
    filter: NotificationFilter | undefined,
    pagination: PaginationInput | undefined,
    context: NotificationContext
  ): Promise<NotificationResponse> {
    if (!context.Admin) {
      throw new ForbiddenError('Admin access required');
    }
    return await this.model.getAllNotifications(filter, pagination);
  }

  async getNotification(id: string, context: NotificationContext): Promise<Notification> {
    if (!context.user && !context.vendor && !context.Admin) {
      throw new AuthenticationError('Authentication required');
    }

    const notification = await this.model.getNotification(id);
    if (!notification) {
      throw new UserInputError('Notification not found');
    }

    let hasAccess = false;
    if (context.Admin) {
      hasAccess = true;
    } else if (context.user) {
      hasAccess = (
        notification.notificationType === 'General' ||
        notification.notificationType === 'All Users' ||
        (notification.notificationType === 'User Personal' && notification.targetUserId === context.user.id)
      );
    } else if (context.vendor) {
      hasAccess = (
        notification.notificationType === 'General' ||
        notification.notificationType === 'All Vendors' ||
        (notification.notificationType === 'Vendor Personal' && notification.targetVendorId === context.vendor.id)
      );
    }

    if (!hasAccess) {
      throw new ForbiddenError('Access denied');
    }

    return notification;
  }

  async getUnreadCount(context: NotificationContext): Promise<number> {
    if (!context.user && !context.vendor && !context.Admin) {
      throw new AuthenticationError('Authentication required');
    }
    return await this.model.getUnreadCount(context);
  }

  async getNotificationStats(dateFrom: Date | undefined, dateTo: Date | undefined, context: NotificationContext) {
    if (!context.Admin) {
      throw new ForbiddenError('Admin access required');
    }
    return await this.model.getNotificationStats(dateFrom, dateTo);
  }

  async createNotification(input: CreateNotificationInput, context: NotificationContext): Promise<Notification> {
    if (!context.Admin) {
      throw new ForbiddenError('Admin access required');
    }

    if (input.notificationType === 'User Personal' && !input.targetUserId) {
      throw new UserInputError('targetUserId is required for User Personal notifications');
    }
    if (input.notificationType === 'Vendor Personal' && !input.targetVendorId) {
      throw new UserInputError('targetVendorId is required for Vendor Personal notifications');
    }

    if (input.targetUserId) {
      const userExists = await this.model.getUser(input.targetUserId);
      if (!userExists) {
        throw new UserInputError('Target user not found');
      }
    }

    if (input.targetVendorId) {
      const vendorExists = await this.model.getVendor(input.targetVendorId);
      if (!vendorExists) {
        throw new UserInputError('Target vendor not found');
      }
    }

    const notification = await this.model.createNotification(input, context.Admin.id);
    
    if (!input.scheduledAt) {
      await this.sendNotificationToRecipients(notification);
    }

    await NotificationBroadcaster.broadcastNotificationCreated(notification);
    return notification;
  }

  async sendNotification(id: string, context: NotificationContext): Promise<FCMResponse> {
    if (!context.Admin) {
      throw new ForbiddenError('Admin access required');
    }

    const notification = await this.model.getNotification(id);
    if (!notification) {
      throw new UserInputError('Notification not found');
    }

    const result = await this.sendNotificationToRecipients(notification);
    await this.model.updateNotificationSendStatus(id, result);
    return result;
  }

  async markAsRead(notificationId: string, context: NotificationContext): Promise<boolean> {
    if (!context.user && !context.vendor && !context.Admin) {
      throw new AuthenticationError('Authentication required');
    }

    const notification = await this.model.getNotification(notificationId);
    if (!notification) {
      throw new UserInputError('Notification not found');
    }

    const result = await this.model.markAsRead(notificationId, context);
    await NotificationBroadcaster.broadcastReadStatus({
      notificationId,
      userId: context.user?.id,
      vendorId: context.vendor?.id,
      adminId: context.Admin?.id,
      readAt: new Date()
    });
    return result;
  }

  async markMultipleAsRead(notificationIds: string[], context: NotificationContext): Promise<boolean> {
    if (!context.user && !context.vendor && !context.Admin) {
      throw new AuthenticationError('Authentication required');
    }

    const result = await this.model.markMultipleAsRead(notificationIds, context);
    for (const notificationId of notificationIds) {
      await NotificationBroadcaster.broadcastReadStatus({
        notificationId,
        userId: context.user?.id,
        vendorId: context.vendor?.id,
        adminId: context.Admin?.id,
        readAt: new Date()
      });
    }
    return result;
  }

  async markAllAsRead(context: NotificationContext): Promise<boolean> {
    if (!context.user && !context.vendor && !context.Admin) {
      throw new AuthenticationError('Authentication required');
    }

    const result = await this.model.markAllAsRead(context);
    const notificationIds = (await this.model.getNotifications(undefined, undefined, context))
      .notifications.map((n: any) => n.id);
    
    await NotificationBroadcaster.broadcastReadStatus({
      bulkRead: true,
      notificationIds,
      userId: context.user?.id,
      vendorId: context.vendor?.id,
      adminId: context.Admin?.id,
      readAt: new Date()
    });
    return result;
  }

  async updateFCMToken(input: FCMTokenInput, context: NotificationContext): Promise<boolean> {
    if (!context.user && !context.vendor) {
      throw new AuthenticationError('Authentication required');
    }

    if (input.userId && context.user && input.userId !== context.user.id) {
      throw new ForbiddenError('Cannot update token for another user');
    }

    if (input.vendorId && context.vendor && input.vendorId !== context.vendor.id) {
      throw new ForbiddenError('Cannot update token for another vendor');
    }

    return await this.model.updateFCMToken(input, context);
  }

  async sendTestNotification(
    title: string,
    message: string,
    targetUserId: string | undefined,
    targetVendorId: string | undefined,
    context: NotificationContext
  ): Promise<FCMResponse> {
    if (!context.Admin) {
      throw new ForbiddenError('Admin access required');
    }

    const tokens = await this.model.getTestNotificationTokens(targetUserId, targetVendorId);
    if (tokens.length === 0) {
      return {
        success: false,
        message: 'No FCM tokens found for target recipients',
        successCount: 0,
        failureCount: 0
      };
    }

    const payload = fcmService.createPayload(title, message, 'medium');
    return await fcmService.sendToMultipleDevices(tokens, payload);
  }

  private async sendNotificationToRecipients(notification: Notification): Promise<FCMResponse> {
    const tokens = await this.model.getRecipientTokens(notification);
    if (tokens.length === 0) {
      return {
        success: false,
        message: 'No FCM tokens found for recipients',
        successCount: 0,
        failureCount: 0
      };
    }

    const payload = fcmService.createPayload(
      notification.title,
      notification.message,
      notification.priority,
      notification.data,
      notification.linkTo
    );
    return await fcmService.sendToMultipleDevices(tokens, payload);
  }
}