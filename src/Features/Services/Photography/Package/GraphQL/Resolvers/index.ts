// src/Features/Photography/Resolvers.ts

import { Context } from '../../../../../../GraphQL/Context';
import { PhotographyService } from '../../Service';
import { CreatePhotographyPackageInput, UpdatePhotographyPackageInput, SearchPhotographyPackagesInput, AdminPackageFilters } from '../../Types';

export const photographyResolvers = {
  Query: {
    // Get a single photography package by ID
    photographPackage: async (_: any, { id }: { id: string }, context: Context) => {
      const { db } = context;
      const photographyService = new PhotographyService(db);
      
      return photographyService.getPackageById(id);
    },
    
    // Get all photography packages for a vendor
    vendorPhotographPackages: async (_: any, __: any, context: Context) => {
      const { db, vendor } = context;
      const photographyService = new PhotographyService(db);
      
      return photographyService.getVendorPackages(vendor);
    },
    
    // Search photography packages by criteria
    searchPhotographPackages: async (_: any, { input }: { input: SearchPhotographyPackagesInput }, context: Context) => {
      const { db } = context;
      const photographyService = new PhotographyService(db);
      
      return photographyService.searchPackages(input);
    },

    // ================ ADMIN QUERIES ================

    // Public: Get all packages with filtering and pagination (No authentication required)
    adminGetAllPackages: async (_: any, { filters }: { filters?: AdminPackageFilters }, context: Context) => {
      const { db } = context;
      const photographyService = new PhotographyService(db);
      
      return photographyService.getAllPackagesForAdmin(filters || {}, undefined);
    },

    // Admin: Get package by ID with vendor details
    adminGetPackage: async (_: any, { id }: { id: string }, context: Context) => {
      const { db, Admin } = context;
      const photographyService = new PhotographyService(db);
      
      return photographyService.getPackageWithVendorById(id, Admin);
    },

    // Admin: Get package statistics
    adminGetPackageStatistics: async (_: any, __: any, context: Context) => {
      const { db, Admin } = context;
      const photographyService = new PhotographyService(db);
      
      return photographyService.getPackageStatistics(Admin);
    },

    // Admin: Get recent packages
    adminGetRecentPackages: async (_: any, { limit }: { limit?: number }, context: Context) => {
      const { db, Admin } = context;
      const photographyService = new PhotographyService(db);
      
      return photographyService.getRecentPackages(limit, Admin);
    },

    // Admin: Get packages by availability status
    adminGetPackagesByAvailability: async (_: any, { isAvailable }: { isAvailable: boolean }, context: Context) => {
      const { db, Admin } = context;
      const photographyService = new PhotographyService(db);
      
      return photographyService.getPackagesByAvailability(isAvailable, Admin);
    },

    // Admin: Get high-value packages
    adminGetHighValuePackages: async (_: any, { minPrice }: { minPrice: number }, context: Context) => {
      const { db, Admin } = context;
      const photographyService = new PhotographyService(db);
      
      return photographyService.getHighValuePackages(minPrice, Admin);
    },

    // Admin: Get packages by vendor
    adminGetPackagesByVendor: async (_: any, { vendorId }: { vendorId: string }, context: Context) => {
      const { db, Admin } = context;
      const photographyService = new PhotographyService(db);
      
      return photographyService.getPackagesByVendor(vendorId, Admin);
    }
  },
  
  Mutation: {
    // Create a new photography package
    createPhotographPackage: async (_: any, { input }: { input: CreatePhotographyPackageInput }, context: Context) => {
      const { db, vendor } = context;
      const photographyService = new PhotographyService(db);
      
      return photographyService.createPackage(input, vendor);
    },
    
    // Update an existing photography package
    updatePhotographPackage: async (_: any, { id, input }: { id: string, input: UpdatePhotographyPackageInput }, context: Context) => {
      const { db, vendor } = context;
      const photographyService = new PhotographyService(db);
      
      return photographyService.updatePackage(id, input, vendor);
    },
    
    // Delete a photography package
    deletePhotographPackage: async (_: any, { id }: { id: string }, context: Context) => {
      const { db, vendor } = context;
      const photographyService = new PhotographyService(db);
      
      return photographyService.deletePackage(id, vendor);
    },
    
    // Toggle photography package availability
    togglePhotographPackageAvailability: async (_: any, { id }: { id: string }, context: Context) => {
      const { db, vendor } = context;
      const photographyService = new PhotographyService(db);
      
      return photographyService.togglePackageAvailability(id, vendor);
    },

    // ================ ADMIN MUTATIONS ================

    // Admin: Update package status
    adminUpdatePackageStatus: async (_: any, { id, isAvailable }: { id: string, isAvailable: boolean }, context: Context) => {
      const { db, Admin } = context;
      const photographyService = new PhotographyService(db);
      
      return photographyService.updatePackageStatus(id, isAvailable, Admin);
    },

    // Admin: Delete package
    adminDeletePackage: async (_: any, { id }: { id: string }, context: Context) => {
      const { db, Admin } = context;
      const photographyService = new PhotographyService(db);
      
      return photographyService.adminDeletePackage(id, Admin);
    }
  }
};