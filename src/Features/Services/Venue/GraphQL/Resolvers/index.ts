import { Context } from '../../../../../GraphQL/Context';
import { VenueService } from '../../Service';
import { VenueInput, VenueUpdateInput } from '../../Types';

export const venueResolver = {
  Query: {
    // Get a specific venue by ID
    venue: async (_: any, { id }: { id: string }, context: Context) => {
      const venueService = new VenueService(context.db);
      return await venueService.getVenueById(id);
    },

    // Get venues belonging to the authenticated vendor
    vendorVenues: async (_: any, __: any, context: Context) => {
      if (!context.vendor) {
        throw new Error('Vendor authentication required');
      }

      const venueService = new VenueService(context.db);
      return await venueService.getVenuesByVendorId(context.vendor.id);
    },

    // Get all venues (public - no authentication required)
    adminAllVenues: async (_: any, __: any, context: Context) => {
      const venueService = new VenueService(context.db);
      return await venueService.getAllVenuesForAdmin();
    },
    
    // Search venues with filters
    searchVenues: async (_: any, filters: {
      tags?: string[];
      minPrice?: string;
      maxPrice?: string;
      minCapacity?: number;
      maxCapacity?: number;
      location?: string;
    }, context: Context) => {
      const venueService = new VenueService(context.db);
      return await venueService.searchVenues(filters);
    },
  },

  Mutation: {
    // Create a new venue - vendor only
    createVenue: async (_: any, { input }: { input: VenueInput }, context: Context) => {
      if (!context.vendor) {
        throw new Error('Vendor authentication required');
      }

      const venueService = new VenueService(context.db);
      return await venueService.createVenue(context.vendor.id, input);
    },

    // Update an existing venue
    updateVenue: async (_: any, { input }: { input: VenueUpdateInput }, context: Context) => {
      if (context.vendor) {
        const venueService = new VenueService(context.db);
        return await venueService.updateVenue(context.vendor.id, input);
      }

      if (context.Admin) {
        const venueService = new VenueService(context.db);
        return await venueService.adminUpdateVenue(input);
      }

      throw new Error('Vendor or admin authentication required');
    },

    // Delete a venue
    deleteVenue: async (_: any, { id }: { id: string }, context: Context) => {
      if (context.vendor) {
        const venueService = new VenueService(context.db);
        return await venueService.deleteVenue(context.vendor.id, id);
      }

      if (context.Admin) {
        const venueService = new VenueService(context.db);
        return await venueService.adminDeleteVenue(id);
      }

      throw new Error('Vendor or admin authentication required');
    },

    // Toggle venue availability
    toggleVenueAvailability: async (_: any, { id, isAvailable }: { id: string; isAvailable: boolean }, context: Context) => {
      if (!context.vendor) {
        throw new Error('Vendor authentication required');
      }

      const venueService = new VenueService(context.db);
      return await venueService.toggleVenueAvailability(context.vendor.id, id, isAvailable);
    },
  },
};