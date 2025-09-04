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
exports.VendorPreferenceService = void 0;
const Vendor_1 = require("../../Model/Vendor");
const uuid_1 = require("uuid");
class VendorPreferenceService {
    constructor(db) {
        this.db = db;
        this.vendorPreferenceModel = new Vendor_1.VendorPreferenceModel();
    }
    // Get vendor preferences (create default if doesn't exist)
    getVendorPreferences(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let preferences = yield this.vendorPreferenceModel.findByVendorId(this.db, vendorId);
                if (!preferences) {
                    // Create default preferences
                    const defaultPrefs = {
                        id: (0, uuid_1.v4)(),
                        vendorId,
                        pushNotifications: true,
                        emailNotifications: true,
                        visibleInSearch: true,
                        visibleReviews: true,
                        workingHoursStart: '09:00',
                        workingHoursEnd: '17:00',
                        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    };
                    preferences = yield this.vendorPreferenceModel.create(this.db, defaultPrefs);
                }
                return preferences;
            }
            catch (error) {
                console.error('Error getting vendor preferences:', error);
                throw new Error('Failed to get vendor preferences');
            }
        });
    }
    // Update vendor preferences
    updateVendorPreferences(vendorId, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Ensure preferences exist first
                yield this.getVendorPreferences(vendorId);
                // Validate working hours if provided
                if (input.workingHoursStart || input.workingHoursEnd) {
                    this.validateWorkingHours(input.workingHoursStart, input.workingHoursEnd);
                }
                // Validate working days if provided
                if (input.workingDays) {
                    this.validateWorkingDays(input.workingDays);
                }
                const updateData = Object.assign(Object.assign({}, input), { updatedAt: new Date() });
                yield this.vendorPreferenceModel.update(this.db, vendorId, updateData);
                return yield this.getVendorPreferences(vendorId);
            }
            catch (error) {
                console.error('Error updating vendor preferences:', error);
                throw new Error('Failed to update vendor preferences');
            }
        });
    }
    // Reset to default preferences
    resetVendorPreferences(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const defaultInput = {
                    pushNotifications: true,
                    emailNotifications: true,
                    visibleInSearch: true,
                    visibleReviews: true,
                    workingHoursStart: '09:00',
                    workingHoursEnd: '17:00',
                    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                };
                return yield this.updateVendorPreferences(vendorId, defaultInput);
            }
            catch (error) {
                console.error('Error resetting vendor preferences:', error);
                throw new Error('Failed to reset vendor preferences');
            }
        });
    }
    // Validation helpers
    validateWorkingHours(start, end) {
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (start && !timeRegex.test(start)) {
            throw new Error('Invalid working hours start format. Use HH:MM format.');
        }
        if (end && !timeRegex.test(end)) {
            throw new Error('Invalid working hours end format. Use HH:MM format.');
        }
        if (start && end) {
            const startTime = new Date(`2000-01-01T${start}:00`);
            const endTime = new Date(`2000-01-01T${end}:00`);
            if (startTime >= endTime) {
                throw new Error('Working hours start must be before end time.');
            }
        }
    }
    validateWorkingDays(days) {
        const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const invalidDays = days.filter(day => !validDays.includes(day));
        if (invalidDays.length > 0) {
            throw new Error(`Invalid working days: ${invalidDays.join(', ')}`);
        }
        if (days.length === 0) {
            throw new Error('At least one working day must be selected.');
        }
    }
}
exports.VendorPreferenceService = VendorPreferenceService;
