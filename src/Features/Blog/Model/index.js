"use strict";
// models/blog.model.ts
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
exports.BlogModel = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const Schema_1 = require("../../../Schema");
class BlogModel {
    constructor(db) {
        this.db = db;
    }
    // Blog CRUD Operations
    createBlog(blogData) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBlog = Object.assign(Object.assign({}, blogData), { createdAt: new Date(), updatedAt: new Date() });
            yield this.db.insert(Schema_1.blogs).values(newBlog);
            return newBlog;
        });
    }
    getBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db.select().from(Schema_1.blogs).where((0, drizzle_orm_1.eq)(Schema_1.blogs.id, id)).limit(1);
            return result[0] || null;
        });
    }
    getBlogBySlug(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db.select().from(Schema_1.blogs).where((0, drizzle_orm_1.eq)(Schema_1.blogs.slug, slug)).limit(1);
            return result[0] || null;
        });
    }
    updateBlog(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataWithTimestamp = Object.assign(Object.assign({}, updateData), { updatedAt: new Date() });
            yield this.db.update(Schema_1.blogs).set(dataWithTimestamp).where((0, drizzle_orm_1.eq)(Schema_1.blogs.id, id));
            return this.getBlogById(id);
        });
    }
    deleteBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.delete(Schema_1.blogs).where((0, drizzle_orm_1.eq)(Schema_1.blogs.id, id));
            return true;
        });
    }
    incrementViewCount(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db
                .update(Schema_1.blogs)
                .set({ viewCount: (0, drizzle_orm_1.sql) `${Schema_1.blogs.viewCount} + 1`, updatedAt: new Date() })
                .where((0, drizzle_orm_1.eq)(Schema_1.blogs.id, id));
        });
    }
    // Blog Queries
    getBlogs(filters, pagination) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { page = 1, limit = 10 } = pagination || {};
            const offset = (page - 1) * limit;
            let query = this.db.select().from(Schema_1.blogs);
            let countQuery = this.db.select({ count: (0, drizzle_orm_1.sql) `count(*)` }).from(Schema_1.blogs);
            if (filters) {
                const conditions = this.buildFilterConditions(filters);
                if (conditions.length > 0) {
                    const whereClause = (0, drizzle_orm_1.and)(...conditions);
                    query = query.where(whereClause);
                    countQuery = countQuery.where(whereClause);
                }
            }
            const [blogList, totalCountResult] = yield Promise.all([
                query.orderBy((0, drizzle_orm_1.desc)(Schema_1.blogs.createdAt)).limit(limit).offset(offset),
                countQuery
            ]);
            const totalCount = Number(((_a = totalCountResult[0]) === null || _a === void 0 ? void 0 : _a.count) || 0);
            return {
                blogs: blogList,
                totalCount,
            };
        });
    }
    getBlogsByAuthor(authorId, authorRole, pagination) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { page = 1, limit = 10 } = pagination || {};
            const offset = (page - 1) * limit;
            const whereClause = (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.blogs.authorId, authorId), (0, drizzle_orm_1.eq)(Schema_1.blogs.authorRole, authorRole));
            const [blogList, totalCountResult] = yield Promise.all([
                this.db
                    .select()
                    .from(Schema_1.blogs)
                    .where(whereClause)
                    .orderBy((0, drizzle_orm_1.desc)(Schema_1.blogs.createdAt))
                    .limit(limit)
                    .offset(offset),
                this.db
                    .select({ count: (0, drizzle_orm_1.sql) `count(*)` })
                    .from(Schema_1.blogs)
                    .where(whereClause)
            ]);
            const totalCount = Number(((_a = totalCountResult[0]) === null || _a === void 0 ? void 0 : _a.count) || 0);
            return {
                blogs: blogList,
                totalCount,
            };
        });
    }
    getPopularBlogs() {
        return __awaiter(this, arguments, void 0, function* (limit = 10) {
            return yield this.db
                .select()
                .from(Schema_1.blogs)
                .where((0, drizzle_orm_1.eq)(Schema_1.blogs.status, 'Published'))
                .orderBy((0, drizzle_orm_1.desc)(Schema_1.blogs.viewCount))
                .limit(limit);
        });
    }
    getRecentBlogs() {
        return __awaiter(this, arguments, void 0, function* (limit = 10) {
            return yield this.db
                .select()
                .from(Schema_1.blogs)
                .where((0, drizzle_orm_1.eq)(Schema_1.blogs.status, 'Published'))
                .orderBy((0, drizzle_orm_1.desc)(Schema_1.blogs.publishedAt))
                .limit(limit);
        });
    }
    searchBlogs(query, pagination) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { page = 1, limit = 10 } = pagination || {};
            const offset = (page - 1) * limit;
            const searchCondition = (0, drizzle_orm_1.sql) `(
      ${Schema_1.blogs.title} ILIKE ${`%${query}%`} OR 
      ${Schema_1.blogs.summary} ILIKE ${`%${query}%`} OR 
      ${Schema_1.blogs.content} ILIKE ${`%${query}%`}
    )`;
            const whereClause = (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.blogs.status, 'Published'), searchCondition);
            const [blogList, totalCountResult] = yield Promise.all([
                this.db
                    .select()
                    .from(Schema_1.blogs)
                    .where(whereClause)
                    .orderBy((0, drizzle_orm_1.desc)(Schema_1.blogs.createdAt))
                    .limit(limit)
                    .offset(offset),
                this.db
                    .select({ count: (0, drizzle_orm_1.sql) `count(*)` })
                    .from(Schema_1.blogs)
                    .where(whereClause)
            ]);
            const totalCount = Number(((_a = totalCountResult[0]) === null || _a === void 0 ? void 0 : _a.count) || 0);
            return {
                blogs: blogList,
                totalCount,
            };
        });
    }
    // Author Operations
    getAuthorByIdAndRole(authorId, authorRole) {
        return __awaiter(this, void 0, void 0, function* () {
            if (authorRole === 'Vendor') {
                const result = yield this.db.select().from(Schema_1.vendors).where((0, drizzle_orm_1.eq)(Schema_1.vendors.id, authorId)).limit(1);
                return result[0] || null;
            }
            else if (authorRole === 'Admin') {
                const result = yield this.db.select().from(Schema_1.admin).where((0, drizzle_orm_1.eq)(Schema_1.admin.id, authorId)).limit(1);
                return result[0] || null;
            }
            return null;
        });
    }
    // Comment Operations
    createComment(commentData) {
        return __awaiter(this, void 0, void 0, function* () {
            const newComment = Object.assign(Object.assign({}, commentData), { createdAt: new Date(), updatedAt: new Date() });
            yield this.db.insert(Schema_1.blogComments).values(newComment);
            return newComment;
        });
    }
    getCommentById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db.select().from(Schema_1.blogComments).where((0, drizzle_orm_1.eq)(Schema_1.blogComments.id, id)).limit(1);
            return result[0] || null;
        });
    }
    updateComment(id, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db
                .update(Schema_1.blogComments)
                .set({ comment, updatedAt: new Date() })
                .where((0, drizzle_orm_1.eq)(Schema_1.blogComments.id, id));
            return this.getCommentById(id);
        });
    }
    deleteComment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.delete(Schema_1.blogComments).where((0, drizzle_orm_1.eq)(Schema_1.blogComments.id, id));
            return true;
        });
    }
    approveComment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db
                .update(Schema_1.blogComments)
                .set({ isApproved: true, updatedAt: new Date() })
                .where((0, drizzle_orm_1.eq)(Schema_1.blogComments.id, id));
            return this.getCommentById(id);
        });
    }
    getCommentsByBlogId(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db
                .select()
                .from(Schema_1.blogComments)
                .where((0, drizzle_orm_1.eq)(Schema_1.blogComments.blogId, blogId))
                .orderBy((0, drizzle_orm_1.desc)(Schema_1.blogComments.createdAt));
        });
    }
    getCommentsCount(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const result = yield this.db
                .select({ count: (0, drizzle_orm_1.sql) `count(*)` })
                .from(Schema_1.blogComments)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.blogComments.blogId, blogId), (0, drizzle_orm_1.eq)(Schema_1.blogComments.isApproved, true)));
            return Number(((_a = result[0]) === null || _a === void 0 ? void 0 : _a.count) || 0);
        });
    }
    // Like Operations
    createLike(likeData) {
        return __awaiter(this, void 0, void 0, function* () {
            const newLike = Object.assign(Object.assign({}, likeData), { createdAt: new Date() });
            yield this.db.insert(Schema_1.blogLikes).values(newLike);
            return newLike;
        });
    }
    deleteLike(blogId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db
                .delete(Schema_1.blogLikes)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.blogLikes.blogId, blogId), (0, drizzle_orm_1.eq)(Schema_1.blogLikes.userId, userId)));
            return true;
        });
    }
    getLikeByBlogAndUser(blogId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db
                .select()
                .from(Schema_1.blogLikes)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.blogLikes.blogId, blogId), (0, drizzle_orm_1.eq)(Schema_1.blogLikes.userId, userId)))
                .limit(1);
            return result[0] || null;
        });
    }
    getLikesByBlogId(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db
                .select()
                .from(Schema_1.blogLikes)
                .where((0, drizzle_orm_1.eq)(Schema_1.blogLikes.blogId, blogId))
                .orderBy((0, drizzle_orm_1.desc)(Schema_1.blogLikes.createdAt));
        });
    }
    getLikesCount(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const result = yield this.db
                .select({ count: (0, drizzle_orm_1.sql) `count(*)` })
                .from(Schema_1.blogLikes)
                .where((0, drizzle_orm_1.eq)(Schema_1.blogLikes.blogId, blogId));
            return Number(((_a = result[0]) === null || _a === void 0 ? void 0 : _a.count) || 0);
        });
    }
    // User Operations
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db.select().from(Schema_1.users).where((0, drizzle_orm_1.eq)(Schema_1.users.id, id)).limit(1);
            return result[0] || null;
        });
    }
    // Helper Methods
    buildFilterConditions(filters) {
        const conditions = [];
        if (filters.status) {
            conditions.push((0, drizzle_orm_1.eq)(Schema_1.blogs.status, filters.status));
        }
        if (filters.authorRole) {
            conditions.push((0, drizzle_orm_1.eq)(Schema_1.blogs.authorRole, filters.authorRole));
        }
        if (filters.authorId) {
            conditions.push((0, drizzle_orm_1.eq)(Schema_1.blogs.authorId, filters.authorId));
        }
        if (filters.tags && filters.tags.length > 0) {
            conditions.push((0, drizzle_orm_1.sql) `${Schema_1.blogs.tags} && ${filters.tags}`);
        }
        return conditions.filter(Boolean);
    }
}
exports.BlogModel = BlogModel;
