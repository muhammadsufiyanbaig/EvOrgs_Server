import { InferModel } from "drizzle-orm";
import { venues } from "../../../../Schema";

// Infer types from Drizzle schema
export type Venue = InferModel<typeof venues>;
export type NewVenue = InferModel<typeof venues, 'insert'>;


// Input types for GraphQL operations
export interface VenueInput {
    name: string;
    location: string;
    description: string;
    imageUrl: string[];
    price: string;
    tags: string[];
    amenities: string[];
    minPersonLimit: number;
    maxPersonLimit: number;
    isAvailable?: boolean;
}

export interface VenueUpdateInput extends Partial<VenueInput> {
    id: string;
}