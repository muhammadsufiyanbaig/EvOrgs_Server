// src/Features/Photography/Schema/typeDefs.ts
import { gql } from 'apollo-server-express';

export const customPhotographyTypeDefs = gql`
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

  # User Type (abbreviated version)
  type User {
    id: ID!
    name: String
    email: String!
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
  }

  # Mutation Type
  type Mutation {
    # User Mutations
    createCustomOrder(input: CreateCustomOrderInput!): CustomOrder!
    acceptCustomOrderQuote(orderId: ID!): CustomOrder!
    rejectCustomOrderQuote(orderId: ID!): CustomOrder!
    
    # Vendor Mutations
    quoteCustomOrder(input: QuoteOrderInput!): CustomOrder!
  }
`;