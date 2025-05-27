import { v4 as uuidv4 } from 'uuid';
import { ReviewModel, ReviewResponseModel } from '../Model';
import { Context } from '../../../GraphQL/Context';
import { 
  CreateReviewInput, 
  UpdateReviewInput, 
  CreateReviewResponseInput,
  UpdateReviewResponseInput,
  ReviewFilters,
  PaginationInput 
} from '../Types';

// Authentication helpers
const requireUser = (context: Context) => {
  if (!context.user) {
    throw new Error('Authentication required');
  }
  return context.user;
};

const requireVendor = (context: Context) => {
  if (!context.vendor) {
    throw new Error('Vendor authentication required');
  }
  return context.vendor;
};

const requireAdmin = (context: Context) => {
  if (!context.Admin) {
    throw new Error('Admin authentication required');
  }
  return context.Admin;
};

export class ReviewService {
  private reviewModel: ReviewModel;
  private reviewResponseModel: ReviewResponseModel;

  constructor(context: Context) {
    this.reviewModel = new ReviewModel(context.db);
    this.reviewResponseModel = new ReviewResponseModel(context.db);
  }

  // Query methods
  async getReviews(filters?: ReviewFilters, pagination?: PaginationInput) {
    return await this.reviewModel.findReviews(filters, pagination);
  }

  async getReview(id: string) {
    return await this.reviewModel.findById(id);
  }

  async getVendorReviews(vendorId: string, pagination?: PaginationInput) {
    return await this.reviewModel.findByVendor(vendorId, pagination);
  }

  async getUserReviews(userId: string, context: Context, pagination?: PaginationInput) {
    const user = requireUser(context);
    
    // Users can only see their own reviews unless admin
    if (user.id !== userId && !context.Admin) {
      throw new Error('Unauthorized to view these reviews');
    }

    return await this.reviewModel.findByUser(userId, pagination);
  }

  async getVendorReviewStats(vendorId: string) {
    return await this.reviewModel.getVendorStats(vendorId);
  }

  async getServiceReviewStats(serviceId: string, serviceType: string) {
    return await this.reviewModel.getServiceStats(serviceId, serviceType);
  }

  async getReviewResponse(reviewId: string) {
    return await this.reviewResponseModel.findByReviewId(reviewId);
  }

  async getAllReviews(filters?: ReviewFilters, pagination?: PaginationInput, context?: Context) {
    if (context) {
      requireAdmin(context);
    }
    return await this.reviewModel.findAllReviews(filters, pagination);
  }

  // Mutation methods
  async createReview(input: CreateReviewInput, context: Context) {
    const user = requireUser(context);

    // Validate rating
    if (input.rating < 1 || input.rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    // Check if user already reviewed this service
    const existingReview = await this.reviewModel.findExistingReview(
      user.id, 
      input.serviceId, 
      input.serviceType
    );

    if (existingReview) {
      throw new Error('You have already reviewed this service');
    }

    const reviewId = uuidv4();
    const newReview = {
      id: reviewId,
      userId: user.id,
      vendorId: input.vendorId,
      serviceType: input.serviceType,
      serviceId: input.serviceId,
      bookingId: input.bookingId || null,
      rating: input.rating,
      reviewText: input.reviewText || null,
      images: input.images || null,
      isPublished: true,
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return await this.reviewModel.create(newReview);
  }

  async updateReview(input: UpdateReviewInput, context: Context) {
    const user = requireUser(context);

    // Check if review exists and belongs to user
    const existingReview = await this.reviewModel.findByIdAdmin(input.id);

    if (!existingReview) {
      throw new Error('Review not found');
    }

    if (existingReview.userId !== user.id) {
      throw new Error('Unauthorized to update this review');
    }

    // Validate rating if provided
    if (input.rating && (input.rating < 1 || input.rating > 5)) {
      throw new Error('Rating must be between 1 and 5');
    }

    const updateData: any = {};
    if (input.rating !== undefined) updateData.rating = input.rating;
    if (input.reviewText !== undefined) updateData.reviewText = input.reviewText;
    if (input.images !== undefined) updateData.images = input.images;

    return await this.reviewModel.update(input.id, updateData);
  }

  async deleteReview(id: string, context: Context) {
    const user = requireUser(context);

    // Check if review exists and belongs to user
    const existingReview = await this.reviewModel.findByIdAdmin(id);

    if (!existingReview) {
      throw new Error('Review not found');
    }

    if (existingReview.userId !== user.id) {
      throw new Error('Unauthorized to delete this review');
    }

    return await this.reviewModel.delete(id);
  }

  async createReviewResponse(input: CreateReviewResponseInput, context: Context) {
    const vendor = requireVendor(context);

    // Check if review exists and belongs to vendor
    const review = await this.reviewModel.findByIdAdmin(input.reviewId);

    if (!review) {
      throw new Error('Review not found');
    }

    if (review.vendorId !== vendor.id) {
      throw new Error('Unauthorized to respond to this review');
    }

    // Check if response already exists
    const existingResponse = await this.reviewResponseModel.findByReviewId(input.reviewId);

    if (existingResponse) {
      throw new Error('Response already exists for this review');
    }

    const responseId = uuidv4();
    const newResponse = {
      id: responseId,
      reviewId: input.reviewId,
      vendorId: vendor.id,
      responseText: input.responseText,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return await this.reviewResponseModel.create(newResponse);
  }

  async updateReviewResponse(input: UpdateReviewResponseInput, context: Context) {
    const vendor = requireVendor(context);

    // Check if response exists and belongs to vendor
    const existingResponse = await this.reviewResponseModel.findById(input.id);

    if (!existingResponse) {
      throw new Error('Response not found');
    }

    if (existingResponse.vendorId !== vendor.id) {
      throw new Error('Unauthorized to update this response');
    }

    return await this.reviewResponseModel.update(input.id, input.responseText);
  }

  async deleteReviewResponse(id: string, context: Context) {
    const vendor = requireVendor(context);

    // Check if response exists and belongs to vendor
    const existingResponse = await this.reviewResponseModel.findById(id);

    if (!existingResponse) {
      throw new Error('Response not found');
    }

    if (existingResponse.vendorId !== vendor.id) {
      throw new Error('Unauthorized to delete this response');
    }

    return await this.reviewResponseModel.delete(id);
  }

  // Admin methods
  async verifyReview(id: string, context: Context) {
    requireAdmin(context);
    return await this.reviewModel.update(id, { isVerified: true });
  }

  async unverifyReview(id: string, context: Context) {
    requireAdmin(context);
    return await this.reviewModel.update(id, { isVerified: false });
  }

  async publishReview(id: string, context: Context) {
    requireAdmin(context);
    return await this.reviewModel.update(id, { isPublished: true });
  }

  async unpublishReview(id: string, context: Context) {
    requireAdmin(context);
    return await this.reviewModel.update(id, { isPublished: false });
  }

  async deleteReviewAdmin(id: string, context: Context) {
    requireAdmin(context);

    const existingReview = await this.reviewModel.findByIdAdmin(id);
    if (!existingReview) {
      throw new Error('Review not found');
    }

    return await this.reviewModel.delete(id);
  }

  async deleteReviewResponseAdmin(id: string, context: Context) {
    requireAdmin(context);

    const existingResponse = await this.reviewResponseModel.findById(id);
    if (!existingResponse) {
      throw new Error('Response not found');
    }

    return await this.reviewResponseModel.delete(id);
  }

  // Field resolver methods
  async getReviewUser(userId: string) {
    return await this.reviewModel.findUserById(userId);
  }

  async getReviewVendor(vendorId: string) {
    return await this.reviewModel.findVendorById(vendorId);
  }

  async getReviewResponseByReview(reviewId: string) {
    return await this.reviewResponseModel.findByReviewId(reviewId);
  }

  async getResponseReview(reviewId: string) {
    return await this.reviewResponseModel.findReviewById(reviewId);
  }

  async getResponseVendor(vendorId: string) {
    return await this.reviewResponseModel.findVendorById(vendorId);
  }
}

// Factory function for easy instantiation
export const createReviewService = (context: Context) => {
  return new ReviewService(context);
};