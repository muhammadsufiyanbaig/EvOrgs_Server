// src/utils/types.ts
import { DrizzleDB } from '../../Config/db';

export interface User {
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

export interface Context {
  db: DrizzleDB;
  user?: User;
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
  purpose: 'registration' | 'password-reset';
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
  purpose: 'registration' | 'password-reset';
}

export interface ResetPasswordInput {
  email: string;
  userType: string;
  purpose: 'registration' | 'password-reset';
}

export interface SetNewPasswordInput {
  email: string;
  otp: string;
  newPassword: string;
  userType: string;  
  purpose: 'registration' | 'password-reset';
}

export interface ResendOtpInput {
  email: string;
  purpose: 'registration' | 'password-reset';
  userType: string;
}

