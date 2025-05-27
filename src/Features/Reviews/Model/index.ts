// src/Features/Reviews/Models/ReviewModel.ts

import { eq, and, desc, asc, sql, count } from 'drizzle-orm';
import { reviews, reviewResponses, users, vendors } from '../../../Schema';
import { Context } from '../../../GraphQL/Context';
import { ReviewFilters, PaginationInput } from '../Types';

export class ReviewModel {
  private db: Context['db'];

  constructor(db: Context['db']) {
    this.db = db;
  }

  // Reviews CRUD operations
  async findReviews(filters?: ReviewFilters, pagination?: PaginationInput) {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = pagination || {};
    const offset = (page - 1) * limit;

    let conditions = [eq(reviews.isPublished, true)];

    if (filters) {
      if (filters.vendorId) conditions.push(eq(reviews.vendorId, filters.vendorId));
      if (filters.serviceType) conditions.push(eq(reviews.serviceType, filters.serviceType));
      if (filters.serviceId) conditions.push(eq(reviews.serviceId, filters.serviceId));
      if (filters.rating) conditions.push(eq(reviews.rating, filters.rating));
      if (filters.userId) conditions.push(eq(reviews.userId, filters.userId));
      if (filters.isVerified !== undefined) conditions.push(eq(reviews.isVerified, filters.isVerified));
    }

    const whereClause = conditions.length > 1 ? and(...conditions) : conditions[0];
    
    // Get total count
    const totalCountResult = await this.db
      .select({ count: count() })
      .from(reviews)
      .where(whereClause);
    
    const totalCount = totalCountResult[0]?.count || 0;

    // Get reviews with sorting and pagination
    const orderBy = sortOrder === 'asc' ? asc(reviews[sortBy]) : desc(reviews[sortBy]);
    
    const reviewsResult = await this.db
      .select()
      .from(reviews)
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
  }

  async findAllReviews(filters?: ReviewFilters, pagination?: PaginationInput) {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = pagination || {};
    const offset = (page - 1) * limit;

    let conditions = [];

    if (filters) {
      if (filters.vendorId) conditions.push(eq(reviews.vendorId, filters.vendorId));
      if (filters.serviceType) conditions.push(eq(reviews.serviceType, filters.serviceType));
      if (filters.serviceId) conditions.push(eq(reviews.serviceId, filters.serviceId));
      if (filters.rating) conditions.push(eq(reviews.rating, filters.rating));
      if (filters.userId) conditions.push(eq(reviews.userId, filters.userId));
      if (filters.isPublished !== undefined) conditions.push(eq(reviews.isPublished, filters.isPublished));
      if (filters.isVerified !== undefined) conditions.push(eq(reviews.isVerified, filters.isVerified));
    }

    const whereClause = conditions.length > 1 ? and(...conditions) : conditions.length === 1 ? conditions[0] : undefined;
    
    const totalCountResult = await this.db
      .select({ count: count() })
      .from(reviews)
      .where(whereClause);
    
    const totalCount = totalCountResult[0]?.count || 0;

    const orderBy = sortOrder === 'asc' ? asc(reviews[sortBy]) : desc(reviews[sortBy]);
    
    const reviewsResult = await this.db
      .select()
      .from(reviews)
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
  }

  async findById(id: string) {
    const review = await this.db
      .select()
      .from(reviews)
      .where(and(eq(reviews.id, id), eq(reviews.isPublished, true)))
      .limit(1);
    
    return review[0] || null;
  }

  async findByIdAdmin(id: string) {
    const review = await this.db
      .select()
      .from(reviews)
      .where(eq(reviews.id, id))
      .limit(1);
    
    return review[0] || null;
  }

  async findByVendor(vendorId: string, pagination?: PaginationInput) {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = pagination || {};
    const offset = (page - 1) * limit;

    const totalCountResult = await this.db
      .select({ count: count() })
      .from(reviews)
      .where(and(eq(reviews.vendorId, vendorId), eq(reviews.isPublished, true)));
    
    const totalCount = totalCountResult[0]?.count || 0;

    const orderBy = sortOrder === 'asc' ? asc(reviews[sortBy]) : desc(reviews[sortBy]);
    
    const reviewsResult = await this.db
      .select()
      .from(reviews)
      .where(and(eq(reviews.vendorId, vendorId), eq(reviews.isPublished, true)))
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
  }

  async findByUser(userId: string, pagination?: PaginationInput) {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = pagination || {};
    const offset = (page - 1) * limit;

    const totalCountResult = await this.db
      .select({ count: count() })
      .from(reviews)
      .where(eq(reviews.userId, userId));
    
    const totalCount = totalCountResult[0]?.count || 0;

    const orderBy = sortOrder === 'asc' ? asc(reviews[sortBy]) : desc(reviews[sortBy]);
    
    const reviewsResult = await this.db
      .select()
      .from(reviews)
      .where(eq(reviews.userId, userId))
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
  }

  async findExistingReview(userId: string, serviceId: string, serviceType: string) {
    const review = await this.db
      .select()
      .from(reviews)
      .where(and(
        eq(reviews.userId, userId),
        eq(reviews.serviceId, serviceId),
        eq(reviews.serviceType, serviceType as "FarmHouse" | "Venue" | "CateringPackage" | "PhotographyPackage")
      ))
      .limit(1);

    return review[0] || null;
  }

  async create(reviewData: any) {
    await this.db.insert(reviews).values(reviewData);
    return reviewData;
  }

  async update(id: string, updateData: any) {
    await this.db
      .update(reviews)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(reviews.id, id));

    const updatedReview = await this.db
      .select()
      .from(reviews)
      .where(eq(reviews.id, id))
      .limit(1);

    return updatedReview[0];
  }

  async delete(id: string) {
    await this.db.delete(reviews).where(eq(reviews.id, id));
    return true;
  }

  // Review Statistics
  async getVendorStats(vendorId: string) {
    const statsQuery = await this.db
      .select({
        totalReviews: count(),
        averageRating: sql<number>`AVG(${reviews.rating})::float`,
      })
      .from(reviews)
      .where(and(eq(reviews.vendorId, vendorId), eq(reviews.isPublished, true)));

    const ratingDistribution = await this.db
      .select({
        rating: reviews.rating,
        count: count(),
      })
      .from(reviews)
      .where(and(eq(reviews.vendorId, vendorId), eq(reviews.isPublished, true)))
      .groupBy(reviews.rating)
      .orderBy(reviews.rating);

    return {
      totalReviews: statsQuery[0]?.totalReviews || 0,
      averageRating: Number(statsQuery[0]?.averageRating) || 0,
      ratingDistribution: ratingDistribution.map((item: { rating: any; count: any; }) => ({
        rating: item.rating,
        count: item.count
      }))
    };
  }

  async getServiceStats(serviceId: string, serviceType: string) {
    const statsQuery = await this.db
      .select({
        totalReviews: count(),
        averageRating: sql<number>`AVG(${reviews.rating})::float`,
      })
      .from(reviews)
      .where(and(
        eq(reviews.serviceId, serviceId),
        eq(reviews.serviceType, serviceType as any),
        eq(reviews.isPublished, true)
      ));

    const ratingDistribution = await this.db
      .select({
        rating: reviews.rating,
        count: count(),
      })
      .from(reviews)
      .where(and(
        eq(reviews.serviceId, serviceId),
        eq(reviews.serviceType, serviceType as any),
        eq(reviews.isPublished, true)
      ))
      .groupBy(reviews.rating)
      .orderBy(reviews.rating);

    return {
      totalReviews: statsQuery[0]?.totalReviews || 0,
      averageRating: Number(statsQuery[0]?.averageRating) || 0,
      ratingDistribution: ratingDistribution.map((item: { rating: any; count: any; }) => ({
        rating: item.rating,
        count: item.count
      }))
    };
  }

  // Related entities
  async findUserById(userId: string) {
    const userResult = await this.db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    
    return userResult[0] || null;
  }

  async findVendorById(vendorId: string) {
    const vendorResult = await this.db
      .select()
      .from(vendors)
      .where(eq(vendors.id, vendorId))
      .limit(1);
    
    return vendorResult[0] || null;
  }
}

export class ReviewResponseModel {
  private db: Context['db'];

  constructor(db: Context['db']) {
    this.db = db;
  }

  async findByReviewId(reviewId: string) {
    const response = await this.db
      .select()
      .from(reviewResponses)
      .where(eq(reviewResponses.reviewId, reviewId))
      .limit(1);
    
    return response[0] || null;
  }

  async findById(id: string) {
    const response = await this.db
      .select()
      .from(reviewResponses)
      .where(eq(reviewResponses.id, id))
      .limit(1);
    
    return response[0] || null;
  }

  async create(responseData: any) {
    await this.db.insert(reviewResponses).values(responseData);
    return responseData;
  }

  async update(id: string, responseText: string) {
    await this.db
      .update(reviewResponses)
      .set({
        responseText,
        updatedAt: new Date(),
      })
      .where(eq(reviewResponses.id, id));

    const updatedResponse = await this.db
      .select()
      .from(reviewResponses)
      .where(eq(reviewResponses.id, id))
      .limit(1);

    return updatedResponse[0];
  }

  async delete(id: string) {
    await this.db.delete(reviewResponses).where(eq(reviewResponses.id, id));
    return true;
  }

  // Related entities
  async findReviewById(reviewId: string) {
    const reviewResult = await this.db
      .select()
      .from(reviews)
      .where(eq(reviews.id, reviewId))
      .limit(1);
    
    return reviewResult[0] || null;
  }

  async findVendorById(vendorId: string) {
    const vendorResult = await this.db
      .select()
      .from(vendors)
      .where(eq(vendors.id, vendorId))
      .limit(1);
    
    return vendorResult[0] || null;
  }
}