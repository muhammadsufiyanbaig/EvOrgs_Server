// TypeScript Types for Preferences System Client-Side Operations

// ==================== ENUMS ====================

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

// ==================== CORE TYPES ====================

export interface UserPreference {
  id: string;
  userId: string;
  pushNotifications: boolean;
  emailNotifications: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VendorPreference {
  id: string;
  vendorId: string;
  pushNotifications: boolean;
  emailNotifications: boolean;
  visibleInSearch: boolean;
  visibleReviews: boolean;
  workingHoursStart?: string;
  workingHoursEnd?: string;
  workingDays?: string[];
  createdAt: string;
  updatedAt: string;
}

// ==================== INPUT TYPES ====================

export interface UserPreferenceInput {
  pushNotifications?: boolean;
  emailNotifications?: boolean;
}

export interface VendorPreferenceInput {
  pushNotifications?: boolean;
  emailNotifications?: boolean;
  visibleInSearch?: boolean;
  visibleReviews?: boolean;
  workingHoursStart?: string;
  workingHoursEnd?: string;
  workingDays?: string[];
}

// ==================== QUERY VARIABLES TYPES ====================

export interface GetUserPreferencesVariables {
  // No variables needed for user preferences query
}

export interface GetVendorPreferencesVariables {
  // No variables needed for vendor preferences query
}

// ==================== MUTATION VARIABLES TYPES ====================

export interface UpdateUserPreferencesVariables {
  input: UserPreferenceInput;
}

export interface UpdateVendorPreferencesVariables {
  input: VendorPreferenceInput;
}

export interface ResetUserPreferencesVariables {
  // No variables needed for reset
}

export interface ResetVendorPreferencesVariables {
  // No variables needed for reset
}

export interface UpdateUserPushNotificationsVariables {
  pushNotifications: boolean;
}

export interface UpdateUserEmailNotificationsVariables {
  emailNotifications: boolean;
}

export interface UpdateVendorNotificationsVariables {
  pushNotifications?: boolean;
  emailNotifications?: boolean;
}

export interface UpdateVendorVisibilityVariables {
  visibleInSearch?: boolean;
  visibleReviews?: boolean;
}

export interface UpdateVendorWorkingHoursVariables {
  workingHoursStart?: string;
  workingHoursEnd?: string;
  workingDays?: string[];
}

export interface ToggleVendorSearchVisibilityVariables {
  visibleInSearch: boolean;
}

export interface ToggleVendorReviewVisibilityVariables {
  visibleReviews: boolean;
}

export interface UpdateVendorPushNotificationsVariables {
  pushNotifications: boolean;
}

export interface UpdateVendorEmailNotificationsVariables {
  emailNotifications: boolean;
}

// ==================== RESPONSE TYPES ====================

export interface GetUserPreferencesResponse {
  getUserPreferences: UserPreference;
}

export interface GetVendorPreferencesResponse {
  getVendorPreferences: VendorPreference;
}

export interface UpdateUserPreferencesResponse {
  updateUserPreferences: UserPreference;
}

export interface UpdateVendorPreferencesResponse {
  updateVendorPreferences: VendorPreference;
}

export interface ResetUserPreferencesResponse {
  resetUserPreferences: UserPreference;
}

export interface ResetVendorPreferencesResponse {
  resetVendorPreferences: VendorPreference;
}

// ==================== HOOK RETURN TYPES ====================

export interface UseUserPreferencesResult {
  preferences?: UserPreference;
  loading: boolean;
  error?: Error;
  refetch: () => void;
}

export interface UseVendorPreferencesResult {
  preferences?: VendorPreference;
  loading: boolean;
  error?: Error;
  refetch: () => void;
}

export interface UseUpdateUserPreferencesResult {
  updatePreferences: (input: UserPreferenceInput) => Promise<UserPreference>;
  loading: boolean;
  error?: Error;
}

export interface UseUpdateVendorPreferencesResult {
  updatePreferences: (input: VendorPreferenceInput) => Promise<VendorPreference>;
  loading: boolean;
  error?: Error;
}

export interface UseResetPreferencesResult {
  resetPreferences: () => Promise<UserPreference | VendorPreference>;
  loading: boolean;
  error?: Error;
}

// ==================== FORM TYPES ====================

export interface UserPreferenceFormData {
  pushNotifications: boolean;
  emailNotifications: boolean;
}

export interface VendorPreferenceFormData {
  pushNotifications: boolean;
  emailNotifications: boolean;
  visibleInSearch: boolean;
  visibleReviews: boolean;
  workingHoursStart: string;
  workingHoursEnd: string;
  workingDays: string[];
}

export interface VendorNotificationFormData {
  pushNotifications: boolean;
  emailNotifications: boolean;
}

export interface VendorVisibilityFormData {
  visibleInSearch: boolean;
  visibleReviews: boolean;
}

export interface VendorWorkingHoursFormData {
  workingHoursStart: string;
  workingHoursEnd: string;
  workingDays: string[];
}

// ==================== UTILITY TYPES ====================

export interface PreferenceState {
  user?: UserPreference;
  vendor?: VendorPreference;
  isLoading: boolean;
  error?: string;
}

export interface WorkingHours {
  start: string;
  end: string;
  days: string[];
}

export interface NotificationSettings {
  push: boolean;
  email: boolean;
}

export interface VisibilitySettings {
  searchVisible: boolean;
  reviewsVisible: boolean;
}

// ==================== VALIDATION TYPES ====================

export interface PreferenceValidationError {
  field: string;
  message: string;
}

export interface WorkingHoursValidation {
  isValid: boolean;
  errors: PreferenceValidationError[];
}

export interface PreferenceFormValidation {
  isValid: boolean;
  errors: Record<string, string>;
}

// ==================== CONSTANTS TYPES ====================

export interface PreferenceConstants {
  DEFAULT_USER_PREFERENCES: UserPreferenceFormData;
  DEFAULT_VENDOR_PREFERENCES: VendorPreferenceFormData;
  WORKING_DAYS: DayOfWeek[];
  TIME_FORMAT_REGEX: RegExp;
}

// ==================== APOLLO CLIENT TYPES ====================

export interface PreferenceQueryOptions {
  pollInterval?: number;
  errorPolicy?: 'none' | 'ignore' | 'all';
  notifyOnNetworkStatusChange?: boolean;
}

export interface PreferenceMutationOptions {
  refetchQueries?: string[];
  awaitRefetchQueries?: boolean;
  optimisticResponse?: any;
  update?: (cache: any, result: any) => void;
}
