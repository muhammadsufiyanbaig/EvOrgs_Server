"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userResolvers = void 0;
const Service_1 = require("../../Service");
// Instantiate the UserAuthService
const userAuthService = new Service_1.UserAuthService();
// Export the resolvers for user-related queries and mutations
exports.userResolvers = {
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
