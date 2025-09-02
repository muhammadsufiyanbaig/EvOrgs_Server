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
exports.UserAuthService = void 0;
const graphql_1 = require("graphql");
const JWT_1 = require("../../../../Config/auth/JWT");
const OTP_1 = require("../../../../utils/OTP");
const model_1 = require("../model");
const PasswordHashing_1 = require("../../../../utils/PasswordHashing");
class UserAuthService {
    me(_, __, context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!context.user) {
                throw new graphql_1.GraphQLError('Not authenticated', {
                    extensions: { code: 'UNAUTHENTICATED' },
                });
            }
            return context.user;
        });
    }
    register(_1, _a, _b) {
        return __awaiter(this, arguments, void 0, function* (_, { input }, { db }) {
            const userModel = new model_1.UserModel(db);
            // Check if user already exists
            const userExists = yield userModel.emailExists(input.email);
            if (userExists) {
                throw new graphql_1.GraphQLError('User with this email already exists', {
                    extensions: { code: 'BAD_USER_INPUT' },
                });
            }
            // Hash the password
            const passwordHash = yield (0, PasswordHashing_1.hashPassword)(input.password);
            // Create the user
            const userId = yield userModel.create(input, passwordHash);
            // Create and send OTP
            const otpSent = yield OTP_1.OtpService.createAndSendOtp(input.email, userId, 'User', 'registration');
            if (!otpSent) {
                throw new graphql_1.GraphQLError('Failed to send verification email', {
                    extensions: { code: 'INTERNAL_SERVER_ERROR' },
                });
            }
            return true;
        });
    }
    verifyRegistration(_1, _a, _b) {
        return __awaiter(this, arguments, void 0, function* (_, { input }, { db }) {
            const userModel = new model_1.UserModel(db);
            const isValid = yield OTP_1.OtpService.verifyOtp(input.email, input.otp, 'User', input.purpose);
            if (!isValid) {
                throw new graphql_1.GraphQLError('Invalid or expired OTP', {
                    extensions: { code: 'BAD_USER_INPUT' },
                });
            }
            const user = yield userModel.findByEmail(input.email);
            if (!user) {
                throw new graphql_1.GraphQLError('User not found', {
                    extensions: { code: 'NOT_FOUND' },
                });
            }
            yield userModel.setVerified(user.id);
            const token = (0, JWT_1.generateToken)(Object.assign(Object.assign({}, user), { isVerified: true }));
            return {
                token,
                user: Object.assign(Object.assign({}, user), { isVerified: true }),
            };
        });
    }
    login(_1, _a, _b) {
        return __awaiter(this, arguments, void 0, function* (_, { input }, { db }) {
            const userModel = new model_1.UserModel(db);
            const user = yield userModel.findByEmail(input.email);
            if (!user) {
                throw new graphql_1.GraphQLError('Invalid email or password', {
                    extensions: { code: 'UNAUTHENTICATED' },
                });
            }
            const validPassword = yield (0, PasswordHashing_1.verifyPassword)(input.password, user.passwordHash);
            if (!validPassword) {
                throw new graphql_1.GraphQLError('Invalid email or password', {
                    extensions: { code: 'UNAUTHENTICATED' },
                });
            }
            if (!user.isVerified) {
                yield OTP_1.OtpService.createAndSendOtp(user.email, user.id, 'User', 'registration');
                throw new graphql_1.GraphQLError('Account not verified. A new verification code has been sent to your email.', {
                    extensions: { code: 'UNVERIFIED_USER' },
                });
            }
            const token = (0, JWT_1.generateToken)(user);
            return {
                token,
                user,
            };
        });
    }
    requestLoginOtp(_1, _a, _b) {
        return __awaiter(this, arguments, void 0, function* (_, { email }, { db }) {
            const userModel = new model_1.UserModel(db);
            const user = yield userModel.findByEmail(email);
            if (!user) {
                return true;
            }
            yield OTP_1.OtpService.createAndSendOtp(email, user.id, 'User', 'registration');
            return true;
        });
    }
    verifyLoginOtp(_1, _a, _b) {
        return __awaiter(this, arguments, void 0, function* (_, { input }, { db }) {
            const userModel = new model_1.UserModel(db);
            const isValid = yield OTP_1.OtpService.verifyOtp(input.email, input.otp, 'User', input.purpose);
            if (!isValid) {
                throw new graphql_1.GraphQLError('Invalid or expired OTP', {
                    extensions: { code: 'BAD_USER_INPUT' },
                });
            }
            const user = yield userModel.findByEmail(input.email);
            if (!user) {
                throw new graphql_1.GraphQLError('User not found', {
                    extensions: { code: 'NOT_FOUND' },
                });
            }
            const token = (0, JWT_1.generateToken)(user);
            return {
                token,
                user,
            };
        });
    }
    updateProfile(_1, _a, context_1) {
        return __awaiter(this, arguments, void 0, function* (_, { input }, context) {
            if (!context.user) {
                throw new graphql_1.GraphQLError('Not authenticated', {
                    extensions: { code: 'UNAUTHENTICATED' },
                });
            }
            const userModel = new model_1.UserModel(context.db);
            const updatedUser = yield userModel.updateProfile(context.user.id, input);
            return updatedUser;
        });
    }
    changePassword(_1, _a, context_1) {
        return __awaiter(this, arguments, void 0, function* (_, { input }, context) {
            if (!context.user) {
                throw new graphql_1.GraphQLError('Not authenticated', {
                    extensions: { code: 'UNAUTHENTICATED' },
                });
            }
            const validPassword = yield (0, PasswordHashing_1.verifyPassword)(input.currentPassword, context.user.passwordHash);
            if (!validPassword) {
                throw new graphql_1.GraphQLError('Current password is incorrect', {
                    extensions: { code: 'BAD_USER_INPUT' },
                });
            }
            const passwordHash = yield (0, PasswordHashing_1.hashPassword)(input.newPassword);
            const userModel = new model_1.UserModel(context.db);
            yield userModel.updatePassword(context.user.id, passwordHash);
            return true;
        });
    }
    resetPassword(_1, _a, _b) {
        return __awaiter(this, arguments, void 0, function* (_, { input }, { db }) {
            const userModel = new model_1.UserModel(db);
            const user = yield userModel.findByEmail(input.email);
            if (!user) {
                return true;
            }
            yield OTP_1.OtpService.createAndSendOtp(input.email, user.id, 'User', input.purpose);
            return true;
        });
    }
    setNewPassword(_1, _a, _b) {
        return __awaiter(this, arguments, void 0, function* (_, { input }, { db }) {
            const userModel = new model_1.UserModel(db);
            const isValid = yield OTP_1.OtpService.verifyOtp(input.email, input.otp, 'User', 'password-reset');
            if (!isValid) {
                throw new graphql_1.GraphQLError('Invalid or expired OTP', {
                    extensions: { code: 'BAD_USER_INPUT' },
                });
            }
            const user = yield userModel.findByEmail(input.email);
            if (!user) {
                throw new graphql_1.GraphQLError('User not found', {
                    extensions: { code: 'NOT_FOUND' },
                });
            }
            const passwordHash = yield (0, PasswordHashing_1.hashPassword)(input.newPassword);
            yield userModel.updatePasswordByEmail(input.email, passwordHash);
            return true;
        });
    }
    resendOtp(_1, _a, _b) {
        return __awaiter(this, arguments, void 0, function* (_, { input }, { db }) {
            const userModel = new model_1.UserModel(db);
            const user = yield userModel.findByEmail(input.email);
            if (!user) {
                return true;
            }
            yield OTP_1.OtpService.createAndSendOtp(input.email, user.id, 'User', input.purpose);
            return true;
        });
    }
    deleteAccount(_, __, context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!context.user) {
                throw new graphql_1.GraphQLError('Not authenticated', {
                    extensions: { code: 'UNAUTHENTICATED' },
                });
            }
            const userModel = new model_1.UserModel(context.db);
            yield userModel.delete(context.user.id);
            return true;
        });
    }
}
exports.UserAuthService = UserAuthService;
