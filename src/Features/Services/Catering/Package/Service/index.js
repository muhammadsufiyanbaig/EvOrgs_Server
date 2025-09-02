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
exports.CateringPackageService = void 0;
const model_1 = require("../model");
class CateringPackageService {
    constructor(db) {
        this.model = new model_1.CateringPackageModel(db);
    }
    getCateringPackageById(id, vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const cateringPackage = yield this.model.findById(id);
            if (!cateringPackage) {
                throw new Error('Catering package not found');
            }
            if (cateringPackage.vendorId !== vendorId) {
                throw new Error('Unauthorized: You can only access your own catering packages');
            }
            return cateringPackage;
        });
    }
    getVendorCateringPackages(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findByVendorId(vendorId);
        });
    }
    searchCateringPackages(input_1) {
        return __awaiter(this, arguments, void 0, function* (input, page = 1, limit = 10) {
            const conditions = this.model.buildSearchConditions(input);
            return yield this.model.search(conditions, page, limit);
        });
    }
    createCateringPackage(input, vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { packageName, serviceArea, description, imageUrl, price, minGuests, maxGuests, menuItems, dietaryOptions, amenities, } = input;
            // Validate business rules
            if (minGuests > maxGuests) {
                throw new Error('Minimum guests cannot be greater than maximum guests');
            }
            if (price <= 0) {
                throw new Error('Price must be greater than zero');
            }
            const now = new Date();
            const packageData = {
                vendorId,
                packageName,
                serviceArea,
                description,
                imageUrl,
                price, // Keep price as a number - the model will convert it to string
                minGuests,
                maxGuests,
                menuItems: menuItems || [],
                dietaryOptions: dietaryOptions || [],
                amenities: amenities || [],
                isAvailable: true,
                reviewCount: 0,
                createdAt: now,
                updatedAt: now,
            };
            return yield this.model.create(packageData);
        });
    }
    updateCateringPackage(id, input, vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if package exists and belongs to vendor
            const existingPackage = yield this.model.findById(id);
            if (!existingPackage) {
                throw new Error('Catering package not found');
            }
            if (existingPackage.vendorId !== vendorId) {
                throw new Error('Unauthorized: You can only update your own catering packages');
            }
            // Validate business rules
            if ((input.minGuests !== undefined && input.maxGuests !== undefined && input.minGuests > input.maxGuests) ||
                (input.minGuests !== undefined && input.minGuests > existingPackage.maxGuests) ||
                (input.maxGuests !== undefined && existingPackage.minGuests > input.maxGuests)) {
                throw new Error('Minimum guests cannot be greater than maximum guests');
            }
            if (input.price !== undefined && input.price <= 0) {
                throw new Error('Price must be greater than zero');
            }
            const { price } = input, rest = __rest(input, ["price"]);
            const updateData = Object.assign(Object.assign(Object.assign({}, rest), (price !== undefined ? { price } : {})), { updatedAt: new Date() });
            return yield this.model.update(id, updateData);
        });
    }
    deleteCateringPackage(id, vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if package exists and belongs to vendor
            const existingPackage = yield this.model.findById(id);
            if (!existingPackage) {
                throw new Error('Catering package not found');
            }
            if (existingPackage.vendorId !== vendorId) {
                throw new Error('Unauthorized: You can only delete your own catering packages');
            }
            return yield this.model.delete(id);
        });
    }
    toggleCateringPackageAvailability(id, vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if package exists and belongs to vendor
            const existingPackage = yield this.model.findById(id);
            if (!existingPackage) {
                throw new Error('Catering package not found');
            }
            if (existingPackage.vendorId !== vendorId) {
                throw new Error('Unauthorized: You can only update your own catering packages');
            }
            const updateData = {
                isAvailable: !existingPackage.isAvailable,
                updatedAt: new Date(),
            };
            return yield this.model.update(id, updateData);
        });
    }
    // Admin functionality - Get all catering packages with filters and pagination
    getAllPackagesForAdmin() {
        return __awaiter(this, arguments, void 0, function* (filters = {}) {
            // Input validation
            if (filters.minPrice !== undefined && filters.minPrice < 0) {
                throw new Error('Minimum price cannot be negative');
            }
            if (filters.maxPrice !== undefined && filters.maxPrice < 0) {
                throw new Error('Maximum price cannot be negative');
            }
            if (filters.minPrice !== undefined && filters.maxPrice !== undefined && filters.minPrice > filters.maxPrice) {
                throw new Error('Minimum price cannot be greater than maximum price');
            }
            if (filters.minGuests !== undefined && filters.minGuests < 0) {
                throw new Error('Minimum guests cannot be negative');
            }
            if (filters.maxGuests !== undefined && filters.maxGuests < 0) {
                throw new Error('Maximum guests cannot be negative');
            }
            if (filters.minGuests !== undefined && filters.maxGuests !== undefined && filters.minGuests > filters.maxGuests) {
                throw new Error('Minimum guests cannot be greater than maximum guests');
            }
            if (filters.page !== undefined && filters.page < 1) {
                throw new Error('Page number must be positive');
            }
            if (filters.limit !== undefined && (filters.limit < 1 || filters.limit > 100)) {
                throw new Error('Limit must be between 1 and 100');
            }
            return yield this.model.getAllPackagesForAdmin(filters);
        });
    }
    // Admin functionality - Get a specific package by ID (no ownership check)
    getPackageByIdForAdmin(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const cateringPackage = yield this.model.findById(id);
            if (!cateringPackage) {
                throw new Error('Catering package not found');
            }
            return cateringPackage;
        });
    }
    // Admin functionality - Update package availability
    updatePackageAvailabilityByAdmin(id, isAvailable) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if package exists
            const existingPackage = yield this.model.findById(id);
            if (!existingPackage) {
                throw new Error('Catering package not found');
            }
            return yield this.model.updatePackageAvailabilityByAdmin(id, isAvailable);
        });
    }
    // Admin functionality - Delete any package
    deletePackageByAdmin(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if package exists
            const existingPackage = yield this.model.findById(id);
            if (!existingPackage) {
                throw new Error('Catering package not found');
            }
            return yield this.model.deletePackageByAdmin(id);
        });
    }
}
exports.CateringPackageService = CateringPackageService;
