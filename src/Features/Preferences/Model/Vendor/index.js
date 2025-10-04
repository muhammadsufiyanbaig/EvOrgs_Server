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
exports.VendorPreferenceModel = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const Schema_1 = require("../../../../Schema");
class VendorPreferenceModel {
    // Find vendor preferences by vendorId
    findByVendorId(db, vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const preferences = yield db.select()
                    .from(Schema_1.vendorPreferences)
                    .where((0, drizzle_orm_1.eq)(Schema_1.vendorPreferences.vendorId, vendorId))
                    .limit(1);
                return preferences.length > 0 ? preferences[0] : null;
            }
            catch (error) {
                console.error('Error finding vendor preferences:', error);
                throw new Error('Failed to find vendor preferences');
            }
        });
    }
    // Create new vendor preferences
    create(db, preferenceData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield db.insert(Schema_1.vendorPreferences).values(preferenceData);
                return preferenceData;
            }
            catch (error) {
                console.error('Error creating vendor preferences:', error);
                throw new Error('Failed to create vendor preferences');
            }
        });
    }
    // Update vendor preferences
    update(db, vendorId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield db.update(Schema_1.vendorPreferences)
                    .set(updateData)
                    .where((0, drizzle_orm_1.eq)(Schema_1.vendorPreferences.vendorId, vendorId));
            }
            catch (error) {
                console.error('Error updating vendor preferences:', error);
                throw new Error('Failed to update vendor preferences');
            }
        });
    }
}
exports.VendorPreferenceModel = VendorPreferenceModel;
