import { sql, eq, and } from 'drizzle-orm';
import { cateringCustomPackages } from '../../../../../../Schema';
import {
  CustomPackageStatus,
  CreateCustomPackageInput,
  QuoteCustomPackageInput,
  RespondToQuoteInput,
  CustomPackageSearchFilters,
  GraphQLContext,
  CustomGraphQLError
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

      return await context.db
        .select()
        .from(cateringCustomPackages)
        .where(eq(cateringCustomPackages.userId, context.user.id));
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

      return await context.db
        .select()
        .from(cateringCustomPackages)
        .where(eq(cateringCustomPackages.vendorId, context.vendor.id));
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

      const [customPackage] = await context.db
        .select()
        .from(cateringCustomPackages)
        .where(eq(cateringCustomPackages.id, packageId))
        .limit(1);

      if (!customPackage) {
        throw CustomGraphQLError.notFound('Package not found');
      }

      // Additional authorization check
      if (context.user && customPackage.userId !== context.user.id) {
        throw CustomGraphQLError.forbidden();
      }
      if (context.vendor && customPackage.vendorId !== context.vendor.id) {
        throw CustomGraphQLError.forbidden();
      }

      return customPackage;
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

      // Build dynamic where clause
      const whereConditions = [] as any[];

      // Vendor can only see their own packages
      whereConditions.push(eq(cateringCustomPackages.vendorId, context.vendor.id));

      // Status filter
      if (filters?.status) {
        whereConditions.push(eq(cateringCustomPackages.status, filters.status));
      }

      // Guest count filters
      if (filters?.minGuestCount) {
        whereConditions.push(sql`guest_count >= ${filters.minGuestCount}`);
      }
      if (filters?.maxGuestCount) {
        whereConditions.push(sql`guest_count <= ${filters.maxGuestCount}`);
      }

      // Date range filters
      if (filters?.startDate) {
        whereConditions.push(sql`event_date >= ${filters.startDate}`);
      }
      if (filters?.endDate) {
        whereConditions.push(sql`event_date <= ${filters.endDate}`);
      }

      return await context.db
        .select()
        .from(cateringCustomPackages)
        .where(and(...whereConditions));
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

      // Input validation
      if (input.guestCount <= 0) {
        throw new CustomGraphQLError('Guest count must be positive', {
          code: 'BAD_INPUT',
          details: 'Guest count must be greater than zero'
        });
      }

      const [newPackage] = await context.db
        .insert(cateringCustomPackages)
        .values({
          vendorId: input.vendorId,
          userId: context.user.id,
          orderDetails: input.orderDetails,
          guestCount: input.guestCount,
          eventDate: input.eventDate ? new Date(input.eventDate) : null,
          status: CustomPackageStatus.Requested,
          price: 0, // Initial price set to 0
        })
        .returning();

      return newPackage;
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

      // Validate price
      if (input.price <= 0) {
        throw new CustomGraphQLError('Price must be positive', {
          code: 'BAD_INPUT',
          details: 'Price must be greater than zero'
        });
      }

      // Ensure the package belongs to this vendor and is in 'Requested' status
      const [existingPackage] = await context.db
        .select()
        .from(cateringCustomPackages)
        .where(
          and(
            eq(cateringCustomPackages.id, input.packageId),
            eq(cateringCustomPackages.vendorId, context.vendor.id),
            eq(cateringCustomPackages.status, CustomPackageStatus.Requested)
          )
        )
        .limit(1);

      if (!existingPackage) {
        throw CustomGraphQLError.notFound('Package not found or not in quotable status');
      }

      const [updatedPackage] = await context.db
        .update(cateringCustomPackages)
        .set({
          price: input.price,
          status: CustomPackageStatus.Quoted,
          updatedAt: new Date()
        })
        .where(eq(cateringCustomPackages.id, input.packageId))
        .returning();

      return updatedPackage;
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

      // Ensure the package belongs to this user and is in 'Quoted' status
      const [existingPackage] = await context.db
        .select()
        .from(cateringCustomPackages)
        .where(
          and(
            eq(cateringCustomPackages.id, input.packageId),
            eq(cateringCustomPackages.userId, context.user.id),
            eq(cateringCustomPackages.status, CustomPackageStatus.Quoted)
          )
        )
        .limit(1);

      if (!existingPackage) {
        throw CustomGraphQLError.notFound('Package not found or not in quotable status');
      }

      const [updatedPackage] = await context.db
        .update(cateringCustomPackages)
        .set({
          status: input.response,
          updatedAt: new Date()
        })
        .where(eq(cateringCustomPackages.id, input.packageId))
        .returning();

      return updatedPackage;
    },
  }
};