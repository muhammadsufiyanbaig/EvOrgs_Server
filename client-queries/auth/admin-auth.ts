import { gql } from '@apollo/client';

// ============== ADMIN AUTHENTICATION QUERIES & MUTATIONS ==============

// ======== FRAGMENTS ========
export const ADMIN_FRAGMENT = gql`
  fragment AdminFragment on Admin {
    id
    firstName
    lastName
    email
    phone
    profileImage
    createdAt
    updatedAt
  }
`;

export const ADMIN_AUTH_RESPONSE_FRAGMENT = gql`
  fragment AdminAuthResponseFragment on AdminAuthResponse {
    success
    message
    token
    admin {
      ...AdminFragment
    }
  }
  ${ADMIN_FRAGMENT}
`;

export const ADMIN_OTP_RESPONSE_FRAGMENT = gql`
  fragment AdminOtpResponseFragment on AdminOtpResponse {
    success
    message
    email
  }
`;

export const ADMIN_USER_LIST_RESPONSE_FRAGMENT = gql`
  fragment AdminUserListResponseFragment on UserListResponse {
    users {
      id
      firstName
      lastName
      email
      phone
      address
      profileImage
      dateOfBirth
      gender
      createdAt
      isVerified
    }
    total
    page
    limit
    totalPages
  }
`;

export const ADMIN_VENDOR_LIST_RESPONSE_FRAGMENT = gql`
  fragment AdminVendorListResponseFragment on VendorListResponse {
    vendors {
      id
      vendorName
      vendorEmail
      vendorPhone
      vendorAddress
      vendorProfileDescription
      vendorWebsite
      vendorSocialLinks
      profileImage
      bannerImage
      vendorType
      vendorStatus
      vendorTypeId
      rating
      reviewCount
      createdAt
      updatedAt
    }
    total
    page
    limit
    totalPages
  }
`;

// ======== QUERIES ========
export const ADMIN_ME = gql`
  query AdminMe {
    adminMe {
      ...AdminFragment
    }
  }
  ${ADMIN_FRAGMENT}
`;

// User Management Queries
export const ADMIN_LIST_ALL_USERS = gql`
  query AdminListAllUsers($input: ListUsersInput) {
    adminListAllUsers(input: $input) {
      ...AdminUserListResponseFragment
    }
  }
  ${ADMIN_USER_LIST_RESPONSE_FRAGMENT}
`;

export const ADMIN_GET_USER_BY_ID = gql`
  query AdminGetUserById($userId: String!) {
    adminGetUserById(userId: $userId) {
      id
      firstName
      lastName
      email
      phone
      address
      profileImage
      dateOfBirth
      gender
      createdAt
      isVerified
    }
  }
`;

// Vendor Management Queries
export const ADMIN_LIST_ALL_VENDORS = gql`
  query AdminListAllVendors($input: ListVendorsInput) {
    adminListAllVendors(input: $input) {
      ...AdminVendorListResponseFragment
    }
  }
  ${ADMIN_VENDOR_LIST_RESPONSE_FRAGMENT}
`;

export const ADMIN_GET_VENDOR_BY_ID = gql`
  query AdminGetVendorById($vendorId: String!) {
    adminGetVendorById(vendorId: $vendorId) {
      id
      vendorName
      vendorEmail
      vendorPhone
      vendorAddress
      vendorProfileDescription
      vendorWebsite
      vendorSocialLinks
      profileImage
      bannerImage
      vendorType
      vendorStatus
      vendorTypeId
      rating
      reviewCount
      createdAt
      updatedAt
    }
  }
`;

// ======== MUTATIONS ========

// Registration Flow
export const ADMIN_SIGNUP = gql`
  mutation AdminSignup($input: AdminSignupInput!) {
    adminSignup(input: $input) {
      ...AdminAuthResponseFragment
    }
  }
  ${ADMIN_AUTH_RESPONSE_FRAGMENT}
`;

// Login Flow
export const ADMIN_LOGIN = gql`
  mutation AdminLogin($input: AdminLoginInput!) {
    adminLogin(input: $input) {
      ...AdminAuthResponseFragment
    }
  }
  ${ADMIN_AUTH_RESPONSE_FRAGMENT}
`;

// OTP Management
export const ADMIN_REQUEST_OTP = gql`
  mutation AdminRequestOtp($input: AdminRequestOtpInput!) {
    adminRequestOtp(input: $input) {
      ...AdminOtpResponseFragment
    }
  }
  ${ADMIN_OTP_RESPONSE_FRAGMENT}
`;

export const ADMIN_VERIFY_OTP = gql`
  mutation AdminVerifyOtp($input: AdminVerifyOtpInput!) {
    adminVerifyOtp(input: $input) {
      ...AdminOtpResponseFragment
    }
  }
  ${ADMIN_OTP_RESPONSE_FRAGMENT}
`;

export const ADMIN_RESEND_OTP = gql`
  mutation AdminResendOtp($input: AdminResendOtpInput!) {
    adminResendOtp(input: $input) {
      ...AdminOtpResponseFragment
    }
  }
  ${ADMIN_OTP_RESPONSE_FRAGMENT}
`;

// Password Management
export const ADMIN_RESET_PASSWORD = gql`
  mutation AdminResetPassword($input: AdminResetPasswordInput!) {
    adminResetPassword(input: $input) {
      ...AdminAuthResponseFragment
    }
  }
  ${ADMIN_AUTH_RESPONSE_FRAGMENT}
`;

export const ADMIN_SET_NEW_PASSWORD = gql`
  mutation AdminSetNewPassword($input: AdminSetNewPasswordInput!) {
    adminSetNewPassword(input: $input) {
      ...AdminAuthResponseFragment
    }
  }
  ${ADMIN_AUTH_RESPONSE_FRAGMENT}
`;

export const ADMIN_CHANGE_PASSWORD = gql`
  mutation AdminChangePassword($input: AdminChangePasswordInput!) {
    adminChangePassword(input: $input) {
      ...AdminAuthResponseFragment
    }
  }
  ${ADMIN_AUTH_RESPONSE_FRAGMENT}
`;

// Profile Management
export const ADMIN_UPDATE_PROFILE = gql`
  mutation AdminUpdateProfile($input: AdminUpdateProfileInput!) {
    adminUpdateAdminProfile(input: $input) {
      ...AdminFragment
    }
  }
  ${ADMIN_FRAGMENT}
`;

// Account Management
export const ADMIN_DELETE_ACCOUNT = gql`
  mutation AdminDeleteAccount {
    adminDeleteAccount
  }
`;

// User Management Mutations
export const ADMIN_DELETE_USER = gql`
  mutation AdminDeleteUser($userId: String!) {
    adminDeleteUser(userId: $userId)
  }
`;

// Vendor Management Mutations
export const ADMIN_DELETE_VENDOR = gql`
  mutation AdminDeleteVendor($vendorId: String!) {
    adminDeleteVendor(vendorId: $vendorId)
  }
`;

export const ADMIN_UPDATE_VENDOR_STATUS = gql`
  mutation AdminUpdateVendorStatus($input: AdminVendorUpdateStatusInput!) {
    adminUpdateVendorStatus(input: $input) {
      id
      vendorName
      vendorEmail
      vendorPhone
      vendorAddress
      vendorProfileDescription
      vendorWebsite
      vendorSocialLinks
      profileImage
      bannerImage
      vendorType
      vendorStatus
      vendorTypeId
      rating
      reviewCount
      createdAt
      updatedAt
    }
  }
`;

// ======== TYPESCRIPT TYPES ========
export interface Admin {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminAuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  admin?: Admin;
}

export interface AdminOtpResponse {
  success: boolean;
  message?: string;
  email?: string;
}

export interface AdminSignupInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  profileImage?: string;
}

export interface AdminLoginInput {
  email: string;
  password: string;
}

export interface AdminRequestOtpInput {
  email: string;
  purpose?: 'registration' | 'login' | 'password_reset';
}

export interface AdminVerifyOtpInput {
  email: string;
  otp: string;
  purpose?: 'registration' | 'login' | 'password_reset';
}

export interface AdminResetPasswordInput {
  email: string;
  otp: string;
  newPassword: string;
}

export interface AdminUpdateProfileInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
  profileImage?: string;
}

export interface AdminChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface AdminResendOtpInput {
  email: string;
  purpose: 'registration' | 'login' | 'password_reset';
}

export interface AdminSetNewPasswordInput {
  email: string;
  otp: string;
  newPassword: string;
}

export interface AdminVendorUpdateStatusInput {
  vendorId: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  message?: string;
}

export interface AdminListUsersInput {
  page?: number;
  limit?: number;
  search?: string;
}

export interface AdminListVendorsInput {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'Pending' | 'Approved' | 'Rejected';
  vendorType?: 'FarmHouse' | 'Venue' | 'Catering' | 'Photography';
}

export interface AdminUserListResponse {
  users: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: string;
    profileImage?: string;
    dateOfBirth?: string;
    gender: 'Male' | 'Female' | 'Others';
    createdAt: string;
    isVerified: boolean;
  }>;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AdminVendorListResponse {
  vendors: Array<{
    id: string;
    vendorName: string;
    vendorEmail: string;
    vendorPhone?: string;
    vendorAddress?: string;
    vendorProfileDescription?: string;
    vendorWebsite?: string;
    vendorSocialLinks?: string[];
    profileImage?: string;
    bannerImage?: string;
    vendorType: 'FarmHouse' | 'Venue' | 'Catering' | 'Photography';
    vendorStatus: 'Pending' | 'Approved' | 'Rejected';
    vendorTypeId?: string;
    rating?: number;
    reviewCount?: number;
    createdAt: string;
    updatedAt: string;
  }>;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
