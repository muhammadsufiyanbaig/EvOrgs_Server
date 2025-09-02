// GraphQL Fragments for Support System
import { gql } from '@apollo/client';

// ==================== SUPPORT TICKET FRAGMENTS ====================

export const SUPPORT_TICKET_BASIC_FRAGMENT = gql`
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

export const SUPPORT_TICKET_FULL_FRAGMENT = gql`
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

export const SUPPORT_TICKET_WITH_CREATOR_FRAGMENT = gql`
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

export const SUPPORT_TICKET_WITH_RESPONSES_FRAGMENT = gql`
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

export const SUPPORT_RESPONSE_BASIC_FRAGMENT = gql`
  fragment SupportResponseBasic on SupportResponse {
    id
    ticketId
    responseText
    isInternal
    createdAt
  }
`;

export const SUPPORT_RESPONSE_FULL_FRAGMENT = gql`
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

export const SUPPORT_RESPONSE_WITH_RESPONDER_FRAGMENT = gql`
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

export const USER_BASIC_FRAGMENT = gql`
  fragment UserBasic on User {
    id
    firstName
    lastName
    email
    profileImage
  }
`;

export const VENDOR_BASIC_FRAGMENT = gql`
  fragment VendorBasic on Vendor {
    id
    vendorName
    vendorEmail
    profileImage
    vendorType
  }
`;

export const ADMIN_BASIC_FRAGMENT = gql`
  fragment AdminBasic on Admin {
    id
    firstName
    lastName
    email
    profileImage
  }
`;
