// src/Features/Reviews/Resolvers/index.ts

import { Context } from '../../../../GraphQL/Context';
import { createReviewService } from '../../Service';
import { 
  CreateReviewInput, 
  UpdateReviewInput, 
  CreateReviewResponseInput,
  UpdateReviewResponseInput,
  ReviewFilters,
  PaginationInput 
} from '../../Types';

export const reviewResolvers = {
  Query: {
    // Get reviews with filters and pagination
    getReviews: async (
      _: any, 
      { filters, pagination }: { filters?: ReviewFilters; pagination?: PaginationInput }, 
      context: Context
    ) => {
      const reviewService = createReviewService(context);
      return await reviewService.getReviews(filters, pagination);
    },

    // Get a single review
    getReview: async (_: any, { id }: { id: string }, context: Context) => {
      const reviewService = createReviewService(context);
      return await reviewService.getReview(id);
    },

    // Get vendor reviews
    getVendorReviews: async (
      _: any, 
      { vendorId, pagination }: { vendorId: string; pagination?: PaginationInput }, 
      context: Context
    ) => {
      const reviewService = createReviewService(context);
      return await reviewService.getVendorReviews(vendorId, pagination);
    },

    // Get user reviews
    getUserReviews: async (
      _: any, 
      { userId, pagination }: { userId: string; pagination?: PaginationInput }, 
      context: Context
    ) => {
      const reviewService = createReviewService(context);
      return await reviewService.getUserReviews(userId, context, pagination);
    },

    // Get vendor review stats
    getVendorReviewStats: async (_: any, { vendorId }: { vendorId: string }, context: Context) => {
      const reviewService = createReviewService(context);
      return await reviewService.getVendorReviewStats(vendorId);
    },

    // Get service review stats
    getServiceReviewStats: async (
      _: any, 
      { serviceId, serviceType }: { serviceId: string; serviceType: string }, 
      context: Context
    ) => {
      const reviewService = createReviewService(context);
      return await reviewService.getServiceReviewStats(serviceId, serviceType);
    },

    // Get review response
    getReviewResponse: async (_: any, { reviewId }: { reviewId: string }, context: Context) => {
      const reviewService = createReviewService(context);
      return await reviewService.getReviewResponse(reviewId);
    },

    // Admin: Get all reviews
    getAllReviews: async (
      _: any, 
      { filters, pagination }: { filters?: ReviewFilters; pagination?: PaginationInput }, 
      context: Context
    ) => {
      const reviewService = createReviewService(context);
      return await reviewService.getAllReviews(filters, pagination, context);
    },
  },

  Mutation: {
    // Create review
    createReview: async (_: any, { input }: { input: CreateReviewInput }, context: Context) => {
      const reviewService = createReviewService(context);
      return await reviewService.createReview(input, context);
    },

    // Update review
    updateReview: async (_: any, { input }: { input: UpdateReviewInput }, context: Context) => {
      const reviewService = createReviewService(context);
      return await reviewService.updateReview(input, context);
    },

    // Delete review
    deleteReview: async (_: any, { id }: { id: string }, context: Context) => {
      const reviewService = createReviewService(context);
      return await reviewService.deleteReview(id, context);
    },

    // Create review response
    createReviewResponse: async (_: any, { input }: { input: CreateReviewResponseInput }, context: Context) => {
      const reviewService = createReviewService(context);
      return await reviewService.createReviewResponse(input, context);
    },

    // Update review response
    updateReviewResponse: async (_: any, { input }: { input: UpdateReviewResponseInput }, context: Context) => {
      const reviewService = createReviewService(context);
      return await reviewService.updateReviewResponse(input, context);
    },

    // Delete review response
    deleteReviewResponse: async (_: any, { id }: { id: string }, context: Context) => {
      const reviewService = createReviewService(context);
      return await reviewService.deleteReviewResponse(id, context);
    },

    // Admin: Verify review
    verifyReview: async (_: any, { id }: { id: string }, context: Context) => {
      const reviewService = createReviewService(context);
      return await reviewService.verifyReview(id, context);
    },

    // Admin: Unverify review
    unverifyReview: async (_: any, { id }: { id: string }, context: Context) => {
      const reviewService = createReviewService(context);
      return await reviewService.unverifyReview(id, context);
    },

    // Admin: Publish review
    publishReview: async (_: any, { id }: { id: string }, context: Context) => {
      const reviewService = createReviewService(context);
      return await reviewService.publishReview(id, context);
    },

    // Admin: Unpublish review
    unpublishReview: async (_: any, { id }: { id: string }, context: Context) => {
      const reviewService = createReviewService(context);
      return await reviewService.unpublishReview(id, context);
    },

    // Admin: Delete review
    deleteReviewAdmin: async (_: any, { id }: { id: string }, context: Context) => {
      const reviewService = createReviewService(context);
      return await reviewService.deleteReviewAdmin(id, context);
    },

    // Admin: Delete review response
    deleteReviewResponseAdmin: async (_: any, { id }: { id: string }, context: Context) => {
      const reviewService = createReviewService(context);
      return await reviewService.deleteReviewResponseAdmin(id, context);
    },
  },

  // Field resolvers
  Review: {
    user: async (parent: any, _: any, context: Context) => {
      const reviewService = createReviewService(context);
      return await reviewService.getReviewUser(parent.userId);
    },

    vendor: async (parent: any, _: any, context: Context) => {
      const reviewService = createReviewService(context);
      return await reviewService.getReviewVendor(parent.vendorId);
    },

    response: async (parent: any, _: any, context: Context) => {
      const reviewService = createReviewService(context);
      return await reviewService.getReviewResponseByReview(parent.id);
    },
  },

  ReviewResponse: {
    review: async (parent: any, _: any, context: Context) => {
      const reviewService = createReviewService(context);
      return await reviewService.getResponseReview(parent.reviewId);
    },

    vendor: async (parent: any, _: any, context: Context) => {
      const reviewService = createReviewService(context);
      return await reviewService.getResponseVendor(parent.vendorId);
    },
  },
};