import { CustomPackageService } from '../../Service';
import {
  GraphQLContext,
  CustomGraphQLError,
  CreateCustomPackageInput,
  QuoteCustomPackageInput,
  RespondToQuoteInput,
  CustomPackageSearchFilters
} from '../../Types';

export const customCateringResolvers = {
  Query: {
    // User fetches their own custom packages
    getUserCustomPackages: async (
      _: unknown, 
      __: unknown, 
      context: GraphQLContext
    ) => {
      if (!context.user) {
        throw CustomGraphQLError.unauthenticated();
      }

      const service = new CustomPackageService(context.db);
      return await service.getUserCustomPackages(context.user.id);
    },

    // Vendor fetches their custom packages
    getVendorCustomPackages: async (
      _: unknown, 
      __: unknown, 
      context: GraphQLContext
    ) => {
      if (!context.vendor) {
        throw CustomGraphQLError.unauthenticated();
      }

      const service = new CustomPackageService(context.db);
      return await service.getVendorCustomPackages(context.vendor.id);
    },

    // Get a single custom package by ID
    getCustomPackageById: async (
      _: unknown, 
      { packageId }: { packageId: string }, 
      context: GraphQLContext
    ) => {
      if (!context.user && !context.vendor) {
        throw CustomGraphQLError.unauthenticated();
      }

      const service = new CustomPackageService(context.db);
      return await service.getCustomPackageById(
        packageId, 
        context.user?.id, 
        context.vendor?.id
      );
    },

    // Search custom packages with various filters
    searchCustomPackages: async (
      _: unknown, 
      { filters }: { filters?: CustomPackageSearchFilters }, 
      context: GraphQLContext
    ) => {
      if (!context.vendor) {
        throw CustomGraphQLError.unauthenticated();
      }

      const service = new CustomPackageService(context.db);
      return await service.searchCustomPackages(context.vendor.id, filters);
    },
  },

  Mutation: {
    // User creates a custom package request
    createCustomPackageRequest: async (
      _: unknown, 
      { input }: { input: CreateCustomPackageInput }, 
      context: GraphQLContext
    ) => {
      if (!context.user) {
        throw CustomGraphQLError.unauthenticated();
      }

      const service = new CustomPackageService(context.db);
      return await service.createCustomPackageRequest(context.user.id, input);
    },

    // Vendor quotes a custom package
    quoteCustomPackage: async (
      _: unknown, 
      { input }: { input: QuoteCustomPackageInput }, 
      context: GraphQLContext
    ) => {
      if (!context.vendor) {
        throw CustomGraphQLError.unauthenticated();
      }

      const service = new CustomPackageService(context.db);
      return await service.quoteCustomPackage(context.vendor.id, input);
    },

    // User responds to a vendor's quote
    respondToCustomPackageQuote: async (
      _: unknown, 
      { input }: { input: RespondToQuoteInput }, 
      context: GraphQLContext
    ) => {
      if (!context.user) {
        throw CustomGraphQLError.unauthenticated();
      }

      const service = new CustomPackageService(context.db);
      return await service.respondToCustomPackageQuote(context.user.id, input);
    },
  }
};