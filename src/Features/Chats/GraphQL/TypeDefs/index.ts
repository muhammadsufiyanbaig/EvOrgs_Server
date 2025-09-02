import { gql } from 'apollo-server-express';

export const chatTypeDefs = gql`
  # Enum for Chat status
  enum ChatStatus {
    Sent
    Delivered
    Read
    Deleted
  }

  # Enum for ServiceInquiry status
  enum ServiceInquiryStatus {
    Open
    Answered
    Converted
    Closed
  }

  # Enum for AdInquiry status
  enum AdInquiryStatus {
    Open
    Answered
    Converted
    Closed
  }

  # Enum for message type in Chat
  enum MessageType {
    Text
    Image
    Video
    File
    Location
  }

  # Enum for service type in ServiceInquiry
  enum ServiceType {
    Venue
    Farmhouse
    CateringPackage
    PhotographyPackage
  }

  # Input types for filtering
  input ChatFilterInput {
    status: ChatStatus
    messageType: MessageType
    dateFrom: String
    dateTo: String
    senderId: ID
    receiverId: ID
    serviceType: ServiceType
  }

  input ServiceInquiryFilterInput {
    status: ServiceInquiryStatus
    serviceType: ServiceType
    dateFrom: String
    dateTo: String
    userId: ID
    vendorId: ID
  }

  input AdInquiryFilterInput {
    status: AdInquiryStatus
    dateFrom: String
    dateTo: String
    userId: ID
    vendorId: ID
  }

  input PaginationInput {
    limit: Int = 20
    offset: Int = 0
  }

  # Enhanced Chat type with additional fields
  type Chat {
    id: ID!
    bookingId: ID
    senderId: ID!
    receiverId: ID!
    message: String!
    messageType: MessageType!
    parentMessageId: ID
    attachmentUrl: String
    serviceType: ServiceType
    venueId: ID
    farmhouseId: ID
    cateringPackageId: ID
    photographyPackageId: ID
    serviceAdId: ID
    status: ChatStatus!
    sentAt: String!
    deliveredAt: String
    readAt: String
    deletedAt: String
    # Additional fields for admin view
    senderName: String
    senderType: String
    receiverName: String
    receiverType: String
  }

  type ServiceInquiry {
    id: ID!
    chatId: ID!
    userId: ID!
    vendorId: ID!
    serviceType: ServiceType!
    serviceId: ID!
    inquiryText: String!
    status: ServiceInquiryStatus!
    convertedToBookingId: ID
    createdAt: String!
    updatedAt: String!
    closedAt: String
    # Additional fields for admin view
    userName: String
    userEmail: String
    vendorName: String
    vendorEmail: String
  }

  type AdInquiry {
    id: ID!
    chatId: ID!
    userId: ID!
    vendorId: ID!
    adId: ID!
    inquiryText: String!
    status: AdInquiryStatus!
    convertedToBookingId: ID
    createdAt: String!
    updatedAt: String!
    closedAt: String
    # Additional fields for admin view
    userName: String
    userEmail: String
    vendorName: String
    vendorEmail: String
  }

  # Statistics and Analytics Types
  type ChatStatistics {
    totalMessages: Int!
    totalByType: JSON!
    totalByStatus: JSON!
    dailyMessageCount: [DailyCount!]!
  }

  type DailyCount {
    date: String!
    count: Int!
  }

  type ChatReport {
    period: DateRange!
    chatStatistics: ChatStatistics!
    inquiries: InquiryStats!
    generatedAt: String!
  }

  type DateRange {
    from: String!
    to: String!
  }

  type InquiryStats {
    service: ServiceInquiryStats!
    advertisement: AdInquiryStats!
  }

  type ServiceInquiryStats {
    total: Int!
    byStatus: JSON!
    byServiceType: JSON!
  }

  type AdInquiryStats {
    total: Int!
    byStatus: JSON!
  }

  # Response types for admin actions
  type AdminActionResponse {
    success: Boolean!
    message: String!
    data: JSON
  }

  # Bulk operation response
  type BulkOperationResponse {
    success: Boolean!
    affectedCount: Int!
    message: String!
    errors: [String!]
  }

  type Query {
    # User-specific queries (requires authenticated user, not vendor)
    getUserChats: [Chat!]!
    getUserServiceInquiries: [ServiceInquiry!]!
    getUserAdInquiries: [AdInquiry!]!
    getUnreadMessageCount: Int!

    # Vendor-specific queries (requires authenticated vendor, not user)
    getVendorChats: [Chat!]!
    getVendorServiceInquiries: [ServiceInquiry!]!
    getVendorAdInquiries: [AdInquiry!]!

    # Admin-specific queries (admin access required)
    getAllChats(filter: ChatFilterInput, pagination: PaginationInput): [Chat!]!
    getAllServiceInquiries(filter: ServiceInquiryFilterInput, pagination: PaginationInput): [ServiceInquiry!]!
    getAllAdInquiries(filter: AdInquiryFilterInput, pagination: PaginationInput): [AdInquiry!]!
    
    # Admin analytics and reporting
    getChatStatistics(dateFrom: String, dateTo: String): ChatStatistics!
    generateChatReport(dateFrom: String!, dateTo: String!): ChatReport!
    
    # Admin search and monitoring
    searchChats(searchTerm: String!, limit: Int = 20): [Chat!]!
    getConversation(userId1: ID!, userId2: ID!, limit: Int = 50): [Chat!]!
    getChatById(chatId: ID!): Chat
    
    # Admin dashboard queries
    getRecentChats(limit: Int = 10): [Chat!]!
    getPendingInquiries: [ServiceInquiry!]!
    getFlaggedMessages: [Chat!]!
  }

  type Mutation {
    # User/Vendor mutations
    updateMessageStatus(chatId: ID!, status: ChatStatus!): Chat!
    markConversationAsRead(otherUserId: ID!): AdminActionResponse!

    # Admin-specific mutations
    deleteChat(chatId: ID!): AdminActionResponse!
    bulkDeleteChats(chatIds: [ID!]!): BulkOperationResponse!
    
    # Inquiry management
    updateServiceInquiryStatus(inquiryId: ID!, status: ServiceInquiryStatus!): ServiceInquiry!
    updateAdInquiryStatus(inquiryId: ID!, status: AdInquiryStatus!): AdInquiry!
    bulkUpdateInquiryStatus(inquiryIds: [ID!]!, status: String!, type: String!): BulkOperationResponse!
    
    # Content moderation
    flagMessage(chatId: ID!, reason: String!): AdminActionResponse!
    escalateConversation(userId1: ID!, userId2: ID!, priority: String!): AdminActionResponse!
    
    # Admin message management
    sendAdminMessage(receiverId: ID!, message: String!, messageType: MessageType = Text): Chat!
    broadcastMessage(userIds: [ID!]!, message: String!, messageType: MessageType = Text): BulkOperationResponse!
  }

  # Subscriptions for real-time updates
  type Subscription {
    messageReceived(userId: ID!): Chat!
    messageStatusUpdated(chatId: ID!): Chat!
    inquiryStatusUpdated(inquiryId: ID!): ServiceInquiry!
    adminNotification: AdminActionResponse!
  }

  # JSON scalar type for flexible data
  scalar JSON
`;