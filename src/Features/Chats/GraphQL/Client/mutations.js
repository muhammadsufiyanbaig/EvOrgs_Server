"use strict";
// Chat GraphQL Mutations for Client-side Implementation
// Note: Replace 'gql' import with your preferred GraphQL client (Apollo Client, urql, etc.)
Object.defineProperty(exports, "__esModule", { value: true });
exports.ADMIN_CLOSE_ALL_PENDING_INQUIRIES = exports.BULK_ESCALATE_CONVERSATIONS = exports.BULK_FLAG_MESSAGES = exports.ADMIN_NOTIFICATION_SUBSCRIPTION = exports.INQUIRY_STATUS_UPDATED_SUBSCRIPTION = exports.MESSAGE_STATUS_UPDATED_SUBSCRIPTION = exports.MESSAGE_RECEIVED_SUBSCRIPTION = exports.BROADCAST_MESSAGE = exports.SEND_ADMIN_MESSAGE = exports.ESCALATE_CONVERSATION = exports.FLAG_MESSAGE = exports.BULK_UPDATE_INQUIRY_STATUS = exports.UPDATE_AD_INQUIRY_STATUS = exports.UPDATE_SERVICE_INQUIRY_STATUS = exports.BULK_DELETE_CHATS = exports.DELETE_CHAT = exports.MARK_CONVERSATION_AS_READ = exports.UPDATE_MESSAGE_STATUS = void 0;
const gql = (template, ...values) => {
    return template.reduce((acc, str, i) => acc + str + (values[i] || ''), '');
};
// ===================== USER/VENDOR MUTATIONS =====================
exports.UPDATE_MESSAGE_STATUS = gql `
  mutation UpdateMessageStatus($chatId: ID!, $status: ChatStatus!) {
    updateMessageStatus(chatId: $chatId, status: $status) {
      id
      status
      deliveredAt
      readAt
      deletedAt
    }
  }
`;
exports.MARK_CONVERSATION_AS_READ = gql `
  mutation MarkConversationAsRead($otherUserId: ID!) {
    markConversationAsRead(otherUserId: $otherUserId) {
      success
      message
      data
    }
  }
`;
// ===================== ADMIN MUTATIONS =====================
exports.DELETE_CHAT = gql `
  mutation DeleteChat($chatId: ID!) {
    deleteChat(chatId: $chatId) {
      success
      message
      data
    }
  }
`;
exports.BULK_DELETE_CHATS = gql `
  mutation BulkDeleteChats($chatIds: [ID!]!) {
    bulkDeleteChats(chatIds: $chatIds) {
      success
      affectedCount
      message
      errors
    }
  }
`;
exports.UPDATE_SERVICE_INQUIRY_STATUS = gql `
  mutation UpdateServiceInquiryStatus($inquiryId: ID!, $status: ServiceInquiryStatus!) {
    updateServiceInquiryStatus(inquiryId: $inquiryId, status: $status) {
      id
      status
      updatedAt
      closedAt
    }
  }
`;
exports.UPDATE_AD_INQUIRY_STATUS = gql `
  mutation UpdateAdInquiryStatus($inquiryId: ID!, $status: AdInquiryStatus!) {
    updateAdInquiryStatus(inquiryId: $inquiryId, status: $status) {
      id
      status
      updatedAt
      closedAt
    }
  }
`;
exports.BULK_UPDATE_INQUIRY_STATUS = gql `
  mutation BulkUpdateInquiryStatus($inquiryIds: [ID!]!, $status: String!, $type: String!) {
    bulkUpdateInquiryStatus(inquiryIds: $inquiryIds, status: $status, type: $type) {
      success
      affectedCount
      message
      errors
    }
  }
`;
exports.FLAG_MESSAGE = gql `
  mutation FlagMessage($chatId: ID!, $reason: String!) {
    flagMessage(chatId: $chatId, reason: $reason) {
      success
      message
      data
    }
  }
`;
exports.ESCALATE_CONVERSATION = gql `
  mutation EscalateConversation($userId1: ID!, $userId2: ID!, $priority: String!) {
    escalateConversation(userId1: $userId1, userId2: $userId2, priority: $priority) {
      success
      message
      data
    }
  }
`;
exports.SEND_ADMIN_MESSAGE = gql `
  mutation SendAdminMessage($receiverId: ID!, $message: String!, $messageType: MessageType = Text) {
    sendAdminMessage(receiverId: $receiverId, message: $message, messageType: $messageType) {
      id
      senderId
      receiverId
      message
      messageType
      status
      sentAt
    }
  }
`;
exports.BROADCAST_MESSAGE = gql `
  mutation BroadcastMessage($userIds: [ID!]!, $message: String!, $messageType: MessageType = Text) {
    broadcastMessage(userIds: $userIds, message: $message, messageType: $messageType) {
      success
      affectedCount
      message
      errors
    }
  }
`;
// ===================== SUBSCRIPTION MUTATIONS (for real-time) =====================
exports.MESSAGE_RECEIVED_SUBSCRIPTION = gql `
  subscription MessageReceived($userId: ID!) {
    messageReceived(userId: $userId) {
      id
      senderId
      receiverId
      message
      messageType
      parentMessageId
      attachmentUrl
      status
      sentAt
      senderName
      senderType
    }
  }
`;
exports.MESSAGE_STATUS_UPDATED_SUBSCRIPTION = gql `
  subscription MessageStatusUpdated($chatId: ID!) {
    messageStatusUpdated(chatId: $chatId) {
      id
      status
      deliveredAt
      readAt
      deletedAt
    }
  }
`;
exports.INQUIRY_STATUS_UPDATED_SUBSCRIPTION = gql `
  subscription InquiryStatusUpdated($inquiryId: ID!) {
    inquiryStatusUpdated(inquiryId: $inquiryId) {
      id
      status
      updatedAt
      closedAt
    }
  }
`;
exports.ADMIN_NOTIFICATION_SUBSCRIPTION = gql `
  subscription AdminNotification {
    adminNotification {
      success
      message
      data
    }
  }
`;
// ===================== COMPLEX MUTATIONS FOR BULK OPERATIONS =====================
exports.BULK_FLAG_MESSAGES = gql `
  mutation BulkFlagMessages($chatIds: [ID!]!, $reason: String!) {
    bulkFlagMessages(chatIds: $chatIds, reason: $reason) {
      success
      affectedCount
      message
      errors
    }
  }
`;
exports.BULK_ESCALATE_CONVERSATIONS = gql `
  mutation BulkEscalateConversations($conversationPairs: [ConversationPairInput!]!, $priority: String!) {
    bulkEscalateConversations(conversationPairs: $conversationPairs, priority: $priority) {
      success
      affectedCount
      message
      errors
    }
  }
`;
exports.ADMIN_CLOSE_ALL_PENDING_INQUIRIES = gql `
  mutation AdminCloseAllPendingInquiries($type: String!, $reason: String!) {
    adminCloseAllPendingInquiries(type: $type, reason: $reason) {
      success
      affectedCount
      message
      errors
    }
  }
`;
// ===================== VARIABLES AND TYPES FOR MUTATIONS =====================
// Example usage with variables for UpdateMessageStatus:
/*
const UPDATE_MESSAGE_STATUS_VARIABLES = {
  chatId: "chat-uuid-here",
  status: "Read" as ChatStatus
};
*/
// Example usage with variables for BulkDeleteChats:
/*
const BULK_DELETE_CHATS_VARIABLES = {
  chatIds: ["chat-1", "chat-2", "chat-3"]
};
*/
// Example usage with variables for BroadcastMessage:
/*
const BROADCAST_MESSAGE_VARIABLES = {
  userIds: ["user-1", "user-2", "user-3"],
  message: "System maintenance will begin in 30 minutes",
  messageType: "Text" as MessageType
};
*/
// Example usage with variables for filtering:
/*
const CHAT_FILTER_VARIABLES = {
  filter: {
    status: "Read",
    messageType: "Text",
    dateFrom: "2024-01-01T00:00:00.000Z",
    dateTo: "2024-12-31T23:59:59.999Z"
  },
  pagination: {
    limit: 20,
    offset: 0
  }
};
*/
