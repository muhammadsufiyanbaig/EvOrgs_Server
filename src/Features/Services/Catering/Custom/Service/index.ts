import { CustomPackageModel } from '../model';
import {
  CustomPackageStatus,
  CreateCustomPackageInput,
  QuoteCustomPackageInput,
  RespondToQuoteInput,
  CustomPackageSearchFilters,
  CustomPackageSearchResponse,
  CustomGraphQLError,
  AdminCustomPackageFilters
} from '../Types';

export class CustomPackageService {
  private model: CustomPackageModel;

  constructor(db: any) {
    this.model = new CustomPackageModel(db);
  }

  // User fetches their own custom packages
  async getUserCustomPackages(userId: string) {
    return await this.model.getUserCustomPackages(userId);
  }

  // Vendor fetches their custom packages
  async getVendorCustomPackages(vendorId: string) {
    return await this.model.getVendorCustomPackages(vendorId);
  }

  // Admin gets all custom packages with pagination and filters
  async getAllCustomPackagesForAdmin(filters: AdminCustomPackageFilters = {}) {
    const {
      status,
      vendorId,
      userId,
      minGuestCount,
      maxGuestCount,
      startDate,
      endDate,
      page = 1,
      limit = 10
    } = filters;

    if (filters.startDate) {
      filters.startDate = new Date(filters.startDate);
    }
    if (filters.endDate) {
      filters.endDate = new Date(filters.endDate);
    }
    
    return await this.model.getAllCustomPackagesForAdmin({
      status,
      vendorId,
      userId,
      minGuestCount,
      maxGuestCount,
      startDate,
      endDate,
      page,
      limit
    });
  }

  // Get a single custom package by ID and verify ownership
  async getCustomPackageById(packageId: string, currentUserId?: string, currentVendorId?: string) {
    const customPackage = await this.model.getCustomPackageById(packageId);
    
    if (!customPackage) {
      throw CustomGraphQLError.notFound('Package not found');
    }

    // Additional authorization check
    if (currentUserId && customPackage.userId !== currentUserId) {
      throw CustomGraphQLError.forbidden();
    }
    if (currentVendorId && customPackage.vendorId !== currentVendorId) {
      throw CustomGraphQLError.forbidden();
    }

    return customPackage;
  }

  // Search custom packages with various filters
  async searchCustomPackages(vendorId: string, filters?: CustomPackageSearchFilters): Promise<CustomPackageSearchResponse> {
    // Input validation
    if (filters?.minGuestCount && filters.minGuestCount < 0) {
      throw new CustomGraphQLError('Minimum guest count cannot be negative', {
        code: 'BAD_INPUT',
        details: 'Minimum guest count must be zero or greater'
      });
    }

    if (filters?.maxGuestCount && filters.maxGuestCount < 0) {
      throw new CustomGraphQLError('Maximum guest count cannot be negative', {
        code: 'BAD_INPUT',
        details: 'Maximum guest count must be zero or greater'
      });
    }

    if (filters?.minGuestCount && filters?.maxGuestCount && filters.minGuestCount > filters.maxGuestCount) {
      throw new CustomGraphQLError('Minimum guest count cannot be greater than maximum guest count', {
        code: 'BAD_INPUT',
        details: 'Invalid guest count range'
      });
    }

    if (filters?.minPrice && filters.minPrice < 0) {
      throw new CustomGraphQLError('Minimum price cannot be negative', {
        code: 'BAD_INPUT',
        details: 'Minimum price must be zero or greater'
      });
    }

    if (filters?.maxPrice && filters.maxPrice < 0) {
      throw new CustomGraphQLError('Maximum price cannot be negative', {
        code: 'BAD_INPUT',
        details: 'Maximum price must be zero or greater'
      });
    }

    if (filters?.minPrice && filters?.maxPrice && filters.minPrice > filters.maxPrice) {
      throw new CustomGraphQLError('Minimum price cannot be greater than maximum price', {
        code: 'BAD_INPUT',
        details: 'Invalid price range'
      });
    }

    if (filters?.startDate && filters?.endDate) {
      const startDate = new Date(filters.startDate);
      const endDate = new Date(filters.endDate);
      
      if (startDate > endDate) {
        throw new CustomGraphQLError('Start date cannot be after end date', {
          code: 'BAD_INPUT',
          details: 'Invalid date range'
        });
      }
    }

    if (filters?.page && filters.page < 1) {
      throw new CustomGraphQLError('Page number must be positive', {
        code: 'BAD_INPUT',
        details: 'Page number must be 1 or greater'
      });
    }

    if (filters?.limit && (filters.limit < 1 || filters.limit > 100)) {
      throw new CustomGraphQLError('Limit must be between 1 and 100', {
        code: 'BAD_INPUT',
        details: 'Limit must be between 1 and 100'
      });
    }

    return await this.model.searchCustomPackages(vendorId, filters);
  }

  // User creates a custom package request
  async createCustomPackageRequest(userId: string, input: CreateCustomPackageInput) {
    // Input validation
    if (input.guestCount <= 0) {
      throw new CustomGraphQLError('Guest count must be positive', {
        code: 'BAD_INPUT',
        details: 'Guest count must be greater than zero'
      });
    }

    const packageData = {
      vendorId: input.vendorId,
      userId: userId,
      orderDetails: input.orderDetails,
      guestCount: input.guestCount,
      eventDate: input.eventDate ? new Date(input.eventDate) : null,
      status: CustomPackageStatus.Requested,
      price: 0, // Initial price set to 0
    };

    return await this.model.createCustomPackage(packageData);
  }

  // Vendor quotes a custom package
  async quoteCustomPackage(vendorId: string, input: QuoteCustomPackageInput) {
    // Validate price
    if (input.price <= 0) {
      throw new CustomGraphQLError('Price must be positive', {
        code: 'BAD_INPUT',
        details: 'Price must be greater than zero'
      });
    }

    return await this.model.updateCustomPackage(input.packageId, {
      price: input.price,
      status: CustomPackageStatus.Quoted
    });
  }

  async respondToCustomPackageQuote(userId: string, input: RespondToQuoteInput) {
    // Ensure the package belongs to this user and is in 'Quoted' status
    const existingPackage = await this.model.findPackageWithConditions({
      id: input.packageId,
      userId: userId,
      status: CustomPackageStatus.Quoted
    });

    if (!existingPackage) {
      throw CustomGraphQLError.notFound('Package not found or not in quotable status');
    }

    return await this.model.updateCustomPackage(input.packageId, {
      status: input.response
    });
  }
}
