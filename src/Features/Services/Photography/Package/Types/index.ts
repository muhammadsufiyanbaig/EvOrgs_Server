// src/Features/Photography/Types.ts

// GraphQL types
export type PhotographyPackage = {
  id: string;
  vendorId: string;
  packageName: string;
  serviceArea: string[];
  description: string;
  imageUrl: string[];
  price: number;
  duration: number;
  photographerCount: number;
  deliverables: string[] | null;
  amenities: string[];
  isAvailable: boolean;
  rating: number | null;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CreatePhotographyPackageInput = {
  isAvailable: boolean;
  packageName: string;
  serviceArea: string[];
  description: string;
  imageUrl: string[];
  price: number;
  duration: number;
  photographerCount?: number;
  deliverables?: string[];
  amenities: string[];
};

export type UpdatePhotographyPackageInput = Partial<CreatePhotographyPackageInput>;

export type SearchPhotographyPackagesInput = {
  packageName?: string;
  amenities?: string[];
  serviceArea?: string[];
  photographerCount?: number;
};

// Validation functions for input types
export class InputValidator {
  static validateCreatePackageInput(input: CreatePhotographyPackageInput): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!input.packageName || input.packageName.trim() === '') {
      errors.push('Package name is required');
    }
    
    if (!input.serviceArea || input.serviceArea.length === 0) {
      errors.push('At least one service area is required');
    } else {
      input.serviceArea.forEach((area, index) => {
        if (!area || area.trim() === '') {
          errors.push(`Service area at index ${index} cannot be empty`);
        }
      });
    }
    
    if (!input.description || input.description.length < 10) {
      errors.push('Description must be at least 10 characters');
    }
    
    if (!input.imageUrl || input.imageUrl.length === 0) {
      errors.push('At least one image URL is required');
    } else {
      input.imageUrl.forEach((url, index) => {
        if (!url || !isValidUrl(url)) {
          errors.push(`Image URL at index ${index} is not a valid URL`);
        }
      });
    }
    
    if (typeof input.price !== 'number' || input.price <= 0) {
      errors.push('Price must be a positive number');
    }
    
    if (typeof input.duration !== 'number' || input.duration <= 0 || !Number.isInteger(input.duration)) {
      errors.push('Duration must be a positive integer');
    }
    
    if (input.photographerCount !== undefined && (typeof input.photographerCount !== 'number' || 
        input.photographerCount <= 0 || !Number.isInteger(input.photographerCount))) {
      errors.push('Photographer count must be a positive integer');
    }
    
    if (input.deliverables && !Array.isArray(input.deliverables)) {
      errors.push('Deliverables must be an array');
    }
    
    if (!input.amenities || input.amenities.length === 0) {
      errors.push('At least one amenity is required');
    } else {
      input.amenities.forEach((amenity, index) => {
        if (!amenity || amenity.trim() === '') {
          errors.push(`Amenity at index ${index} cannot be empty`);
        }
      });
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  static validateUpdatePackageInput(input: UpdatePhotographyPackageInput): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (input.packageName !== undefined && input.packageName.trim() === '') {
      errors.push('Package name cannot be empty if provided');
    }
    
    if (input.serviceArea !== undefined) {
      if (!Array.isArray(input.serviceArea)) {
        errors.push('Service area must be an array');
      } else if (input.serviceArea.length === 0) {
        errors.push('Service area array cannot be empty if provided');
      } else {
        input.serviceArea.forEach((area, index) => {
          if (!area || area.trim() === '') {
            errors.push(`Service area at index ${index} cannot be empty`);
          }
        });
      }
    }
    
    if (input.description !== undefined && input.description.length < 10) {
      errors.push('Description must be at least 10 characters if provided');
    }
    
    if (input.imageUrl !== undefined) {
      if (!Array.isArray(input.imageUrl)) {
        errors.push('Image URL must be an array');
      } else if (input.imageUrl.length === 0) {
        errors.push('Image URL array cannot be empty if provided');
      } else {
        input.imageUrl.forEach((url, index) => {
          if (!url || !isValidUrl(url)) {
            errors.push(`Image URL at index ${index} is not a valid URL`);
          }
        });
      }
    }
    
    if (input.price !== undefined && (typeof input.price !== 'number' || input.price <= 0)) {
      errors.push('Price must be a positive number');
    }
    
    if (input.duration !== undefined && (typeof input.duration !== 'number' || 
        input.duration <= 0 || !Number.isInteger(input.duration))) {
      errors.push('Duration must be a positive integer');
    }
    
    if (input.photographerCount !== undefined && (typeof input.photographerCount !== 'number' || 
        input.photographerCount <= 0 || !Number.isInteger(input.photographerCount))) {
      errors.push('Photographer count must be a positive integer');
    }
    
    if (input.deliverables !== undefined && !Array.isArray(input.deliverables)) {
      errors.push('Deliverables must be an array');
    }
    
    if (input.amenities !== undefined) {
      if (!Array.isArray(input.amenities)) {
        errors.push('Amenities must be an array');
      } else if (input.amenities.length === 0) {
        errors.push('Amenities array cannot be empty if provided');
      } else {
        input.amenities.forEach((amenity, index) => {
          if (!amenity || amenity.trim() === '') {
            errors.push(`Amenity at index ${index} cannot be empty`);
          }
        });
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Helper function to validate URLs
function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}