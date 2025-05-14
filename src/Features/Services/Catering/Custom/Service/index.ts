import { CustomPackageModel } from '../model';
import {
  CustomPackageStatus,
  CreateCustomPackageInput,
  QuoteCustomPackageInput,
  RespondToQuoteInput,
  CustomPackageSearchFilters,
  CustomGraphQLError
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
  async searchCustomPackages(vendorId: string, filters?: CustomPackageSearchFilters) {
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

    // Ensure the package belongs to this vendor and is in 'Requested' status
    const existingPackage = await this.model.findPackageWithConditions({
      id: input.packageId,
      vendorId: vendorId,
      status: CustomPackageStatus.Requested
    });

    if (!existingPackage) {
      throw CustomGraphQLError.notFound('Package not found or not in quotable status');
    }

    return await this.model.updateCustomPackage(input.packageId, {
      price: input.price,
      status: CustomPackageStatus.Quoted
    });
  }

  // User responds to a vendor's quote
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