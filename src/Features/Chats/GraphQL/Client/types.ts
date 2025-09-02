// TypeScript Types for Chat GraphQL Client-side Implementation

// ===================== ENUM TYPES =====================

export enum ChatStatus {
  Sent = 'Sent',
  Delivered = 'Delivered',
  Read = 'Read',
  Deleted = 'Deleted'
}

export enum ServiceInquiryStatus {
  Open = 'Open',
  Answered = 'Answered',
  Converted = 'Converted',
  Closed = 'Closed'
}

export enum AdInquiryStatus {
  Open = 'Open',
  Answered = 'Answered',
  Converted = 'Converted',
  Closed = 'Closed'
}

export enum MessageType {
  Text = 'Text',
  Image = 'Image',
  Video = 'Video',
  File = 'File',
  Location = 'Location'
}

export enum ServiceType {
  Venue = 'Venue',
  Farmhouse = 'Farmhouse',
  CateringPackage = 'CateringPackage',
  PhotographyPackage = 'PhotographyPackage'
}

// ===================== INPUT TYPES =====================

export interface ChatFilterInput {
  status?: ChatStatus;
  messageType?: MessageType;
  dateFrom?: string;
  dateTo?: string;
  senderId?: string;
  receiverId?: string;
  serviceType?: ServiceType;
}

export interface ServiceInquiryFilterInput {
  status?: ServiceInquiryStatus;
  serviceType?: ServiceType;
  dateFrom?: string;
  dateTo?: string;
  userId?: string;
  vendorId?: string;
}

export interface AdInquiryFilterInput {
  status?: AdInquiryStatus;
  dateFrom?: string;
  dateTo?: string;
  userId?: string;
  vendorId?: string;
}

export interface PaginationInput {
  limit?: number;
  offset?: number;
}

export interface ConversationPairInput {
  userId1: string;
  userId2: string;
}

// ===================== MAIN TYPES =====================

export interface Chat {
  id: string;
  bookingId?: string;
  senderId: string;
  receiverId: string;
  message: string;
  messageType: MessageType;
  parentMessageId?: string;
  attachmentUrl?: string;
  serviceType?: ServiceType;
  venueId?: string;
  farmhouseId?: string;
  cateringPackageId?: string;
  photographyPackageId?: string;
  serviceAdId?: string;
  status: ChatStatus;
  sentAt: string;
  deliveredAt?: string;
  readAt?: string;
  deletedAt?: string;
  // Additional fields for admin view
  senderName?: string;
  senderType?: string;
  receiverName?: string;
  receiverType?: string;
}

export interface ServiceInquiry {
  id: string;
  chatId: string;
  userId: string;
  vendorId: string;
  serviceType: ServiceType;
  serviceId: string;
  inquiryText: string;
  status: ServiceInquiryStatus;
  convertedToBookingId?: string;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
  // Additional fields for admin view
  userName?: string;
  userEmail?: string;
  vendorName?: string;
  vendorEmail?: string;
}

export interface AdInquiry {
  id: string;
  chatId: string;
  userId: string;
  vendorId: string;
  adId: string;
  inquiryText: string;
  status: AdInquiryStatus;
  convertedToBookingId?: string;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
  // Additional fields for admin view
  userName?: string;
  userEmail?: string;
  vendorName?: string;
  vendorEmail?: string;
}

// ===================== ANALYTICS TYPES =====================

export interface DailyCount {
  date: string;
  count: number;
}

export interface ChatStatistics {
  totalMessages: number;
  totalByType: Record<string, number>;
  totalByStatus: Record<string, number>;
  dailyMessageCount: DailyCount[];
}

export interface DateRange {
  from: string;
  to: string;
}

export interface ServiceInquiryStats {
  total: number;
  byStatus: Record<string, number>;
  byServiceType: Record<string, number>;
}

export interface AdInquiryStats {
  total: number;
  byStatus: Record<string, number>;
}

export interface InquiryStats {
  service: ServiceInquiryStats;
  advertisement: AdInquiryStats;
}

export interface ChatReport {
  period: DateRange;
  chatStatistics: ChatStatistics;
  inquiries: InquiryStats;
  generatedAt: string;
}

// ===================== RESPONSE TYPES =====================

export interface AdminActionResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface BulkOperationResponse {
  success: boolean;
  affectedCount: number;
  message: string;
  errors: string[];
}

// ===================== MUTATION VARIABLE TYPES =====================

export interface UpdateMessageStatusVariables {
  chatId: string;
  status: ChatStatus;
}

export interface MarkConversationAsReadVariables {
  otherUserId: string;
}

export interface DeleteChatVariables {
  chatId: string;
}

export interface BulkDeleteChatsVariables {
  chatIds: string[];
}

export interface UpdateServiceInquiryStatusVariables {
  inquiryId: string;
  status: ServiceInquiryStatus;
}

export interface UpdateAdInquiryStatusVariables {
  inquiryId: string;
  status: AdInquiryStatus;
}

export interface BulkUpdateInquiryStatusVariables {
  inquiryIds: string[];
  status: string;
  type: 'service' | 'ad';
}

export interface FlagMessageVariables {
  chatId: string;
  reason: string;
}

export interface EscalateConversationVariables {
  userId1: string;
  userId2: string;
  priority: 'low' | 'medium' | 'high';
}

export interface SendAdminMessageVariables {
  receiverId: string;
  message: string;
  messageType?: MessageType;
}

export interface BroadcastMessageVariables {
  userIds: string[];
  message: string;
  messageType?: MessageType;
}

// ===================== QUERY VARIABLE TYPES =====================

export interface GetAllChatsAdminVariables {
  filter?: ChatFilterInput;
  pagination?: PaginationInput;
}

export interface GetAllServiceInquiriesAdminVariables {
  filter?: ServiceInquiryFilterInput;
  pagination?: PaginationInput;
}

export interface GetAllAdInquiriesAdminVariables {
  filter?: AdInquiryFilterInput;
  pagination?: PaginationInput;
}

export interface GetChatStatisticsVariables {
  dateFrom?: string;
  dateTo?: string;
}

export interface GenerateChatReportVariables {
  dateFrom: string;
  dateTo: string;
}

export interface SearchChatsVariables {
  searchTerm: string;
  limit?: number;
}

export interface GetConversationVariables {
  userId1: string;
  userId2: string;
  limit?: number;
}

export interface GetChatByIdVariables {
  chatId: string;
}

export interface GetRecentChatsVariables {
  limit?: number;
}

// ===================== SUBSCRIPTION VARIABLE TYPES =====================

export interface MessageReceivedSubscriptionVariables {
  userId: string;
}

export interface MessageStatusUpdatedSubscriptionVariables {
  chatId: string;
}

export interface InquiryStatusUpdatedSubscriptionVariables {
  inquiryId: string;
}

// ===================== HELPER TYPES =====================

export interface ChatListItem {
  id: string;
  lastMessage: string;
  lastMessageTime: string;
  otherParticipant: {
    id: string;
    name: string;
    type: 'user' | 'vendor';
    avatar?: string;
  };
  unreadCount: number;
  status: ChatStatus;
  messageType: MessageType;
}

export interface AdminDashboardStats {
  totalChats: number;
  totalInquiries: number;
  pendingInquiries: number;
  flaggedMessages: number;
  activeUsers: number;
  todayMessages: number;
  responseRate: number;
  averageResponseTime: number; // in minutes
}

export interface ModeratedMessage {
  id: string;
  message: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  flaggedAt: string;
  flaggedBy: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  moderatedAt?: string;
  moderatedBy?: string;
}

// ===================== ERROR TYPES =====================

export interface GraphQLError {
  message: string;
  locations?: Array<{
    line: number;
    column: number;
  }>;
  path?: string[];
  extensions?: {
    code?: string;
    [key: string]: any;
  };
}

export interface ChatError {
  type: 'NETWORK_ERROR' | 'VALIDATION_ERROR' | 'AUTHORIZATION_ERROR' | 'UNKNOWN_ERROR';
  message: string;
  details?: any;
}

// ===================== API RESPONSE WRAPPERS =====================

export interface QueryResponse<T> {
  data?: T;
  loading: boolean;
  error?: ChatError;
}

export interface MutationResponse<T> {
  data?: T;
  loading: boolean;
  error?: ChatError;
  called: boolean;
}

export interface SubscriptionResponse<T> {
  data?: T;
  loading: boolean;
  error?: ChatError;
  connected: boolean;
}
