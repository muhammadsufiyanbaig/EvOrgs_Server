"use strict";
// src/Features/Photography/Service.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhotographyService = void 0;
const graphql_1 = require("graphql");
const model_1 = require("../model");
const Types_1 = require("../Types");
class PhotographyService {
    constructor(db) {
        this.model = new model_1.PhotographyModel(db);
    }
    /**
     * Get a photography package by ID
     */
    getPackageById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const photographyPackage = yield this.model.getPackageById(id);
            if (!photographyPackage) {
                throw new graphql_1.GraphQLError('Photography package not found', {
                    extensions: { code: 'NOT_FOUND' }
                });
            }
            return photographyPackage;
        });
    }
    /**
     * Get all photography packages for a vendor
     */
    getVendorPackages(vendor) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!vendor) {
                throw new graphql_1.GraphQLError('Not authorized. Vendor login required', {
                    extensions: { code: 'UNAUTHORIZED' }
                });
            }
            return this.model.getVendorPackages(vendor.id);
        });
    }
    /**
     * Search photography packages by criteria
     */
    searchPackages(input) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.searchPackages(input);
        });
    }
    /**
     * Create a new photography package
     */
    createPackage(input, vendor) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!vendor) {
                throw new graphql_1.GraphQLError('Not authorized. Vendor login required', {
                    extensions: { code: 'UNAUTHORIZED' }
                });
            }
            // Validate input
            const validation = Types_1.InputValidator.validateCreatePackageInput(input);
            if (!validation.isValid) {
                throw new graphql_1.GraphQLError('Invalid input', {
                    extensions: { code: 'BAD_USER_INPUT', validationErrors: validation.errors }
                });
            }
            // Create package with default values
            const newPackage = Object.assign(Object.assign({}, input), { vendorId: vendor.id, id: undefined, isAvailable: (_a = input.isAvailable) !== null && _a !== void 0 ? _a : true, createdAt: new Date(), updatedAt: new Date() });
            return this.model.createPackage(newPackage);
        });
    }
    /**
     * Update an existing photography package
     */
    updatePackage(id, input, vendor) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!vendor) {
                throw new graphql_1.GraphQLError('Not authorized. Vendor login required', {
                    extensions: { code: 'UNAUTHORIZED' }
                });
            }
            // Validate that the package exists and belongs to the vendor
            const existingPackage = yield this.model.checkVendorPackageOwnership(id, vendor.id);
            if (!existingPackage) {
                throw new graphql_1.GraphQLError('Photography package not found or you do not have permission to update it', {
                    extensions: { code: 'NOT_FOUND' }
                });
            }
            // Validate input
            const validation = Types_1.InputValidator.validateUpdatePackageInput(input);
            if (!validation.isValid) {
                throw new graphql_1.GraphQLError('Invalid input', {
                    extensions: { code: 'BAD_USER_INPUT', validationErrors: validation.errors }
                });
            }
            // Update the package
            const { price } = input, restInput = __rest(input, ["price"]);
            const updatedPackage = Object.assign(Object.assign(Object.assign({}, restInput), (price !== undefined ? { price: price.toString() } : {})), { updatedAt: new Date() });
            return this.model.updatePackage(id, updatedPackage);
        });
    }
    /**
     * Delete a photography package
     */
    deletePackage(id, vendor) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!vendor) {
                throw new graphql_1.GraphQLError('Not authorized. Vendor login required', {
                    extensions: { code: 'UNAUTHORIZED' }
                });
            }
            // Validate that the package exists and belongs to the vendor
            const existingPackage = yield this.model.checkVendorPackageOwnership(id, vendor.id);
            if (!existingPackage) {
                throw new graphql_1.GraphQLError('Photography package not found or you do not have permission to delete it', {
                    extensions: { code: 'NOT_FOUND' }
                });
            }
            yield this.model.deletePackage(id);
            return {
                success: true,
                message: 'Photography package deleted successfully'
            };
        });
    }
    /**
     * Toggle photography package availability
     */
    togglePackageAvailability(id, vendor) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!vendor) {
                throw new graphql_1.GraphQLError('Not authorized. Vendor login required', {
                    extensions: { code: 'UNAUTHORIZED' }
                });
            }
            // Validate that the package exists and belongs to the vendor
            const existingPackage = yield this.model.checkVendorPackageOwnership(id, vendor.id);
            if (!existingPackage) {
                throw new graphql_1.GraphQLError('Photography package not found or you do not have permission to update it', {
                    extensions: { code: 'NOT_FOUND' }
                });
            }
            // Toggle the availability
            const newAvailability = !existingPackage.isAvailable;
            return this.model.updatePackage(id, {
                isAvailable: newAvailability,
                updatedAt: new Date()
            });
        });
    }
    // ================ ADMIN METHODS ================
    /**
     * Admin: Get all packages with filtering and pagination
     */
    getAllPackagesForAdmin(filters, admin) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!admin) {
                throw new graphql_1.GraphQLError('Admin authentication required', {
                    extensions: { code: 'UNAUTHORIZED' }
                });
            }
            // Validate filters
            const validation = Types_1.InputValidator.validateAdminFilters(filters);
            if (!validation.isValid) {
                throw new graphql_1.GraphQLError('Invalid filter parameters', {
                    extensions: { code: 'BAD_USER_INPUT', validationErrors: validation.errors }
                });
            }
            // Set defaults
            const normalizedFilters = Object.assign(Object.assign({}, filters), { page: filters.page || 1, limit: filters.limit || 20, sortBy: filters.sortBy || 'created_desc' });
            return this.model.getAllPackagesForAdmin(normalizedFilters);
        });
    }
    /**
     * Admin: Get package statistics
     */
    getPackageStatistics(admin) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!admin) {
                throw new graphql_1.GraphQLError('Admin authentication required', {
                    extensions: { code: 'UNAUTHORIZED' }
                });
            }
            return this.model.getPackageStatistics();
        });
    }
    /**
     * Admin: Get package by ID with vendor details
     */
    getPackageWithVendorById(id, admin) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!admin) {
                throw new graphql_1.GraphQLError('Admin authentication required', {
                    extensions: { code: 'UNAUTHORIZED' }
                });
            }
            const photographyPackage = yield this.model.getPackageWithVendorById(id);
            if (!photographyPackage) {
                throw new graphql_1.GraphQLError('Photography package not found', {
                    extensions: { code: 'NOT_FOUND' }
                });
            }
            return photographyPackage;
        });
    }
    /**
     * Admin: Update package status
     */
    updatePackageStatus(id, isAvailable, admin) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!admin) {
                throw new graphql_1.GraphQLError('Admin authentication required', {
                    extensions: { code: 'UNAUTHORIZED' }
                });
            }
            const existingPackage = yield this.model.getPackageById(id);
            if (!existingPackage) {
                throw new graphql_1.GraphQLError('Photography package not found', {
                    extensions: { code: 'NOT_FOUND' }
                });
            }
            return this.model.updatePackageStatus(id, isAvailable);
        });
    }
    /**
     * Admin: Delete package
     */
    adminDeletePackage(id, admin) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!admin) {
                throw new graphql_1.GraphQLError('Admin authentication required', {
                    extensions: { code: 'UNAUTHORIZED' }
                });
            }
            const existingPackage = yield this.model.getPackageById(id);
            if (!existingPackage) {
                throw new graphql_1.GraphQLError('Photography package not found', {
                    extensions: { code: 'NOT_FOUND' }
                });
            }
            yield this.model.adminDeletePackage(id);
            return {
                success: true,
                message: 'Photography package deleted successfully'
            };
        });
    }
    /**
     * Admin: Get recent packages
     */
    getRecentPackages() {
        return __awaiter(this, arguments, void 0, function* (limit = 10, admin) {
            if (!admin) {
                throw new graphql_1.GraphQLError('Admin authentication required', {
                    extensions: { code: 'UNAUTHORIZED' }
                });
            }
            const filters = {
                page: 1,
                limit,
                sortBy: 'created_desc'
            };
            const result = yield this.model.getAllPackagesForAdmin(filters);
            return result.packages;
        });
    }
    /**
     * Admin: Get packages by availability status
     */
    getPackagesByAvailability(isAvailable, admin) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!admin) {
                throw new graphql_1.GraphQLError('Admin authentication required', {
                    extensions: { code: 'UNAUTHORIZED' }
                });
            }
            const filters = {
                isAvailable,
                page: 1,
                limit: 50,
                sortBy: 'created_desc'
            };
            const result = yield this.model.getAllPackagesForAdmin(filters);
            return result.packages;
        });
    }
    /**
     * Admin: Get high-value packages
     */
    getHighValuePackages() {
        return __awaiter(this, arguments, void 0, function* (minPrice = 5000, admin) {
            if (!admin) {
                throw new graphql_1.GraphQLError('Admin authentication required', {
                    extensions: { code: 'UNAUTHORIZED' }
                });
            }
            const filters = {
                minPrice,
                page: 1,
                limit: 50,
                sortBy: 'price_desc'
            };
            const result = yield this.model.getAllPackagesForAdmin(filters);
            return result.packages;
        });
    }
    /**
     * Admin: Get packages by vendor
     */
    getPackagesByVendor(vendorId, admin) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!admin) {
                throw new graphql_1.GraphQLError('Admin authentication required', {
                    extensions: { code: 'UNAUTHORIZED' }
                });
            }
            const filters = {
                vendorId,
                page: 1,
                limit: 100,
                sortBy: 'created_desc'
            };
            const result = yield this.model.getAllPackagesForAdmin(filters);
            return result.packages;
        });
    }
}
exports.PhotographyService = PhotographyService;
