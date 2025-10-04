export interface Admin {
    role: string;
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
  
// Define interfaces for input types
export interface AdminSignupInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  profileImage?: string;
}

export interface AdminLoginInput {
  email: string;
  password: string;
}

export interface OtpRequestInput {
  email: string;
  purpose?: 'registration' | 'login' | 'password-reset';
}

export interface OtpVerifyInput {
  email: string;
  otp: string;
  purpose?: 'registration' | 'login' | 'password-reset';
}

export interface ResetPasswordInput {
  email: string;
  otp: string;
  newPassword: string;
}

export interface UpdateProfileInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
  profileImage?: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface ResendOtpInput {
  email: string;
  purpose: 'registration' | 'login' | 'password-reset';
}

// Define response types
export interface AdminResponse {
  success: boolean;
  message: string;
  admin?: Admin;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  admin?: Admin;
}

export interface OtpResponse {
  success: boolean;
  message: string;
  email?: string;
}

export interface PasswordResetResponse {
  success: boolean;
  message: string;
}
