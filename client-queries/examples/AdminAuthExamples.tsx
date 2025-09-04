// Example React components for Admin Authentication and Management

import React, { useState } from 'react';
import { 
  useAdminAuth, 
  useAdminLoginFlow,
  TokenUtils, 
  RoleUtils,
  UserRole 
} from '../auth';

// ============== ADMIN LOGIN COMPONENT ==============
export const AdminLoginForm: React.FC = () => {
  const [formData, setFormData] = useState({
    adminEmail: '',
    password: '',
  });

  const { login, loading, errors } = useAdminLoginFlow();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login(formData);
      if (result) {
        TokenUtils.setToken(result.token);
        RoleUtils.setUserRole('Admin');
        console.log('Admin login successful!', result);
      }
    } catch (error) {
      console.error('Admin login failed:', error);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <form onSubmit={handleLogin}>
        <h2>Admin Login</h2>
        <div style={{ marginBottom: '15px' }}>
          <label>Admin Email:</label>
          <input
            type="email"
            value={formData.adminEmail}
            onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Password:</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            required
          />
        </div>
        <button 
          type="submit" 
          disabled={loading.login}
          style={{ 
            width: '100%', 
            padding: '10px', 
            backgroundColor: loading.login ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          {loading.login ? 'Logging in...' : 'Login'}
        </button>
        {errors.login && (
          <p style={{ color: 'red', marginTop: '10px' }}>{errors.login.message}</p>
        )}
      </form>
    </div>
  );
};

// ============== ADMIN DASHBOARD COMPONENT ==============
export const AdminDashboard: React.FC = () => {
  const { adminProfile, loading, actions } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'vendors' | 'profile'>('users');
  
  // User management state
  const [userActions, setUserActions] = useState({
    selectedUserId: '',
    actionType: 'ban' as 'ban' | 'unban' | 'delete',
  });

  // Vendor management state
  const [vendorActions, setVendorActions] = useState({
    selectedVendorId: '',
    actionType: 'approve' as 'approve' | 'reject' | 'ban' | 'unban',
  });

  const handleUserAction = async () => {
    if (!userActions.selectedUserId) return;
    
    try {
      switch (userActions.actionType) {
        case 'ban':
          await actions.banUser({ variables: { userId: userActions.selectedUserId } });
          break;
        case 'unban':
          await actions.unbanUser({ variables: { userId: userActions.selectedUserId } });
          break;
        case 'delete':
          await actions.deleteUser({ variables: { userId: userActions.selectedUserId } });
          break;
      }
      console.log(`User ${userActions.actionType} action completed successfully`);
      setUserActions({ selectedUserId: '', actionType: 'ban' });
    } catch (error) {
      console.error(`User ${userActions.actionType} action failed:`, error);
    }
  };

  const handleVendorAction = async () => {
    if (!vendorActions.selectedVendorId) return;
    
    try {
      switch (vendorActions.actionType) {
        case 'approve':
          await actions.approveVendor({ variables: { vendorId: vendorActions.selectedVendorId } });
          break;
        case 'reject':
          await actions.rejectVendor({ variables: { vendorId: vendorActions.selectedVendorId } });
          break;
        case 'ban':
          await actions.banVendor({ variables: { vendorId: vendorActions.selectedVendorId } });
          break;
        case 'unban':
          await actions.unbanVendor({ variables: { vendorId: vendorActions.selectedVendorId } });
          break;
      }
      console.log(`Vendor ${vendorActions.actionType} action completed successfully`);
      setVendorActions({ selectedVendorId: '', actionType: 'approve' });
    } catch (error) {
      console.error(`Vendor ${vendorActions.actionType} action failed:`, error);
    }
  };

  if (loading.profile) {
    return <div>Loading admin dashboard...</div>;
  }

  if (!adminProfile) {
    return <div>Access denied. Admin authentication required.</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Dashboard</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <p><strong>Welcome, {adminProfile.adminName}!</strong></p>
        <p>Role: {adminProfile.role}</p>
      </div>

      {/* Tab Navigation */}
      <div style={{ borderBottom: '2px solid #ddd', marginBottom: '20px' }}>
        <button 
          onClick={() => setActiveTab('users')}
          style={{ 
            padding: '10px 20px', 
            border: 'none', 
            backgroundColor: activeTab === 'users' ? '#007bff' : 'transparent',
            color: activeTab === 'users' ? 'white' : '#007bff',
            marginRight: '10px'
          }}
        >
          User Management
        </button>
        <button 
          onClick={() => setActiveTab('vendors')}
          style={{ 
            padding: '10px 20px', 
            border: 'none', 
            backgroundColor: activeTab === 'vendors' ? '#007bff' : 'transparent',
            color: activeTab === 'vendors' ? 'white' : '#007bff',
            marginRight: '10px'
          }}
        >
          Vendor Management
        </button>
        <button 
          onClick={() => setActiveTab('profile')}
          style={{ 
            padding: '10px 20px', 
            border: 'none', 
            backgroundColor: activeTab === 'profile' ? '#007bff' : 'transparent',
            color: activeTab === 'profile' ? 'white' : '#007bff'
          }}
        >
          Profile
        </button>
      </div>

      {/* User Management Tab */}
      {activeTab === 'users' && (
        <div>
          <h2>User Management</h2>
          <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
            <h3>User Actions</h3>
            <div style={{ marginBottom: '15px' }}>
              <label>User ID:</label>
              <input
                type="text"
                value={userActions.selectedUserId}
                onChange={(e) => setUserActions({ ...userActions, selectedUserId: e.target.value })}
                placeholder="Enter user ID"
                style={{ marginLeft: '10px', padding: '5px' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label>Action:</label>
              <select
                value={userActions.actionType}
                onChange={(e) => setUserActions({ ...userActions, actionType: e.target.value as any })}
                style={{ marginLeft: '10px', padding: '5px' }}
              >
                <option value="ban">Ban User</option>
                <option value="unban">Unban User</option>
                <option value="delete">Delete User</option>
              </select>
            </div>
            <button 
              onClick={handleUserAction}
              disabled={!userActions.selectedUserId || loading.userActions}
              style={{ 
                padding: '10px 20px', 
                backgroundColor: '#dc3545', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px' 
              }}
            >
              {loading.userActions ? 'Processing...' : `Execute ${userActions.actionType}`}
            </button>
          </div>
        </div>
      )}

      {/* Vendor Management Tab */}
      {activeTab === 'vendors' && (
        <div>
          <h2>Vendor Management</h2>
          <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
            <h3>Vendor Actions</h3>
            <div style={{ marginBottom: '15px' }}>
              <label>Vendor ID:</label>
              <input
                type="text"
                value={vendorActions.selectedVendorId}
                onChange={(e) => setVendorActions({ ...vendorActions, selectedVendorId: e.target.value })}
                placeholder="Enter vendor ID"
                style={{ marginLeft: '10px', padding: '5px' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label>Action:</label>
              <select
                value={vendorActions.actionType}
                onChange={(e) => setVendorActions({ ...vendorActions, actionType: e.target.value as any })}
                style={{ marginLeft: '10px', padding: '5px' }}
              >
                <option value="approve">Approve Vendor</option>
                <option value="reject">Reject Vendor</option>
                <option value="ban">Ban Vendor</option>
                <option value="unban">Unban Vendor</option>
              </select>
            </div>
            <button 
              onClick={handleVendorAction}
              disabled={!vendorActions.selectedVendorId || loading.vendorActions}
              style={{ 
                padding: '10px 20px', 
                backgroundColor: vendorActions.actionType === 'approve' ? '#28a745' : '#dc3545', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px' 
              }}
            >
              {loading.vendorActions ? 'Processing...' : `Execute ${vendorActions.actionType}`}
            </button>
          </div>
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div>
          <h2>Admin Profile</h2>
          <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
            <p><strong>Name:</strong> {adminProfile.adminName}</p>
            <p><strong>Email:</strong> {adminProfile.adminEmail}</p>
            <p><strong>Role:</strong> {adminProfile.role}</p>
            <p><strong>Account Created:</strong> {new Date(adminProfile.createdAt).toLocaleDateString()}</p>
            
            <div style={{ marginTop: '20px' }}>
              <h3>Quick Stats</h3>
              <p>• Platform administrators have full access to user and vendor management</p>
              <p>• Use the User Management tab to moderate user accounts</p>
              <p>• Use the Vendor Management tab to approve/reject vendor applications</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============== ADMIN APP WRAPPER ==============
export const AdminApp: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  React.useEffect(() => {
    const token = TokenUtils.getToken();
    const role = RoleUtils.getUserRole();
    setIsAuthenticated(!!token && role === 'Admin');
  }, []);

  if (!isAuthenticated) {
    return <AdminLoginForm />;
  }

  return <AdminDashboard />;
};
