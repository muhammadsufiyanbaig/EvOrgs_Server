import gql from "graphql-tag";

export const CateringPackageTypeDefs = gql`
  type CateringPackage {
    id: ID!
    vendorId: ID!
    packageName: String!
    serviceArea: [String!]!
    description: String!
    imageUrl: [String!]!
    price: Float!
    minGuests: Int!
    maxGuests: Int!
    menuItems: [String]
    dietaryOptions: [String]
    amenities: [String!]!
    isAvailable: Boolean!
    rating: Float
    reviewCount: Int!
    createdAt: String!
    updatedAt: String!
  }

  input CateringPackageInput {
    packageName: String!
    serviceArea: [String!]!
    description: String!
    imageUrl: [String!]!
    price: Float!
    minGuests: Int!
    maxGuests: Int!
    menuItems: [String]
    dietaryOptions: [String]
    amenities: [String!]!
  }

  input CateringPackageUpdateInput {
    packageName: String
    serviceArea: [String]
    description: String
    imageUrl: [String]
    price: Float
    minGuests: Int
    maxGuests: Int
    menuItems: [String]
    dietaryOptions: [String]
    amenities: [String]
  }

  input SearchCateringPackagesInput {
    packageName: String
    amenities: [String]
    serviceArea: [String]
    menuItems: [String]
  }

  type Query {
    cateringPackage(id: ID!): CateringPackage
    vendorCateringPackages: [CateringPackage!]!
    searchCateringPackages(input: SearchCateringPackagesInput!): [CateringPackage!]!
  }

  type Mutation {
    createCateringPackage(input: CateringPackageInput!): CateringPackage!
    updateCateringPackage(id: ID!, input: CateringPackageUpdateInput!): CateringPackage!
    deleteCateringPackage(id: ID!): Boolean!
    toggleCateringPackageAvailability(id: ID!): CateringPackage!
  }
`;