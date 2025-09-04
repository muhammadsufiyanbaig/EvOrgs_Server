"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationBroadcaster = exports.NotificationEmitter = void 0;
class NotificationEmitter {
    constructor() {
        this.listeners = new Map();
    }
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }
    off(event, callback) {
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }
    emit(event, data) {
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            callbacks.forEach(callback => {
                try {
                    callback(data);
                }
                catch (error) {
                    console.error('Error in notification listener:', error);
                }
            });
        }
    }
    removeAllListeners(event) {
        if (event) {
            this.listeners.delete(event);
        }
        else {
            this.listeners.clear();
        }
    }
}
exports.NotificationEmitter = NotificationEmitter;
class NotificationBroadcaster {
    static broadcastToUser(userId, notification) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    static broadcastToVendor(vendorId, notification) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    static broadcastToAdmin(notification) {
        return __awaiter(this, void 0, void 0, function* () {
            this.emitter.emit('admin_notification', {
                notification,
                timestamp: new Date()
            });
        });
    }
    static broadcastGlobal(notification) {
        return __awaiter(this, void 0, void 0, function* () {
            this.emitter.emit('global_notification', {
                notification,
                timestamp: new Date()
            });
        });
    }
    static broadcastReadStatus(readStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            const { notificationId, userId, vendorId, adminId } = readStatus;
            if (userId) {
                this.emitter.emit(`user_${userId}_notification_read`, readStatus);
            }
            else if (vendorId) {
                this.emitter.emit(`vendor_${vendorId}_notification_read`, readStatus);
            }
            else if (adminId) {
                this.emitter.emit('admin_notification_read', readStatus);
            }
            this.emitter.emit('notification_read', readStatus);
        });
    }
    static subscribeToNotifications(userType, userId, callback) {
        const eventName = userId ? `${userType}_${userId}_notification` : `${userType}_notification`;
        this.emitter.on(eventName, callback);
        return () => this.emitter.off(eventName, callback);
    }
    static subscribeToReadStatus(userType, userId, callback) {
        const eventName = userId ? `${userType}_${userId}_notification_read` : 'notification_read';
        this.emitter.on(eventName, callback);
        return () => this.emitter.off(eventName, callback);
    }
    static broadcastNotificationCreated(notification) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (notification.notificationType) {
                case 'General':
                    yield this.broadcastGlobal(notification);
                    break;
                case 'All Users':
                    yield this.broadcastGlobal(notification);
                    break;
                case 'All Vendors':
                    yield this.broadcastGlobal(notification);
                    break;
                case 'User Personal':
                    if (notification.targetUserId) {
                        yield this.broadcastToUser(notification.targetUserId, notification);
                    }
                    break;
                case 'Vendor Personal':
                    if (notification.targetVendorId) {
                        yield this.broadcastToVendor(notification.targetVendorId, notification);
                    }
                    break;
            }
        });
    }
}
exports.NotificationBroadcaster = NotificationBroadcaster;
NotificationBroadcaster.emitter = new NotificationEmitter();
