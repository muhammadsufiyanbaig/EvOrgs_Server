"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NOTIFICATION_RESPONSE_FRAGMENT = exports.FCM_RESPONSE_FRAGMENT = exports.NOTIFICATION_STATS_FRAGMENT = exports.NOTIFICATION_READ_STATUS_FRAGMENT = exports.NOTIFICATION_WITH_RELATIONS_FRAGMENT = exports.NOTIFICATION_FULL_FRAGMENT = exports.NOTIFICATION_BASIC_FRAGMENT = void 0;
const client_1 = require("@apollo/client");
// ==================== NOTIFICATION FRAGMENTS ====================
exports.NOTIFICATION_BASIC_FRAGMENT = (0, client_1.gql) `
  fragment NotificationBasicFields on Notification {
    id
    notificationType
    title
    message
    category
    priority
    isActive
    createdAt
    updatedAt
    isRead
    readAt
  }
`;
exports.NOTIFICATION_FULL_FRAGMENT = (0, client_1.gql) `
  fragment NotificationFullFields on Notification {
    id
    notificationType
    targetUserId
    targetVendorId
    title
    message
    category
    data
    linkTo
    relatedId
    relatedType
    priority
    isActive
    scheduledAt
    sentAt
    totalRecipients
    successfulSends
    failedSends
    createdBy
    createdAt
    updatedAt
    isRead
    readAt
  }
`;
exports.NOTIFICATION_WITH_RELATIONS_FRAGMENT = (0, client_1.gql) `
  fragment NotificationWithRelationsFields on Notification {
    ...NotificationFullFields
    targetUser {
      id
      firstName
      lastName
      email
      profileImage
    }
    targetVendor {
      id
      businessName
      email
      logo
    }
    creator {
      id
      firstName
      lastName
      email
    }
  }
  ${exports.NOTIFICATION_FULL_FRAGMENT}
`;
exports.NOTIFICATION_READ_STATUS_FRAGMENT = (0, client_1.gql) `
  fragment NotificationReadStatusFields on NotificationReadStatus {
    id
    notificationId
    userId
    vendorId
    adminId
    readAt
  }
`;
exports.NOTIFICATION_STATS_FRAGMENT = (0, client_1.gql) `
  fragment NotificationStatsFields on NotificationStats {
    totalNotifications
    totalSentToday
    totalReadToday
    totalUnread
    byCategory {
      category
      count
    }
    byType {
      type
      count
    }
  }
`;
exports.FCM_RESPONSE_FRAGMENT = (0, client_1.gql) `
  fragment FCMResponseFields on FCMResponse {
    success
    message
    failedTokens
    successCount
    failureCount
  }
`;
exports.NOTIFICATION_RESPONSE_FRAGMENT = (0, client_1.gql) `
  fragment NotificationResponseFields on NotificationResponse {
    total
    page
    limit
    totalPages
    hasNextPage
    hasPreviousPage
  }
`;
