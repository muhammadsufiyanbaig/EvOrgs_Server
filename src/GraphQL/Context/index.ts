import { Request } from 'express';
import { db } from '../../Config/db';
import { verifyToken } from '../../Config/auth/JWT';
import { users } from '../../Schema';
import { vendors } from '../../Schema';
import { admin } from '../../Schema'; // Import admins schema
import { eq } from 'drizzle-orm';
// src/utils/types.ts
import { DrizzleDB } from '../../Config/db';
import { User } from '../../Features/Auth/User/Types';
import { Vendor } from '../../Features/Auth/Vendor/Types';
import { Admin } from '../../Features/Auth/Admin/Types';

export interface Context {
  db: DrizzleDB;
  user?: User;
  vendor?: Vendor;
  Admin?: Admin;
}
export async function createContext({ req }: { req: Request }): Promise<Context> {
  // Get token from Authorization header
  const token = req.headers.authorization?.split(' ')[1] || '';
  
  let user: User | undefined;
  let vendor: Vendor | undefined;
  let Admin: Admin | undefined;// Add admin to the context
  
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
            .from(admin)
            .where(eq(admin.id, decoded.userId))
            .limit(1);
            
          if (adminRecord.length > 0) {
            Admin = adminRecord[0] as unknown as Admin;
          }
        }
      }
    } catch (error) {
      // Token invalid or expired
      console.error('Invalid token:', error);
    }
  }
  
  return { user, vendor, Admin, db }; // Include admin in the returned context
}