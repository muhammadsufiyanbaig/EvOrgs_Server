# Client-Side Authentication System

## Overview

This comprehensive client-side authentication system provides complete GraphQL queries, mutations, TypeScript interfaces, React hooks, and example components for all user types in the EvOrgs platform:

- **Users** - Regular customers/clients
- **Vendors** - Service providers (Venues, Catering, Photography, FarmHouse)
- **Admins** - Platform administrators

## 📁 Project Structure

```
client-queries/
├── auth/
│   ├── index.ts              # Main exports & utilities
│   ├── user-auth.ts          # User authentication operations
│   ├── vendor-auth.ts        # Vendor authentication operations
│   └── admin-auth.ts         # Admin authentication operations
├── hooks/
│   ├── index.ts              # Hook exports
│   ├── useUserAuth.ts        # User authentication hooks
│   ├── useVendorAuth.ts      # Vendor authentication hooks
│   └── useAdminAuth.ts       # Admin authentication hooks
└── examples/
    ├── UserAuthExamples.tsx   # User auth component examples
    ├── VendorAuthExamples.tsx # Vendor auth component examples
    └── AdminAuthExamples.tsx  # Admin auth component examples
```

## 🚀 Quick Start

### Prerequisites

```bash
npm install @apollo/client graphql react react-dom
# or
yarn add @apollo/client graphql react react-dom
```

### Apollo Client Setup

```typescript
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { TokenUtils } from './client-queries/auth';

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql', // Your GraphQL endpoint
});

const authLink = setContext((_, { headers }) => {
  const token = TokenUtils.getToken();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});
```

## 📚 API Reference

### Core Authentication Files

#### `auth/index.ts`
Central export hub with utility classes:

```typescript
import { TokenUtils, RoleUtils, AuthUtils } from './client-queries/auth';

// Token Management
TokenUtils.setToken(token);
TokenUtils.getToken();
TokenUtils.removeToken();
TokenUtils.isTokenValid();

// Role Management  
RoleUtils.setUserRole('User' | 'Vendor' | 'Admin');
RoleUtils.getUserRole();
RoleUtils.clearUserRole();
RoleUtils.hasRole('Admin');

// Auth State
AuthUtils.isAuthenticated();
AuthUtils.logout();
AuthUtils.getAuthState();
```

#### `auth/user-auth.ts`
User authentication operations:

```typescript
import { 
  USER_FRAGMENT,
  REGISTER_USER,
  LOGIN_USER,
  VERIFY_OTP,
  // ... other exports
} from './client-queries/auth/user-auth';
```

#### `auth/vendor-auth.ts`
Vendor authentication operations:

```typescript
import { 
  VENDOR_FRAGMENT,
  REGISTER_VENDOR,
  LOGIN_VENDOR,
  GET_VENDOR_PROFILE,
  // ... other exports
} from './client-queries/auth/vendor-auth';
```

#### `auth/admin-auth.ts`
Admin authentication operations:

```typescript
import { 
  ADMIN_FRAGMENT,
  LOGIN_ADMIN,
  GET_ADMIN_PROFILE,
  BAN_USER,
  APPROVE_VENDOR,
  // ... other exports
} from './client-queries/auth/admin-auth';
```

### React Hooks

#### User Authentication Hooks

```typescript
import { 
  useUserAuth, 
  useUserRegistrationFlow, 
  useUserLoginFlow 
} from './client-queries/hooks';

// Complete user auth management
const { userProfile, loading, actions } = useUserAuth();

// Registration flow with OTP
const { register, verify, resend, loading, errors } = useUserRegistrationFlow();

// Login flow with password reset
const { login, forgotPassword, resetPassword, loading, errors } = useUserLoginFlow();
```

#### Vendor Authentication Hooks

```typescript
import { 
  useVendorAuth, 
  useVendorRegistrationFlow, 
  useVendorLoginFlow 
} from './client-queries/hooks';

// Complete vendor auth management
const { vendorProfile, loading, actions } = useVendorAuth();

// Vendor registration with approval system
const { register, verify, resend, loading, errors } = useVendorRegistrationFlow();

// Vendor login flow
const { login, forgotPassword, resetPassword, loading, errors } = useVendorLoginFlow();
```

#### Admin Authentication Hooks

```typescript
import { 
  useAdminAuth, 
  useAdminLoginFlow 
} from './client-queries/hooks';

// Complete admin auth with management actions
const { adminProfile, loading, actions } = useAdminAuth();

// Admin login flow
const { login, loading, errors } = useAdminLoginFlow();
```

## 💡 Usage Examples

### User Registration & Login

```typescript
import React from 'react';
import { useUserRegistrationFlow, useUserLoginFlow } from './client-queries/hooks';

const UserAuth = () => {
  const registration = useUserRegistrationFlow();
  const login = useUserLoginFlow();

  const handleRegister = async (userData) => {
    const success = await registration.register(userData);
    if (success) {
      // Show OTP verification form
    }
  };

  const handleLogin = async (credentials) => {
    const result = await login.login(credentials);
    if (result) {
      // User logged in successfully
      TokenUtils.setToken(result.token);
      RoleUtils.setUserRole('User');
    }
  };

  // Component JSX...
};
```

### Vendor Dashboard

```typescript
import React from 'react';
import { useVendorAuth } from './client-queries/hooks';

const VendorDashboard = () => {
  const { vendorProfile, loading, actions } = useVendorAuth();

  const updateProfile = async (profileData) => {
    await actions.updateProfile({ variables: { input: profileData } });
    actions.refetchProfile();
  };

  if (loading.profile) return <div>Loading...</div>;

  return (
    <div>
      <h1>Welcome, {vendorProfile?.vendorName}</h1>
      <p>Status: {vendorProfile?.vendorStatus}</p>
      {/* Profile management UI */}
    </div>
  );
};
```

### Admin User Management

```typescript
import React from 'react';
import { useAdminAuth } from './client-queries/hooks';

const AdminPanel = () => {
  const { adminProfile, loading, actions } = useAdminAuth();

  const banUser = async (userId: string) => {
    await actions.banUser({ variables: { userId } });
    console.log('User banned successfully');
  };

  const approveVendor = async (vendorId: string) => {
    await actions.approveVendor({ variables: { vendorId } });
    console.log('Vendor approved successfully');
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {/* User and vendor management UI */}
    </div>
  );
};
```

## 🔧 TypeScript Interfaces

### User Types

```typescript
interface User {
  id: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  userStatus: UserStatus;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UserRegistrationInput {
  userName: string;
  userEmail: string;
  password: string;
  userPhone?: string;
}
```

### Vendor Types

```typescript
interface Vendor {
  id: string;
  vendorName: string;
  vendorEmail: string;
  vendorPhone?: string;
  vendorType: VendorType;
  vendorStatus: VendorStatus;
  vendorAddress?: string;
  vendorProfileDescription?: string;
  vendorWebsite?: string;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

type VendorType = 'Venue' | 'FarmHouse' | 'Catering' | 'Photography';
type VendorStatus = 'Pending' | 'Approved' | 'Rejected' | 'Banned';
```

### Admin Types

```typescript
interface Admin {
  id: string;
  adminName: string;
  adminEmail: string;
  role: AdminRole;
  createdAt: string;
  updatedAt: string;
}

type AdminRole = 'SuperAdmin' | 'Admin' | 'Moderator';
```

## 🔒 Authentication Flows

### User Registration Flow
1. User submits registration form
2. System sends OTP to email
3. User verifies OTP
4. Account activated & JWT token returned

### Vendor Registration Flow
1. Vendor submits business registration
2. System sends OTP to business email
3. Vendor verifies OTP
4. Account created with "Pending" status
5. Admin approval required for activation

### Password Reset Flow
1. User/Vendor requests password reset
2. System sends OTP to email
3. User verifies OTP
4. User sets new password

### Admin Management
- Admins can ban/unban users
- Admins can approve/reject/ban vendors
- Admins can delete user accounts
- Role-based access control

## 🛠️ Error Handling

All hooks provide standardized error handling:

```typescript
const { loading, errors } = useUserLoginFlow();

if (errors.login) {
  console.error('Login failed:', errors.login.message);
}
```

Common error scenarios:
- Invalid credentials
- Email already registered  
- OTP verification failed
- Network/server errors
- Validation errors

## 🎨 Styling Notes

The example components include basic inline styles for demonstration. In production:

- Replace inline styles with CSS modules, styled-components, or your preferred styling solution
- Add proper loading states and error UI
- Implement responsive design
- Add form validation feedback

## 🔄 Integration Steps

1. **Install Dependencies**: Apollo Client, GraphQL, React
2. **Setup Apollo Client**: Configure with authentication headers
3. **Import Components**: Use the provided hooks and examples
4. **Customize UI**: Adapt the examples to your design system
5. **Add Routing**: Integrate with React Router for navigation
6. **Error Boundaries**: Add React error boundaries for better UX

## 📝 Notes

- All components use TypeScript for type safety
- GraphQL operations are optimized with fragments
- Hooks handle loading states and error management
- Token management is handled automatically
- Examples show real-world usage patterns

## 🔮 Future Enhancements

- Add refresh token rotation
- Implement social authentication
- Add biometric authentication support
- Create mobile-specific hooks
- Add offline capabilities
- Implement session management
