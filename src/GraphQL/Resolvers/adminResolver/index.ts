import { OtpService } from "../../../utils/OTP";
import { hashPassword, verifyPassword } from "../../../utils/PasswordHashing";
import { generateToken } from "../../../Config/auth/JWT";
import { Context, Admin, User } from "../../../utils/types";
import { admin } from "../../../Schema"; // Importing the admin table schema
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from 'uuid';

export const adminResolver = {
  Query: {
    me: async (_: any, __: any, { user, db }: Context) => {
      if (!user || user.role !== "Admin") {
        throw new Error("Unauthorized");
      }

      // Fetch admin details from the database
      const adminDetails = await db
        .select()
        .from(admin)
        .where(eq(admin.id, user.id))
        .limit(1);

      if (!adminDetails.length) {
        throw new Error("Admin not found");
      }

      return adminDetails[0];
    },
  },
  Mutation: {
    adminSignup: async (_: any, { input }: any, { db }: Context) => {
      const { firstName, lastName, email, phone, password, profileImage } = input;

      // Check if admin already exists
      const existingAdmin = await db
        .select()
        .from(admin)
        .where(eq(admin.email, email))
        .limit(1);

      if (existingAdmin.length) {
        throw new Error("Admin with this email already exists");
      }

      // Hash the password
      const passwordHash = await hashPassword(password);
      const adminId = uuidv4();
      // Insert new admin into the database
      const newAdmin = await db.insert(admin).values({
        id: adminId,
        firstName,
        lastName,
        email,
        phone,
        passwordHash,
        profileImage,
      });

      return {
        success: true,
        message: "Admin registered successfully",
        admin: newAdmin,
      };
    },

    adminLogin: async (_: any, { input }: any, { db }: Context) => {
      const { email, password } = input;

      // Find the admin
      const adminDetails = await db
        .select()
        .from(admin)
        .where(eq(admin.email, email))
        .limit(1);

      if (!adminDetails.length) {
        throw new Error("Admin not found");
      }

      const adminData = adminDetails[0];

      // Verify the password
      const isPasswordValid = await verifyPassword(password, adminData.passwordHash);
      if (!isPasswordValid) {
        throw new Error("Invalid credentials");
      }

      // Generate a token
      const token = generateToken({ id: adminData.id, email: adminData.email } as User);

      return {
        success: true,
        message: "Login successful",
        token,
        admin: adminData,
      };
    },

    requestOtp: async (_: any, { input }: any) => {
      const { email } = input;

      // Generate and send OTP
      const isOtpSent = await OtpService.createAndSendOtp(email, null, "Admin", "password-reset");
      if (!isOtpSent) {
        throw new Error("Failed to send OTP");
      }

      return {
        success: true,
        message: "OTP sent successfully",
        email,
      };
    },

    verifyOtp: async (_: any, { input }: any) => {
      const { email, otp } = input;

      // Verify OTP
      const isOtpValid = await OtpService.verifyOtp(email, otp, "Admin", "password-reset");
      if (!isOtpValid) {
        throw new Error("Invalid or expired OTP");
      }

      return {
        success: true,
        message: "OTP verified successfully",
        email,
      };
    },

    resetPassword: async (_: any, { input }: any, { db }: Context) => {
      const { email, otp, newPassword } = input;

      // Verify OTP
      const isOtpValid = await OtpService.verifyOtp(email, otp, "Admin", "password-reset");
      if (!isOtpValid) {
        throw new Error("Invalid OTP");
      }

      // Hash the new password
      const passwordHash = await hashPassword(newPassword);

      // Update admin password
      await db
        .update(admin)
        .set({ passwordHash })
        .where(eq(admin.email, email));

      return {
        success: true,
        message: "Password reset successfully",
      };
    },

    updateProfile: async (_: any, { firstName, lastName, phone, profileImage }: any, { user, db }: Context) => {
      if (!user || user.role !== "Admin") {
        throw new Error("Unauthorized");
      }

      // Update admin profile
      const updatedAdmin = await db
        .update(admin)
        .set({ firstName, lastName, phone, profileImage })
        .where(eq(admin.id, user.id))
        .returning();

      return {
        success: true,
        message: "Profile updated successfully",
        admin: updatedAdmin[0],
      };
    },

    changePassword: async (_: any, { input }: any, { user, db }: Context) => {
      if (!user || user.role !== "Admin") {
        throw new Error("Unauthorized");
      }

      const { currentPassword, newPassword } = input;

      // Fetch admin details
      const adminDetails = await db
        .select()
        .from(admin)
        .where(eq(admin.id, user.id))
        .limit(1);

      if (!adminDetails.length) {
        throw new Error("Admin not found");
      }

      const adminData = adminDetails[0];

      // Verify current password
      const isPasswordValid = await verifyPassword(currentPassword, adminData.passwordHash);
      if (!isPasswordValid) {
        throw new Error("Current password is incorrect");
      }

      // Hash the new password
      const passwordHash = await hashPassword(newPassword);

      // Update password
      await db
        .update(admin)
        .set({ passwordHash })
        .where(eq(admin.id, user.id));

      return true;
    },

    resendOtp: async (_: any, { input }: any) => {
      const { email, purpose } = input;

      // Generate and send OTP
      const isOtpSent = await OtpService.createAndSendOtp(email, null, "Admin", purpose);
      if (!isOtpSent) {
        throw new Error("Failed to resend OTP");
      }

      return true;
    },

    setNewPassword: async (_: any, { input }: any, { db }: Context) => {
      const { email, otp, newPassword } = input;

      // Verify OTP
      const isOtpValid = await OtpService.verifyOtp(email, otp, "Admin", "password-reset");
      if (!isOtpValid) {
        throw new Error("Invalid OTP");
      }

      // Hash the new password
      const passwordHash = await hashPassword(newPassword);

      // Update admin password
      await db
        .update(admin)
        .set({ passwordHash })
        .where(eq(admin.email, email));

      return true;
    },

    deleteAccount: async (_: any, __: any, { user, db }: Context) => {
      if (!user || user.role !== "Admin") {
        throw new Error("Unauthorized");
      }

      // Delete admin account
      await db
        .delete(admin)
        .where(eq(admin.id, user.id));

      return true;
    },
  },
};