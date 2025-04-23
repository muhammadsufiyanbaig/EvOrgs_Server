// src/middlewares/auth.ts
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../../Config/auth/JWT';
import { db } from '../../Config/db'; // Import your Drizzle DB connection
import { users } from '../../Schema';
import { eq } from 'drizzle-orm';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      const decoded = verifyToken(token);
      
      if (decoded) {
        const user = await db.select().from(users).where(eq(users.id, decoded.userId)).limit(1);
        
        if (user && user.length > 0) {
          req.user = user[0];
        }
      }
    }
    
    next();
  } catch (error) {
    next();
  }
}