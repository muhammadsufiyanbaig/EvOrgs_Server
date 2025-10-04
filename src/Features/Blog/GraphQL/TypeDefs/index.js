"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogTypeDefs = void 0;
exports.blogTypeDefs = `
  type Blog {
    id: ID!
    authorId: ID!
    authorRole: AuthorRole!
    title: String!
    slug: String!
    summary: String
    content: String!
    featuredImage: String
    tags: [String!]
    status: BlogStatus!
    viewCount: Int!
    createdAt: String!
    updatedAt: String!
    publishedAt: String
    author: Author
    comments: [BlogComment!]!
    likes: [BlogLike!]!
    likesCount: Int!
    commentsCount: Int!
  }

  union Author = User | Vendor | Admin

  type Vendor {
    id: ID!
    name: String!
    email: String!
    businessName: String
  }

  type Admin {
    id: ID!
    name: String!
    email: String!
    role: String
  }

  type BlogComment {
    id: ID!
    blogId: ID!
    userId: ID!
    comment: String!
    isApproved: Boolean!
    createdAt: String!
    updatedAt: String!
    user: User!
  }

  type BlogLike {
    id: ID!
    blogId: ID!
    userId: ID!
    createdAt: String!
    user: User!
  }

  enum AuthorRole {
    Vendor
    Admin
  }

  enum BlogStatus {
    Draft
    Published
    Archived
  }

  input CreateBlogInput {
    title: String!
    summary: String
    content: String!
    featuredImage: String
    tags: [String!]
    status: BlogStatus = Published
  }

  input UpdateBlogInput {
    title: String
    summary: String
    content: String
    featuredImage: String
    tags: [String!]
    status: BlogStatus
  }

  input BlogFilters {
    status: BlogStatus
    authorRole: AuthorRole
    tags: [String!]
    authorId: ID
  }

  input BlogPaginationInput {
    page: Int = 1
    limit: Int = 10
  }

  type BlogConnection {
    blogs: [Blog!]!
    totalCount: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    currentPage: Int!
    totalPages: Int!
  }

  type Query {
    # Get all blogs with filters and pagination
    getBlogs(filters: BlogFilters, pagination: BlogPaginationInput): BlogConnection!
    
    # Get single blog by ID or slug
    getBlog(id: ID, slug: String): Blog
    
    # Get blogs by current authenticated user
    getMyBlogs(pagination: BlogPaginationInput): BlogConnection!
    
    # Get popular blogs (most viewed)
    getPopularBlogs(limit: Int = 10): [Blog!]!
    
    # Get recent blogs
    getRecentBlogs(limit: Int = 10): [Blog!]!
    
    # Search blogs
    searchBlogs(query: String!, pagination: BlogPaginationInput): BlogConnection!
  }

  type Mutation {
    # Blog CRUD operations
    createBlog(input: CreateBlogInput!): Blog!
    updateBlog(id: ID!, input: UpdateBlogInput!): Blog!
    deleteBlog(id: ID!): Boolean!
    
    # Blog status management
    publishBlog(id: ID!): Blog!
    archiveBlog(id: ID!): Blog!
    
    # Comment operations
    addComment(blogId: ID!, comment: String!): BlogComment!
    updateComment(id: ID!, comment: String!): BlogComment!
    deleteComment(id: ID!): Boolean!
    approveComment(id: ID!): BlogComment! # Admin only
    
    # Like operations
    likeBlog(blogId: ID!): BlogLike!
    unlikeBlog(blogId: ID!): Boolean!
  }
`;
