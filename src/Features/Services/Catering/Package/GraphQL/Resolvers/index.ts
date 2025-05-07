import { Context } from '../../../../../../GraphQL/Context';
import { cateringPackages } from '../../../../../../Schema';
import { eq, and, ilike, like, count } from 'drizzle-orm';
import {
  CateringPackageInput,
  CateringPackageUpdateInput,
  SearchCateringPackagesInput
} from '../../Types';

export const resolvers = {
  Query: {
    cateringPackage: async (_: any, { id }: { id: string }, context: Context) => {
      if (!context.vendor) {
        throw new Error('Authentication required');
      }

      const result = await context.db
        .select()
        .from(cateringPackages)
        .where(eq(cateringPackages.id, id))
        .limit(1);

      if (result.length === 0) {
        throw new Error('Catering package not found');
      }

      if (result[0].vendorId !== context.vendor.id) {
        throw new Error('Unauthorized: You can only access your own catering packages');
      }

      return result[0];
    },

    vendorCateringPackages: async (_: any, __: any, context: Context) => {
      if (!context.vendor) {
        throw new Error('Authentication required');
      }

      const packages = await context.db
        .select()
        .from(cateringPackages)
        .where(eq(cateringPackages.vendorId, context.vendor.id));

      return packages;
    },

    searchCateringPackages: async (
      _: any,
      { input, page = 1, limit = 10 }: { input: SearchCateringPackagesInput; page?: number; limit?: number },
      context: Context
    ) => {
      const { packageName, amenities, serviceArea, menuItems } = input;
      const conditions: any[] = [];

      if (packageName) {
        conditions.push(ilike(cateringPackages.packageName, `%${packageName}%`));
      }

      if (amenities && amenities.length > 0) {
        for (const amenity of amenities) {
          conditions.push(like(cateringPackages.amenities, `%${amenity}%`));
        }
      }

      if (serviceArea && serviceArea.length > 0) {
        for (const area of serviceArea) {
          conditions.push(like(cateringPackages.serviceArea, `%${area}%`));
        }
      }

      if (menuItems && menuItems.length > 0) {
        for (const item of menuItems) {
          conditions.push(like(cateringPackages.menuItems, `%${item}%`));
        }
      }

      conditions.push(eq(cateringPackages.isAvailable, true));

      const offset = (page - 1) * limit;
      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const packages = await context.db
        .select()
        .from(cateringPackages)
        .where(whereClause)
        .limit(limit)
        .offset(offset);

      const totalResult = await context.db
        .select({ count: count() })
        .from(cateringPackages)
        .where(whereClause);

      const totalCount = Number(totalResult[0]?.count ?? 0);

      return {
        packages,
        totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      };
    },
  },

  Mutation: {
    createCateringPackage: async (_: any, { input }: { input: CateringPackageInput }, context: Context) => {
      if (!context.vendor) {
        throw new Error('Authentication required');
      }

      const {
        packageName,
        serviceArea,
        description,
        imageUrl,
        price,
        minGuests,
        maxGuests,
        menuItems,
        dietaryOptions,
        amenities,
      } = input;

      if (minGuests > maxGuests) {
        throw new Error('Minimum guests cannot be greater than maximum guests');
      }

      if (price <= 0) {
        throw new Error('Price must be greater than zero');
      }

      const now = new Date();

      const [newPackage] = await context.db
        .insert(cateringPackages)
        .values({
          vendorId: context.vendor.id,
          packageName,
          serviceArea,
          description,
          imageUrl,
          price,
          minGuests,
          maxGuests,
          menuItems: menuItems || [],
          dietaryOptions: dietaryOptions || [],
          amenities: amenities || [],
          isAvailable: true,
          reviewCount: 0,
          createdAt: now,
          updatedAt: now,
        })
        .returning();

      return newPackage;
    },

    updateCateringPackage: async (_: any, { id, input }: { id: string; input: CateringPackageUpdateInput }, context: Context) => {
      if (!context.vendor) {
        throw new Error('Authentication required');
      }

      const existingPackages = await context.db
        .select()
        .from(cateringPackages)
        .where(and(eq(cateringPackages.id, id), eq(cateringPackages.vendorId, context.vendor.id)))
        .limit(1);

      if (existingPackages.length === 0) {
        throw new Error('Catering package not found or unauthorized');
      }

      if (input.minGuests && input.maxGuests && input.minGuests > input.maxGuests) {
        throw new Error('Minimum guests cannot be greater than maximum guests');
      }

      if (input.price !== undefined && input.price <= 0) {
        throw new Error('Price must be greater than zero');
      }

      const { price, ...rest } = input;

      const [updatedPackage] = await context.db
        .update(cateringPackages)
        .set({
          ...rest,
          ...(price !== undefined ? { price: price.toString() } : {}),
          updatedAt: new Date(),
        })
        .where(eq(cateringPackages.id, id))
        .returning();

      return updatedPackage;
    },

    deleteCateringPackage: async (_: any, { id }: { id: string }, context: Context) => {
      if (!context.vendor) {
        throw new Error('Authentication required');
      }

      const existingPackages = await context.db
        .select()
        .from(cateringPackages)
        .where(and(eq(cateringPackages.id, id), eq(cateringPackages.vendorId, context.vendor.id)))
        .limit(1);

      if (existingPackages.length === 0) {
        throw new Error('Catering package not found or unauthorized');
      }

      const result = await context.db
        .delete(cateringPackages)
        .where(eq(cateringPackages.id, id))
        .returning();

      return result.length > 0;
    },

    toggleCateringPackageAvailability: async (_: any, { id }: { id: string }, context: Context) => {
      if (!context.vendor) {
        throw new Error('Authentication required');
      }

      const existingPackages = await context.db
        .select()
        .from(cateringPackages)
        .where(and(eq(cateringPackages.id, id), eq(cateringPackages.vendorId, context.vendor.id)))
        .limit(1);

      if (existingPackages.length === 0) {
        throw new Error('Catering package not found or unauthorized');
      }

      const currentStatus = existingPackages[0].isAvailable;

      const [updatedPackage] = await context.db
        .update(cateringPackages)
        .set({
          isAvailable: !currentStatus,
          updatedAt: new Date(),
        })
        .where(eq(cateringPackages.id, id))
        .returning();

      return updatedPackage;
    },
  },
};