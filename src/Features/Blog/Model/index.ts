// models/blog.model.ts

import { eq, and, desc, asc, sql, ilike, inArray } from 'drizzle-orm';
import { blogs, blogComments, blogLikes, users, vendors, admin } from '../../../Schema';
import { 
  Blog, 
  BlogComment, 
  BlogLike, 
  BlogFilters, 
  PaginationInput,
  CreateBlogInput,
  UpdateBlogInput,
  User,
  Vendor,
  Admin
} from '../Types';

export class BlogModel {
  constructor(private db: any) {}

  // Blog CRUD Operations
  async createBlog(blogData: Omit<Blog, 'createdAt' | 'updatedAt'>): Promise<Blog> {
    const newBlog = {
      ...blogData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.db.insert(blogs).values(newBlog);
    return newBlog as Blog;
  }

  async getBlogById(id: string): Promise<Blog | null> {
    const result = await this.db.select().from(blogs).where(eq(blogs.id, id)).limit(1);
    return result[0] || null;
  }

  async getBlogBySlug(slug: string): Promise<Blog | null> {
    const result = await this.db.select().from(blogs).where(eq(blogs.slug, slug)).limit(1);
    return result[0] || null;
  }

  async updateBlog(id: string, updateData: Partial<Blog>): Promise<Blog | null> {
    const dataWithTimestamp = {
      ...updateData,
      updatedAt: new Date(),
    };

    await this.db.update(blogs).set(dataWithTimestamp).where(eq(blogs.id, id));
    return this.getBlogById(id);
  }

  async deleteBlog(id: string): Promise<boolean> {
    await this.db.delete(blogs).where(eq(blogs.id, id));
    return true;
  }

  async incrementViewCount(id: string): Promise<void> {
    await this.db
      .update(blogs)
      .set({ viewCount: sql`${blogs.viewCount} + 1`, updatedAt: new Date() })
      .where(eq(blogs.id, id));
  }

  // Blog Queries
  async getBlogs(filters?: BlogFilters, pagination?: PaginationInput): Promise<{
    blogs: Blog[];
    totalCount: number;
  }> {
    const { page = 1, limit = 10 } = pagination || {};
    const offset = (page - 1) * limit;

    let query = this.db.select().from(blogs);
    let countQuery = this.db.select({ count: sql`count(*)` }).from(blogs);
    
    if (filters) {
      const conditions = this.buildFilterConditions(filters);
      if (conditions.length > 0) {
        const whereClause = and(...conditions);
        query = query.where(whereClause);
        countQuery = countQuery.where(whereClause);
      }
    }

    const [blogList, totalCountResult] = await Promise.all([
      query.orderBy(desc(blogs.createdAt)).limit(limit).offset(offset),
      countQuery
    ]);

    const totalCount = Number(totalCountResult[0]?.count || 0);

    return {
      blogs: blogList,
      totalCount,
    };
  }

  async getBlogsByAuthor(authorId: string, authorRole: 'Vendor' | 'Admin', pagination?: PaginationInput): Promise<{
    blogs: Blog[];
    totalCount: number;
  }> {
    const { page = 1, limit = 10 } = pagination || {};
    const offset = (page - 1) * limit;

    const whereClause = and(eq(blogs.authorId, authorId), eq(blogs.authorRole, authorRole));

    const [blogList, totalCountResult] = await Promise.all([
      this.db
        .select()
        .from(blogs)
        .where(whereClause)
        .orderBy(desc(blogs.createdAt))
        .limit(limit)
        .offset(offset),
      this.db
        .select({ count: sql`count(*)` })
        .from(blogs)
        .where(whereClause)
    ]);

    const totalCount = Number(totalCountResult[0]?.count || 0);

    return {
      blogs: blogList,
      totalCount,
    };
  }

  async getPopularBlogs(limit: number = 10): Promise<Blog[]> {
    return await this.db
      .select()
      .from(blogs)
      .where(eq(blogs.status, 'Published'))
      .orderBy(desc(blogs.viewCount))
      .limit(limit);
  }

  async getRecentBlogs(limit: number = 10): Promise<Blog[]> {
    return await this.db
      .select()
      .from(blogs)
      .where(eq(blogs.status, 'Published'))
      .orderBy(desc(blogs.publishedAt))
      .limit(limit);
  }

  async searchBlogs(query: string, pagination?: PaginationInput): Promise<{
    blogs: Blog[];
    totalCount: number;
  }> {
    const { page = 1, limit = 10 } = pagination || {};
    const offset = (page - 1) * limit;

    const searchCondition = sql`(
      ${blogs.title} ILIKE ${`%${query}%`} OR 
      ${blogs.summary} ILIKE ${`%${query}%`} OR 
      ${blogs.content} ILIKE ${`%${query}%`}
    )`;

    const whereClause = and(eq(blogs.status, 'Published'), searchCondition);

    const [blogList, totalCountResult] = await Promise.all([
      this.db
        .select()
        .from(blogs)
        .where(whereClause)
        .orderBy(desc(blogs.createdAt))
        .limit(limit)
        .offset(offset),
      this.db
        .select({ count: sql`count(*)` })
        .from(blogs)
        .where(whereClause)
    ]);

    const totalCount = Number(totalCountResult[0]?.count || 0);

    return {
      blogs: blogList,
      totalCount,
    };
  }

  // Author Operations
  async getAuthorByIdAndRole(authorId: string, authorRole: 'Vendor' | 'Admin'): Promise<Vendor | Admin | null> {
    if (authorRole === 'Vendor') {
      const result = await this.db.select().from(vendors).where(eq(vendors.id, authorId)).limit(1);
      return result[0] || null;
    } else if (authorRole === 'Admin') {
      const result = await this.db.select().from(admin).where(eq(admin.id, authorId)).limit(1);
      return result[0] || null;
    }
    return null;
  }

  // Comment Operations
  async createComment(commentData: Omit<BlogComment, 'createdAt' | 'updatedAt'>): Promise<BlogComment> {
    const newComment = {
      ...commentData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.db.insert(blogComments).values(newComment);
    return newComment as BlogComment;
  }

  async getCommentById(id: string): Promise<BlogComment | null> {
    const result = await this.db.select().from(blogComments).where(eq(blogComments.id, id)).limit(1);
    return result[0] || null;
  }

  async updateComment(id: string, comment: string): Promise<BlogComment | null> {
    await this.db
      .update(blogComments)
      .set({ comment, updatedAt: new Date() })
      .where(eq(blogComments.id, id));

    return this.getCommentById(id);
  }

  async deleteComment(id: string): Promise<boolean> {
    await this.db.delete(blogComments).where(eq(blogComments.id, id));
    return true;
  }

  async approveComment(id: string): Promise<BlogComment | null> {
    await this.db
      .update(blogComments)
      .set({ isApproved: true, updatedAt: new Date() })
      .where(eq(blogComments.id, id));

    return this.getCommentById(id);
  }

  async getCommentsByBlogId(blogId: string): Promise<BlogComment[]> {
    return await this.db
      .select()
      .from(blogComments)
      .where(eq(blogComments.blogId, blogId))
      .orderBy(desc(blogComments.createdAt));
  }

  async getCommentsCount(blogId: string): Promise<number> {
    const result = await this.db
      .select({ count: sql`count(*)` })
      .from(blogComments)
      .where(and(eq(blogComments.blogId, blogId), eq(blogComments.isApproved, true)));
    return Number(result[0]?.count || 0);
  }

  // Like Operations
  async createLike(likeData: Omit<BlogLike, 'createdAt'>): Promise<BlogLike> {
    const newLike = {
      ...likeData,
      createdAt: new Date(),
    };

    await this.db.insert(blogLikes).values(newLike);
    return newLike as BlogLike;
  }

  async deleteLike(blogId: string, userId: string): Promise<boolean> {
    await this.db
      .delete(blogLikes)
      .where(and(eq(blogLikes.blogId, blogId), eq(blogLikes.userId, userId)));
    return true;
  }

  async getLikeByBlogAndUser(blogId: string, userId: string): Promise<BlogLike | null> {
    const result = await this.db
      .select()
      .from(blogLikes)
      .where(and(eq(blogLikes.blogId, blogId), eq(blogLikes.userId, userId)))
      .limit(1);
    return result[0] || null;
  }

  async getLikesByBlogId(blogId: string): Promise<BlogLike[]> {
    return await this.db
      .select()
      .from(blogLikes)
      .where(eq(blogLikes.blogId, blogId))
      .orderBy(desc(blogLikes.createdAt));
  }

  async getLikesCount(blogId: string): Promise<number> {
    const result = await this.db
      .select({ count: sql`count(*)` })
      .from(blogLikes)
      .where(eq(blogLikes.blogId, blogId));
    return Number(result[0]?.count || 0);
  }

  // User Operations
  async getUserById(id: string): Promise<User | null> {
    const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0] || null;
  }

  // Helper Methods
  private buildFilterConditions(filters: BlogFilters) {
    const conditions = [];
    
    if (filters.status) {
      conditions.push(eq(blogs.status, filters.status));
    }
    
    if (filters.authorRole) {
      conditions.push(eq(blogs.authorRole, filters.authorRole));
    }
    
    if (filters.authorId) {
      conditions.push(eq(blogs.authorId, filters.authorId));
    }
    
    if (filters.tags && filters.tags.length > 0) {
      conditions.push(sql`${blogs.tags} && ${filters.tags}`);
    }
    
    return conditions.filter(Boolean);
  }
}