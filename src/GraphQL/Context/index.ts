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
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1] || '';
  
  console.log('🔐 CONTEXT CREATION DEBUG:');
  console.log('  - Auth Header:', authHeader ? `${authHeader.substring(0, 20)}...` : 'NOT PROVIDED');
  console.log('  - Token extracted:', token ? `${token.substring(0, 20)}...` : 'NOT FOUND');
  
  let user: User | undefined;
  let vendor: Vendor | undefined;
  let Admin: Admin | undefined;// Add admin to the context
  
  if (token) {
    try {
      // Verify token and get payload
      const decoded = verifyToken(token);
      
      console.log('  - Token decoded:', decoded);
      console.log('  - Decoded type:', decoded?.type);
      console.log('  - Decoded userId:', decoded?.userId);
      
      if (decoded && typeof decoded !== 'string') {
        // Check if this is a user token
        if (decoded.type === 'user') {
          console.log('  - 👤 Looking up USER with ID:', decoded.userId);
          const userRecord = await db.select()
            .from(users)
            .where(eq(users.id, decoded.userId))
            .limit(1);
            
          if (userRecord.length > 0) {
            user = userRecord[0] as unknown as User;
            console.log('  - ✅ User found:', user.id);
          } else {
            console.log('  - ❌ User NOT found in database');
          }
        } 
        // Check if this is a vendor token
        else if (decoded.type === 'vendor') {
          console.log('  - 🏪 Looking up VENDOR with ID:', decoded.userId);
          const vendorRecord = await db.select()
            .from(vendors)
            .where(eq(vendors.id, decoded.userId))
            .limit(1);
            
          if (vendorRecord.length > 0) {
            vendor = vendorRecord[0] as unknown as Vendor;
            console.log('  - ✅ Vendor found:', vendor.id, vendor.vendorEmail);
          } else {
            console.log('  - ❌ Vendor NOT found in database for ID:', decoded.userId);
          }
        }
        // Check if this is an admin token
        else if (decoded.type === 'admin') {
          console.log('  - 👔 Looking up ADMIN with ID:', decoded.userId);
          const adminRecord = await db.select()
            .from(admin)
            .where(eq(admin.id, decoded.userId))
            .limit(1);
            
          if (adminRecord.length > 0) {
            Admin = adminRecord[0] as unknown as Admin;
            console.log('  - ✅ Admin found:', Admin.id);
          } else {
            console.log('  - ❌ Admin NOT found in database');
          }
        } else {
          console.log('  - ⚠️ UNKNOWN token type:', decoded.type);
        }
      } else {
        console.log('  - ❌ Token decode failed or returned string');
      }
    } catch (error) {
      // Token invalid or expired
      console.error('  - ❌ Token verification ERROR:', error);
    }
  } else {
    console.log('  - ⚠️ No token provided');
  }
  
  console.log('  - Final Context: vendor=', !!vendor, 'user=', !!user, 'admin=', !!Admin);
  
  return { user, vendor, Admin, db }; // Include admin in the returned context
}