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
exports.UserPreferenceService = void 0;
const uuid_1 = require("uuid");
const User_1 = require("../../Model/User");
class UserPreferenceService {
    constructor(db) {
        this.db = db;
        this.userPreferenceModel = new User_1.UserPreferenceModel();
    }
    // Get user preferences (create default if doesn't exist)
    getUserPreferences(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let preferences = yield this.userPreferenceModel.findByUserId(this.db, userId);
                if (!preferences) {
                    // Create default preferences
                    const defaultPrefs = {
                        id: (0, uuid_1.v4)(),
                        userId,
                        pushNotifications: true,
                        emailNotifications: true,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    };
                    preferences = yield this.userPreferenceModel.create(this.db, defaultPrefs);
                }
                return preferences;
            }
            catch (error) {
                console.error('Error getting user preferences:', error);
                throw new Error('Failed to get user preferences');
            }
        });
    }
    // Update user preferences
    updateUserPreferences(userId, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Ensure preferences exist first
                yield this.getUserPreferences(userId);
                const updateData = Object.assign(Object.assign({}, input), { updatedAt: new Date() });
                yield this.userPreferenceModel.updateByUserId(this.db, userId, updateData);
                return yield this.getUserPreferences(userId);
            }
            catch (error) {
                console.error('Error updating user preferences:', error);
                throw new Error('Failed to update user preferences');
            }
        });
    }
    // Reset to default preferences
    resetUserPreferences(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const defaultInput = {
                    pushNotifications: true,
                    emailNotifications: true,
                };
                return yield this.updateUserPreferences(userId, defaultInput);
            }
            catch (error) {
                console.error('Error resetting user preferences:', error);
                throw new Error('Failed to reset user preferences');
            }
        });
    }
    // Private method to get default preferences structure
    getDefaultPreferences(userId) {
        return {
            id: (0, uuid_1.v4)(),
            userId,
            pushNotifications: true,
            emailNotifications: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    }
}
exports.UserPreferenceService = UserPreferenceService;
