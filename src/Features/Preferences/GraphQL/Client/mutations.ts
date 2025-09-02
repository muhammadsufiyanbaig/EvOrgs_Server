// GraphQL Mutations for Preferences System
import { gql } from '@apollo/client';
import {
  USER_PREFERENCE_FULL_FRAGMENT,
  VENDOR_PREFERENCE_FULL_FRAGMENT
} from './fragments';

// ==================== USER PREFERENCE MUTATIONS ====================

/**
 * Update user preferences
 * Updates notification settings for the current user
 */
export const UPDATE_USER_PREFERENCES = gql`
  ${USER_PREFERENCE_FULL_FRAGMENT}
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
export const RESET_USER_PREFERENCES = gql`
  ${USER_PREFERENCE_FULL_FRAGMENT}
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
export const UPDATE_USER_PUSH_NOTIFICATIONS = gql`
  ${USER_PREFERENCE_FULL_FRAGMENT}
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
export const UPDATE_USER_EMAIL_NOTIFICATIONS = gql`
  ${USER_PREFERENCE_FULL_FRAGMENT}
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
export const UPDATE_VENDOR_PREFERENCES = gql`
  ${VENDOR_PREFERENCE_FULL_FRAGMENT}
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
export const RESET_VENDOR_PREFERENCES = gql`
  ${VENDOR_PREFERENCE_FULL_FRAGMENT}
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
export const UPDATE_VENDOR_NOTIFICATIONS = gql`
  ${VENDOR_PREFERENCE_FULL_FRAGMENT}
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
export const UPDATE_VENDOR_VISIBILITY = gql`
  ${VENDOR_PREFERENCE_FULL_FRAGMENT}
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
export const UPDATE_VENDOR_WORKING_HOURS = gql`
  ${VENDOR_PREFERENCE_FULL_FRAGMENT}
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
export const TOGGLE_VENDOR_SEARCH_VISIBILITY = gql`
  ${VENDOR_PREFERENCE_FULL_FRAGMENT}
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
export const TOGGLE_VENDOR_REVIEW_VISIBILITY = gql`
  ${VENDOR_PREFERENCE_FULL_FRAGMENT}
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
export const UPDATE_VENDOR_PUSH_NOTIFICATIONS = gql`
  ${VENDOR_PREFERENCE_FULL_FRAGMENT}
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
export const UPDATE_VENDOR_EMAIL_NOTIFICATIONS = gql`
  ${VENDOR_PREFERENCE_FULL_FRAGMENT}
  mutation UpdateVendorEmailNotifications($emailNotifications: Boolean!) {
    updateVendorPreferences(input: { emailNotifications: $emailNotifications }) {
      ...VendorPreferenceFull
    }
  }
`;
