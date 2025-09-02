import { VendorService } from '../../Service';

const vendorService = new VendorService();

export const VendorResolvers = {
  Query: {
    vendor: vendorService.vendor.bind(vendorService),
    vendorProfile: vendorService.vendorProfile.bind(vendorService),
    pendingVendors: vendorService.pendingVendors.bind(vendorService),
    approvedVendors: vendorService.approvedVendors.bind(vendorService),
    // Vendor Management Queries
    vendorListAllVendors: vendorService.vendorListAllVendors.bind(vendorService),
    vendorListAllUsers: vendorService.vendorListAllUsers.bind(vendorService),
    vendorGetVendorById: vendorService.vendorGetVendorById.bind(vendorService),
    vendorGetUserById: vendorService.vendorGetUserById.bind(vendorService),
  },
  Mutation: {
    vendorRegister: vendorService.vendorRegister.bind(vendorService),
    vendorVerifyRegistration: vendorService.vendorVerifyRegistration.bind(vendorService),
    vendorLogin: vendorService.vendorLogin.bind(vendorService),
    vendorRequestLoginOtp: vendorService.vendorRequestLoginOtp.bind(vendorService),
    vendorVerifyLoginOtp: vendorService.vendorVerifyLoginOtp.bind(vendorService),
    vendorUpdateProfile: vendorService.vendorUpdateProfile.bind(vendorService),
    vendorChangePassword: vendorService.vendorChangePassword.bind(vendorService),
    vendorResetPassword: vendorService.vendorResetPassword.bind(vendorService),
    vendorSetNewPassword: vendorService.vendorSetNewPassword.bind(vendorService),
    vendorResendOtp: vendorService.vendorResendOtp.bind(vendorService),
    vendorDeleteAccount: vendorService.vendorDeleteAccount.bind(vendorService),
    vendorApproval: vendorService.vendorApproval.bind(vendorService),
    // Vendor Management Mutations
    vendorUpdateVendorStatus: vendorService.vendorUpdateVendorStatus.bind(vendorService),
    vendorVerifyUser: vendorService.vendorVerifyUser.bind(vendorService),
  },
};