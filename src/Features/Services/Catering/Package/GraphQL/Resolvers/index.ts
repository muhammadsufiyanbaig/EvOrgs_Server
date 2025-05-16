// resolvers/CateringPackageResolver.ts
import { CateringPackageService } from '../../Service';
import { Context } from '../../../../../../GraphQL/Context';
import {
  CateringPackage,
  CateringPackageInput,
  CateringPackageUpdateInput,
  SearchCateringPackagesInput
} from '../../Types';

type SearchResult = {
  packages: CateringPackage[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
};

export const cateringPackageResolvers = {
  Query: {
    cateringPackage: async (
      _: unknown,
      { id }: { id: string },
      context: Context
    ): Promise<CateringPackage> => {
      if (!context.vendor) {
        throw new Error('Authentication required');
      }

      const service = new CateringPackageService(context.db);
      return await service.getCateringPackageById(id, context.vendor.id);
    },

    vendorCateringPackages: async (
      _: unknown,
      __: unknown,
      context: Context
    ): Promise<CateringPackage[]> => {
      if (!context.vendor) {
        throw new Error('Authentication required');
      }

      const service = new CateringPackageService(context.db);
      return await service.getVendorCateringPackages(context.vendor.id);
    },

    searchCateringPackages: async (
      _: unknown,
      {
        input,
        page = 1,
        limit = 10
      }: {
        input: SearchCateringPackagesInput;
        page?: number;
        limit?: number
      },
      context: Context
    ): Promise<SearchResult> => {
      const service = new CateringPackageService(context.db);
      return await service.searchCateringPackages(input, page, limit);
    },
  },

  Mutation: {
    createCateringPackage: async (
      _: unknown,
      { input }: { input: CateringPackageInput },
      context: Context
    ): Promise<CateringPackage> => {
      if (!context.vendor) {
        throw new Error('Authentication required');
      }

      const service = new CateringPackageService(context.db);
      return await service.createCateringPackage(input, context.vendor.id);
    },

    updateCateringPackage: async (
      _: unknown,
      {
        id,
        input
      }: {
        id: string;
        input: CateringPackageUpdateInput
      },
      context: Context
    ): Promise<CateringPackage> => {
      if (!context.vendor) {
        throw new Error('Authentication required');
      }

      const service = new CateringPackageService(context.db);
      return await service.updateCateringPackage(id, input, context.vendor.id);
    },

    deleteCateringPackage: async (
      _: unknown,
      { id }: { id: string },
      context: Context
    ): Promise<boolean> => {
      if (!context.vendor) {
        throw new Error('Authentication required');
      }

      const service = new CateringPackageService(context.db);
      return await service.deleteCateringPackage(id, context.vendor.id);
    },

    toggleCateringPackageAvailability: async (
      _: unknown,
      { id }: { id: string },
      context: Context
    ): Promise<CateringPackage> => {
      if (!context.vendor) {
        throw new Error('Authentication required');
      }

      const service = new CateringPackageService(context.db);
      return await service.toggleCateringPackageAvailability(id, context.vendor.id);
    },
  },
};