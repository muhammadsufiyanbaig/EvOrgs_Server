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
exports.FarmhouseService = void 0;
// SERVICE
// Features/Farmhouse/Service/FarmhouseService.ts
const uuid_1 = require("uuid");
const model_1 = require("../model");
class FarmhouseService {
    constructor(db) {
        this.model = new model_1.FarmhouseModel(db);
    }
    // Get all farmhouses (public - only available ones)
    getAllFarmhouses() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.getAllFarmhouses();
        });
    }
    // Get all farmhouses for admin (admin only - all farmhouses)
    getAllFarmhousesForAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.getAllFarmhousesForAdmin();
        });
    }
    getFarmhouseById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const farmhouse = yield this.model.getFarmhouseById(id);
            if (!farmhouse) {
                throw new Error('Farmhouse not found');
            }
            return farmhouse;
        });
    }
    getVendorFarmhouses(vendorId, isAvailable) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.getVendorFarmhouses(vendorId, isAvailable);
        });
    }
    searchFarmhouses(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { filters, page = 1, limit = 10 } = input;
            return this.model.searchFarmhouses(filters, page, limit);
        });
    }
    createFarmhouse(input, vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            // Validate required fields
            if (!input.name || !input.location || !input.description || !input.imageUrl || !input.perNightPrice || !input.maxGuests) {
                throw new Error('Missing required fields: name, location, description, imageUrl, perNightPrice, or maxGuests');
            }
            // Generate a new UUID for the farmhouse
            const farmhouseId = (0, uuid_1.v4)();
            // Prepare farmhouse data
            const farmhouseData = {
                id: farmhouseId,
                vendorId,
                name: input.name,
                location: input.location,
                description: input.description,
                imageUrl: Array.isArray(input.imageUrl) ? input.imageUrl : [input.imageUrl], // Ensure imageUrl is an array
                perNightPrice: String(input.perNightPrice), // Convert number to string for decimal field
                minNights: input.minNights || 1,
                maxNights: input.maxNights !== undefined ? input.maxNights : null,
                maxGuests: input.maxGuests,
                amenities: input.amenities || [], // Default to an empty array if not provided
                isAvailable: (_a = input.isAvailable) !== null && _a !== void 0 ? _a : true, // Default to true if not provided
                reviewCount: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            return this.model.createFarmhouse(farmhouseData);
        });
    }
    updateFarmhouse(input, vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verify farmhouse exists and belongs to vendor
            const farmhouse = yield this.model.getFarmhouseById(input.id);
            if (!farmhouse) {
                throw new Error('Farmhouse not found');
            }
            if (farmhouse.vendorId !== vendorId) {
                throw new Error('You do not have permission to update this farmhouse');
            }
            // Extract fields from input
            const { id, imageUrl } = input, otherFields = __rest(input, ["id", "imageUrl"]);
            // Prepare update data with proper handling for imageUrl
            const updateData = Object.assign(Object.assign(Object.assign(Object.assign({}, otherFields), { updatedAt: new Date() }), (imageUrl !== undefined && {
                imageUrl: imageUrl === null ? [] : Array.isArray(imageUrl) ? imageUrl : [imageUrl]
            })), (input.perNightPrice !== undefined && {
                perNightPrice: String(input.perNightPrice) // Convert to string for decimal field
            }));
            return this.model.updateFarmhouse(id, updateData);
        });
    }
    deleteFarmhouse(input, vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verify farmhouse exists and belongs to vendor
            const farmhouse = yield this.model.getFarmhouseById(input.id);
            if (!farmhouse) {
                throw new Error('Farmhouse not found');
            }
            if (farmhouse.vendorId !== vendorId) {
                throw new Error('You do not have permission to delete this farmhouse');
            }
            // Delete farmhouse
            const deletedFarmhouse = yield this.model.deleteFarmhouse(input.id);
            return {
                id: deletedFarmhouse.id,
                success: true,
                message: 'Farmhouse deleted successfully'
            };
        });
    }
    toggleFarmhouseAvailability(input, vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verify farmhouse exists and belongs to vendor
            const farmhouse = yield this.model.getFarmhouseById(input.id);
            if (!farmhouse) {
                throw new Error('Farmhouse not found');
            }
            if (farmhouse.vendorId !== vendorId) {
                throw new Error('You do not have permission to update this farmhouse');
            }
            // Toggle availability
            const updatedFarmhouse = yield this.model.toggleFarmhouseAvailability(input.id, input.isAvailable);
            return updatedFarmhouse;
        });
    }
}
exports.FarmhouseService = FarmhouseService;
