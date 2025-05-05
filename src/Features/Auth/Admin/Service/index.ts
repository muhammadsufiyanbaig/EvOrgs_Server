
import { Context } from '../../../../GraphQL/Context';
import { AdminModel } from '../model';
import { Admin, AdminLoginInput, AdminResponse, AdminSignupInput, AuthResponse, ChangePasswordInput, OtpRequestInput, OtpResponse, OtpVerifyInput, PasswordResetResponse, ResendOtpInput, ResetPasswordInput, UpdateProfileInput } from '../Types';

export class AdminService {
  private adminModel: AdminModel;

  constructor(private db: Context['db']) {
    this.adminModel = new AdminModel(db);
  }

  async me(_parent: unknown, _args: unknown, { user }: Context): Promise<Admin | null> {
    if (!user || user.role !== "Admin") {
      throw new Error("Unauthorized");
    }

    const adminDetails = await this.adminModel.findAdminById(user.id);

    if (!adminDetails) {
      throw new Error("Admin not found");
    }

    return adminDetails;
  }

  async adminSignup(_parent: unknown, { input }: { input: AdminSignupInput }): Promise<AdminResponse> {
    return this.adminModel.createAdmin(input);
  }

  async adminLogin(_parent: unknown, { input }: { input: AdminLoginInput }): Promise<AuthResponse> {
    const { email, password } = input;
    return this.adminModel.loginAdmin(email, password);
  }

  async requestOtp(_parent: unknown, { input }: { input: OtpRequestInput }): Promise<OtpResponse> {
    const { email, purpose = "password-reset" } = input;
    return this.adminModel.requestOtp(email, purpose);
  }

  async verifyOtp(_parent: unknown, { input }: { input: OtpVerifyInput }): Promise<OtpResponse> {
    const { email, otp, purpose = "password-reset" } = input;
    return this.adminModel.verifyOtp(email, otp, purpose);
  }

  async resetPassword(_parent: unknown, { input }: { input: ResetPasswordInput }): Promise<PasswordResetResponse> {
    const { email, otp, newPassword } = input;

    // First verify the OTP
    const otpResult = await this.adminModel.verifyOtp(email, otp, "password-reset");
    if (!otpResult.success) {
      throw new Error(otpResult.message);
    }

    // Then reset the password
    const isReset = await this.adminModel.resetPassword(email, newPassword);
    if (!isReset) {
      throw new Error("Failed to reset password");
    }

    return {
      success: true,
      message: "Password reset successfully",
    };
  }

  async updateProfile(_parent: unknown, { input }: { input: UpdateProfileInput }, { user }: Context): Promise<AdminResponse> {
    if (!user || user.role !== "Admin") {
      throw new Error("Unauthorized");
    }

    const { firstName, lastName, phone, profileImage } = input;
    return this.adminModel.updateProfile(user.id, { firstName, lastName, phone, profileImage });
  }

  async changePassword(_parent: unknown, { input }: { input: ChangePasswordInput }, { user }: Context): Promise<boolean> {
    if (!user || user.role !== "Admin") {
      throw new Error("Unauthorized");
    }

    const { currentPassword, newPassword } = input;
    return this.adminModel.changePassword(user.id, currentPassword, newPassword);
  }

  async resendOtp(_parent: unknown, { input }: { input: ResendOtpInput }): Promise<boolean> {
    const { email, purpose } = input;
    const result = await this.adminModel.requestOtp(email, purpose);
    return result.success;
  }

  async setNewPassword(_parent: unknown, { input }: { input: ResetPasswordInput }): Promise<boolean> {
    const { email, otp, newPassword } = input;

    // First verify the OTP
    const otpResult = await this.adminModel.verifyOtp(email, otp, "password-reset");
    if (!otpResult.success) {
      throw new Error(otpResult.message);
    }

    // Then reset the password
    return this.adminModel.resetPassword(email, newPassword);
  }

  async deleteAccount(_parent: unknown, _args: unknown, { user }: Context): Promise<boolean> {
    if (!user || user.role !== "Admin") {
      throw new Error("Unauthorized");
    }

    return this.adminModel.deleteAccount(user.id);
  }
}