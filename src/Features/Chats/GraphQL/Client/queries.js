"use strict";
// Chat GraphQL Queries for Client-side Implementation
// Note: Replace 'gql' import with your preferred GraphQL client (Apollo Client, urql, etc.)
// import { gql } from '@apollo/client'; // For Apollo Client
// import { gql } from 'urql'; // For urql
// import { gql } from 'graphql-tag'; // For standalone usage
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET_FLAGGED_MESSAGES = exports.GET_PENDING_INQUIRIES = exports.GET_RECENT_CHATS = exports.GET_CHAT_BY_ID = exports.GET_CONVERSATION = exports.SEARCH_CHATS = exports.GENERATE_CHAT_REPORT = exports.GET_CHAT_STATISTICS = exports.GET_ALL_AD_INQUIRIES_ADMIN = exports.GET_ALL_SERVICE_INQUIRIES_ADMIN = exports.GET_ALL_CHATS_ADMIN = exports.GET_VENDOR_AD_INQUIRIES = exports.GET_VENDOR_SERVICE_INQUIRIES = exports.GET_VENDOR_CHATS = exports.GET_UNREAD_MESSAGE_COUNT = exports.GET_USER_AD_INQUIRIES = exports.GET_USER_SERVICE_INQUIRIES = exports.GET_USER_CHATS = void 0;
const gql = (template, ...values) => {
    return template.reduce((acc, str, i) => acc + str + (values[i] || ''), '');
};
// ===================== USER QUERIES =====================
exports.GET_USER_CHATS = gql `
  query GetUserChats {
    getUserChats {
      id
      bookingId
      senderId
      receiverId
      message
      messageType
      parentMessageId
      attachmentUrl
      serviceType
      venueId
      farmhouseId
      cateringPackageId
      photographyPackageId
      serviceAdId
      status
      sentAt
      deliveredAt
      readAt
      deletedAt
    }
  }
`;
exports.GET_USER_SERVICE_INQUIRIES = gql `
  query GetUserServiceInquiries {
    getUserServiceInquiries {
      id
      chatId
      userId
      vendorId
      serviceType
      serviceId
      inquiryText
      status
      convertedToBookingId
      createdAt
      updatedAt
      closedAt
    }
  }
`;
exports.GET_USER_AD_INQUIRIES = gql `
  query GetUserAdInquiries {
    getUserAdInquiries {
      id
      chatId
      userId
      vendorId
      adId
      inquiryText
      status
      convertedToBookingId
      createdAt
      updatedAt
      closedAt
    }
  }
`;
exports.GET_UNREAD_MESSAGE_COUNT = gql `
  query GetUnreadMessageCount {
    getUnreadMessageCount
  }
`;
// ===================== VENDOR QUERIES =====================
exports.GET_VENDOR_CHATS = gql `
  query GetVendorChats {
    getVendorChats {
      id
      bookingId
      senderId
      receiverId
      message
      messageType
      parentMessageId
      attachmentUrl
      serviceType
      venueId
      farmhouseId
      cateringPackageId
      photographyPackageId
      serviceAdId
      status
      sentAt
      deliveredAt
      readAt
      deletedAt
    }
  }
`;
exports.GET_VENDOR_SERVICE_INQUIRIES = gql `
  query GetVendorServiceInquiries {
    getVendorServiceInquiries {
      id
      chatId
      userId
      vendorId
      serviceType
      serviceId
      inquiryText
      status
      convertedToBookingId
      createdAt
      updatedAt
      closedAt
    }
  }
`;
exports.GET_VENDOR_AD_INQUIRIES = gql `
  query GetVendorAdInquiries {
    getVendorAdInquiries {
      id
      chatId
      userId
      vendorId
      adId
      inquiryText
      status
      convertedToBookingId
      createdAt
      updatedAt
      closedAt
    }
  }
`;
// ===================== ADMIN QUERIES =====================
exports.GET_ALL_CHATS_ADMIN = gql `
  query GetAllChatsAdmin($filter: ChatFilterInput, $pagination: PaginationInput) {
    getAllChats(filter: $filter, pagination: $pagination) {
      id
      bookingId
      senderId
      receiverId
      message
      messageType
      parentMessageId
      attachmentUrl
      serviceType
      venueId
      farmhouseId
      cateringPackageId
      photographyPackageId
      serviceAdId
      status
      sentAt
      deliveredAt
      readAt
      deletedAt
      senderName
      senderType
      receiverName
      receiverType
    }
  }
`;
exports.GET_ALL_SERVICE_INQUIRIES_ADMIN = gql `
  query GetAllServiceInquiriesAdmin($filter: ServiceInquiryFilterInput, $pagination: PaginationInput) {
    getAllServiceInquiries(filter: $filter, pagination: $pagination) {
      id
      chatId
      userId
      vendorId
      serviceType
      serviceId
      inquiryText
      status
      convertedToBookingId
      createdAt
      updatedAt
      closedAt
      userName
      userEmail
      vendorName
      vendorEmail
    }
  }
`;
exports.GET_ALL_AD_INQUIRIES_ADMIN = gql `
  query GetAllAdInquiriesAdmin($filter: AdInquiryFilterInput, $pagination: PaginationInput) {
    getAllAdInquiries(filter: $filter, pagination: $pagination) {
      id
      chatId
      userId
      vendorId
      adId
      inquiryText
      status
      convertedToBookingId
      createdAt
      updatedAt
      closedAt
      userName
      userEmail
      vendorName
      vendorEmail
    }
  }
`;
exports.GET_CHAT_STATISTICS = gql `
  query GetChatStatistics($dateFrom: String, $dateTo: String) {
    getChatStatistics(dateFrom: $dateFrom, dateTo: $dateTo) {
      totalMessages
      totalByType
      totalByStatus
      dailyMessageCount {
        date
        count
      }
    }
  }
`;
exports.GENERATE_CHAT_REPORT = gql `
  query GenerateChatReport($dateFrom: String!, $dateTo: String!) {
    generateChatReport(dateFrom: $dateFrom, dateTo: $dateTo) {
      period {
        from
        to
      }
      chatStatistics {
        totalMessages
        totalByType
        totalByStatus
        dailyMessageCount {
          date
          count
        }
      }
      inquiries {
        service {
          total
          byStatus
          byServiceType
        }
        advertisement {
          total
          byStatus
        }
      }
      generatedAt
    }
  }
`;
exports.SEARCH_CHATS = gql `
  query SearchChats($searchTerm: String!, $limit: Int) {
    searchChats(searchTerm: $searchTerm, limit: $limit) {
      id
      senderId
      receiverId
      message
      messageType
      status
      sentAt
      senderName
      senderType
      receiverName
      receiverType
    }
  }
`;
exports.GET_CONVERSATION = gql `
  query GetConversation($userId1: ID!, $userId2: ID!, $limit: Int) {
    getConversation(userId1: $userId1, userId2: $userId2, limit: $limit) {
      id
      senderId
      receiverId
      message
      messageType
      parentMessageId
      attachmentUrl
      status
      sentAt
      deliveredAt
      readAt
    }
  }
`;
exports.GET_CHAT_BY_ID = gql `
  query GetChatById($chatId: ID!) {
    getChatById(chatId: $chatId) {
      id
      bookingId
      senderId
      receiverId
      message
      messageType
      parentMessageId
      attachmentUrl
      serviceType
      venueId
      farmhouseId
      cateringPackageId
      photographyPackageId
      serviceAdId
      status
      sentAt
      deliveredAt
      readAt
      deletedAt
      senderName
      senderType
      receiverName
      receiverType
    }
  }
`;
exports.GET_RECENT_CHATS = gql `
  query GetRecentChats($limit: Int) {
    getRecentChats(limit: $limit) {
      id
      senderId
      receiverId
      message
      messageType
      status
      sentAt
      senderName
      senderType
      receiverName
      receiverType
    }
  }
`;
exports.GET_PENDING_INQUIRIES = gql `
  query GetPendingInquiries {
    getPendingInquiries {
      id
      chatId
      userId
      vendorId
      serviceType
      serviceId
      inquiryText
      status
      createdAt
      userName
      userEmail
      vendorName
      vendorEmail
    }
  }
`;
exports.GET_FLAGGED_MESSAGES = gql `
  query GetFlaggedMessages {
    getFlaggedMessages {
      id
      senderId
      receiverId
      message
      messageType
      status
      sentAt
      senderName
      senderType
      receiverName
      receiverType
    }
  }
`;
