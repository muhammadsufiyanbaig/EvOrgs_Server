// src/Features/Notifications/Types/index.ts

export type NotificationType = 
  | "General" 
  | "All Vendors" 
  | "Vendor Personal" 
  | "All Users" 
  | "User Personal";

export type NotificationCategory = 
  | "Booking" 
  | "Payment" 
  | "System" 
  | "Chat" 
  | "Promotion" 
  | "General";

export type NotificationPriority = 
  | "low" 
  | "medium" 
  | "high" 
  | "urgent";

export type RelatedType = 
  | "Booking" 
  | "Payment" 
  | "Chat" 
  | "Review" 
  | "User" 
  | "Vendor";

export interface Notification {
  id: string;
  notificationType: NotificationType;
  targetUserId?: string;
  targetVendorId?: string;
  title: string;
  message: string;
  category: NotificationCategory;
  data?: any;
  linkTo?: string;
  relatedId?: string;
  relatedType?: RelatedType;
  priority: NotificationPriority;
  isActive: boolean;
  scheduledAt?: Date;
  sentAt?: Date;
  totalRecipients: number;
  successfulSends: number;
  failedSends: number;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationReadStatus {
  id: string;
  notificationId: string;
  userId?: string;
  vendorId?: string;
  adminId?: string;
  readAt: Date;
}

// Input Types
export interface CreateNotificationInput {
  notificationType: NotificationType;
  targetUserId?: string;
  targetVendorId?: string;
  title: string;
  message: string;
  category: NotificationCategory;
  data?: any;
  linkTo?: string;
  relatedId?: string;
  relatedType?: RelatedType;
  priority?: NotificationPriority;
  scheduledAt?: Date;
}

export interface UpdateNotificationInput {
  id: string;
  title?: string;
  message?: string;
  category?: NotificationCategory;
  data?: any;
  linkTo?: string;
  priority?: NotificationPriority;
  isActive?: boolean;
  scheduledAt?: Date;
}

export interface NotificationFilter {
  notificationType?: NotificationType;
  category?: NotificationCategory;
  priority?: NotificationPriority;
  isActive?: boolean;
  createdBy?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface PaginationInput {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}
export interface NotificationResponse {
  notifications: Notification[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
export interface FCMTokenInput {
  userId?: string;
  vendorId?: string;
  token: string;
}

export interface FCMResponse {
  success: boolean;
  message: string;
  failedTokens?: string[];
  successCount?: number;
  failureCount?: number;
}

// Context types
export interface NotificationContext {
  db: any;
  user?: any;
  vendor?: any;
  Admin?: any;
}

export interface FCMPayload {
  notification: {
    title: string;
    body: string;
  };
  data?: Record<string, string>;
  android?: {
    priority: 'normal' | 'high';
    notification: {
      sound: string;
      click_action: string;
    };
  };
  apns?: {
    payload: {
      aps: {
        sound: string;
        badge?: number;
      };
    };
  };
}