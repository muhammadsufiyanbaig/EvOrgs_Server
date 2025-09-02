// Chat GraphQL Queries for Client-side Implementation
// Note: Replace 'gql' import with your preferred GraphQL client (Apollo Client, urql, etc.)
// import { gql } from '@apollo/client'; // For Apollo Client
// import { gql } from 'urql'; // For urql
// import { gql } from 'graphql-tag'; // For standalone usage

const gql = (template: TemplateStringsArray, ...values: any[]) => {
  return template.reduce((acc, str, i) => acc + str + (values[i] || ''), '');
};

// ===================== USER QUERIES =====================

export const GET_USER_CHATS = gql`
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

export const GET_USER_SERVICE_INQUIRIES = gql`
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

export const GET_USER_AD_INQUIRIES = gql`
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

export const GET_UNREAD_MESSAGE_COUNT = gql`
  query GetUnreadMessageCount {
    getUnreadMessageCount
  }
`;

// ===================== VENDOR QUERIES =====================

export const GET_VENDOR_CHATS = gql`
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

export const GET_VENDOR_SERVICE_INQUIRIES = gql`
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

export const GET_VENDOR_AD_INQUIRIES = gql`
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

export const GET_ALL_CHATS_ADMIN = gql`
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

export const GET_ALL_SERVICE_INQUIRIES_ADMIN = gql`
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

export const GET_ALL_AD_INQUIRIES_ADMIN = gql`
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

export const GET_CHAT_STATISTICS = gql`
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

export const GENERATE_CHAT_REPORT = gql`
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

export const SEARCH_CHATS = gql`
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

export const GET_CONVERSATION = gql`
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

export const GET_CHAT_BY_ID = gql`
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

export const GET_RECENT_CHATS = gql`
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

export const GET_PENDING_INQUIRIES = gql`
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

export const GET_FLAGGED_MESSAGES = gql`
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
