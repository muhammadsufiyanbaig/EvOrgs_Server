"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.venueTypeDefs = void 0;
const apollo_server_express_1 = require("apollo-server-express");
exports.venueTypeDefs = (0, apollo_server_express_1.gql) `
  type Venue {
    id: ID!
    vendorId: ID!
    name: String!
    location: String!
    description: String!
    imageUrl: [String!]!
    price: String!
    tags: [String!]!
    amenities: [String!]! 
    minPersonLimit: Int!
    maxPersonLimit: Int!
    isAvailable: Boolean!
    rating: Float
    reviewCount: Int!
    createdAt: String!
    updatedAt: String!
  }

  input VenueInput {
    name: String!
    location: String!
    description: String!
    imageUrl: [String!]!
    price: String!
    tags: [String!]!
    amenities: [String!]!
    minPersonLimit: Int!
    maxPersonLimit: Int!
    isAvailable: Boolean
  }

  input VenueUpdateInput {
    id: ID!
    name: String
    location: String
    description: String
    imageUrl: [String!]
    price: String
    tags: [String!]
    amenities: [String!]
    minPersonLimit: Int
    maxPersonLimit: Int
    isAvailable: Boolean
    rating: Float
    reviewCount: Int
  }

  type Query {
    # Public access - only available venues
    venues: [Venue!]!
    
    # Get specific venue by ID
    venue(id: ID!): Venue
    
    # Admin access - all venues regardless of availability/status
    adminAllVenues: [Venue!]!
    
    # Vendor access - only their own venues
    vendorVenues: [Venue!]!
    
    # Search venues with filters
    searchVenues(
      tags: [String!], 
      minPrice: String, 
      maxPrice: String, 
      minCapacity: Int,
      maxCapacity: Int,
      location: String
    ): [Venue!]!
  }

  type Mutation {
    createVenue(input: VenueInput!): Venue!
    updateVenue(input: VenueUpdateInput!): Venue!
    deleteVenue(id: ID!): Boolean!
    toggleVenueAvailability(id: ID!, isAvailable: Boolean!): Venue!
  }
`;
