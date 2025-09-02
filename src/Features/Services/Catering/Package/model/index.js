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
exports.CateringPackageModel = void 0;
// models/CateringPackageModel.ts
const drizzle_orm_1 = require("drizzle-orm");
const Schema_1 = require("../../../../../Schema");
// Helper function to convert database model to interface model
function mapToCateringPackage(dbPackage) {
    return Object.assign(Object.assign({}, dbPackage), { 
        // Convert imageUrl from string[] to string
        imageUrl: Array.isArray(dbPackage.imageUrl)
            ? dbPackage.imageUrl[0] || null
            : dbPackage.imageUrl, 
        // Ensure dates aren't null
        createdAt: dbPackage.createdAt || new Date(), updatedAt: dbPackage.updatedAt || new Date() });
}
class CateringPackageModel {
    constructor(db) {
        this.db = db;
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db
                .select()
                .from(Schema_1.cateringPackages)
                .where((0, drizzle_orm_1.eq)(Schema_1.cateringPackages.id, id))
                .limit(1);
            if (!result[0])
                return null;
            return mapToCateringPackage(result[0]);
        });
    }
    findByVendorId(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield this.db
                .select()
                .from(Schema_1.cateringPackages)
                .where((0, drizzle_orm_1.eq)(Schema_1.cateringPackages.vendorId, vendorId));
            return results.map(pkg => mapToCateringPackage(pkg));
        });
    }
    search(conditions_1) {
        return __awaiter(this, arguments, void 0, function* (conditions, page = 1, limit = 10) {
            var _a, _b;
            const offset = (page - 1) * limit;
            const whereClause = conditions.length > 0 ? (0, drizzle_orm_1.and)(...conditions) : undefined;
            const dbPackages = yield this.db
                .select()
                .from(Schema_1.cateringPackages)
                .where(whereClause)
                .limit(limit)
                .offset(offset);
            const packages = dbPackages.map(pkg => mapToCateringPackage(pkg));
            const totalResult = yield this.db
                .select({ count: (0, drizzle_orm_1.count)() })
                .from(Schema_1.cateringPackages)
                .where(whereClause);
            const totalCount = Number((_b = (_a = totalResult[0]) === null || _a === void 0 ? void 0 : _a.count) !== null && _b !== void 0 ? _b : 0);
            return {
                packages,
                totalCount,
                page,
                limit,
                totalPages: Math.ceil(totalCount / limit),
            };
        });
    }
    create(packageData) {
        return __awaiter(this, void 0, void 0, function* () {
            // Handle the imageUrl conversion if needed
            const imageUrl = packageData.imageUrl ? [packageData.imageUrl] : null;
            // Convert price from number to string as required by CateringPackage interface
            const dataToInsert = Object.assign(Object.assign({}, packageData), { imageUrl, price: packageData.price.toString(), menuItems: packageData.menuItems || null, dietaryOptions: packageData.dietaryOptions || [], amenities: packageData.amenities || [], isAvailable: true, reviewCount: 0, createdAt: new Date(), updatedAt: new Date() });
            const [newPackage] = yield this.db
                .insert(Schema_1.cateringPackages)
                .values(dataToInsert)
                .returning();
            return mapToCateringPackage(newPackage);
        });
    }
    update(id, packageData) {
        return __awaiter(this, void 0, void 0, function* () {
            // Handle the imageUrl conversion if it exists
            const dataToUpdate = Object.assign(Object.assign({}, packageData), { updatedAt: new Date() });
            // Convert price to string if it exists
            if (packageData.price !== undefined) {
                dataToUpdate.price = packageData.price.toString();
            }
            // Convert imageUrl to array if it exists
            if (packageData.imageUrl !== undefined) {
                dataToUpdate.imageUrl = packageData.imageUrl ? [packageData.imageUrl] : null;
            }
            const [updatedPackage] = yield this.db
                .update(Schema_1.cateringPackages)
                .set(dataToUpdate)
                .where((0, drizzle_orm_1.eq)(Schema_1.cateringPackages.id, id))
                .returning();
            return mapToCateringPackage(updatedPackage);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db
                .delete(Schema_1.cateringPackages)
                .where((0, drizzle_orm_1.eq)(Schema_1.cateringPackages.id, id))
                .returning();
            return result.length > 0;
        });
    }
    // Utility method to build search conditions
    buildSearchConditions(input) {
        const { packageName, amenities, serviceArea, menuItems } = input;
        const conditions = [];
        if (packageName) {
            conditions.push((0, drizzle_orm_1.ilike)(Schema_1.cateringPackages.packageName, `%${packageName}%`));
        }
        if (amenities && amenities.length > 0) {
            // Handle array to string comparison for postgres JSONB or array fields
            for (const amenity of amenities) {
                conditions.push((0, drizzle_orm_1.like)(Schema_1.cateringPackages.amenities, `%${amenity}%`));
            }
        }
        if (serviceArea && serviceArea.length > 0) {
            for (const area of serviceArea) {
                conditions.push((0, drizzle_orm_1.like)(Schema_1.cateringPackages.serviceArea, `%${area}%`));
            }
        }
        if (menuItems && menuItems.length > 0) {
            for (const item of menuItems) {
                conditions.push((0, drizzle_orm_1.like)(Schema_1.cateringPackages.menuItems, `%${item}%`));
            }
        }
        conditions.push((0, drizzle_orm_1.eq)(Schema_1.cateringPackages.isAvailable, true));
        return conditions;
    }
    // Admin functionality to get all catering packages with filters and pagination
    getAllPackagesForAdmin() {
        return __awaiter(this, arguments, void 0, function* (filters = {}) {
            const { vendorId, packageName, isAvailable, minPrice, maxPrice, minGuests, maxGuests, serviceArea, amenities, dietaryOptions, page = 1, limit = 10, sortBy = 'created_at_desc' } = filters;
            const offset = (page - 1) * limit;
            // Build conditions array
            const conditions = [];
            if (vendorId) {
                conditions.push((0, drizzle_orm_1.eq)(Schema_1.cateringPackages.vendorId, vendorId));
            }
            if (packageName) {
                conditions.push((0, drizzle_orm_1.ilike)(Schema_1.cateringPackages.packageName, `%${packageName}%`));
            }
            if (isAvailable !== undefined) {
                conditions.push((0, drizzle_orm_1.eq)(Schema_1.cateringPackages.isAvailable, isAvailable));
            }
            if (minPrice !== undefined) {
                conditions.push((0, drizzle_orm_1.gte)(Schema_1.cateringPackages.price, minPrice.toString()));
            }
            if (maxPrice !== undefined) {
                conditions.push((0, drizzle_orm_1.lte)(Schema_1.cateringPackages.price, maxPrice.toString()));
            }
            if (minGuests !== undefined) {
                conditions.push((0, drizzle_orm_1.gte)(Schema_1.cateringPackages.minGuests, minGuests));
            }
            if (maxGuests !== undefined) {
                conditions.push((0, drizzle_orm_1.lte)(Schema_1.cateringPackages.maxGuests, maxGuests));
            }
            if (serviceArea && serviceArea.length > 0) {
                for (const area of serviceArea) {
                    conditions.push((0, drizzle_orm_1.like)(Schema_1.cateringPackages.serviceArea, `%${area}%`));
                }
            }
            if (amenities && amenities.length > 0) {
                for (const amenity of amenities) {
                    conditions.push((0, drizzle_orm_1.like)(Schema_1.cateringPackages.amenities, `%${amenity}%`));
                }
            }
            if (dietaryOptions && dietaryOptions.length > 0) {
                for (const option of dietaryOptions) {
                    conditions.push((0, drizzle_orm_1.like)(Schema_1.cateringPackages.dietaryOptions, `%${option}%`));
                }
            }
            // Determine sort order
            let orderBy;
            switch (sortBy) {
                case 'name_asc':
                    orderBy = (0, drizzle_orm_1.asc)(Schema_1.cateringPackages.packageName);
                    break;
                case 'name_desc':
                    orderBy = (0, drizzle_orm_1.desc)(Schema_1.cateringPackages.packageName);
                    break;
                case 'price_asc':
                    orderBy = (0, drizzle_orm_1.asc)(Schema_1.cateringPackages.price);
                    break;
                case 'price_desc':
                    orderBy = (0, drizzle_orm_1.desc)(Schema_1.cateringPackages.price);
                    break;
                case 'guests_asc':
                    orderBy = (0, drizzle_orm_1.asc)(Schema_1.cateringPackages.maxGuests);
                    break;
                case 'guests_desc':
                    orderBy = (0, drizzle_orm_1.desc)(Schema_1.cateringPackages.maxGuests);
                    break;
                case 'created_at_asc':
                    orderBy = (0, drizzle_orm_1.asc)(Schema_1.cateringPackages.createdAt);
                    break;
                case 'created_at_desc':
                default:
                    orderBy = (0, drizzle_orm_1.desc)(Schema_1.cateringPackages.createdAt);
                    break;
            }
            // Get packages with pagination
            const packagesPromise = this.db.select()
                .from(Schema_1.cateringPackages)
                .where(conditions.length ? (0, drizzle_orm_1.and)(...conditions) : undefined)
                .orderBy(orderBy)
                .limit(limit)
                .offset(offset);
            // Get total count
            const totalCountPromise = this.db.select({
                count: (0, drizzle_orm_1.count)()
            })
                .from(Schema_1.cateringPackages)
                .where(conditions.length ? (0, drizzle_orm_1.and)(...conditions) : undefined);
            // Execute both queries in parallel
            const [dbPackages, [{ count: total }]] = yield Promise.all([packagesPromise, totalCountPromise]);
            // Convert database results to interface format
            const packages = dbPackages.map(pkg => mapToCateringPackage(pkg));
            return {
                packages,
                total: Number(total),
                page,
                totalPages: Math.ceil(Number(total) / limit),
                hasNextPage: page < Math.ceil(Number(total) / limit),
                hasPreviousPage: page > 1
            };
        });
    }
    // Admin functionality to update any package availability
    updatePackageAvailabilityByAdmin(id, isAvailable) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataToUpdate = {
                isAvailable,
                updatedAt: new Date()
            };
            const [updatedPackage] = yield this.db
                .update(Schema_1.cateringPackages)
                .set(dataToUpdate)
                .where((0, drizzle_orm_1.eq)(Schema_1.cateringPackages.id, id))
                .returning();
            return mapToCateringPackage(updatedPackage);
        });
    }
    // Admin functionality to delete any package
    deletePackageByAdmin(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db
                .delete(Schema_1.cateringPackages)
                .where((0, drizzle_orm_1.eq)(Schema_1.cateringPackages.id, id))
                .returning();
            return result.length > 0;
        });
    }
}
exports.CateringPackageModel = CateringPackageModel;
