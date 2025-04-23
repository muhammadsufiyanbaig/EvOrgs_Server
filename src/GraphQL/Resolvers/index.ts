// src/graphql/resolvers.ts
import { GraphQLError } from 'graphql';
import { User, Context } from '../../utils/types';
import { hashPassword, verifyPassword } from '../../Config/auth/Password';
import { generateToken } from '../../Config/auth/JWT';
import { users } from '../../Schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { GraphQLScalarType, Kind } from 'graphql';
import { OtpService } from '../../Config/OTP';

// Define interfaces to match your schema
interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  profileImage?: string;
  dateOfBirth?: string;
  gender: "Male" | "Female" | "Others";
}

interface LoginInput {
  email: string;
  password: string;
}

interface VerifyOtpInput {
  email: string;
  otp: string;
  purpose: 'registration' | 'password-reset';
  userType: string;
}

interface UpdateProfileInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  profileImage?: string;
  dateOfBirth?: string;
  gender?: string;
  fcmToken?: string;
  
}

interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
  purpose: 'registration' | 'password-reset';
}

interface ResetPasswordInput {
  email: string;
  userType: string;
  purpose: 'registration' | 'password-reset';
}

interface SetNewPasswordInput {
  email: string;
  otp: string;
  newPassword: string;
  userType: string;  
  purpose: 'registration' | 'password-reset';
}

interface ResendOtpInput {
  email: string;
  purpose: 'registration' | 'password-reset';
  userType: string;
}

// Fixed Date scalar for GraphQL with proper type annotations
const dateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  serialize(value: unknown): string {
    if (value instanceof Date) {
      return value.toISOString();
    }
    throw new Error('GraphQL Date Scalar serializer expected a Date object');
  },
  parseValue(value: unknown): Date | null {
    if (typeof value === 'string') {
      return new Date(value);
    }
    return null;
  },
  parseLiteral(ast): Date | null {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});

export const resolvers = {
  Date: dateScalar,

  Query: {
    me: async (_: any, __: any, context: Context) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      return context.user;
    },
  },

  Mutation: {
    // Modified register to use OTP
    register: async (_: any, { input }: { input: RegisterInput }, { db }: Context) => {
      // Check if user already exists
      const existingUser = await db.select({ id: users.id })
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1);

      if (existingUser.length > 0) {
        throw new GraphQLError('User with this email already exists', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      // Hash the password
      const passwordHash = await hashPassword(input.password);

      // Create the user
      const userId = uuidv4();
      const dateOfBirth = input.dateOfBirth ? new Date(input.dateOfBirth) : null;

      const newUser = {
        id: userId,
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        phone: input.phone || null,
        address: input.address || null,
        fcmToken: [],
        passwordHash,
        profileImage: input.profileImage || null,
        dateOfBirth,
        gender: input.gender as "Male" | "Female" | "Others",
        createdAt: new Date(),
        isVerified: false, // New user is not verified until OTP confirmation
      };

      await db.insert(users).values(newUser);

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
    },

    // Verify registration
    verifyRegistration: async (_: any, { input }: { input: VerifyOtpInput }, { db }: Context) => {
      // Verify OTP - use password_reset instead of password-reset
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

      // Find the user
      const userRecord = await db.select()
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1);

      if (userRecord.length === 0) {
        throw new GraphQLError('User not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      const user = userRecord[0];

      // Update user to verified
      await db.update(users)
        .set({ isVerified: true })
        .where(eq(users.id, user.id));

      // Generate JWT token
      const token = generateToken(user as User);

      return {
        token,
        user: { ...user, isVerified: true },
      };
    },

    // Login
    login: async (_: any, { input }: { input: LoginInput }, { db }: Context) => {
      // Find the user
      const existingUser = await db.select()
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1);

      if (existingUser.length === 0) {
        throw new GraphQLError('Invalid email or password', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const user = existingUser[0];

      // Verify password
      const validPassword = await verifyPassword(input.password, user.passwordHash);

      if (!validPassword) {
        throw new GraphQLError('Invalid email or password', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      // Check if user is verified
      if (!user.isVerified) {
        // Send a new verification OTP
        await OtpService.createAndSendOtp(user.email, user.id, 'User', 'registration');

        throw new GraphQLError('Account not verified. A new verification code has been sent to your email.', {
          extensions: { code: 'UNVERIFIED_USER' },
        });
      }

      // Generate JWT token
      const token = generateToken(user as User);

      return {
        token,
        user,
      };
    },

    // Request login OTP
    requestLoginOtp: async (_: any, { email }: { email: string, userType: string }, { db }: Context) => {
      // Find the user
      const existingUser = await db.select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (existingUser.length === 0) {
        // Don't reveal if user exists or not
        return true;
      }

      const user = existingUser[0];

      // Send login OTP
      await OtpService.createAndSendOtp(email, user.id, 'User', 'registration');

      return true;
    },

    // Verify login OTP
    verifyLoginOtp: async (_: any, { input }: { input: VerifyOtpInput }, { db }: Context) => {
      // Verify OTP - use password_reset instead of password-reset
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

      // Find the user
      const userRecord = await db.select()
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1);

      if (userRecord.length === 0) {
        throw new GraphQLError('User not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      const user = userRecord[0];

      // Generate JWT token
      const token = generateToken(user as User);

      return {
        token,
        user,
      };
    },

    // Update profile
    updateProfile: async (_: any, { input }: { input: UpdateProfileInput }, context: Context) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const updateData: any = {};

      // Only update fields that are provided
      if (input.firstName) updateData.firstName = input.firstName;
      if (input.lastName) updateData.lastName = input.lastName;
      if (input.phone) updateData.phone = input.phone;
      if (input.address) updateData.address = input.address;
      if (input.profileImage) updateData.profileImage = input.profileImage;
      if (input.dateOfBirth) updateData.dateOfBirth = new Date(input.dateOfBirth);
      if (input.gender) updateData.gender = input.gender;

      // Handle FCM token updates
      if (input.fcmToken) {
        const currentTokens = context.user.fcmToken || [];
        if (!currentTokens.includes(input.fcmToken)) {
          updateData.fcmToken = [...currentTokens, input.fcmToken];
        }
      }

      await context.db.update(users)
        .set(updateData)
        .where(eq(users.id, context.user.id));

      // Get the updated user
      const updatedUser = await context.db.select()
        .from(users)
        .where(eq(users.id, context.user.id))
        .limit(1);

      return updatedUser[0];
    },

    // Change password
    changePassword: async (_: any, { input }: { input: ChangePasswordInput }, context: Context) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      // Verify current password
      const validPassword = await verifyPassword(input.currentPassword, context.user.passwordHash);

      if (!validPassword) {
        throw new GraphQLError('Current password is incorrect', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      // Hash the new password
      const passwordHash = await hashPassword(input.newPassword);

      // Update the password
      await context.db.update(users)
        .set({ passwordHash })
        .where(eq(users.id, context.user.id));

      return true;
    },

    // Reset password with OTP
    resetPassword: async (_: any, { input }: { input: ResetPasswordInput }, { db }: Context) => {
      // Check if user exists
      const existingUser = await db.select()
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1);

      if (existingUser.length === 0) {
        // Don't reveal if user exists for security
        return true;
      }

      const user = existingUser[0];

      // Create and send password reset OTP - use password_reset instead of password-reset
      await OtpService.createAndSendOtp(
        input.email,
        user.id,
        'User',
        input.purpose as 'password-reset'
      );

      return true;
    },

    // Set new password after reset
    setNewPassword: async (_: any, { input }: { input: SetNewPasswordInput }, { db }: Context) => {
      // Verify OTP - use password_reset instead of password-reset
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

      const userRecord = await db.select()
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1);

      if (userRecord.length === 0) {
        throw new GraphQLError('User not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      const passwordHash = await hashPassword(input.newPassword);

      await db.update(users)
        .set({ passwordHash })
        .where(eq(users.email, input.email));

      return true;
    },

    // Resend OTP
    resendOtp: async (_: any, { input }: { input: ResendOtpInput }, { db }: Context) => {
      // Find the user
      const existingUser = await db.select()
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1);

      if (existingUser.length === 0) {
        // Don't reveal if user exists
        return true;
      }

      const user = existingUser[0];

      // Create and send new OTP - use password_reset instead of password-reset
      await OtpService.createAndSendOtp(
        input.email,
        user.id,
        'User',
        input.purpose as 'password-reset' | 'registration' | 'login'
      );

      return true;
    },

    // Delete account
    deleteAccount: async (_: any, __: any, context: Context) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      await context.db.delete(users)
        .where(eq(users.id, context.user.id));

      return true;
    },
  },
};