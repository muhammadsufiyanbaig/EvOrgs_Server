// types/blog.types.ts

import { DrizzleDB } from "../../../Config/db";
import { InferSelectModel } from 'drizzle-orm';
import { admin, users, vendors } from '../../../Schema'; // Import your schema tables

// Use Drizzle's type inference to automatically match database schema
export type Admin = InferSelectModel<typeof admin>;
export type User = InferSelectModel<typeof users>;
export type Vendor = InferSelectModel<typeof vendors>;
export type AuthorRole = 'Vendor' | 'Admin';
export interface Blog {
  id: string;
  authorId: string;
  authorRole: AuthorRole; 
  title: string;
  slug: string;
  summary: string;
  
  content: string;
  featuredImage?: string;
  tags: string[];
  status: 'Draft' | 'Published' | 'Archived';
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date | null;
}

export interface BlogComment {
  id: string;
  blogId: string;
  userId: string;
  comment: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogLike {
  id: string;
  blogId: string;
  userId: string;
  createdAt: Date;
}

export type Author = Vendor | Admin | User;

// Input Types
export interface CreateBlogInput {
  title: string;
  summary: string;
  content: string;
  featuredImage?: string;
  tags?: string[];
  status?: 'Draft' | 'Published';
}

export interface UpdateBlogInput {
  title?: string;
  summary?: string;
  content?: string;
  featuredImage?: string;
  tags?: string[];
  status?: 'Draft' | 'Published' | 'Archived';
}

export interface BlogFilters {
  status?: 'Draft' | 'Published' | 'Archived';
  authorRole?: 'Vendor' | 'Admin';
  authorId?: string;
  tags?: string[];
}

export interface PaginationInput {
  page?: number;
  limit?: number;
}

// Response Types
export interface PaginatedBlogsResponse {
  blogs: Blog[];
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  currentPage: number;
  totalPages: number;
}

export interface BlogWithRelations extends Blog {
  author?: Author;
  comments?: BlogComment[];
  likes?: BlogLike[];
  likesCount?: number;
  commentsCount?: number;
}
