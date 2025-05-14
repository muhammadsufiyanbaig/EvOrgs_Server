
// TYPE DEFS
// Features/Farmhouse/TypeDefs/FarmhouseTypeDefs.ts
import { gql } from 'apollo-server-express';

export const farmhouseTypeDefs = gql`
  type Farmhouse {
    id: ID!
    vendorId: ID!
    name: String!
    location: String!
    description: String!
    imageUrl: [String!]!
    perNightPrice: Float!
    minNights: Int!
    maxNights: Int
    maxGuests: Int!
    amenities: [String!]!
    isAvailable: Boolean!
    rating: Float
    reviewCount: Int!
    createdAt: String!
    updatedAt: String!
  }

  type PaginatedFarmhouses {
    farmhouses: [Farmhouse!]!
    totalCount: Int!
    page: Int!
    limit: Int!
    totalPages: Int!
  }

  input CreateFarmhouseInput {
    name: String!
    location: String!
    description: String!
    imageUrl: [String!]!
    perNightPrice: Float!
    minNights: Int
    maxNights: Int
    maxGuests: Int!
    amenities: [String!]!
    isAvailable: Boolean
  }

  input UpdateFarmhouseInput {
    id: ID!
    name: String
    location: String
    description: String
    imageUrl: [String!]
    perNightPrice: Float
    minNights: Int
    maxNights: Int
    maxGuests: Int
    amenities: [String!]
    isAvailable: Boolean
  }

  input DeleteFarmhouseInput {
    id: ID!
  }

  input ToggleFarmhouseInput {
    id: ID!
    isAvailable: Boolean!
  }

  input FarmhouseFilters {
    id: ID
    amenities: [String!]
    minPrice: Float
    maxPrice: Float
    minNights: Int
    maxNights: Int
    maxGuests: Int
    isAvailable: Boolean
  }

  input SearchFarmhouseInput {
    filters: FarmhouseFilters!
    page: Int
    limit: Int
  }

  type DeleteFarmhouseResponse {
    id: ID!
    success: Boolean!
    message: String!
  }

  type Query {
    farmhouse(id: ID!): Farmhouse!
    vendorFarmhouses(isAvailable: Boolean): [Farmhouse!]!
    searchFarmhouses(input: SearchFarmhouseInput!): PaginatedFarmhouses!
  }

  type Mutation {
    createFarmhouse(input: CreateFarmhouseInput!): Farmhouse!
    updateFarmhouse(input: UpdateFarmhouseInput!): Farmhouse!
    deleteFarmhouse(input: DeleteFarmhouseInput!): DeleteFarmhouseResponse!
    toggleFarmhouseAvailability(input: ToggleFarmhouseInput!): Farmhouse!
  }
`;