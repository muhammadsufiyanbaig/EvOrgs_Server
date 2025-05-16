
// TYPES
// Features/Farmhouse/Types.ts
export interface Farmhouse {
    id: string;
    vendorId: string;
    name: string;
    location: string;
    description: string;
    imageUrl: string[];
    perNightPrice: number;
    minNights: number;
    maxNights?: number | null;
    maxGuests: number;
    amenities: string[];
    isAvailable: boolean;
    rating?: number | null;
    reviewCount: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateFarmhouseInput {
    name: string;
    location: string;
    description: string;
    imageUrl: string | string[];
    perNightPrice: number;
    minNights?: number;
    maxNights?: number | null;
    maxGuests: number;
    amenities: string[];
    isAvailable?: boolean;
}

export interface UpdateFarmhouseInput {
    id: string;
    name?: string;
    location?: string;
    description?: string;
    imageUrl?: string | string[] | null;
    perNightPrice?: number;
    minNights?: number;
    maxNights?: number | null;
    maxGuests?: number;
    amenities?: string[];
    isAvailable?: boolean;
}

export interface DeleteFarmhouseInput {
    id: string;
}

export interface ToggleFarmhouseInput {
    id: string;
    isAvailable: boolean;
}

export interface FarmhouseFilters {
    id?: string;
    amenities?: string[];
    minPrice?: number;
    maxPrice?: number;
    minNights?: number;
    maxNights?: number;
    maxGuests?: number;
    isAvailable?: boolean;
}

export interface SearchFarmhouseInput {
    filters: FarmhouseFilters;
    page?: number;
    limit?: number;
}
