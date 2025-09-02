import { CustomPackageService } from '../../Service';
import {
  CustomGraphQLError,
  CreateCustomPackageInput,
  QuoteCustomPackageInput,
  RespondToQuoteInput,
  CustomPackageSearchFilters,
  AdminCustomPackageFilters
} from '../../Types';
import { Context } from '../../../../../../GraphQL/Context';

export const customCateringResolvers = {
  Query: {
    // Admin fetches all custom packages with filters
    adminGetAllCustomPackages: async (
      _: unknown,
      { filters }: { filters?: AdminCustomPackageFilters },
      context: Context
    ) => {
      if (!context.Admin) {
        throw CustomGraphQLError.forbidden();
      }

      const service = new CustomPackageService(context.db);
      return await service.getAllCustomPackagesForAdmin(filters);
    },
    // User fetches their own custom packages
    getUserCustomPackages: async (
      _: unknown, 
      __: unknown, 
      context: Context
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
      context: Context
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
      context: Context
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
      context: Context
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
      context: Context
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
      context: Context
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
      context: Context
    ) => {
      if (!context.user) {
        throw CustomGraphQLError.unauthenticated();
      }

      const service = new CustomPackageService(context.db);
      return await service.respondToCustomPackageQuote(context.user.id, input);
    },
  }
};