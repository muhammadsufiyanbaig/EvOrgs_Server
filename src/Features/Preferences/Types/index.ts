export interface UserPreference {
  id: string;
  userId: string;
  pushNotifications: boolean;
  emailNotifications: boolean;
  createdAt: Date;
  updatedAt: Date;
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
  createdAt: Date;
  updatedAt: Date;
}

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
