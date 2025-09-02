import { db } from "../../../../../Config/db";
import { Context } from "../../../../../GraphQL/Context";
import { AdminService } from "../../Service";

const adminService = new AdminService(db);

export const adminResolver = {
  Query: {
    adminMe: (_parent: unknown, _args: unknown, context: Context) => adminService.me(_parent, _args, context),
    // User Management Queries
    adminListAllUsers: (_parent: unknown, args: { input?: any }, context: Context) => 
      adminService.listAllUsers(_parent, args, context),
    adminGetUserById: (_parent: unknown, args: { userId: string }, context: Context) => 
      adminService.getUserById(_parent, args, context),
    // Vendor Management Queries
    adminListAllVendors: (_parent: unknown, args: { input?: any }, context: Context) => 
      adminService.listAllVendors(_parent, args, context),
    adminGetVendorById: (_parent: unknown, args: { vendorId: string }, context: Context) => 
      adminService.getVendorById(_parent, args, context),
  },
  Mutation: {
    adminSignup: (_parent: unknown, args: { input: any }) => adminService.adminSignup(_parent, args),
    adminLogin: (_parent: unknown, args: { input: any }) => adminService.adminLogin(_parent, args),
    adminRequestOtp: (_parent: unknown, args: { input: any }) => adminService.requestOtp(_parent, args),
    adminVerifyOtp: (_parent: unknown, args: { input: any }) => adminService.verifyOtp(_parent, args),
    adminResetPassword: (_parent: unknown, args: { input: any }) => adminService.resetPassword(_parent, args),
    adminUpdateAdminProfile: (_parent: unknown, args: { input: any }, context: Context) => 
      adminService.updateProfile(_parent, { input: args.input }, context),
    adminChangePassword: (_parent: unknown, args: { input: any }, context: Context) => 
      adminService.changePassword(_parent, args, context),
    adminResendOtp: (_parent: unknown, args: { input: any }) => adminService.resendOtp(_parent, args),
    adminSetNewPassword: (_parent: unknown, args: { input: any }) => adminService.setNewPassword(_parent, args),
    adminDeleteAccount: (_parent: unknown, _args: unknown, context: Context) => 
      adminService.deleteAccount(_parent, _args, context),
    // User Management Mutations
    adminDeleteUser: (_parent: unknown, args: { userId: string }, context: Context) => 
      adminService.deleteUser(_parent, args, context),
    // Vendor Management Mutations
    adminDeleteVendor: (_parent: unknown, args: { vendorId: string }, context: Context) => 
      adminService.deleteVendor(_parent, args, context),
    adminUpdateVendorStatus: (_parent: unknown, args: { input: any }, context: Context) => 
      adminService.updateVendorStatus(_parent, args, context),
  },
};