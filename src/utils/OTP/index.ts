
// Create an OTP service
// src/services/OtpService.ts
import nodemailer from 'nodemailer';
import { db } from '../../Config/db';
import { otps } from '../../Schema';
import { v4 as uuidv4 } from 'uuid';
import { eq, and, lt, gt } from 'drizzle-orm';
import dotenv from 'dotenv';

dotenv.config();

// Configure nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export class OtpService {
  // Generate a random 6-digit OTP
  private static generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Create and save OTP
  public static async createOtp(email: string, userId: string | null, userType: "Vendor" | "User" | "Admin", purpose: 'registration' | 'login' | 'password-reset'): Promise<string> {
    // Generate OTP
    const otp = this.generateOtp();
    
    // Set expiration time (10 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);
    
    // Delete any existing OTPs for this user and purpose
    if (userId) {
      await db.delete(otps)
        .where(
          and(
            eq(otps.email, email),
            eq(otps.userType, userType),
            eq(otps.purpose, purpose)
          )
        );
    } else {
      await db.delete(otps)
        .where(
          and(
            eq(otps.email, email),
            eq(otps.purpose, purpose)
          )
        );
    }
    
    // Create values object
    const values: any = {
      id: uuidv4(),
      userType,
      email,
      otp,
      purpose,
      expiresAt,
      isVerified: false,
      createdAt: new Date()
    };
    
    // Set ID based on user type
    if (userType === "User") {
      values.userId = userId;
    } else if (userType === "Vendor") {
      values.VendorId = userId;
    } else if (userType === "Admin") {
      values.adminId = userId;
    }
    
    // Create new OTP record
    await db.insert(otps).values(values);
    
    return otp;
  }
  
  public static async verifyOtp(
    email: string,
    otp: string,
    userType: "Vendor" | "User" | "Admin",
    purpose: 'registration' | 'login' | 'password-reset'
  ): Promise<boolean> {
    const now = new Date();
  
    // Find OTP record
    const otpRecord = await db.select()
      .from(otps)
      .where(
        and(
          eq(otps.email, email),
          eq(otps.userType, userType),
          eq(otps.otp, otp),
          eq(otps.purpose, purpose),
          eq(otps.isVerified, false),
          gt(otps.expiresAt, now) // ✅ Check if OTP is still valid
        )
      )
      .limit(1);
  
    if (otpRecord.length === 0) {
      return false; // OTP not found or expired
    }
  
    // Mark OTP as verified
    await db.update(otps)
      .set({ isVerified: true })
      .where(eq(otps.id, otpRecord[0].id));
  
    return true;
  }
  
  
  // Send OTP email
public static async sendOtpEmail(
  email: string,
  otp: string,
  purpose: 'registration' | 'login' | 'password-reset'
): Promise<boolean> {
  try {
    // Define subject and plain text
    let subject = '';
    let text = '';
    
    switch (purpose) {
      case 'registration':
        subject = 'Verify Your Email';
        text = `Welcome! Your verification code is: ${otp}. This code will expire in 10 minutes.`;
        break;
      case 'login':
        subject = 'Login Verification Code';
        text = `Your login verification code is: ${otp}. This code will expire in 10 minutes.`;
        break;
      case 'password-reset':
        subject = 'Password Reset Code';
        text = `Your password reset code is: ${otp}. This code will expire in 10 minutes.`;
        break;
    }
    
    // Prepare email options without logo
    const mailOptions: any = {
      from: process.env.EMAIL_FROM || '"EvOrgs" <send.sufiyan@gmail.com>',
      to: email,
      subject,
      text,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #ffffff; color: #333333; padding: 20px; border-radius: 8px; max-width: 600px; margin: auto; border: 1px solid #e0e0e0;">
            <h2 style="color: #ff6600; text-align: center;">${subject}</h2>
            <p style="font-size: 16px; line-height: 1.6;">${text}</p>
            <div style="text-align: center; margin: 30px 0;">
              <div style="display: inline-block; background-color: #ff6600; color: #ffffff; padding: 12px 20px; border-radius: 5px; font-weight: bold; letter-spacing: 1px;">
                ${otp}
              </div>
            </div>
            <p style="font-size: 14px; color: #888888;">
              If you did not request this, please ignore this email.
            </p>
            <div style="text-align: center; margin-top: 40px; font-size: 12px; color: #aaaaaa;">
              &copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.
            </div>
          </div>
      `
    };

    const send =  await transporter.sendMail(mailOptions);
    console.log('send', send);
    
    return true;
  } catch (error) {
    console.error('Failed to send OTP email:', error);
    return false;
  }
}
  // Combined method to create and send OTP
  public static async createAndSendOtp(email: string, userId: string | null, userType: "Vendor" | "User" | "Admin" , purpose: 'registration' | 'login' | 'password-reset'): Promise<boolean> {
    try {
      const otp = await this.createOtp(email, userId, userType, purpose);
      return await this.sendOtpEmail(email, otp, purpose);
    } catch (error) {
      console.error('Failed to create and send OTP:', error);
      return false;
    }
  }
}
