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
exports.AdminService = void 0;
const model_1 = require("../model");
const model_2 = require("../../User/model");
const model_3 = require("../../Vendor/model");
class AdminService {
    constructor(db) {
        this.db = db;
        this.adminModel = new model_1.AdminModel(db);
        this.userModel = new model_2.UserModel(db);
        this.vendorModel = new model_3.VendorModel(db);
    }
    me(_parent_1, _args_1, _a) {
        return __awaiter(this, arguments, void 0, function* (_parent, _args, { user }) {
            if (!user || user.role !== "Admin") {
                throw new Error("Unauthorized");
            }
            const adminDetails = yield this.adminModel.findAdminById(user.id);
            if (!adminDetails) {
                throw new Error("Admin not found");
            }
            return adminDetails;
        });
    }
    adminSignup(_parent_1, _a) {
        return __awaiter(this, arguments, void 0, function* (_parent, { input }) {
            return this.adminModel.createAdmin(input);
        });
    }
    adminLogin(_parent_1, _a) {
        return __awaiter(this, arguments, void 0, function* (_parent, { input }) {
            const { email, password } = input;
            return this.adminModel.loginAdmin(email, password);
        });
    }
    requestOtp(_parent_1, _a) {
        return __awaiter(this, arguments, void 0, function* (_parent, { input }) {
            const { email, purpose = "password-reset" } = input;
            return this.adminModel.requestOtp(email, purpose);
        });
    }
    verifyOtp(_parent_1, _a) {
        return __awaiter(this, arguments, void 0, function* (_parent, { input }) {
            const { email, otp, purpose = "password-reset" } = input;
            return this.adminModel.verifyOtp(email, otp, purpose);
        });
    }
    resetPassword(_parent_1, _a) {
        return __awaiter(this, arguments, void 0, function* (_parent, { input }) {
            const { email, otp, newPassword } = input;
            // First verify the OTP
            const otpResult = yield this.adminModel.verifyOtp(email, otp, "password-reset");
            if (!otpResult.success) {
                throw new Error(otpResult.message);
            }
            // Then reset the password
            const isReset = yield this.adminModel.resetPassword(email, newPassword);
            if (!isReset) {
                throw new Error("Failed to reset password");
            }
            return {
                success: true,
                message: "Password reset successfully",
            };
        });
    }
    updateProfile(_parent_1, _a, _b) {
        return __awaiter(this, arguments, void 0, function* (_parent, { input }, { user }) {
            if (!user || user.role !== "Admin") {
                throw new Error("Unauthorized");
            }
            const { firstName, lastName, phone, profileImage } = input;
            return this.adminModel.updateProfile(user.id, { firstName, lastName, phone, profileImage });
        });
    }
    changePassword(_parent_1, _a, _b) {
        return __awaiter(this, arguments, void 0, function* (_parent, { input }, { user }) {
            if (!user || user.role !== "Admin") {
                throw new Error("Unauthorized");
            }
            const { currentPassword, newPassword } = input;
            return this.adminModel.changePassword(user.id, currentPassword, newPassword);
        });
    }
    resendOtp(_parent_1, _a) {
        return __awaiter(this, arguments, void 0, function* (_parent, { input }) {
            const { email, purpose } = input;
            const result = yield this.adminModel.requestOtp(email, purpose);
            return result.success;
        });
    }
    setNewPassword(_parent_1, _a) {
        return __awaiter(this, arguments, void 0, function* (_parent, { input }) {
            const { email, otp, newPassword } = input;
            // First verify the OTP
            const otpResult = yield this.adminModel.verifyOtp(email, otp, "password-reset");
            if (!otpResult.success) {
                throw new Error(otpResult.message);
            }
            // Then reset the password
            return this.adminModel.resetPassword(email, newPassword);
        });
    }
    deleteAccount(_parent_1, _args_1, _a) {
        return __awaiter(this, arguments, void 0, function* (_parent, _args, { user }) {
            if (!user || user.role !== "Admin") {
                throw new Error("Unauthorized");
            }
            return this.adminModel.deleteAccount(user.id);
        });
    }
    // User Management Methods for Admin
    listAllUsers(_parent_1, _a, _b) {
        return __awaiter(this, arguments, void 0, function* (_parent, { input }, { user }) {
            if (!user || user.role !== "Admin") {
                throw new Error("Unauthorized: Only admins can access user list");
            }
            const { page = 1, limit = 10, search } = input || {};
            let result;
            if (search) {
                result = yield this.userModel.searchUsers(search, page, limit);
            }
            else {
                result = yield this.userModel.getAllUsers(page, limit);
            }
            const totalPages = Math.ceil(result.total / limit);
            return {
                users: result.users,
                total: result.total,
                page,
                limit,
                totalPages
            };
        });
    }
    getUserById(_parent_1, _a, _b) {
        return __awaiter(this, arguments, void 0, function* (_parent, { userId }, { user }) {
            if (!user || user.role !== "Admin") {
                throw new Error("Unauthorized: Only admins can access user details");
            }
            const userData = yield this.userModel.findById(userId);
            if (!userData) {
                throw new Error("User not found");
            }
            return userData;
        });
    }
    deleteUser(_parent_1, _a, _b) {
        return __awaiter(this, arguments, void 0, function* (_parent, { userId }, { user }) {
            if (!user || user.role !== "Admin") {
                throw new Error("Unauthorized: Only admins can delete users");
            }
            const userData = yield this.userModel.findById(userId);
            if (!userData) {
                throw new Error("User not found");
            }
            yield this.userModel.delete(userId);
            return true;
        });
    }
    // Vendor Management Methods for Admin
    listAllVendors(_parent_1, _a, _b) {
        return __awaiter(this, arguments, void 0, function* (_parent, { input }, { user }) {
            if (!user || user.role !== "Admin") {
                throw new Error("Unauthorized: Only admins can access vendor list");
            }
            const { page = 1, limit = 10, search, status, vendorType } = input || {};
            let result;
            if (search) {
                result = yield this.vendorModel.searchVendors(search, page, limit);
            }
            else if (status) {
                result = yield this.vendorModel.getVendorsByStatus(status, page, limit);
            }
            else if (vendorType) {
                result = yield this.vendorModel.getVendorsByType(vendorType, page, limit);
            }
            else {
                result = yield this.vendorModel.getAllVendors(page, limit);
            }
            const totalPages = Math.ceil(result.total / limit);
            return {
                vendors: result.vendors,
                total: result.total,
                page,
                limit,
                totalPages
            };
        });
    }
    getVendorById(_parent_1, _a, _b) {
        return __awaiter(this, arguments, void 0, function* (_parent, { vendorId }, { user }) {
            if (!user || user.role !== "Admin") {
                throw new Error("Unauthorized: Only admins can access vendor details");
            }
            const vendorData = yield this.vendorModel.findVendorById(vendorId);
            if (!vendorData) {
                throw new Error("Vendor not found");
            }
            return vendorData;
        });
    }
    deleteVendor(_parent_1, _a, _b) {
        return __awaiter(this, arguments, void 0, function* (_parent, { vendorId }, { user }) {
            if (!user || user.role !== "Admin") {
                throw new Error("Unauthorized: Only admins can delete vendors");
            }
            const vendorData = yield this.vendorModel.findVendorById(vendorId);
            if (!vendorData) {
                throw new Error("Vendor not found");
            }
            yield this.vendorModel.deleteVendor(vendorId);
            return true;
        });
    }
    updateVendorStatus(_parent_1, _a, _b) {
        return __awaiter(this, arguments, void 0, function* (_parent, { input }, { user }) {
            if (!user || user.role !== "Admin") {
                throw new Error("Unauthorized: Only admins can update vendor status");
            }
            const vendorData = yield this.vendorModel.findVendorById(input.vendorId);
            if (!vendorData) {
                throw new Error("Vendor not found");
            }
            yield this.vendorModel.updateVendorApproval({
                vendorId: input.vendorId,
                status: input.status,
                message: input.message
            });
            return true;
        });
    }
}
exports.AdminService = AdminService;
