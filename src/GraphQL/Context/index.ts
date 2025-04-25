import { Request } from 'express';
import { Context, User, Vendor } from '../../utils/types';
import { db } from '../../Config/db';
import { verifyToken } from '../../Config/auth/JWT';
import { users } from '../../Schema';
import { vendors } from '../../Schema';
import { eq } from 'drizzle-orm';

export async function createContext({ req }: { req: Request }): Promise<Context> {
  // Get token from Authorization header
  const token = req.headers.authorization?.split(' ')[1] || '';
  
  let user: User | undefined;
  let vendor: Vendor | undefined;
  
  if (token) {
    try {
      // Verify token and get payload
      const decoded = verifyToken(token);
      
      if (decoded && typeof decoded !== 'string') {
        // Check if this is a user token
        if (decoded.type === 'user') {
          const userRecord = await db.select()
            .from(users)
            .where(eq(users.id, decoded.userId))
            .limit(1);
            
          if (userRecord.length > 0) {
            user = userRecord[0] as unknown as User;
          }
        } 
        // Check if this is a vendor token
        else if (decoded.type === 'vendor') {
          const vendorRecord = await db.select()
            .from(vendors)
            .where(eq(vendors.id, decoded.userId))
            .limit(1);
            
          if (vendorRecord.length > 0) {
            vendor = vendorRecord[0] as unknown as Vendor;
          }
        }
      }
    } catch (error) {
      // Token invalid or expired
      console.error('Invalid token:', error);
    }
  }
  
  return { user, vendor, db };
}
