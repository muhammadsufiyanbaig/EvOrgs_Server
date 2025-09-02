// RESOLVER
// Features/Farmhouse/Resolver/FarmhouseResolver.ts
import { FarmhouseService } from '../../Service';
import { 
  CreateFarmhouseInput, 
  UpdateFarmhouseInput, 
  DeleteFarmhouseInput,
  ToggleFarmhouseInput,
  SearchFarmhouseInput
} from '../../Types';
import { Context } from '../../../../../GraphQL/Context';

export const farmhouseResolvers = {
  Query: {
    // Get a farmhouse by its ID (public)
    farmhouse: async (_: any, { id }: { id: string }, context: Context) => {
      const farmhouseService = new FarmhouseService(context.db);
      return farmhouseService.getFarmhouseById(id);
    },
// Get all farmhouses for admin (admin only - all farmhouses regardless of availability)
    adminAllFarmhouses: async (_: any, __: any, context: Context) => {
      if (!context.Admin) {
        throw new Error('Admin authentication required');
      }

      const farmhouseService = new FarmhouseService(context.db);
      return farmhouseService.getAllFarmhousesForAdmin();
    },
    // Get all farmhouses for a vendor (vendor-only)
    vendorFarmhouses: async (_: any, { isAvailable }: { isAvailable?: boolean }, context: Context) => {
      // Check if vendor is authenticated
      if (!context.vendor) {
        throw new Error('Not authenticated as vendor');
      }

      const vendorId = context.vendor.id;
      const farmhouseService = new FarmhouseService(context.db);
      
      return farmhouseService.getVendorFarmhouses(vendorId, isAvailable);
    },

    // Search for farmhouses based on filters (public)
    searchFarmhouses: async (_: any, { input }: { input: SearchFarmhouseInput }, context: Context) => {
      const farmhouseService = new FarmhouseService(context.db);
      return farmhouseService.searchFarmhouses(input);
    },
  },
  
  Mutation: {
    // Create a new farmhouse
    createFarmhouse: async (_: any, { input }: { input: CreateFarmhouseInput }, context: Context) => {
      // Check if vendor is authenticated
      if (!context.vendor) {
        throw new Error('Not authenticated as vendor');
      }
      
      const vendorId = context.vendor.id;
      const farmhouseService = new FarmhouseService(context.db);
      
      return farmhouseService.createFarmhouse(input, vendorId);
    },
    
    // Update an existing farmhouse
    updateFarmhouse: async (_: any, { input }: { input: UpdateFarmhouseInput }, context: Context) => {
      // Check if vendor is authenticated
      if (!context.vendor) {
        throw new Error('Not authenticated as vendor');
      }

      const vendorId = context.vendor.id;
      const farmhouseService = new FarmhouseService(context.db);
      
      return farmhouseService.updateFarmhouse(input, vendorId);
    },
    
    // Delete a farmhouse
    deleteFarmhouse: async (_: any, { input }: { input: DeleteFarmhouseInput }, context: Context) => {
      // Check if vendor is authenticated
      if (!context.vendor) {
        throw new Error('Not authenticated as vendor');
      }

      const vendorId = context.vendor.id;
      const farmhouseService = new FarmhouseService(context.db);
      
      return farmhouseService.deleteFarmhouse(input, vendorId);
    },

    // Toggle farmhouse availability
    toggleFarmhouseAvailability: async (_: any, { input }: { input: ToggleFarmhouseInput }, context: Context) => {
      // Check if vendor is authenticated
      if (!context.vendor) {
        throw new Error('Not authenticated as vendor');
      }

      const vendorId = context.vendor.id;
      const farmhouseService = new FarmhouseService(context.db);
      
      return farmhouseService.toggleFarmhouseAvailability(input, vendorId);
    }
  },
};
