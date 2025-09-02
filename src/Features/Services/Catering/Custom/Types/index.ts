import { InferSelectModel } from 'drizzle-orm';
import { cateringCustomPackages } from '../../../../../Schema';

// Enum for package status
export enum CustomPackageStatus {
  Requested = 'Requested',
  Quoted = 'Quoted',
  Accepted = 'Accepted',
  Rejected = 'Rejected'
}

// Type for the custom package model
export type CustomCateringPackage = InferSelectModel<typeof cateringCustomPackages>;

// Input Types for GraphQL Mutations
export interface CreateCustomPackageInput {
  vendorId: string;
  orderDetails: string;
  guestCount: number;
  eventDate?: string;
}

export interface QuoteCustomPackageInput {
  response: any;
  packageId: string;
  price: number;
}

export interface RespondToQuoteInput {
  response: any;
  packageId: string;
  accepted: boolean;
  message?: string;
}

export interface AdminCustomPackageFilters {
  status?: CustomPackageStatus;
  vendorId?: string;
  userId?: string;
  minGuestCount?: number;
  maxGuestCount?: number;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

export interface CustomPackageListResponse {
  packages: CustomCateringPackage[];
  total: number;
  page: number;
  totalPages: number;
}

// Search Filters Interface
export interface CustomPackageSearchFilters {
  status?: CustomPackageStatus;
  minGuestCount?: number;
  maxGuestCount?: number;
  minPrice?: number;
  maxPrice?: number;
  startDate?: string;
  endDate?: string;
  searchTerm?: string; // For searching in order details
  sortBy?: 'price_asc' | 'price_desc' | 'guest_count_asc' | 'guest_count_desc' | 'event_date_asc' | 'event_date_desc' | 'created_at_asc' | 'created_at_desc';
  page?: number;
  limit?: number;
}

export interface CustomPackageSearchResponse {
  packages: CustomCateringPackage[];
  total: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface AdminCustomPackageFilters {
  status?: CustomPackageStatus;
  vendorId?: string;
  userId?: string;
  minGuestCount?: number;
  maxGuestCount?: number;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

// GraphQL Context Type
export interface GraphQLContext {
  user?: {
    id: string;
  };
  vendor?: {
    id: string;
  };
  admin?: boolean;
}

// Custom Error Class
export class CustomGraphQLError extends Error {
  extensions: {
    code: string;
    [key: string]: any;
  };

  constructor(message: string, extensions: { code: string; [key: string]: any }) {
    super(message);
    this.extensions = extensions;
    this.name = 'CustomGraphQLError';
  }

  static unauthenticated(message: string = 'Authentication required'): CustomGraphQLError {
    return new CustomGraphQLError(message, {
      code: 'UNAUTHENTICATED'
    });
  }

  static notFound(message: string = 'Resource not found'): CustomGraphQLError {
    return new CustomGraphQLError(message, {
      code: 'NOT_FOUND'
    });
  }

  static forbidden(message: string = 'Not authorized'): CustomGraphQLError {
    return new CustomGraphQLError(message, {
      code: 'FORBIDDEN'
    });
  }
}