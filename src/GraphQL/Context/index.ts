import { Request } from 'express';
import { Context, User } from '../../utils/types';
import { db } from '../../Config/db';
import { verifyToken } from '../../Config/auth/JWT';

export async function createContext({ req }: { req: Request }): Promise<Context> {
  // Get token from Authorization header
  const token = req.headers.authorization?.split(' ')[1] || '';
  
  let user: User | undefined;
  
  if (token) {
    try {
      // Verify token and get user
      const decoded = verifyToken(token);
      if (decoded && typeof decoded !== 'string') {
        user = decoded as unknown as User;
      }
    } catch (error) {
      // Token invalid or expired
      console.error('Invalid token:', error);
    }
  }
  
  return { user, db };
}