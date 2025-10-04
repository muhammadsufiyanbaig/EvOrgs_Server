// src/auth/jwt.ts
import jwt from 'jsonwebtoken';
import { Admin } from '../../../Features/Auth/Admin/Types';
import { User } from '../../../Features/Auth/User/Types';
import { Vendor } from '../../../Features/Auth/Vendor/Types';

const JWT_SECRET = process.env.JWT_SECRET || '$Uf!y@n3';
const JWT_EXPIRES_IN = '7d';

export function generateToken(user: User | Admin | Vendor): string {
  // Determine the type based on which properties exist
  let type: 'user' | 'vendor' | 'admin' = 'user';
  
  if ('vendorEmail' in user) {
    type = 'vendor';
  } else if ('role' in user && (user as unknown as Admin).role === 'super_admin') {
    type = 'admin';
  } else if ('email' in user && !('vendorEmail' in user)) {
    type = 'user';
  }
  
  const payload = {
    userId: user.id,
    email: 'vendorEmail' in user ? (user as Vendor).vendorEmail : user.email,
    type, // Include the type in the payload
  };
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): {
    type: string; userId: string; email: string 
} | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; type?: string };
    // Return the type from the token payload, default to 'user' if not present
    return { type: decoded.type || 'user', ...decoded };
  } catch (error) {
    return null;
  }
}