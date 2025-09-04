"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationTypeDefs = void 0;
const apollo_server_express_1 = require("apollo-server-express");
exports.notificationTypeDefs = (0, apollo_server_express_1.gql) `
  enum NotificationType {
    General
    All_Vendors
    Vendor_Personal
    All_Users
    User_Personal
  }

  enum NotificationCategory {
    Booking
    Payment
    System
    Chat
    Promotion
    General
  }

  enum NotificationPriority {
    low
    medium
    high
    urgent
  }

  enum RelatedType {
    Booking
    Payment
    Chat
    Review
    User
    Vendor
  }

  enum SortOrder {
    ASC
    DESC
  }

  type Notification {
    id: ID!
    notificationType: NotificationType!
    targetUserId: ID
    targetVendorId: ID
    title: String!
    message: String!
    category: NotificationCategory!
    data: JSON
    linkTo: String
    relatedId: ID
    relatedType: RelatedType
    priority: NotificationPriority!
    isActive: Boolean!
    scheduledAt: DateTime
    sentAt: DateTime
    totalRecipients: Int!
    successfulSends: Int!
    failedSends: Int!
    createdBy: ID
    createdAt: DateTime!
    updatedAt: DateTime!
    isRead: Boolean
    readAt: DateTime
    targetUser: User
    targetVendor: Vendor
    creator: Admin
  }

  type NotificationReadStatus {
    id: ID!
    notificationId: ID!
    userId: ID
    vendorId: ID
    adminId: ID
    readAt: DateTime!
    notification: Notification!
    user: User
    vendor: Vendor
    admin: Admin
  }

  input CreateNotificationInput {
    notificationType: NotificationType!
    targetUserId: ID
    targetVendorId: ID
    title: String!
    message: String!
    category: NotificationCategory!
    data: JSON
    linkTo: String
    relatedId: ID
    relatedType: RelatedType
    priority: NotificationPriority = medium
    scheduledAt: DateTime
  }

  input UpdateNotificationInput {
    id: ID!
    title: String
    message: String
    category: NotificationCategory
    data: JSON
    linkTo: String
    priority: NotificationPriority
    isActive: Boolean
    scheduledAt: DateTime
  }

  input NotificationFilter {
    notificationType: NotificationType
    category: NotificationCategory
    priority: NotificationPriority
    isActive: Boolean
    createdBy: ID
    dateFrom: DateTime
    dateTo: DateTime
    search: String
  }

  input NotificationPaginationInput {
    page: Int = 1
    limit: Int = 10
    sortBy: String = "createdAt"
    sortOrder: SortOrder = DESC
  }

  type NotificationResponse {
    notifications: [Notification!]!
    total: Int!
    page: Int!
    limit: Int!
    totalPages: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }

  input FCMTokenInput {
    userId: ID
    vendorId: ID
    token: String!
  }

  type FCMResponse {
    success: Boolean!
    message: String!
    failedTokens: [String!]
    successCount: Int
    failureCount: Int
  }

  type NotificationStats {
    totalNotifications: Int!
    totalSentToday: Int!
    totalReadToday: Int!
    totalUnread: Int!
    byCategory: [CategoryStats!]!
    byType: [TypeStats!]!
  }

  type CategoryStats {
    category: NotificationCategory!
    count: Int!
  }

  type TypeStats {
    type: NotificationType!
    count: Int!
  }

  type Query {
    getMyNotifications(
      filter: NotificationFilter
      pagination: NotificationPaginationInput
    ): NotificationResponse!

    getAllNotifications(
      filter: NotificationFilter
      pagination: NotificationPaginationInput
    ): NotificationResponse!

    getNotification(id: ID!): Notification!

    getNotificationWithStatus(id: ID!): Notification!

    getUnreadCount: Int!

    getNotificationStats(
      dateFrom: DateTime
      dateTo: DateTime
    ): NotificationStats!

    getNotificationReadStatus(notificationId: ID!): [NotificationReadStatus!]!
  }

  type Mutation {
    createNotification(input: CreateNotificationInput!): Notification!

    updateNotification(input: UpdateNotificationInput!): Notification!

    deleteNotification(id: ID!): Boolean!

    sendNotification(id: ID!): FCMResponse!

    sendBulkNotifications(ids: [ID!]!): FCMResponse!

    markAsRead(notificationId: ID!): Boolean!

    markMultipleAsRead(notificationIds: [ID!]!): Boolean!

    markAllAsRead: Boolean!

    updateFCMToken(input: FCMTokenInput!): Boolean!

    removeFCMToken(token: String!): Boolean!

    sendTestNotification(
      title: String!
      message: String!
        targetUserId: ID
        targetVendorId: ID
    ): FCMResponse!

    scheduleNotification(input: CreateNotificationInput!): Notification!

    cancelScheduledNotification(id: ID!): Boolean!
  }

  type Subscription {
    notificationReceived: Notification!

    notificationRead(notificationId: ID!): NotificationReadStatus!

    notificationStatsUpdated: NotificationStats!
  }

  scalar DateTime
  scalar JSON
`;
exports.default = exports.notificationTypeDefs;
