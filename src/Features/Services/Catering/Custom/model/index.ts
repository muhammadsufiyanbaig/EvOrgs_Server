import { sql, eq, and, desc, asc, gte, lte, between, count } from 'drizzle-orm';
import { cateringCustomPackages } from '../../../../../Schema';
import { CustomPackageStatus, AdminCustomPackageFilters, CustomPackageListResponse } from '../Types';

export class CustomPackageModel {
    async getAllCustomPackagesForAdmin({
        status,
        vendorId,
        userId,
        minGuestCount,
        maxGuestCount,
        startDate,
        endDate,
        page = 1,
        limit = 10
    }: AdminCustomPackageFilters): Promise<CustomPackageListResponse> {
        const offset = (page - 1) * limit;
        
        // Build conditions array
        const conditions = [];
        
        if (status) {
            conditions.push(eq(cateringCustomPackages.status, status));
        }
        if (vendorId) {
            conditions.push(eq(cateringCustomPackages.vendorId, vendorId));
        }
        if (userId) {
            conditions.push(eq(cateringCustomPackages.userId, userId));
        }
        if (minGuestCount) {
            conditions.push(gte(cateringCustomPackages.guestCount, minGuestCount));
        }
        if (maxGuestCount) {
            conditions.push(lte(cateringCustomPackages.guestCount, maxGuestCount));
        }
        if (startDate && endDate) {
            conditions.push(sql`${cateringCustomPackages.eventDate} BETWEEN ${startDate.toISOString()} AND ${endDate.toISOString()}`);
        }

        // Get packages with pagination
        const packagesPromise = this.db.select()
            .from(cateringCustomPackages)
            .where(conditions.length ? and(...conditions) : undefined)
            .orderBy(desc(cateringCustomPackages.createdAt))
            .limit(limit)
            .offset(offset);

        // Get total count
        const totalCountPromise = this.db.select({
            count: sql<number>`cast(count(*) as integer)`
        })
        .from(cateringCustomPackages)
        .where(conditions.length ? and(...conditions) : undefined);

        // Execute both queries in parallel
        const [packages, [{ count: total }]] = await Promise.all([packagesPromise, totalCountPromise]);

        return {
            packages,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };
    }
    constructor(private db: any) { }

    // User custom packages
    async getUserCustomPackages(userId: string) {
        return await this.db
            .select()
            .from(cateringCustomPackages)
            .where(eq(cateringCustomPackages.userId, userId));
    }

    // Vendor custom packages
    async getVendorCustomPackages(vendorId: string) {
        return await this.db
            .select()
            .from(cateringCustomPackages)
            .where(eq(cateringCustomPackages.vendorId, vendorId));
    }

    // Get a single custom package by ID
    async getCustomPackageById(packageId: string) {
        const [customPackage] = await this.db
            .select()
            .from(cateringCustomPackages)
            .where(eq(cateringCustomPackages.id, packageId))
            .limit(1);

        return customPackage;
    }

    // Search custom packages with various filters
    async searchCustomPackages(vendorId: string, filters: any) {
        const whereConditions: any[] = [eq(cateringCustomPackages.vendorId, vendorId)];

        // Status filter
        if (filters?.status) {
            whereConditions.push(eq(cateringCustomPackages.status, filters.status));
        }

        // Guest count filters
        if (filters?.minGuestCount) {
            whereConditions.push(gte(cateringCustomPackages.guestCount, filters.minGuestCount));
        }
        if (filters?.maxGuestCount) {
            whereConditions.push(lte(cateringCustomPackages.guestCount, filters.maxGuestCount));
        }

        // Price range filters
        if (filters?.minPrice) {
            whereConditions.push(gte(cateringCustomPackages.price, filters.minPrice));
        }
        if (filters?.maxPrice) {
            whereConditions.push(lte(cateringCustomPackages.price, filters.maxPrice));
        }

        // Date range filters - proper handling of date types
        if (filters?.startDate) {
            const startDate = typeof filters.startDate === 'string' ? new Date(filters.startDate) : filters.startDate;
            whereConditions.push(gte(cateringCustomPackages.eventDate, startDate.toISOString().split('T')[0]));
        }
        if (filters?.endDate) {
            const endDate = typeof filters.endDate === 'string' ? new Date(filters.endDate) : filters.endDate;
            whereConditions.push(lte(cateringCustomPackages.eventDate, endDate.toISOString().split('T')[0]));
        }

        // Order details search (case-insensitive partial match)
        if (filters?.searchTerm) {
            whereConditions.push(sql`LOWER(${cateringCustomPackages.orderDetails}) LIKE LOWER('%' || ${filters.searchTerm} || '%')`);
        }

        // Sort options
        let orderBy = desc(cateringCustomPackages.createdAt); // Default sort by newest
        if (filters?.sortBy) {
            switch (filters.sortBy) {
                case 'price_asc':
                    orderBy = asc(cateringCustomPackages.price);
                    break;
                case 'price_desc':
                    orderBy = desc(cateringCustomPackages.price);
                    break;
                case 'guest_count_asc':
                    orderBy = asc(cateringCustomPackages.guestCount);
                    break;
                case 'guest_count_desc':
                    orderBy = desc(cateringCustomPackages.guestCount);
                    break;
                case 'event_date_asc':
                    orderBy = asc(cateringCustomPackages.eventDate);
                    break;
                case 'event_date_desc':
                    orderBy = desc(cateringCustomPackages.eventDate);
                    break;
                case 'created_at_asc':
                    orderBy = asc(cateringCustomPackages.createdAt);
                    break;
                default:
                    orderBy = desc(cateringCustomPackages.createdAt);
            }
        }

        // Pagination
        const page = filters?.page || 1;
        const limit = filters?.limit || 10;
        const offset = (page - 1) * limit;

        // Get packages with filters, sorting, and pagination
        const packagesPromise = this.db
            .select()
            .from(cateringCustomPackages)
            .where(and(...whereConditions))
            .orderBy(orderBy)
            .limit(limit)
            .offset(offset);

        // Get total count for pagination
        const totalCountPromise = this.db.select({
            count: sql<number>`cast(count(*) as integer)`
        })
        .from(cateringCustomPackages)
        .where(and(...whereConditions));

        // Execute both queries in parallel
        const [packages, [{ count: total }]] = await Promise.all([packagesPromise, totalCountPromise]);

        return {
            packages,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page < Math.ceil(total / limit),
            hasPreviousPage: page > 1
        };
    }

    // Create a new custom package
    async createCustomPackage(packageData: any) {
        const [newPackage] = await this.db
            .insert(cateringCustomPackages)
            .values(packageData)
            .returning();

        return newPackage;
    }

    // Update a custom package
    async updateCustomPackage(packageId: string, updateData: any) {
        const [updatedPackage] = await this.db
            .update(cateringCustomPackages)
            .set({
                ...updateData,
                updatedAt: new Date()
            })
            .where(eq(cateringCustomPackages.id, packageId))
            .returning();

        return updatedPackage;
    }

    // Check if a package exists with specific conditions
    async findPackageWithConditions(conditions: Record<string, any>) {
        const whereConditions = Object.entries(conditions)
            .filter(([key]) => key in cateringCustomPackages)
            .map(([key, value]) => {
                const column = (cateringCustomPackages as Record<string, any>)[key];
                return eq(column, value);
            });

        const [existingPackage] = await this.db
            .select()
            .from(cateringCustomPackages)
            .where(and(...whereConditions))
            .limit(1);

        return existingPackage;
    }

}