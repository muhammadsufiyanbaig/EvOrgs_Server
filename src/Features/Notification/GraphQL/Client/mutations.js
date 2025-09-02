"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CREATE_SYSTEM_NOTIFICATION = exports.CREATE_PROMOTION_NOTIFICATION = exports.CREATE_CHAT_NOTIFICATION = exports.CREATE_PAYMENT_NOTIFICATION = exports.CREATE_BOOKING_NOTIFICATION = exports.CREATE_GENERAL_NOTIFICATION = exports.CREATE_ALL_VENDORS_NOTIFICATION = exports.CREATE_ALL_USERS_NOTIFICATION = exports.CREATE_VENDOR_NOTIFICATION = exports.CREATE_USER_NOTIFICATION = exports.ARCHIVE_OLD_NOTIFICATIONS = exports.DELETE_MULTIPLE_NOTIFICATIONS = exports.CREATE_BULK_NOTIFICATIONS = exports.SEND_TEST_NOTIFICATION = exports.REMOVE_FCM_TOKEN = exports.UPDATE_FCM_TOKEN = exports.MARK_ALL_AS_READ = exports.MARK_MULTIPLE_AS_READ = exports.MARK_AS_READ = exports.CANCEL_SCHEDULED_NOTIFICATION = exports.SCHEDULE_NOTIFICATION = exports.SEND_BULK_NOTIFICATIONS = exports.SEND_NOTIFICATION = exports.DELETE_NOTIFICATION = exports.UPDATE_NOTIFICATION = exports.CREATE_NOTIFICATION = void 0;
const client_1 = require("@apollo/client");
const fragments_1 = require("./fragments");
// ==================== NOTIFICATION MANAGEMENT MUTATIONS ====================
// Create notification (admin only)
exports.CREATE_NOTIFICATION = (0, client_1.gql) `
  mutation CreateNotification($input: CreateNotificationInput!) {
    createNotification(input: $input) {
      ...NotificationWithRelationsFields
    }
  }
  ${fragments_1.NOTIFICATION_WITH_RELATIONS_FRAGMENT}
`;
// Update notification (admin only)
exports.UPDATE_NOTIFICATION = (0, client_1.gql) `
  mutation UpdateNotification($input: UpdateNotificationInput!) {
    updateNotification(input: $input) {
      ...NotificationWithRelationsFields
    }
  }
  ${fragments_1.NOTIFICATION_WITH_RELATIONS_FRAGMENT}
`;
// Delete notification (admin only)
exports.DELETE_NOTIFICATION = (0, client_1.gql) `
  mutation DeleteNotification($id: ID!) {
    deleteNotification(id: $id)
  }
`;
// ==================== NOTIFICATION DELIVERY MUTATIONS ====================
// Send notification immediately (admin only)
exports.SEND_NOTIFICATION = (0, client_1.gql) `
  mutation SendNotification($id: ID!) {
    sendNotification(id: $id) {
      ...FCMResponseFields
    }
  }
  ${fragments_1.FCM_RESPONSE_FRAGMENT}
`;
// Send multiple notifications (admin only)
exports.SEND_BULK_NOTIFICATIONS = (0, client_1.gql) `
  mutation SendBulkNotifications($ids: [ID!]!) {
    sendBulkNotifications(ids: $ids) {
      ...FCMResponseFields
    }
  }
  ${fragments_1.FCM_RESPONSE_FRAGMENT}
`;
// Schedule notification (admin only)
exports.SCHEDULE_NOTIFICATION = (0, client_1.gql) `
  mutation ScheduleNotification($input: CreateNotificationInput!) {
    scheduleNotification(input: $input) {
      ...NotificationWithRelationsFields
    }
  }
  ${fragments_1.NOTIFICATION_WITH_RELATIONS_FRAGMENT}
`;
// Cancel scheduled notification (admin only)
exports.CANCEL_SCHEDULED_NOTIFICATION = (0, client_1.gql) `
  mutation CancelScheduledNotification($id: ID!) {
    cancelScheduledNotification(id: $id)
  }
`;
// ==================== READ STATUS MUTATIONS ====================
// Mark single notification as read
exports.MARK_AS_READ = (0, client_1.gql) `
  mutation MarkAsRead($notificationId: ID!) {
    markAsRead(notificationId: $notificationId)
  }
`;
// Mark multiple notifications as read
exports.MARK_MULTIPLE_AS_READ = (0, client_1.gql) `
  mutation MarkMultipleAsRead($notificationIds: [ID!]!) {
    markMultipleAsRead(notificationIds: $notificationIds)
  }
`;
// Mark all notifications as read
exports.MARK_ALL_AS_READ = (0, client_1.gql) `
  mutation MarkAllAsRead {
    markAllAsRead
  }
`;
// ==================== FCM TOKEN MANAGEMENT MUTATIONS ====================
// Update FCM token
exports.UPDATE_FCM_TOKEN = (0, client_1.gql) `
  mutation UpdateFCMToken($input: FCMTokenInput!) {
    updateFCMToken(input: $input)
  }
`;
// Remove FCM token
exports.REMOVE_FCM_TOKEN = (0, client_1.gql) `
  mutation RemoveFCMToken($token: String!) {
    removeFCMToken(token: $token)
  }
`;
// ==================== TESTING MUTATIONS ====================
// Send test notification (admin only)
exports.SEND_TEST_NOTIFICATION = (0, client_1.gql) `
  mutation SendTestNotification(
    $title: String!
    $message: String!
    $targetUserId: ID
    $targetVendorId: ID
  ) {
    sendTestNotification(
      title: $title
      message: $message
      targetUserId: $targetUserId
      targetVendorId: $targetVendorId
    ) {
      ...FCMResponseFields
    }
  }
  ${fragments_1.FCM_RESPONSE_FRAGMENT}
`;
// ==================== BULK OPERATIONS MUTATIONS ====================
// Create bulk notifications (admin only)
exports.CREATE_BULK_NOTIFICATIONS = (0, client_1.gql) `
  mutation CreateBulkNotifications($inputs: [CreateNotificationInput!]!) {
    createBulkNotifications(inputs: $inputs) {
      successful {
        ...NotificationFullFields
      }
      failed {
        input
        error
      }
      totalRequested
      totalSuccessful
      totalFailed
    }
  }
  ${fragments_1.NOTIFICATION_FULL_FRAGMENT}
`;
// Delete multiple notifications (admin only)
exports.DELETE_MULTIPLE_NOTIFICATIONS = (0, client_1.gql) `
  mutation DeleteMultipleNotifications($ids: [ID!]!) {
    deleteMultipleNotifications(ids: $ids) {
      deletedIds
      failedIds
      totalRequested
      totalDeleted
      totalFailed
    }
  }
`;
// Archive old notifications (admin only)
exports.ARCHIVE_OLD_NOTIFICATIONS = (0, client_1.gql) `
  mutation ArchiveOldNotifications($olderThan: DateTime!, $categories: [NotificationCategory!]) {
    archiveOldNotifications(olderThan: $olderThan, categories: $categories) {
      archivedCount
      archivedIds
      archiveDate
    }
  }
`;
// ==================== NOTIFICATION TYPE SPECIFIC MUTATIONS ====================
// Create user notification (admin only)
exports.CREATE_USER_NOTIFICATION = (0, client_1.gql) `
  mutation CreateUserNotification(
    $targetUserId: ID!
    $title: String!
    $message: String!
    $category: NotificationCategory!
    $priority: NotificationPriority = medium
    $data: JSON
    $linkTo: String
  ) {
    createNotification(input: {
      notificationType: User_Personal
      targetUserId: $targetUserId
      title: $title
      message: $message
      category: $category
      priority: $priority
      data: $data
      linkTo: $linkTo
    }) {
      ...NotificationWithRelationsFields
    }
  }
  ${fragments_1.NOTIFICATION_WITH_RELATIONS_FRAGMENT}
`;
// Create vendor notification (admin only)
exports.CREATE_VENDOR_NOTIFICATION = (0, client_1.gql) `
  mutation CreateVendorNotification(
    $targetVendorId: ID!
    $title: String!
    $message: String!
    $category: NotificationCategory!
    $priority: NotificationPriority = medium
    $data: JSON
    $linkTo: String
  ) {
    createNotification(input: {
      notificationType: Vendor_Personal
      targetVendorId: $targetVendorId
      title: $title
      message: $message
      category: $category
      priority: $priority
      data: $data
      linkTo: $linkTo
    }) {
      ...NotificationWithRelationsFields
    }
  }
  ${fragments_1.NOTIFICATION_WITH_RELATIONS_FRAGMENT}
`;
// Create broadcast notification for all users (admin only)
exports.CREATE_ALL_USERS_NOTIFICATION = (0, client_1.gql) `
  mutation CreateAllUsersNotification(
    $title: String!
    $message: String!
    $category: NotificationCategory!
    $priority: NotificationPriority = medium
    $data: JSON
    $linkTo: String
    $scheduledAt: DateTime
  ) {
    createNotification(input: {
      notificationType: All_Users
      title: $title
      message: $message
      category: $category
      priority: $priority
      data: $data
      linkTo: $linkTo
      scheduledAt: $scheduledAt
    }) {
      ...NotificationWithRelationsFields
    }
  }
  ${fragments_1.NOTIFICATION_WITH_RELATIONS_FRAGMENT}
`;
// Create broadcast notification for all vendors (admin only)
exports.CREATE_ALL_VENDORS_NOTIFICATION = (0, client_1.gql) `
  mutation CreateAllVendorsNotification(
    $title: String!
    $message: String!
    $category: NotificationCategory!
    $priority: NotificationPriority = medium
    $data: JSON
    $linkTo: String
    $scheduledAt: DateTime
  ) {
    createNotification(input: {
      notificationType: All_Vendors
      title: $title
      message: $message
      category: $category
      priority: $priority
      data: $data
      linkTo: $linkTo
      scheduledAt: $scheduledAt
    }) {
      ...NotificationWithRelationsFields
    }
  }
  ${fragments_1.NOTIFICATION_WITH_RELATIONS_FRAGMENT}
`;
// Create general notification (admin only)
exports.CREATE_GENERAL_NOTIFICATION = (0, client_1.gql) `
  mutation CreateGeneralNotification(
    $title: String!
    $message: String!
    $category: NotificationCategory!
    $priority: NotificationPriority = medium
    $data: JSON
    $linkTo: String
    $scheduledAt: DateTime
  ) {
    createNotification(input: {
      notificationType: General
      title: $title
      message: $message
      category: $category
      priority: $priority
      data: $data
      linkTo: $linkTo
      scheduledAt: $scheduledAt
    }) {
      ...NotificationWithRelationsFields
    }
  }
  ${fragments_1.NOTIFICATION_WITH_RELATIONS_FRAGMENT}
`;
// ==================== CATEGORY SPECIFIC MUTATIONS ====================
// Create booking notification
exports.CREATE_BOOKING_NOTIFICATION = (0, client_1.gql) `
  mutation CreateBookingNotification(
    $notificationType: NotificationType!
    $targetUserId: ID
    $targetVendorId: ID
    $title: String!
    $message: String!
    $relatedId: ID
    $priority: NotificationPriority = medium
    $linkTo: String
  ) {
    createNotification(input: {
      notificationType: $notificationType
      targetUserId: $targetUserId
      targetVendorId: $targetVendorId
      title: $title
      message: $message
      category: Booking
      relatedId: $relatedId
      relatedType: Booking
      priority: $priority
      linkTo: $linkTo
    }) {
      ...NotificationWithRelationsFields
    }
  }
  ${fragments_1.NOTIFICATION_WITH_RELATIONS_FRAGMENT}
`;
// Create payment notification
exports.CREATE_PAYMENT_NOTIFICATION = (0, client_1.gql) `
  mutation CreatePaymentNotification(
    $notificationType: NotificationType!
    $targetUserId: ID
    $targetVendorId: ID
    $title: String!
    $message: String!
    $relatedId: ID
    $priority: NotificationPriority = high
    $linkTo: String
  ) {
    createNotification(input: {
      notificationType: $notificationType
      targetUserId: $targetUserId
      targetVendorId: $targetVendorId
      title: $title
      message: $message
      category: Payment
      relatedId: $relatedId
      relatedType: Payment
      priority: $priority
      linkTo: $linkTo
    }) {
      ...NotificationWithRelationsFields
    }
  }
  ${fragments_1.NOTIFICATION_WITH_RELATIONS_FRAGMENT}
`;
// Create chat notification
exports.CREATE_CHAT_NOTIFICATION = (0, client_1.gql) `
  mutation CreateChatNotification(
    $notificationType: NotificationType!
    $targetUserId: ID
    $targetVendorId: ID
    $title: String!
    $message: String!
    $relatedId: ID
    $linkTo: String
  ) {
    createNotification(input: {
      notificationType: $notificationType
      targetUserId: $targetUserId
      targetVendorId: $targetVendorId
      title: $title
      message: $message
      category: Chat
      relatedId: $relatedId
      relatedType: Chat
      priority: medium
      linkTo: $linkTo
    }) {
      ...NotificationWithRelationsFields
    }
  }
  ${fragments_1.NOTIFICATION_WITH_RELATIONS_FRAGMENT}
`;
// Create promotion notification
exports.CREATE_PROMOTION_NOTIFICATION = (0, client_1.gql) `
  mutation CreatePromotionNotification(
    $notificationType: NotificationType!
    $targetUserId: ID
    $targetVendorId: ID
    $title: String!
    $message: String!
    $priority: NotificationPriority = low
    $linkTo: String
    $scheduledAt: DateTime
  ) {
    createNotification(input: {
      notificationType: $notificationType
      targetUserId: $targetUserId
      targetVendorId: $targetVendorId
      title: $title
      message: $message
      category: Promotion
      priority: $priority
      linkTo: $linkTo
      scheduledAt: $scheduledAt
    }) {
      ...NotificationWithRelationsFields
    }
  }
  ${fragments_1.NOTIFICATION_WITH_RELATIONS_FRAGMENT}
`;
// Create system notification
exports.CREATE_SYSTEM_NOTIFICATION = (0, client_1.gql) `
  mutation CreateSystemNotification(
    $notificationType: NotificationType!
    $targetUserId: ID
    $targetVendorId: ID
    $title: String!
    $message: String!
    $priority: NotificationPriority = high
    $linkTo: String
  ) {
    createNotification(input: {
      notificationType: $notificationType
      targetUserId: $targetUserId
      targetVendorId: $targetVendorId
      title: $title
      message: $message
      category: System
      priority: $priority
      linkTo: $linkTo
    }) {
      ...NotificationWithRelationsFields
    }
  }
  ${fragments_1.NOTIFICATION_WITH_RELATIONS_FRAGMENT}
`;
