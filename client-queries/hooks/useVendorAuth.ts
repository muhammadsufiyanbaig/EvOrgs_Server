import { useMutation, useQuery } from '@apollo/client';
import {
  // Vendor Queries & Mutations
  GET_VENDOR_PROFILE,
  GET_VENDOR_BY_ID,
  GET_PENDING_VENDORS,
  GET_APPROVED_VENDORS,
  VENDOR_LIST_ALL_VENDORS,
  VENDOR_LIST_ALL_USERS,
  VENDOR_GET_VENDOR_BY_ID,
  VENDOR_GET_USER_BY_ID,
  VENDOR_REGISTER,
  VERIFY_VENDOR_REGISTRATION,
  VENDOR_LOGIN,
  VENDOR_REQUEST_LOGIN_OTP,
  VERIFY_VENDOR_LOGIN_OTP,
  UPDATE_VENDOR_PROFILE,
  CHANGE_VENDOR_PASSWORD,
  RESET_VENDOR_PASSWORD,
  SET_NEW_VENDOR_PASSWORD,
  RESEND_VENDOR_OTP,
  DELETE_VENDOR_ACCOUNT,
  VENDOR_APPROVAL,
  VENDOR_UPDATE_VENDOR_STATUS,
  VENDOR_VERIFY_USER,
  // Types
  Vendor,
  VendorAuthPayload,
  VendorListResponse,
  VendorRegisterInput,
  VendorLoginInput,
  VendorVerifyOtpInput,
  VendorUpdateProfileInput,
  VendorChangePasswordInput,
  VendorResetPasswordInput,
  VendorSetNewPasswordInput,
  VendorResendOtpInput,
  VendorApprovalInput,
  VendorUpdateStatusInput,
  ListVendorsInput,
  ListUsersInput,
} from '../auth/vendor-auth';

// ============== VENDOR AUTH HOOKS ==============

// Query Hooks
export const useVendorProfile = () => {
  return useQuery<{ vendorProfile: Vendor }>(GET_VENDOR_PROFILE);
};

export const useVendorById = (id: string) => {
  return useQuery<{ vendor: Vendor }, { id: string }>(GET_VENDOR_BY_ID, {
    variables: { id },
    skip: !id,
  });
};

export const usePendingVendors = () => {
  return useQuery<{ pendingVendors: Vendor[] }>(GET_PENDING_VENDORS);
};

export const useApprovedVendors = () => {
  return useQuery<{ approvedVendors: Vendor[] }>(GET_APPROVED_VENDORS);
};

export const useVendorListAllVendors = (input?: ListVendorsInput) => {
  return useQuery<{ vendorListAllVendors: VendorListResponse }, { input?: ListVendorsInput }>(
    VENDOR_LIST_ALL_VENDORS,
    { variables: { input } }
  );
};

export const useVendorListAllUsers = (input?: ListUsersInput) => {
  return useQuery<{ vendorListAllUsers: any }, { input?: ListUsersInput }>(
    VENDOR_LIST_ALL_USERS,
    { variables: { input } }
  );
};

// Mutation Hooks
export const useVendorRegister = () => {
  return useMutation<{ vendorRegister: boolean }, { input: VendorRegisterInput }>(VENDOR_REGISTER);
};

export const useVerifyVendorRegistration = () => {
  return useMutation<{ vendorVerifyRegistration: VendorAuthPayload }, { input: VendorVerifyOtpInput }>(
    VERIFY_VENDOR_REGISTRATION
  );
};

export const useVendorLogin = () => {
  return useMutation<{ vendorLogin: VendorAuthPayload }, { input: VendorLoginInput }>(VENDOR_LOGIN);
};

export const useVendorRequestLoginOtp = () => {
  return useMutation<{ vendorRequestLoginOtp: boolean }, { vendorEmail: string; userType: string }>(
    VENDOR_REQUEST_LOGIN_OTP
  );
};

export const useVerifyVendorLoginOtp = () => {
  return useMutation<{ vendorVerifyLoginOtp: VendorAuthPayload }, { input: VendorVerifyOtpInput }>(
    VERIFY_VENDOR_LOGIN_OTP
  );
};

export const useUpdateVendorProfile = () => {
  return useMutation<{ vendorUpdateProfile: Vendor }, { input: VendorUpdateProfileInput }>(
    UPDATE_VENDOR_PROFILE
  );
};

export const useChangeVendorPassword = () => {
  return useMutation<{ vendorChangePassword: boolean }, { input: VendorChangePasswordInput }>(
    CHANGE_VENDOR_PASSWORD
  );
};

export const useResetVendorPassword = () => {
  return useMutation<{ vendorResetPassword: boolean }, { input: VendorResetPasswordInput }>(
    RESET_VENDOR_PASSWORD
  );
};

export const useSetNewVendorPassword = () => {
  return useMutation<{ vendorSetNewPassword: boolean }, { input: VendorSetNewPasswordInput }>(
    SET_NEW_VENDOR_PASSWORD
  );
};

export const useResendVendorOtp = () => {
  return useMutation<{ vendorResendOtp: boolean }, { input: VendorResendOtpInput }>(RESEND_VENDOR_OTP);
};

export const useDeleteVendorAccount = () => {
  return useMutation<{ vendorDeleteAccount: boolean }>(DELETE_VENDOR_ACCOUNT);
};

export const useVendorApproval = () => {
  return useMutation<{ vendorApproval: Vendor }, { input: VendorApprovalInput }>(VENDOR_APPROVAL);
};

export const useVendorUpdateVendorStatus = () => {
  return useMutation<{ vendorUpdateVendorStatus: boolean }, { input: VendorUpdateStatusInput }>(
    VENDOR_UPDATE_VENDOR_STATUS
  );
};

export const useVendorVerifyUser = () => {
  return useMutation<{ vendorVerifyUser: boolean }, { userId: string }>(VENDOR_VERIFY_USER);
};

// Complete Vendor Auth Flow Hook
export const useVendorAuth = () => {
  const { data: vendorProfile, loading: profileLoading, refetch: refetchProfile } = useVendorProfile();
  
  const [registerVendor, { loading: registerLoading, error: registerError }] = useVendorRegister();
  const [verifyRegistration, { loading: verifyRegLoading, error: verifyRegError }] = useVerifyVendorRegistration();
  const [loginVendor, { loading: loginLoading, error: loginError }] = useVendorLogin();
  const [requestLoginOtp, { loading: otpLoading, error: otpError }] = useVendorRequestLoginOtp();
  const [verifyLoginOtp, { loading: verifyOtpLoading, error: verifyOtpError }] = useVerifyVendorLoginOtp();
  const [updateProfile, { loading: updateLoading, error: updateError }] = useUpdateVendorProfile();
  const [changePassword, { loading: changePassLoading, error: changePassError }] = useChangeVendorPassword();
  const [resetPassword, { loading: resetLoading, error: resetError }] = useResetVendorPassword();
  const [setNewPassword, { loading: setNewPassLoading, error: setNewPassError }] = useSetNewVendorPassword();
  const [resendOtp, { loading: resendLoading, error: resendError }] = useResendVendorOtp();
  const [deleteAccount, { loading: deleteLoading, error: deleteError }] = useDeleteVendorAccount();

  return {
    // Data
    vendorProfile: vendorProfile?.vendorProfile,
    
    // Loading states
    loading: {
      profile: profileLoading,
      register: registerLoading,
      verifyRegistration: verifyRegLoading,
      login: loginLoading,
      otp: otpLoading,
      verifyOtp: verifyOtpLoading,
      update: updateLoading,
      changePassword: changePassLoading,
      reset: resetLoading,
      setNewPassword: setNewPassLoading,
      resend: resendLoading,
      delete: deleteLoading,
    },
    
    // Error states
    errors: {
      register: registerError,
      verifyRegistration: verifyRegError,
      login: loginError,
      otp: otpError,
      verifyOtp: verifyOtpError,
      update: updateError,
      changePassword: changePassError,
      reset: resetError,
      setNewPassword: setNewPassError,
      resend: resendError,
      delete: deleteError,
    },
    
    // Actions
    actions: {
      register: registerVendor,
      verifyRegistration,
      login: loginVendor,
      requestLoginOtp,
      verifyLoginOtp,
      updateProfile,
      changePassword,
      resetPassword,
      setNewPassword,
      resendOtp,
      deleteAccount,
      refetchProfile,
    },
  };
};

// Vendor Registration Flow Hook
export const useVendorRegistrationFlow = () => {
  const [registerVendor, { loading: registerLoading, error: registerError }] = useVendorRegister();
  const [verifyRegistration, { loading: verifyLoading, error: verifyError }] = useVerifyVendorRegistration();
  const [resendOtp, { loading: resendLoading, error: resendError }] = useResendVendorOtp();

  const register = async (input: VendorRegisterInput) => {
    const result = await registerVendor({ variables: { input } });
    return result.data?.vendorRegister;
  };

  const verify = async (input: VendorVerifyOtpInput) => {
    const result = await verifyRegistration({ variables: { input } });
    return result.data?.vendorVerifyRegistration;
  };

  const resend = async (input: VendorResendOtpInput) => {
    const result = await resendOtp({ variables: { input } });
    return result.data?.vendorResendOtp;
  };

  return {
    register,
    verify,
    resend,
    loading: {
      register: registerLoading,
      verify: verifyLoading,
      resend: resendLoading,
    },
    errors: {
      register: registerError,
      verify: verifyError,
      resend: resendError,
    },
  };
};

// Vendor Login Flow Hook
export const useVendorLoginFlow = () => {
  const [loginVendor, { loading: loginLoading, error: loginError }] = useVendorLogin();
  const [requestOtp, { loading: otpLoading, error: otpError }] = useVendorRequestLoginOtp();
  const [verifyOtp, { loading: verifyLoading, error: verifyError }] = useVerifyVendorLoginOtp();

  const login = async (input: VendorLoginInput) => {
    const result = await loginVendor({ variables: { input } });
    return result.data?.vendorLogin;
  };

  const requestLoginOtp = async (vendorEmail: string) => {
    const result = await requestOtp({ 
      variables: { vendorEmail, userType: 'Vendor' } 
    });
    return result.data?.vendorRequestLoginOtp;
  };

  const verifyLoginOtp = async (input: VendorVerifyOtpInput) => {
    const result = await verifyOtp({ variables: { input } });
    return result.data?.vendorVerifyLoginOtp;
  };

  return {
    login,
    requestLoginOtp,
    verifyLoginOtp,
    loading: {
      login: loginLoading,
      otp: otpLoading,
      verify: verifyLoading,
    },
    errors: {
      login: loginError,
      otp: otpError,
      verify: verifyError,
    },
  };
};

// Vendor Password Reset Flow Hook
export const useVendorPasswordResetFlow = () => {
  const [resetPassword, { loading: resetLoading, error: resetError }] = useResetVendorPassword();
  const [setNewPassword, { loading: setLoading, error: setError }] = useSetNewVendorPassword();
  const [resendOtp, { loading: resendLoading, error: resendError }] = useResendVendorOtp();

  const requestReset = async (vendorEmail: string) => {
    const result = await resetPassword({ 
      variables: { 
        input: { vendorEmail, userType: 'Vendor' } 
      } 
    });
    return result.data?.vendorResetPassword;
  };

  const setPassword = async (input: VendorSetNewPasswordInput) => {
    const result = await setNewPassword({ variables: { input } });
    return result.data?.vendorSetNewPassword;
  };

  const resend = async (vendorEmail: string) => {
    const result = await resendOtp({ 
      variables: { 
        input: { 
          vendorEmail, 
          purpose: 'password_reset', 
          userType: 'Vendor' 
        } 
      } 
    });
    return result.data?.vendorResendOtp;
  };

  return {
    requestReset,
    setPassword,
    resend,
    loading: {
      reset: resetLoading,
      set: setLoading,
      resend: resendLoading,
    },
    errors: {
      reset: resetError,
      set: setError,
      resend: resendError,
    },
  };
};

// Vendor Management Hooks
export const useVendorManagement = () => {
  const [approveVendor, { loading: approveLoading, error: approveError }] = useVendorApproval();
  const [updateVendorStatus, { loading: updateStatusLoading, error: updateStatusError }] = useVendorUpdateVendorStatus();
  const [verifyUser, { loading: verifyUserLoading, error: verifyUserError }] = useVendorVerifyUser();

  const approve = async (input: VendorApprovalInput) => {
    const result = await approveVendor({ variables: { input } });
    return result.data?.vendorApproval;
  };

  const updateStatus = async (input: VendorUpdateStatusInput) => {
    const result = await updateVendorStatus({ variables: { input } });
    return result.data?.vendorUpdateVendorStatus;
  };

  const verifyUserById = async (userId: string) => {
    const result = await verifyUser({ variables: { userId } });
    return result.data?.vendorVerifyUser;
  };

  return {
    approve,
    updateStatus,
    verifyUser: verifyUserById,
    loading: {
      approve: approveLoading,
      updateStatus: updateStatusLoading,
      verifyUser: verifyUserLoading,
    },
    errors: {
      approve: approveError,
      updateStatus: updateStatusError,
      verifyUser: verifyUserError,
    },
  };
};
