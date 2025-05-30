// services/blog.service.ts

import { GraphQLError } from 'graphql';
import { v4 as uuidv4 } from 'uuid';
import { BlogModel } from '../Model';
import {
  Blog,
  BlogComment,
  BlogLike,
  CreateBlogInput,
  UpdateBlogInput,
  BlogFilters,
  PaginationInput,
  PaginatedBlogsResponse,
  User,
  Vendor,
  Admin
} from '../Types';

// Add this type for better type safety
type AuthorRole = 'Vendor' | 'Admin';

export class BlogService {
  constructor(private blogModel: BlogModel) {}

  // Helper Methods
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  private canManageBlog(blog: Blog, authorId: string, authorRole: AuthorRole, isAdmin: boolean = false): boolean {
    if (isAdmin) return true; // Admins can manage all blogs
    
    if (blog.authorRole === authorRole && blog.authorId === authorId) return true;
    
    return false;
  }

  private calculatePaginationMeta(totalCount: number, page: number, limit: number) {
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
  async getBlogs(filters?: BlogFilters, pagination?: PaginationInput): Promise<PaginatedBlogsResponse> {
    const { page = 1, limit = 10 } = pagination || {};
    
    const { blogs, totalCount } = await this.blogModel.getBlogs(filters, pagination);
    const paginationMeta = this.calculatePaginationMeta(totalCount, page, limit);

    return {
      blogs,
      ...paginationMeta,
    };
  }

  async getBlog(id?: string, slug?: string): Promise<Blog> {
    let blog: Blog | null = null;
    
    if (id) {
      blog = await this.blogModel.getBlogById(id);
    } else if (slug) {
      blog = await this.blogModel.getBlogBySlug(slug);
    }
    
    if (!blog) {
      throw new GraphQLError('Blog not found', { extensions: { code: 'NOT_FOUND' } });
    }

    // Increment view count
    await this.blogModel.incrementViewCount(blog.id);

    return { ...blog, viewCount: blog.viewCount + 1 };
  }

  async getMyBlogs(authorId: string, authorRole: AuthorRole, pagination?: PaginationInput): Promise<PaginatedBlogsResponse> {
    const { page = 1, limit = 10 } = pagination || {};

    const { blogs, totalCount } = await this.blogModel.getBlogsByAuthor(authorId, authorRole, pagination);
    const paginationMeta = this.calculatePaginationMeta(totalCount, page, limit);

    return {
      blogs,
      ...paginationMeta,
    };
  }

  async getPopularBlogs(limit: number = 10): Promise<Blog[]> {
    return await this.blogModel.getPopularBlogs(limit);
  }

  async getRecentBlogs(limit: number = 10): Promise<Blog[]> {
    return await this.blogModel.getRecentBlogs(limit);
  }

  async searchBlogs(query: string, pagination?: PaginationInput): Promise<PaginatedBlogsResponse> {
    const { page = 1, limit = 10 } = pagination || {};
    
    const { blogs, totalCount } = await this.blogModel.searchBlogs(query, pagination);
    const paginationMeta = this.calculatePaginationMeta(totalCount, page, limit);

    return {
      blogs,
      ...paginationMeta,
    };
  }

  async createBlog(input: CreateBlogInput, authorId: string, authorRole: AuthorRole): Promise<Blog> {
    const slug = this.generateSlug(input.title);

    // Check if slug already exists
    const existingBlog = await this.blogModel.getBlogBySlug(slug);
    if (existingBlog) {
      throw new GraphQLError('A blog with this title already exists', { 
        extensions: { code: 'DUPLICATE_SLUG' } 
      });
    }

    const blogData: Omit<Blog, 'createdAt' | 'updatedAt'> = {
      id: uuidv4(),
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

    return await this.blogModel.createBlog(blogData);
  }

  async updateBlog(id: string, input: UpdateBlogInput, authorId: string, authorRole: AuthorRole, isAdmin: boolean = false): Promise<Blog> {
    const blog = await this.blogModel.getBlogById(id);
    
    if (!blog) {
      throw new GraphQLError('Blog not found', { extensions: { code: 'NOT_FOUND' } });
    }

    if (!this.canManageBlog(blog, authorId, authorRole, isAdmin)) {
      throw new GraphQLError('Not authorized to update this blog', { 
        extensions: { code: 'FORBIDDEN' } 
      });
    }

    const updateData: Partial<Blog> = { ...input };

    // Generate new slug if title is being updated
    if (input.title && input.title !== blog.title) {
      updateData.slug = this.generateSlug(input.title);
    }

    // Set publishedAt if status is being changed to Published
    if (input.status === 'Published' && blog.status !== 'Published') {
      updateData.publishedAt = new Date();
    }

    const updatedBlog = await this.blogModel.updateBlog(id, updateData);
    
    if (!updatedBlog) {
      throw new GraphQLError('Failed to update blog', { extensions: { code: 'UPDATE_FAILED' } });
    }

    return updatedBlog;
  }

  async deleteBlog(id: string, authorId: string, authorRole: AuthorRole, isAdmin: boolean = false): Promise<boolean> {
    const blog = await this.blogModel.getBlogById(id);
    
    if (!blog) {
      throw new GraphQLError('Blog not found', { extensions: { code: 'NOT_FOUND' } });
    }

    if (!this.canManageBlog(blog, authorId, authorRole, isAdmin)) {
      throw new GraphQLError('Not authorized to delete this blog', { 
        extensions: { code: 'FORBIDDEN' } 
      });
    }

    return await this.blogModel.deleteBlog(id);
  }

  async publishBlog(id: string, authorId: string, authorRole: AuthorRole, isAdmin: boolean = false): Promise<Blog> {
    const blog = await this.blogModel.getBlogById(id);
    
    if (!blog) {
      throw new GraphQLError('Blog not found', { extensions: { code: 'NOT_FOUND' } });
    }

    if (!this.canManageBlog(blog, authorId, authorRole, isAdmin)) {
      throw new GraphQLError('Not authorized to publish this blog', { 
        extensions: { code: 'FORBIDDEN' } 
      });
    }

    const updatedBlog = await this.blogModel.updateBlog(id, {
      status: 'Published',
      publishedAt: new Date(),
    });

    if (!updatedBlog) {
      throw new GraphQLError('Failed to publish blog', { extensions: { code: 'UPDATE_FAILED' } });
    }

    return updatedBlog;
  }

  async archiveBlog(id: string, authorId: string, authorRole: AuthorRole, isAdmin: boolean = false): Promise<Blog> {
    const blog = await this.blogModel.getBlogById(id);
    
    if (!blog) {
      throw new GraphQLError('Blog not found', { extensions: { code: 'NOT_FOUND' } });
    }

    if (!this.canManageBlog(blog, authorId, authorRole, isAdmin)) {
      throw new GraphQLError('Not authorized to archive this blog', { 
        extensions: { code: 'FORBIDDEN' } 
      });
    }

    const updatedBlog = await this.blogModel.updateBlog(id, {
      status: 'Archived',
    });

    if (!updatedBlog) {
      throw new GraphQLError('Failed to archive blog', { extensions: { code: 'UPDATE_FAILED' } });
    }

    return updatedBlog;
  }

  // Comment Operations
  async addComment(blogId: string, comment: string, userId: string): Promise<BlogComment> {
    const blog = await this.blogModel.getBlogById(blogId);
    if (!blog) {
      throw new GraphQLError('Blog not found', { extensions: { code: 'NOT_FOUND' } });
    }

    const commentData: Omit<BlogComment, 'createdAt' | 'updatedAt'> = {
      id: uuidv4(),
      blogId,
      userId,
      comment,
      isApproved: true, // Auto-approve for now
    };

    return await this.blogModel.createComment(commentData);
  }

  async updateComment(id: string, comment: string, userId: string, isAdmin: boolean = false): Promise<BlogComment> {
    const existingComment = await this.blogModel.getCommentById(id);
    if (!existingComment) {
      throw new GraphQLError('Comment not found', { extensions: { code: 'NOT_FOUND' } });
    }

    if (existingComment.userId !== userId && !isAdmin) {
      throw new GraphQLError('Not authorized to update this comment', { 
        extensions: { code: 'FORBIDDEN' } 
      });
    }

    const updatedComment = await this.blogModel.updateComment(id, comment);
    if (!updatedComment) {
      throw new GraphQLError('Failed to update comment', { extensions: { code: 'UPDATE_FAILED' } });
    }

    return updatedComment;
  }

  async deleteComment(id: string, userId: string, isAdmin: boolean = false): Promise<boolean> {
    const comment = await this.blogModel.getCommentById(id);
    if (!comment) {
      throw new GraphQLError('Comment not found', { extensions: { code: 'NOT_FOUND' } });
    }

    if (comment.userId !== userId && !isAdmin) {
      throw new GraphQLError('Not authorized to delete this comment', { 
        extensions: { code: 'FORBIDDEN' } 
      });
    }

    return await this.blogModel.deleteComment(id);
  }

  async approveComment(id: string): Promise<BlogComment> {
    const updatedComment = await this.blogModel.approveComment(id);
    if (!updatedComment) {
      throw new GraphQLError('Comment not found', { extensions: { code: 'NOT_FOUND' } });
    }

    return updatedComment;
  }

  // Like Operations
  async likeBlog(blogId: string, userId: string): Promise<BlogLike> {
    // Check if user already liked this blog
    const existingLike = await this.blogModel.getLikeByBlogAndUser(blogId, userId);
    if (existingLike) {
      throw new GraphQLError('You have already liked this blog', { 
        extensions: { code: 'ALREADY_LIKED' } 
      });
    }

    const likeData: Omit<BlogLike, 'createdAt'> = {
      id: uuidv4(),
      blogId,
      userId,
    };

    return await this.blogModel.createLike(likeData);
  }

  async unlikeBlog(blogId: string, userId: string): Promise<boolean> {
    return await this.blogModel.deleteLike(blogId, userId);
  }

  // Field Resolver Helpers
  async getBlogAuthor(blog: Blog): Promise<Vendor | Admin | null> {
    return await this.blogModel.getAuthorByIdAndRole(blog.authorId, blog.authorRole);
  }

  async getBlogComments(blogId: string): Promise<BlogComment[]> {
    return await this.blogModel.getCommentsByBlogId(blogId);
  }

  async getBlogLikes(blogId: string): Promise<BlogLike[]> {
    return await this.blogModel.getLikesByBlogId(blogId);
  }

  async getBlogLikesCount(blogId: string): Promise<number> {
    return await this.blogModel.getLikesCount(blogId);
  }

  async getBlogCommentsCount(blogId: string): Promise<number> {
    return await this.blogModel.getCommentsCount(blogId);
  }

  async getCommentUser(userId: string): Promise<User | null> {
    return await this.blogModel.getUserById(userId);
  }

  async getLikeUser(userId: string): Promise<User | null> {
    return await this.blogModel.getUserById(userId);
  }
}