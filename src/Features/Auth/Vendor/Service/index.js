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
exports.VendorService = void 0;
const graphql_1 = require("graphql");
const PasswordHashing_1 = require("../../../../utils/PasswordHashing");
const JWT_1 = require("../../../../Config/auth/JWT");
const model_1 = require("../model");
const OTP_1 = require("../../../../utils/OTP");
const model_2 = require("../../User/model");
class VendorService {
    vendor(_1, _a, _b) {
        return __awaiter(this, arguments, void 0, function* (_, { id }, { db, user }) {
            if (!user || (user.role !== 'Admin' && user.id !== id)) {
                throw new graphql_1.GraphQLError('Not authorized to view this vendor', {
                    extensions: { code: 'FORBIDDEN' },
                });
            }
            const vendorModel = new model_1.VendorModel(db);
            const vendor = yield vendorModel.findVendorById(id);
            if (!vendor) {
                throw new graphql_1.GraphQLError('Vendor not found', {
                    extensions: { code: 'NOT_FOUND' },
                });
            }
            return vendor;
        });
    }
    vendorProfile(_, __, context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!context.vendor) {
                throw new graphql_1.GraphQLError('Not authenticated', {
                    extensions: { code: 'UNAUTHENTICATED' },
                });
            }
            return context.vendor;
        });
    }
    pendingVendors(_1, __1, _a) {
        return __awaiter(this, arguments, void 0, function* (_, __, { db, user }) {
            if (!user || user.role !== 'Admin') {
                throw new graphql_1.GraphQLError('Not authorized', {
                    extensions: { code: 'FORBIDDEN' },
                });
            }
            const vendorModel = new model_1.VendorModel(db);
            return vendorModel.getPendingVendors();
        });
    }
    approvedVendors(_1, __1, _a) {
        return __awaiter(this, arguments, void 0, function* (_, __, { db }) {
            const vendorModel = new model_1.VendorModel(db);
            return vendorModel.getApprovedVendors();
        });
    }
    vendorRegister(_1, _a, _b) {
        return __awaiter(this, arguments, void 0, function* (_, { input }, { db }) {
            const vendorModel = new model_1.VendorModel(db);
            const vendorExists = yield vendorModel.vendorExists(input.vendorEmail);
            if (vendorExists) {
                throw new graphql_1.GraphQLError('Vendor with this email already exists', {
                    extensions: { code: 'BAD_USER_INPUT' },
                });
            }
            const passwordHash = yield (0, PasswordHashing_1.hashPassword)(input.password);
            const vendorId = yield vendorModel.createVendor(input, passwordHash);
            const otpSent = yield OTP_1.OtpService.createAndSendOtp(input.vendorEmail, vendorId, 'Vendor', 'registration');
            if (!otpSent) {
                throw new graphql_1.GraphQLError('Failed to send verification email', {
                    extensions: { code: 'INTERNAL_SERVER_ERROR' },
                });
            }
            return true;
        });
    }
    vendorVerifyRegistration(_1, _a, _b) {
        return __awaiter(this, arguments, void 0, function* (_, { input }, { db }) {
            const isValid = yield OTP_1.OtpService.verifyOtp(input.vendorEmail, input.otp, 'Vendor', input.purpose);
            if (!isValid) {
                throw new graphql_1.GraphQLError('Invalid or expired OTP', {
                    extensions: { code: 'BAD_USER_INPUT' },
                });
            }
            const vendorModel = new model_1.VendorModel(db);
            const vendor = yield vendorModel.findVendorByEmail(input.vendorEmail);
            if (!vendor) {
                throw new graphql_1.GraphQLError('Vendor not found', {
                    extensions: { code: 'NOT_FOUND' },
                });
            }
            yield vendorModel.updateVendorEmail(vendor.id);
            const token = (0, JWT_1.generateToken)({ id: vendor.id, email: vendor.vendorEmail });
            return {
                token,
                vendor,
            };
        });
    }
    vendorLogin(_1, _a, _b) {
        return __awaiter(this, arguments, void 0, function* (_, { input }, { db }) {
            const vendorModel = new model_1.VendorModel(db);
            const vendor = yield vendorModel.findVendorByEmail(input.vendorEmail);
            if (!vendor) {
                throw new graphql_1.GraphQLError('Invalid email or password', {
                    extensions: { code: 'UNAUTHENTICATED' },
                });
            }
            const validPassword = yield (0, PasswordHashing_1.verifyPassword)(input.password, vendor.passwordHash);
            if (!validPassword) {
                throw new graphql_1.GraphQLError('Invalid email or password', {
                    extensions: { code: 'UNAUTHENTICATED' },
                });
            }
            if (vendor.vendorStatus === 'Rejected') {
                throw new graphql_1.GraphQLError('Your vendor account has been rejected. Please contact support for more information.', {
                    extensions: { code: 'VENDOR_REJECTED' },
                });
            }
            const token = (0, JWT_1.generateToken)({ id: vendor.id, email: vendor.vendorEmail });
            return {
                token,
                vendor,
            };
        });
    }
    vendorRequestLoginOtp(_1, _a, _b) {
        return __awaiter(this, arguments, void 0, function* (_, { vendorEmail, userType }, { db }) {
            const vendorModel = new model_1.VendorModel(db);
            const vendor = yield vendorModel.findVendorByEmail(vendorEmail);
            if (!vendor) {
                return true;
            }
            yield OTP_1.OtpService.createAndSendOtp(vendorEmail, vendor.id, 'Vendor', 'login');
            return true;
        });
    }
    vendorVerifyLoginOtp(_1, _a, _b) {
        return __awaiter(this, arguments, void 0, function* (_, { input }, { db }) {
            const isValid = yield OTP_1.OtpService.verifyOtp(input.vendorEmail, input.otp, 'Vendor', input.purpose);
            if (!isValid) {
                throw new graphql_1.GraphQLError('Invalid or expired OTP', {
                    extensions: { code: 'BAD_USER_INPUT' },
                });
            }
            const vendorModel = new model_1.VendorModel(db);
            const vendor = yield vendorModel.findVendorByEmail(input.vendorEmail);
            if (!vendor) {
                throw new graphql_1.GraphQLError('Vendor not found', {
                    extensions: { code: 'NOT_FOUND' },
                });
            }
            if (vendor.vendorStatus === 'Rejected') {
                throw new graphql_1.GraphQLError('Your vendor account has been rejected. Please contact support for more information.', {
                    extensions: { code: 'VENDOR_REJECTED' },
                });
            }
            const token = (0, JWT_1.generateToken)({ id: vendor.id, email: vendor.vendorEmail });
            return {
                token,
                vendor,
            };
        });
    }
    vendorUpdateProfile(_1, _a, context_1) {
        return __awaiter(this, arguments, void 0, function* (_, { input }, context) {
            if (!context.vendor) {
                throw new graphql_1.GraphQLError('Not authenticated', {
                    extensions: { code: 'UNAUTHENTICATED' },
                });
            }
            const vendorModel = new model_1.VendorModel(context.db);
            const updatedVendor = yield vendorModel.updateVendorProfile(context.vendor.id, input, context.vendor.fcmToken || []);
            return updatedVendor;
        });
    }
    vendorChangePassword(_1, _a, context_1) {
        return __awaiter(this, arguments, void 0, function* (_, { input }, context) {
            if (!context.vendor) {
                throw new graphql_1.GraphQLError('Not authenticated', {
                    extensions: { code: 'UNAUTHENTICATED' },
                });
            }
            const validPassword = yield (0, PasswordHashing_1.verifyPassword)(input.currentPassword, context.vendor.passwordHash);
            if (!validPassword) {
                throw new graphql_1.GraphQLError('Current password is incorrect', {
                    extensions: { code: 'BAD_USER_INPUT' },
                });
            }
            const passwordHash = yield (0, PasswordHashing_1.hashPassword)(input.newPassword);
            const vendorModel = new model_1.VendorModel(context.db);
            yield vendorModel.updatePassword(context.vendor.id, passwordHash);
            return true;
        });
    }
    vendorResetPassword(_1, _a, _b) {
        return __awaiter(this, arguments, void 0, function* (_, { input }, { db }) {
            const vendorModel = new model_1.VendorModel(db);
            const vendor = yield vendorModel.findVendorByEmail(input.vendorEmail);
            if (!vendor) {
                return true;
            }
            yield OTP_1.OtpService.createAndSendOtp(input.vendorEmail, vendor.id, input.userType, 'password-reset');
            return true;
        });
    }
    vendorSetNewPassword(_1, _a, _b) {
        return __awaiter(this, arguments, void 0, function* (_, { input }, { db }) {
            const isValid = yield OTP_1.OtpService.verifyOtp(input.vendorEmail, input.otp, input.userType, 'password-reset');
            if (!isValid) {
                throw new graphql_1.GraphQLError('Invalid or expired OTP', {
                    extensions: { code: 'BAD_USER_INPUT' },
                });
            }
            const vendorModel = new model_1.VendorModel(db);
            const vendor = yield vendorModel.findVendorByEmail(input.vendorEmail);
            if (!vendor) {
                throw new graphql_1.GraphQLError('Vendor not found', {
                    extensions: { code: 'NOT_FOUND' },
                });
            }
            const passwordHash = yield (0, PasswordHashing_1.hashPassword)(input.newPassword);
            yield vendorModel.updatePasswordByEmail(input.vendorEmail, passwordHash);
            return true;
        });
    }
    vendorResendOtp(_1, _a, _b) {
        return __awaiter(this, arguments, void 0, function* (_, { input }, { db }) {
            const vendorModel = new model_1.VendorModel(db);
            const vendor = yield vendorModel.findVendorByEmail(input.vendorEmail);
            if (!vendor) {
                return true;
            }
            yield OTP_1.OtpService.createAndSendOtp(input.vendorEmail, vendor.id, input.userType, input.purpose);
            return true;
        });
    }
    vendorDeleteAccount(_, __, context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!context.vendor) {
                throw new graphql_1.GraphQLError('Not authenticated', {
                    extensions: { code: 'UNAUTHENTICATED' },
                });
            }
            const vendorModel = new model_1.VendorModel(context.db);
            yield vendorModel.deleteVendor(context.vendor.id);
            return true;
        });
    }
    vendorApproval(_1, _a, _b) {
        return __awaiter(this, arguments, void 0, function* (_, { input }, { db, user }) {
            if (!user || user.role !== 'Admin') {
                throw new graphql_1.GraphQLError('Not authorized to approve vendors', {
                    extensions: { code: 'FORBIDDEN' },
                });
            }
            const vendorModel = new model_1.VendorModel(db);
            const vendor = yield vendorModel.findVendorById(input.vendorId);
            if (!vendor) {
                throw new graphql_1.GraphQLError('Vendor not found', {
                    extensions: { code: 'NOT_FOUND' },
                });
            }
            const updatedVendor = yield vendorModel.updateVendorApproval(input);
            return updatedVendor;
        });
    }
    // Vendor Management Methods - Allow vendors to manage other vendors and users
    vendorListAllVendors(_1, _a, context_1) {
        return __awaiter(this, arguments, void 0, function* (_, { input }, context) {
            if (!context.vendor) {
                throw new graphql_1.GraphQLError('Not authenticated: Vendor authentication required', {
                    extensions: { code: 'UNAUTHENTICATED' },
                });
            }
            // Only approved vendors can access this feature
            if (context.vendor.vendorStatus !== 'Approved') {
                throw new graphql_1.GraphQLError('Unauthorized: Only approved vendors can access vendor management', {
                    extensions: { code: 'FORBIDDEN' },
                });
            }
            const { page = 1, limit = 10, search, status, vendorType } = input || {};
            const vendorModel = new model_1.VendorModel(context.db);
            let result;
            if (search) {
                result = yield vendorModel.searchVendors(search, page, limit);
            }
            else if (status) {
                result = yield vendorModel.getVendorsByStatus(status, page, limit);
            }
            else if (vendorType) {
                result = yield vendorModel.getVendorsByType(vendorType, page, limit);
            }
            else {
                result = yield vendorModel.getAllVendors(page, limit);
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
    vendorListAllUsers(_1, _a, context_1) {
        return __awaiter(this, arguments, void 0, function* (_, { input }, context) {
            if (!context.vendor) {
                throw new graphql_1.GraphQLError('Not authenticated: Vendor authentication required', {
                    extensions: { code: 'UNAUTHENTICATED' },
                });
            }
            // Only approved vendors can access this feature
            if (context.vendor.vendorStatus !== 'Approved') {
                throw new graphql_1.GraphQLError('Unauthorized: Only approved vendors can access user management', {
                    extensions: { code: 'FORBIDDEN' },
                });
            }
            const { page = 1, limit = 10, search } = input || {};
            const userModel = new model_2.UserModel(context.db);
            let result;
            if (search) {
                result = yield userModel.searchUsers(search, page, limit);
            }
            else {
                result = yield userModel.getAllUsers(page, limit);
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
    vendorUpdateVendorStatus(_1, _a, context_1) {
        return __awaiter(this, arguments, void 0, function* (_, { input }, context) {
            if (!context.vendor) {
                throw new graphql_1.GraphQLError('Not authenticated: Vendor authentication required', {
                    extensions: { code: 'UNAUTHENTICATED' },
                });
            }
            // Only approved vendors can approve other vendors
            if (context.vendor.vendorStatus !== 'Approved') {
                throw new graphql_1.GraphQLError('Unauthorized: Only approved vendors can manage vendor status', {
                    extensions: { code: 'FORBIDDEN' },
                });
            }
            // Vendors cannot change their own status
            if (context.vendor.id === input.vendorId) {
                throw new graphql_1.GraphQLError('Forbidden: Cannot change your own vendor status', {
                    extensions: { code: 'FORBIDDEN' },
                });
            }
            const vendorModel = new model_1.VendorModel(context.db);
            const targetVendor = yield vendorModel.findVendorById(input.vendorId);
            if (!targetVendor) {
                throw new graphql_1.GraphQLError('Vendor not found', {
                    extensions: { code: 'NOT_FOUND' },
                });
            }
            yield vendorModel.updateVendorApproval({
                vendorId: input.vendorId,
                status: input.status,
                message: input.message
            });
            return true;
        });
    }
    vendorVerifyUser(_1, _a, context_1) {
        return __awaiter(this, arguments, void 0, function* (_, { userId }, context) {
            if (!context.vendor) {
                throw new graphql_1.GraphQLError('Not authenticated: Vendor authentication required', {
                    extensions: { code: 'UNAUTHENTICATED' },
                });
            }
            // Only approved vendors can verify users
            if (context.vendor.vendorStatus !== 'Approved') {
                throw new graphql_1.GraphQLError('Unauthorized: Only approved vendors can verify users', {
                    extensions: { code: 'FORBIDDEN' },
                });
            }
            const userModel = new model_2.UserModel(context.db);
            const user = yield userModel.findById(userId);
            if (!user) {
                throw new graphql_1.GraphQLError('User not found', {
                    extensions: { code: 'NOT_FOUND' },
                });
            }
            // Check if user is already verified
            if (user.isVerified) {
                throw new graphql_1.GraphQLError('User is already verified', {
                    extensions: { code: 'BAD_USER_INPUT' },
                });
            }
            yield userModel.setVerified(userId);
            return true;
        });
    }
    vendorGetVendorById(_1, _a, context_1) {
        return __awaiter(this, arguments, void 0, function* (_, { vendorId }, context) {
            if (!context.vendor) {
                throw new graphql_1.GraphQLError('Not authenticated: Vendor authentication required', {
                    extensions: { code: 'UNAUTHENTICATED' },
                });
            }
            // Only approved vendors can access vendor details
            if (context.vendor.vendorStatus !== 'Approved') {
                throw new graphql_1.GraphQLError('Unauthorized: Only approved vendors can access vendor details', {
                    extensions: { code: 'FORBIDDEN' },
                });
            }
            const vendorModel = new model_1.VendorModel(context.db);
            const vendor = yield vendorModel.findVendorById(vendorId);
            if (!vendor) {
                throw new graphql_1.GraphQLError('Vendor not found', {
                    extensions: { code: 'NOT_FOUND' },
                });
            }
            return vendor;
        });
    }
    vendorGetUserById(_1, _a, context_1) {
        return __awaiter(this, arguments, void 0, function* (_, { userId }, context) {
            if (!context.vendor) {
                throw new graphql_1.GraphQLError('Not authenticated: Vendor authentication required', {
                    extensions: { code: 'UNAUTHENTICATED' },
                });
            }
            // Only approved vendors can access user details
            if (context.vendor.vendorStatus !== 'Approved') {
                throw new graphql_1.GraphQLError('Unauthorized: Only approved vendors can access user details', {
                    extensions: { code: 'FORBIDDEN' },
                });
            }
            const userModel = new model_2.UserModel(context.db);
            const user = yield userModel.findById(userId);
            if (!user) {
                throw new graphql_1.GraphQLError('User not found', {
                    extensions: { code: 'NOT_FOUND' },
                });
            }
            return user;
        });
    }
}
exports.VendorService = VendorService;
