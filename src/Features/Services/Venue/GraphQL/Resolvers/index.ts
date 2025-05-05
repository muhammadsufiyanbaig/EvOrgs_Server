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
      // Check if it's a vendor
      if (context.vendor) {
        const venueService = new VenueService(context.db);
        return await venueService.updateVenue(context.vendor.id, input);
      }

      // Check if it's an admin (admins can update any venue)
      if (context.Admin) {
        const venueService = new VenueService(context.db);
        return await venueService.adminUpdateVenue(input);
      }

      throw new Error('Vendor or admin authentication required');
    },

    // Delete a venue
    deleteVenue: async (_: any, { id }: { id: string }, context: Context) => {
      // Check if it's a vendor
      if (context.vendor) {
        const venueService = new VenueService(context.db);
        return await venueService.deleteVenue(context.vendor.id, id);
      }

      // Check if it's an admin (admins can delete any venue)
      if (context.Admin) {
        const venueService = new VenueService(context.db);
        return await venueService.adminDeleteVenue(id);
      }

      throw new Error('Vendor or admin authentication required');
    },
  },
};