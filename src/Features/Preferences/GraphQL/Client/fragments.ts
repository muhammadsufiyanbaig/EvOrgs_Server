// GraphQL Fragments for Preferences System
import { gql } from '@apollo/client';

// ==================== USER PREFERENCE FRAGMENTS ====================

export const USER_PREFERENCE_BASIC_FRAGMENT = gql`
  fragment UserPreferenceBasic on UserPreference {
    id
    userId
    pushNotifications
    emailNotifications
  }
`;

export const USER_PREFERENCE_FULL_FRAGMENT = gql`
  fragment UserPreferenceFull on UserPreference {
    id
    userId
    pushNotifications
    emailNotifications
    createdAt
    updatedAt
  }
`;

// ==================== VENDOR PREFERENCE FRAGMENTS ====================

export const VENDOR_PREFERENCE_BASIC_FRAGMENT = gql`
  fragment VendorPreferenceBasic on VendorPreference {
    id
    vendorId
    pushNotifications
    emailNotifications
    visibleInSearch
    visibleReviews
  }
`;

export const VENDOR_PREFERENCE_FULL_FRAGMENT = gql`
  fragment VendorPreferenceFull on VendorPreference {
    id
    vendorId
    pushNotifications
    emailNotifications
    visibleInSearch
    visibleReviews
    workingHoursStart
    workingHoursEnd
    workingDays
    createdAt
    updatedAt
  }
`;

export const VENDOR_PREFERENCE_WORKING_HOURS_FRAGMENT = gql`
  fragment VendorPreferenceWorkingHours on VendorPreference {
    workingHoursStart
    workingHoursEnd
    workingDays
  }
`;

export const VENDOR_PREFERENCE_VISIBILITY_FRAGMENT = gql`
  fragment VendorPreferenceVisibility on VendorPreference {
    visibleInSearch
    visibleReviews
  }
`;
