import { eq, and, desc, gte, lte, inArray, count, isNull, like } from 'drizzle-orm';
import { farmhouses } from '../../../../Schema';
import { FarmhouseFilters } from '../Types';
import { DrizzleDB } from '../../../../Config/db';

export class FarmhouseModel {
  private db: DrizzleDB;

  constructor(db: DrizzleDB) {
    this.db = db;
  }

  async getFarmhouseById(id: string) {
    const farmhouse = await this.db.select()
      .from(farmhouses)
      .where(eq(farmhouses.id, id))
      .limit(1);
    
    return farmhouse.length > 0 ? farmhouse[0] : null;
  }

  async getVendorFarmhouses(vendorId: string, isAvailable?: boolean) {
    let conditions = [eq(farmhouses.vendorId, vendorId)];
    
    if (isAvailable !== undefined) {
      conditions.push(eq(farmhouses.isAvailable, isAvailable));
    }
    
    const vendorFarmhouses = await this.db.select()
      .from(farmhouses)
      .where(and(...conditions))
      .orderBy(desc(farmhouses.createdAt));
    
    return vendorFarmhouses;
  }

  // Get all farmhouses (public - only available ones)
  async getAllFarmhouses() {
    const allFarmhouses = await this.db.select()
      .from(farmhouses)
      .where(eq(farmhouses.isAvailable, true))
      .orderBy(desc(farmhouses.createdAt));
    
    return allFarmhouses;
  }

  // Get all farmhouses for admin (admin only - all farmhouses regardless of availability)
  async getAllFarmhousesForAdmin() {
    const allFarmhouses = await this.db.select()
      .from(farmhouses)
      .orderBy(desc(farmhouses.createdAt));
    
    return allFarmhouses;
  }


  async searchFarmhouses(filters: FarmhouseFilters, page: number = 1, limit: number = 10) {
    const conditions = [];
  
    if (filters.id) {
      conditions.push(eq(farmhouses.id, filters.id));
    }
  
    if (filters.isAvailable !== undefined) {
      conditions.push(eq(farmhouses.isAvailable, filters.isAvailable));
    }
  
    if (filters.minPrice !== undefined) {
      conditions.push(gte(farmhouses.perNightPrice, filters.minPrice.toString()));
    }
  
    if (filters.maxPrice !== undefined) {
      conditions.push(lte(farmhouses.perNightPrice, filters.maxPrice.toString()));
    }
  
    if (filters.minNights !== undefined) {
      conditions.push(gte(farmhouses.minNights, filters.minNights));
    }
  
    if (filters.maxNights !== undefined) {
      conditions.push(
        filters.maxNights === null
          ? isNull(farmhouses.maxNights)
          : lte(farmhouses.maxNights, filters.maxNights)
      );
    }
  
    if (filters.maxGuests !== undefined) {
      conditions.push(gte(farmhouses.maxGuests, filters.maxGuests));
    }
  
    if (filters.amenities && filters.amenities.length > 0) {
      // Assuming `farmhouses.amenities` is an array or a JSON column, you might need `arrayContains` or `like`
      for (const amenity of filters.amenities) {
        conditions.push(like(farmhouses.amenities, `%${amenity}%`)); // Adjust based on DB type
      }
    }
  
    const offset = (page - 1) * limit;
  
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
  
    const searchResults = await this.db
      .select()
      .from(farmhouses)
      .where(whereClause)
      .limit(limit)
      .offset(offset);
  
    const totalCountResult = await this.db
      .select({ count: count() })
      .from(farmhouses)
      .where(whereClause);
  
    const totalCount = Number(totalCountResult[0]?.count ?? 0);
  
    return {
      farmhouses: searchResults,
      totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit)
    };
  }
  
  async createFarmhouse(farmhouseData: any) {
    const newFarmhouse = await this.db.insert(farmhouses)
      .values(farmhouseData)
      .returning();
    
    return newFarmhouse[0];
  }

  async updateFarmhouse(id: string, updateData: any) {
    const updatedFarmhouse = await this.db.update(farmhouses)
      .set(updateData)
      .where(eq(farmhouses.id, id))
      .returning();
    
    return updatedFarmhouse[0];
  }

  async deleteFarmhouse(id: string) {
    const deletedFarmhouse = await this.db.delete(farmhouses)
      .where(eq(farmhouses.id, id))
      .returning();
    
    return deletedFarmhouse[0];
  }

  async toggleFarmhouseAvailability(id: string, isAvailable: boolean) {
    const updatedFarmhouse = await this.db.update(farmhouses)
      .set({ 
        isAvailable,
        updatedAt: new Date()
      })
      .where(eq(farmhouses.id, id))
      .returning();
    
    return updatedFarmhouse[0];
  }
}