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
exports.CustomPackageModel = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const Schema_1 = require("../../../../../Schema");
class CustomPackageModel {
    getAllCustomPackagesForAdmin(_a) {
        return __awaiter(this, arguments, void 0, function* ({ status, vendorId, userId, minGuestCount, maxGuestCount, startDate, endDate, page = 1, limit = 10 }) {
            const offset = (page - 1) * limit;
            // Build conditions array
            const conditions = [];
            if (status) {
                conditions.push((0, drizzle_orm_1.eq)(Schema_1.cateringCustomPackages.status, status));
            }
            if (vendorId) {
                conditions.push((0, drizzle_orm_1.eq)(Schema_1.cateringCustomPackages.vendorId, vendorId));
            }
            if (userId) {
                conditions.push((0, drizzle_orm_1.eq)(Schema_1.cateringCustomPackages.userId, userId));
            }
            if (minGuestCount) {
                conditions.push((0, drizzle_orm_1.gte)(Schema_1.cateringCustomPackages.guestCount, minGuestCount));
            }
            if (maxGuestCount) {
                conditions.push((0, drizzle_orm_1.lte)(Schema_1.cateringCustomPackages.guestCount, maxGuestCount));
            }
            if (startDate && endDate) {
                conditions.push((0, drizzle_orm_1.sql) `${Schema_1.cateringCustomPackages.eventDate} BETWEEN ${startDate.toISOString()} AND ${endDate.toISOString()}`);
            }
            // Get packages with pagination
            const packagesPromise = this.db.select()
                .from(Schema_1.cateringCustomPackages)
                .where(conditions.length ? (0, drizzle_orm_1.and)(...conditions) : undefined)
                .orderBy((0, drizzle_orm_1.desc)(Schema_1.cateringCustomPackages.createdAt))
                .limit(limit)
                .offset(offset);
            // Get total count
            const totalCountPromise = this.db.select({
                count: (0, drizzle_orm_1.sql) `cast(count(*) as integer)`
            })
                .from(Schema_1.cateringCustomPackages)
                .where(conditions.length ? (0, drizzle_orm_1.and)(...conditions) : undefined);
            // Execute both queries in parallel
            const [packages, [{ count: total }]] = yield Promise.all([packagesPromise, totalCountPromise]);
            return {
                packages,
                total,
                page,
                totalPages: Math.ceil(total / limit)
            };
        });
    }
    constructor(db) {
        this.db = db;
    }
    // User custom packages
    getUserCustomPackages(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db
                .select()
                .from(Schema_1.cateringCustomPackages)
                .where((0, drizzle_orm_1.eq)(Schema_1.cateringCustomPackages.userId, userId));
        });
    }
    // Vendor custom packages
    getVendorCustomPackages(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db
                .select()
                .from(Schema_1.cateringCustomPackages)
                .where((0, drizzle_orm_1.eq)(Schema_1.cateringCustomPackages.vendorId, vendorId));
        });
    }
    // Get a single custom package by ID
    getCustomPackageById(packageId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [customPackage] = yield this.db
                .select()
                .from(Schema_1.cateringCustomPackages)
                .where((0, drizzle_orm_1.eq)(Schema_1.cateringCustomPackages.id, packageId))
                .limit(1);
            return customPackage;
        });
    }
    // Search custom packages with various filters
    searchCustomPackages(vendorId, filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const whereConditions = [(0, drizzle_orm_1.eq)(Schema_1.cateringCustomPackages.vendorId, vendorId)];
            // Status filter
            if (filters === null || filters === void 0 ? void 0 : filters.status) {
                whereConditions.push((0, drizzle_orm_1.eq)(Schema_1.cateringCustomPackages.status, filters.status));
            }
            // Guest count filters
            if (filters === null || filters === void 0 ? void 0 : filters.minGuestCount) {
                whereConditions.push((0, drizzle_orm_1.gte)(Schema_1.cateringCustomPackages.guestCount, filters.minGuestCount));
            }
            if (filters === null || filters === void 0 ? void 0 : filters.maxGuestCount) {
                whereConditions.push((0, drizzle_orm_1.lte)(Schema_1.cateringCustomPackages.guestCount, filters.maxGuestCount));
            }
            // Price range filters
            if (filters === null || filters === void 0 ? void 0 : filters.minPrice) {
                whereConditions.push((0, drizzle_orm_1.gte)(Schema_1.cateringCustomPackages.price, filters.minPrice));
            }
            if (filters === null || filters === void 0 ? void 0 : filters.maxPrice) {
                whereConditions.push((0, drizzle_orm_1.lte)(Schema_1.cateringCustomPackages.price, filters.maxPrice));
            }
            // Date range filters - proper handling of date types
            if (filters === null || filters === void 0 ? void 0 : filters.startDate) {
                const startDate = typeof filters.startDate === 'string' ? new Date(filters.startDate) : filters.startDate;
                whereConditions.push((0, drizzle_orm_1.gte)(Schema_1.cateringCustomPackages.eventDate, startDate.toISOString().split('T')[0]));
            }
            if (filters === null || filters === void 0 ? void 0 : filters.endDate) {
                const endDate = typeof filters.endDate === 'string' ? new Date(filters.endDate) : filters.endDate;
                whereConditions.push((0, drizzle_orm_1.lte)(Schema_1.cateringCustomPackages.eventDate, endDate.toISOString().split('T')[0]));
            }
            // Order details search (case-insensitive partial match)
            if (filters === null || filters === void 0 ? void 0 : filters.searchTerm) {
                whereConditions.push((0, drizzle_orm_1.sql) `LOWER(${Schema_1.cateringCustomPackages.orderDetails}) LIKE LOWER('%' || ${filters.searchTerm} || '%')`);
            }
            // Sort options
            let orderBy = (0, drizzle_orm_1.desc)(Schema_1.cateringCustomPackages.createdAt); // Default sort by newest
            if (filters === null || filters === void 0 ? void 0 : filters.sortBy) {
                switch (filters.sortBy) {
                    case 'price_asc':
                        orderBy = (0, drizzle_orm_1.asc)(Schema_1.cateringCustomPackages.price);
                        break;
                    case 'price_desc':
                        orderBy = (0, drizzle_orm_1.desc)(Schema_1.cateringCustomPackages.price);
                        break;
                    case 'guest_count_asc':
                        orderBy = (0, drizzle_orm_1.asc)(Schema_1.cateringCustomPackages.guestCount);
                        break;
                    case 'guest_count_desc':
                        orderBy = (0, drizzle_orm_1.desc)(Schema_1.cateringCustomPackages.guestCount);
                        break;
                    case 'event_date_asc':
                        orderBy = (0, drizzle_orm_1.asc)(Schema_1.cateringCustomPackages.eventDate);
                        break;
                    case 'event_date_desc':
                        orderBy = (0, drizzle_orm_1.desc)(Schema_1.cateringCustomPackages.eventDate);
                        break;
                    case 'created_at_asc':
                        orderBy = (0, drizzle_orm_1.asc)(Schema_1.cateringCustomPackages.createdAt);
                        break;
                    default:
                        orderBy = (0, drizzle_orm_1.desc)(Schema_1.cateringCustomPackages.createdAt);
                }
            }
            // Pagination
            const page = (filters === null || filters === void 0 ? void 0 : filters.page) || 1;
            const limit = (filters === null || filters === void 0 ? void 0 : filters.limit) || 10;
            const offset = (page - 1) * limit;
            // Get packages with filters, sorting, and pagination
            const packagesPromise = this.db
                .select()
                .from(Schema_1.cateringCustomPackages)
                .where((0, drizzle_orm_1.and)(...whereConditions))
                .orderBy(orderBy)
                .limit(limit)
                .offset(offset);
            // Get total count for pagination
            const totalCountPromise = this.db.select({
                count: (0, drizzle_orm_1.sql) `cast(count(*) as integer)`
            })
                .from(Schema_1.cateringCustomPackages)
                .where((0, drizzle_orm_1.and)(...whereConditions));
            // Execute both queries in parallel
            const [packages, [{ count: total }]] = yield Promise.all([packagesPromise, totalCountPromise]);
            return {
                packages,
                total,
                page,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page < Math.ceil(total / limit),
                hasPreviousPage: page > 1
            };
        });
    }
    // Create a new custom package
    createCustomPackage(packageData) {
        return __awaiter(this, void 0, void 0, function* () {
            const [newPackage] = yield this.db
                .insert(Schema_1.cateringCustomPackages)
                .values(packageData)
                .returning();
            return newPackage;
        });
    }
    // Update a custom package
    updateCustomPackage(packageId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            const [updatedPackage] = yield this.db
                .update(Schema_1.cateringCustomPackages)
                .set(Object.assign(Object.assign({}, updateData), { updatedAt: new Date() }))
                .where((0, drizzle_orm_1.eq)(Schema_1.cateringCustomPackages.id, packageId))
                .returning();
            return updatedPackage;
        });
    }
    // Check if a package exists with specific conditions
    findPackageWithConditions(conditions) {
        return __awaiter(this, void 0, void 0, function* () {
            const whereConditions = Object.entries(conditions)
                .filter(([key]) => key in Schema_1.cateringCustomPackages)
                .map(([key, value]) => {
                const column = Schema_1.cateringCustomPackages[key];
                return (0, drizzle_orm_1.eq)(column, value);
            });
            const [existingPackage] = yield this.db
                .select()
                .from(Schema_1.cateringCustomPackages)
                .where((0, drizzle_orm_1.and)(...whereConditions))
                .limit(1);
            return existingPackage;
        });
    }
}
exports.CustomPackageModel = CustomPackageModel;
