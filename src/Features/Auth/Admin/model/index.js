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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModel = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const Schema_1 = require("../../../../Schema");
const PasswordHashing_1 = require("../../../../utils/PasswordHashing");
const uuid_1 = require("uuid");
const JWT_1 = require("../../../../Config/auth/JWT");
const OTP_1 = require("../../../../utils/OTP");
class AdminModel {
    constructor(db) {
        this.db = db;
    }
    findAdminById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const adminDetails = yield this.db
                .select()
                .from(Schema_1.admin)
                .where((0, drizzle_orm_1.eq)(Schema_1.admin.id, id))
                .limit(1);
            return adminDetails.length ? adminDetails[0] : null;
        });
    }
    findAdminByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const adminDetails = yield this.db
                .select()
                .from(Schema_1.admin)
                .where((0, drizzle_orm_1.eq)(Schema_1.admin.email, email))
                .limit(1);
            return adminDetails.length ? adminDetails[0] : null;
        });
    }
    createAdmin(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { firstName, lastName, email, phone, password, profileImage } = userData;
            // Check if admin already exists
            const existingAdmin = yield this.findAdminByEmail(email);
            if (existingAdmin) {
                return {
                    success: false,
                    message: "Admin with this email already exists",
                };
            }
            // Hash the password
            const passwordHash = yield (0, PasswordHashing_1.hashPassword)(password);
            const adminId = (0, uuid_1.v4)();
            // Insert new admin into the database
            const newAdmin = yield this.db.insert(Schema_1.admin).values({
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
        });
    }
    loginAdmin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            // Find the admin
            const adminData = yield this.findAdminByEmail(email);
            if (!adminData) {
                return {
                    success: false,
                    message: "Admin not found",
                };
            }
            // Verify the password
            const isPasswordValid = yield (0, PasswordHashing_1.verifyPassword)(password, adminData.passwordHash);
            if (!isPasswordValid) {
                return {
                    success: false,
                    message: "Invalid credentials",
                };
            }
            // Generate a token
            const token = (0, JWT_1.generateToken)({ id: adminData.id, email: adminData.email, role: "Admin" });
            return {
                success: true,
                message: "Login successful",
                token,
                admin: adminData,
            };
        });
    }
    updateProfile(adminId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedAdmin = yield this.db
                .update(Schema_1.admin)
                .set(data)
                .where((0, drizzle_orm_1.eq)(Schema_1.admin.id, adminId))
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
        });
    }
    changePassword(adminId, currentPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const adminData = yield this.findAdminById(adminId);
            if (!adminData) {
                throw new Error("Admin not found");
            }
            // Verify current password
            const isPasswordValid = yield (0, PasswordHashing_1.verifyPassword)(currentPassword, adminData.passwordHash);
            if (!isPasswordValid) {
                throw new Error("Current password is incorrect");
            }
            // Hash the new password
            const passwordHash = yield (0, PasswordHashing_1.hashPassword)(newPassword);
            // Update password
            yield this.db
                .update(Schema_1.admin)
                .set({ passwordHash })
                .where((0, drizzle_orm_1.eq)(Schema_1.admin.id, adminId));
            return true;
        });
    }
    resetPassword(email, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            // Hash the new password
            const passwordHash = yield (0, PasswordHashing_1.hashPassword)(newPassword);
            // Update admin password
            const result = yield this.db
                .update(Schema_1.admin)
                .set({ passwordHash })
                .where((0, drizzle_orm_1.eq)(Schema_1.admin.email, email))
                .returning();
            return result.length > 0;
        });
    }
    deleteAccount(adminId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db
                .delete(Schema_1.admin)
                .where((0, drizzle_orm_1.eq)(Schema_1.admin.id, adminId))
                .returning();
            return result.length > 0;
        });
    }
    // OTP related methods
    requestOtp(email, purpose) {
        return __awaiter(this, void 0, void 0, function* () {
            // Generate and send OTP
            const isOtpSent = yield OTP_1.OtpService.createAndSendOtp(email, null, "Admin", purpose);
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
        });
    }
    verifyOtp(email, otp, purpose) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verify OTP
            const isOtpValid = yield OTP_1.OtpService.verifyOtp(email, otp, "Admin", purpose);
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
        });
    }
}
exports.AdminModel = AdminModel;
