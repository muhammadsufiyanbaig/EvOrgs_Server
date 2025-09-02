"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpService = void 0;
// Create an OTP service
// src/services/OtpService.ts
const nodemailer_1 = __importDefault(require("nodemailer"));
const db_1 = require("../../Config/db");
const Schema_1 = require("../../Schema");
const uuid_1 = require("uuid");
const drizzle_orm_1 = require("drizzle-orm");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Configure nodemailer
const transporter = nodemailer_1.default.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
class OtpService {
    // Generate a random 6-digit OTP
    static generateOtp() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    // Create and save OTP
    static createOtp(email, userId, userType, purpose) {
        return __awaiter(this, void 0, void 0, function* () {
            // Generate OTP
            const otp = this.generateOtp();
            // Set expiration time (10 minutes from now)
            const expiresAt = new Date();
            expiresAt.setMinutes(expiresAt.getMinutes() + 10);
            // Delete any existing OTPs for this user and purpose
            if (userId) {
                yield db_1.db.delete(Schema_1.otps)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.otps.email, email), (0, drizzle_orm_1.eq)(Schema_1.otps.userType, userType), (0, drizzle_orm_1.eq)(Schema_1.otps.purpose, purpose)));
            }
            else {
                yield db_1.db.delete(Schema_1.otps)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.otps.email, email), (0, drizzle_orm_1.eq)(Schema_1.otps.purpose, purpose)));
            }
            // Create values object
            const values = {
                id: (0, uuid_1.v4)(),
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
            }
            else if (userType === "Vendor") {
                values.VendorId = userId;
            }
            else if (userType === "Admin") {
                values.adminId = userId;
            }
            // Create new OTP record
            yield db_1.db.insert(Schema_1.otps).values(values);
            return otp;
        });
    }
    static verifyOtp(email, otp, userType, purpose) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            // Find OTP record
            const otpRecord = yield db_1.db.select()
                .from(Schema_1.otps)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.otps.email, email), (0, drizzle_orm_1.eq)(Schema_1.otps.userType, userType), (0, drizzle_orm_1.eq)(Schema_1.otps.otp, otp), (0, drizzle_orm_1.eq)(Schema_1.otps.purpose, purpose), (0, drizzle_orm_1.eq)(Schema_1.otps.isVerified, false), (0, drizzle_orm_1.gt)(Schema_1.otps.expiresAt, now) // ✅ Check if OTP is still valid
            ))
                .limit(1);
            if (otpRecord.length === 0) {
                return false; // OTP not found or expired
            }
            // Mark OTP as verified
            yield db_1.db.update(Schema_1.otps)
                .set({ isVerified: true })
                .where((0, drizzle_orm_1.eq)(Schema_1.otps.id, otpRecord[0].id));
            return true;
        });
    }
    // Send OTP email
    static sendOtpEmail(email, otp, purpose) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const mailOptions = {
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
                const send = yield transporter.sendMail(mailOptions);
                console.log('send', send);
                return true;
            }
            catch (error) {
                console.error('Failed to send OTP email:', error);
                return false;
            }
        });
    }
    // Combined method to create and send OTP
    static createAndSendOtp(email, userId, userType, purpose) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const otp = yield this.createOtp(email, userId, userType, purpose);
                return yield this.sendOtpEmail(email, otp, purpose);
            }
            catch (error) {
                console.error('Failed to create and send OTP:', error);
                return false;
            }
        });
    }
}
exports.OtpService = OtpService;
