import { v4 as uuidv4 } from 'uuid';
import { VenueModel } from '../model';
import { VenueInput, VenueUpdateInput } from '../Types';

export class VenueService {
    private venueModel: VenueModel;

    constructor(db: any) {
        this.venueModel = new VenueModel(db);
    }

    // Get all venues
    async getAllVenues() {
        return await this.venueModel.findAll();
    }

    // Get venues for a specific vendor
    async getVenuesByVendorId(vendorId: string) {
        return await this.venueModel.findByVendorId(vendorId);
    }

    // Get single venue by ID
    async getVenueById(id: string) {
        return await this.venueModel.findById(id);
    }

    // Create a new venue
    async createVenue(vendorId: string, venueData: VenueInput) {
        const newVenue = {
            id: uuidv4(),
            vendorId,
            ...venueData,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        return await this.venueModel.create(newVenue);
    }

    // Update an existing venue
    async updateVenue(vendorId: string, updateData: VenueUpdateInput) {
        const { id, ...data } = updateData;

        // First, verify the venue belongs to this vendor
        const venueToUpdate = await this.venueModel.findById(id);
        if (!venueToUpdate || venueToUpdate.vendorId !== vendorId) {
            throw new Error('Venue not found or you do not have permission to update it');
        }

        return await this.venueModel.update(id, { ...data, updatedAt: new Date() }, vendorId);
    }

    // Delete a venue
    async deleteVenue(vendorId: string, id: string): Promise<boolean> {
        // First, verify the venue belongs to this vendor
        const venueToDelete = await this.venueModel.findById(id);
        if (!venueToDelete || venueToDelete.vendorId !== vendorId) {
            throw new Error('Venue not found or you do not have permission to delete it');
        }

        return await this.venueModel.delete(id, vendorId);
    }

    // Admin can get all venues regardless of vendor
    async getAllVenuesForAdmin() {
        return await this.venueModel.findAll();
    }

    // Admin can update any venue
    async adminUpdateVenue(updateData: VenueUpdateInput) {
        const { id, ...data } = updateData;
        return await this.venueModel.update(id, { ...data, updatedAt: new Date() });
    }

    // Admin can delete any venue
    async adminDeleteVenue(id: string): Promise<boolean> {
        return await this.venueModel.delete(id);
    }

    // Toggle venue availability
    async toggleVenueAvailability(vendorId: string, id: string, isAvailable: boolean) {
        // First, verify the venue belongs to this vendor
        const venueToUpdate = await this.venueModel.findById(id);
        if (!venueToUpdate || venueToUpdate.vendorId !== vendorId) {
            throw new Error('Venue not found or you do not have permission to update it');
        }

        return await this.venueModel.update(id, { isAvailable, updatedAt: new Date() }, vendorId);
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
        // We'll add isAvailable: true filter to ensure only available venues are returned
        return await this.venueModel.findWithFilters({
            tags: filters.tags,
            minCapacity: filters.minCapacity,
            maxCapacity: filters.maxCapacity,
            location: filters.location,
            isAvailable: true
        });
    }
}