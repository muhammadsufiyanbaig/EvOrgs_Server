"use strict";
// services/blog.service.ts
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
exports.BlogService = void 0;
const graphql_1 = require("graphql");
const uuid_1 = require("uuid");
class BlogService {
    constructor(blogModel) {
        this.blogModel = blogModel;
    }
    // Helper Methods
    generateSlug(title) {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    }
    canManageBlog(blog, authorId, authorRole, isAdmin = false) {
        if (isAdmin)
            return true; // Admins can manage all blogs
        if (blog.authorRole === authorRole && blog.authorId === authorId)
            return true;
        return false;
    }
    calculatePaginationMeta(totalCount, page, limit) {
        const totalPages = Math.ceil(totalCount / limit);
        return {
            totalCount,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
            currentPage: page,
            totalPages,
        };
    }
    // Blog Operations
    getBlogs(filters, pagination) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page = 1, limit = 10 } = pagination || {};
            const { blogs, totalCount } = yield this.blogModel.getBlogs(filters, pagination);
            const paginationMeta = this.calculatePaginationMeta(totalCount, page, limit);
            return Object.assign({ blogs }, paginationMeta);
        });
    }
    getBlog(id, slug) {
        return __awaiter(this, void 0, void 0, function* () {
            let blog = null;
            if (id) {
                blog = yield this.blogModel.getBlogById(id);
            }
            else if (slug) {
                blog = yield this.blogModel.getBlogBySlug(slug);
            }
            if (!blog) {
                throw new graphql_1.GraphQLError('Blog not found', { extensions: { code: 'NOT_FOUND' } });
            }
            // Increment view count
            yield this.blogModel.incrementViewCount(blog.id);
            return Object.assign(Object.assign({}, blog), { viewCount: blog.viewCount + 1 });
        });
    }
    getMyBlogs(authorId, authorRole, pagination) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page = 1, limit = 10 } = pagination || {};
            const { blogs, totalCount } = yield this.blogModel.getBlogsByAuthor(authorId, authorRole, pagination);
            const paginationMeta = this.calculatePaginationMeta(totalCount, page, limit);
            return Object.assign({ blogs }, paginationMeta);
        });
    }
    getPopularBlogs() {
        return __awaiter(this, arguments, void 0, function* (limit = 10) {
            return yield this.blogModel.getPopularBlogs(limit);
        });
    }
    getRecentBlogs() {
        return __awaiter(this, arguments, void 0, function* (limit = 10) {
            return yield this.blogModel.getRecentBlogs(limit);
        });
    }
    searchBlogs(query, pagination) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page = 1, limit = 10 } = pagination || {};
            const { blogs, totalCount } = yield this.blogModel.searchBlogs(query, pagination);
            const paginationMeta = this.calculatePaginationMeta(totalCount, page, limit);
            return Object.assign({ blogs }, paginationMeta);
        });
    }
    createBlog(input, authorId, authorRole) {
        return __awaiter(this, void 0, void 0, function* () {
            const slug = this.generateSlug(input.title);
            // Check if slug already exists
            const existingBlog = yield this.blogModel.getBlogBySlug(slug);
            if (existingBlog) {
                throw new graphql_1.GraphQLError('A blog with this title already exists', {
                    extensions: { code: 'DUPLICATE_SLUG' }
                });
            }
            const blogData = {
                id: (0, uuid_1.v4)(),
                authorId,
                authorRole,
                title: input.title,
                slug,
                summary: input.summary,
                content: input.content,
                featuredImage: input.featuredImage,
                tags: input.tags || [],
                status: input.status || 'Published',
                viewCount: 0,
                publishedAt: input.status === 'Published' ? new Date() : null,
            };
            return yield this.blogModel.createBlog(blogData);
        });
    }
    updateBlog(id_1, input_1, authorId_1, authorRole_1) {
        return __awaiter(this, arguments, void 0, function* (id, input, authorId, authorRole, isAdmin = false) {
            const blog = yield this.blogModel.getBlogById(id);
            if (!blog) {
                throw new graphql_1.GraphQLError('Blog not found', { extensions: { code: 'NOT_FOUND' } });
            }
            if (!this.canManageBlog(blog, authorId, authorRole, isAdmin)) {
                throw new graphql_1.GraphQLError('Not authorized to update this blog', {
                    extensions: { code: 'FORBIDDEN' }
                });
            }
            const updateData = Object.assign({}, input);
            // Generate new slug if title is being updated
            if (input.title && input.title !== blog.title) {
                updateData.slug = this.generateSlug(input.title);
            }
            // Set publishedAt if status is being changed to Published
            if (input.status === 'Published' && blog.status !== 'Published') {
                updateData.publishedAt = new Date();
            }
            const updatedBlog = yield this.blogModel.updateBlog(id, updateData);
            if (!updatedBlog) {
                throw new graphql_1.GraphQLError('Failed to update blog', { extensions: { code: 'UPDATE_FAILED' } });
            }
            return updatedBlog;
        });
    }
    deleteBlog(id_1, authorId_1, authorRole_1) {
        return __awaiter(this, arguments, void 0, function* (id, authorId, authorRole, isAdmin = false) {
            const blog = yield this.blogModel.getBlogById(id);
            if (!blog) {
                throw new graphql_1.GraphQLError('Blog not found', { extensions: { code: 'NOT_FOUND' } });
            }
            if (!this.canManageBlog(blog, authorId, authorRole, isAdmin)) {
                throw new graphql_1.GraphQLError('Not authorized to delete this blog', {
                    extensions: { code: 'FORBIDDEN' }
                });
            }
            return yield this.blogModel.deleteBlog(id);
        });
    }
    publishBlog(id_1, authorId_1, authorRole_1) {
        return __awaiter(this, arguments, void 0, function* (id, authorId, authorRole, isAdmin = false) {
            const blog = yield this.blogModel.getBlogById(id);
            if (!blog) {
                throw new graphql_1.GraphQLError('Blog not found', { extensions: { code: 'NOT_FOUND' } });
            }
            if (!this.canManageBlog(blog, authorId, authorRole, isAdmin)) {
                throw new graphql_1.GraphQLError('Not authorized to publish this blog', {
                    extensions: { code: 'FORBIDDEN' }
                });
            }
            const updatedBlog = yield this.blogModel.updateBlog(id, {
                status: 'Published',
                publishedAt: new Date(),
            });
            if (!updatedBlog) {
                throw new graphql_1.GraphQLError('Failed to publish blog', { extensions: { code: 'UPDATE_FAILED' } });
            }
            return updatedBlog;
        });
    }
    archiveBlog(id_1, authorId_1, authorRole_1) {
        return __awaiter(this, arguments, void 0, function* (id, authorId, authorRole, isAdmin = false) {
            const blog = yield this.blogModel.getBlogById(id);
            if (!blog) {
                throw new graphql_1.GraphQLError('Blog not found', { extensions: { code: 'NOT_FOUND' } });
            }
            if (!this.canManageBlog(blog, authorId, authorRole, isAdmin)) {
                throw new graphql_1.GraphQLError('Not authorized to archive this blog', {
                    extensions: { code: 'FORBIDDEN' }
                });
            }
            const updatedBlog = yield this.blogModel.updateBlog(id, {
                status: 'Archived',
            });
            if (!updatedBlog) {
                throw new graphql_1.GraphQLError('Failed to archive blog', { extensions: { code: 'UPDATE_FAILED' } });
            }
            return updatedBlog;
        });
    }
    // Comment Operations
    addComment(blogId, comment, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield this.blogModel.getBlogById(blogId);
            if (!blog) {
                throw new graphql_1.GraphQLError('Blog not found', { extensions: { code: 'NOT_FOUND' } });
            }
            const commentData = {
                id: (0, uuid_1.v4)(),
                blogId,
                userId,
                comment,
                isApproved: true, // Auto-approve for now
            };
            return yield this.blogModel.createComment(commentData);
        });
    }
    updateComment(id_1, comment_1, userId_1) {
        return __awaiter(this, arguments, void 0, function* (id, comment, userId, isAdmin = false) {
            const existingComment = yield this.blogModel.getCommentById(id);
            if (!existingComment) {
                throw new graphql_1.GraphQLError('Comment not found', { extensions: { code: 'NOT_FOUND' } });
            }
            if (existingComment.userId !== userId && !isAdmin) {
                throw new graphql_1.GraphQLError('Not authorized to update this comment', {
                    extensions: { code: 'FORBIDDEN' }
                });
            }
            const updatedComment = yield this.blogModel.updateComment(id, comment);
            if (!updatedComment) {
                throw new graphql_1.GraphQLError('Failed to update comment', { extensions: { code: 'UPDATE_FAILED' } });
            }
            return updatedComment;
        });
    }
    deleteComment(id_1, userId_1) {
        return __awaiter(this, arguments, void 0, function* (id, userId, isAdmin = false) {
            const comment = yield this.blogModel.getCommentById(id);
            if (!comment) {
                throw new graphql_1.GraphQLError('Comment not found', { extensions: { code: 'NOT_FOUND' } });
            }
            if (comment.userId !== userId && !isAdmin) {
                throw new graphql_1.GraphQLError('Not authorized to delete this comment', {
                    extensions: { code: 'FORBIDDEN' }
                });
            }
            return yield this.blogModel.deleteComment(id);
        });
    }
    approveComment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedComment = yield this.blogModel.approveComment(id);
            if (!updatedComment) {
                throw new graphql_1.GraphQLError('Comment not found', { extensions: { code: 'NOT_FOUND' } });
            }
            return updatedComment;
        });
    }
    // Like Operations
    likeBlog(blogId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if user already liked this blog
            const existingLike = yield this.blogModel.getLikeByBlogAndUser(blogId, userId);
            if (existingLike) {
                throw new graphql_1.GraphQLError('You have already liked this blog', {
                    extensions: { code: 'ALREADY_LIKED' }
                });
            }
            const likeData = {
                id: (0, uuid_1.v4)(),
                blogId,
                userId,
            };
            return yield this.blogModel.createLike(likeData);
        });
    }
    unlikeBlog(blogId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.blogModel.deleteLike(blogId, userId);
        });
    }
    // Field Resolver Helpers
    getBlogAuthor(blog) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.blogModel.getAuthorByIdAndRole(blog.authorId, blog.authorRole);
        });
    }
    getBlogComments(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.blogModel.getCommentsByBlogId(blogId);
        });
    }
    getBlogLikes(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.blogModel.getLikesByBlogId(blogId);
        });
    }
    getBlogLikesCount(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.blogModel.getLikesCount(blogId);
        });
    }
    getBlogCommentsCount(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.blogModel.getCommentsCount(blogId);
        });
    }
    getCommentUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.blogModel.getUserById(userId);
        });
    }
    getLikeUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.blogModel.getUserById(userId);
        });
    }
}
exports.BlogService = BlogService;
