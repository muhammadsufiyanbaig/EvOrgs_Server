// GraphQL Mutations for Support System
import { gql } from '@apollo/client';
import {
  SUPPORT_TICKET_FULL_FRAGMENT,
  SUPPORT_TICKET_WITH_CREATOR_FRAGMENT,
  SUPPORT_RESPONSE_FULL_FRAGMENT,
  SUPPORT_RESPONSE_WITH_RESPONDER_FRAGMENT
} from './fragments';

// ==================== TICKET CREATION AND MANAGEMENT ====================

/**
 * Create a new support ticket
 * Creates ticket for authenticated user or vendor
 */
export const CREATE_TICKET = gql`
  ${SUPPORT_TICKET_WITH_CREATOR_FRAGMENT}
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
export const ADD_RESPONSE = gql`
  ${SUPPORT_RESPONSE_WITH_RESPONDER_FRAGMENT}
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
export const UPDATE_TICKET_PRIORITY = gql`
  ${SUPPORT_TICKET_FULL_FRAGMENT}
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
export const UPDATE_TICKET_STATUS = gql`
  ${SUPPORT_TICKET_FULL_FRAGMENT}
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
export const RESOLVE_TICKET = gql`
  ${SUPPORT_TICKET_FULL_FRAGMENT}
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
export const CLOSE_TICKET = gql`
  ${SUPPORT_TICKET_FULL_FRAGMENT}
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
export const REOPEN_TICKET = gql`
  ${SUPPORT_TICKET_FULL_FRAGMENT}
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
export const UPDATE_MULTIPLE_TICKETS_PRIORITY = gql`
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
export const UPDATE_MULTIPLE_TICKETS_STATUS = gql`
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
export const CLOSE_MULTIPLE_TICKETS = gql`
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
export const SET_TICKET_HIGH_PRIORITY = gql`
  ${SUPPORT_TICKET_FULL_FRAGMENT}
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
export const SET_TICKET_URGENT_PRIORITY = gql`
  ${SUPPORT_TICKET_FULL_FRAGMENT}
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
export const MARK_TICKET_IN_PROGRESS = gql`
  ${SUPPORT_TICKET_FULL_FRAGMENT}
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
export const ADD_INTERNAL_NOTE = gql`
  ${SUPPORT_RESPONSE_FULL_FRAGMENT}
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
export const ADD_PUBLIC_RESPONSE = gql`
  ${SUPPORT_RESPONSE_WITH_RESPONDER_FRAGMENT}
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
export const CREATE_ACCOUNT_TICKET = gql`
  ${SUPPORT_TICKET_WITH_CREATOR_FRAGMENT}
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
export const CREATE_BOOKING_TICKET = gql`
  ${SUPPORT_TICKET_WITH_CREATOR_FRAGMENT}
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
export const CREATE_PAYMENT_TICKET = gql`
  ${SUPPORT_TICKET_WITH_CREATOR_FRAGMENT}
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
export const CREATE_TECHNICAL_TICKET = gql`
  ${SUPPORT_TICKET_WITH_CREATOR_FRAGMENT}
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
export const CREATE_FEATURE_TICKET = gql`
  ${SUPPORT_TICKET_WITH_CREATOR_FRAGMENT}
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
