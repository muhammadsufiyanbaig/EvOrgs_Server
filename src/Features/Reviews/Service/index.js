"use strict";
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
exports.createReviewService = exports.ReviewService = void 0;
const uuid_1 = require("uuid");
const Model_1 = require("../Model");
// Authentication helpers
const requireUser = (context) => {
    if (!context.user) {
        throw new Error('Authentication required');
    }
    return context.user;
};
const requireVendor = (context) => {
    if (!context.vendor) {
        throw new Error('Vendor authentication required');
    }
    return context.vendor;
};
const requireAdmin = (context) => {
    if (!context.Admin) {
        throw new Error('Admin authentication required');
    }
    return context.Admin;
};
class ReviewService {
    constructor(context) {
        this.reviewModel = new Model_1.ReviewModel(context.db);
        this.reviewResponseModel = new Model_1.ReviewResponseModel(context.db);
    }
    // Query methods
    getReviews(filters, pagination) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.reviewModel.findReviews(filters, pagination);
        });
    }
    getReview(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.reviewModel.findById(id);
        });
    }
    getVendorReviews(vendorId, pagination) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.reviewModel.findByVendor(vendorId, pagination);
        });
    }
    getUserReviews(userId, context, pagination) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = requireUser(context);
            // Users can only see their own reviews unless admin
            if (user.id !== userId && !context.Admin) {
                throw new Error('Unauthorized to view these reviews');
            }
            return yield this.reviewModel.findByUser(userId, pagination);
        });
    }
    getVendorReviewStats(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.reviewModel.getVendorStats(vendorId);
        });
    }
    getServiceReviewStats(serviceId, serviceType) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.reviewModel.getServiceStats(serviceId, serviceType);
        });
    }
    getReviewResponse(reviewId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.reviewResponseModel.findByReviewId(reviewId);
        });
    }
    getAllReviews(filters, pagination, context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (context) {
                requireAdmin(context);
            }
            return yield this.reviewModel.findAllReviews(filters, pagination);
        });
    }
    // Mutation methods
    createReview(input, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = requireUser(context);
            // Validate rating
            if (input.rating < 1 || input.rating > 5) {
                throw new Error('Rating must be between 1 and 5');
            }
            // Check if user already reviewed this service
            const existingReview = yield this.reviewModel.findExistingReview(user.id, input.serviceId, input.serviceType);
            if (existingReview) {
                throw new Error('You have already reviewed this service');
            }
            const reviewId = (0, uuid_1.v4)();
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
            return yield this.reviewModel.create(newReview);
        });
    }
    updateReview(input, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = requireUser(context);
            // Check if review exists and belongs to user
            const existingReview = yield this.reviewModel.findByIdAdmin(input.id);
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
            const updateData = {};
            if (input.rating !== undefined)
                updateData.rating = input.rating;
            if (input.reviewText !== undefined)
                updateData.reviewText = input.reviewText;
            if (input.images !== undefined)
                updateData.images = input.images;
            return yield this.reviewModel.update(input.id, updateData);
        });
    }
    deleteReview(id, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = requireUser(context);
            // Check if review exists and belongs to user
            const existingReview = yield this.reviewModel.findByIdAdmin(id);
            if (!existingReview) {
                throw new Error('Review not found');
            }
            if (existingReview.userId !== user.id) {
                throw new Error('Unauthorized to delete this review');
            }
            return yield this.reviewModel.delete(id);
        });
    }
    createReviewResponse(input, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const vendor = requireVendor(context);
            // Check if review exists and belongs to vendor
            const review = yield this.reviewModel.findByIdAdmin(input.reviewId);
            if (!review) {
                throw new Error('Review not found');
            }
            if (review.vendorId !== vendor.id) {
                throw new Error('Unauthorized to respond to this review');
            }
            // Check if response already exists
            const existingResponse = yield this.reviewResponseModel.findByReviewId(input.reviewId);
            if (existingResponse) {
                throw new Error('Response already exists for this review');
            }
            const responseId = (0, uuid_1.v4)();
            const newResponse = {
                id: responseId,
                reviewId: input.reviewId,
                vendorId: vendor.id,
                responseText: input.responseText,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            return yield this.reviewResponseModel.create(newResponse);
        });
    }
    updateReviewResponse(input, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const vendor = requireVendor(context);
            // Check if response exists and belongs to vendor
            const existingResponse = yield this.reviewResponseModel.findById(input.id);
            if (!existingResponse) {
                throw new Error('Response not found');
            }
            if (existingResponse.vendorId !== vendor.id) {
                throw new Error('Unauthorized to update this response');
            }
            return yield this.reviewResponseModel.update(input.id, input.responseText);
        });
    }
    deleteReviewResponse(id, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const vendor = requireVendor(context);
            // Check if response exists and belongs to vendor
            const existingResponse = yield this.reviewResponseModel.findById(id);
            if (!existingResponse) {
                throw new Error('Response not found');
            }
            if (existingResponse.vendorId !== vendor.id) {
                throw new Error('Unauthorized to delete this response');
            }
            return yield this.reviewResponseModel.delete(id);
        });
    }
    // Admin methods
    verifyReview(id, context) {
        return __awaiter(this, void 0, void 0, function* () {
            requireAdmin(context);
            return yield this.reviewModel.update(id, { isVerified: true });
        });
    }
    unverifyReview(id, context) {
        return __awaiter(this, void 0, void 0, function* () {
            requireAdmin(context);
            return yield this.reviewModel.update(id, { isVerified: false });
        });
    }
    publishReview(id, context) {
        return __awaiter(this, void 0, void 0, function* () {
            requireAdmin(context);
            return yield this.reviewModel.update(id, { isPublished: true });
        });
    }
    unpublishReview(id, context) {
        return __awaiter(this, void 0, void 0, function* () {
            requireAdmin(context);
            return yield this.reviewModel.update(id, { isPublished: false });
        });
    }
    deleteReviewAdmin(id, context) {
        return __awaiter(this, void 0, void 0, function* () {
            requireAdmin(context);
            const existingReview = yield this.reviewModel.findByIdAdmin(id);
            if (!existingReview) {
                throw new Error('Review not found');
            }
            return yield this.reviewModel.delete(id);
        });
    }
    deleteReviewResponseAdmin(id, context) {
        return __awaiter(this, void 0, void 0, function* () {
            requireAdmin(context);
            const existingResponse = yield this.reviewResponseModel.findById(id);
            if (!existingResponse) {
                throw new Error('Response not found');
            }
            return yield this.reviewResponseModel.delete(id);
        });
    }
    // Field resolver methods
    getReviewUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.reviewModel.findUserById(userId);
        });
    }
    getReviewVendor(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.reviewModel.findVendorById(vendorId);
        });
    }
    getReviewResponseByReview(reviewId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.reviewResponseModel.findByReviewId(reviewId);
        });
    }
    getResponseReview(reviewId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.reviewResponseModel.findReviewById(reviewId);
        });
    }
    getResponseVendor(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.reviewResponseModel.findVendorById(vendorId);
        });
    }
}
exports.ReviewService = ReviewService;
// Factory function for easy instantiation
const createReviewService = (context) => {
    return new ReviewService(context);
};
exports.createReviewService = createReviewService;
