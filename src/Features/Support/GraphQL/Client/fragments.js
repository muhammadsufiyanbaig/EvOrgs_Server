"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ADMIN_BASIC_FRAGMENT = exports.VENDOR_BASIC_FRAGMENT = exports.USER_BASIC_FRAGMENT = exports.SUPPORT_RESPONSE_WITH_RESPONDER_FRAGMENT = exports.SUPPORT_RESPONSE_FULL_FRAGMENT = exports.SUPPORT_RESPONSE_BASIC_FRAGMENT = exports.SUPPORT_TICKET_WITH_RESPONSES_FRAGMENT = exports.SUPPORT_TICKET_WITH_CREATOR_FRAGMENT = exports.SUPPORT_TICKET_FULL_FRAGMENT = exports.SUPPORT_TICKET_BASIC_FRAGMENT = void 0;
// GraphQL Fragments for Support System
const client_1 = require("@apollo/client");
// ==================== SUPPORT TICKET FRAGMENTS ====================
exports.SUPPORT_TICKET_BASIC_FRAGMENT = (0, client_1.gql) `
  fragment SupportTicketBasic on SupportTicket {
    id
    subject
    ticketType
    priority
    status
    createdAt
    updatedAt
  }
`;
exports.SUPPORT_TICKET_FULL_FRAGMENT = (0, client_1.gql) `
  fragment SupportTicketFull on SupportTicket {
    id
    userId
    vendorId
    subject
    description
    ticketType
    priority
    status
    attachments
    createdAt
    updatedAt
    resolvedAt
    closedAt
  }
`;
exports.SUPPORT_TICKET_WITH_CREATOR_FRAGMENT = (0, client_1.gql) `
  fragment SupportTicketWithCreator on SupportTicket {
    id
    userId
    vendorId
    subject
    description
    ticketType
    priority
    status
    attachments
    createdAt
    updatedAt
    resolvedAt
    closedAt
    creator {
      ... on User {
        id
        firstName
        lastName
        email
        profileImage
      }
      ... on Vendor {
        id
        vendorName
        vendorEmail
        profileImage
        vendorType
      }
    }
  }
`;
exports.SUPPORT_TICKET_WITH_RESPONSES_FRAGMENT = (0, client_1.gql) `
  fragment SupportTicketWithResponses on SupportTicket {
    id
    userId
    vendorId
    subject
    description
    ticketType
    priority
    status
    attachments
    createdAt
    updatedAt
    resolvedAt
    closedAt
    responses {
      ...SupportResponseFull
    }
    creator {
      ... on User {
        id
        firstName
        lastName
        email
        profileImage
      }
      ... on Vendor {
        id
        vendorName
        vendorEmail
        profileImage
        vendorType
      }
    }
  }
`;
// ==================== SUPPORT RESPONSE FRAGMENTS ====================
exports.SUPPORT_RESPONSE_BASIC_FRAGMENT = (0, client_1.gql) `
  fragment SupportResponseBasic on SupportResponse {
    id
    ticketId
    responseText
    isInternal
    createdAt
  }
`;
exports.SUPPORT_RESPONSE_FULL_FRAGMENT = (0, client_1.gql) `
  fragment SupportResponseFull on SupportResponse {
    id
    ticketId
    adminId
    userId
    vendorId
    responseText
    attachments
    isInternal
    createdAt
    updatedAt
  }
`;
exports.SUPPORT_RESPONSE_WITH_RESPONDER_FRAGMENT = (0, client_1.gql) `
  fragment SupportResponseWithResponder on SupportResponse {
    id
    ticketId
    adminId
    userId
    vendorId
    responseText
    attachments
    isInternal
    createdAt
    updatedAt
    responder {
      ... on User {
        id
        firstName
        lastName
        email
        profileImage
      }
      ... on Vendor {
        id
        vendorName
        vendorEmail
        profileImage
        vendorType
      }
      ... on Admin {
        id
        firstName
        lastName
        email
        profileImage
      }
    }
  }
`;
// ==================== USER FRAGMENTS ====================
exports.USER_BASIC_FRAGMENT = (0, client_1.gql) `
  fragment UserBasic on User {
    id
    firstName
    lastName
    email
    profileImage
  }
`;
exports.VENDOR_BASIC_FRAGMENT = (0, client_1.gql) `
  fragment VendorBasic on Vendor {
    id
    vendorName
    vendorEmail
    profileImage
    vendorType
  }
`;
exports.ADMIN_BASIC_FRAGMENT = (0, client_1.gql) `
  fragment AdminBasic on Admin {
    id
    firstName
    lastName
    email
    profileImage
  }
`;
