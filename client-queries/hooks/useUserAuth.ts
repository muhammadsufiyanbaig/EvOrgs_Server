import { useMutation, useQuery, useLazyQuery } from '@apollo/client';
import {
  // User Queries & Mutations
  GET_CURRENT_USER,
  REGISTER_USER,
  VERIFY_USER_REGISTRATION,
  LOGIN_USER,
  REQUEST_LOGIN_OTP,
  VERIFY_LOGIN_OTP,
  UPDATE_USER_PROFILE,
  CHANGE_USER_PASSWORD,
  RESET_USER_PASSWORD,
  SET_NEW_USER_PASSWORD,
  RESEND_USER_OTP,
  DELETE_USER_ACCOUNT,
  // Types
  User,
  AuthPayload,
  RegisterInput,
  LoginInput,
  UpdateProfileInput,
  ChangePasswordInput,
  VerifyOtpInput,
  ResendOtpInput,
  ResetPasswordInput,
  SetNewPasswordInput,
} from '../auth/user-auth';

// ============== USER AUTH HOOKS ==============

// Query Hooks
export const useCurrentUser = () => {
  return useQuery<{ me: User }>(GET_CURRENT_USER);
};

// Mutation Hooks
export const useRegisterUser = () => {
  return useMutation<{ register: boolean }, { input: RegisterInput }>(REGISTER_USER);
};

export const useVerifyUserRegistration = () => {
  return useMutation<{ verifyRegistration: AuthPayload }, { input: VerifyOtpInput }>(
    VERIFY_USER_REGISTRATION
  );
};

export const useLoginUser = () => {
  return useMutation<{ login: AuthPayload }, { input: LoginInput }>(LOGIN_USER);
};

export const useRequestLoginOtp = () => {
  return useMutation<{ requestLoginOtp: boolean }, { email: string; userType: string }>(
    REQUEST_LOGIN_OTP
  );
};

export const useVerifyLoginOtp = () => {
  return useMutation<{ verifyLoginOtp: AuthPayload }, { input: VerifyOtpInput }>(
    VERIFY_LOGIN_OTP
  );
};

export const useUpdateUserProfile = () => {
  return useMutation<{ updateProfile: User }, { input: UpdateProfileInput }>(
    UPDATE_USER_PROFILE
  );
};

export const useChangeUserPassword = () => {
  return useMutation<{ changePassword: boolean }, { input: ChangePasswordInput }>(
    CHANGE_USER_PASSWORD
  );
};

export const useResetUserPassword = () => {
  return useMutation<{ resetPassword: boolean }, { input: ResetPasswordInput }>(
    RESET_USER_PASSWORD
  );
};

export const useSetNewUserPassword = () => {
  return useMutation<{ setNewPassword: boolean }, { input: SetNewPasswordInput }>(
    SET_NEW_USER_PASSWORD
  );
};

export const useResendUserOtp = () => {
  return useMutation<{ resendOtp: boolean }, { input: ResendOtpInput }>(RESEND_USER_OTP);
};

export const useDeleteUserAccount = () => {
  return useMutation<{ deleteAccount: boolean }>(DELETE_USER_ACCOUNT);
};

// Complete User Auth Flow Hook
export const useUserAuth = () => {
  const { data: currentUser, loading: userLoading, refetch: refetchUser } = useCurrentUser();
  
  const [registerUser, { loading: registerLoading, error: registerError }] = useRegisterUser();
  const [verifyRegistration, { loading: verifyRegLoading, error: verifyRegError }] = useVerifyUserRegistration();
  const [loginUser, { loading: loginLoading, error: loginError }] = useLoginUser();
  const [requestLoginOtp, { loading: otpLoading, error: otpError }] = useRequestLoginOtp();
  const [verifyLoginOtp, { loading: verifyOtpLoading, error: verifyOtpError }] = useVerifyLoginOtp();
  const [updateProfile, { loading: updateLoading, error: updateError }] = useUpdateUserProfile();
  const [changePassword, { loading: changePassLoading, error: changePassError }] = useChangeUserPassword();
  const [resetPassword, { loading: resetLoading, error: resetError }] = useResetUserPassword();
  const [setNewPassword, { loading: setNewPassLoading, error: setNewPassError }] = useSetNewUserPassword();
  const [resendOtp, { loading: resendLoading, error: resendError }] = useResendUserOtp();
  const [deleteAccount, { loading: deleteLoading, error: deleteError }] = useDeleteUserAccount();

  return {
    // Data
    currentUser: currentUser?.me,
    
    // Loading states
    loading: {
      user: userLoading,
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
      register: registerUser,
      verifyRegistration,
      login: loginUser,
      requestLoginOtp,
      verifyLoginOtp,
      updateProfile,
      changePassword,
      resetPassword,
      setNewPassword,
      resendOtp,
      deleteAccount,
      refetchUser,
    },
  };
};

// User Registration Flow Hook
export const useUserRegistrationFlow = () => {
  const [registerUser, { loading: registerLoading, error: registerError }] = useRegisterUser();
  const [verifyRegistration, { loading: verifyLoading, error: verifyError }] = useVerifyUserRegistration();
  const [resendOtp, { loading: resendLoading, error: resendError }] = useResendUserOtp();

  const register = async (input: RegisterInput) => {
    const result = await registerUser({ variables: { input } });
    return result.data?.register;
  };

  const verify = async (input: VerifyOtpInput) => {
    const result = await verifyRegistration({ variables: { input } });
    return result.data?.verifyRegistration;
  };

  const resend = async (input: ResendOtpInput) => {
    const result = await resendOtp({ variables: { input } });
    return result.data?.resendOtp;
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

// User Login Flow Hook
export const useUserLoginFlow = () => {
  const [loginUser, { loading: loginLoading, error: loginError }] = useLoginUser();
  const [requestOtp, { loading: otpLoading, error: otpError }] = useRequestLoginOtp();
  const [verifyOtp, { loading: verifyLoading, error: verifyError }] = useVerifyLoginOtp();

  const login = async (input: LoginInput) => {
    const result = await loginUser({ variables: { input } });
    return result.data?.login;
  };

  const requestLoginOtp = async (email: string) => {
    const result = await requestOtp({ 
      variables: { email, userType: 'User' } 
    });
    return result.data?.requestLoginOtp;
  };

  const verifyLoginOtp = async (input: VerifyOtpInput) => {
    const result = await verifyOtp({ variables: { input } });
    return result.data?.verifyLoginOtp;
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

// User Password Reset Flow Hook
export const useUserPasswordResetFlow = () => {
  const [resetPassword, { loading: resetLoading, error: resetError }] = useResetUserPassword();
  const [setNewPassword, { loading: setLoading, error: setError }] = useSetNewUserPassword();
  const [resendOtp, { loading: resendLoading, error: resendError }] = useResendUserOtp();

  const requestReset = async (email: string) => {
    const result = await resetPassword({ 
      variables: { 
        input: { email, userType: 'User' } 
      } 
    });
    return result.data?.resetPassword;
  };

  const setPassword = async (input: SetNewPasswordInput) => {
    const result = await setNewPassword({ variables: { input } });
    return result.data?.setNewPassword;
  };

  const resend = async (email: string) => {
    const result = await resendOtp({ 
      variables: { 
        input: { 
          email, 
          purpose: 'password_reset', 
          userType: 'User' 
        } 
      } 
    });
    return result.data?.resendOtp;
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
