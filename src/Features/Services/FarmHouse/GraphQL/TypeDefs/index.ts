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
    # Public access - only available farmhouses
    farmhouses: [Farmhouse!]!
    
    # Get specific farmhouse by ID
    farmhouse(id: ID!): Farmhouse!
    
    # Admin access - all farmhouses regardless of availability
    adminAllFarmhouses: [Farmhouse!]!
    
    # Vendor access - only their own farmhouses
    vendorFarmhouses(isAvailable: Boolean): [Farmhouse!]!
    
    # Search farmhouses with filters and pagination
    searchFarmhouses(input: SearchFarmhouseInput!): PaginatedFarmhouses!
  }

  type Mutation {
    createFarmhouse(input: CreateFarmhouseInput!): Farmhouse!
    updateFarmhouse(input: UpdateFarmhouseInput!): Farmhouse!
    deleteFarmhouse(input: DeleteFarmhouseInput!): DeleteFarmhouseResponse!
    toggleFarmhouseAvailability(input: ToggleFarmhouseInput!): Farmhouse!
  }
`;