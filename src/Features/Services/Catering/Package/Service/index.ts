// services/CateringPackageService.ts
import { DrizzleDB } from '../../../../../Config/db';
import { CateringPackageModel } from '../model';
import { 
  CateringPackage, 
  CateringPackageInput, 
  CateringPackageUpdateInput, 
  SearchCateringPackagesInput,
  AdminCateringPackageFilters,
  CateringPackageListResponse
} from '../Types';
type SearchResult = {
  packages: CateringPackage[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
};

export class CateringPackageService {
  private model: CateringPackageModel;

  constructor(db: DrizzleDB) {
    this.model = new CateringPackageModel(db);
  }

  async getCateringPackageById(id: string, vendorId: string): Promise<CateringPackage> {
    const cateringPackage = await this.model.findById(id);
    
    if (!cateringPackage) {
      throw new Error('Catering package not found');
    }

    if (cateringPackage.vendorId !== vendorId) {
      throw new Error('Unauthorized: You can only access your own catering packages');
    }

    return cateringPackage;
  }

  async getVendorCateringPackages(vendorId: string): Promise<CateringPackage[]> {
    return await this.model.findByVendorId(vendorId);
  }

  async searchCateringPackages(
    input: SearchCateringPackagesInput, 
    page: number = 1, 
    limit: number = 10
  ): Promise<SearchResult> {
    const conditions = this.model.buildSearchConditions(input);
    return await this.model.search(conditions, page, limit);
  }

  async createCateringPackage(input: CateringPackageInput, vendorId: string): Promise<CateringPackage> {
    const {
      packageName,
      serviceArea,
      description,
      imageUrl,
      price,
      minGuests,
      maxGuests,
      menuItems,
      dietaryOptions,
      amenities,
    } = input;

    // Validate business rules
    if (minGuests > maxGuests) {
      throw new Error('Minimum guests cannot be greater than maximum guests');
    }

    if (price <= 0) {
      throw new Error('Price must be greater than zero');
    }

    const now = new Date();
    
    const packageData = {
      vendorId,
      packageName,
      serviceArea,
      description,
      imageUrl,
      price, // Keep price as a number - the model will convert it to string
      minGuests,
      maxGuests,
      menuItems: menuItems || [],
      dietaryOptions: dietaryOptions || [],
      amenities: amenities || [],
      isAvailable: true,
      reviewCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    return await this.model.create(packageData);
  }

  async updateCateringPackage(
    id: string, 
    input: CateringPackageUpdateInput, 
    vendorId: string
  ): Promise<CateringPackage> {
    // Check if package exists and belongs to vendor
    const existingPackage = await this.model.findById(id);
    
    if (!existingPackage) {
      throw new Error('Catering package not found');
    }
    
    if (existingPackage.vendorId !== vendorId) {
      throw new Error('Unauthorized: You can only update your own catering packages');
    }

    // Validate business rules
    if (
      (input.minGuests !== undefined && input.maxGuests !== undefined && input.minGuests > input.maxGuests) ||
      (input.minGuests !== undefined && input.minGuests > existingPackage.maxGuests) ||
      (input.maxGuests !== undefined && existingPackage.minGuests > input.maxGuests)
    ) {
      throw new Error('Minimum guests cannot be greater than maximum guests');
    }

    if (input.price !== undefined && input.price <= 0) {
      throw new Error('Price must be greater than zero');
    }

    const { price, ...rest } = input;
    
    const updateData = {
      ...rest,
      ...(price !== undefined ? { price } : {}),
      updatedAt: new Date(),
    };

    return await this.model.update(id, updateData);
  }

  async deleteCateringPackage(id: string, vendorId: string): Promise<boolean> {
    // Check if package exists and belongs to vendor
    const existingPackage = await this.model.findById(id);
    
    if (!existingPackage) {
      throw new Error('Catering package not found');
    }
    
    if (existingPackage.vendorId !== vendorId) {
      throw new Error('Unauthorized: You can only delete your own catering packages');
    }

    return await this.model.delete(id);
  }

  async toggleCateringPackageAvailability(id: string, vendorId: string): Promise<CateringPackage> {
    // Check if package exists and belongs to vendor
    const existingPackage = await this.model.findById(id);
    
    if (!existingPackage) {
      throw new Error('Catering package not found');
    }
    
    if (existingPackage.vendorId !== vendorId) {
      throw new Error('Unauthorized: You can only update your own catering packages');
    }

    const updateData = {
      isAvailable: !existingPackage.isAvailable,
      updatedAt: new Date(),
    };

    return await this.model.update(id, updateData);
  }

  // Admin functionality - Get all catering packages with filters and pagination
  async getAllPackagesForAdmin(filters: AdminCateringPackageFilters = {}): Promise<CateringPackageListResponse> {
    // Input validation
    if (filters.minPrice !== undefined && filters.minPrice < 0) {
      throw new Error('Minimum price cannot be negative');
    }

    if (filters.maxPrice !== undefined && filters.maxPrice < 0) {
      throw new Error('Maximum price cannot be negative');
    }

    if (filters.minPrice !== undefined && filters.maxPrice !== undefined && filters.minPrice > filters.maxPrice) {
      throw new Error('Minimum price cannot be greater than maximum price');
    }

    if (filters.minGuests !== undefined && filters.minGuests < 0) {
      throw new Error('Minimum guests cannot be negative');
    }

    if (filters.maxGuests !== undefined && filters.maxGuests < 0) {
      throw new Error('Maximum guests cannot be negative');
    }

    if (filters.minGuests !== undefined && filters.maxGuests !== undefined && filters.minGuests > filters.maxGuests) {
      throw new Error('Minimum guests cannot be greater than maximum guests');
    }

    if (filters.page !== undefined && filters.page < 1) {
      throw new Error('Page number must be positive');
    }

    if (filters.limit !== undefined && (filters.limit < 1 || filters.limit > 100)) {
      throw new Error('Limit must be between 1 and 100');
    }

    return await this.model.getAllPackagesForAdmin(filters);
  }

  // Admin functionality - Get a specific package by ID (no ownership check)
  async getPackageByIdForAdmin(id: string): Promise<CateringPackage> {
    const cateringPackage = await this.model.findById(id);
    
    if (!cateringPackage) {
      throw new Error('Catering package not found');
    }

    return cateringPackage;
  }

  // Admin functionality - Update package availability
  async updatePackageAvailabilityByAdmin(id: string, isAvailable: boolean): Promise<CateringPackage> {
    // Check if package exists
    const existingPackage = await this.model.findById(id);
    
    if (!existingPackage) {
      throw new Error('Catering package not found');
    }

    return await this.model.updatePackageAvailabilityByAdmin(id, isAvailable);
  }

  // Admin functionality - Delete any package
  async deletePackageByAdmin(id: string): Promise<boolean> {
    // Check if package exists
    const existingPackage = await this.model.findById(id);
    
    if (!existingPackage) {
      throw new Error('Catering package not found');
    }

    return await this.model.deletePackageByAdmin(id);
  }
}