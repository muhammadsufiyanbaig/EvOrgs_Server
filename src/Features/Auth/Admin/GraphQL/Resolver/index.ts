import { db } from "../../../../../Config/db";
import { AdminService } from "../../Service";
import { Context } from "../../../../../utils/types";

const adminService = new AdminService(db);

export const adminResolver = {
  Query: {
    adminMe: (_parent: unknown, _args: unknown, context: Context) => adminService.me(_parent, _args, context),
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
  },
};