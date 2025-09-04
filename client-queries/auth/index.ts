// Re-export all authentication queries and mutations
export * from './user-auth';
export * from './vendor-auth';
export * from './admin-auth';

// Common types used across all auth systems
export type UserType = 'User' | 'Vendor' | 'Admin';
export type OtpPurpose = 'registration' | 'login' | 'password_reset';
export type Gender = 'Male' | 'Female' | 'Others';
export type VendorType = 'FarmHouse' | 'Venue' | 'Catering' | 'Photography';
export type VendorStatus = 'Pending' | 'Approved' | 'Rejected';

// Common error interface
export interface AuthError {
  message: string;
  code?: string;
  field?: string;
}

// Common response interface
export interface BaseResponse {
  success: boolean;
  message?: string;
}

// Token management utilities
export const TokenUtils = {
  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  },
  
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  },
  
  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  },
  
  isTokenExpired: (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
};

// User role management
export const RoleUtils = {
  setUserRole: (role: UserType) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userRole', role);
    }
  },
  
  getUserRole: (): UserType | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userRole') as UserType;
    }
    return null;
  },
  
  removeUserRole: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userRole');
    }
  }
};

// Auth state management
export const AuthUtils = {
  isAuthenticated: (): boolean => {
    const token = TokenUtils.getToken();
    return token !== null && !TokenUtils.isTokenExpired(token);
  },
  
  logout: () => {
    TokenUtils.removeToken();
    RoleUtils.removeUserRole();
    // Clear Apollo Client cache if needed
    if (typeof window !== 'undefined') {
      localStorage.removeItem('apollo-cache-persist');
    }
  },
  
  getCurrentUserType: (): UserType | null => {
    return RoleUtils.getUserRole();
  }
};
