
import { Context } from '../../../../GraphQL/Context';
import { AdminModel } from '../model';
import { Admin, AdminLoginInput, AdminResponse, AdminSignupInput, AuthResponse, ChangePasswordInput, OtpRequestInput, OtpResponse, OtpVerifyInput, PasswordResetResponse, ResendOtpInput, ResetPasswordInput, UpdateProfileInput } from '../Types';
import { UserModel } from '../../User/model';
import { ListUsersInput, UserListResponse } from '../../User/Types';
import { VendorModel } from '../../Vendor/model';
import { ListVendorsInput, VendorListResponse } from '../../Vendor/Types';

export class AdminService {
  private adminModel: AdminModel;
  private userModel: UserModel;
  private vendorModel: VendorModel;

  constructor(private db: Context['db']) {
    this.adminModel = new AdminModel(db);
    this.userModel = new UserModel(db);
    this.vendorModel = new VendorModel(db);
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

  // User Management Methods for Admin
  async listAllUsers(_parent: unknown, { input }: { input?: ListUsersInput }, { user }: Context): Promise<UserListResponse> {
    if (!user || user.role !== "Admin") {
      throw new Error("Unauthorized: Only admins can access user list");
    }

    const { page = 1, limit = 10, search } = input || {};

    let result;
    if (search) {
      result = await this.userModel.searchUsers(search, page, limit);
    } else {
      result = await this.userModel.getAllUsers(page, limit);
    }

    const totalPages = Math.ceil(result.total / limit);

    return {
      users: result.users,
      total: result.total,
      page,
      limit,
      totalPages
    };
  }

  async getUserById(_parent: unknown, { userId }: { userId: string }, { user }: Context): Promise<any> {
    if (!user || user.role !== "Admin") {
      throw new Error("Unauthorized: Only admins can access user details");
    }

    const userData = await this.userModel.findById(userId);
    if (!userData) {
      throw new Error("User not found");
    }

    return userData;
  }

  async deleteUser(_parent: unknown, { userId }: { userId: string }, { user }: Context): Promise<boolean> {
    if (!user || user.role !== "Admin") {
      throw new Error("Unauthorized: Only admins can delete users");
    }

    const userData = await this.userModel.findById(userId);
    if (!userData) {
      throw new Error("User not found");
    }

    await this.userModel.delete(userId);
    return true;
  }

  // Vendor Management Methods for Admin
  async listAllVendors(_parent: unknown, { input }: { input?: ListVendorsInput }, { user }: Context): Promise<VendorListResponse> {
    if (!user || user.role !== "Admin") {
      throw new Error("Unauthorized: Only admins can access vendor list");
    }

    const { page = 1, limit = 10, search, status, vendorType } = input || {};

    let result;
    
    if (search) {
      result = await this.vendorModel.searchVendors(search, page, limit);
    } else if (status) {
      result = await this.vendorModel.getVendorsByStatus(status, page, limit);
    } else if (vendorType) {
      result = await this.vendorModel.getVendorsByType(vendorType, page, limit);
    } else {
      result = await this.vendorModel.getAllVendors(page, limit);
    }

    const totalPages = Math.ceil(result.total / limit);

    return {
      vendors: result.vendors,
      total: result.total,
      page,
      limit,
      totalPages
    };
  }

  async getVendorById(_parent: unknown, { vendorId }: { vendorId: string }, { user }: Context): Promise<any> {
    if (!user || user.role !== "Admin") {
      throw new Error("Unauthorized: Only admins can access vendor details");
    }

    const vendorData = await this.vendorModel.findVendorById(vendorId);
    if (!vendorData) {
      throw new Error("Vendor not found");
    }

    return vendorData;
  }

  async deleteVendor(_parent: unknown, { vendorId }: { vendorId: string }, { user }: Context): Promise<boolean> {
    if (!user || user.role !== "Admin") {
      throw new Error("Unauthorized: Only admins can delete vendors");
    }

    const vendorData = await this.vendorModel.findVendorById(vendorId);
    if (!vendorData) {
      throw new Error("Vendor not found");
    }

    await this.vendorModel.deleteVendor(vendorId);
    return true;
  }

  async updateVendorStatus(_parent: unknown, { input }: { input: { vendorId: string, status: "Pending" | "Approved" | "Rejected", message?: string } }, { user }: Context): Promise<boolean> {
    if (!user || user.role !== "Admin") {
      throw new Error("Unauthorized: Only admins can update vendor status");
    }

    const vendorData = await this.vendorModel.findVendorById(input.vendorId);
    if (!vendorData) {
      throw new Error("Vendor not found");
    }

    await this.vendorModel.updateVendorApproval({
      vendorId: input.vendorId,
      status: input.status,
      message: input.message
    });

    return true;
  }
}