// src/auth/jwt.ts
import jwt from 'jsonwebtoken';
import { Admin } from '../../../Features/Auth/Admin/Types';
import { User } from '../../../Features/Auth/User/Types';
import { Vendor } from '../../../Features/Auth/Vendor/Types';

const JWT_SECRET = process.env.JWT_SECRET || '$Uf!y@n3';
const JWT_EXPIRES_IN = '7d';

export function generateToken(user: User | Admin | Vendor): string {
  const payload = {
    userId: user.id,
    email: 'vendorEmail' in user ? (user as Vendor).vendorEmail : user.email,
  };
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): {
    type: string; userId: string; email: string 
} | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    return { type: 'user', ...decoded };
  } catch (error) {
    return null;
  }
}