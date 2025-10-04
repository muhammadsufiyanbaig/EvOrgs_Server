"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportTypeDefs = void 0;
const apollo_server_express_1 = require("apollo-server-express");
exports.supportTypeDefs = (0, apollo_server_express_1.gql) `
  enum TicketType {
    Account
    Booking
    Payment
    Technical
    Feature
    Other
  }

  enum Priority {
    Low
    Medium
    High
    Urgent
  }

  enum TicketStatus {
    Open
    InProgress
    Resolved
    Closed
    Reopened
  }

  type SupportTicket {
    id: ID!
    userId: ID
    vendorId: ID
    subject: String!
    description: String!
    ticketType: TicketType!
    priority: Priority!
    status: TicketStatus!
    attachments: [String!]!
    createdAt: String!
    updatedAt: String!
    resolvedAt: String
    closedAt: String
    responses: [SupportResponse!]!
    creator: TicketCreator
  }

  union TicketCreator = User | Vendor

  type SupportResponse {
    id: ID!
    ticketId: ID!
    adminId: ID
    userId: ID
    vendorId: ID
    responseText: String!
    attachments: [String!]!
    isInternal: Boolean!
    createdAt: String!
    updatedAt: String!
    responder: ResponseCreator
  }

  union ResponseCreator = User | Vendor | Admin

  input CreateTicketInput {
    subject: String!
    description: String!
    ticketType: TicketType!
    attachments: [String!]
  }

  input UpdateTicketInput {
    id: ID!
    priority: Priority
    status: TicketStatus
  }

  input CreateResponseInput {
    ticketId: ID!
    responseText: String!
    attachments: [String!]
    isInternal: Boolean
  }

  type Query {
    # Get tickets based on user role
    getMyTickets: [SupportTicket!]!
    getAllTickets: [SupportTicket!]! # Admin only
    getTicket(id: ID!): SupportTicket
    getTicketResponses(ticketId: ID!): [SupportResponse!]!
  }

  type Mutation {
    # User/Vendor operations
    createTicket(input: CreateTicketInput!): SupportTicket!
    addResponse(input: CreateResponseInput!): SupportResponse!
    
    # Admin operations
    updateTicketPriority(id: ID!, priority: Priority!): SupportTicket!
    updateTicketStatus(id: ID!, status: TicketStatus!): SupportTicket!
    resolveTicket(id: ID!, responseText: String!, attachments: [String!]): SupportTicket!
    closeTicket(id: ID!): SupportTicket!
    reopenTicket(id: ID!): SupportTicket!
  }
`;
