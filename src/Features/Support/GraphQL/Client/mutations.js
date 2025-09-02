"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CREATE_FEATURE_TICKET = exports.CREATE_TECHNICAL_TICKET = exports.CREATE_PAYMENT_TICKET = exports.CREATE_BOOKING_TICKET = exports.CREATE_ACCOUNT_TICKET = exports.ADD_PUBLIC_RESPONSE = exports.ADD_INTERNAL_NOTE = exports.MARK_TICKET_IN_PROGRESS = exports.SET_TICKET_URGENT_PRIORITY = exports.SET_TICKET_HIGH_PRIORITY = exports.CLOSE_MULTIPLE_TICKETS = exports.UPDATE_MULTIPLE_TICKETS_STATUS = exports.UPDATE_MULTIPLE_TICKETS_PRIORITY = exports.REOPEN_TICKET = exports.CLOSE_TICKET = exports.RESOLVE_TICKET = exports.UPDATE_TICKET_STATUS = exports.UPDATE_TICKET_PRIORITY = exports.ADD_RESPONSE = exports.CREATE_TICKET = void 0;
// GraphQL Mutations for Support System
const client_1 = require("@apollo/client");
const fragments_1 = require("./fragments");
// ==================== TICKET CREATION AND MANAGEMENT ====================
/**
 * Create a new support ticket
 * Creates ticket for authenticated user or vendor
 */
exports.CREATE_TICKET = (0, client_1.gql) `
  ${fragments_1.SUPPORT_TICKET_WITH_CREATOR_FRAGMENT}
  mutation CreateTicket($input: CreateTicketInput!) {
    createTicket(input: $input) {
      ...SupportTicketWithCreator
    }
  }
`;
/**
 * Add response to a ticket
 * Allows users, vendors, and admins to respond to tickets
 */
exports.ADD_RESPONSE = (0, client_1.gql) `
  ${fragments_1.SUPPORT_RESPONSE_WITH_RESPONDER_FRAGMENT}
  mutation AddResponse($input: CreateResponseInput!) {
    addResponse(input: $input) {
      ...SupportResponseWithResponder
    }
  }
`;
// ==================== ADMIN TICKET MANAGEMENT ====================
/**
 * Update ticket priority (Admin only)
 * Changes the priority level of a ticket
 */
exports.UPDATE_TICKET_PRIORITY = (0, client_1.gql) `
  ${fragments_1.SUPPORT_TICKET_FULL_FRAGMENT}
  mutation UpdateTicketPriority($id: ID!, $priority: Priority!) {
    updateTicketPriority(id: $id, priority: $priority) {
      ...SupportTicketFull
    }
  }
`;
/**
 * Update ticket status (Admin only)
 * Changes the status of a ticket
 */
exports.UPDATE_TICKET_STATUS = (0, client_1.gql) `
  ${fragments_1.SUPPORT_TICKET_FULL_FRAGMENT}
  mutation UpdateTicketStatus($id: ID!, $status: TicketStatus!) {
    updateTicketStatus(id: $id, status: $status) {
      ...SupportTicketFull
    }
  }
`;
/**
 * Resolve ticket with response (Admin only)
 * Adds a resolution response and marks ticket as resolved
 */
exports.RESOLVE_TICKET = (0, client_1.gql) `
  ${fragments_1.SUPPORT_TICKET_FULL_FRAGMENT}
  mutation ResolveTicket($id: ID!, $responseText: String!, $attachments: [String!]) {
    resolveTicket(id: $id, responseText: $responseText, attachments: $attachments) {
      ...SupportTicketFull
    }
  }
`;
/**
 * Close ticket (Admin only)
 * Marks ticket as closed
 */
exports.CLOSE_TICKET = (0, client_1.gql) `
  ${fragments_1.SUPPORT_TICKET_FULL_FRAGMENT}
  mutation CloseTicket($id: ID!) {
    closeTicket(id: $id) {
      ...SupportTicketFull
    }
  }
`;
/**
 * Reopen ticket (Admin only)
 * Reopens a previously closed or resolved ticket
 */
exports.REOPEN_TICKET = (0, client_1.gql) `
  ${fragments_1.SUPPORT_TICKET_FULL_FRAGMENT}
  mutation ReopenTicket($id: ID!) {
    reopenTicket(id: $id) {
      ...SupportTicketFull
    }
  }
`;
// ==================== BULK OPERATIONS ====================
/**
 * Update multiple tickets priority (Admin only)
 * Batch update priority for multiple tickets
 */
exports.UPDATE_MULTIPLE_TICKETS_PRIORITY = (0, client_1.gql) `
  mutation UpdateMultipleTicketsPriority($ticketIds: [ID!]!, $priority: Priority!) {
    updateMultipleTicketsPriority: updateMultipleTicketsPriority(ticketIds: $ticketIds, priority: $priority) {
      success
      updatedCount
      errors {
        ticketId
        message
      }
    }
  }
`;
/**
 * Update multiple tickets status (Admin only)
 * Batch update status for multiple tickets
 */
exports.UPDATE_MULTIPLE_TICKETS_STATUS = (0, client_1.gql) `
  mutation UpdateMultipleTicketsStatus($ticketIds: [ID!]!, $status: TicketStatus!) {
    updateMultipleTicketsStatus: updateMultipleTicketsStatus(ticketIds: $ticketIds, status: $status) {
      success
      updatedCount
      errors {
        ticketId
        message
      }
    }
  }
`;
/**
 * Close multiple tickets (Admin only)
 * Batch close multiple tickets
 */
exports.CLOSE_MULTIPLE_TICKETS = (0, client_1.gql) `
  mutation CloseMultipleTickets($ticketIds: [ID!]!) {
    closeMultipleTickets: closeMultipleTickets(ticketIds: $ticketIds) {
      success
      closedCount
      errors {
        ticketId
        message
      }
    }
  }
`;
// ==================== QUICK ACTIONS ====================
/**
 * Set ticket to high priority (Admin only)
 * Quick action to escalate ticket priority
 */
exports.SET_TICKET_HIGH_PRIORITY = (0, client_1.gql) `
  ${fragments_1.SUPPORT_TICKET_FULL_FRAGMENT}
  mutation SetTicketHighPriority($id: ID!) {
    updateTicketPriority(id: $id, priority: High) {
      ...SupportTicketFull
    }
  }
`;
/**
 * Set ticket to urgent priority (Admin only)
 * Quick action to escalate ticket to urgent
 */
exports.SET_TICKET_URGENT_PRIORITY = (0, client_1.gql) `
  ${fragments_1.SUPPORT_TICKET_FULL_FRAGMENT}
  mutation SetTicketUrgentPriority($id: ID!) {
    updateTicketPriority(id: $id, priority: Urgent) {
      ...SupportTicketFull
    }
  }
`;
/**
 * Mark ticket as in progress (Admin only)
 * Quick action to set ticket status to in progress
 */
exports.MARK_TICKET_IN_PROGRESS = (0, client_1.gql) `
  ${fragments_1.SUPPORT_TICKET_FULL_FRAGMENT}
  mutation MarkTicketInProgress($id: ID!) {
    updateTicketStatus(id: $id, status: InProgress) {
      ...SupportTicketFull
    }
  }
`;
/**
 * Add internal note to ticket (Admin only)
 * Quick action to add internal admin note
 */
exports.ADD_INTERNAL_NOTE = (0, client_1.gql) `
  ${fragments_1.SUPPORT_RESPONSE_FULL_FRAGMENT}
  mutation AddInternalNote($ticketId: ID!, $responseText: String!, $attachments: [String!]) {
    addResponse(input: {
      ticketId: $ticketId,
      responseText: $responseText,
      attachments: $attachments,
      isInternal: true
    }) {
      ...SupportResponseFull
    }
  }
`;
/**
 * Add public response (Admin/User/Vendor)
 * Quick action to add public response
 */
exports.ADD_PUBLIC_RESPONSE = (0, client_1.gql) `
  ${fragments_1.SUPPORT_RESPONSE_WITH_RESPONDER_FRAGMENT}
  mutation AddPublicResponse($ticketId: ID!, $responseText: String!, $attachments: [String!]) {
    addResponse(input: {
      ticketId: $ticketId,
      responseText: $responseText,
      attachments: $attachments,
      isInternal: false
    }) {
      ...SupportResponseWithResponder
    }
  }
`;
// ==================== SPECIALIZED TICKET CREATION ====================
/**
 * Create account-related ticket
 * Specialized mutation for account issues
 */
exports.CREATE_ACCOUNT_TICKET = (0, client_1.gql) `
  ${fragments_1.SUPPORT_TICKET_WITH_CREATOR_FRAGMENT}
  mutation CreateAccountTicket($subject: String!, $description: String!, $attachments: [String!]) {
    createTicket(input: {
      subject: $subject,
      description: $description,
      ticketType: Account,
      attachments: $attachments
    }) {
      ...SupportTicketWithCreator
    }
  }
`;
/**
 * Create booking-related ticket
 * Specialized mutation for booking issues
 */
exports.CREATE_BOOKING_TICKET = (0, client_1.gql) `
  ${fragments_1.SUPPORT_TICKET_WITH_CREATOR_FRAGMENT}
  mutation CreateBookingTicket($subject: String!, $description: String!, $attachments: [String!]) {
    createTicket(input: {
      subject: $subject,
      description: $description,
      ticketType: Booking,
      attachments: $attachments
    }) {
      ...SupportTicketWithCreator
    }
  }
`;
/**
 * Create payment-related ticket
 * Specialized mutation for payment issues
 */
exports.CREATE_PAYMENT_TICKET = (0, client_1.gql) `
  ${fragments_1.SUPPORT_TICKET_WITH_CREATOR_FRAGMENT}
  mutation CreatePaymentTicket($subject: String!, $description: String!, $attachments: [String!]) {
    createTicket(input: {
      subject: $subject,
      description: $description,
      ticketType: Payment,
      attachments: $attachments
    }) {
      ...SupportTicketWithCreator
    }
  }
`;
/**
 * Create technical-related ticket
 * Specialized mutation for technical issues
 */
exports.CREATE_TECHNICAL_TICKET = (0, client_1.gql) `
  ${fragments_1.SUPPORT_TICKET_WITH_CREATOR_FRAGMENT}
  mutation CreateTechnicalTicket($subject: String!, $description: String!, $attachments: [String!]) {
    createTicket(input: {
      subject: $subject,
      description: $description,
      ticketType: Technical,
      attachments: $attachments
    }) {
      ...SupportTicketWithCreator
    }
  }
`;
/**
 * Create feature request ticket
 * Specialized mutation for feature requests
 */
exports.CREATE_FEATURE_TICKET = (0, client_1.gql) `
  ${fragments_1.SUPPORT_TICKET_WITH_CREATOR_FRAGMENT}
  mutation CreateFeatureTicket($subject: String!, $description: String!, $attachments: [String!]) {
    createTicket(input: {
      subject: $subject,
      description: $description,
      ticketType: Feature,
      attachments: $attachments
    }) {
      ...SupportTicketWithCreator
    }
  }
`;
