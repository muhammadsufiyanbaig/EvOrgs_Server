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