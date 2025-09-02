"use strict";
// src/Features/Photography/Model.ts
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
exports.PhotographyModel = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const Schema_1 = require("../../../../../Schema");
class PhotographyModel {
    constructor(db) {
        this.db = db;
    }
    /**
     * Get a single photography package by ID
     */
    getPackageById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db.select()
                .from(Schema_1.photographyPackages)
                .where((0, drizzle_orm_1.eq)(Schema_1.photographyPackages.id, id))
                .limit(1);
            return result.length > 0 ? result[0] : null;
        });
    }
    /**
     * Get all photography packages for a vendor
     */
    getVendorPackages(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db.select()
                .from(Schema_1.photographyPackages)
                .where((0, drizzle_orm_1.eq)(Schema_1.photographyPackages.vendorId, vendorId));
            return result;
        });
    }
    /**
     * Search photography packages by criteria
     */
    searchPackages(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { packageName, amenities, serviceArea, photographerCount } = input;
            // Build conditions first
            const conditions = [];
            if (packageName) {
                conditions.push((0, drizzle_orm_1.ilike)(Schema_1.photographyPackages.packageName, `%${packageName}%`));
            }
            if (amenities && amenities.length > 0) {
                // Use raw SQL for PostgreSQL array operations
                conditions.push((0, drizzle_orm_1.sql) `${Schema_1.photographyPackages.amenities} && ${amenities}::text[]`);
            }
            if (serviceArea && serviceArea.length > 0) {
                conditions.push((0, drizzle_orm_1.sql) `${Schema_1.photographyPackages.serviceArea} && ${serviceArea}::text[]`);
            }
            if (photographerCount) {
                conditions.push((0, drizzle_orm_1.gte)(Schema_1.photographyPackages.photographerCount, photographerCount));
            }
            // Apply all conditions at once
            const query = conditions.length > 0
                ? yield this.db.select().from(Schema_1.photographyPackages).where((0, drizzle_orm_1.and)(...conditions))
                : yield this.db.select().from(Schema_1.photographyPackages);
            return query;
        });
    }
    /**
     * Check if package exists and belongs to vendor
     */
    checkVendorPackageOwnership(id, vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db.select()
                .from(Schema_1.photographyPackages)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.photographyPackages.id, id), (0, drizzle_orm_1.eq)(Schema_1.photographyPackages.vendorId, vendorId)))
                .limit(1);
            return result.length > 0 ? result[0] : null;
        });
    }
    /**
     * Create a new photography package
     */
    createPackage(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db.insert(Schema_1.photographyPackages)
                .values(data)
                .returning();
            return result[0];
        });
    }
    /**
     * Update an existing photography package
     */
    updatePackage(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db.update(Schema_1.photographyPackages)
                .set(data)
                .where((0, drizzle_orm_1.eq)(Schema_1.photographyPackages.id, id))
                .returning();
            return result[0];
        });
    }
    /**
     * Delete a photography package
     */
    deletePackage(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.delete(Schema_1.photographyPackages)
                .where((0, drizzle_orm_1.eq)(Schema_1.photographyPackages.id, id));
            return true;
        });
    }
    /**
     * Admin: Get all packages with advanced filtering and pagination
     */
    getAllPackagesForAdmin(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const { vendorId, packageName, serviceArea, amenities, isAvailable, minPrice, maxPrice, minDuration, maxDuration, minPhotographerCount, maxPhotographerCount, searchTerm, page = 1, limit = 20, sortBy = 'created_desc' } = filters;
            // Build conditions
            const conditions = [];
            if (vendorId) {
                conditions.push((0, drizzle_orm_1.eq)(Schema_1.photographyPackages.vendorId, vendorId));
            }
            if (packageName) {
                conditions.push((0, drizzle_orm_1.ilike)(Schema_1.photographyPackages.packageName, `%${packageName}%`));
            }
            if (serviceArea && serviceArea.length > 0) {
                conditions.push((0, drizzle_orm_1.sql) `${Schema_1.photographyPackages.serviceArea} && ${serviceArea}::text[]`);
            }
            if (amenities && amenities.length > 0) {
                conditions.push((0, drizzle_orm_1.sql) `${Schema_1.photographyPackages.amenities} && ${amenities}::text[]`);
            }
            if (isAvailable !== undefined) {
                conditions.push((0, drizzle_orm_1.eq)(Schema_1.photographyPackages.isAvailable, isAvailable));
            }
            if (minPrice !== undefined) {
                conditions.push((0, drizzle_orm_1.gte)(Schema_1.photographyPackages.price, minPrice.toString()));
            }
            if (maxPrice !== undefined) {
                conditions.push((0, drizzle_orm_1.lte)(Schema_1.photographyPackages.price, maxPrice.toString()));
            }
            if (minDuration !== undefined) {
                conditions.push((0, drizzle_orm_1.gte)(Schema_1.photographyPackages.duration, minDuration));
            }
            if (maxDuration !== undefined) {
                conditions.push((0, drizzle_orm_1.lte)(Schema_1.photographyPackages.duration, maxDuration));
            }
            if (minPhotographerCount !== undefined) {
                conditions.push((0, drizzle_orm_1.gte)(Schema_1.photographyPackages.photographerCount, minPhotographerCount));
            }
            if (maxPhotographerCount !== undefined) {
                conditions.push((0, drizzle_orm_1.lte)(Schema_1.photographyPackages.photographerCount, maxPhotographerCount));
            }
            if (searchTerm) {
                conditions.push((0, drizzle_orm_1.sql) `(${(0, drizzle_orm_1.ilike)(Schema_1.photographyPackages.packageName, `%${searchTerm}%`)} OR 
            ${(0, drizzle_orm_1.ilike)(Schema_1.photographyPackages.description, `%${searchTerm}%`)})`);
            }
            // Build sort order
            const getSortOrder = () => {
                switch (sortBy) {
                    case 'created_asc':
                        return (0, drizzle_orm_1.asc)(Schema_1.photographyPackages.createdAt);
                    case 'created_desc':
                        return (0, drizzle_orm_1.desc)(Schema_1.photographyPackages.createdAt);
                    case 'price_asc':
                        return (0, drizzle_orm_1.asc)(Schema_1.photographyPackages.price);
                    case 'price_desc':
                        return (0, drizzle_orm_1.desc)(Schema_1.photographyPackages.price);
                    case 'rating_asc':
                        return (0, drizzle_orm_1.asc)(Schema_1.photographyPackages.rating);
                    case 'rating_desc':
                        return (0, drizzle_orm_1.desc)(Schema_1.photographyPackages.rating);
                    case 'duration_asc':
                        return (0, drizzle_orm_1.asc)(Schema_1.photographyPackages.duration);
                    case 'duration_desc':
                        return (0, drizzle_orm_1.desc)(Schema_1.photographyPackages.duration);
                    case 'name_asc':
                        return (0, drizzle_orm_1.asc)(Schema_1.photographyPackages.packageName);
                    case 'name_desc':
                        return (0, drizzle_orm_1.desc)(Schema_1.photographyPackages.packageName);
                    default:
                        return (0, drizzle_orm_1.desc)(Schema_1.photographyPackages.createdAt);
                }
            };
            // Calculate offset
            const offset = (page - 1) * limit;
            // Execute queries
            const whereClause = conditions.length > 0 ? (0, drizzle_orm_1.and)(...conditions) : undefined;
            // Get packages with vendor info
            const packagesQuery = this.db
                .select({
                id: Schema_1.photographyPackages.id,
                vendorId: Schema_1.photographyPackages.vendorId,
                packageName: Schema_1.photographyPackages.packageName,
                serviceArea: Schema_1.photographyPackages.serviceArea,
                description: Schema_1.photographyPackages.description,
                imageUrl: Schema_1.photographyPackages.imageUrl,
                price: Schema_1.photographyPackages.price,
                duration: Schema_1.photographyPackages.duration,
                photographerCount: Schema_1.photographyPackages.photographerCount,
                deliverables: Schema_1.photographyPackages.deliverables,
                amenities: Schema_1.photographyPackages.amenities,
                isAvailable: Schema_1.photographyPackages.isAvailable,
                rating: Schema_1.photographyPackages.rating,
                reviewCount: Schema_1.photographyPackages.reviewCount,
                createdAt: Schema_1.photographyPackages.createdAt,
                updatedAt: Schema_1.photographyPackages.updatedAt,
                // Vendor info
                vendorName: Schema_1.vendors.vendorName,
                vendorEmail: Schema_1.vendors.vendorEmail,
                vendorPhone: Schema_1.vendors.vendorPhone
            })
                .from(Schema_1.photographyPackages)
                .leftJoin(Schema_1.vendors, (0, drizzle_orm_1.eq)(Schema_1.photographyPackages.vendorId, Schema_1.vendors.id))
                .where(whereClause)
                .orderBy(getSortOrder())
                .limit(limit)
                .offset(offset);
            // Get total count
            const countQuery = this.db
                .select({ count: (0, drizzle_orm_1.count)() })
                .from(Schema_1.photographyPackages)
                .where(whereClause);
            const [packages, [{ count: totalCount }]] = yield Promise.all([
                packagesQuery,
                countQuery
            ]);
            return {
                packages: packages.map((pkg) => (Object.assign(Object.assign({}, pkg), { price: parseFloat(pkg.price), rating: pkg.rating ? parseFloat(pkg.rating) : null, vendor: pkg.vendorName ? {
                        id: pkg.vendorId,
                        vendorName: pkg.vendorName,
                        vendorEmail: pkg.vendorEmail,
                        vendorPhone: pkg.vendorPhone
                    } : null }))),
                total: totalCount,
                page,
                totalPages: Math.ceil(totalCount / limit),
                hasNextPage: page < Math.ceil(totalCount / limit),
                hasPreviousPage: page > 1
            };
        });
    }
    /**
     * Admin: Get package statistics
     */
    getPackageStatistics() {
        return __awaiter(this, void 0, void 0, function* () {
            const statsQuery = this.db
                .select({
                totalPackages: (0, drizzle_orm_1.count)(),
                availablePackages: (0, drizzle_orm_1.count)((0, drizzle_orm_1.sql) `CASE WHEN ${Schema_1.photographyPackages.isAvailable} = true THEN 1 END`),
                unavailablePackages: (0, drizzle_orm_1.count)((0, drizzle_orm_1.sql) `CASE WHEN ${Schema_1.photographyPackages.isAvailable} = false THEN 1 END`),
                avgPrice: (0, drizzle_orm_1.sql) `AVG(CAST(${Schema_1.photographyPackages.price} AS NUMERIC))`,
                avgRating: (0, drizzle_orm_1.sql) `AVG(CAST(${Schema_1.photographyPackages.rating} AS NUMERIC))`,
            })
                .from(Schema_1.photographyPackages);
            const vendorCountQuery = this.db
                .select({
                totalVendors: (0, drizzle_orm_1.count)((0, drizzle_orm_1.sql) `DISTINCT ${Schema_1.photographyPackages.vendorId}`)
            })
                .from(Schema_1.photographyPackages);
            const [stats, vendorCount] = yield Promise.all([
                statsQuery,
                vendorCountQuery
            ]);
            const result = stats[0];
            const vendors = vendorCount[0];
            return {
                totalPackages: result.totalPackages,
                availablePackages: result.availablePackages,
                unavailablePackages: result.unavailablePackages,
                averagePrice: result.avgPrice ? parseFloat(result.avgPrice.toString()) : 0,
                averageRating: result.avgRating ? parseFloat(result.avgRating.toString()) : 0,
                totalVendors: vendors.totalVendors
            };
        });
    }
    /**
     * Admin: Get package by ID with vendor details
     */
    getPackageWithVendorById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db
                .select({
                id: Schema_1.photographyPackages.id,
                vendorId: Schema_1.photographyPackages.vendorId,
                packageName: Schema_1.photographyPackages.packageName,
                serviceArea: Schema_1.photographyPackages.serviceArea,
                description: Schema_1.photographyPackages.description,
                imageUrl: Schema_1.photographyPackages.imageUrl,
                price: Schema_1.photographyPackages.price,
                duration: Schema_1.photographyPackages.duration,
                photographerCount: Schema_1.photographyPackages.photographerCount,
                deliverables: Schema_1.photographyPackages.deliverables,
                amenities: Schema_1.photographyPackages.amenities,
                isAvailable: Schema_1.photographyPackages.isAvailable,
                rating: Schema_1.photographyPackages.rating,
                reviewCount: Schema_1.photographyPackages.reviewCount,
                createdAt: Schema_1.photographyPackages.createdAt,
                updatedAt: Schema_1.photographyPackages.updatedAt,
                // Vendor info
                vendorName: Schema_1.vendors.vendorName,
                vendorEmail: Schema_1.vendors.vendorEmail,
                vendorPhone: Schema_1.vendors.vendorPhone,
                vendorAddress: Schema_1.vendors.vendorAddress
            })
                .from(Schema_1.photographyPackages)
                .leftJoin(Schema_1.vendors, (0, drizzle_orm_1.eq)(Schema_1.photographyPackages.vendorId, Schema_1.vendors.id))
                .where((0, drizzle_orm_1.eq)(Schema_1.photographyPackages.id, id))
                .limit(1);
            if (result.length === 0)
                return null;
            const pkg = result[0];
            return Object.assign(Object.assign({}, pkg), { price: parseFloat(pkg.price), rating: pkg.rating ? parseFloat(pkg.rating) : null, vendor: pkg.vendorName ? {
                    id: pkg.vendorId,
                    vendorName: pkg.vendorName,
                    vendorEmail: pkg.vendorEmail,
                    vendorPhone: pkg.vendorPhone,
                    vendorAddress: pkg.vendorAddress
                } : null });
        });
    }
    /**
     * Admin: Update package status
     */
    updatePackageStatus(id, isAvailable) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db.update(Schema_1.photographyPackages)
                .set({
                isAvailable,
                updatedAt: new Date()
            })
                .where((0, drizzle_orm_1.eq)(Schema_1.photographyPackages.id, id))
                .returning();
            return result[0];
        });
    }
    /**
     * Admin: Delete package by ID
     */
    adminDeletePackage(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.delete(Schema_1.photographyPackages)
                .where((0, drizzle_orm_1.eq)(Schema_1.photographyPackages.id, id));
            return true;
        });
    }
}
exports.PhotographyModel = PhotographyModel;
