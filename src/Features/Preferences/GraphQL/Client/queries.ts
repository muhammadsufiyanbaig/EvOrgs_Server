// GraphQL Queries for Preferences System
import { gql } from '@apollo/client';
import {
  USER_PREFERENCE_BASIC_FRAGMENT,
  USER_PREFERENCE_FULL_FRAGMENT,
  VENDOR_PREFERENCE_BASIC_FRAGMENT,
  VENDOR_PREFERENCE_FULL_FRAGMENT,
  VENDOR_PREFERENCE_WORKING_HOURS_FRAGMENT,
  VENDOR_PREFERENCE_VISIBILITY_FRAGMENT
} from './fragments';

// ==================== USER PREFERENCE QUERIES ====================

/**
 * Get current user's preferences
 * Returns full preference data including timestamps
 */
export const GET_USER_PREFERENCES = gql`
  ${USER_PREFERENCE_FULL_FRAGMENT}
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
export const GET_USER_PREFERENCES_BASIC = gql`
  ${USER_PREFERENCE_BASIC_FRAGMENT}
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
export const GET_VENDOR_PREFERENCES = gql`
  ${VENDOR_PREFERENCE_FULL_FRAGMENT}
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
export const GET_VENDOR_PREFERENCES_BASIC = gql`
  ${VENDOR_PREFERENCE_BASIC_FRAGMENT}
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
export const GET_VENDOR_WORKING_HOURS = gql`
  ${VENDOR_PREFERENCE_WORKING_HOURS_FRAGMENT}
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
export const GET_VENDOR_VISIBILITY_SETTINGS = gql`
  ${VENDOR_PREFERENCE_VISIBILITY_FRAGMENT}
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
export const POLL_USER_PREFERENCES = gql`
  ${USER_PREFERENCE_FULL_FRAGMENT}
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
export const POLL_VENDOR_PREFERENCES = gql`
  ${VENDOR_PREFERENCE_FULL_FRAGMENT}
  query PollVendorPreferences {
    getVendorPreferences {
      ...VendorPreferenceFull
    }
  }
`;
