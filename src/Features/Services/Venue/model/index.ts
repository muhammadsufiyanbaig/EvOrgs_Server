// VenueModel.ts
import { eq, and, gte, lte, like, arrayOverlaps } from 'drizzle-orm';
import { DrizzleDB } from '../../../../Config/db';
import { venues } from '../../../../Schema';
import { NewVenue } from '../Types';

export class VenueModel {
    private db: DrizzleDB;

    constructor(db: DrizzleDB) {
        this.db = db;
    }

    async findAll() {
        return await this.db.select().from(venues);
    }

    async findById(id: string) {
        const results = await this.db.select().from(venues).where(eq(venues.id, id));
        return results.length > 0 ? results[0] : null;
    }

    async findByVendorId(vendorId: string) {
        return await this.db.select().from(venues).where(eq(venues.vendorId, vendorId));
    }

    async create(venue: NewVenue) {
        const result = await this.db.insert(venues).values(venue).returning();
        return result[0];
    }

    async update(id: string, data: Partial<NewVenue>, vendorId?: string) {
        let whereClause;
        
        if (vendorId) {
            whereClause = and(eq(venues.id, id), eq(venues.vendorId, vendorId));
        } else {
            whereClause = eq(venues.id, id);
        }
        
        const result = await this.db.update(venues)
            .set(data)
            .where(whereClause)
            .returning();
            
        return result[0];
    }

    async delete(id: string, vendorId?: string) {
        const whereClause = vendorId 
            ? and(eq(venues.id, id), eq(venues.vendorId, vendorId))
            : eq(venues.id, id);
            
        const result = await this.db.delete(venues)
            .where(whereClause)
            .returning();
            
        return result.length > 0;
    }

    async findWithFilters(filters: {
        tags?: string[];
        minCapacity?: number;
        maxCapacity?: number;
        location?: string;
        isAvailable?: boolean;
    }) {
        const conditions = [];
        
        if (filters.tags && filters.tags.length > 0) {
            conditions.push(arrayOverlaps(venues.tags, filters.tags));
        }
        
        if (filters.minCapacity !== undefined) {
            conditions.push(gte(venues.minPersonLimit, filters.minCapacity));
        }
        
        if (filters.maxCapacity !== undefined) {
            conditions.push(lte(venues.maxPersonLimit, filters.maxCapacity));
        }
        
        if (filters.location) {
            conditions.push(like(venues.location, `%${filters.location}%`));
        }
        
        if (filters.isAvailable !== undefined) {
            conditions.push(eq(venues.isAvailable, filters.isAvailable));
        }
        
        if (conditions.length > 0) {
            return await this.db.select().from(venues).where(and(...conditions));
        }
        
        return await this.db.select().from(venues);
    }
}