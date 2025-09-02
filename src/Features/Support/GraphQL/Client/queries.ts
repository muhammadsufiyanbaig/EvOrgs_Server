// GraphQL Queries for Support System
import { gql } from '@apollo/client';
import {
  SUPPORT_TICKET_BASIC_FRAGMENT,
  SUPPORT_TICKET_FULL_FRAGMENT,
  SUPPORT_TICKET_WITH_CREATOR_FRAGMENT,
  SUPPORT_TICKET_WITH_RESPONSES_FRAGMENT,
  SUPPORT_RESPONSE_BASIC_FRAGMENT,
  SUPPORT_RESPONSE_FULL_FRAGMENT,
  SUPPORT_RESPONSE_WITH_RESPONDER_FRAGMENT
} from './fragments';

// ==================== TICKET QUERIES ====================

/**
 * Get current user's or vendor's tickets
 * Returns tickets created by the authenticated user/vendor
 */
export const GET_MY_TICKETS = gql`
  ${SUPPORT_TICKET_WITH_CREATOR_FRAGMENT}
  query GetMyTickets {
    getMyTickets {
      ...SupportTicketWithCreator
    }
  }
`;

/**
 * Get current user's tickets with basic info only
 * Lighter query for list views
 */
export const GET_MY_TICKETS_BASIC = gql`
  ${SUPPORT_TICKET_BASIC_FRAGMENT}
  query GetMyTicketsBasic {
    getMyTickets {
      ...SupportTicketBasic
    }
  }
`;

/**
 * Get all tickets (Admin only)
 * Returns all tickets in the system for admin dashboard
 */
export const GET_ALL_TICKETS = gql`
  ${SUPPORT_TICKET_WITH_CREATOR_FRAGMENT}
  query GetAllTickets {
    getAllTickets {
      ...SupportTicketWithCreator
    }
  }
`;

/**
 * Get all tickets with basic info (Admin only)
 * Lighter query for admin list views
 */
export const GET_ALL_TICKETS_BASIC = gql`
  ${SUPPORT_TICKET_BASIC_FRAGMENT}
  query GetAllTicketsBasic {
    getAllTickets {
      ...SupportTicketBasic
    }
  }
`;

/**
 * Get single ticket by ID
 * Returns full ticket details including creator info
 */
export const GET_TICKET = gql`
  ${SUPPORT_TICKET_WITH_CREATOR_FRAGMENT}
  query GetTicket($id: ID!) {
    getTicket(id: $id) {
      ...SupportTicketWithCreator
    }
  }
`;

/**
 * Get single ticket with responses
 * Returns complete ticket details including all responses
 */
export const GET_TICKET_WITH_RESPONSES = gql`
  ${SUPPORT_TICKET_WITH_RESPONSES_FRAGMENT}
  ${SUPPORT_RESPONSE_WITH_RESPONDER_FRAGMENT}
  query GetTicketWithResponses($id: ID!) {
    getTicket(id: $id) {
      ...SupportTicketWithResponses
    }
  }
`;

/**
 * Get ticket responses by ticket ID
 * Returns all responses for a specific ticket
 */
export const GET_TICKET_RESPONSES = gql`
  ${SUPPORT_RESPONSE_WITH_RESPONDER_FRAGMENT}
  query GetTicketResponses($ticketId: ID!) {
    getTicketResponses(ticketId: $ticketId) {
      ...SupportResponseWithResponder
    }
  }
`;

/**
 * Get ticket responses (basic info only)
 * Lighter query for response lists
 */
export const GET_TICKET_RESPONSES_BASIC = gql`
  ${SUPPORT_RESPONSE_BASIC_FRAGMENT}
  query GetTicketResponsesBasic($ticketId: ID!) {
    getTicketResponses(ticketId: $ticketId) {
      ...SupportResponseBasic
    }
  }
`;

// ==================== POLLING QUERIES FOR REAL-TIME UPDATES ====================

/**
 * Poll for ticket updates
 * Use with pollInterval for real-time ticket status updates
 */
export const POLL_MY_TICKETS = gql`
  ${SUPPORT_TICKET_BASIC_FRAGMENT}
  query PollMyTickets {
    getMyTickets {
      ...SupportTicketBasic
    }
  }
`;

/**
 * Poll for admin ticket updates
 * Use with pollInterval for real-time admin dashboard updates
 */
export const POLL_ALL_TICKETS = gql`
  ${SUPPORT_TICKET_BASIC_FRAGMENT}
  query PollAllTickets {
    getAllTickets {
      ...SupportTicketBasic
    }
  }
`;

/**
 * Poll for ticket response updates
 * Use with pollInterval for real-time response updates
 */
export const POLL_TICKET_RESPONSES = gql`
  ${SUPPORT_RESPONSE_BASIC_FRAGMENT}
  query PollTicketResponses($ticketId: ID!) {
    getTicketResponses(ticketId: $ticketId) {
      ...SupportResponseBasic
    }
  }
`;

/**
 * Poll for single ticket updates
 * Use with pollInterval for real-time ticket detail updates
 */
export const POLL_TICKET = gql`
  ${SUPPORT_TICKET_FULL_FRAGMENT}
  query PollTicket($id: ID!) {
    getTicket(id: $id) {
      ...SupportTicketFull
    }
  }
`;
