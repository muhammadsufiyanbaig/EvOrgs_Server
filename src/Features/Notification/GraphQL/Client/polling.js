"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET_CATEGORY_NOTIFICATIONS_POLL = exports.GET_HIGH_PRIORITY_NOTIFICATIONS_POLL = exports.GET_NOTIFICATION_STATS_POLL = exports.GET_UNREAD_NOTIFICATIONS_POLL = exports.GET_NOTIFICATION_UPDATES = exports.GET_RECENT_NOTIFICATIONS = void 0;
const client_1 = require("@apollo/client");
const fragments_1 = require("./fragments");
// ==================== POLLING QUERIES (Alternative to Subscriptions) ====================
// Get recent notifications with polling for real-time updates
exports.GET_RECENT_NOTIFICATIONS = (0, client_1.gql) `
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
  ${fragments_1.NOTIFICATION_BASIC_FRAGMENT}
`;
// Get notifications with updates polling
exports.GET_NOTIFICATION_UPDATES = (0, client_1.gql) `
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
  ${fragments_1.NOTIFICATION_FULL_FRAGMENT}
`;
// Poll for unread notifications
exports.GET_UNREAD_NOTIFICATIONS_POLL = (0, client_1.gql) `
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
  ${fragments_1.NOTIFICATION_BASIC_FRAGMENT}
`;
// Poll for notification statistics (admin)
exports.GET_NOTIFICATION_STATS_POLL = (0, client_1.gql) `
  query GetNotificationStatsPoll {
    getNotificationStats {
      ...NotificationStatsFields
    }
  }
  ${fragments_1.NOTIFICATION_STATS_FRAGMENT}
`;
// Get notifications by priority with polling
exports.GET_HIGH_PRIORITY_NOTIFICATIONS_POLL = (0, client_1.gql) `
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
  ${fragments_1.NOTIFICATION_BASIC_FRAGMENT}
`;
// Get notifications by category with polling
exports.GET_CATEGORY_NOTIFICATIONS_POLL = (0, client_1.gql) `
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
  ${fragments_1.NOTIFICATION_BASIC_FRAGMENT}
`;
