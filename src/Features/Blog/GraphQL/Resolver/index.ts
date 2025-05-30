// resolvers/blog.resolvers.ts

import { GraphQLError } from 'graphql';
import { BlogService } from '../../Service';
import { 
  Blog, 
  BlogComment, 
  BlogLike, 
  CreateBlogInput, 
  UpdateBlogInput, 
  BlogFilters, 
  PaginationInput,
  User,
  Vendor,
  Admin
} from '../../Types';
import { Context } from '../../../../GraphQL/Context';

export const blogResolvers = {
  // Query Resolvers
  Query: {
    getBlogs: async (
      _: any,
      { filters, pagination }: { filters?: BlogFilters; pagination?: PaginationInput },
      { blogService }: { blogService: BlogService }
    ) => {
      try {
        return await blogService.getBlogs(filters, pagination);
      } catch (error) {
        throw new GraphQLError(`Failed to fetch blogs: ${(error as Error).message}`);
      }
    },

    getBlog: async (
      _: any,
      { id, slug }: { id?: string; slug?: string },
      { blogService }: { blogService: BlogService }
    ) => {
      try {
        if (!id && !slug) {
          throw new GraphQLError('Either id or slug must be provided');
        }
        return await blogService.getBlog(id, slug);
      } catch (error) {
        throw error; // Let service handle the specific error
      }
    },

    getMyBlogs: async (
      _: any,
      { pagination }: { pagination?: PaginationInput },
      context: Context & { blogService: BlogService }
    ) => {
      try {
        // Authentication check
        if (!context.vendor && !context.Admin) {
          throw new GraphQLError('Authentication required', { extensions: { code: 'UNAUTHENTICATED' } });
        }

        const authorId = context.vendor?.id || context.Admin?.id;
        const authorRole = context.vendor ? 'Vendor' : 'Admin';

        if (!authorId) {
          throw new GraphQLError('Invalid user context', { extensions: { code: 'INVALID_CONTEXT' } });
        }

        return await context.blogService.getMyBlogs(authorId, authorRole, pagination);
      } catch (error) {
        throw error;
      }
    },

    getPopularBlogs: async (
      _: any,
      { limit = 10 }: { limit?: number },
      { blogService }: { blogService: BlogService }
    ) => {
      try {
        return await blogService.getPopularBlogs(limit);
      } catch (error) {
        throw new GraphQLError(`Failed to fetch popular blogs: ${(error as Error).message}`);
      }
    },

    getRecentBlogs: async (
      _: any,
      { limit = 10 }: { limit?: number },
      { blogService }: { blogService: BlogService }
    ) => {
      try {
        return await blogService.getRecentBlogs(limit);
      } catch (error) {
        throw new GraphQLError(`Failed to fetch recent blogs: ${(error as Error).message}`);
      }
    },

    searchBlogs: async (
      _: any,
      { query, pagination }: { query: string; pagination?: PaginationInput },
      { blogService }: { blogService: BlogService }
    ) => {
      try {
        if (!query || query.trim().length === 0) {
          throw new GraphQLError('Search query cannot be empty');
        }
        return await blogService.searchBlogs(query.trim(), pagination);
      } catch (error) {
        throw new GraphQLError(`Failed to search blogs: ${(error as Error).message}`);
      }
    },
  },

  // Mutation Resolvers
  Mutation: {
    createBlog: async (
      _: any,
      { input }: { input: CreateBlogInput },
      context: Context & { blogService: BlogService }
    ) => {
      try {
        // Authentication check
        if (!context.vendor && !context.Admin) {
          throw new GraphQLError('Authentication required', { extensions: { code: 'UNAUTHENTICATED' } });
        }

        const authorId = context.vendor?.id || context.Admin?.id;
        const authorRole = context.vendor ? 'Vendor' : 'Admin';
        
        if (!authorId) {
          throw new GraphQLError('Invalid user context', { extensions: { code: 'INVALID_CONTEXT' } });
        }

        return await context.blogService.createBlog(input, authorId, authorRole);
      } catch (error) {
        throw error;
      }
    },

    updateBlog: async (
      _: any,
      { id, input }: { id: string; input: UpdateBlogInput },
      context: Context & { blogService: BlogService }
    ) => {
      try {
        // Authentication check
        if (!context.vendor && !context.Admin) {
          throw new GraphQLError('Authentication required', { extensions: { code: 'UNAUTHENTICATED' } });
        }

        const authorId = context.vendor?.id || context.Admin?.id;
        const authorRole = context.vendor ? 'Vendor' : 'Admin';
        const isAdmin = !!context.Admin;
        
        if (!authorId) {
          throw new GraphQLError('Invalid user context', { extensions: { code: 'INVALID_CONTEXT' } });
        }

        return await context.blogService.updateBlog(id, input, authorId, authorRole, isAdmin);
      } catch (error) {
        throw error;
      }
    },

    deleteBlog: async (
      _: any,
      { id }: { id: string },
      context: Context & { blogService: BlogService }
    ) => {
      try {
        // Authentication check
        if (!context.vendor && !context.Admin) {
          throw new GraphQLError('Authentication required', { extensions: { code: 'UNAUTHENTICATED' } });
        }

        const authorId = context.vendor?.id || context.Admin?.id;
        const authorRole = context.vendor ? 'Vendor' : 'Admin';
        const isAdmin = !!context.Admin;
        
        if (!authorId) {
          throw new GraphQLError('Invalid user context', { extensions: { code: 'INVALID_CONTEXT' } });
        }

        return await context.blogService.deleteBlog(id, authorId, authorRole, isAdmin);
      } catch (error) {
        throw error;
      }
    },

    publishBlog: async (
      _: any,
      { id }: { id: string },
      context: Context & { blogService: BlogService }
    ) => {
      try {
        // Authentication check
        if (!context.vendor && !context.Admin) {
          throw new GraphQLError('Authentication required', { extensions: { code: 'UNAUTHENTICATED' } });
        }

        const authorId = context.vendor?.id || context.Admin?.id;
        const authorRole = context.vendor ? 'Vendor' : 'Admin';
        const isAdmin = !!context.Admin;
        
        if (!authorId) {
          throw new GraphQLError('Invalid user context', { extensions: { code: 'INVALID_CONTEXT' } });
        }

        return await context.blogService.publishBlog(id, authorId, authorRole, isAdmin);
      } catch (error) {
        throw error;
      }
    },

    archiveBlog: async (
      _: any,
      { id }: { id: string },
      context: Context & { blogService: BlogService }
    ) => {
      try {
        // Authentication check
        if (!context.vendor && !context.Admin) {
          throw new GraphQLError('Authentication required', { extensions: { code: 'UNAUTHENTICATED' } });
        }

        const authorId = context.vendor?.id || context.Admin?.id;
        const authorRole = context.vendor ? 'Vendor' : 'Admin';
        const isAdmin = !!context.Admin;
        
        if (!authorId) {
          throw new GraphQLError('Invalid user context', { extensions: { code: 'INVALID_CONTEXT' } });
        }

        return await context.blogService.archiveBlog(id, authorId, authorRole, isAdmin);
      } catch (error) {
        throw error;
      }
    },

    // Comment Mutations
    addComment: async (
      _: any,
      { blogId, comment }: { blogId: string; comment: string },
      context: Context & { blogService: BlogService }
    ) => {
      try {
        // Authentication check
        if (!context.user) {
          throw new GraphQLError('Authentication required', { extensions: { code: 'UNAUTHENTICATED' } });
        }

        if (!comment || comment.trim().length === 0) {
          throw new GraphQLError('Comment cannot be empty');
        }

        return await context.blogService.addComment(blogId, comment.trim(), context.user.id);
      } catch (error) {
        throw error;
      }
    },

    updateComment: async (
      _: any,
      { id, comment }: { id: string; comment: string },
      context: Context & { blogService: BlogService }
    ) => {
      try {
        // Authentication check
        if (!context.user) {
          throw new GraphQLError('Authentication required', { extensions: { code: 'UNAUTHENTICATED' } });
        }

        if (!comment || comment.trim().length === 0) {
          throw new GraphQLError('Comment cannot be empty');
        }

        const isAdmin = !!context.Admin;
        return await context.blogService.updateComment(id, comment.trim(), context.user.id, isAdmin);
      } catch (error) {
        throw error;
      }
    },

    deleteComment: async (
      _: any,
      { id }: { id: string },
      context: Context & { blogService: BlogService }
    ) => {
      try {
        // Authentication check
        if (!context.user) {
          throw new GraphQLError('Authentication required', { extensions: { code: 'UNAUTHENTICATED' } });
        }

        const isAdmin = !!context.Admin;
        return await context.blogService.deleteComment(id, context.user.id, isAdmin);
      } catch (error) {
        throw error;
      }
    },

    approveComment: async (
      _: any,
      { id }: { id: string },
      context: Context & { blogService: BlogService }
    ) => {
      try {
        // Admin authentication check
        if (!context.Admin) {
          throw new GraphQLError('Admin access required', { extensions: { code: 'FORBIDDEN' } });
        }

        return await context.blogService.approveComment(id);
      } catch (error) {
        throw error;
      }
    },

    // Like Mutations
    likeBlog: async (
      _: any,
      { blogId }: { blogId: string },
      context: Context & { blogService: BlogService }
    ) => {
      try {
        // Authentication check
        if (!context.user) {
          throw new GraphQLError('Authentication required', { extensions: { code: 'UNAUTHENTICATED' } });
        }

        return await context.blogService.likeBlog(blogId, context.user.id);
      } catch (error) {
        throw error;
      }
    },

    unlikeBlog: async (
      _: any,
      { blogId }: { blogId: string },
      context: Context & { blogService: BlogService }
    ) => {
      try {
        // Authentication check
        if (!context.user) {
          throw new GraphQLError('Authentication required', { extensions: { code: 'UNAUTHENTICATED' } });
        }

        return await context.blogService.unlikeBlog(blogId, context.user.id);
      } catch (error) {
        throw error;
      }
    },
  },

  // Type Resolvers
  Blog: {
    author: async (
      parent: Blog,
      _: any,
      { blogService }: { blogService: BlogService }
    ) => {
      try {
        return await blogService.getBlogAuthor(parent);
      } catch (error) {
        console.error('Error fetching blog author:', error);
        return null;
      }
    },

    comments: async (
      parent: Blog,
      _: any,
      { blogService }: { blogService: BlogService }
    ) => {
      try {
        return await blogService.getBlogComments(parent.id);
      } catch (error) {
        console.error('Error fetching blog comments:', error);
        return [];
      }
    },

    likes: async (
      parent: Blog,
      _: any,
      { blogService }: { blogService: BlogService }
    ) => {
      try {
        return await blogService.getBlogLikes(parent.id);
      } catch (error) {
        console.error('Error fetching blog likes:', error);
        return [];
      }
    },

    likesCount: async (
      parent: Blog,
      _: any,
      { blogService }: { blogService: BlogService }
    ) => {
      try {
        return await blogService.getBlogLikesCount(parent.id);
      } catch (error) {
        console.error('Error fetching blog likes count:', error);
        return 0;
      }
    },

    commentsCount: async (
      parent: Blog,
      _: any,
      { blogService }: { blogService: BlogService }
    ) => {
      try {
        return await blogService.getBlogCommentsCount(parent.id);
      } catch (error) {
        console.error('Error fetching blog comments count:', error);
        return 0;
      }
    },

    // Format dates as ISO strings
    createdAt: (parent: Blog) => parent.createdAt.toISOString(),
    updatedAt: (parent: Blog) => parent.updatedAt.toISOString(),
    publishedAt: (parent: Blog) => parent.publishedAt?.toISOString() || null,
  },

  BlogComment: {
    user: async (
      parent: BlogComment,
      _: any,
      { blogService }: { blogService: BlogService }
    ) => {
      try {
        return await blogService.getCommentUser(parent.userId);
      } catch (error) {
        console.error('Error fetching comment user:', error);
        return null;
      }
    },

    // Format dates as ISO strings
    createdAt: (parent: BlogComment) => parent.createdAt.toISOString(),
    updatedAt: (parent: BlogComment) => parent.updatedAt.toISOString(),
  },

  BlogLike: {
    user: async (
      parent: BlogLike,
      _: any,
      { blogService }: { blogService: BlogService }
    ) => {
      try {
        return await blogService.getLikeUser(parent.userId);
      } catch (error) {
        console.error('Error fetching like user:', error);
        return null;
      }
    },

    // Format date as ISO string
    createdAt: (parent: BlogLike) => parent.createdAt.toISOString(),
  },

  // Union type resolver for Author
  Author: {
    __resolveType(obj: User | Vendor | Admin) {
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
export const blogQueryResolvers = blogResolvers.Query;
export const blogMutationResolvers = blogResolvers.Mutation;
export const blogTypeResolvers = {
  Blog: blogResolvers.Blog,
  BlogComment: blogResolvers.BlogComment,
  BlogLike: blogResolvers.BlogLike,
  Author: blogResolvers.Author,
};

// Helper function to create context with blog service
export const createBlogContext = (
  baseContext: Context,
  blogService: BlogService
): Context & { blogService: BlogService } => {
  return {
    ...baseContext,
    blogService,
  };
};