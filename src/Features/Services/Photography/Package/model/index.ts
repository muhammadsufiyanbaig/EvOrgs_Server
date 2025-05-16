// src/Features/Photography/Model.ts

import { eq, and, ilike, sql, gte } from 'drizzle-orm';
import { photographyPackages } from '../../../../../Schema';
import { SearchPhotographyPackagesInput } from '../Types';

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
}