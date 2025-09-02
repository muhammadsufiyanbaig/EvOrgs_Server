// src/Features/Photography/Model.ts

import { eq, and, ilike, sql, gte, lte, desc, asc, count } from 'drizzle-orm';
import { photographyPackages, vendors } from '../../../../../Schema';
import { SearchPhotographyPackagesInput, AdminPackageFilters, PackageStatsResponse } from '../Types';

export class PhotographyModel {
  constructor(private db: any) {}

  /**
   * Get a single photography package by ID
   */
  async getPackageById(id: string) {
    const result = await this.db.select()
      .from(photographyPackages)
      .where(eq(photographyPackages.id, id))
      .limit(1);
    
    return result.length > 0 ? result[0] : null;
  }

  /**
   * Get all photography packages for a vendor
   */
  async getVendorPackages(vendorId: string) {
    const result = await this.db.select()
      .from(photographyPackages)
      .where(eq(photographyPackages.vendorId, vendorId));
    
    return result;
  }

  /**
   * Search photography packages by criteria
   */
  async searchPackages(input: SearchPhotographyPackagesInput) {
    const { packageName, amenities, serviceArea, photographerCount } = input;
    
    // Build conditions first
    const conditions = [];
    
    if (packageName) {
      conditions.push(ilike(photographyPackages.packageName, `%${packageName}%`));
    }
    
    if (amenities && amenities.length > 0) {
      // Use raw SQL for PostgreSQL array operations
      conditions.push(sql`${photographyPackages.amenities} && ${amenities}::text[]`);
    }
    
    if (serviceArea && serviceArea.length > 0) {
      conditions.push(sql`${photographyPackages.serviceArea} && ${serviceArea}::text[]`);
    }
    
    if (photographerCount) {
      conditions.push(gte(photographyPackages.photographerCount, photographerCount));
    }
    
    // Apply all conditions at once
    const query = conditions.length > 0
      ? await this.db.select().from(photographyPackages).where(and(...conditions))
      : await this.db.select().from(photographyPackages);
    
    return query;
  }

  /**
   * Check if package exists and belongs to vendor
   */
  async checkVendorPackageOwnership(id: string, vendorId: string) {
    const result = await this.db.select()
      .from(photographyPackages)
      .where(and(
        eq(photographyPackages.id, id),
        eq(photographyPackages.vendorId, vendorId)
      ))
      .limit(1);
    
    return result.length > 0 ? result[0] : null;
  }

  /**
   * Create a new photography package
   */
  async createPackage(data: any) {
    const result = await this.db.insert(photographyPackages)
      .values(data)
      .returning();
    
    return result[0];
  }

  /**
   * Update an existing photography package
   */
  async updatePackage(id: string, data: any) {
    const result = await this.db.update(photographyPackages)
      .set(data)
      .where(eq(photographyPackages.id, id))
      .returning();
    
    return result[0];
  }

  /**
   * Delete a photography package
   */
  async deletePackage(id: string) {
    await this.db.delete(photographyPackages)
      .where(eq(photographyPackages.id, id));
    
    return true;
  }

  /**
   * Admin: Get all packages with advanced filtering and pagination
   */
  async getAllPackagesForAdmin(filters: AdminPackageFilters) {
    const {
      vendorId,
      packageName,
      serviceArea,
      amenities,
      isAvailable,
      minPrice,
      maxPrice,
      minDuration,
      maxDuration,
      minPhotographerCount,
      maxPhotographerCount,
      searchTerm,
      page = 1,
      limit = 20,
      sortBy = 'created_desc'
    } = filters;

    // Build conditions
    const conditions = [];

    if (vendorId) {
      conditions.push(eq(photographyPackages.vendorId, vendorId));
    }

    if (packageName) {
      conditions.push(ilike(photographyPackages.packageName, `%${packageName}%`));
    }

    if (serviceArea && serviceArea.length > 0) {
      conditions.push(sql`${photographyPackages.serviceArea} && ${serviceArea}::text[]`);
    }

    if (amenities && amenities.length > 0) {
      conditions.push(sql`${photographyPackages.amenities} && ${amenities}::text[]`);
    }

    if (isAvailable !== undefined) {
      conditions.push(eq(photographyPackages.isAvailable, isAvailable));
    }

    if (minPrice !== undefined) {
      conditions.push(gte(photographyPackages.price, minPrice.toString()));
    }

    if (maxPrice !== undefined) {
      conditions.push(lte(photographyPackages.price, maxPrice.toString()));
    }

    if (minDuration !== undefined) {
      conditions.push(gte(photographyPackages.duration, minDuration));
    }

    if (maxDuration !== undefined) {
      conditions.push(lte(photographyPackages.duration, maxDuration));
    }

    if (minPhotographerCount !== undefined) {
      conditions.push(gte(photographyPackages.photographerCount, minPhotographerCount));
    }

    if (maxPhotographerCount !== undefined) {
      conditions.push(lte(photographyPackages.photographerCount, maxPhotographerCount));
    }

    if (searchTerm) {
      conditions.push(
        sql`(${ilike(photographyPackages.packageName, `%${searchTerm}%`)} OR 
            ${ilike(photographyPackages.description, `%${searchTerm}%`)})`
      );
    }

    // Build sort order
    const getSortOrder = () => {
      switch (sortBy) {
        case 'created_asc':
          return asc(photographyPackages.createdAt);
        case 'created_desc':
          return desc(photographyPackages.createdAt);
        case 'price_asc':
          return asc(photographyPackages.price);
        case 'price_desc':
          return desc(photographyPackages.price);
        case 'rating_asc':
          return asc(photographyPackages.rating);
        case 'rating_desc':
          return desc(photographyPackages.rating);
        case 'duration_asc':
          return asc(photographyPackages.duration);
        case 'duration_desc':
          return desc(photographyPackages.duration);
        case 'name_asc':
          return asc(photographyPackages.packageName);
        case 'name_desc':
          return desc(photographyPackages.packageName);
        default:
          return desc(photographyPackages.createdAt);
      }
    };

    // Calculate offset
    const offset = (page - 1) * limit;

    // Execute queries
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get packages with vendor info
    const packagesQuery = this.db
      .select({
        id: photographyPackages.id,
        vendorId: photographyPackages.vendorId,
        packageName: photographyPackages.packageName,
        serviceArea: photographyPackages.serviceArea,
        description: photographyPackages.description,
        imageUrl: photographyPackages.imageUrl,
        price: photographyPackages.price,
        duration: photographyPackages.duration,
        photographerCount: photographyPackages.photographerCount,
        deliverables: photographyPackages.deliverables,
        amenities: photographyPackages.amenities,
        isAvailable: photographyPackages.isAvailable,
        rating: photographyPackages.rating,
        reviewCount: photographyPackages.reviewCount,
        createdAt: photographyPackages.createdAt,
        updatedAt: photographyPackages.updatedAt,
        // Vendor info
        vendorName: vendors.vendorName,
        vendorEmail: vendors.vendorEmail,
        vendorPhone: vendors.vendorPhone
      })
      .from(photographyPackages)
      .leftJoin(vendors, eq(photographyPackages.vendorId, vendors.id))
      .where(whereClause)
      .orderBy(getSortOrder())
      .limit(limit)
      .offset(offset);

    // Get total count
    const countQuery = this.db
      .select({ count: count() })
      .from(photographyPackages)
      .where(whereClause);

    const [packages, [{ count: totalCount }]] = await Promise.all([
      packagesQuery,
      countQuery
    ]);

    return {
      packages: packages.map((pkg: any) => ({
        ...pkg,
        price: parseFloat(pkg.price as string),
        rating: pkg.rating ? parseFloat(pkg.rating as string) : null,
        vendor: pkg.vendorName ? {
          id: pkg.vendorId,
          vendorName: pkg.vendorName,
          vendorEmail: pkg.vendorEmail,
          vendorPhone: pkg.vendorPhone
        } : null
      })),
      total: totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit),
      hasNextPage: page < Math.ceil(totalCount / limit),
      hasPreviousPage: page > 1
    };
  }

  /**
   * Admin: Get package statistics
   */
  async getPackageStatistics(): Promise<PackageStatsResponse> {
    const statsQuery = this.db
      .select({
        totalPackages: count(),
        availablePackages: count(sql`CASE WHEN ${photographyPackages.isAvailable} = true THEN 1 END`),
        unavailablePackages: count(sql`CASE WHEN ${photographyPackages.isAvailable} = false THEN 1 END`),
        avgPrice: sql<number>`AVG(CAST(${photographyPackages.price} AS NUMERIC))`,
        avgRating: sql<number>`AVG(CAST(${photographyPackages.rating} AS NUMERIC))`,
      })
      .from(photographyPackages);

    const vendorCountQuery = this.db
      .select({
        totalVendors: count(sql`DISTINCT ${photographyPackages.vendorId}`)
      })
      .from(photographyPackages);

    const [stats, vendorCount] = await Promise.all([
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
  }

  /**
   * Admin: Get package by ID with vendor details
   */
  async getPackageWithVendorById(id: string) {
    const result = await this.db
      .select({
        id: photographyPackages.id,
        vendorId: photographyPackages.vendorId,
        packageName: photographyPackages.packageName,
        serviceArea: photographyPackages.serviceArea,
        description: photographyPackages.description,
        imageUrl: photographyPackages.imageUrl,
        price: photographyPackages.price,
        duration: photographyPackages.duration,
        photographerCount: photographyPackages.photographerCount,
        deliverables: photographyPackages.deliverables,
        amenities: photographyPackages.amenities,
        isAvailable: photographyPackages.isAvailable,
        rating: photographyPackages.rating,
        reviewCount: photographyPackages.reviewCount,
        createdAt: photographyPackages.createdAt,
        updatedAt: photographyPackages.updatedAt,
        // Vendor info
        vendorName: vendors.vendorName,
        vendorEmail: vendors.vendorEmail,
        vendorPhone: vendors.vendorPhone,
        vendorAddress: vendors.vendorAddress
      })
      .from(photographyPackages)
      .leftJoin(vendors, eq(photographyPackages.vendorId, vendors.id))
      .where(eq(photographyPackages.id, id))
      .limit(1);

    if (result.length === 0) return null;

    const pkg = result[0];
    return {
      ...pkg,
      price: parseFloat(pkg.price as string),
      rating: pkg.rating ? parseFloat(pkg.rating as string) : null,
      vendor: pkg.vendorName ? {
        id: pkg.vendorId,
        vendorName: pkg.vendorName,
        vendorEmail: pkg.vendorEmail,
        vendorPhone: pkg.vendorPhone,
        vendorAddress: pkg.vendorAddress
      } : null
    };
  }

  /**
   * Admin: Update package status
   */
  async updatePackageStatus(id: string, isAvailable: boolean) {
    const result = await this.db.update(photographyPackages)
      .set({ 
        isAvailable,
        updatedAt: new Date()
      })
      .where(eq(photographyPackages.id, id))
      .returning();

    return result[0];
  }

  /**
   * Admin: Delete package by ID
   */
  async adminDeletePackage(id: string) {
    await this.db.delete(photographyPackages)
      .where(eq(photographyPackages.id, id));
    return true;
  }
}