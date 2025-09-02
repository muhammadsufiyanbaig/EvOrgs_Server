// TypeScript types for Notification System Client-Side GraphQL Operations

export enum NotificationType {
  General = 'General',
  All_Vendors = 'All_Vendors',
  Vendor_Personal = 'Vendor_Personal',
  All_Users = 'All_Users',
  User_Personal = 'User_Personal'
}

export enum NotificationCategory {
  Booking = 'Booking',
  Payment = 'Payment',
  System = 'System',
  Chat = 'Chat',
  Promotion = 'Promotion',
  General = 'General'
}

export enum NotificationPriority {
  low = 'low',
  medium = 'medium',
  high = 'high',
  urgent = 'urgent'
}

export enum RelatedType {
  Booking = 'Booking',
  Payment = 'Payment',
  Chat = 'Chat',
  Review = 'Review',
  User = 'User',
  Vendor = 'Vendor'
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC'
}

// ==================== CORE TYPES ====================

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
  scheduledAt?: string;
  sentAt?: string;
  totalRecipients: number;
  successfulSends: number;
  failedSends: number;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  isRead?: boolean;
  readAt?: string;
  targetUser?: User;
  targetVendor?: Vendor;
  creator?: Admin;
}

export interface NotificationReadStatus {
  id: string;
  notificationId: string;
  userId?: string;
  vendorId?: string;
  adminId?: string;
  readAt: string;
  notification?: Notification;
  user?: User;
  vendor?: Vendor;
  admin?: Admin;
}

export interface NotificationStats {
  totalNotifications: number;
  totalSentToday: number;
  totalReadToday: number;
  totalUnread: number;
  byCategory: CategoryStats[];
  byType: TypeStats[];
}

export interface CategoryStats {
  category: NotificationCategory;
  count: number;
}

export interface TypeStats {
  type: NotificationType;
  count: number;
}

export interface FCMResponse {
  success: boolean;
  message: string;
  failedTokens?: string[];
  successCount?: number;
  failureCount?: number;
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

// ==================== INPUT TYPES ====================

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
  scheduledAt?: string;
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
  scheduledAt?: string;
}

export interface NotificationFilter {
  notificationType?: NotificationType;
  category?: NotificationCategory;
  priority?: NotificationPriority;
  isActive?: boolean;
  createdBy?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface NotificationPaginationInput {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
}

export interface FCMTokenInput {
  userId?: string;
  vendorId?: string;
  token: string;
}

// ==================== RELATED ENTITY TYPES ====================

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string;
  phone?: string;
}

export interface Vendor {
  id: string;
  businessName: string;
  email: string;
  logo?: string;
  phone?: string;
  address?: string;
}

export interface Admin {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
}

// ==================== BULK OPERATION TYPES ====================

export interface BulkNotificationResult {
  successful: Notification[];
  failed: BulkNotificationError[];
  totalRequested: number;
  totalSuccessful: number;
  totalFailed: number;
}

export interface BulkNotificationError {
  input: CreateNotificationInput;
  error: string;
}

export interface BulkDeleteResult {
  deletedIds: string[];
  failedIds: string[];
  totalRequested: number;
  totalDeleted: number;
  totalFailed: number;
}

export interface ArchiveResult {
  archivedCount: number;
  archivedIds: string[];
  archiveDate: string;
}

// ==================== SUBSCRIPTION TYPES ====================

export interface NotificationDeliveryStatus {
  notificationId: string;
  status: string;
  deliveredCount: number;
  failedCount: number;
  deliveryRate: number;
  lastUpdated: string;
}

export interface BulkNotificationProgress {
  operationId: string;
  totalCount: number;
  processedCount: number;
  successCount: number;
  failedCount: number;
  status: string;
  completedAt?: string;
}

// ==================== QUERY VARIABLES TYPES ====================

export interface GetMyNotificationsVariables {
  filter?: NotificationFilter;
  pagination?: NotificationPaginationInput;
}

export interface GetAllNotificationsVariables {
  filter?: NotificationFilter;
  pagination?: NotificationPaginationInput;
}

export interface GetNotificationVariables {
  id: string;
}

export interface GetNotificationStatsVariables {
  dateFrom?: string;
  dateTo?: string;
}

export interface GetNotificationReadStatusVariables {
  notificationId: string;
}

export interface SearchNotificationsVariables {
  search: string;
  pagination?: NotificationPaginationInput;
}

export interface GetNotificationsByFilterVariables {
  filter: NotificationFilter;
  pagination?: NotificationPaginationInput;
}

// ==================== MUTATION VARIABLES TYPES ====================

export interface CreateNotificationVariables {
  input: CreateNotificationInput;
}

export interface UpdateNotificationVariables {
  input: UpdateNotificationInput;
}

export interface DeleteNotificationVariables {
  id: string;
}

export interface SendNotificationVariables {
  id: string;
}

export interface SendBulkNotificationsVariables {
  ids: string[];
}

export interface MarkAsReadVariables {
  notificationId: string;
}

export interface MarkMultipleAsReadVariables {
  notificationIds: string[];
}

export interface UpdateFCMTokenVariables {
  input: FCMTokenInput;
}

export interface RemoveFCMTokenVariables {
  token: string;
}

export interface SendTestNotificationVariables {
  title: string;
  message: string;
  targetUserId?: string;
  targetVendorId?: string;
}

export interface CreateBulkNotificationsVariables {
  inputs: CreateNotificationInput[];
}

export interface DeleteMultipleNotificationsVariables {
  ids: string[];
}

export interface ArchiveOldNotificationsVariables {
  olderThan: string;
  categories?: NotificationCategory[];
}

// ==================== SPECIFIC NOTIFICATION CREATION TYPES ====================

export interface CreateUserNotificationVariables {
  targetUserId: string;
  title: string;
  message: string;
  category: NotificationCategory;
  priority?: NotificationPriority;
  data?: any;
  linkTo?: string;
}

export interface CreateVendorNotificationVariables {
  targetVendorId: string;
  title: string;
  message: string;
  category: NotificationCategory;
  priority?: NotificationPriority;
  data?: any;
  linkTo?: string;
}

export interface CreateBroadcastNotificationVariables {
  title: string;
  message: string;
  category: NotificationCategory;
  priority?: NotificationPriority;
  data?: any;
  linkTo?: string;
  scheduledAt?: string;
}

export interface CreateCategoryNotificationVariables {
  notificationType: NotificationType;
  targetUserId?: string;
  targetVendorId?: string;
  title: string;
  message: string;
  relatedId?: string;
  priority?: NotificationPriority;
  linkTo?: string;
}

// ==================== SUBSCRIPTION VARIABLES TYPES ====================

export interface NotificationReadSubscriptionVariables {
  notificationId: string;
}

export interface UserNotificationSubscriptionVariables {
  userId: string;
}

export interface VendorNotificationSubscriptionVariables {
  vendorId: string;
}

export interface NotificationDeliveryStatusVariables {
  notificationId: string;
}

export interface BulkNotificationProgressVariables {
  operationId: string;
}

// ==================== HOOK RETURN TYPES ====================

export interface UseNotificationsResult {
  notifications: Notification[];
  loading: boolean;
  error?: Error;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  refetch: () => void;
  loadMore: () => void;
}

export interface UseNotificationResult {
  notification?: Notification;
  loading: boolean;
  error?: Error;
  refetch: () => void;
}

export interface UseNotificationStatsResult {
  stats?: NotificationStats;
  loading: boolean;
  error?: Error;
  refetch: () => void;
}

export interface UseUnreadCountResult {
  count: number;
  loading: boolean;
  error?: Error;
  refetch: () => void;
}

// ==================== UTILITY TYPES ====================

export interface NotificationFormData {
  title: string;
  message: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  notificationType: NotificationType;
  targetUserId?: string;
  targetVendorId?: string;
  data?: any;
  linkTo?: string;
  scheduledAt?: Date;
}

export interface NotificationFilterFormData {
  notificationType?: NotificationType;
  category?: NotificationCategory;
  priority?: NotificationPriority;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}

export interface PaginationState {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: SortOrder;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error?: string;
  filter: NotificationFilter;
  pagination: PaginationState;
}
