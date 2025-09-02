"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UPDATE_VENDOR_EMAIL_NOTIFICATIONS = exports.UPDATE_VENDOR_PUSH_NOTIFICATIONS = exports.TOGGLE_VENDOR_REVIEW_VISIBILITY = exports.TOGGLE_VENDOR_SEARCH_VISIBILITY = exports.UPDATE_VENDOR_WORKING_HOURS = exports.UPDATE_VENDOR_VISIBILITY = exports.UPDATE_VENDOR_NOTIFICATIONS = exports.RESET_VENDOR_PREFERENCES = exports.UPDATE_VENDOR_PREFERENCES = exports.UPDATE_USER_EMAIL_NOTIFICATIONS = exports.UPDATE_USER_PUSH_NOTIFICATIONS = exports.RESET_USER_PREFERENCES = exports.UPDATE_USER_PREFERENCES = void 0;
// GraphQL Mutations for Preferences System
const client_1 = require("@apollo/client");
const fragments_1 = require("./fragments");
// ==================== USER PREFERENCE MUTATIONS ====================
/**
 * Update user preferences
 * Updates notification settings for the current user
 */
exports.UPDATE_USER_PREFERENCES = (0, client_1.gql) `
  ${fragments_1.USER_PREFERENCE_FULL_FRAGMENT}
  mutation UpdateUserPreferences($input: UserPreferenceInput!) {
    updateUserPreferences(input: $input) {
      ...UserPreferenceFull
    }
  }
`;
/**
 * Reset user preferences to default values
 * Restores default notification settings
 */
exports.RESET_USER_PREFERENCES = (0, client_1.gql) `
  ${fragments_1.USER_PREFERENCE_FULL_FRAGMENT}
  mutation ResetUserPreferences {
    resetUserPreferences {
      ...UserPreferenceFull
    }
  }
`;
/**
 * Update user push notification preference only
 * Quick toggle for push notifications
 */
exports.UPDATE_USER_PUSH_NOTIFICATIONS = (0, client_1.gql) `
  ${fragments_1.USER_PREFERENCE_FULL_FRAGMENT}
  mutation UpdateUserPushNotifications($pushNotifications: Boolean!) {
    updateUserPreferences(input: { pushNotifications: $pushNotifications }) {
      ...UserPreferenceFull
    }
  }
`;
/**
 * Update user email notification preference only
 * Quick toggle for email notifications
 */
exports.UPDATE_USER_EMAIL_NOTIFICATIONS = (0, client_1.gql) `
  ${fragments_1.USER_PREFERENCE_FULL_FRAGMENT}
  mutation UpdateUserEmailNotifications($emailNotifications: Boolean!) {
    updateUserPreferences(input: { emailNotifications: $emailNotifications }) {
      ...UserPreferenceFull
    }
  }
`;
// ==================== VENDOR PREFERENCE MUTATIONS ====================
/**
 * Update vendor preferences
 * Updates all vendor preference settings
 */
exports.UPDATE_VENDOR_PREFERENCES = (0, client_1.gql) `
  ${fragments_1.VENDOR_PREFERENCE_FULL_FRAGMENT}
  mutation UpdateVendorPreferences($input: VendorPreferenceInput!) {
    updateVendorPreferences(input: $input) {
      ...VendorPreferenceFull
    }
  }
`;
/**
 * Reset vendor preferences to default values
 * Restores default vendor settings
 */
exports.RESET_VENDOR_PREFERENCES = (0, client_1.gql) `
  ${fragments_1.VENDOR_PREFERENCE_FULL_FRAGMENT}
  mutation ResetVendorPreferences {
    resetVendorPreferences {
      ...VendorPreferenceFull
    }
  }
`;
/**
 * Update vendor notification preferences only
 * Updates push and email notification settings
 */
exports.UPDATE_VENDOR_NOTIFICATIONS = (0, client_1.gql) `
  ${fragments_1.VENDOR_PREFERENCE_FULL_FRAGMENT}
  mutation UpdateVendorNotifications(
    $pushNotifications: Boolean
    $emailNotifications: Boolean
  ) {
    updateVendorPreferences(input: {
      pushNotifications: $pushNotifications
      emailNotifications: $emailNotifications
    }) {
      ...VendorPreferenceFull
    }
  }
`;
/**
 * Update vendor visibility settings only
 * Updates search visibility and review visibility
 */
exports.UPDATE_VENDOR_VISIBILITY = (0, client_1.gql) `
  ${fragments_1.VENDOR_PREFERENCE_FULL_FRAGMENT}
  mutation UpdateVendorVisibility(
    $visibleInSearch: Boolean
    $visibleReviews: Boolean
  ) {
    updateVendorPreferences(input: {
      visibleInSearch: $visibleInSearch
      visibleReviews: $visibleReviews
    }) {
      ...VendorPreferenceFull
    }
  }
`;
/**
 * Update vendor working hours only
 * Updates working schedule settings
 */
exports.UPDATE_VENDOR_WORKING_HOURS = (0, client_1.gql) `
  ${fragments_1.VENDOR_PREFERENCE_FULL_FRAGMENT}
  mutation UpdateVendorWorkingHours(
    $workingHoursStart: String
    $workingHoursEnd: String
    $workingDays: [String!]
  ) {
    updateVendorPreferences(input: {
      workingHoursStart: $workingHoursStart
      workingHoursEnd: $workingHoursEnd
      workingDays: $workingDays
    }) {
      ...VendorPreferenceFull
    }
  }
`;
/**
 * Toggle vendor search visibility
 * Quick toggle for search visibility
 */
exports.TOGGLE_VENDOR_SEARCH_VISIBILITY = (0, client_1.gql) `
  ${fragments_1.VENDOR_PREFERENCE_FULL_FRAGMENT}
  mutation ToggleVendorSearchVisibility($visibleInSearch: Boolean!) {
    updateVendorPreferences(input: { visibleInSearch: $visibleInSearch }) {
      ...VendorPreferenceFull
    }
  }
`;
/**
 * Toggle vendor review visibility
 * Quick toggle for review visibility
 */
exports.TOGGLE_VENDOR_REVIEW_VISIBILITY = (0, client_1.gql) `
  ${fragments_1.VENDOR_PREFERENCE_FULL_FRAGMENT}
  mutation ToggleVendorReviewVisibility($visibleReviews: Boolean!) {
    updateVendorPreferences(input: { visibleReviews: $visibleReviews }) {
      ...VendorPreferenceFull
    }
  }
`;
/**
 * Update vendor push notifications only
 * Quick toggle for vendor push notifications
 */
exports.UPDATE_VENDOR_PUSH_NOTIFICATIONS = (0, client_1.gql) `
  ${fragments_1.VENDOR_PREFERENCE_FULL_FRAGMENT}
  mutation UpdateVendorPushNotifications($pushNotifications: Boolean!) {
    updateVendorPreferences(input: { pushNotifications: $pushNotifications }) {
      ...VendorPreferenceFull
    }
  }
`;
/**
 * Update vendor email notifications only
 * Quick toggle for vendor email notifications
 */
exports.UPDATE_VENDOR_EMAIL_NOTIFICATIONS = (0, client_1.gql) `
  ${fragments_1.VENDOR_PREFERENCE_FULL_FRAGMENT}
  mutation UpdateVendorEmailNotifications($emailNotifications: Boolean!) {
    updateVendorPreferences(input: { emailNotifications: $emailNotifications }) {
      ...VendorPreferenceFull
    }
  }
`;
