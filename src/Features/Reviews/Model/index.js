"use strict";
// src/Features/Reviews/Models/ReviewModel.ts
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
exports.ReviewResponseModel = exports.ReviewModel = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const Schema_1 = require("../../../Schema");
class ReviewModel {
    constructor(db) {
        this.db = db;
    }
    // Reviews CRUD operations
    findReviews(filters, pagination) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = pagination || {};
            const offset = (page - 1) * limit;
            let conditions = [(0, drizzle_orm_1.eq)(Schema_1.reviews.isPublished, true)];
            if (filters) {
                if (filters.vendorId)
                    conditions.push((0, drizzle_orm_1.eq)(Schema_1.reviews.vendorId, filters.vendorId));
                if (filters.serviceType)
                    conditions.push((0, drizzle_orm_1.eq)(Schema_1.reviews.serviceType, filters.serviceType));
                if (filters.serviceId)
                    conditions.push((0, drizzle_orm_1.eq)(Schema_1.reviews.serviceId, filters.serviceId));
                if (filters.rating)
                    conditions.push((0, drizzle_orm_1.eq)(Schema_1.reviews.rating, filters.rating));
                if (filters.userId)
                    conditions.push((0, drizzle_orm_1.eq)(Schema_1.reviews.userId, filters.userId));
                if (filters.isVerified !== undefined)
                    conditions.push((0, drizzle_orm_1.eq)(Schema_1.reviews.isVerified, filters.isVerified));
            }
            const whereClause = conditions.length > 1 ? (0, drizzle_orm_1.and)(...conditions) : conditions[0];
            // Get total count
            const totalCountResult = yield this.db
                .select({ count: (0, drizzle_orm_1.count)() })
                .from(Schema_1.reviews)
                .where(whereClause);
            const totalCount = ((_a = totalCountResult[0]) === null || _a === void 0 ? void 0 : _a.count) || 0;
            // Get reviews with sorting and pagination
            const orderBy = sortOrder === 'asc' ? (0, drizzle_orm_1.asc)(Schema_1.reviews[sortBy]) : (0, drizzle_orm_1.desc)(Schema_1.reviews[sortBy]);
            const reviewsResult = yield this.db
                .select()
                .from(Schema_1.reviews)
                .where(whereClause)
                .orderBy(orderBy)
                .limit(limit)
                .offset(offset);
            const totalPages = Math.ceil(totalCount / limit);
            return {
                reviews: reviewsResult,
                totalCount,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
                currentPage: page,
                totalPages
            };
        });
    }
    findAllReviews(filters, pagination) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = pagination || {};
            const offset = (page - 1) * limit;
            let conditions = [];
            if (filters) {
                if (filters.vendorId)
                    conditions.push((0, drizzle_orm_1.eq)(Schema_1.reviews.vendorId, filters.vendorId));
                if (filters.serviceType)
                    conditions.push((0, drizzle_orm_1.eq)(Schema_1.reviews.serviceType, filters.serviceType));
                if (filters.serviceId)
                    conditions.push((0, drizzle_orm_1.eq)(Schema_1.reviews.serviceId, filters.serviceId));
                if (filters.rating)
                    conditions.push((0, drizzle_orm_1.eq)(Schema_1.reviews.rating, filters.rating));
                if (filters.userId)
                    conditions.push((0, drizzle_orm_1.eq)(Schema_1.reviews.userId, filters.userId));
                if (filters.isPublished !== undefined)
                    conditions.push((0, drizzle_orm_1.eq)(Schema_1.reviews.isPublished, filters.isPublished));
                if (filters.isVerified !== undefined)
                    conditions.push((0, drizzle_orm_1.eq)(Schema_1.reviews.isVerified, filters.isVerified));
            }
            const whereClause = conditions.length > 1 ? (0, drizzle_orm_1.and)(...conditions) : conditions.length === 1 ? conditions[0] : undefined;
            const totalCountResult = yield this.db
                .select({ count: (0, drizzle_orm_1.count)() })
                .from(Schema_1.reviews)
                .where(whereClause);
            const totalCount = ((_a = totalCountResult[0]) === null || _a === void 0 ? void 0 : _a.count) || 0;
            const orderBy = sortOrder === 'asc' ? (0, drizzle_orm_1.asc)(Schema_1.reviews[sortBy]) : (0, drizzle_orm_1.desc)(Schema_1.reviews[sortBy]);
            const reviewsResult = yield this.db
                .select()
                .from(Schema_1.reviews)
                .where(whereClause)
                .orderBy(orderBy)
                .limit(limit)
                .offset(offset);
            const totalPages = Math.ceil(totalCount / limit);
            return {
                reviews: reviewsResult,
                totalCount,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
                currentPage: page,
                totalPages
            };
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const review = yield this.db
                .select()
                .from(Schema_1.reviews)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.reviews.id, id), (0, drizzle_orm_1.eq)(Schema_1.reviews.isPublished, true)))
                .limit(1);
            return review[0] || null;
        });
    }
    findByIdAdmin(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const review = yield this.db
                .select()
                .from(Schema_1.reviews)
                .where((0, drizzle_orm_1.eq)(Schema_1.reviews.id, id))
                .limit(1);
            return review[0] || null;
        });
    }
    findByVendor(vendorId, pagination) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = pagination || {};
            const offset = (page - 1) * limit;
            const totalCountResult = yield this.db
                .select({ count: (0, drizzle_orm_1.count)() })
                .from(Schema_1.reviews)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.reviews.vendorId, vendorId), (0, drizzle_orm_1.eq)(Schema_1.reviews.isPublished, true)));
            const totalCount = ((_a = totalCountResult[0]) === null || _a === void 0 ? void 0 : _a.count) || 0;
            const orderBy = sortOrder === 'asc' ? (0, drizzle_orm_1.asc)(Schema_1.reviews[sortBy]) : (0, drizzle_orm_1.desc)(Schema_1.reviews[sortBy]);
            const reviewsResult = yield this.db
                .select()
                .from(Schema_1.reviews)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.reviews.vendorId, vendorId), (0, drizzle_orm_1.eq)(Schema_1.reviews.isPublished, true)))
                .orderBy(orderBy)
                .limit(limit)
                .offset(offset);
            const totalPages = Math.ceil(totalCount / limit);
            return {
                reviews: reviewsResult,
                totalCount,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
                currentPage: page,
                totalPages
            };
        });
    }
    findByUser(userId, pagination) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = pagination || {};
            const offset = (page - 1) * limit;
            const totalCountResult = yield this.db
                .select({ count: (0, drizzle_orm_1.count)() })
                .from(Schema_1.reviews)
                .where((0, drizzle_orm_1.eq)(Schema_1.reviews.userId, userId));
            const totalCount = ((_a = totalCountResult[0]) === null || _a === void 0 ? void 0 : _a.count) || 0;
            const orderBy = sortOrder === 'asc' ? (0, drizzle_orm_1.asc)(Schema_1.reviews[sortBy]) : (0, drizzle_orm_1.desc)(Schema_1.reviews[sortBy]);
            const reviewsResult = yield this.db
                .select()
                .from(Schema_1.reviews)
                .where((0, drizzle_orm_1.eq)(Schema_1.reviews.userId, userId))
                .orderBy(orderBy)
                .limit(limit)
                .offset(offset);
            const totalPages = Math.ceil(totalCount / limit);
            return {
                reviews: reviewsResult,
                totalCount,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
                currentPage: page,
                totalPages
            };
        });
    }
    findExistingReview(userId, serviceId, serviceType) {
        return __awaiter(this, void 0, void 0, function* () {
            const review = yield this.db
                .select()
                .from(Schema_1.reviews)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.reviews.userId, userId), (0, drizzle_orm_1.eq)(Schema_1.reviews.serviceId, serviceId), (0, drizzle_orm_1.eq)(Schema_1.reviews.serviceType, serviceType)))
                .limit(1);
            return review[0] || null;
        });
    }
    create(reviewData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.insert(Schema_1.reviews).values(reviewData);
            return reviewData;
        });
    }
    update(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db
                .update(Schema_1.reviews)
                .set(Object.assign(Object.assign({}, updateData), { updatedAt: new Date() }))
                .where((0, drizzle_orm_1.eq)(Schema_1.reviews.id, id));
            const updatedReview = yield this.db
                .select()
                .from(Schema_1.reviews)
                .where((0, drizzle_orm_1.eq)(Schema_1.reviews.id, id))
                .limit(1);
            return updatedReview[0];
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.delete(Schema_1.reviews).where((0, drizzle_orm_1.eq)(Schema_1.reviews.id, id));
            return true;
        });
    }
    // Review Statistics
    getVendorStats(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const statsQuery = yield this.db
                .select({
                totalReviews: (0, drizzle_orm_1.count)(),
                averageRating: (0, drizzle_orm_1.sql) `AVG(${Schema_1.reviews.rating})::float`,
            })
                .from(Schema_1.reviews)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.reviews.vendorId, vendorId), (0, drizzle_orm_1.eq)(Schema_1.reviews.isPublished, true)));
            const ratingDistribution = yield this.db
                .select({
                rating: Schema_1.reviews.rating,
                count: (0, drizzle_orm_1.count)(),
            })
                .from(Schema_1.reviews)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.reviews.vendorId, vendorId), (0, drizzle_orm_1.eq)(Schema_1.reviews.isPublished, true)))
                .groupBy(Schema_1.reviews.rating)
                .orderBy(Schema_1.reviews.rating);
            return {
                totalReviews: ((_a = statsQuery[0]) === null || _a === void 0 ? void 0 : _a.totalReviews) || 0,
                averageRating: Number((_b = statsQuery[0]) === null || _b === void 0 ? void 0 : _b.averageRating) || 0,
                ratingDistribution: ratingDistribution.map((item) => ({
                    rating: item.rating,
                    count: item.count
                }))
            };
        });
    }
    getServiceStats(serviceId, serviceType) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const statsQuery = yield this.db
                .select({
                totalReviews: (0, drizzle_orm_1.count)(),
                averageRating: (0, drizzle_orm_1.sql) `AVG(${Schema_1.reviews.rating})::float`,
            })
                .from(Schema_1.reviews)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.reviews.serviceId, serviceId), (0, drizzle_orm_1.eq)(Schema_1.reviews.serviceType, serviceType), (0, drizzle_orm_1.eq)(Schema_1.reviews.isPublished, true)));
            const ratingDistribution = yield this.db
                .select({
                rating: Schema_1.reviews.rating,
                count: (0, drizzle_orm_1.count)(),
            })
                .from(Schema_1.reviews)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.reviews.serviceId, serviceId), (0, drizzle_orm_1.eq)(Schema_1.reviews.serviceType, serviceType), (0, drizzle_orm_1.eq)(Schema_1.reviews.isPublished, true)))
                .groupBy(Schema_1.reviews.rating)
                .orderBy(Schema_1.reviews.rating);
            return {
                totalReviews: ((_a = statsQuery[0]) === null || _a === void 0 ? void 0 : _a.totalReviews) || 0,
                averageRating: Number((_b = statsQuery[0]) === null || _b === void 0 ? void 0 : _b.averageRating) || 0,
                ratingDistribution: ratingDistribution.map((item) => ({
                    rating: item.rating,
                    count: item.count
                }))
            };
        });
    }
    // Related entities
    findUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userResult = yield this.db
                .select()
                .from(Schema_1.users)
                .where((0, drizzle_orm_1.eq)(Schema_1.users.id, userId))
                .limit(1);
            return userResult[0] || null;
        });
    }
    findVendorById(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const vendorResult = yield this.db
                .select()
                .from(Schema_1.vendors)
                .where((0, drizzle_orm_1.eq)(Schema_1.vendors.id, vendorId))
                .limit(1);
            return vendorResult[0] || null;
        });
    }
}
exports.ReviewModel = ReviewModel;
class ReviewResponseModel {
    constructor(db) {
        this.db = db;
    }
    findByReviewId(reviewId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.db
                .select()
                .from(Schema_1.reviewResponses)
                .where((0, drizzle_orm_1.eq)(Schema_1.reviewResponses.reviewId, reviewId))
                .limit(1);
            return response[0] || null;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.db
                .select()
                .from(Schema_1.reviewResponses)
                .where((0, drizzle_orm_1.eq)(Schema_1.reviewResponses.id, id))
                .limit(1);
            return response[0] || null;
        });
    }
    create(responseData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.insert(Schema_1.reviewResponses).values(responseData);
            return responseData;
        });
    }
    update(id, responseText) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db
                .update(Schema_1.reviewResponses)
                .set({
                responseText,
                updatedAt: new Date(),
            })
                .where((0, drizzle_orm_1.eq)(Schema_1.reviewResponses.id, id));
            const updatedResponse = yield this.db
                .select()
                .from(Schema_1.reviewResponses)
                .where((0, drizzle_orm_1.eq)(Schema_1.reviewResponses.id, id))
                .limit(1);
            return updatedResponse[0];
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.delete(Schema_1.reviewResponses).where((0, drizzle_orm_1.eq)(Schema_1.reviewResponses.id, id));
            return true;
        });
    }
    // Related entities
    findReviewById(reviewId) {
        return __awaiter(this, void 0, void 0, function* () {
            const reviewResult = yield this.db
                .select()
                .from(Schema_1.reviews)
                .where((0, drizzle_orm_1.eq)(Schema_1.reviews.id, reviewId))
                .limit(1);
            return reviewResult[0] || null;
        });
    }
    findVendorById(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const vendorResult = yield this.db
                .select()
                .from(Schema_1.vendors)
                .where((0, drizzle_orm_1.eq)(Schema_1.vendors.id, vendorId))
                .limit(1);
            return vendorResult[0] || null;
        });
    }
}
exports.ReviewResponseModel = ReviewResponseModel;
