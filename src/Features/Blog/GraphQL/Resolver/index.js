"use strict";
// resolvers/blog.resolvers.ts
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
exports.createBlogContext = exports.blogTypeResolvers = exports.blogMutationResolvers = exports.blogQueryResolvers = exports.blogResolvers = void 0;
const graphql_1 = require("graphql");
exports.blogResolvers = {
    // Query Resolvers
    Query: {
        getBlogs: (_1, _a, _b) => __awaiter(void 0, [_1, _a, _b], void 0, function* (_, { filters, pagination }, { blogService }) {
            try {
                return yield blogService.getBlogs(filters, pagination);
            }
            catch (error) {
                throw new graphql_1.GraphQLError(`Failed to fetch blogs: ${error.message}`);
            }
        }),
        getBlog: (_1, _a, _b) => __awaiter(void 0, [_1, _a, _b], void 0, function* (_, { id, slug }, { blogService }) {
            try {
                if (!id && !slug) {
                    throw new graphql_1.GraphQLError('Either id or slug must be provided');
                }
                return yield blogService.getBlog(id, slug);
            }
            catch (error) {
                throw error; // Let service handle the specific error
            }
        }),
        getMyBlogs: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { pagination }, context) {
            var _b, _c;
            try {
                // Authentication check
                if (!context.vendor && !context.Admin) {
                    throw new graphql_1.GraphQLError('Authentication required', { extensions: { code: 'UNAUTHENTICATED' } });
                }
                const authorId = ((_b = context.vendor) === null || _b === void 0 ? void 0 : _b.id) || ((_c = context.Admin) === null || _c === void 0 ? void 0 : _c.id);
                const authorRole = context.vendor ? 'Vendor' : 'Admin';
                if (!authorId) {
                    throw new graphql_1.GraphQLError('Invalid user context', { extensions: { code: 'INVALID_CONTEXT' } });
                }
                return yield context.blogService.getMyBlogs(authorId, authorRole, pagination);
            }
            catch (error) {
                throw error;
            }
        }),
        getPopularBlogs: (_1, _a, _b) => __awaiter(void 0, [_1, _a, _b], void 0, function* (_, { limit = 10 }, { blogService }) {
            try {
                return yield blogService.getPopularBlogs(limit);
            }
            catch (error) {
                throw new graphql_1.GraphQLError(`Failed to fetch popular blogs: ${error.message}`);
            }
        }),
        getRecentBlogs: (_1, _a, _b) => __awaiter(void 0, [_1, _a, _b], void 0, function* (_, { limit = 10 }, { blogService }) {
            try {
                return yield blogService.getRecentBlogs(limit);
            }
            catch (error) {
                throw new graphql_1.GraphQLError(`Failed to fetch recent blogs: ${error.message}`);
            }
        }),
        searchBlogs: (_1, _a, _b) => __awaiter(void 0, [_1, _a, _b], void 0, function* (_, { query, pagination }, { blogService }) {
            try {
                if (!query || query.trim().length === 0) {
                    throw new graphql_1.GraphQLError('Search query cannot be empty');
                }
                return yield blogService.searchBlogs(query.trim(), pagination);
            }
            catch (error) {
                throw new graphql_1.GraphQLError(`Failed to search blogs: ${error.message}`);
            }
        }),
    },
    // Mutation Resolvers
    Mutation: {
        createBlog: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { input }, context) {
            var _b, _c;
            try {
                // Authentication check
                if (!context.vendor && !context.Admin) {
                    throw new graphql_1.GraphQLError('Authentication required', { extensions: { code: 'UNAUTHENTICATED' } });
                }
                const authorId = ((_b = context.vendor) === null || _b === void 0 ? void 0 : _b.id) || ((_c = context.Admin) === null || _c === void 0 ? void 0 : _c.id);
                const authorRole = context.vendor ? 'Vendor' : 'Admin';
                if (!authorId) {
                    throw new graphql_1.GraphQLError('Invalid user context', { extensions: { code: 'INVALID_CONTEXT' } });
                }
                return yield context.blogService.createBlog(input, authorId, authorRole);
            }
            catch (error) {
                throw error;
            }
        }),
        updateBlog: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id, input }, context) {
            var _b, _c;
            try {
                // Authentication check
                if (!context.vendor && !context.Admin) {
                    throw new graphql_1.GraphQLError('Authentication required', { extensions: { code: 'UNAUTHENTICATED' } });
                }
                const authorId = ((_b = context.vendor) === null || _b === void 0 ? void 0 : _b.id) || ((_c = context.Admin) === null || _c === void 0 ? void 0 : _c.id);
                const authorRole = context.vendor ? 'Vendor' : 'Admin';
                const isAdmin = !!context.Admin;
                if (!authorId) {
                    throw new graphql_1.GraphQLError('Invalid user context', { extensions: { code: 'INVALID_CONTEXT' } });
                }
                return yield context.blogService.updateBlog(id, input, authorId, authorRole, isAdmin);
            }
            catch (error) {
                throw error;
            }
        }),
        deleteBlog: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            var _b, _c;
            try {
                // Authentication check
                if (!context.vendor && !context.Admin) {
                    throw new graphql_1.GraphQLError('Authentication required', { extensions: { code: 'UNAUTHENTICATED' } });
                }
                const authorId = ((_b = context.vendor) === null || _b === void 0 ? void 0 : _b.id) || ((_c = context.Admin) === null || _c === void 0 ? void 0 : _c.id);
                const authorRole = context.vendor ? 'Vendor' : 'Admin';
                const isAdmin = !!context.Admin;
                if (!authorId) {
                    throw new graphql_1.GraphQLError('Invalid user context', { extensions: { code: 'INVALID_CONTEXT' } });
                }
                return yield context.blogService.deleteBlog(id, authorId, authorRole, isAdmin);
            }
            catch (error) {
                throw error;
            }
        }),
        publishBlog: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            var _b, _c;
            try {
                // Authentication check
                if (!context.vendor && !context.Admin) {
                    throw new graphql_1.GraphQLError('Authentication required', { extensions: { code: 'UNAUTHENTICATED' } });
                }
                const authorId = ((_b = context.vendor) === null || _b === void 0 ? void 0 : _b.id) || ((_c = context.Admin) === null || _c === void 0 ? void 0 : _c.id);
                const authorRole = context.vendor ? 'Vendor' : 'Admin';
                const isAdmin = !!context.Admin;
                if (!authorId) {
                    throw new graphql_1.GraphQLError('Invalid user context', { extensions: { code: 'INVALID_CONTEXT' } });
                }
                return yield context.blogService.publishBlog(id, authorId, authorRole, isAdmin);
            }
            catch (error) {
                throw error;
            }
        }),
        archiveBlog: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            var _b, _c;
            try {
                // Authentication check
                if (!context.vendor && !context.Admin) {
                    throw new graphql_1.GraphQLError('Authentication required', { extensions: { code: 'UNAUTHENTICATED' } });
                }
                const authorId = ((_b = context.vendor) === null || _b === void 0 ? void 0 : _b.id) || ((_c = context.Admin) === null || _c === void 0 ? void 0 : _c.id);
                const authorRole = context.vendor ? 'Vendor' : 'Admin';
                const isAdmin = !!context.Admin;
                if (!authorId) {
                    throw new graphql_1.GraphQLError('Invalid user context', { extensions: { code: 'INVALID_CONTEXT' } });
                }
                return yield context.blogService.archiveBlog(id, authorId, authorRole, isAdmin);
            }
            catch (error) {
                throw error;
            }
        }),
        // Comment Mutations
        addComment: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { blogId, comment }, context) {
            try {
                // Authentication check
                if (!context.user) {
                    throw new graphql_1.GraphQLError('Authentication required', { extensions: { code: 'UNAUTHENTICATED' } });
                }
                if (!comment || comment.trim().length === 0) {
                    throw new graphql_1.GraphQLError('Comment cannot be empty');
                }
                return yield context.blogService.addComment(blogId, comment.trim(), context.user.id);
            }
            catch (error) {
                throw error;
            }
        }),
        updateComment: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id, comment }, context) {
            try {
                // Authentication check
                if (!context.user) {
                    throw new graphql_1.GraphQLError('Authentication required', { extensions: { code: 'UNAUTHENTICATED' } });
                }
                if (!comment || comment.trim().length === 0) {
                    throw new graphql_1.GraphQLError('Comment cannot be empty');
                }
                const isAdmin = !!context.Admin;
                return yield context.blogService.updateComment(id, comment.trim(), context.user.id, isAdmin);
            }
            catch (error) {
                throw error;
            }
        }),
        deleteComment: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            try {
                // Authentication check
                if (!context.user) {
                    throw new graphql_1.GraphQLError('Authentication required', { extensions: { code: 'UNAUTHENTICATED' } });
                }
                const isAdmin = !!context.Admin;
                return yield context.blogService.deleteComment(id, context.user.id, isAdmin);
            }
            catch (error) {
                throw error;
            }
        }),
        approveComment: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            try {
                // Admin authentication check
                if (!context.Admin) {
                    throw new graphql_1.GraphQLError('Admin access required', { extensions: { code: 'FORBIDDEN' } });
                }
                return yield context.blogService.approveComment(id);
            }
            catch (error) {
                throw error;
            }
        }),
        // Like Mutations
        likeBlog: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { blogId }, context) {
            try {
                // Authentication check
                if (!context.user) {
                    throw new graphql_1.GraphQLError('Authentication required', { extensions: { code: 'UNAUTHENTICATED' } });
                }
                return yield context.blogService.likeBlog(blogId, context.user.id);
            }
            catch (error) {
                throw error;
            }
        }),
        unlikeBlog: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { blogId }, context) {
            try {
                // Authentication check
                if (!context.user) {
                    throw new graphql_1.GraphQLError('Authentication required', { extensions: { code: 'UNAUTHENTICATED' } });
                }
                return yield context.blogService.unlikeBlog(blogId, context.user.id);
            }
            catch (error) {
                throw error;
            }
        }),
    },
    // Type Resolvers
    Blog: {
        author: (parent_1, _1, _a) => __awaiter(void 0, [parent_1, _1, _a], void 0, function* (parent, _, { blogService }) {
            try {
                return yield blogService.getBlogAuthor(parent);
            }
            catch (error) {
                console.error('Error fetching blog author:', error);
                return null;
            }
        }),
        comments: (parent_1, _1, _a) => __awaiter(void 0, [parent_1, _1, _a], void 0, function* (parent, _, { blogService }) {
            try {
                return yield blogService.getBlogComments(parent.id);
            }
            catch (error) {
                console.error('Error fetching blog comments:', error);
                return [];
            }
        }),
        likes: (parent_1, _1, _a) => __awaiter(void 0, [parent_1, _1, _a], void 0, function* (parent, _, { blogService }) {
            try {
                return yield blogService.getBlogLikes(parent.id);
            }
            catch (error) {
                console.error('Error fetching blog likes:', error);
                return [];
            }
        }),
        likesCount: (parent_1, _1, _a) => __awaiter(void 0, [parent_1, _1, _a], void 0, function* (parent, _, { blogService }) {
            try {
                return yield blogService.getBlogLikesCount(parent.id);
            }
            catch (error) {
                console.error('Error fetching blog likes count:', error);
                return 0;
            }
        }),
        commentsCount: (parent_1, _1, _a) => __awaiter(void 0, [parent_1, _1, _a], void 0, function* (parent, _, { blogService }) {
            try {
                return yield blogService.getBlogCommentsCount(parent.id);
            }
            catch (error) {
                console.error('Error fetching blog comments count:', error);
                return 0;
            }
        }),
        // Format dates as ISO strings
        createdAt: (parent) => parent.createdAt.toISOString(),
        updatedAt: (parent) => parent.updatedAt.toISOString(),
        publishedAt: (parent) => { var _a; return ((_a = parent.publishedAt) === null || _a === void 0 ? void 0 : _a.toISOString()) || null; },
    },
    BlogComment: {
        user: (parent_1, _1, _a) => __awaiter(void 0, [parent_1, _1, _a], void 0, function* (parent, _, { blogService }) {
            try {
                return yield blogService.getCommentUser(parent.userId);
            }
            catch (error) {
                console.error('Error fetching comment user:', error);
                return null;
            }
        }),
        // Format dates as ISO strings
        createdAt: (parent) => parent.createdAt.toISOString(),
        updatedAt: (parent) => parent.updatedAt.toISOString(),
    },
    BlogLike: {
        user: (parent_1, _1, _a) => __awaiter(void 0, [parent_1, _1, _a], void 0, function* (parent, _, { blogService }) {
            try {
                return yield blogService.getLikeUser(parent.userId);
            }
            catch (error) {
                console.error('Error fetching like user:', error);
                return null;
            }
        }),
        // Format date as ISO string
        createdAt: (parent) => parent.createdAt.toISOString(),
    },
    // Union type resolver for Author
    Author: {
        __resolveType(obj) {
            // Check for properties that distinguish each type
            if ('businessName' in obj) {
                return 'Vendor';
            }
            if ('role' in obj) {
                return 'Admin';
            }
            return 'User';
        },
    },
};
// Export individual resolver functions for testing or modular usage
exports.blogQueryResolvers = exports.blogResolvers.Query;
exports.blogMutationResolvers = exports.blogResolvers.Mutation;
exports.blogTypeResolvers = {
    Blog: exports.blogResolvers.Blog,
    BlogComment: exports.blogResolvers.BlogComment,
    BlogLike: exports.blogResolvers.BlogLike,
    Author: exports.blogResolvers.Author,
};
// Helper function to create context with blog service
const createBlogContext = (baseContext, blogService) => {
    return Object.assign(Object.assign({}, baseContext), { blogService });
};
exports.createBlogContext = createBlogContext;
