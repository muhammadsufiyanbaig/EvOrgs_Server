import { Notification } from '../Types';

export class NotificationEmitter {
  private listeners: Map<string, Array<(data: any) => void>> = new Map();

  on(event: string, callback: (data: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: (data: any) => void) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event: string, data: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in notification listener:', error);
        }
      });
    }
  }

  removeAllListeners(event?: string) {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }
}

export class NotificationBroadcaster {
  private static emitter = new NotificationEmitter();

  static async broadcastToUser(userId: string, notification: any) {
    this.emitter.emit(`user_${userId}_notification`, {
      userId,
      notification,
      timestamp: new Date()
    });
    this.emitter.emit('user_notification', {
      userId,
      notification,
      timestamp: new Date()
    });
  }

  static async broadcastToVendor(vendorId: string, notification: any) {
    this.emitter.emit(`vendor_${vendorId}_notification`, {
      vendorId,
      notification,
      timestamp: new Date()
    });
    this.emitter.emit('vendor_notification', {
      vendorId,
      notification,
      timestamp: new Date()
    });
  }

  static async broadcastToAdmin(notification: any) {
    this.emitter.emit('admin_notification', {
      notification,
      timestamp: new Date()
    });
  }

  static async broadcastGlobal(notification: any) {
    this.emitter.emit('global_notification', {
      notification,
      timestamp: new Date()
    });
  }

  static async broadcastReadStatus(readStatus: any) {
    const { notificationId, userId, vendorId, adminId } = readStatus;
    if (userId) {
      this.emitter.emit(`user_${userId}_notification_read`, readStatus);
    } else if (vendorId) {
      this.emitter.emit(`vendor_${vendorId}_notification_read`, readStatus);
    } else if (adminId) {
      this.emitter.emit('admin_notification_read', readStatus);
    }
    this.emitter.emit('notification_read', readStatus);
  }

  static subscribeToNotifications(
    userType: 'user' | 'vendor' | 'admin' | 'global',
    userId: string | null,
    callback: (data: any) => void
  ) {
    const eventName = userId ? `${userType}_${userId}_notification` : `${userType}_notification`;
    this.emitter.on(eventName, callback);
    return () => this.emitter.off(eventName, callback);
  }

  static subscribeToReadStatus(
    userType: 'user' | 'vendor' | 'admin',
    userId: string | null,
    callback: (data: any) => void
  ) {
    const eventName = userId ? `${userType}_${userId}_notification_read` : 'notification_read';
    this.emitter.on(eventName, callback);
    return () => this.emitter.off(eventName, callback);
  }

  static async broadcastNotificationCreated(notification: Notification) {
    switch (notification.notificationType) {
      case 'General':
        await this.broadcastGlobal(notification);
        break;
      case 'All Users':
        await this.broadcastGlobal(notification);
        break;
      case 'All Vendors':
        await this.broadcastGlobal(notification);
        break;
      case 'User Personal':
        if (notification.targetUserId) {
          await this.broadcastToUser(notification.targetUserId, notification);
        }
        break;
      case 'Vendor Personal':
        if (notification.targetVendorId) {
          await this.broadcastToVendor(notification.targetVendorId, notification);
        }
        break;
    }
  }
}