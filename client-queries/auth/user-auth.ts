import { gql } from '@apollo/client';

// ============== USER AUTHENTICATION QUERIES & MUTATIONS ==============

// ======== FRAGMENTS ========
export const USER_FRAGMENT = gql`
  fragment UserFragment on User {
    id
    firstName
    lastName
    email
    phone
    address
    fcmToken
    profileImage
    dateOfBirth
    gender
    createdAt
    isVerified
  }
`;

export const AUTH_PAYLOAD_FRAGMENT = gql`
  fragment AuthPayloadFragment on AuthPayload {
    token
    user {
      ...UserFragment
    }
  }
  ${USER_FRAGMENT}
`;

// ======== QUERIES ========
export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    me {
      ...UserFragment
    }
  }
  ${USER_FRAGMENT}
`;

// ======== MUTATIONS ========

// Registration Flow
export const REGISTER_USER = gql`
  mutation RegisterUser($input: RegisterInput!) {
    register(input: $input)
  }
`;

export const VERIFY_USER_REGISTRATION = gql`
  mutation VerifyUserRegistration($input: VerifyOtpInput!) {
    verifyRegistration(input: $input) {
      ...AuthPayloadFragment
    }
  }
  ${AUTH_PAYLOAD_FRAGMENT}
`;

// Login Flow
export const LOGIN_USER = gql`
  mutation LoginUser($input: LoginInput!) {
    login(input: $input) {
      ...AuthPayloadFragment
    }
  }
  ${AUTH_PAYLOAD_FRAGMENT}
`;

export const REQUEST_LOGIN_OTP = gql`
  mutation RequestLoginOtp($email: String!, $userType: UserType!) {
    requestLoginOtp(email: $email, userType: $userType)
  }
`;

export const VERIFY_LOGIN_OTP = gql`
  mutation VerifyLoginOtp($input: VerifyOtpInput!) {
    verifyLoginOtp(input: $input) {
      ...AuthPayloadFragment
    }
  }
  ${AUTH_PAYLOAD_FRAGMENT}
`;

// Profile Management
export const UPDATE_USER_PROFILE = gql`
  mutation UpdateUserProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      ...UserFragment
    }
  }
  ${USER_FRAGMENT}
`;

export const CHANGE_USER_PASSWORD = gql`
  mutation ChangeUserPassword($input: ChangePasswordInput!) {
    changePassword(input: $input)
  }
`;

// Password Reset Flow
export const RESET_USER_PASSWORD = gql`
  mutation ResetUserPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input)
  }
`;

export const SET_NEW_USER_PASSWORD = gql`
  mutation SetNewUserPassword($input: SetNewPasswordInput!) {
    setNewPassword(input: $input)
  }
`;

// OTP Management
export const RESEND_USER_OTP = gql`
  mutation ResendUserOtp($input: ResendOtpInput!) {
    resendOtp(input: $input)
  }
`;

// Account Management
export const DELETE_USER_ACCOUNT = gql`
  mutation DeleteUserAccount {
    deleteAccount
  }
`;

// ======== TYPESCRIPT TYPES ========
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  fcmToken?: string[];
  profileImage?: string;
  dateOfBirth?: string;
  gender: 'Male' | 'Female' | 'Others';
  createdAt: string;
  isVerified: boolean;
}

export interface AuthPayload {
  token: string;
  user: User;
}

export interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  profileImage?: string;
  dateOfBirth?: string;
  gender: 'Male' | 'Female' | 'Others';
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface UpdateProfileInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  profileImage?: string;
  dateOfBirth?: string;
  gender?: 'Male' | 'Female' | 'Others';
  fcmToken?: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface VerifyOtpInput {
  email: string;
  otp: string;
  purpose: 'registration' | 'password_reset';
  userType: 'User' | 'Vendor' | 'Admin';
}

export interface ResendOtpInput {
  email: string;
  purpose: 'registration' | 'password_reset';
  userType: 'User' | 'Vendor' | 'Admin';
}

export interface ResetPasswordInput {
  email: string;
  userType: 'User' | 'Vendor' | 'Admin';
}

export interface SetNewPasswordInput {
  email: string;
  otp: string;
  newPassword: string;
  userType: 'User' | 'Vendor' | 'Admin';
}
