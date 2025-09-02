import { gql } from '@apollo/client';
import {
  NOTIFICATION_BASIC_FRAGMENT,
  NOTIFICATION_FULL_FRAGMENT,
  NOTIFICATION_STATS_FRAGMENT
} from './fragments';

// ==================== POLLING QUERIES (Alternative to Subscriptions) ====================

// Get recent notifications with polling for real-time updates
export const GET_RECENT_NOTIFICATIONS = gql`
  query GetRecentNotifications($limit: Int = 5) {
    getMyNotifications(
      pagination: { limit: $limit, sortBy: "createdAt", sortOrder: DESC }
    ) {
      notifications {
        ...NotificationBasicFields
      }
      total
    }
  }
  ${NOTIFICATION_BASIC_FRAGMENT}
`;

// Get notifications with updates polling
export const GET_NOTIFICATION_UPDATES = gql`
  query GetNotificationUpdates($lastCheckTime: DateTime!) {
    getMyNotifications(
      filter: { dateFrom: $lastCheckTime }
      pagination: { limit: 50, sortBy: "createdAt", sortOrder: DESC }
    ) {
      notifications {
        ...NotificationFullFields
      }
      total
    }
  }
  ${NOTIFICATION_FULL_FRAGMENT}
`;

// Poll for unread notifications
export const GET_UNREAD_NOTIFICATIONS_POLL = gql`
  query GetUnreadNotificationsPoll {
    getUnreadCount
    getMyNotifications(
      pagination: { limit: 10, sortBy: "createdAt", sortOrder: DESC }
    ) {
      notifications {
        ...NotificationBasicFields
      }
    }
  }
  ${NOTIFICATION_BASIC_FRAGMENT}
`;

// Poll for notification statistics (admin)
export const GET_NOTIFICATION_STATS_POLL = gql`
  query GetNotificationStatsPoll {
    getNotificationStats {
      ...NotificationStatsFields
    }
  }
  ${NOTIFICATION_STATS_FRAGMENT}
`;

// Get notifications by priority with polling
export const GET_HIGH_PRIORITY_NOTIFICATIONS_POLL = gql`
  query GetHighPriorityNotificationsPoll {
    getMyNotifications(
      filter: { priority: high }
      pagination: { limit: 20, sortBy: "createdAt", sortOrder: DESC }
    ) {
      notifications {
        ...NotificationBasicFields
      }
    }
    getMyNotifications(
      filter: { priority: urgent }
      pagination: { limit: 20, sortBy: "createdAt", sortOrder: DESC }
    ) {
      notifications {
        ...NotificationBasicFields
      }
    }
  }
  ${NOTIFICATION_BASIC_FRAGMENT}
`;

// Get notifications by category with polling
export const GET_CATEGORY_NOTIFICATIONS_POLL = gql`
  query GetCategoryNotificationsPoll($category: NotificationCategory!) {
    getMyNotifications(
      filter: { category: $category }
      pagination: { limit: 10, sortBy: "createdAt", sortOrder: DESC }
    ) {
      notifications {
        ...NotificationBasicFields
      }
      total
    }
  }
  ${NOTIFICATION_BASIC_FRAGMENT}
`;
