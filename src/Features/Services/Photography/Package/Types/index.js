"use strict";
// src/Features/Photography/Types.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputValidator = void 0;
// Validation functions for input types
class InputValidator {
    static validateAdminFilters(filters) {
        const errors = [];
        // Validate price range
        if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
            if (filters.minPrice < 0) {
                errors.push('Minimum price must be non-negative');
            }
            if (filters.maxPrice < 0) {
                errors.push('Maximum price must be non-negative');
            }
            if (filters.minPrice > filters.maxPrice) {
                errors.push('Minimum price cannot be greater than maximum price');
            }
        }
        // Validate duration range
        if (filters.minDuration !== undefined && filters.maxDuration !== undefined) {
            if (filters.minDuration < 0) {
                errors.push('Minimum duration must be non-negative');
            }
            if (filters.maxDuration < 0) {
                errors.push('Maximum duration must be non-negative');
            }
            if (filters.minDuration > filters.maxDuration) {
                errors.push('Minimum duration cannot be greater than maximum duration');
            }
        }
        // Validate photographer count range
        if (filters.minPhotographerCount !== undefined && filters.maxPhotographerCount !== undefined) {
            if (filters.minPhotographerCount < 1) {
                errors.push('Minimum photographer count must be at least 1');
            }
            if (filters.maxPhotographerCount < 1) {
                errors.push('Maximum photographer count must be at least 1');
            }
            if (filters.minPhotographerCount > filters.maxPhotographerCount) {
                errors.push('Minimum photographer count cannot be greater than maximum photographer count');
            }
        }
        // Validate pagination
        if (filters.page !== undefined && filters.page < 1) {
            errors.push('Page number must be positive');
        }
        if (filters.limit !== undefined && (filters.limit < 1 || filters.limit > 100)) {
            errors.push('Limit must be between 1 and 100');
        }
        // Validate sort options
        const validSortOptions = [
            'created_asc', 'created_desc',
            'price_asc', 'price_desc',
            'rating_asc', 'rating_desc',
            'duration_asc', 'duration_desc',
            'name_asc', 'name_desc'
        ];
        if (filters.sortBy && !validSortOptions.includes(filters.sortBy)) {
            errors.push(`Invalid sort option. Valid options are: ${validSortOptions.join(', ')}`);
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    static validateCreatePackageInput(input) {
        const errors = [];
        if (!input.packageName || input.packageName.trim() === '') {
            errors.push('Package name is required');
        }
        if (!input.serviceArea || input.serviceArea.length === 0) {
            errors.push('At least one service area is required');
        }
        else {
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
        }
        else {
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
        }
        else {
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
    static validateUpdatePackageInput(input) {
        const errors = [];
        if (input.packageName !== undefined && input.packageName.trim() === '') {
            errors.push('Package name cannot be empty if provided');
        }
        if (input.serviceArea !== undefined) {
            if (!Array.isArray(input.serviceArea)) {
                errors.push('Service area must be an array');
            }
            else if (input.serviceArea.length === 0) {
                errors.push('Service area array cannot be empty if provided');
            }
            else {
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
            }
            else if (input.imageUrl.length === 0) {
                errors.push('Image URL array cannot be empty if provided');
            }
            else {
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
            }
            else if (input.amenities.length === 0) {
                errors.push('Amenities array cannot be empty if provided');
            }
            else {
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
exports.InputValidator = InputValidator;
// Helper function to validate URLs
function isValidUrl(urlString) {
    try {
        const url = new URL(urlString);
        return url.protocol === 'http:' || url.protocol === 'https:';
    }
    catch (_a) {
        return false;
    }
}
