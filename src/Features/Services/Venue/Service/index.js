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
exports.VenueService = void 0;
const uuid_1 = require("uuid");
const model_1 = require("../model");
class VenueService {
    constructor(db) {
        this.venueModel = new model_1.VenueModel(db);
    }
    // Get all venues
    getAllVenues() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.venueModel.findAll();
        });
    }
    // Get venues for a specific vendor
    getVenuesByVendorId(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.venueModel.findByVendorId(vendorId);
        });
    }
    // Get single venue by ID
    getVenueById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.venueModel.findById(id);
        });
    }
    // Create a new venue
    createVenue(vendorId, venueData) {
        return __awaiter(this, void 0, void 0, function* () {
            const newVenue = Object.assign(Object.assign({ id: (0, uuid_1.v4)(), vendorId }, venueData), { createdAt: new Date(), updatedAt: new Date() });
            return yield this.venueModel.create(newVenue);
        });
    }
    // Update an existing venue
    updateVenue(vendorId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = updateData, data = __rest(updateData, ["id"]);
            // First, verify the venue belongs to this vendor
            const venueToUpdate = yield this.venueModel.findById(id);
            if (!venueToUpdate || venueToUpdate.vendorId !== vendorId) {
                throw new Error('Venue not found or you do not have permission to update it');
            }
            return yield this.venueModel.update(id, Object.assign(Object.assign({}, data), { updatedAt: new Date() }), vendorId);
        });
    }
    // Delete a venue
    deleteVenue(vendorId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            // First, verify the venue belongs to this vendor
            const venueToDelete = yield this.venueModel.findById(id);
            if (!venueToDelete || venueToDelete.vendorId !== vendorId) {
                throw new Error('Venue not found or you do not have permission to delete it');
            }
            return yield this.venueModel.delete(id, vendorId);
        });
    }
    // Admin can get all venues regardless of vendor
    getAllVenuesForAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.venueModel.findAll();
        });
    }
    // Admin can update any venue
    adminUpdateVenue(updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = updateData, data = __rest(updateData, ["id"]);
            return yield this.venueModel.update(id, Object.assign(Object.assign({}, data), { updatedAt: new Date() }));
        });
    }
    // Admin can delete any venue
    adminDeleteVenue(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.venueModel.delete(id);
        });
    }
    // Toggle venue availability
    toggleVenueAvailability(vendorId, id, isAvailable) {
        return __awaiter(this, void 0, void 0, function* () {
            // First, verify the venue belongs to this vendor
            const venueToUpdate = yield this.venueModel.findById(id);
            if (!venueToUpdate || venueToUpdate.vendorId !== vendorId) {
                throw new Error('Venue not found or you do not have permission to update it');
            }
            return yield this.venueModel.update(id, { isAvailable, updatedAt: new Date() }, vendorId);
        });
    }
    // Search venues with filters
    searchVenues(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            // We'll add isAvailable: true filter to ensure only available venues are returned
            return yield this.venueModel.findWithFilters({
                tags: filters.tags,
                minCapacity: filters.minCapacity,
                maxCapacity: filters.maxCapacity,
                location: filters.location,
                isAvailable: true
            });
        });
    }
}
exports.VenueService = VenueService;
