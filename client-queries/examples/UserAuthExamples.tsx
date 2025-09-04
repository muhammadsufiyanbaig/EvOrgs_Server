// Example React components showing how to use the authentication system

import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { 
  useUserRegistrationFlow, 
  useUserLoginFlow, 
  TokenUtils, 
  RoleUtils 
} from '../auth';

// ============== USER REGISTRATION COMPONENT ==============
export const UserRegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    gender: 'Male' as const,
  });
  const [otpData, setOtpData] = useState({
    email: '',
    otp: '',
  });
  const [step, setStep] = useState<'register' | 'verify'>('register');

  const { register, verify, resend, loading, errors } = useUserRegistrationFlow();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const success = await register(formData);
      if (success) {
        setOtpData({ ...otpData, email: formData.email });
        setStep('verify');
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await verify({
        email: otpData.email,
        otp: otpData.otp,
        purpose: 'registration',
        userType: 'User',
      });
      
      if (result) {
        TokenUtils.setToken(result.token);
        RoleUtils.setUserRole('User');
        // Redirect to dashboard or home page
        console.log('Registration successful!', result);
      }
    } catch (error) {
      console.error('OTP verification failed:', error);
    }
  };

  const handleResendOtp = async () => {
    try {
      await resend({
        email: otpData.email,
        purpose: 'registration',
        userType: 'User',
      });
    } catch (error) {
      console.error('Resend OTP failed:', error);
    }
  };

  if (step === 'verify') {
    return (
      <form onSubmit={handleVerifyOtp}>
        <h2>Verify Your Email</h2>
        <div>
          <label>OTP Code:</label>
          <input
            type="text"
            value={otpData.otp}
            onChange={(e) => setOtpData({ ...otpData, otp: e.target.value })}
            required
          />
        </div>
        <button type="submit" disabled={loading.verify}>
          {loading.verify ? 'Verifying...' : 'Verify OTP'}
        </button>
        <button type="button" onClick={handleResendOtp} disabled={loading.resend}>
          {loading.resend ? 'Resending...' : 'Resend OTP'}
        </button>
        {errors.verify && <p style={{ color: 'red' }}>{errors.verify.message}</p>}
      </form>
    );
  }

  return (
    <form onSubmit={handleRegister}>
      <h2>User Registration</h2>
      <div>
        <label>First Name:</label>
        <input
          type="text"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          required
        />
      </div>
      <div>
        <label>Last Name:</label>
        <input
          type="text"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          required
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
      </div>
      <div>
        <label>Phone:</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>
      <div>
        <label>Gender:</label>
        <select
          value={formData.gender}
          onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Others">Others</option>
        </select>
      </div>
      <button type="submit" disabled={loading.register}>
        {loading.register ? 'Registering...' : 'Register'}
      </button>
      {errors.register && <p style={{ color: 'red' }}>{errors.register.message}</p>}
    </form>
  );
};

// ============== USER LOGIN COMPONENT ==============
export const UserLoginForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [otpData, setOtpData] = useState({
    email: '',
    otp: '',
  });
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  const [step, setStep] = useState<'login' | 'verify'>('login');

  const { login, requestLoginOtp, verifyLoginOtp, loading, errors } = useUserLoginFlow();

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login(formData);
      if (result) {
        TokenUtils.setToken(result.token);
        RoleUtils.setUserRole('User');
        console.log('Login successful!', result);
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleOtpLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const success = await requestLoginOtp(formData.email);
      if (success) {
        setOtpData({ ...otpData, email: formData.email });
        setStep('verify');
      }
    } catch (error) {
      console.error('OTP request failed:', error);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await verifyLoginOtp({
        email: otpData.email,
        otp: otpData.otp,
        purpose: 'login',
        userType: 'User',
      });
      
      if (result) {
        TokenUtils.setToken(result.token);
        RoleUtils.setUserRole('User');
        console.log('OTP Login successful!', result);
      }
    } catch (error) {
      console.error('OTP verification failed:', error);
    }
  };

  if (step === 'verify') {
    return (
      <form onSubmit={handleVerifyOtp}>
        <h2>Enter OTP</h2>
        <div>
          <label>OTP Code:</label>
          <input
            type="text"
            value={otpData.otp}
            onChange={(e) => setOtpData({ ...otpData, otp: e.target.value })}
            required
          />
        </div>
        <button type="submit" disabled={loading.verify}>
          {loading.verify ? 'Verifying...' : 'Verify OTP'}
        </button>
        <button type="button" onClick={() => setStep('login')}>
          Back to Login
        </button>
        {errors.verify && <p style={{ color: 'red' }}>{errors.verify.message}</p>}
      </form>
    );
  }

  return (
    <div>
      <h2>User Login</h2>
      <div>
        <button
          onClick={() => setLoginMethod('password')}
          style={{ 
            backgroundColor: loginMethod === 'password' ? '#007bff' : '#f8f9fa',
            color: loginMethod === 'password' ? 'white' : 'black'
          }}
        >
          Password Login
        </button>
        <button
          onClick={() => setLoginMethod('otp')}
          style={{ 
            backgroundColor: loginMethod === 'otp' ? '#007bff' : '#f8f9fa',
            color: loginMethod === 'otp' ? 'white' : 'black'
          }}
        >
          OTP Login
        </button>
      </div>

      {loginMethod === 'password' ? (
        <form onSubmit={handlePasswordLogin}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" disabled={loading.login}>
            {loading.login ? 'Logging in...' : 'Login'}
          </button>
          {errors.login && <p style={{ color: 'red' }}>{errors.login.message}</p>}
        </form>
      ) : (
        <form onSubmit={handleOtpLogin}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <button type="submit" disabled={loading.otp}>
            {loading.otp ? 'Sending OTP...' : 'Send OTP'}
          </button>
          {errors.otp && <p style={{ color: 'red' }}>{errors.otp.message}</p>}
        </form>
      )}
    </div>
  );
};
