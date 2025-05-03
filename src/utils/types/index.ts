// src/utils/types.ts
import { DrizzleDB } from '../../Config/db';

export interface User {
  role: string;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  address: string | null;
  fcmToken: string[];
  passwordHash: string;
  profileImage: string | null;
  dateOfBirth: Date | null;
  gender: string;
  createdAt: Date;
  isVerified: boolean;
}

export interface UserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  profileImage?: string;
  dateOfBirth?: string;
  gender: string;
}

export interface LoginInput {
  email: string;
  password: string;
}



export type OtpPurpose = 'registration' | 'password_reset' | 'login';
export type UserType = 'User' | 'Vendor' | 'Admin';

export interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  profileImage?: string;
  dateOfBirth?: string;
  gender: "Male" | "Female" | "Others";
}

export interface VerifyOtpInput {
  email: string;
  otp: string;
  purpose: 'registration' | 'password-reset' | 'login';
  userType: string;
}

export interface UpdateProfileInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  profileImage?: string;
  dateOfBirth?: string;
  gender?: string;
  fcmToken?: string;
  
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
  purpose: 'registration' | 'password-reset' | 'login';
}

export interface ResetPasswordInput {
  email: string;
  userType: string;
  purpose: 'registration' | 'password-reset' | 'login';
}

export interface SetNewPasswordInput {
  email: string;
  otp: string;
  newPassword: string;
  userType: string;  
  purpose: 'registration' | 'password-reset' | 'login';
}

export interface ResendOtpInput {
  email: string;
  purpose: 'registration' | 'password-reset' | 'login';
  userType: string;
}

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
export interface Context {
  db: DrizzleDB;
  user?: User;
  vendor?: Vendor;
  Admin?: Admin;
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
export interface Admin {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  passwordHash: string;
  profileImage: string | null;
  createdAt: Date;
  updatedAt: Date;
}