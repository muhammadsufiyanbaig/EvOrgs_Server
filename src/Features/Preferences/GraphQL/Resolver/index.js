"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingsResolvers = void 0;
const User_1 = require("../../Services/User");
const Vendor_1 = require("../../Services/Vendor");
const apollo_server_express_1 = require("apollo-server-express");
exports.settingsResolvers = {
    Query: {
        getUserPreferences: (_, __, context) => __awaiter(void 0, void 0, void 0, function* () {
            if (!context.user) {
                throw new apollo_server_express_1.AuthenticationError('You must be logged in as a user to access preferences');
            }
            const userPreferenceService = new User_1.UserPreferenceService(context.db);
            return yield userPreferenceService.getUserPreferences(context.user.id);
        }),
        getVendorPreferences: (_, __, context) => __awaiter(void 0, void 0, void 0, function* () {
            if (!context.vendor) {
                throw new apollo_server_express_1.AuthenticationError('You must be logged in as a vendor to access preferences');
            }
            const vendorPreferenceService = new Vendor_1.VendorPreferenceService(context.db);
            return yield vendorPreferenceService.getVendorPreferences(context.vendor.id);
        }),
    },
    Mutation: {
        updateUserPreferences: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { input }, context) {
            if (!context.user) {
                throw new apollo_server_express_1.AuthenticationError('You must be logged in as a user to update preferences');
            }
            const userPreferenceService = new User_1.UserPreferenceService(context.db);
            return yield userPreferenceService.updateUserPreferences(context.user.id, input);
        }),
        updateVendorPreferences: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { input }, context) {
            if (!context.vendor) {
                throw new apollo_server_express_1.AuthenticationError('You must be logged in as a vendor to update preferences');
            }
            const vendorPreferenceService = new Vendor_1.VendorPreferenceService(context.db);
            return yield vendorPreferenceService.updateVendorPreferences(context.vendor.id, input);
        }),
        resetUserPreferences: (_, __, context) => __awaiter(void 0, void 0, void 0, function* () {
            if (!context.user) {
                throw new apollo_server_express_1.AuthenticationError('You must be logged in as a user to reset preferences');
            }
            const userPreferenceService = new User_1.UserPreferenceService(context.db);
            return yield userPreferenceService.resetUserPreferences(context.user.id);
        }),
        resetVendorPreferences: (_, __, context) => __awaiter(void 0, void 0, void 0, function* () {
            if (!context.vendor) {
                throw new apollo_server_express_1.AuthenticationError('You must be logged in as a vendor to reset preferences');
            }
            const vendorPreferenceService = new Vendor_1.VendorPreferenceService(context.db);
            return yield vendorPreferenceService.resetVendorPreferences(context.vendor.id);
        }),
    },
};
