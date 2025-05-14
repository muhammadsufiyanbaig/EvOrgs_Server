// src/Features/Photography/Service.ts

import { GraphQLError } from 'graphql';
import { PhotographyModel } from '../model';
import { CreatePhotographyPackageInput, UpdatePhotographyPackageInput, SearchPhotographyPackagesInput, InputValidator } from '../Types';
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
    
    // Create package with default values
    const newPackage = {
      ...input,
      vendorId: vendor.id,
      id: undefined, // Let the database generate the ID
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
}