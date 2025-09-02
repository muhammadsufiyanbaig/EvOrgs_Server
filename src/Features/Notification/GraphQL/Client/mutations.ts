import { gql } from '@apollo/client';
import {
  NOTIFICATION_FULL_FRAGMENT,
  NOTIFICATION_WITH_RELATIONS_FRAGMENT,
  FCM_RESPONSE_FRAGMENT
} from './fragments';

// ==================== NOTIFICATION MANAGEMENT MUTATIONS ====================

// Create notification (admin only)
export const CREATE_NOTIFICATION = gql`
  mutation CreateNotification($input: CreateNotificationInput!) {
    createNotification(input: $input) {
      ...NotificationWithRelationsFields
    }
  }
  ${NOTIFICATION_WITH_RELATIONS_FRAGMENT}
`;

// Update notification (admin only)
export const UPDATE_NOTIFICATION = gql`
  mutation UpdateNotification($input: UpdateNotificationInput!) {
    updateNotification(input: $input) {
      ...NotificationWithRelationsFields
    }
  }
  ${NOTIFICATION_WITH_RELATIONS_FRAGMENT}
`;

// Delete notification (admin only)
export const DELETE_NOTIFICATION = gql`
  mutation DeleteNotification($id: ID!) {
    deleteNotification(id: $id)
  }
`;

// ==================== NOTIFICATION DELIVERY MUTATIONS ====================

// Send notification immediately (admin only)
export const SEND_NOTIFICATION = gql`
  mutation SendNotification($id: ID!) {
    sendNotification(id: $id) {
      ...FCMResponseFields
    }
  }
  ${FCM_RESPONSE_FRAGMENT}
`;

// Send multiple notifications (admin only)
export const SEND_BULK_NOTIFICATIONS = gql`
  mutation SendBulkNotifications($ids: [ID!]!) {
    sendBulkNotifications(ids: $ids) {
      ...FCMResponseFields
    }
  }
  ${FCM_RESPONSE_FRAGMENT}
`;

// Schedule notification (admin only)
export const SCHEDULE_NOTIFICATION = gql`
  mutation ScheduleNotification($input: CreateNotificationInput!) {
    scheduleNotification(input: $input) {
      ...NotificationWithRelationsFields
    }
  }
  ${NOTIFICATION_WITH_RELATIONS_FRAGMENT}
`;

// Cancel scheduled notification (admin only)
export const CANCEL_SCHEDULED_NOTIFICATION = gql`
  mutation CancelScheduledNotification($id: ID!) {
    cancelScheduledNotification(id: $id)
  }
`;

// ==================== READ STATUS MUTATIONS ====================

// Mark single notification as read
export const MARK_AS_READ = gql`
  mutation MarkAsRead($notificationId: ID!) {
    markAsRead(notificationId: $notificationId)
  }
`;

// Mark multiple notifications as read
export const MARK_MULTIPLE_AS_READ = gql`
  mutation MarkMultipleAsRead($notificationIds: [ID!]!) {
    markMultipleAsRead(notificationIds: $notificationIds)
  }
`;

// Mark all notifications as read
export const MARK_ALL_AS_READ = gql`
  mutation MarkAllAsRead {
    markAllAsRead
  }
`;

// ==================== FCM TOKEN MANAGEMENT MUTATIONS ====================

// Update FCM token
export const UPDATE_FCM_TOKEN = gql`
  mutation UpdateFCMToken($input: FCMTokenInput!) {
    updateFCMToken(input: $input)
  }
`;

// Remove FCM token
export const REMOVE_FCM_TOKEN = gql`
  mutation RemoveFCMToken($token: String!) {
    removeFCMToken(token: $token)
  }
`;

// ==================== TESTING MUTATIONS ====================

// Send test notification (admin only)
export const SEND_TEST_NOTIFICATION = gql`
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
  ${FCM_RESPONSE_FRAGMENT}
`;

// ==================== BULK OPERATIONS MUTATIONS ====================

// Create bulk notifications (admin only)
export const CREATE_BULK_NOTIFICATIONS = gql`
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
  ${NOTIFICATION_FULL_FRAGMENT}
`;

// Delete multiple notifications (admin only)
export const DELETE_MULTIPLE_NOTIFICATIONS = gql`
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
export const ARCHIVE_OLD_NOTIFICATIONS = gql`
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
export const CREATE_USER_NOTIFICATION = gql`
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
  ${NOTIFICATION_WITH_RELATIONS_FRAGMENT}
`;

// Create vendor notification (admin only)
export const CREATE_VENDOR_NOTIFICATION = gql`
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
  ${NOTIFICATION_WITH_RELATIONS_FRAGMENT}
`;

// Create broadcast notification for all users (admin only)
export const CREATE_ALL_USERS_NOTIFICATION = gql`
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
  ${NOTIFICATION_WITH_RELATIONS_FRAGMENT}
`;

// Create broadcast notification for all vendors (admin only)
export const CREATE_ALL_VENDORS_NOTIFICATION = gql`
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
  ${NOTIFICATION_WITH_RELATIONS_FRAGMENT}
`;

// Create general notification (admin only)
export const CREATE_GENERAL_NOTIFICATION = gql`
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
  ${NOTIFICATION_WITH_RELATIONS_FRAGMENT}
`;

// ==================== CATEGORY SPECIFIC MUTATIONS ====================

// Create booking notification
export const CREATE_BOOKING_NOTIFICATION = gql`
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
  ${NOTIFICATION_WITH_RELATIONS_FRAGMENT}
`;

// Create payment notification
export const CREATE_PAYMENT_NOTIFICATION = gql`
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
  ${NOTIFICATION_WITH_RELATIONS_FRAGMENT}
`;

// Create chat notification
export const CREATE_CHAT_NOTIFICATION = gql`
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
  ${NOTIFICATION_WITH_RELATIONS_FRAGMENT}
`;

// Create promotion notification
export const CREATE_PROMOTION_NOTIFICATION = gql`
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
  ${NOTIFICATION_WITH_RELATIONS_FRAGMENT}
`;

// Create system notification
export const CREATE_SYSTEM_NOTIFICATION = gql`
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
  ${NOTIFICATION_WITH_RELATIONS_FRAGMENT}
`;
