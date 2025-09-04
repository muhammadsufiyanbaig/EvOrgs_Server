// Example React components for Vendor Authentication

import React, { useState } from 'react';
import { 
  useVendorRegistrationFlow, 
  useVendorLoginFlow, 
  useVendorAuth,
  TokenUtils, 
  RoleUtils 
} from '../auth';

// ============== VENDOR REGISTRATION COMPONENT ==============
export const VendorRegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    vendorName: '',
    vendorEmail: '',
    password: '',
    vendorPhone: '',
    vendorAddress: '',
    vendorProfileDescription: '',
    vendorWebsite: '',
    vendorType: 'Venue' as const,
  });
  const [otpData, setOtpData] = useState({
    vendorEmail: '',
    otp: '',
  });
  const [step, setStep] = useState<'register' | 'verify'>('register');

  const { register, verify, resend, loading, errors } = useVendorRegistrationFlow();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const success = await register(formData);
      if (success) {
        setOtpData({ ...otpData, vendorEmail: formData.vendorEmail });
        setStep('verify');
      }
    } catch (error) {
      console.error('Vendor registration failed:', error);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await verify({
        vendorEmail: otpData.vendorEmail,
        otp: otpData.otp,
        purpose: 'registration',
        userType: 'Vendor',
      });
      
      if (result) {
        TokenUtils.setToken(result.token);
        RoleUtils.setUserRole('Vendor');
        console.log('Vendor registration successful!', result);
      }
    } catch (error) {
      console.error('OTP verification failed:', error);
    }
  };

  if (step === 'verify') {
    return (
      <form onSubmit={handleVerifyOtp}>
        <h2>Verify Your Vendor Email</h2>
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
        {errors.verify && <p style={{ color: 'red' }}>{errors.verify.message}</p>}
      </form>
    );
  }

  return (
    <form onSubmit={handleRegister}>
      <h2>Vendor Registration</h2>
      <div>
        <label>Business Name:</label>
        <input
          type="text"
          value={formData.vendorName}
          onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
          required
        />
      </div>
      <div>
        <label>Business Email:</label>
        <input
          type="email"
          value={formData.vendorEmail}
          onChange={(e) => setFormData({ ...formData, vendorEmail: e.target.value })}
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
        <label>Business Type:</label>
        <select
          value={formData.vendorType}
          onChange={(e) => setFormData({ ...formData, vendorType: e.target.value as any })}
        >
          <option value="Venue">Venue</option>
          <option value="FarmHouse">Farm House</option>
          <option value="Catering">Catering</option>
          <option value="Photography">Photography</option>
        </select>
      </div>
      <div>
        <label>Phone:</label>
        <input
          type="tel"
          value={formData.vendorPhone}
          onChange={(e) => setFormData({ ...formData, vendorPhone: e.target.value })}
        />
      </div>
      <div>
        <label>Address:</label>
        <textarea
          value={formData.vendorAddress}
          onChange={(e) => setFormData({ ...formData, vendorAddress: e.target.value })}
        />
      </div>
      <div>
        <label>Business Description:</label>
        <textarea
          value={formData.vendorProfileDescription}
          onChange={(e) => setFormData({ ...formData, vendorProfileDescription: e.target.value })}
        />
      </div>
      <div>
        <label>Website:</label>
        <input
          type="url"
          value={formData.vendorWebsite}
          onChange={(e) => setFormData({ ...formData, vendorWebsite: e.target.value })}
        />
      </div>
      <button type="submit" disabled={loading.register}>
        {loading.register ? 'Registering...' : 'Register Business'}
      </button>
      {errors.register && <p style={{ color: 'red' }}>{errors.register.message}</p>}
    </form>
  );
};

// ============== VENDOR DASHBOARD COMPONENT ==============
export const VendorDashboard: React.FC = () => {
  const { vendorProfile, loading, actions } = useVendorAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    vendorName: '',
    vendorPhone: '',
    vendorAddress: '',
    vendorProfileDescription: '',
    vendorWebsite: '',
  });

  React.useEffect(() => {
    if (vendorProfile) {
      setEditData({
        vendorName: vendorProfile.vendorName || '',
        vendorPhone: vendorProfile.vendorPhone || '',
        vendorAddress: vendorProfile.vendorAddress || '',
        vendorProfileDescription: vendorProfile.vendorProfileDescription || '',
        vendorWebsite: vendorProfile.vendorWebsite || '',
      });
    }
  }, [vendorProfile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await actions.updateProfile({ variables: { input: editData } });
      setIsEditing(false);
      actions.refetchProfile();
    } catch (error) {
      console.error('Profile update failed:', error);
    }
  };

  if (loading.profile) {
    return <div>Loading vendor profile...</div>;
  }

  if (!vendorProfile) {
    return <div>No vendor profile found. Please log in.</div>;
  }

  return (
    <div>
      <h1>Vendor Dashboard</h1>
      
      <div style={{ 
        padding: '20px', 
        border: '1px solid #ddd', 
        borderRadius: '8px',
        backgroundColor: vendorProfile.vendorStatus === 'Approved' ? '#d4edda' : 
                         vendorProfile.vendorStatus === 'Pending' ? '#fff3cd' : '#f8d7da'
      }}>
        <h3>Account Status: {vendorProfile.vendorStatus}</h3>
        {vendorProfile.vendorStatus === 'Pending' && (
          <p>Your account is pending approval. You'll be notified once it's approved.</p>
        )}
        {vendorProfile.vendorStatus === 'Rejected' && (
          <p>Your account was rejected. Please contact support for more information.</p>
        )}
      </div>

      <div style={{ marginTop: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Business Profile</h2>
          <button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleUpdateProfile}>
            <div>
              <label>Business Name:</label>
              <input
                type="text"
                value={editData.vendorName}
                onChange={(e) => setEditData({ ...editData, vendorName: e.target.value })}
              />
            </div>
            <div>
              <label>Phone:</label>
              <input
                type="tel"
                value={editData.vendorPhone}
                onChange={(e) => setEditData({ ...editData, vendorPhone: e.target.value })}
              />
            </div>
            <div>
              <label>Address:</label>
              <textarea
                value={editData.vendorAddress}
                onChange={(e) => setEditData({ ...editData, vendorAddress: e.target.value })}
              />
            </div>
            <div>
              <label>Description:</label>
              <textarea
                value={editData.vendorProfileDescription}
                onChange={(e) => setEditData({ ...editData, vendorProfileDescription: e.target.value })}
              />
            </div>
            <div>
              <label>Website:</label>
              <input
                type="url"
                value={editData.vendorWebsite}
                onChange={(e) => setEditData({ ...editData, vendorWebsite: e.target.value })}
              />
            </div>
            <button type="submit" disabled={loading.update}>
              {loading.update ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        ) : (
          <div>
            <p><strong>Business Name:</strong> {vendorProfile.vendorName}</p>
            <p><strong>Email:</strong> {vendorProfile.vendorEmail}</p>
            <p><strong>Phone:</strong> {vendorProfile.vendorPhone || 'Not provided'}</p>
            <p><strong>Type:</strong> {vendorProfile.vendorType}</p>
            <p><strong>Address:</strong> {vendorProfile.vendorAddress || 'Not provided'}</p>
            <p><strong>Description:</strong> {vendorProfile.vendorProfileDescription || 'Not provided'}</p>
            <p><strong>Website:</strong> {vendorProfile.vendorWebsite || 'Not provided'}</p>
            <p><strong>Rating:</strong> {vendorProfile.rating || 'No ratings yet'}</p>
            <p><strong>Reviews:</strong> {vendorProfile.reviewCount || 0}</p>
            <p><strong>Member Since:</strong> {new Date(vendorProfile.createdAt).toLocaleDateString()}</p>
          </div>
        )}
      </div>
    </div>
  );
};
