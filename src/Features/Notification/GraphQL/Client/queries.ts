import { gql } from '@apollo/client';
import {
  NOTIFICATION_BASIC_FRAGMENT,
  NOTIFICATION_FULL_FRAGMENT,
  NOTIFICATION_WITH_RELATIONS_FRAGMENT,
  NOTIFICATION_READ_STATUS_FRAGMENT,
  NOTIFICATION_STATS_FRAGMENT,
  NOTIFICATION_RESPONSE_FRAGMENT
} from './fragments';

// ==================== USER/VENDOR QUERIES ====================

// Get my notifications (for authenticated users/vendors)
export const GET_MY_NOTIFICATIONS = gql`
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
  ${NOTIFICATION_RESPONSE_FRAGMENT}
  ${NOTIFICATION_BASIC_FRAGMENT}
`;

// Get my notifications with full details
export const GET_MY_NOTIFICATIONS_DETAILED = gql`
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
  ${NOTIFICATION_RESPONSE_FRAGMENT}
  ${NOTIFICATION_WITH_RELATIONS_FRAGMENT}
`;

// Get single notification
export const GET_NOTIFICATION = gql`
  query GetNotification($id: ID!) {
    getNotification(id: $id) {
      ...NotificationWithRelationsFields
    }
  }
  ${NOTIFICATION_WITH_RELATIONS_FRAGMENT}
`;

// Get notification with read status
export const GET_NOTIFICATION_WITH_STATUS = gql`
  query GetNotificationWithStatus($id: ID!) {
    getNotificationWithStatus(id: $id) {
      ...NotificationWithRelationsFields
    }
  }
  ${NOTIFICATION_WITH_RELATIONS_FRAGMENT}
`;

// Get unread count
export const GET_UNREAD_COUNT = gql`
  query GetUnreadCount {
    getUnreadCount
  }
`;

// ==================== ADMIN QUERIES ====================

// Get all notifications (admin only)
export const GET_ALL_NOTIFICATIONS = gql`
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
  ${NOTIFICATION_RESPONSE_FRAGMENT}
  ${NOTIFICATION_WITH_RELATIONS_FRAGMENT}
`;

// Get notification statistics (admin only)
export const GET_NOTIFICATION_STATS = gql`
  query GetNotificationStats($dateFrom: DateTime, $dateTo: DateTime) {
    getNotificationStats(dateFrom: $dateFrom, dateTo: $dateTo) {
      ...NotificationStatsFields
    }
  }
  ${NOTIFICATION_STATS_FRAGMENT}
`;

// Get notification read status (admin only)
export const GET_NOTIFICATION_READ_STATUS = gql`
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
  ${NOTIFICATION_READ_STATUS_FRAGMENT}
  ${NOTIFICATION_BASIC_FRAGMENT}
`;

// ==================== FILTERED QUERIES ====================

// Get notifications by category
export const GET_NOTIFICATIONS_BY_CATEGORY = gql`
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
  ${NOTIFICATION_RESPONSE_FRAGMENT}
  ${NOTIFICATION_BASIC_FRAGMENT}
`;

// Get notifications by type
export const GET_NOTIFICATIONS_BY_TYPE = gql`
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
  ${NOTIFICATION_RESPONSE_FRAGMENT}
  ${NOTIFICATION_BASIC_FRAGMENT}
`;

// Get notifications by priority
export const GET_NOTIFICATIONS_BY_PRIORITY = gql`
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
  ${NOTIFICATION_RESPONSE_FRAGMENT}
  ${NOTIFICATION_BASIC_FRAGMENT}
`;

// Get unread notifications
export const GET_UNREAD_NOTIFICATIONS = gql`
  query GetUnreadNotifications($pagination: NotificationPaginationInput) {
    getMyNotifications(pagination: $pagination) {
      ...NotificationResponseFields
      notifications {
        ...NotificationBasicFields
      }
    }
  }
  ${NOTIFICATION_RESPONSE_FRAGMENT}
  ${NOTIFICATION_BASIC_FRAGMENT}
`;

// Get notifications by date range
export const GET_NOTIFICATIONS_BY_DATE_RANGE = gql`
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
  ${NOTIFICATION_RESPONSE_FRAGMENT}
  ${NOTIFICATION_BASIC_FRAGMENT}
`;

// ==================== SEARCH QUERIES ====================

// Search notifications
export const SEARCH_NOTIFICATIONS = gql`
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
  ${NOTIFICATION_RESPONSE_FRAGMENT}
  ${NOTIFICATION_BASIC_FRAGMENT}
`;

// Search all notifications (admin only)
export const SEARCH_ALL_NOTIFICATIONS = gql`
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
  ${NOTIFICATION_RESPONSE_FRAGMENT}
  ${NOTIFICATION_WITH_RELATIONS_FRAGMENT}
`;

// ==================== ADMIN ANALYTICS QUERIES ====================

// Get notification stats by category (admin only)
export const GET_NOTIFICATION_STATS_BY_CATEGORY = gql`
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
export const GET_NOTIFICATION_PERFORMANCE = gql`
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
  ${NOTIFICATION_STATS_FRAGMENT}
`;

// Get notification delivery reports (admin only)
export const GET_NOTIFICATION_DELIVERY_REPORTS = gql`
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
  ${NOTIFICATION_RESPONSE_FRAGMENT}
`;
