export interface CateringPackage {
    id: string;
    vendorId: string;
    packageName: string;
    serviceArea: string[];
    description: string;
    imageUrl: string[];
    price: number;
    minGuests: number;
    maxGuests: number;
    menuItems?: string[];
    dietaryOptions?: string[];
    amenities: string[];
    isAvailable: boolean;
    rating?: number;
    reviewCount: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface CateringPackageInput {
    packageName: string;
    serviceArea: string[];
    description: string;
    imageUrl: string[];
    price: number;
    minGuests: number;
    maxGuests: number;
    menuItems?: string[];
    dietaryOptions?: string[];
    amenities: string[];
}

export interface CateringPackageUpdateInput {
    packageName?: string;
    serviceArea?: string[];
    description?: string;
    imageUrl?: string[];
    price?: number;
    minGuests?: number;
    maxGuests?: number;
    menuItems?: string[];
    dietaryOptions?: string[];
    amenities?: string[];
}

export interface SearchCateringPackagesInput {
    packageName?: string;
    amenities?: string[];
    serviceArea?: string[];
    menuItems?: string[];
}
