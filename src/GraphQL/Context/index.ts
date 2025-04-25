import { Request } from 'express';
import { Context, User, Vendor, Admin } from '../../utils/types'; // Import Admin type
import { db } from '../../Config/db';
import { verifyToken } from '../../Config/auth/JWT';
import { users } from '../../Schema';
import { vendors } from '../../Schema';
import { admin } from '../../Schema'; // Import admins schema
import { eq } from 'drizzle-orm';

export async function createContext({ req }: { req: Request }): Promise<Context> {
  // Get token from Authorization header
  const token = req.headers.authorization?.split(' ')[1] || '';
  
  let user: User | undefined;
  let vendor: Vendor | undefined;
  let admin: Admin | undefined; // Add admin to the context
  
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
        // Check if this is an admin token
        else if (decoded.type === 'admin') {
          const adminRecord = await db.select()
            .from(admins)
            .where(eq(admins.id, decoded.userId))
            .limit(1);
            
          if (adminRecord.length > 0) {
            admin = adminRecord[0] as unknown as Admin;
          }
        }
      }
    } catch (error) {
      // Token invalid or expired
      console.error('Invalid token:', error);
    }
  }
  
  return { user, vendor, admin, db }; // Include admin in the returned context
}