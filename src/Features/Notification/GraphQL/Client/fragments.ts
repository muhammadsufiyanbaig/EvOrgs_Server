import { gql } from '@apollo/client';

// ==================== NOTIFICATION FRAGMENTS ====================

export const NOTIFICATION_BASIC_FRAGMENT = gql`
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

export const NOTIFICATION_FULL_FRAGMENT = gql`
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

export const NOTIFICATION_WITH_RELATIONS_FRAGMENT = gql`
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
  ${NOTIFICATION_FULL_FRAGMENT}
`;

export const NOTIFICATION_READ_STATUS_FRAGMENT = gql`
  fragment NotificationReadStatusFields on NotificationReadStatus {
    id
    notificationId
    userId
    vendorId
    adminId
    readAt
  }
`;

export const NOTIFICATION_STATS_FRAGMENT = gql`
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

export const FCM_RESPONSE_FRAGMENT = gql`
  fragment FCMResponseFields on FCMResponse {
    success
    message
    failedTokens
    successCount
    failureCount
  }
`;

export const NOTIFICATION_RESPONSE_FRAGMENT = gql`
  fragment NotificationResponseFields on NotificationResponse {
    total
    page
    limit
    totalPages
    hasNextPage
    hasPreviousPage
  }
`;
