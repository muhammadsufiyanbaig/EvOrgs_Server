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
exports.VenueModel = void 0;
// VenueModel.ts
const drizzle_orm_1 = require("drizzle-orm");
const Schema_1 = require("../../../../Schema");
class VenueModel {
    constructor(db) {
        this.db = db;
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.select().from(Schema_1.venues);
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield this.db.select().from(Schema_1.venues).where((0, drizzle_orm_1.eq)(Schema_1.venues.id, id));
            return results.length > 0 ? results[0] : null;
        });
    }
    findByVendorId(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.select().from(Schema_1.venues).where((0, drizzle_orm_1.eq)(Schema_1.venues.vendorId, vendorId));
        });
    }
    create(venue) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db.insert(Schema_1.venues).values(venue).returning();
            return result[0];
        });
    }
    update(id, data, vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            let whereClause;
            if (vendorId) {
                whereClause = (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.venues.id, id), (0, drizzle_orm_1.eq)(Schema_1.venues.vendorId, vendorId));
            }
            else {
                whereClause = (0, drizzle_orm_1.eq)(Schema_1.venues.id, id);
            }
            const result = yield this.db.update(Schema_1.venues)
                .set(data)
                .where(whereClause)
                .returning();
            return result[0];
        });
    }
    delete(id, vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const whereClause = vendorId
                ? (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.venues.id, id), (0, drizzle_orm_1.eq)(Schema_1.venues.vendorId, vendorId))
                : (0, drizzle_orm_1.eq)(Schema_1.venues.id, id);
            const result = yield this.db.delete(Schema_1.venues)
                .where(whereClause)
                .returning();
            return result.length > 0;
        });
    }
    findWithFilters(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const conditions = [];
            if (filters.tags && filters.tags.length > 0) {
                conditions.push((0, drizzle_orm_1.arrayOverlaps)(Schema_1.venues.tags, filters.tags));
            }
            if (filters.minCapacity !== undefined) {
                conditions.push((0, drizzle_orm_1.gte)(Schema_1.venues.minPersonLimit, filters.minCapacity));
            }
            if (filters.maxCapacity !== undefined) {
                conditions.push((0, drizzle_orm_1.lte)(Schema_1.venues.maxPersonLimit, filters.maxCapacity));
            }
            if (filters.location) {
                conditions.push((0, drizzle_orm_1.like)(Schema_1.venues.location, `%${filters.location}%`));
            }
            if (filters.isAvailable !== undefined) {
                conditions.push((0, drizzle_orm_1.eq)(Schema_1.venues.isAvailable, filters.isAvailable));
            }
            if (conditions.length > 0) {
                return yield this.db.select().from(Schema_1.venues).where((0, drizzle_orm_1.and)(...conditions));
            }
            return yield this.db.select().from(Schema_1.venues);
        });
    }
}
exports.VenueModel = VenueModel;
