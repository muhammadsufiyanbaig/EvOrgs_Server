"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET_NOTIFICATION_DELIVERY_REPORTS = exports.GET_NOTIFICATION_PERFORMANCE = exports.GET_NOTIFICATION_STATS_BY_CATEGORY = exports.SEARCH_ALL_NOTIFICATIONS = exports.SEARCH_NOTIFICATIONS = exports.GET_NOTIFICATIONS_BY_DATE_RANGE = exports.GET_UNREAD_NOTIFICATIONS = exports.GET_NOTIFICATIONS_BY_PRIORITY = exports.GET_NOTIFICATIONS_BY_TYPE = exports.GET_NOTIFICATIONS_BY_CATEGORY = exports.GET_NOTIFICATION_READ_STATUS = exports.GET_NOTIFICATION_STATS = exports.GET_ALL_NOTIFICATIONS = exports.GET_UNREAD_COUNT = exports.GET_NOTIFICATION_WITH_STATUS = exports.GET_NOTIFICATION = exports.GET_MY_NOTIFICATIONS_DETAILED = exports.GET_MY_NOTIFICATIONS = void 0;
const client_1 = require("@apollo/client");
const fragments_1 = require("./fragments");
// ==================== USER/VENDOR QUERIES ====================
// Get my notifications (for authenticated users/vendors)
exports.GET_MY_NOTIFICATIONS = (0, client_1.gql) `
  query GetMyNotifications(
    $filter: NotificationFilter
    $pagination: NotificationPaginationInput
  ) {
    getMyNotifications(filter: $filter, pagination: $pagination) {
      ...NotificationResponseFields
      notifications {
        ...NotificationBasicFields
      }
    }
  }
  ${fragments_1.NOTIFICATION_RESPONSE_FRAGMENT}
  ${fragments_1.NOTIFICATION_BASIC_FRAGMENT}
`;
// Get my notifications with full details
exports.GET_MY_NOTIFICATIONS_DETAILED = (0, client_1.gql) `
  query GetMyNotificationsDetailed(
    $filter: NotificationFilter
    $pagination: NotificationPaginationInput
  ) {
    getMyNotifications(filter: $filter, pagination: $pagination) {
      ...NotificationResponseFields
      notifications {
        ...NotificationWithRelationsFields
      }
    }
  }
  ${fragments_1.NOTIFICATION_RESPONSE_FRAGMENT}
  ${fragments_1.NOTIFICATION_WITH_RELATIONS_FRAGMENT}
`;
// Get single notification
exports.GET_NOTIFICATION = (0, client_1.gql) `
  query GetNotification($id: ID!) {
    getNotification(id: $id) {
      ...NotificationWithRelationsFields
    }
  }
  ${fragments_1.NOTIFICATION_WITH_RELATIONS_FRAGMENT}
`;
// Get notification with read status
exports.GET_NOTIFICATION_WITH_STATUS = (0, client_1.gql) `
  query GetNotificationWithStatus($id: ID!) {
    getNotificationWithStatus(id: $id) {
      ...NotificationWithRelationsFields
    }
  }
  ${fragments_1.NOTIFICATION_WITH_RELATIONS_FRAGMENT}
`;
// Get unread count
exports.GET_UNREAD_COUNT = (0, client_1.gql) `
  query GetUnreadCount {
    getUnreadCount
  }
`;
// ==================== ADMIN QUERIES ====================
// Get all notifications (admin only)
exports.GET_ALL_NOTIFICATIONS = (0, client_1.gql) `
  query GetAllNotifications(
    $filter: NotificationFilter
    $pagination: NotificationPaginationInput
  ) {
    getAllNotifications(filter: $filter, pagination: $pagination) {
      ...NotificationResponseFields
      notifications {
        ...NotificationWithRelationsFields
      }
    }
  }
  ${fragments_1.NOTIFICATION_RESPONSE_FRAGMENT}
  ${fragments_1.NOTIFICATION_WITH_RELATIONS_FRAGMENT}
`;
// Get notification statistics (admin only)
exports.GET_NOTIFICATION_STATS = (0, client_1.gql) `
  query GetNotificationStats($dateFrom: DateTime, $dateTo: DateTime) {
    getNotificationStats(dateFrom: $dateFrom, dateTo: $dateTo) {
      ...NotificationStatsFields
    }
  }
  ${fragments_1.NOTIFICATION_STATS_FRAGMENT}
`;
// Get notification read status (admin only)
exports.GET_NOTIFICATION_READ_STATUS = (0, client_1.gql) `
  query GetNotificationReadStatus($notificationId: ID!) {
    getNotificationReadStatus(notificationId: $notificationId) {
      ...NotificationReadStatusFields
      notification {
        ...NotificationBasicFields
      }
      user {
        id
        firstName
        lastName
        email
      }
      vendor {
        id
        businessName
        email
      }
      admin {
        id
        firstName
        lastName
        email
      }
    }
  }
  ${fragments_1.NOTIFICATION_READ_STATUS_FRAGMENT}
  ${fragments_1.NOTIFICATION_BASIC_FRAGMENT}
`;
// ==================== FILTERED QUERIES ====================
// Get notifications by category
exports.GET_NOTIFICATIONS_BY_CATEGORY = (0, client_1.gql) `
  query GetNotificationsByCategory(
    $category: NotificationCategory!
    $pagination: NotificationPaginationInput
  ) {
    getMyNotifications(
      filter: { category: $category }
      pagination: $pagination
    ) {
      ...NotificationResponseFields
      notifications {
        ...NotificationBasicFields
      }
    }
  }
  ${fragments_1.NOTIFICATION_RESPONSE_FRAGMENT}
  ${fragments_1.NOTIFICATION_BASIC_FRAGMENT}
`;
// Get notifications by type
exports.GET_NOTIFICATIONS_BY_TYPE = (0, client_1.gql) `
  query GetNotificationsByType(
    $notificationType: NotificationType!
    $pagination: NotificationPaginationInput
  ) {
    getMyNotifications(
      filter: { notificationType: $notificationType }
      pagination: $pagination
    ) {
      ...NotificationResponseFields
      notifications {
        ...NotificationBasicFields
      }
    }
  }
  ${fragments_1.NOTIFICATION_RESPONSE_FRAGMENT}
  ${fragments_1.NOTIFICATION_BASIC_FRAGMENT}
`;
// Get notifications by priority
exports.GET_NOTIFICATIONS_BY_PRIORITY = (0, client_1.gql) `
  query GetNotificationsByPriority(
    $priority: NotificationPriority!
    $pagination: NotificationPaginationInput
  ) {
    getMyNotifications(
      filter: { priority: $priority }
      pagination: $pagination
    ) {
      ...NotificationResponseFields
      notifications {
        ...NotificationBasicFields
      }
    }
  }
  ${fragments_1.NOTIFICATION_RESPONSE_FRAGMENT}
  ${fragments_1.NOTIFICATION_BASIC_FRAGMENT}
`;
// Get unread notifications
exports.GET_UNREAD_NOTIFICATIONS = (0, client_1.gql) `
  query GetUnreadNotifications($pagination: NotificationPaginationInput) {
    getMyNotifications(pagination: $pagination) {
      ...NotificationResponseFields
      notifications {
        ...NotificationBasicFields
      }
    }
  }
  ${fragments_1.NOTIFICATION_RESPONSE_FRAGMENT}
  ${fragments_1.NOTIFICATION_BASIC_FRAGMENT}
`;
// Get notifications by date range
exports.GET_NOTIFICATIONS_BY_DATE_RANGE = (0, client_1.gql) `
  query GetNotificationsByDateRange(
    $dateFrom: DateTime!
    $dateTo: DateTime!
    $pagination: NotificationPaginationInput
  ) {
    getMyNotifications(
      filter: { dateFrom: $dateFrom, dateTo: $dateTo }
      pagination: $pagination
    ) {
      ...NotificationResponseFields
      notifications {
        ...NotificationBasicFields
      }
    }
  }
  ${fragments_1.NOTIFICATION_RESPONSE_FRAGMENT}
  ${fragments_1.NOTIFICATION_BASIC_FRAGMENT}
`;
// ==================== SEARCH QUERIES ====================
// Search notifications
exports.SEARCH_NOTIFICATIONS = (0, client_1.gql) `
  query SearchNotifications(
    $search: String!
    $pagination: NotificationPaginationInput
  ) {
    getMyNotifications(
      filter: { search: $search }
      pagination: $pagination
    ) {
      ...NotificationResponseFields
      notifications {
        ...NotificationBasicFields
      }
    }
  }
  ${fragments_1.NOTIFICATION_RESPONSE_FRAGMENT}
  ${fragments_1.NOTIFICATION_BASIC_FRAGMENT}
`;
// Search all notifications (admin only)
exports.SEARCH_ALL_NOTIFICATIONS = (0, client_1.gql) `
  query SearchAllNotifications(
    $search: String!
    $pagination: NotificationPaginationInput
  ) {
    getAllNotifications(
      filter: { search: $search }
      pagination: $pagination
    ) {
      ...NotificationResponseFields
      notifications {
        ...NotificationWithRelationsFields
      }
    }
  }
  ${fragments_1.NOTIFICATION_RESPONSE_FRAGMENT}
  ${fragments_1.NOTIFICATION_WITH_RELATIONS_FRAGMENT}
`;
// ==================== ADMIN ANALYTICS QUERIES ====================
// Get notification stats by category (admin only)
exports.GET_NOTIFICATION_STATS_BY_CATEGORY = (0, client_1.gql) `
  query GetNotificationStatsByCategory(
    $category: NotificationCategory!
    $dateFrom: DateTime
    $dateTo: DateTime
  ) {
    getAllNotifications(
      filter: { category: $category, dateFrom: $dateFrom, dateTo: $dateTo }
    ) {
      total
      notifications {
        id
        title
        createdAt
        totalRecipients
        successfulSends
        failedSends
      }
    }
  }
`;
// Get notification performance metrics (admin only)
exports.GET_NOTIFICATION_PERFORMANCE = (0, client_1.gql) `
  query GetNotificationPerformance($dateFrom: DateTime, $dateTo: DateTime) {
    getNotificationStats(dateFrom: $dateFrom, dateTo: $dateTo) {
      ...NotificationStatsFields
    }
    getAllNotifications(
      filter: { dateFrom: $dateFrom, dateTo: $dateTo }
      pagination: { limit: 100, sortBy: "successfulSends", sortOrder: DESC }
    ) {
      notifications {
        id
        title
        notificationType
        category
        totalRecipients
        successfulSends
        failedSends
        createdAt
      }
    }
  }
  ${fragments_1.NOTIFICATION_STATS_FRAGMENT}
`;
// Get notification delivery reports (admin only)
exports.GET_NOTIFICATION_DELIVERY_REPORTS = (0, client_1.gql) `
  query GetNotificationDeliveryReports(
    $dateFrom: DateTime!
    $dateTo: DateTime!
    $pagination: NotificationPaginationInput
  ) {
    getAllNotifications(
      filter: { dateFrom: $dateFrom, dateTo: $dateTo }
      pagination: $pagination
    ) {
      ...NotificationResponseFields
      notifications {
        id
        title
        notificationType
        category
        priority
        totalRecipients
        successfulSends
        failedSends
        sentAt
        createdAt
        creator {
          id
          firstName
          lastName
        }
      }
    }
  }
  ${fragments_1.NOTIFICATION_RESPONSE_FRAGMENT}
`;
