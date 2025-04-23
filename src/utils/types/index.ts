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