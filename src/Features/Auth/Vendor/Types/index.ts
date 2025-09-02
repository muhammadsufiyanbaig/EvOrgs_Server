
export interface Vendor {
  id: string;
  vendorName: string;
  vendorEmail: string;
  vendorPhone: string | null;
  fcmToken: string[];
  vendorAddress: string | null;
  vendorProfileDescription: string | null;
  vendorWebsite: string | null;
  vendorSocialLinks: string[];
  passwordHash: string;
  profileImage: string | null;
  bannerImage: string | null;
  vendorType: "FarmHouse" | "Venue" | "Catering" | "Photography";
  vendorStatus: "Pending" | "Approved" | "Rejected";
  vendorTypeId: string | null;
  rating: number | null;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Define interfaces to match your schema
export interface VendorRegisterInput {
  vendorName: string;
  vendorEmail: string;
  password: string;
  vendorPhone?: string;
  vendorAddress?: string;
  vendorProfileDescription?: string;
  vendorWebsite?: string;
  vendorSocialLinks?: string[];
  profileImage?: string;
  bannerImage?: string;
  vendorType: "FarmHouse" | "Venue" | "Catering" | "Photography";
  vendorTypeId?: string;
}

export interface VendorLoginInput {
  vendorEmail: string;
  password: string;
}

export interface VendorVerifyOtpInput {
  vendorEmail: string;
  otp: string;
  purpose: 'registration' | 'password-reset' | 'login';
  userType: string;
}

export interface VendorUpdateProfileInput {
  vendorName?: string;
  vendorPhone?: string;
  vendorAddress?: string;
  vendorProfileDescription?: string;
  vendorWebsite?: string;
  vendorSocialLinks?: string[];
  profileImage?: string;
  bannerImage?: string;
  vendorType?: "FarmHouse" | "Venue" | "Catering" | "Photography";
  vendorTypeId?: string;
  fcmToken?: string;
}

export interface VendorChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface VendorResetPasswordInput {
  vendorEmail: string;
  userType: string;
}

export interface VendorSetNewPasswordInput {
  vendorEmail: string;
  otp: string;
  newPassword: string;
  userType: string;
}

export interface VendorResendOtpInput {
  vendorEmail: string;
  purpose: 'registration' | 'password-reset' | 'login';
  userType: string;
}

export interface VendorApprovalInput {
  vendorId: string;
  status: "Pending" | "Approved" | "Rejected";
  message?: string;
} 

// Admin specific types for vendor management
export interface ListVendorsInput {
  page?: number;
  limit?: number;
  search?: string;
  status?: "Pending" | "Approved" | "Rejected";
  vendorType?: "FarmHouse" | "Venue" | "Catering" | "Photography";
}

export interface VendorListResponse {
  vendors: Vendor[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 