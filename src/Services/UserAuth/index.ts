import { GraphQLError } from 'graphql';
import { Context } from '../../utils/types';
import { generateToken } from '../../Config/auth/JWT';
import { OtpService } from '../../utils/OTP';
import { UserModel } from '../../model/User';
import { User, RegisterInput, VerifyOtpInput, LoginInput, UpdateProfileInput, ChangePasswordInput, ResetPasswordInput, SetNewPasswordInput, ResendOtpInput } from '../../utils/types';
import { hashPassword, verifyPassword } from '../../utils/PasswordHashing';

export class UserAuthService {
    async me(_: any, __: any, context: Context): Promise<any> {
        if (!context.user) {
            throw new GraphQLError('Not authenticated', {
                extensions: { code: 'UNAUTHENTICATED' },
            });
        }

        return context.user;
    }

    async register(_: any, { input }: { input: RegisterInput }, { db }: Context) {
        const userModel = new UserModel(db);
        
        // Check if user already exists
        const userExists = await userModel.emailExists(input.email);
        
        if (userExists) {
            throw new GraphQLError('User with this email already exists', {
                extensions: { code: 'BAD_USER_INPUT' },
            });
        }

        // Hash the password
        const passwordHash = await hashPassword(input.password);

        // Create the user
        const userId = await userModel.create(input, passwordHash);

        // Create and send OTP
        const otpSent = await OtpService.createAndSendOtp(
            input.email,
            userId,
            'User',
            'registration'
        );

        if (!otpSent) {
            throw new GraphQLError('Failed to send verification email', {
                extensions: { code: 'INTERNAL_SERVER_ERROR' },
            });
        }

        return true;
    }

    async verifyRegistration(_: any, { input }: { input: VerifyOtpInput }, { db }: Context) {
        const userModel = new UserModel(db);
        
        const isValid = await OtpService.verifyOtp(
            input.email,
            input.otp,
            'User',
            input.purpose as 'registration'
        );

        if (!isValid) {
            throw new GraphQLError('Invalid or expired OTP', {
                extensions: { code: 'BAD_USER_INPUT' },
            });
        }

        const user = await userModel.findByEmail(input.email);

        if (!user) {
            throw new GraphQLError('User not found', {
                extensions: { code: 'NOT_FOUND' },
            });
        }

        await userModel.setVerified(user.id);

        const token = generateToken({ ...user, isVerified: true } as User);

        return {
            token,
            user: { ...user, isVerified: true },
        };
    }

    async login(_: any, { input }: { input: LoginInput }, { db }: Context) {
        const userModel = new UserModel(db);
        const user = await userModel.findByEmail(input.email);

        if (!user) {
            throw new GraphQLError('Invalid email or password', {
                extensions: { code: 'UNAUTHENTICATED' },
            });
        }

        const validPassword = await verifyPassword(input.password, user.passwordHash);

        if (!validPassword) {
            throw new GraphQLError('Invalid email or password', {
                extensions: { code: 'UNAUTHENTICATED' },
            });
        }

        if (!user.isVerified) {
            await OtpService.createAndSendOtp(user.email, user.id, 'User', 'registration');
            throw new GraphQLError('Account not verified. A new verification code has been sent to your email.', {
                extensions: { code: 'UNVERIFIED_USER' },
            });
        }

        const token = generateToken(user as User);

        return {
            token,
            user,
        };
    }

    async requestLoginOtp(_: any, { email }: { email: string, userType: string }, { db }: Context) {
        const userModel = new UserModel(db);
        const user = await userModel.findByEmail(email);

        if (!user) {
            return true;
        }

        await OtpService.createAndSendOtp(email, user.id, 'User', 'registration');

        return true;
    }

    async verifyLoginOtp(_: any, { input }: { input: VerifyOtpInput }, { db }: Context) {
        const userModel = new UserModel(db);
        
        const isValid = await OtpService.verifyOtp(
            input.email,
            input.otp, 
            'User',
            input.purpose as 'login'
        );

        if (!isValid) {
            throw new GraphQLError('Invalid or expired OTP', {
                extensions: { code: 'BAD_USER_INPUT' },
            });
        }

        const user = await userModel.findByEmail(input.email);

        if (!user) {
            throw new GraphQLError('User not found', {
                extensions: { code: 'NOT_FOUND' },
            });
        }

        const token = generateToken(user as User);

        return {
            token,
            user,
        };
    }

    async updateProfile(_: any, { input }: { input: UpdateProfileInput }, context: Context) {
        if (!context.user) {
            throw new GraphQLError('Not authenticated', {
                extensions: { code: 'UNAUTHENTICATED' },
            });
        }

        const userModel = new UserModel(context.db);
        const updatedUser = await userModel.updateProfile(context.user.id, input);

        return updatedUser;
    }

    async changePassword(_: any, { input }: { input: ChangePasswordInput }, context: Context) {
        if (!context.user) {
            throw new GraphQLError('Not authenticated', {
                extensions: { code: 'UNAUTHENTICATED' },
            });
        }

        const validPassword = await verifyPassword(input.currentPassword, context.user.passwordHash);

        if (!validPassword) {
            throw new GraphQLError('Current password is incorrect', {
                extensions: { code: 'BAD_USER_INPUT' },
            });
        }

        const passwordHash = await hashPassword(input.newPassword);
        const userModel = new UserModel(context.db);
        await userModel.updatePassword(context.user.id, passwordHash);

        return true;
    }

    async resetPassword(_: any, { input }: { input: ResetPasswordInput }, { db }: Context) {
        const userModel = new UserModel(db);
        const user = await userModel.findByEmail(input.email);

        if (!user) {
            return true;
        }

        await OtpService.createAndSendOtp(
            input.email,
            user.id,
            'User',
            input.purpose as 'password-reset'
        );

        return true;
    }

    async setNewPassword(_: any, { input }: { input: SetNewPasswordInput }, { db }: Context) {
        const userModel = new UserModel(db);
        
        const isValid = await OtpService.verifyOtp(
            input.email,
            input.otp,
            'User',
            'password-reset'
        );
        
        if (!isValid) {
            throw new GraphQLError('Invalid or expired OTP', {
                extensions: { code: 'BAD_USER_INPUT' },
            });
        }

        const user = await userModel.findByEmail(input.email);

        if (!user) {
            throw new GraphQLError('User not found', {
                extensions: { code: 'NOT_FOUND' },
            });
        }

        const passwordHash = await hashPassword(input.newPassword);
        await userModel.updatePasswordByEmail(input.email, passwordHash);

        return true;
    }

    async resendOtp(_: any, { input }: { input: ResendOtpInput }, { db }: Context) {
        const userModel = new UserModel(db);
        const user = await userModel.findByEmail(input.email);

        if (!user) {
            return true;
        }

        await OtpService.createAndSendOtp(
            input.email,
            user.id,
            'User',
            input.purpose as 'password-reset' | 'registration' | 'login'
        );

        return true;
    }

    async deleteAccount(_: any, __: any, context: Context) {
        if (!context.user) {
            throw new GraphQLError('Not authenticated', {
                extensions: { code: 'UNAUTHENTICATED' },
            });
        }

        const userModel = new UserModel(context.db);
        await userModel.delete(context.user.id);

        return true;
    }
}