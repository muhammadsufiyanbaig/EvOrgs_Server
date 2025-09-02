"use strict";
// src/Features/Reviews/Resolvers/index.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewResolvers = void 0;
const Service_1 = require("../../Service");
exports.reviewResolvers = {
    Query: {
        // Get reviews with filters and pagination
        getReviews: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { filters, pagination }, context) {
            const reviewService = (0, Service_1.createReviewService)(context);
            return yield reviewService.getReviews(filters, pagination);
        }),
        // Get a single review
        getReview: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            const reviewService = (0, Service_1.createReviewService)(context);
            return yield reviewService.getReview(id);
        }),
        // Get vendor reviews
        getVendorReviews: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { vendorId, pagination }, context) {
            const reviewService = (0, Service_1.createReviewService)(context);
            return yield reviewService.getVendorReviews(vendorId, pagination);
        }),
        // Get user reviews
        getUserReviews: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { userId, pagination }, context) {
            const reviewService = (0, Service_1.createReviewService)(context);
            return yield reviewService.getUserReviews(userId, context, pagination);
        }),
        // Get vendor review stats
        getVendorReviewStats: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { vendorId }, context) {
            const reviewService = (0, Service_1.createReviewService)(context);
            return yield reviewService.getVendorReviewStats(vendorId);
        }),
        // Get service review stats
        getServiceReviewStats: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { serviceId, serviceType }, context) {
            const reviewService = (0, Service_1.createReviewService)(context);
            return yield reviewService.getServiceReviewStats(serviceId, serviceType);
        }),
        // Get review response
        getReviewResponse: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { reviewId }, context) {
            const reviewService = (0, Service_1.createReviewService)(context);
            return yield reviewService.getReviewResponse(reviewId);
        }),
        // Admin: Get all reviews
        getAllReviews: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { filters, pagination }, context) {
            const reviewService = (0, Service_1.createReviewService)(context);
            return yield reviewService.getAllReviews(filters, pagination, context);
        }),
    },
    Mutation: {
        // Create review
        createReview: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { input }, context) {
            const reviewService = (0, Service_1.createReviewService)(context);
            return yield reviewService.createReview(input, context);
        }),
        // Update review
        updateReview: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { input }, context) {
            const reviewService = (0, Service_1.createReviewService)(context);
            return yield reviewService.updateReview(input, context);
        }),
        // Delete review
        deleteReview: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            const reviewService = (0, Service_1.createReviewService)(context);
            return yield reviewService.deleteReview(id, context);
        }),
        // Create review response
        createReviewResponse: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { input }, context) {
            const reviewService = (0, Service_1.createReviewService)(context);
            return yield reviewService.createReviewResponse(input, context);
        }),
        // Update review response
        updateReviewResponse: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { input }, context) {
            const reviewService = (0, Service_1.createReviewService)(context);
            return yield reviewService.updateReviewResponse(input, context);
        }),
        // Delete review response
        deleteReviewResponse: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            const reviewService = (0, Service_1.createReviewService)(context);
            return yield reviewService.deleteReviewResponse(id, context);
        }),
        // Admin: Verify review
        verifyReview: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            const reviewService = (0, Service_1.createReviewService)(context);
            return yield reviewService.verifyReview(id, context);
        }),
        // Admin: Unverify review
        unverifyReview: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            const reviewService = (0, Service_1.createReviewService)(context);
            return yield reviewService.unverifyReview(id, context);
        }),
        // Admin: Publish review
        publishReview: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            const reviewService = (0, Service_1.createReviewService)(context);
            return yield reviewService.publishReview(id, context);
        }),
        // Admin: Unpublish review
        unpublishReview: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            const reviewService = (0, Service_1.createReviewService)(context);
            return yield reviewService.unpublishReview(id, context);
        }),
        // Admin: Delete review
        deleteReviewAdmin: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            const reviewService = (0, Service_1.createReviewService)(context);
            return yield reviewService.deleteReviewAdmin(id, context);
        }),
        // Admin: Delete review response
        deleteReviewResponseAdmin: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            const reviewService = (0, Service_1.createReviewService)(context);
            return yield reviewService.deleteReviewResponseAdmin(id, context);
        }),
    },
    // Field resolvers
    Review: {
        user: (parent, _, context) => __awaiter(void 0, void 0, void 0, function* () {
            const reviewService = (0, Service_1.createReviewService)(context);
            return yield reviewService.getReviewUser(parent.userId);
        }),
        vendor: (parent, _, context) => __awaiter(void 0, void 0, void 0, function* () {
            const reviewService = (0, Service_1.createReviewService)(context);
            return yield reviewService.getReviewVendor(parent.vendorId);
        }),
        response: (parent, _, context) => __awaiter(void 0, void 0, void 0, function* () {
            const reviewService = (0, Service_1.createReviewService)(context);
            return yield reviewService.getReviewResponseByReview(parent.id);
        }),
    },
    ReviewResponse: {
        review: (parent, _, context) => __awaiter(void 0, void 0, void 0, function* () {
            const reviewService = (0, Service_1.createReviewService)(context);
            return yield reviewService.getResponseReview(parent.reviewId);
        }),
        vendor: (parent, _, context) => __awaiter(void 0, void 0, void 0, function* () {
            const reviewService = (0, Service_1.createReviewService)(context);
            return yield reviewService.getResponseVendor(parent.vendorId);
        }),
    },
};
