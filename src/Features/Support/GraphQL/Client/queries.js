"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POLL_TICKET = exports.POLL_TICKET_RESPONSES = exports.POLL_ALL_TICKETS = exports.POLL_MY_TICKETS = exports.GET_TICKET_RESPONSES_BASIC = exports.GET_TICKET_RESPONSES = exports.GET_TICKET_WITH_RESPONSES = exports.GET_TICKET = exports.GET_ALL_TICKETS_BASIC = exports.GET_ALL_TICKETS = exports.GET_MY_TICKETS_BASIC = exports.GET_MY_TICKETS = void 0;
// GraphQL Queries for Support System
const client_1 = require("@apollo/client");
const fragments_1 = require("./fragments");
// ==================== TICKET QUERIES ====================
/**
 * Get current user's or vendor's tickets
 * Returns tickets created by the authenticated user/vendor
 */
exports.GET_MY_TICKETS = (0, client_1.gql) `
  ${fragments_1.SUPPORT_TICKET_WITH_CREATOR_FRAGMENT}
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
exports.GET_MY_TICKETS_BASIC = (0, client_1.gql) `
  ${fragments_1.SUPPORT_TICKET_BASIC_FRAGMENT}
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
exports.GET_ALL_TICKETS = (0, client_1.gql) `
  ${fragments_1.SUPPORT_TICKET_WITH_CREATOR_FRAGMENT}
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
exports.GET_ALL_TICKETS_BASIC = (0, client_1.gql) `
  ${fragments_1.SUPPORT_TICKET_BASIC_FRAGMENT}
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
exports.GET_TICKET = (0, client_1.gql) `
  ${fragments_1.SUPPORT_TICKET_WITH_CREATOR_FRAGMENT}
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
exports.GET_TICKET_WITH_RESPONSES = (0, client_1.gql) `
  ${fragments_1.SUPPORT_TICKET_WITH_RESPONSES_FRAGMENT}
  ${fragments_1.SUPPORT_RESPONSE_WITH_RESPONDER_FRAGMENT}
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
exports.GET_TICKET_RESPONSES = (0, client_1.gql) `
  ${fragments_1.SUPPORT_RESPONSE_WITH_RESPONDER_FRAGMENT}
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
exports.GET_TICKET_RESPONSES_BASIC = (0, client_1.gql) `
  ${fragments_1.SUPPORT_RESPONSE_BASIC_FRAGMENT}
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
exports.POLL_MY_TICKETS = (0, client_1.gql) `
  ${fragments_1.SUPPORT_TICKET_BASIC_FRAGMENT}
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
exports.POLL_ALL_TICKETS = (0, client_1.gql) `
  ${fragments_1.SUPPORT_TICKET_BASIC_FRAGMENT}
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
exports.POLL_TICKET_RESPONSES = (0, client_1.gql) `
  ${fragments_1.SUPPORT_RESPONSE_BASIC_FRAGMENT}
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
exports.POLL_TICKET = (0, client_1.gql) `
  ${fragments_1.SUPPORT_TICKET_FULL_FRAGMENT}
  query PollTicket($id: ID!) {
    getTicket(id: $id) {
      ...SupportTicketFull
    }
  }
`;
