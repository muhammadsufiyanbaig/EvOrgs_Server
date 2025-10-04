import { gql } from '@apollo/client';

// ============== VENDOR AUTHENTICATION QUERIES & MUTATIONS ==============

// ======== FRAGMENTS ========
export const VENDOR_FRAGMENT = gql`
  fragment VendorFragment on Vendor {
    id
    vendorName
    vendorEmail
    vendorPhone
    fcmToken
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
`;

export const VENDOR_AUTH_PAYLOAD_FRAGMENT = gql`
  fragment VendorAuthPayloadFragment on VendorAuthPayload {
    token
    vendor {
      ...VendorFragment
    }
  }
  ${VENDOR_FRAGMENT}
`;

export const VENDOR_LIST_RESPONSE_FRAGMENT = gql`
  fragment VendorListResponseFragment on VendorListResponse {
    vendors {
      ...VendorFragment
    }
    total
    page
    limit
    totalPages
  }
  ${VENDOR_FRAGMENT}
`;

export const USER_LIST_RESPONSE_FRAGMENT = gql`
  fragment UserListResponseFragment on UserListResponse {
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
  }
`;

// ======== QUERIES ========
export const GET_VENDOR_PROFILE = gql`
  query GetVendorProfile {
    vendorProfile {
      ...VendorFragment
    }
  }
  ${VENDOR_FRAGMENT}
`;

export const GET_VENDOR_BY_ID = gql`
  query GetVendorById($id: ID!) {
    vendor(id: $id) {
      ...VendorFragment
    }
  }
  ${VENDOR_FRAGMENT}
`;

export const GET_PENDING_VENDORS = gql`
  query GetPendingVendors {
    pendingVendors {
      ...VendorFragment
    }
  }
  ${VENDOR_FRAGMENT}
`;

export const GET_APPROVED_VENDORS = gql`
  query GetApprovedVendors {
    approvedVendors {
      ...VendorFragment
    }
  }
  ${VENDOR_FRAGMENT}
`;

// Vendor Management Queries
export const VENDOR_LIST_ALL_VENDORS = gql`
  query VendorListAllVendors($input: ListVendorsInput) {
    vendorListAllVendors(input: $input) {
      ...VendorListResponseFragment
    }
  }
  ${VENDOR_LIST_RESPONSE_FRAGMENT}
`;

export const VENDOR_LIST_ALL_USERS = gql`
  query VendorListAllUsers($input: ListUsersInput) {
    vendorListAllUsers(input: $input) {
      ...UserListResponseFragment
    }
  }
  ${USER_LIST_RESPONSE_FRAGMENT}
`;

export const VENDOR_GET_VENDOR_BY_ID = gql`
  query VendorGetVendorById($vendorId: ID!) {
    vendorGetVendorById(vendorId: $vendorId) {
      ...VendorFragment
    }
  }
  ${VENDOR_FRAGMENT}
`;

export const VENDOR_GET_USER_BY_ID = gql`
  query VendorGetUserById($userId: ID!) {
    vendorGetUserById(userId: $userId) {
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

// ======== MUTATIONS ========

// Registration Flow
export const VENDOR_REGISTER = gql`
  mutation VendorRegister($input: VendorRegisterInput!) {
    vendorRegister(input: $input)
  }
`;

export const VERIFY_VENDOR_REGISTRATION = gql`
  mutation VerifyVendorRegistration($input: VendorVerifyOtpInput!) {
    vendorVerifyRegistration(input: $input) {
      ...VendorAuthPayloadFragment
    }
  }
  ${VENDOR_AUTH_PAYLOAD_FRAGMENT}
`;

// Login Flow
export const VENDOR_LOGIN = gql`
  mutation VendorLogin($input: VendorLoginInput!) {
    vendorLogin(input: $input) {
      ...VendorAuthPayloadFragment
    }
  }
  ${VENDOR_AUTH_PAYLOAD_FRAGMENT}
`;

export const VENDOR_REQUEST_LOGIN_OTP = gql`
  mutation VendorRequestLoginOtp($vendorEmail: String!, $userType: UserType!) {
    vendorRequestLoginOtp(vendorEmail: $vendorEmail, userType: $userType)
  }
`;

export const VERIFY_VENDOR_LOGIN_OTP = gql`
  mutation VerifyVendorLoginOtp($input: VendorVerifyOtpInput!) {
    vendorVerifyLoginOtp(input: $input) {
      ...VendorAuthPayloadFragment
    }
  }
  ${VENDOR_AUTH_PAYLOAD_FRAGMENT}
`;

// Profile Management
export const UPDATE_VENDOR_PROFILE = gql`
  mutation UpdateVendorProfile($input: VendorUpdateProfileInput!) {
    vendorUpdateProfile(input: $input) {
      ...VendorFragment
    }
  }
  ${VENDOR_FRAGMENT}
`;

export const CHANGE_VENDOR_PASSWORD = gql`
  mutation ChangeVendorPassword($input: VendorChangePasswordInput!) {
    vendorChangePassword(input: $input)
  }
`;

// Password Reset Flow
export const RESET_VENDOR_PASSWORD = gql`
  mutation ResetVendorPassword($input: VendorResetPasswordInput!) {
    vendorResetPassword(input: $input)
  }
`;

export const SET_NEW_VENDOR_PASSWORD = gql`
  mutation SetNewVendorPassword($input: VendorSetNewPasswordInput!) {
    vendorSetNewPassword(input: $input)
  }
`;

// OTP Management
export const RESEND_VENDOR_OTP = gql`
  mutation ResendVendorOtp($input: VendorResendOtpInput!) {
    vendorResendOtp(input: $input)
  }
`;

// Account Management
export const DELETE_VENDOR_ACCOUNT = gql`
  mutation DeleteVendorAccount {
    vendorDeleteAccount
  }
`;

// Vendor Approval
export const VENDOR_APPROVAL = gql`
  mutation VendorApproval($input: VendorApprovalInput!) {
    vendorApproval(input: $input) {
      ...VendorFragment
    }
  }
  ${VENDOR_FRAGMENT}
`;

// Vendor Management Mutations
export const VENDOR_UPDATE_VENDOR_STATUS = gql`
  mutation VendorUpdateVendorStatus($input: VendorUpdateStatusInput!) {
    vendorUpdateVendorStatus(input: $input)
  }
`;

export const VENDOR_VERIFY_USER = gql`
  mutation VendorVerifyUser($userId: ID!) {
    vendorVerifyUser(userId: $userId)
  }
`;

// ======== TYPESCRIPT TYPES ========
export interface Vendor {
  id: string;
  vendorName: string;
  vendorEmail: string;
  vendorPhone?: string;
  fcmToken?: string[];
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
}

export interface VendorAuthPayload {
  token: string;
  vendor: Vendor;
}

export interface VendorListResponse {
  vendors: Vendor[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

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
  vendorType: 'FarmHouse' | 'Venue' | 'Catering' | 'Photography';
  vendorTypeId?: string;
}

export interface VendorLoginInput {
  vendorEmail: string;
  password: string;
}

export interface VendorVerifyOtpInput {
  vendorEmail: string;
  otp: string;
  purpose: 'registration' | 'password_reset';
  userType: 'User' | 'Vendor' | 'Admin';
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
  vendorType?: 'FarmHouse' | 'Venue' | 'Catering' | 'Photography';
  vendorTypeId?: string;
  fcmToken?: string;
}

export interface VendorChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface VendorResetPasswordInput {
  vendorEmail: string;
  userType: 'User' | 'Vendor' | 'Admin';
}

export interface VendorSetNewPasswordInput {
  vendorEmail: string;
  otp: string;
  newPassword: string;
  userType: 'User' | 'Vendor' | 'Admin';
}

export interface VendorResendOtpInput {
  vendorEmail: string;
  purpose: 'registration' | 'password_reset';
  userType: 'User' | 'Vendor' | 'Admin';
}

export interface VendorApprovalInput {
  vendorId: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  message?: string;
}

export interface VendorUpdateStatusInput {
  vendorId: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  message?: string;
}

export interface ListVendorsInput {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'Pending' | 'Approved' | 'Rejected';
  vendorType?: 'FarmHouse' | 'Venue' | 'Catering' | 'Photography';
}

export interface ListUsersInput {
  page?: number;
  limit?: number;
  search?: string;
}
