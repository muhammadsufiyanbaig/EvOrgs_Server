
import { Context } from '../../../../GraphQL/Context';
import { UserPreferenceService } from '../../Services/User';
import { VendorPreferenceService } from '../../Services/Vendor';
import { AuthenticationError, ForbiddenError } from 'apollo-server-express';

export const settingsResolvers = {
  Query: {
    getUserPreferences: async (_: any, __: any, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('You must be logged in as a user to access preferences');
      }

      const userPreferenceService = new UserPreferenceService(context.db);
      return await userPreferenceService.getUserPreferences(context.user.id);
    },

    getVendorPreferences: async (_: any, __: any, context: Context) => {
      if (!context.vendor) {
        throw new AuthenticationError('You must be logged in as a vendor to access preferences');
      }

      const vendorPreferenceService = new VendorPreferenceService(context.db);
      return await vendorPreferenceService.getVendorPreferences(context.vendor.id);
    },
  },

  Mutation: {
    updateUserPreferences: async (_: any, { input }: { input: any }, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('You must be logged in as a user to update preferences');
      }

      const userPreferenceService = new UserPreferenceService(context.db);
      return await userPreferenceService.updateUserPreferences(context.user.id, input);
    },

    updateVendorPreferences: async (_: any, { input }: { input: any }, context: Context) => {
      if (!context.vendor) {
        throw new AuthenticationError('You must be logged in as a vendor to update preferences');
      }

      const vendorPreferenceService = new VendorPreferenceService(context.db);
      return await vendorPreferenceService.updateVendorPreferences(context.vendor.id, input);
    },

    resetUserPreferences: async (_: any, __: any, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('You must be logged in as a user to reset preferences');
      }

      const userPreferenceService = new UserPreferenceService(context.db);
      return await userPreferenceService.resetUserPreferences(context.user.id);
    },

    resetVendorPreferences: async (_: any, __: any, context: Context) => {
      if (!context.vendor) {
        throw new AuthenticationError('You must be logged in as a vendor to reset preferences');
      }

      const vendorPreferenceService = new VendorPreferenceService(context.db);
      return await vendorPreferenceService.resetVendorPreferences(context.vendor.id);
    },
  },
};
