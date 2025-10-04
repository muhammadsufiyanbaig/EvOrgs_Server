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
exports.CustomPackageService = void 0;
const model_1 = require("../model");
const Types_1 = require("../Types");
class CustomPackageService {
    constructor(db) {
        this.model = new model_1.CustomPackageModel(db);
    }
    // User fetches their own custom packages
    getUserCustomPackages(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.getUserCustomPackages(userId);
        });
    }
    // Vendor fetches their custom packages
    getVendorCustomPackages(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.getVendorCustomPackages(vendorId);
        });
    }
    // Admin gets all custom packages with pagination and filters
    getAllCustomPackagesForAdmin() {
        return __awaiter(this, arguments, void 0, function* (filters = {}) {
            const { status, vendorId, userId, minGuestCount, maxGuestCount, startDate, endDate, page = 1, limit = 10 } = filters;
            if (filters.startDate) {
                filters.startDate = new Date(filters.startDate);
            }
            if (filters.endDate) {
                filters.endDate = new Date(filters.endDate);
            }
            return yield this.model.getAllCustomPackagesForAdmin({
                status,
                vendorId,
                userId,
                minGuestCount,
                maxGuestCount,
                startDate,
                endDate,
                page,
                limit
            });
        });
    }
    // Get a single custom package by ID and verify ownership
    getCustomPackageById(packageId, currentUserId, currentVendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const customPackage = yield this.model.getCustomPackageById(packageId);
            if (!customPackage) {
                throw Types_1.CustomGraphQLError.notFound('Package not found');
            }
            // Additional authorization check
            if (currentUserId && customPackage.userId !== currentUserId) {
                throw Types_1.CustomGraphQLError.forbidden();
            }
            if (currentVendorId && customPackage.vendorId !== currentVendorId) {
                throw Types_1.CustomGraphQLError.forbidden();
            }
            return customPackage;
        });
    }
    // Search custom packages with various filters
    searchCustomPackages(vendorId, filters) {
        return __awaiter(this, void 0, void 0, function* () {
            // Input validation
            if ((filters === null || filters === void 0 ? void 0 : filters.minGuestCount) && filters.minGuestCount < 0) {
                throw new Types_1.CustomGraphQLError('Minimum guest count cannot be negative', {
                    code: 'BAD_INPUT',
                    details: 'Minimum guest count must be zero or greater'
                });
            }
            if ((filters === null || filters === void 0 ? void 0 : filters.maxGuestCount) && filters.maxGuestCount < 0) {
                throw new Types_1.CustomGraphQLError('Maximum guest count cannot be negative', {
                    code: 'BAD_INPUT',
                    details: 'Maximum guest count must be zero or greater'
                });
            }
            if ((filters === null || filters === void 0 ? void 0 : filters.minGuestCount) && (filters === null || filters === void 0 ? void 0 : filters.maxGuestCount) && filters.minGuestCount > filters.maxGuestCount) {
                throw new Types_1.CustomGraphQLError('Minimum guest count cannot be greater than maximum guest count', {
                    code: 'BAD_INPUT',
                    details: 'Invalid guest count range'
                });
            }
            if ((filters === null || filters === void 0 ? void 0 : filters.minPrice) && filters.minPrice < 0) {
                throw new Types_1.CustomGraphQLError('Minimum price cannot be negative', {
                    code: 'BAD_INPUT',
                    details: 'Minimum price must be zero or greater'
                });
            }
            if ((filters === null || filters === void 0 ? void 0 : filters.maxPrice) && filters.maxPrice < 0) {
                throw new Types_1.CustomGraphQLError('Maximum price cannot be negative', {
                    code: 'BAD_INPUT',
                    details: 'Maximum price must be zero or greater'
                });
            }
            if ((filters === null || filters === void 0 ? void 0 : filters.minPrice) && (filters === null || filters === void 0 ? void 0 : filters.maxPrice) && filters.minPrice > filters.maxPrice) {
                throw new Types_1.CustomGraphQLError('Minimum price cannot be greater than maximum price', {
                    code: 'BAD_INPUT',
                    details: 'Invalid price range'
                });
            }
            if ((filters === null || filters === void 0 ? void 0 : filters.startDate) && (filters === null || filters === void 0 ? void 0 : filters.endDate)) {
                const startDate = new Date(filters.startDate);
                const endDate = new Date(filters.endDate);
                if (startDate > endDate) {
                    throw new Types_1.CustomGraphQLError('Start date cannot be after end date', {
                        code: 'BAD_INPUT',
                        details: 'Invalid date range'
                    });
                }
            }
            if ((filters === null || filters === void 0 ? void 0 : filters.page) && filters.page < 1) {
                throw new Types_1.CustomGraphQLError('Page number must be positive', {
                    code: 'BAD_INPUT',
                    details: 'Page number must be 1 or greater'
                });
            }
            if ((filters === null || filters === void 0 ? void 0 : filters.limit) && (filters.limit < 1 || filters.limit > 100)) {
                throw new Types_1.CustomGraphQLError('Limit must be between 1 and 100', {
                    code: 'BAD_INPUT',
                    details: 'Limit must be between 1 and 100'
                });
            }
            return yield this.model.searchCustomPackages(vendorId, filters);
        });
    }
    // User creates a custom package request
    createCustomPackageRequest(userId, input) {
        return __awaiter(this, void 0, void 0, function* () {
            // Input validation
            if (input.guestCount <= 0) {
                throw new Types_1.CustomGraphQLError('Guest count must be positive', {
                    code: 'BAD_INPUT',
                    details: 'Guest count must be greater than zero'
                });
            }
            const packageData = {
                vendorId: input.vendorId,
                userId: userId,
                orderDetails: input.orderDetails,
                guestCount: input.guestCount,
                eventDate: input.eventDate ? new Date(input.eventDate) : null,
                status: Types_1.CustomPackageStatus.Requested,
                price: 0, // Initial price set to 0
            };
            return yield this.model.createCustomPackage(packageData);
        });
    }
    // Vendor quotes a custom package
    quoteCustomPackage(vendorId, input) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validate price
            if (input.price <= 0) {
                throw new Types_1.CustomGraphQLError('Price must be positive', {
                    code: 'BAD_INPUT',
                    details: 'Price must be greater than zero'
                });
            }
            return yield this.model.updateCustomPackage(input.packageId, {
                price: input.price,
                status: Types_1.CustomPackageStatus.Quoted
            });
        });
    }
    respondToCustomPackageQuote(userId, input) {
        return __awaiter(this, void 0, void 0, function* () {
            // Ensure the package belongs to this user and is in 'Quoted' status
            const existingPackage = yield this.model.findPackageWithConditions({
                id: input.packageId,
                userId: userId,
                status: Types_1.CustomPackageStatus.Quoted
            });
            if (!existingPackage) {
                throw Types_1.CustomGraphQLError.notFound('Package not found or not in quotable status');
            }
            return yield this.model.updateCustomPackage(input.packageId, {
                status: input.response
            });
        });
    }
}
exports.CustomPackageService = CustomPackageService;
