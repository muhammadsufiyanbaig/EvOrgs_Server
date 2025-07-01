import { gql } from 'apollo-server-express';

export const chatTypeDefs = gql`
  # Enum for Chat status
  enum ChatStatus {
    Sent
    Delivered
    Read
    Deleted
  }

  # Enum for ServiceInquiry status (adjust values based on your application's needs)
  enum ServiceInquiryStatus {
    Pending
    Responded
    Closed
  }

  # Enum for AdInquiry status (adjust values based on your application's needs)
  enum AdInquiryStatus {
    Pending
    Responded
    Closed
  }

  # Enum for message type in Chat (adjust based on your application's message types)
  enum MessageType {
    Text
    Image
    Video
    File
  }

  # Enum for service type in ServiceInquiry (adjust based on your application's service types)
  enum ServiceType {
    Catering
    Photography
    Venue
    Farmhouse
  }

  type Chat {
    id: ID!
    bookingId: ID
    senderId: ID!
    receiverId: ID!
    message: String!
    messageType: MessageType!
    parentMessageId: ID
    attachmentUrl: String
    serviceType: ServiceType
    venueId: ID
    farmhouseId: ID
    cateringPackageId: ID
    photographyPackageId: ID
    serviceAdId: ID
    status: ChatStatus!
    sentAt: String!
    deliveredAt: String
    readAt: String
    deletedAt: String
  }

  type ServiceInquiry {
    id: ID!
    chatId: ID!
    userId: ID!
    vendorId: ID!
    serviceType: ServiceType!
    serviceId: ID!
    inquiryText: String!
    status: ServiceInquiryStatus!
    convertedToBookingId: ID
    createdAt: String!
    updatedAt: String!
    closedAt: String
  }

  type AdInquiry {
    id: ID!
    chatId: ID!
    userId: ID!
    vendorId: ID!
    adId: ID!
    inquiryText: String!
    status: AdInquiryStatus!
    convertedToBookingId: ID
    createdAt: String!
    updatedAt: String!
    closedAt: String
  }

  type Query {
    # User-specific queries (requires authenticated user, not vendor)
    getUserChats: [Chat!]
    getUserServiceInquiries: [ServiceInquiry!]
    getUserAdInquiries: [AdInquiry!]

    # Vendor-specific queries (requires authenticated vendor, not user)
    getVendorChats: [Chat!]
    getVendorServiceInquiries: [ServiceInquiry!]
    getVendorAdInquiries: [AdInquiry!]

    # Admin-specific queries (admin access required)
    getAllChats: [Chat!]
    getAllServiceInquiries: [ServiceInquiry!]
    getAllAdInquiries: [AdInquiry!]
  }

  type Mutation {
    # Updates the status of a chat message (requires authenticated user or vendor)
    updateMessageStatus(chatId: ID!, status: ChatStatus!): Chat!
  }
`;