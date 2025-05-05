
import { eq, and, gte, lte, like, arrayOverlaps } from 'drizzle-orm'; // Ensure arrayOverlaps is imported
import { v4 as uuidv4 } from 'uuid';
import { DrizzleDB } from '../../../../Config/db';
import { venues } from '../../../../Schema';
import { NewVenue, VenueInput, VenueUpdateInput } from '../Types';

export class VenueService {
    private db: DrizzleDB

    constructor(db: DrizzleDB) {
        this.db = db;
    }

    // Get all venues
    async getAllVenues() {
        return await this.db.select().from(venues);
    }

    // Get venues for a specific vendor
    async getVenuesByVendorId(vendorId: string) {
        return await this.db.select().from(venues).where(eq(venues.vendorId, vendorId));
    }

    // Get single venue by ID
    async getVenueById(id: string) {
        const results = await this.db.select().from(venues).where(eq(venues.id, id));
        return results.length > 0 ? results[0] : null;
    }

    // Create a new venue
    async createVenue(vendorId: string, venueData: VenueInput): Promise<any> {
        const newVenue: NewVenue = {
            id: uuidv4(),
            vendorId,
            ...venueData,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await this.db.insert(venues).values(newVenue).returning();
        return result[0];
    }

    // Update an existing venue
    async updateVenue(vendorId: string, updateData: VenueUpdateInput) {
        const { id, ...data } = updateData;

        // First, verify the venue belongs to this vendor
        const venueToUpdate = await this.getVenueById(id);
        if (!venueToUpdate || venueToUpdate.vendorId !== vendorId) {
            throw new Error('Venue not found or you do not have permission to update it');
        }

        const result = await this.db
            .update(venues)
            .set({ ...data, updatedAt: new Date() })
            .where(and(eq(venues.id, id), eq(venues.vendorId, vendorId)))
            .returning();

        return result[0];
    }

    // Delete a venue
    async deleteVenue(vendorId: string, id: string): Promise<boolean> {
        // First, verify the venue belongs to this vendor
        const venueToDelete = await this.getVenueById(id);
        if (!venueToDelete || venueToDelete.vendorId !== vendorId) {
            throw new Error('Venue not found or you do not have permission to delete it');
        }

        const result = await this.db
            .delete(venues)
            .where(and(eq(venues.id, id), eq(venues.vendorId, vendorId)))
            .returning();

        return result.length > 0;
    }

    // Admin can get all venues regardless of vendor
    async getAllVenuesForAdmin() {
        return await this.db.select().from(venues);
    }

    // Admin can update any venue
    async adminUpdateVenue(updateData: VenueUpdateInput) {
        const { id, ...data } = updateData;

        const result = await this.db
            .update(venues)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(venues.id, id))
            .returning();

        return result[0];
    }

    // Admin can delete any venue
    async adminDeleteVenue(id: string): Promise<boolean> {
        const result = await this.db
            .delete(venues)
            .where(eq(venues.id, id))
            .returning();

        return result.length > 0;
    }

    // Toggle venue availability
    async toggleVenueAvailability(vendorId: string, id: string, isAvailable: boolean) {
        // First, verify the venue belongs to this vendor
        const venueToUpdate = await this.getVenueById(id);
        if (!venueToUpdate || venueToUpdate.vendorId !== vendorId) {
            throw new Error('Venue not found or you do not have permission to update it');
        }

        const result = await this.db
            .update(venues)
            .set({ isAvailable, updatedAt: new Date() })
            .where(and(eq(venues.id, id), eq(venues.vendorId, vendorId)))
            .returning();

        return result[0];
    }

    // Search venues with filters
    async searchVenues(filters: {
        tags?: string[];
        minPrice?: string;
        maxPrice?: string;
        minCapacity?: number;
        maxCapacity?: number;
        location?: string;
    }) {
        // Start with a base query
        let query = this.db.select().from(venues);
        const conditions = [];

        // Add filters
        const { tags, minCapacity, maxCapacity, location } = filters;

        // Filter by tags if provided
        if (tags && tags.length > 0) {
            // Using arrayOverlaps to check if any of the provided tags
            // are in the venue's tags array
            conditions.push(arrayOverlaps(venues.tags, tags));
        }

        // Filter by capacity
        if (minCapacity !== undefined) {
            conditions.push(gte(venues.minPersonLimit, minCapacity));
        }

        if (maxCapacity !== undefined) {
            conditions.push(lte(venues.maxPersonLimit, maxCapacity));
        }

        // Filter by location (simple 'contains' for demo)
        if (location) {
            conditions.push(like(venues.location, `%${location}%`));
        }

        // Only show available venues
        conditions.push(eq(venues.isAvailable, true));

        // Apply all conditions at once
        if (conditions.length > 0) {
            return await query.where(and(...conditions));
        }

        return await query;
    }
}
