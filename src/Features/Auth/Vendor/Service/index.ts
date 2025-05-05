import { GraphQLError } from 'graphql';

import { hashPassword, verifyPassword } from '../../../../utils/PasswordHashing';
import { generateToken } from '../../../../Config/auth/JWT';
import { VendorModel } from '../model';
import { OtpService } from '../../../../utils/OTP';
import { VendorApprovalInput, VendorChangePasswordInput, VendorLoginInput, VendorRegisterInput, VendorResendOtpInput, VendorResetPasswordInput, VendorSetNewPasswordInput, VendorUpdateProfileInput, VendorVerifyOtpInput } from '../Types';
import { Context } from '../../../../GraphQL/Context';

export class VendorService {
  async vendor(_: any, { id }: { id: string }, { db, user }: Context) {
    if (!user || (user.role !== 'Admin' && user.id !== id)) {
      throw new GraphQLError('Not authorized to view this vendor', {
        extensions: { code: 'FORBIDDEN' },
      });
    }

    const vendorModel = new VendorModel(db);
    const vendor = await vendorModel.findVendorById(id);

    if (!vendor) {
      throw new GraphQLError('Vendor not found', {
        extensions: { code: 'NOT_FOUND' },
      });
    }

    return vendor;
  }

  async vendorProfile(_: any, __: any, context: Context) {
    if (!context.vendor) {
      throw new GraphQLError('Not authenticated', {
        extensions: { code: 'UNAUTHENTICATED' },
      });
    }

    return context.vendor;
  }

  async pendingVendors(_: any, __: any, { db, user }: Context) {
    if (!user || user.role !== 'Admin') {
      throw new GraphQLError('Not authorized', {
        extensions: { code: 'FORBIDDEN' },
      });
    }

    const vendorModel = new VendorModel(db);
    return vendorModel.getPendingVendors();
  }

  async approvedVendors(_: any, __: any, { db }: Context) {
    const vendorModel = new VendorModel(db);
    return vendorModel.getApprovedVendors();
  }

  async vendorRegister(_: any, { input }: { input: VendorRegisterInput }, { db }: Context) {
    const vendorModel = new VendorModel(db);

    const vendorExists = await vendorModel.vendorExists(input.vendorEmail);
    if (vendorExists) {
      throw new GraphQLError('Vendor with this email already exists', {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }

    const passwordHash = await hashPassword(input.password);
    const vendorId = await vendorModel.createVendor(input, passwordHash);

    const otpSent = await OtpService.createAndSendOtp(
      input.vendorEmail,
      vendorId,
      'Vendor',
      'registration'
    );

    if (!otpSent) {
        throw new GraphQLError('Failed to send verification email', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });
      }
    return true;
  }

  async vendorVerifyRegistration(_: any, { input }: { input: VendorVerifyOtpInput }, { db }: Context) {
    const isValid = await OtpService.verifyOtp(
      input.vendorEmail,
      input.otp,
      'Vendor',
      input.purpose as 'registration'
    );

    if (!isValid) {
      throw new GraphQLError('Invalid or expired OTP', {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }

    const vendorModel = new VendorModel(db);
    const vendor = await vendorModel.findVendorByEmail(input.vendorEmail);

    if (!vendor) {
      throw new GraphQLError('Vendor not found', {
        extensions: { code: 'NOT_FOUND' },
      });
    }

    await vendorModel.updateVendorEmail(vendor.id);

    const token = generateToken({ id: vendor.id, email: vendor.vendorEmail } as any);
    return {
      token,
      vendor,
    };
  }

  async vendorLogin(_: any, { input }: { input: VendorLoginInput }, { db }: Context) {
    const vendorModel = new VendorModel(db);
    const vendor = await vendorModel.findVendorByEmail(input.vendorEmail);

    if (!vendor) {
      throw new GraphQLError('Invalid email or password', {
        extensions: { code: 'UNAUTHENTICATED' },
      });
    }

    const validPassword = await verifyPassword(input.password, vendor.passwordHash);

    if (!validPassword) {
      throw new GraphQLError('Invalid email or password', {
        extensions: { code: 'UNAUTHENTICATED' },
      });
    }

    if (vendor.vendorStatus === 'Rejected') {
      throw new GraphQLError(
        'Your vendor account has been rejected. Please contact support for more information.',
        {
          extensions: { code: 'VENDOR_REJECTED' },
        }
      );
    }

    const token = generateToken({ id: vendor.id, email: vendor.vendorEmail } as any);

    return {
      token,
      vendor,
    };
  }

  async vendorRequestLoginOtp(
    _: any,
    { vendorEmail, userType }: { vendorEmail: string; userType: string },
    { db }: Context
  ) {
    const vendorModel = new VendorModel(db);
    const vendor = await vendorModel.findVendorByEmail(vendorEmail);

    if (!vendor) {
      return true;
    }

    await OtpService.createAndSendOtp(vendorEmail, vendor.id, 'Vendor', 'login');

    return true;
  }

  async vendorVerifyLoginOtp(_: any, { input }: { input: VendorVerifyOtpInput }, { db }: Context) {
    const isValid = await OtpService.verifyOtp(
      input.vendorEmail,
      input.otp,
      'Vendor',
      input.purpose as 'login'
    );

    if (!isValid) {
      throw new GraphQLError('Invalid or expired OTP', {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }

    const vendorModel = new VendorModel(db);
    const vendor = await vendorModel.findVendorByEmail(input.vendorEmail);

    if (!vendor) {
      throw new GraphQLError('Vendor not found', {
        extensions: { code: 'NOT_FOUND' },
      });
    }

    if (vendor.vendorStatus === 'Rejected') {
      throw new GraphQLError(
        'Your vendor account has been rejected. Please contact support for more information.',
        {
          extensions: { code: 'VENDOR_REJECTED' },
        }
      );
    }

    const token = generateToken({ id: vendor.id, email: vendor.vendorEmail } as any);

    return {
      token,
      vendor,
    };
  }

  async vendorUpdateProfile(_: any, { input }: { input: VendorUpdateProfileInput }, context: Context) {
    if (!context.vendor) {
      throw new GraphQLError('Not authenticated', {
        extensions: { code: 'UNAUTHENTICATED' },
      });
    }

    const vendorModel = new VendorModel(context.db);
    const updatedVendor = await vendorModel.updateVendorProfile(
      context.vendor.id,
      input,
      context.vendor.fcmToken || []
    );

    return updatedVendor;
  }

  async vendorChangePassword(_: any, { input }: { input: VendorChangePasswordInput }, context: Context) {
    if (!context.vendor) {
      throw new GraphQLError('Not authenticated', {
        extensions: { code: 'UNAUTHENTICATED' },
      });
    }

    const validPassword = await verifyPassword(input.currentPassword, context.vendor.passwordHash);

    if (!validPassword) {
      throw new GraphQLError('Current password is incorrect', {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }

    const passwordHash = await hashPassword(input.newPassword);

    const vendorModel = new VendorModel(context.db);
    await vendorModel.updatePassword(context.vendor.id, passwordHash);

    return true;
  }

  async vendorResetPassword(_: any, { input }: { input: VendorResetPasswordInput }, { db }: Context) {
    const vendorModel = new VendorModel(db);
    const vendor = await vendorModel.findVendorByEmail(input.vendorEmail);

    if (!vendor) {
      return true;
    }

    await OtpService.createAndSendOtp(
      input.vendorEmail,
      vendor.id,
      input.userType as 'Vendor',
      'password-reset'
    );

    return true;
  }

  async vendorSetNewPassword(_: any, { input }: { input: VendorSetNewPasswordInput }, { db }: Context) {
    const isValid = await OtpService.verifyOtp(
      input.vendorEmail,
      input.otp,
      input.userType as 'Vendor',
      'password-reset'
    );

    if (!isValid) {
      throw new GraphQLError('Invalid or expired OTP', {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }

    const vendorModel = new VendorModel(db);
    const vendor = await vendorModel.findVendorByEmail(input.vendorEmail);

    if (!vendor) {
      throw new GraphQLError('Vendor not found', {
        extensions: { code: 'NOT_FOUND' },
      });
    }

    const passwordHash = await hashPassword(input.newPassword);
    await vendorModel.updatePasswordByEmail(input.vendorEmail, passwordHash);

    return true;
  }

  async vendorResendOtp(_: any, { input }: { input: VendorResendOtpInput }, { db }: Context) {
    const vendorModel = new VendorModel(db);
    const vendor = await vendorModel.findVendorByEmail(input.vendorEmail);

    if (!vendor) {
      return true;
    }

    await OtpService.createAndSendOtp(
      input.vendorEmail,
      vendor.id,
      input.userType as 'Vendor',
      input.purpose
    );

    return true;
  }

  async vendorDeleteAccount(_: any, __: any, context: Context) {
    if (!context.vendor) {
      throw new GraphQLError('Not authenticated', {
        extensions: { code: 'UNAUTHENTICATED' },
      });
    }

    const vendorModel = new VendorModel(context.db);
    await vendorModel.deleteVendor(context.vendor.id);

    return true;
  }

  async vendorApproval(_: any, { input }: { input: VendorApprovalInput }, { db, user }: Context) {
    if (!user || user.role !== 'Admin') {
      throw new GraphQLError('Not authorized to approve vendors', {
        extensions: { code: 'FORBIDDEN' },
      });
    }

    const vendorModel = new VendorModel(db);
    const vendor = await vendorModel.findVendorById(input.vendorId);

    if (!vendor) {
      throw new GraphQLError('Vendor not found', {
        extensions: { code: 'NOT_FOUND' },
      });
    }

    const updatedVendor = await vendorModel.updateVendorApproval(input);

    return updatedVendor;
  }
}