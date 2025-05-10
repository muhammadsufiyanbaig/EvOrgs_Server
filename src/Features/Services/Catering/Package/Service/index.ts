// services/CateringPackageService.ts
import { DrizzleDB } from '../../../../../Config/db';
import { CateringPackageModel } from '../model';
import { 
  CateringPackage, 
  CateringPackageInput, 
  CateringPackageUpdateInput, 
  SearchCateringPackagesInput 
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
      price: price.toString(), // Ensure price is stored as string
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
      ...(price !== undefined ? { price: price.toString() } : {}),
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
}