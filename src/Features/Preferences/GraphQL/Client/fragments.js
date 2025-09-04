"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VENDOR_PREFERENCE_VISIBILITY_FRAGMENT = exports.VENDOR_PREFERENCE_WORKING_HOURS_FRAGMENT = exports.VENDOR_PREFERENCE_FULL_FRAGMENT = exports.VENDOR_PREFERENCE_BASIC_FRAGMENT = exports.USER_PREFERENCE_FULL_FRAGMENT = exports.USER_PREFERENCE_BASIC_FRAGMENT = void 0;
// GraphQL Fragments for Preferences System
const client_1 = require("@apollo/client");
// ==================== USER PREFERENCE FRAGMENTS ====================
exports.USER_PREFERENCE_BASIC_FRAGMENT = (0, client_1.gql) `
  fragment UserPreferenceBasic on UserPreference {
    id
    userId
    pushNotifications
    emailNotifications
  }
`;
exports.USER_PREFERENCE_FULL_FRAGMENT = (0, client_1.gql) `
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
exports.VENDOR_PREFERENCE_BASIC_FRAGMENT = (0, client_1.gql) `
  fragment VendorPreferenceBasic on VendorPreference {
    id
    vendorId
    pushNotifications
    emailNotifications
    visibleInSearch
    visibleReviews
  }
`;
exports.VENDOR_PREFERENCE_FULL_FRAGMENT = (0, client_1.gql) `
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
exports.VENDOR_PREFERENCE_WORKING_HOURS_FRAGMENT = (0, client_1.gql) `
  fragment VendorPreferenceWorkingHours on VendorPreference {
    workingHoursStart
    workingHoursEnd
    workingDays
  }
`;
exports.VENDOR_PREFERENCE_VISIBILITY_FRAGMENT = (0, client_1.gql) `
  fragment VendorPreferenceVisibility on VendorPreference {
    visibleInSearch
    visibleReviews
  }
`;
