
// SERVICE
// Features/Farmhouse/Service/FarmhouseService.ts
import { v4 as uuidv4 } from 'uuid';
import { FarmhouseModel } from '../model';
import { 
  CreateFarmhouseInput, 
  UpdateFarmhouseInput, 
  DeleteFarmhouseInput,
  ToggleFarmhouseInput,
  FarmhouseFilters,
  SearchFarmhouseInput
} from '../Types';
import { DrizzleDB } from '../../../../Config/db';

export class FarmhouseService {
  private model: FarmhouseModel;

  constructor(db: DrizzleDB) {
    this.model = new FarmhouseModel(db);
  }

  // Get all farmhouses (public - only available ones)
  async getAllFarmhouses() {
    return this.model.getAllFarmhouses();
  }

  // Get all farmhouses for admin (admin only - all farmhouses)
  async getAllFarmhousesForAdmin() {
    return this.model.getAllFarmhousesForAdmin();
  }
  async getFarmhouseById(id: string) {
    const farmhouse = await this.model.getFarmhouseById(id);
    
    if (!farmhouse) {
      throw new Error('Farmhouse not found');
    }
    
    return farmhouse;
  }

  async getVendorFarmhouses(vendorId: string, isAvailable?: boolean) {
    return this.model.getVendorFarmhouses(vendorId, isAvailable);
  }

  async searchFarmhouses(input: SearchFarmhouseInput) {
    const { filters, page = 1, limit = 10 } = input;
    return this.model.searchFarmhouses(filters, page, limit);
  }

  async createFarmhouse(input: CreateFarmhouseInput, vendorId: string) {
    // Validate required fields
    if (!input.name || !input.location || !input.description || !input.imageUrl || !input.perNightPrice || !input.maxGuests) {
      throw new Error('Missing required fields: name, location, description, imageUrl, perNightPrice, or maxGuests');
    }
    
    // Generate a new UUID for the farmhouse
    const farmhouseId = uuidv4();
    
    // Prepare farmhouse data
    const farmhouseData = {
      id: farmhouseId,
      vendorId,
      name: input.name,
      location: input.location,
      description: input.description,
      imageUrl: Array.isArray(input.imageUrl) ? input.imageUrl : [input.imageUrl], // Ensure imageUrl is an array
      perNightPrice: String(input.perNightPrice), // Convert number to string for decimal field
      minNights: input.minNights || 1,
      maxNights: input.maxNights !== undefined ? input.maxNights : null,
      maxGuests: input.maxGuests,
      amenities: input.amenities || [], // Default to an empty array if not provided
      isAvailable: input.isAvailable ?? true, // Default to true if not provided
      reviewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    return this.model.createFarmhouse(farmhouseData);
  }

  async updateFarmhouse(input: UpdateFarmhouseInput, vendorId: string) {
    // Verify farmhouse exists and belongs to vendor
    const farmhouse = await this.model.getFarmhouseById(input.id);
    
    if (!farmhouse) {
      throw new Error('Farmhouse not found');
    }
    
    if (farmhouse.vendorId !== vendorId) {
      throw new Error('You do not have permission to update this farmhouse');
    }
    
    // Extract fields from input
    const { id, imageUrl, ...otherFields } = input;
    
    // Prepare update data with proper handling for imageUrl
    const updateData = {
      ...otherFields,
      updatedAt: new Date(),
      ...(imageUrl !== undefined && { 
        imageUrl: imageUrl === null ? [] : Array.isArray(imageUrl) ? imageUrl : [imageUrl] 
      }),
      ...(input.perNightPrice !== undefined && { 
        perNightPrice: String(input.perNightPrice) // Convert to string for decimal field
      }),
    };
    
    return this.model.updateFarmhouse(id, updateData);
  }

  async deleteFarmhouse(input: DeleteFarmhouseInput, vendorId: string) {
    // Verify farmhouse exists and belongs to vendor
    const farmhouse = await this.model.getFarmhouseById(input.id);
    
    if (!farmhouse) {
      throw new Error('Farmhouse not found');
    }
    
    if (farmhouse.vendorId !== vendorId) {
      throw new Error('You do not have permission to delete this farmhouse');
    }
    
    // Delete farmhouse
    const deletedFarmhouse = await this.model.deleteFarmhouse(input.id);
    
    return {
      id: deletedFarmhouse.id,
      success: true,
      message: 'Farmhouse deleted successfully'
    };
  }

  async toggleFarmhouseAvailability(input: ToggleFarmhouseInput, vendorId: string) {
    // Verify farmhouse exists and belongs to vendor
    const farmhouse = await this.model.getFarmhouseById(input.id);
    
    if (!farmhouse) {
      throw new Error('Farmhouse not found');
    }
    
    if (farmhouse.vendorId !== vendorId) {
      throw new Error('You do not have permission to update this farmhouse');
    }
    
    // Toggle availability
    const updatedFarmhouse = await this.model.toggleFarmhouseAvailability(input.id, input.isAvailable);
    
    return updatedFarmhouse;
  }
}