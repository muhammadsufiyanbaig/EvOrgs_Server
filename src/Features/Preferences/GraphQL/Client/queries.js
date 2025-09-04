"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POLL_VENDOR_PREFERENCES = exports.POLL_USER_PREFERENCES = exports.GET_VENDOR_VISIBILITY_SETTINGS = exports.GET_VENDOR_WORKING_HOURS = exports.GET_VENDOR_PREFERENCES_BASIC = exports.GET_VENDOR_PREFERENCES = exports.GET_USER_PREFERENCES_BASIC = exports.GET_USER_PREFERENCES = void 0;
// GraphQL Queries for Preferences System
const client_1 = require("@apollo/client");
const fragments_1 = require("./fragments");
// ==================== USER PREFERENCE QUERIES ====================
/**
 * Get current user's preferences
 * Returns full preference data including timestamps
 */
exports.GET_USER_PREFERENCES = (0, client_1.gql) `
  ${fragments_1.USER_PREFERENCE_FULL_FRAGMENT}
  query GetUserPreferences {
    getUserPreferences {
      ...UserPreferenceFull
    }
  }
`;
/**
 * Get user's basic preference settings
 * Returns only notification preferences without timestamps
 */
exports.GET_USER_PREFERENCES_BASIC = (0, client_1.gql) `
  ${fragments_1.USER_PREFERENCE_BASIC_FRAGMENT}
  query GetUserPreferencesBasic {
    getUserPreferences {
      ...UserPreferenceBasic
    }
  }
`;
// ==================== VENDOR PREFERENCE QUERIES ====================
/**
 * Get current vendor's preferences
 * Returns full preference data including working hours and visibility settings
 */
exports.GET_VENDOR_PREFERENCES = (0, client_1.gql) `
  ${fragments_1.VENDOR_PREFERENCE_FULL_FRAGMENT}
  query GetVendorPreferences {
    getVendorPreferences {
      ...VendorPreferenceFull
    }
  }
`;
/**
 * Get vendor's basic preference settings
 * Returns notification and visibility preferences without working hours
 */
exports.GET_VENDOR_PREFERENCES_BASIC = (0, client_1.gql) `
  ${fragments_1.VENDOR_PREFERENCE_BASIC_FRAGMENT}
  query GetVendorPreferencesBasic {
    getVendorPreferences {
      ...VendorPreferenceBasic
    }
  }
`;
/**
 * Get vendor's working hours only
 * Useful for schedule-related components
 */
exports.GET_VENDOR_WORKING_HOURS = (0, client_1.gql) `
  ${fragments_1.VENDOR_PREFERENCE_WORKING_HOURS_FRAGMENT}
  query GetVendorWorkingHours {
    getVendorPreferences {
      ...VendorPreferenceWorkingHours
    }
  }
`;
/**
 * Get vendor's visibility settings only
 * Useful for profile visibility components
 */
exports.GET_VENDOR_VISIBILITY_SETTINGS = (0, client_1.gql) `
  ${fragments_1.VENDOR_PREFERENCE_VISIBILITY_FRAGMENT}
  query GetVendorVisibilitySettings {
    getVendorPreferences {
      ...VendorPreferenceVisibility
    }
  }
`;
// ==================== POLLING QUERIES FOR REAL-TIME UPDATES ====================
/**
 * Poll for user preference changes
 * Use with pollInterval for real-time updates
 */
exports.POLL_USER_PREFERENCES = (0, client_1.gql) `
  ${fragments_1.USER_PREFERENCE_FULL_FRAGMENT}
  query PollUserPreferences {
    getUserPreferences {
      ...UserPreferenceFull
    }
  }
`;
/**
 * Poll for vendor preference changes
 * Use with pollInterval for real-time updates
 */
exports.POLL_VENDOR_PREFERENCES = (0, client_1.gql) `
  ${fragments_1.VENDOR_PREFERENCE_FULL_FRAGMENT}
  query PollVendorPreferences {
    getVendorPreferences {
      ...VendorPreferenceFull
    }
  }
`;
