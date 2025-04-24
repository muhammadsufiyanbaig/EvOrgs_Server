import { UserAuthService } from '../../../Services/UserAuth';
// Instantiate the UserAuthService


const userAuthService = new UserAuthService();
// Export the resolvers for user-related queries and mutations
export const userResolvers = {
  Query: {
    me: userAuthService.me.bind(userAuthService), 
  },

  Mutation: {
    register: userAuthService.register.bind(userAuthService),
    verifyRegistration: userAuthService.verifyRegistration.bind(userAuthService),
    login: userAuthService.login.bind(userAuthService),
    requestLoginOtp: userAuthService.requestLoginOtp.bind(userAuthService),
    verifyLoginOtp: userAuthService.verifyLoginOtp.bind(userAuthService),
    updateProfile: userAuthService.updateProfile.bind(userAuthService),
    changePassword: userAuthService.changePassword.bind(userAuthService),
    resetPassword: userAuthService.resetPassword.bind(userAuthService),
    setNewPassword: userAuthService.setNewPassword.bind(userAuthService),
    resendOtp: userAuthService.resendOtp.bind(userAuthService),
    deleteAccount: userAuthService.deleteAccount.bind(userAuthService),
  },
};