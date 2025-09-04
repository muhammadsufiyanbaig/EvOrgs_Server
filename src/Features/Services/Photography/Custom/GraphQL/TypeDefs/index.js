"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customPhotographyTypeDefs = void 0;
// src/Features/Photography/Schema/typeDefs.ts
const apollo_server_express_1 = require("apollo-server-express");
exports.customPhotographyTypeDefs = (0, apollo_server_express_1.gql) `
  # Custom Order Status Type
  enum OrderStatus {
    Requested
    Quoted
    Accepted
    Rejected
  }

  # Custom Order Input Type
  input CreateCustomOrderInput {
    eventDate: String
    eventDuration: Int
    orderDetails: String!
    vendorId: ID!
  }

  # Custom Order Quote Input Type
  input QuoteOrderInput {
    orderId: ID!
    price: Float!
  }

  # Search Orders Input Type
  input SearchOrdersInput {
    status: OrderStatus
    dateFrom: String
    dateTo: String
    searchTerm: String
  }

  # Admin Filter Input Type
  input AdminCustomOrderFilters {
    vendorId: ID
    userId: ID
    status: OrderStatus
    minPrice: Float
    maxPrice: Float
    minDuration: Int
    maxDuration: Int
    startDate: String
    endDate: String
    searchTerm: String
    page: Int
    limit: Int
    sortBy: String
  }

  # Custom Order List Response Type
  type CustomOrderListResponse {
    orders: [CustomOrder!]!
    total: Int!
    page: Int!
    totalPages: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }

  # Custom Order Type
  type CustomOrder {
    id: ID!
    vendorId: ID!
    userId: ID!
    orderDetails: String!
    eventDate: String
    eventDuration: Int
    price: Float
    status: OrderStatus!
    createdAt: String!
    updatedAt: String!
    user: User
    vendor: Vendor
  }

  # Vendor Type (abbreviated version)
  type Vendor {
    id: ID!
    name: String
    email: String!
  }

  # Query Type
  type Query {
    # User Queries
    getUserCustomOrders: [CustomOrder!]!
    
    # Vendor Queries
    getVendorCustomOrders: [CustomOrder!]!
    getCustomOrderById(orderId: ID!): CustomOrder
    searchCustomOrders(input: SearchOrdersInput!): [CustomOrder!]!

    # Admin Queries
    adminGetAllCustomOrders(filters: AdminCustomOrderFilters): CustomOrderListResponse!
    adminGetCustomOrder(orderId: ID!): CustomOrder
  }

  # Mutation Type
  type Mutation {
    # User Mutations
    createCustomOrder(input: CreateCustomOrderInput!): CustomOrder!
    acceptCustomOrderQuote(orderId: ID!): CustomOrder!
    rejectCustomOrderQuote(orderId: ID!): CustomOrder!
    
    # Vendor Mutations
    quoteCustomOrder(input: QuoteOrderInput!): CustomOrder!

    # Admin Mutations
    adminUpdateOrderStatus(orderId: ID!, status: OrderStatus!): CustomOrder!
    adminDeleteOrder(orderId: ID!): Boolean!
  }
`;
