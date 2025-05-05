import { eq } from "drizzle-orm";
import { admin } from "../../../../Schema";
import { hashPassword, verifyPassword } from "../../../../utils/PasswordHashing";
import { v4 as uuidv4 } from 'uuid';
import { generateToken } from "../../../../Config/auth/JWT";
import { OtpService } from "../../../../utils/OTP";
import { Admin } from "../Types";

export class AdminModel {
  constructor(private db: any) {}

  async findAdminById(id: string): Promise<Admin | null> {
    const adminDetails = await this.db
      .select()
      .from(admin)
      .where(eq(admin.id, id))
      .limit(1);

    return adminDetails.length ? adminDetails[0] : null;
  }

  async findAdminByEmail(email: string): Promise<Admin | null> {
    const adminDetails = await this.db
      .select()
      .from(admin)
      .where(eq(admin.email, email))
      .limit(1);

    return adminDetails.length ? adminDetails[0] : null;
  }

  async createAdmin(userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    profileImage?: string;
  }): Promise<{ success: boolean; message: string; admin?: any }> {
    const { firstName, lastName, email, phone, password, profileImage } = userData;

    // Check if admin already exists
    const existingAdmin = await this.findAdminByEmail(email);
    if (existingAdmin) {
      return {
        success: false,
        message: "Admin with this email already exists",
      };
    }

    // Hash the password
    const passwordHash = await hashPassword(password);
    const adminId = uuidv4();

    // Insert new admin into the database
    const newAdmin = await this.db.insert(admin).values({
      id: adminId,
      firstName,
      lastName,
      email,
      phone,
      passwordHash,
      profileImage,
    }).returning();

    return {
      success: true,
      message: "Admin registered successfully",
      admin: newAdmin[0],
    };
  }

  async loginAdmin(email: string, password: string): Promise<{ success: boolean; message: string; token?: string; admin?: any }> {
    // Find the admin
    const adminData = await this.findAdminByEmail(email);
    if (!adminData) {
      return {
        success: false,
        message: "Admin not found",
      };
    }

    // Verify the password
    const isPasswordValid = await verifyPassword(password, adminData.passwordHash);
    if (!isPasswordValid) {
      return {
        success: false,
        message: "Invalid credentials",
      };
    }

    // Generate a token
    const token = generateToken({ id: adminData.id, email: adminData.email, role: "Admin" } as any);

    return {
      success: true,
      message: "Login successful",
      token,
      admin: adminData,
    };
  }

  async updateProfile(
    adminId: string,
    data: { firstName?: string; lastName?: string; phone?: string; profileImage?: string }
  ): Promise<{ success: boolean; message: string; admin?: Admin }> {
    const updatedAdmin = await this.db
      .update(admin)
      .set(data)
      .where(eq(admin.id, adminId))
      .returning();

    if (!updatedAdmin.length) {
      return {
        success: false,
        message: "Admin not found",
      };
    }

    return {
      success: true,
      message: "Profile updated successfully",
      admin: updatedAdmin[0],
    };
  }

  async changePassword(adminId: string, currentPassword: string, newPassword: string): Promise<boolean> {
    const adminData = await this.findAdminById(adminId);
    if (!adminData) {
      throw new Error("Admin not found");
    }

    // Verify current password
    const isPasswordValid = await verifyPassword(currentPassword, adminData.passwordHash);
    if (!isPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    // Hash the new password
    const passwordHash = await hashPassword(newPassword);

    // Update password
    await this.db
      .update(admin)
      .set({ passwordHash })
      .where(eq(admin.id, adminId));

    return true;
  }

  async resetPassword(email: string, newPassword: string): Promise<boolean> {
    // Hash the new password
    const passwordHash = await hashPassword(newPassword);

    // Update admin password
    const result = await this.db
      .update(admin)
      .set({ passwordHash })
      .where(eq(admin.email, email))
      .returning();

    return result.length > 0;
  }

  async deleteAccount(adminId: string): Promise<boolean> {
    const result = await this.db
      .delete(admin)
      .where(eq(admin.id, adminId))
      .returning();

    return result.length > 0;
  }

  // OTP related methods
  async requestOtp(email: string, purpose: 'registration' | 'login' | 'password-reset'): Promise<{ success: boolean; message: string; email?: string }> {
    // Generate and send OTP
    const isOtpSent = await OtpService.createAndSendOtp(email, null, "Admin", purpose);
    if (!isOtpSent) {
      return {
        success: false,
        message: "Failed to send OTP",
      };
    }

    return {
      success: true,
      message: "OTP sent successfully",
      email,
    };
  }

  async verifyOtp(email: string, otp: string, purpose: 'registration' | 'login' | 'password-reset'): Promise<{ success: boolean; message: string; email?: string }> {
    // Verify OTP
    const isOtpValid = await OtpService.verifyOtp(email, otp, "Admin", purpose);
    if (!isOtpValid) {
      return {
        success: false,
        message: "Invalid or expired OTP",
      };
    }

    return {
      success: true,
      message: "OTP verified successfully",
      email,
    };
  }
}