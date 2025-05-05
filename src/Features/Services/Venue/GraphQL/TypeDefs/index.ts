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
    # Get all venues (filtered by public/admin status)
    venues: [Venue!]!
    
    # Get a specific venue by ID
    venue(id: ID!): Venue
    
    # Get venues belonging to the authenticated vendor
    vendorVenues: [Venue!]!
    
    # Get venues with optional filtering
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
    # Create a new venue (vendor only)
    createVenue(input: VenueInput!): Venue!
    
    # Update an existing venue (vendor or admin)
    updateVenue(input: VenueUpdateInput!): Venue!
    
    # Delete a venue (vendor or admin)
    deleteVenue(id: ID!): Boolean!
    
    # Toggle availability status (vendor only)
    toggleVenueAvailability(id: ID!, isAvailable: Boolean!): Venue!
  }
`;
