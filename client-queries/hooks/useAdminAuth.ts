import { useMutation, useQuery } from '@apollo/client';
import {
  // Admin Queries & Mutations
  ADMIN_ME,
  ADMIN_LIST_ALL_USERS,
  ADMIN_GET_USER_BY_ID,
  ADMIN_LIST_ALL_VENDORS,
  ADMIN_GET_VENDOR_BY_ID,
  ADMIN_SIGNUP,
  ADMIN_LOGIN,
  ADMIN_REQUEST_OTP,
  ADMIN_VERIFY_OTP,
  ADMIN_RESEND_OTP,
  ADMIN_RESET_PASSWORD,
  ADMIN_SET_NEW_PASSWORD,
  ADMIN_CHANGE_PASSWORD,
  ADMIN_UPDATE_PROFILE,
  ADMIN_DELETE_ACCOUNT,
  ADMIN_DELETE_USER,
  ADMIN_DELETE_VENDOR,
  ADMIN_UPDATE_VENDOR_STATUS,
  // Types
  Admin,
  AdminAuthResponse,
  AdminOtpResponse,
  AdminSignupInput,
  AdminLoginInput,
  AdminRequestOtpInput,
  AdminVerifyOtpInput,
  AdminResetPasswordInput,
  AdminUpdateProfileInput,
  AdminChangePasswordInput,
  AdminResendOtpInput,
  AdminSetNewPasswordInput,
  AdminVendorUpdateStatusInput,
  AdminListUsersInput,
  AdminListVendorsInput,
  AdminUserListResponse,
  AdminVendorListResponse,
} from '../auth/admin-auth';

// ============== ADMIN AUTH HOOKS ==============

// Query Hooks
export const useAdminMe = () => {
  return useQuery<{ adminMe: Admin }>(ADMIN_ME);
};

export const useAdminListAllUsers = (input?: AdminListUsersInput) => {
  return useQuery<{ adminListAllUsers: AdminUserListResponse }, { input?: AdminListUsersInput }>(
    ADMIN_LIST_ALL_USERS,
    { variables: { input } }
  );
};

export const useAdminGetUserById = (userId: string) => {
  return useQuery<{ adminGetUserById: any }, { userId: string }>(ADMIN_GET_USER_BY_ID, {
    variables: { userId },
    skip: !userId,
  });
};

export const useAdminListAllVendors = (input?: AdminListVendorsInput) => {
  return useQuery<{ adminListAllVendors: AdminVendorListResponse }, { input?: AdminListVendorsInput }>(
    ADMIN_LIST_ALL_VENDORS,
    { variables: { input } }
  );
};

export const useAdminGetVendorById = (vendorId: string) => {
  return useQuery<{ adminGetVendorById: any }, { vendorId: string }>(ADMIN_GET_VENDOR_BY_ID, {
    variables: { vendorId },
    skip: !vendorId,
  });
};

// Mutation Hooks
export const useAdminSignup = () => {
  return useMutation<{ adminSignup: AdminAuthResponse }, { input: AdminSignupInput }>(ADMIN_SIGNUP);
};

export const useAdminLogin = () => {
  return useMutation<{ adminLogin: AdminAuthResponse }, { input: AdminLoginInput }>(ADMIN_LOGIN);
};

export const useAdminRequestOtp = () => {
  return useMutation<{ adminRequestOtp: AdminOtpResponse }, { input: AdminRequestOtpInput }>(
    ADMIN_REQUEST_OTP
  );
};

export const useAdminVerifyOtp = () => {
  return useMutation<{ adminVerifyOtp: AdminOtpResponse }, { input: AdminVerifyOtpInput }>(
    ADMIN_VERIFY_OTP
  );
};

export const useAdminResendOtp = () => {
  return useMutation<{ adminResendOtp: AdminOtpResponse }, { input: AdminResendOtpInput }>(
    ADMIN_RESEND_OTP
  );
};

export const useAdminResetPassword = () => {
  return useMutation<{ adminResetPassword: AdminAuthResponse }, { input: AdminResetPasswordInput }>(
    ADMIN_RESET_PASSWORD
  );
};

export const useAdminSetNewPassword = () => {
  return useMutation<{ adminSetNewPassword: AdminAuthResponse }, { input: AdminSetNewPasswordInput }>(
    ADMIN_SET_NEW_PASSWORD
  );
};

export const useAdminChangePassword = () => {
  return useMutation<{ adminChangePassword: AdminAuthResponse }, { input: AdminChangePasswordInput }>(
    ADMIN_CHANGE_PASSWORD
  );
};

export const useAdminUpdateProfile = () => {
  return useMutation<{ adminUpdateAdminProfile: Admin }, { input: AdminUpdateProfileInput }>(
    ADMIN_UPDATE_PROFILE
  );
};

export const useAdminDeleteAccount = () => {
  return useMutation<{ adminDeleteAccount: boolean }>(ADMIN_DELETE_ACCOUNT);
};

export const useAdminDeleteUser = () => {
  return useMutation<{ adminDeleteUser: boolean }, { userId: string }>(ADMIN_DELETE_USER);
};

export const useAdminDeleteVendor = () => {
  return useMutation<{ adminDeleteVendor: boolean }, { vendorId: string }>(ADMIN_DELETE_VENDOR);
};

export const useAdminUpdateVendorStatus = () => {
  return useMutation<{ adminUpdateVendorStatus: any }, { input: AdminVendorUpdateStatusInput }>(
    ADMIN_UPDATE_VENDOR_STATUS
  );
};

// Complete Admin Auth Flow Hook
export const useAdminAuth = () => {
  const { data: adminData, loading: adminLoading, refetch: refetchAdmin } = useAdminMe();
  
  const [signup, { loading: signupLoading, error: signupError }] = useAdminSignup();
  const [login, { loading: loginLoading, error: loginError }] = useAdminLogin();
  const [requestOtp, { loading: otpLoading, error: otpError }] = useAdminRequestOtp();
  const [verifyOtp, { loading: verifyOtpLoading, error: verifyOtpError }] = useAdminVerifyOtp();
  const [resendOtp, { loading: resendLoading, error: resendError }] = useAdminResendOtp();
  const [resetPassword, { loading: resetLoading, error: resetError }] = useAdminResetPassword();
  const [setNewPassword, { loading: setNewPassLoading, error: setNewPassError }] = useAdminSetNewPassword();
  const [changePassword, { loading: changePassLoading, error: changePassError }] = useAdminChangePassword();
  const [updateProfile, { loading: updateLoading, error: updateError }] = useAdminUpdateProfile();
  const [deleteAccount, { loading: deleteLoading, error: deleteError }] = useAdminDeleteAccount();

  return {
    // Data
    admin: adminData?.adminMe,
    
    // Loading states
    loading: {
      admin: adminLoading,
      signup: signupLoading,
      login: loginLoading,
      otp: otpLoading,
      verifyOtp: verifyOtpLoading,
      resend: resendLoading,
      reset: resetLoading,
      setNewPassword: setNewPassLoading,
      changePassword: changePassLoading,
      update: updateLoading,
      delete: deleteLoading,
    },
    
    // Error states
    errors: {
      signup: signupError,
      login: loginError,
      otp: otpError,
      verifyOtp: verifyOtpError,
      resend: resendError,
      reset: resetError,
      setNewPassword: setNewPassError,
      changePassword: changePassError,
      update: updateError,
      delete: deleteError,
    },
    
    // Actions
    actions: {
      signup,
      login,
      requestOtp,
      verifyOtp,
      resendOtp,
      resetPassword,
      setNewPassword,
      changePassword,
      updateProfile,
      deleteAccount,
      refetchAdmin,
    },
  };
};

// Admin Registration Flow Hook
export const useAdminRegistrationFlow = () => {
  const [signup, { loading: signupLoading, error: signupError }] = useAdminSignup();
  const [verifyOtp, { loading: verifyLoading, error: verifyError }] = useAdminVerifyOtp();
  const [resendOtp, { loading: resendLoading, error: resendError }] = useAdminResendOtp();

  const register = async (input: AdminSignupInput) => {
    const result = await signup({ variables: { input } });
    return result.data?.adminSignup;
  };

  const verify = async (input: AdminVerifyOtpInput) => {
    const result = await verifyOtp({ variables: { input } });
    return result.data?.adminVerifyOtp;
  };

  const resend = async (input: AdminResendOtpInput) => {
    const result = await resendOtp({ variables: { input } });
    return result.data?.adminResendOtp;
  };

  return {
    register,
    verify,
    resend,
    loading: {
      register: signupLoading,
      verify: verifyLoading,
      resend: resendLoading,
    },
    errors: {
      register: signupError,
      verify: verifyError,
      resend: resendError,
    },
  };
};

// Admin Login Flow Hook
export const useAdminLoginFlow = () => {
  const [login, { loading: loginLoading, error: loginError }] = useAdminLogin();
  const [requestOtp, { loading: otpLoading, error: otpError }] = useAdminRequestOtp();
  const [verifyOtp, { loading: verifyLoading, error: verifyError }] = useAdminVerifyOtp();

  const adminLogin = async (input: AdminLoginInput) => {
    const result = await login({ variables: { input } });
    return result.data?.adminLogin;
  };

  const requestLoginOtp = async (email: string) => {
    const result = await requestOtp({ 
      variables: { 
        input: { email, purpose: 'login' } 
      } 
    });
    return result.data?.adminRequestOtp;
  };

  const verifyLoginOtp = async (input: AdminVerifyOtpInput) => {
    const result = await verifyOtp({ variables: { input } });
    return result.data?.adminVerifyOtp;
  };

  return {
    login: adminLogin,
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

// Admin Password Reset Flow Hook
export const useAdminPasswordResetFlow = () => {
  const [requestOtp, { loading: otpLoading, error: otpError }] = useAdminRequestOtp();
  const [resetPassword, { loading: resetLoading, error: resetError }] = useAdminResetPassword();
  const [setNewPassword, { loading: setLoading, error: setError }] = useAdminSetNewPassword();
  const [resendOtp, { loading: resendLoading, error: resendError }] = useAdminResendOtp();

  const requestReset = async (email: string) => {
    const result = await requestOtp({ 
      variables: { 
        input: { email, purpose: 'password_reset' } 
      } 
    });
    return result.data?.adminRequestOtp;
  };

  const confirmReset = async (input: AdminResetPasswordInput) => {
    const result = await resetPassword({ variables: { input } });
    return result.data?.adminResetPassword;
  };

  const setPassword = async (input: AdminSetNewPasswordInput) => {
    const result = await setNewPassword({ variables: { input } });
    return result.data?.adminSetNewPassword;
  };

  const resend = async (email: string) => {
    const result = await resendOtp({ 
      variables: { 
        input: { 
          email, 
          purpose: 'password_reset' 
        } 
      } 
    });
    return result.data?.adminResendOtp;
  };

  return {
    requestReset,
    confirmReset,
    setPassword,
    resend,
    loading: {
      otp: otpLoading,
      reset: resetLoading,
      set: setLoading,
      resend: resendLoading,
    },
    errors: {
      otp: otpError,
      reset: resetError,
      set: setError,
      resend: resendError,
    },
  };
};

// Admin Management Hooks
export const useAdminManagement = () => {
  const [deleteUser, { loading: deleteUserLoading, error: deleteUserError }] = useAdminDeleteUser();
  const [deleteVendor, { loading: deleteVendorLoading, error: deleteVendorError }] = useAdminDeleteVendor();
  const [updateVendorStatus, { loading: updateStatusLoading, error: updateStatusError }] = useAdminUpdateVendorStatus();

  const removeUser = async (userId: string) => {
    const result = await deleteUser({ variables: { userId } });
    return result.data?.adminDeleteUser;
  };

  const removeVendor = async (vendorId: string) => {
    const result = await deleteVendor({ variables: { vendorId } });
    return result.data?.adminDeleteVendor;
  };

  const updateStatus = async (input: AdminVendorUpdateStatusInput) => {
    const result = await updateVendorStatus({ variables: { input } });
    return result.data?.adminUpdateVendorStatus;
  };

  return {
    deleteUser: removeUser,
    deleteVendor: removeVendor,
    updateVendorStatus: updateStatus,
    loading: {
      deleteUser: deleteUserLoading,
      deleteVendor: deleteVendorLoading,
      updateStatus: updateStatusLoading,
    },
    errors: {
      deleteUser: deleteUserError,
      deleteVendor: deleteVendorError,
      updateStatus: updateStatusError,
    },
  };
};
