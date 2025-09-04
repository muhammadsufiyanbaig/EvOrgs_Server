// Re-export all authentication hooks
export * from './useUserAuth';
export * from './useVendorAuth';
export * from './useAdminAuth';

// Note: Apollo Client hooks should be imported from '@apollo/client' 
// in your actual React application. The errors shown are due to 
// the server environment not having access to React hooks.

// Example imports for your React application:
/*
import { useMutation, useQuery } from '@apollo/client';
import { 
  useUserAuth, 
  useVendorAuth, 
  useAdminAuth,
  useUserRegistrationFlow,
  useVendorLoginFlow,
  useAdminManagement
} from './hooks';
*/
