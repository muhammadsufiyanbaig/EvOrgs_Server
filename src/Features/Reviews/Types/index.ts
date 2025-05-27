export interface Review {
  id: string;
  userId: string;
  vendorId: string;
  serviceType: "FarmHouse" | "Venue" | "CateringPackage" | "PhotographyPackage";
  serviceId: string;
  bookingId?: string;
  rating: number;
  reviewText?: string;
  images?: string[];
  isPublished: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewResponse {
  id: string;
  reviewId: string;
  vendorId: string;
  responseText: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface CreateReviewResponseInput {
  reviewId: string;
  responseText: string;
}

export interface UpdateReviewResponseInput {
  id: string;
  responseText: string;
}

export interface CreateReviewInput {
  vendorId: string;
  serviceType: "FarmHouse" | "Venue" | "CateringPackage" | "PhotographyPackage";
  serviceId: string;
  bookingId?: string;
  rating: number;
  reviewText?: string;
  images?: string[];
}

export interface UpdateReviewInput {
  id: string;
  rating?: number;
  reviewText?: string;
  images?: string[];
}

export interface CreateReviewResponseInput {
  reviewId: string;
  responseText: string;
}

export interface ReviewFilters {
  userId: any;
  vendorId?: string;
  serviceType?: "FarmHouse" | "Venue" | "CateringPackage" | "PhotographyPackage";
  serviceId?: string;
  rating?: number;
  isPublished?: boolean;
  isVerified?: boolean;
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    rating: number;
    count: number;
  }[];
}

export interface PaginationInput {
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "rating" | "updatedAt";
  sortOrder?: "asc" | "desc";
}