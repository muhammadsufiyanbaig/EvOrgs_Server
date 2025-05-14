// src/Features/Photography/Resolvers.ts

import { Context } from '../../../../../../GraphQL/Context';
import { PhotographyService } from '../../Service';
import { CreatePhotographyPackageInput, UpdatePhotographyPackageInput, SearchPhotographyPackagesInput } from '../../Types';

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
    }
  }
};