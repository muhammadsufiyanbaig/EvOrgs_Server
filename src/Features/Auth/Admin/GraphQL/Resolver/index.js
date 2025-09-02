"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminResolver = void 0;
const db_1 = require("../../../../../Config/db");
const Service_1 = require("../../Service");
const adminService = new Service_1.AdminService(db_1.db);
exports.adminResolver = {
    Query: {
        adminMe: (_parent, _args, context) => adminService.me(_parent, _args, context),
        // User Management Queries
        adminListAllUsers: (_parent, args, context) => adminService.listAllUsers(_parent, args, context),
        adminGetUserById: (_parent, args, context) => adminService.getUserById(_parent, args, context),
        // Vendor Management Queries
        adminListAllVendors: (_parent, args, context) => adminService.listAllVendors(_parent, args, context),
        adminGetVendorById: (_parent, args, context) => adminService.getVendorById(_parent, args, context),
    },
    Mutation: {
        adminSignup: (_parent, args) => adminService.adminSignup(_parent, args),
        adminLogin: (_parent, args) => adminService.adminLogin(_parent, args),
        adminRequestOtp: (_parent, args) => adminService.requestOtp(_parent, args),
        adminVerifyOtp: (_parent, args) => adminService.verifyOtp(_parent, args),
        adminResetPassword: (_parent, args) => adminService.resetPassword(_parent, args),
        adminUpdateAdminProfile: (_parent, args, context) => adminService.updateProfile(_parent, { input: args.input }, context),
        adminChangePassword: (_parent, args, context) => adminService.changePassword(_parent, args, context),
        adminResendOtp: (_parent, args) => adminService.resendOtp(_parent, args),
        adminSetNewPassword: (_parent, args) => adminService.setNewPassword(_parent, args),
        adminDeleteAccount: (_parent, _args, context) => adminService.deleteAccount(_parent, _args, context),
        // User Management Mutations
        adminDeleteUser: (_parent, args, context) => adminService.deleteUser(_parent, args, context),
        // Vendor Management Mutations
        adminDeleteVendor: (_parent, args, context) => adminService.deleteVendor(_parent, args, context),
        adminUpdateVendorStatus: (_parent, args, context) => adminService.updateVendorStatus(_parent, args, context),
    },
};
