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
exports.UserPreferenceModel = void 0;
const Schema_1 = require("../../../../Schema");
const drizzle_orm_1 = require("drizzle-orm");
class UserPreferenceModel {
    // Find user preferences by userId
    findByUserId(db, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const preferences = yield db.select()
                    .from(Schema_1.userPreferences)
                    .where((0, drizzle_orm_1.eq)(Schema_1.userPreferences.userId, userId))
                    .limit(1);
                return preferences.length > 0 ? preferences[0] : null;
            }
            catch (error) {
                console.error('Error finding user preferences:', error);
                throw new Error('Database error while finding user preferences');
            }
        });
    }
    // Create new user preferences
    create(db, preferenceData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield db.insert(Schema_1.userPreferences).values(preferenceData);
                return preferenceData;
            }
            catch (error) {
                console.error('Error creating user preferences:', error);
                throw new Error('Database error while creating user preferences');
            }
        });
    }
    // Update user preferences
    updateByUserId(db, userId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield db.update(Schema_1.userPreferences)
                    .set(updateData)
                    .where((0, drizzle_orm_1.eq)(Schema_1.userPreferences.userId, userId));
            }
            catch (error) {
                console.error('Error updating user preferences:', error);
                throw new Error('Database error while updating user preferences');
            }
        });
    }
}
exports.UserPreferenceModel = UserPreferenceModel;
