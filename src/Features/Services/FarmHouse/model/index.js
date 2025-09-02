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
exports.FarmhouseModel = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const Schema_1 = require("../../../../Schema");
class FarmhouseModel {
    constructor(db) {
        this.db = db;
    }
    getFarmhouseById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const farmhouse = yield this.db.select()
                .from(Schema_1.farmhouses)
                .where((0, drizzle_orm_1.eq)(Schema_1.farmhouses.id, id))
                .limit(1);
            return farmhouse.length > 0 ? farmhouse[0] : null;
        });
    }
    getVendorFarmhouses(vendorId, isAvailable) {
        return __awaiter(this, void 0, void 0, function* () {
            let conditions = [(0, drizzle_orm_1.eq)(Schema_1.farmhouses.vendorId, vendorId)];
            if (isAvailable !== undefined) {
                conditions.push((0, drizzle_orm_1.eq)(Schema_1.farmhouses.isAvailable, isAvailable));
            }
            const vendorFarmhouses = yield this.db.select()
                .from(Schema_1.farmhouses)
                .where((0, drizzle_orm_1.and)(...conditions))
                .orderBy((0, drizzle_orm_1.desc)(Schema_1.farmhouses.createdAt));
            return vendorFarmhouses;
        });
    }
    // Get all farmhouses (public - only available ones)
    getAllFarmhouses() {
        return __awaiter(this, void 0, void 0, function* () {
            const allFarmhouses = yield this.db.select()
                .from(Schema_1.farmhouses)
                .where((0, drizzle_orm_1.eq)(Schema_1.farmhouses.isAvailable, true))
                .orderBy((0, drizzle_orm_1.desc)(Schema_1.farmhouses.createdAt));
            return allFarmhouses;
        });
    }
    // Get all farmhouses for admin (admin only - all farmhouses regardless of availability)
    getAllFarmhousesForAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            const allFarmhouses = yield this.db.select()
                .from(Schema_1.farmhouses)
                .orderBy((0, drizzle_orm_1.desc)(Schema_1.farmhouses.createdAt));
            return allFarmhouses;
        });
    }
    searchFarmhouses(filters_1) {
        return __awaiter(this, arguments, void 0, function* (filters, page = 1, limit = 10) {
            var _a, _b;
            const conditions = [];
            if (filters.id) {
                conditions.push((0, drizzle_orm_1.eq)(Schema_1.farmhouses.id, filters.id));
            }
            if (filters.isAvailable !== undefined) {
                conditions.push((0, drizzle_orm_1.eq)(Schema_1.farmhouses.isAvailable, filters.isAvailable));
            }
            if (filters.minPrice !== undefined) {
                conditions.push((0, drizzle_orm_1.gte)(Schema_1.farmhouses.perNightPrice, filters.minPrice.toString()));
            }
            if (filters.maxPrice !== undefined) {
                conditions.push((0, drizzle_orm_1.lte)(Schema_1.farmhouses.perNightPrice, filters.maxPrice.toString()));
            }
            if (filters.minNights !== undefined) {
                conditions.push((0, drizzle_orm_1.gte)(Schema_1.farmhouses.minNights, filters.minNights));
            }
            if (filters.maxNights !== undefined) {
                conditions.push(filters.maxNights === null
                    ? (0, drizzle_orm_1.isNull)(Schema_1.farmhouses.maxNights)
                    : (0, drizzle_orm_1.lte)(Schema_1.farmhouses.maxNights, filters.maxNights));
            }
            if (filters.maxGuests !== undefined) {
                conditions.push((0, drizzle_orm_1.gte)(Schema_1.farmhouses.maxGuests, filters.maxGuests));
            }
            if (filters.amenities && filters.amenities.length > 0) {
                // Assuming `farmhouses.amenities` is an array or a JSON column, you might need `arrayContains` or `like`
                for (const amenity of filters.amenities) {
                    conditions.push((0, drizzle_orm_1.like)(Schema_1.farmhouses.amenities, `%${amenity}%`)); // Adjust based on DB type
                }
            }
            const offset = (page - 1) * limit;
            const whereClause = conditions.length > 0 ? (0, drizzle_orm_1.and)(...conditions) : undefined;
            const searchResults = yield this.db
                .select()
                .from(Schema_1.farmhouses)
                .where(whereClause)
                .limit(limit)
                .offset(offset);
            const totalCountResult = yield this.db
                .select({ count: (0, drizzle_orm_1.count)() })
                .from(Schema_1.farmhouses)
                .where(whereClause);
            const totalCount = Number((_b = (_a = totalCountResult[0]) === null || _a === void 0 ? void 0 : _a.count) !== null && _b !== void 0 ? _b : 0);
            return {
                farmhouses: searchResults,
                totalCount,
                page,
                limit,
                totalPages: Math.ceil(totalCount / limit)
            };
        });
    }
    createFarmhouse(farmhouseData) {
        return __awaiter(this, void 0, void 0, function* () {
            const newFarmhouse = yield this.db.insert(Schema_1.farmhouses)
                .values(farmhouseData)
                .returning();
            return newFarmhouse[0];
        });
    }
    updateFarmhouse(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedFarmhouse = yield this.db.update(Schema_1.farmhouses)
                .set(updateData)
                .where((0, drizzle_orm_1.eq)(Schema_1.farmhouses.id, id))
                .returning();
            return updatedFarmhouse[0];
        });
    }
    deleteFarmhouse(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedFarmhouse = yield this.db.delete(Schema_1.farmhouses)
                .where((0, drizzle_orm_1.eq)(Schema_1.farmhouses.id, id))
                .returning();
            return deletedFarmhouse[0];
        });
    }
    toggleFarmhouseAvailability(id, isAvailable) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedFarmhouse = yield this.db.update(Schema_1.farmhouses)
                .set({
                isAvailable,
                updatedAt: new Date()
            })
                .where((0, drizzle_orm_1.eq)(Schema_1.farmhouses.id, id))
                .returning();
            return updatedFarmhouse[0];
        });
    }
}
exports.FarmhouseModel = FarmhouseModel;
