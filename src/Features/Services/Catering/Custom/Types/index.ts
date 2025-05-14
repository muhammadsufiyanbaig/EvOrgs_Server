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
  packageId: string;
  price: number;
}

export interface RespondToQuoteInput {
  packageId: string;
  response: CustomPackageStatus.Accepted | CustomPackageStatus.Rejected;
}

// Search Filters Interface
export interface CustomPackageSearchFilters {
  status?: CustomPackageStatus;
  minGuestCount?: number;
  maxGuestCount?: number;
  startDate?: string;
  endDate?: string;
}

// GraphQL Context Type
export interface GraphQLContext {
  user?: {
    id: string;
    // Add other user properties as needed
  };
  vendor?: {
    id: string;
    // Add other vendor properties as needed
  };
  admin?: {
    id: string;
    // Add other admin properties as needed
  };
  db: any; // Replace with your actual database type
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