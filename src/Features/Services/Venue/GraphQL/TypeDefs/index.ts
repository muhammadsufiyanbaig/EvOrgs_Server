import { gql } from 'apollo-server-express';

export const venueTypeDefs = gql`
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
    venues: [Venue!]!
    venue(id: ID!): Venue
    vendorVenues: [Venue!]!
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
