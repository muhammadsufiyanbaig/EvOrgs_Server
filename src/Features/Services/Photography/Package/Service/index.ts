// src/Features/Photography/Service.ts

import { GraphQLError } from 'graphql';
import { PhotographyModel } from '../model';
import { CreatePhotographyPackageInput, UpdatePhotographyPackageInput, SearchPhotographyPackagesInput, InputValidator, AdminPackageFilters } from '../Types';
import { DrizzleDB } from '../../../../../Config/db';

export class PhotographyService {
  private model: PhotographyModel;

  constructor(db: DrizzleDB) {
    this.model = new PhotographyModel(db);
  }

  /**
   * Get a photography package by ID
   */
  async getPackageById(id: string) {
    const photographyPackage = await this.model.getPackageById(id);
    
    if (!photographyPackage) {
      throw new GraphQLError('Photography package not found', {
        extensions: { code: 'NOT_FOUND' }
      });
    }
    
    return photographyPackage;
  }

  /**
   * Get all photography packages for a vendor
   */
  async getVendorPackages(vendor: any) {
    if (!vendor) {
      throw new GraphQLError('Not authorized. Vendor login required', {
        extensions: { code: 'UNAUTHORIZED' }
      });
    }
    
    return this.model.getVendorPackages(vendor.id);
  }

  /**
   * Search photography packages by criteria
   */
  async searchPackages(input: SearchPhotographyPackagesInput) {
    return this.model.searchPackages(input);
  }

  /**
   * Create a new photography package
   */
  async createPackage(input: CreatePhotographyPackageInput, vendor: any) {
    if (!vendor) {
      throw new GraphQLError('Not authorized. Vendor login required', {
        extensions: { code: 'UNAUTHORIZED' }
      });
    }
    
    // Validate input
    const validation = InputValidator.validateCreatePackageInput(input);
    if (!validation.isValid) {
      throw new GraphQLError('Invalid input', {
        extensions: { code: 'BAD_USER_INPUT', validationErrors: validation.errors }
      });
    }
    
    // ✅ FIX: Generate UUID for the id field (database doesn't auto-generate)
    const { randomUUID } = require('crypto');
    
    // Create package with default values
    const newPackage = {
      ...input,
      vendorId: vendor.id,
      id: randomUUID(), // Generate UUID instead of undefined
      isAvailable: input.isAvailable ?? true, // Set default if not provided
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    return this.model.createPackage(newPackage);
  }

  /**
   * Update an existing photography package
   */
  async updatePackage(id: string, input: UpdatePhotographyPackageInput, vendor: any) {
    if (!vendor) {
      throw new GraphQLError('Not authorized. Vendor login required', {
        extensions: { code: 'UNAUTHORIZED' }
      });
    }
    
    // Validate that the package exists and belongs to the vendor
    const existingPackage = await this.model.checkVendorPackageOwnership(id, vendor.id);
    
    if (!existingPackage) {
      throw new GraphQLError('Photography package not found or you do not have permission to update it', {
        extensions: { code: 'NOT_FOUND' }
      });
    }
    
    // Validate input
    const validation = InputValidator.validateUpdatePackageInput(input);
    if (!validation.isValid) {
      throw new GraphQLError('Invalid input', {
        extensions: { code: 'BAD_USER_INPUT', validationErrors: validation.errors }
      });
    }
    
    // Update the package
    const { price, ...restInput } = input;
    const updatedPackage = {
      ...restInput,
      ...(price !== undefined ? { price: price.toString() } : {}),
      updatedAt: new Date()
    };
    
    return this.model.updatePackage(id, updatedPackage);
  }

  /**
   * Delete a photography package
   */
  async deletePackage(id: string, vendor: any) {
    if (!vendor) {
      throw new GraphQLError('Not authorized. Vendor login required', {
        extensions: { code: 'UNAUTHORIZED' }
      });
    }
    
    // Validate that the package exists and belongs to the vendor
    const existingPackage = await this.model.checkVendorPackageOwnership(id, vendor.id);
    
    if (!existingPackage) {
      throw new GraphQLError('Photography package not found or you do not have permission to delete it', {
        extensions: { code: 'NOT_FOUND' }
      });
    }
    
    await this.model.deletePackage(id);
    
    return {
      success: true,
      message: 'Photography package deleted successfully'
    };
  }

  /**
   * Toggle photography package availability
   */
  async togglePackageAvailability(id: string, vendor: any) {
    if (!vendor) {
      throw new GraphQLError('Not authorized. Vendor login required', {
        extensions: { code: 'UNAUTHORIZED' }
      });
    }
    
    // Validate that the package exists and belongs to the vendor
    const existingPackage = await this.model.checkVendorPackageOwnership(id, vendor.id);
    
    if (!existingPackage) {
      throw new GraphQLError('Photography package not found or you do not have permission to update it', {
        extensions: { code: 'NOT_FOUND' }
      });
    }
    
    // Toggle the availability
    const newAvailability = !existingPackage.isAvailable;
    
    return this.model.updatePackage(id, { 
      isAvailable: newAvailability,
      updatedAt: new Date()
    });
  }

  // ================ ADMIN METHODS ================

  /**
   * Admin: Get all packages with filtering and pagination
   */
  async getAllPackagesForAdmin(filters: AdminPackageFilters, admin: any) {
    if (!admin) {
      throw new GraphQLError('Admin authentication required', {
        extensions: { code: 'UNAUTHORIZED' }
      });
    }

    // Validate filters
    const validation = InputValidator.validateAdminFilters(filters);
    if (!validation.isValid) {
      throw new GraphQLError('Invalid filter parameters', {
        extensions: { code: 'BAD_USER_INPUT', validationErrors: validation.errors }
      });
    }

    // Set defaults
    const normalizedFilters = {
      ...filters,
      page: filters.page || 1,
      limit: filters.limit || 20,
      sortBy: filters.sortBy || 'created_desc'
    };

    return this.model.getAllPackagesForAdmin(normalizedFilters);
  }

  /**
   * Admin: Get package statistics
   */
  async getPackageStatistics(admin: any) {
    if (!admin) {
      throw new GraphQLError('Admin authentication required', {
        extensions: { code: 'UNAUTHORIZED' }
      });
    }

    return this.model.getPackageStatistics();
  }

  /**
   * Admin: Get package by ID with vendor details
   */
  async getPackageWithVendorById(id: string, admin: any) {
    if (!admin) {
      throw new GraphQLError('Admin authentication required', {
        extensions: { code: 'UNAUTHORIZED' }
      });
    }

    const photographyPackage = await this.model.getPackageWithVendorById(id);
    
    if (!photographyPackage) {
      throw new GraphQLError('Photography package not found', {
        extensions: { code: 'NOT_FOUND' }
      });
    }
    
    return photographyPackage;
  }

  /**
   * Admin: Update package status
   */
  async updatePackageStatus(id: string, isAvailable: boolean, admin: any) {
    if (!admin) {
      throw new GraphQLError('Admin authentication required', {
        extensions: { code: 'UNAUTHORIZED' }
      });
    }

    const existingPackage = await this.model.getPackageById(id);
    
    if (!existingPackage) {
      throw new GraphQLError('Photography package not found', {
        extensions: { code: 'NOT_FOUND' }
      });
    }

    return this.model.updatePackageStatus(id, isAvailable);
  }

  /**
   * Admin: Delete package
   */
  async adminDeletePackage(id: string, admin: any) {
    if (!admin) {
      throw new GraphQLError('Admin authentication required', {
        extensions: { code: 'UNAUTHORIZED' }
      });
    }

    const existingPackage = await this.model.getPackageById(id);
    
    if (!existingPackage) {
      throw new GraphQLError('Photography package not found', {
        extensions: { code: 'NOT_FOUND' }
      });
    }

    await this.model.adminDeletePackage(id);
    
    return {
      success: true,
      message: 'Photography package deleted successfully'
    };
  }

  /**
   * Admin: Get recent packages
   */
  async getRecentPackages(limit: number = 10, admin: any) {
    if (!admin) {
      throw new GraphQLError('Admin authentication required', {
        extensions: { code: 'UNAUTHORIZED' }
      });
    }

    const filters: AdminPackageFilters = {
      page: 1,
      limit,
      sortBy: 'created_desc'
    };

    const result = await this.model.getAllPackagesForAdmin(filters);
    return result.packages;
  }

  /**
   * Admin: Get packages by availability status
   */
  async getPackagesByAvailability(isAvailable: boolean, admin: any) {
    if (!admin) {
      throw new GraphQLError('Admin authentication required', {
        extensions: { code: 'UNAUTHORIZED' }
      });
    }

    const filters: AdminPackageFilters = {
      isAvailable,
      page: 1,
      limit: 50,
      sortBy: 'created_desc'
    };

    const result = await this.model.getAllPackagesForAdmin(filters);
    return result.packages;
  }

  /**
   * Admin: Get high-value packages
   */
  async getHighValuePackages(minPrice: number = 5000, admin: any) {
    if (!admin) {
      throw new GraphQLError('Admin authentication required', {
        extensions: { code: 'UNAUTHORIZED' }
      });
    }

    const filters: AdminPackageFilters = {
      minPrice,
      page: 1,
      limit: 50,
      sortBy: 'price_desc'
    };

    const result = await this.model.getAllPackagesForAdmin(filters);
    return result.packages;
  }

  /**
   * Admin: Get packages by vendor
   */
  async getPackagesByVendor(vendorId: string, admin: any) {
    if (!admin) {
      throw new GraphQLError('Admin authentication required', {
        extensions: { code: 'UNAUTHORIZED' }
      });
    }

    const filters: AdminPackageFilters = {
      vendorId,
      page: 1,
      limit: 100,
      sortBy: 'created_desc'
    };

    const result = await this.model.getAllPackagesForAdmin(filters);
    return result.packages;
  }
}