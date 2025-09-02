// Types.ts
export interface CateringPackage {
  id: string;
  vendorId: string;
  packageName: string;
  serviceArea: string[];
  description: string;
  imageUrl: string | null;  // Single string or null
  price: string;
  minGuests: number;
  maxGuests: number;
  menuItems: string[] | null;
  dietaryOptions: string[];
  amenities: string[];
  isAvailable: boolean;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CateringPackageInput {
  packageName: string;
  serviceArea: string[];
  description: string;
  imageUrl: string | null;  // Single string or null
  price: number;  // Number in input
  minGuests: number;
  maxGuests: number;
  menuItems?: string[];
  dietaryOptions?: string[];
  amenities?: string[];
}

export interface CateringPackageUpdateInput {
  packageName?: string;
  serviceArea?: string[];
  description?: string;
  imageUrl?: string | null;  // Single string or null
  price?: number;  // Number in update input
  minGuests?: number;
  maxGuests?: number;
  menuItems?: string[] | null;
  dietaryOptions?: string[];
  amenities?: string[];
  isAvailable?: boolean;
}

export interface SearchCateringPackagesInput {
  packageName?: string;
  amenities?: string[];
  serviceArea?: string[];
  menuItems?: string[];
}

export interface AdminCateringPackageFilters {
  vendorId?: string;
  packageName?: string;
  isAvailable?: boolean;
  minPrice?: number;
  maxPrice?: number;
  minGuests?: number;
  maxGuests?: number;
  serviceArea?: string[];
  amenities?: string[];
  dietaryOptions?: string[];
  page?: number;
  limit?: number;
  sortBy?: 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc' | 'guests_asc' | 'guests_desc' | 'created_at_asc' | 'created_at_desc';
}

export interface CateringPackageListResponse {
  packages: CateringPackage[];
  total: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}