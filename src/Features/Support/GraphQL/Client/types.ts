// TypeScript Types for Support System Client-Side Operations

// ==================== ENUMS ====================

export type TicketType = 'Account' | 'Booking' | 'Payment' | 'Technical' | 'Feature' | 'Other';

export type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type TicketStatus = 'Open' | 'InProgress' | 'Resolved' | 'Closed' | 'Reopened';

// ==================== CORE TYPES ====================

export interface SupportTicket {
  id: string;
  userId?: string;
  vendorId?: string;
  subject: string;
  description: string;
  ticketType: TicketType;
  priority: Priority;
  status: TicketStatus;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  closedAt?: string;
  responses?: SupportResponse[];
  creator?: TicketCreator;
}

export interface SupportResponse {
  id: string;
  ticketId: string;
  adminId?: string;
  userId?: string;
  vendorId?: string;
  responseText: string;
  attachments: string[];
  isInternal: boolean;
  createdAt: string;
  updatedAt: string;
  responder?: ResponseCreator;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string;
}

export interface Vendor {
  id: string;
  vendorName: string;
  vendorEmail: string;
  profileImage?: string;
  vendorType: string;
}

export interface Admin {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string;
}

export type TicketCreator = User | Vendor;
export type ResponseCreator = User | Vendor | Admin;

// ==================== INPUT TYPES ====================

export interface CreateTicketInput {
  subject: string;
  description: string;
  ticketType: TicketType;
  attachments?: string[];
}

export interface CreateResponseInput {
  ticketId: string;
  responseText: string;
  attachments?: string[];
  isInternal?: boolean;
}

export interface UpdateTicketInput {
  id: string;
  priority?: Priority;
  status?: TicketStatus;
}

// ==================== QUERY VARIABLES TYPES ====================

export interface GetMyTicketsVariables {
  // No variables needed
}

export interface GetAllTicketsVariables {
  // No variables needed
}

export interface GetTicketVariables {
  id: string;
}

export interface GetTicketResponsesVariables {
  ticketId: string;
}

// ==================== MUTATION VARIABLES TYPES ====================

export interface CreateTicketVariables {
  input: CreateTicketInput;
}

export interface AddResponseVariables {
  input: CreateResponseInput;
}

export interface UpdateTicketPriorityVariables {
  id: string;
  priority: Priority;
}

export interface UpdateTicketStatusVariables {
  id: string;
  status: TicketStatus;
}

export interface ResolveTicketVariables {
  id: string;
  responseText: string;
  attachments?: string[];
}

export interface CloseTicketVariables {
  id: string;
}

export interface ReopenTicketVariables {
  id: string;
}

export interface SetTicketHighPriorityVariables {
  id: string;
}

export interface SetTicketUrgentPriorityVariables {
  id: string;
}

export interface MarkTicketInProgressVariables {
  id: string;
}

export interface AddInternalNoteVariables {
  ticketId: string;
  responseText: string;
  attachments?: string[];
}

export interface AddPublicResponseVariables {
  ticketId: string;
  responseText: string;
  attachments?: string[];
}

export interface CreateAccountTicketVariables {
  subject: string;
  description: string;
  attachments?: string[];
}

export interface CreateBookingTicketVariables {
  subject: string;
  description: string;
  attachments?: string[];
}

export interface CreatePaymentTicketVariables {
  subject: string;
  description: string;
  attachments?: string[];
}

export interface CreateTechnicalTicketVariables {
  subject: string;
  description: string;
  attachments?: string[];
}

export interface CreateFeatureTicketVariables {
  subject: string;
  description: string;
  attachments?: string[];
}

// ==================== BULK OPERATION TYPES ====================

export interface UpdateMultipleTicketsPriorityVariables {
  ticketIds: string[];
  priority: Priority;
}

export interface UpdateMultipleTicketsStatusVariables {
  ticketIds: string[];
  status: TicketStatus;
}

export interface CloseMultipleTicketsVariables {
  ticketIds: string[];
}

export interface BulkOperationResult {
  success: boolean;
  updatedCount?: number;
  closedCount?: number;
  errors?: BulkOperationError[];
}

export interface BulkOperationError {
  ticketId: string;
  message: string;
}

// ==================== RESPONSE TYPES ====================

export interface GetMyTicketsResponse {
  getMyTickets: SupportTicket[];
}

export interface GetAllTicketsResponse {
  getAllTickets: SupportTicket[];
}

export interface GetTicketResponse {
  getTicket: SupportTicket;
}

export interface GetTicketResponsesResponse {
  getTicketResponses: SupportResponse[];
}

export interface CreateTicketResponse {
  createTicket: SupportTicket;
}

export interface AddResponseResponse {
  addResponse: SupportResponse;
}

export interface UpdateTicketPriorityResponse {
  updateTicketPriority: SupportTicket;
}

export interface UpdateTicketStatusResponse {
  updateTicketStatus: SupportTicket;
}

export interface ResolveTicketResponse {
  resolveTicket: SupportTicket;
}

export interface CloseTicketResponse {
  closeTicket: SupportTicket;
}

export interface ReopenTicketResponse {
  reopenTicket: SupportTicket;
}

// ==================== HOOK RETURN TYPES ====================

export interface UseMyTicketsResult {
  tickets: SupportTicket[];
  loading: boolean;
  error?: Error;
  refetch: () => void;
}

export interface UseAllTicketsResult {
  tickets: SupportTicket[];
  loading: boolean;
  error?: Error;
  refetch: () => void;
}

export interface UseTicketResult {
  ticket?: SupportTicket;
  loading: boolean;
  error?: Error;
  refetch: () => void;
}

export interface UseTicketResponsesResult {
  responses: SupportResponse[];
  loading: boolean;
  error?: Error;
  refetch: () => void;
}

export interface UseCreateTicketResult {
  createTicket: (input: CreateTicketInput) => Promise<SupportTicket>;
  loading: boolean;
  error?: Error;
}

export interface UseAddResponseResult {
  addResponse: (input: CreateResponseInput) => Promise<SupportResponse>;
  loading: boolean;
  error?: Error;
}

export interface UseUpdateTicketResult {
  updatePriority: (id: string, priority: Priority) => Promise<SupportTicket>;
  updateStatus: (id: string, status: TicketStatus) => Promise<SupportTicket>;
  resolveTicket: (id: string, responseText: string, attachments?: string[]) => Promise<SupportTicket>;
  closeTicket: (id: string) => Promise<SupportTicket>;
  reopenTicket: (id: string) => Promise<SupportTicket>;
  loading: boolean;
  error?: Error;
}

// ==================== FORM TYPES ====================

export interface TicketFormData {
  subject: string;
  description: string;
  ticketType: TicketType;
  attachments: string[];
}

export interface ResponseFormData {
  responseText: string;
  attachments: string[];
  isInternal: boolean;
}

export interface TicketFilterFormData {
  status?: TicketStatus[];
  priority?: Priority[];
  ticketType?: TicketType[];
  dateRange?: {
    start: string;
    end: string;
  };
  creatorType?: ('User' | 'Vendor')[];
}

// ==================== UTILITY TYPES ====================

export interface TicketState {
  tickets: SupportTicket[];
  selectedTicket?: SupportTicket;
  filters: TicketFilterFormData;
  isLoading: boolean;
  error?: string;
}

export interface TicketStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
  byPriority: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
  byType: {
    account: number;
    booking: number;
    payment: number;
    technical: number;
    feature: number;
    other: number;
  };
}

export interface TicketMetrics {
  averageResponseTime: number;
  averageResolutionTime: number;
  satisfactionRating: number;
  totalTicketsThisMonth: number;
  resolvedTicketsThisMonth: number;
  resolutionRate: number;
}

// ==================== VALIDATION TYPES ====================

export interface TicketValidationError {
  field: string;
  message: string;
}

export interface TicketFormValidation {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface ResponseValidationError {
  field: string;
  message: string;
}

export interface ResponseFormValidation {
  isValid: boolean;
  errors: Record<string, string>;
}

// ==================== CONSTANTS TYPES ====================

export interface SupportConstants {
  TICKET_TYPES: TicketType[];
  PRIORITIES: Priority[];
  TICKET_STATUSES: TicketStatus[];
  MAX_ATTACHMENT_SIZE: number;
  ALLOWED_ATTACHMENT_TYPES: string[];
  MAX_ATTACHMENTS_PER_TICKET: number;
  MAX_SUBJECT_LENGTH: number;
  MAX_DESCRIPTION_LENGTH: number;
  MAX_RESPONSE_LENGTH: number;
}

// ==================== APOLLO CLIENT TYPES ====================

export interface SupportQueryOptions {
  pollInterval?: number;
  errorPolicy?: 'none' | 'ignore' | 'all';
  notifyOnNetworkStatusChange?: boolean;
}

export interface SupportMutationOptions {
  refetchQueries?: string[];
  awaitRefetchQueries?: boolean;
  optimisticResponse?: any;
  update?: (cache: any, result: any) => void;
}

// ==================== SEARCH AND FILTER TYPES ====================

export interface TicketSearchParams {
  query?: string;
  status?: TicketStatus[];
  priority?: Priority[];
  ticketType?: TicketType[];
  createdBy?: string;
  assignedTo?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'priority' | 'status';
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

export interface TicketSearchResult {
  tickets: SupportTicket[];
  total: number;
  page: number;
  hasMore: boolean;
}
