import { eq, or, and, desc, count, sql, gte, lte, like } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { db } from '../../../Config/db';
import { chats, serviceInquiries, adInquiries, users, vendors } from '../../../Schema';

export interface ChatFilter {
  status?: string;
  messageType?: string;
  dateFrom?: Date;
  dateTo?: Date;
  senderId?: string;
  receiverId?: string;
  serviceType?: string;
}

export interface ServiceInquiryFilter {
  status?: string;
  serviceType?: string;
  dateFrom?: Date;
  dateTo?: Date;
  userId?: string;
  vendorId?: string;
}

export interface ChatStats {
  totalMessages: number;
  totalByType: Record<string, number>;
  totalByStatus: Record<string, number>;
  dailyMessageCount: { date: string; count: number }[];
}

export class ChatModel {
  // Basic Chat Operations
  static async getAllChats(filter?: ChatFilter, limit?: number, offset?: number) {
    const senderUsers = alias(users, 'sender_users');
    const senderVendors = alias(vendors, 'sender_vendors');
    const receiverUsers = alias(users, 'receiver_users');
    const receiverVendors = alias(vendors, 'receiver_vendors');

    // Build conditions array
    const conditions = [];
    
    if (filter) {
      if (filter.status) {
        conditions.push(eq(chats.status, filter.status as any));
      }
      
      if (filter.messageType) {
        conditions.push(eq(chats.messageType, filter.messageType as any));
      }
      
      if (filter.serviceType) {
        conditions.push(eq(chats.serviceType, filter.serviceType as any));
      }
      
      if (filter.senderId) {
        conditions.push(eq(chats.senderId, filter.senderId));
      }
      
      if (filter.receiverId) {
        conditions.push(eq(chats.receiverId, filter.receiverId));
      }
      
      if (filter.dateFrom) {
        conditions.push(gte(chats.sentAt, filter.dateFrom));
      }
      
      if (filter.dateTo) {
        conditions.push(lte(chats.sentAt, filter.dateTo));
      }
    }

    // Create the base query builder
    const baseQuery = db.select({
      id: chats.id,
      bookingId: chats.bookingId,
      senderId: chats.senderId,
      receiverId: chats.receiverId,
      message: chats.message,
      messageType: chats.messageType,
      parentMessageId: chats.parentMessageId,
      attachmentUrl: chats.attachmentUrl,
      serviceType: chats.serviceType,
      venueId: chats.venueId,
      farmhouseId: chats.farmhouseId,
      cateringPackageId: chats.cateringPackageId,
      photographyPackageId: chats.photographyPackageId,
      serviceAdId: chats.serviceAdId,
      status: chats.status,
      sentAt: chats.sentAt,
      deliveredAt: chats.deliveredAt,
      readAt: chats.readAt,
      deletedAt: chats.deletedAt,
      // Sender details
      senderName: sql<string>`CASE 
        WHEN sender_users.first_name IS NOT NULL THEN sender_users.first_name || ' ' || sender_users.last_name
        ELSE sender_vendors.vendor_name
      END`,
      senderType: sql<string>`CASE 
        WHEN sender_users.id IS NOT NULL THEN 'user'
        ELSE 'vendor'
      END`,
      // Receiver details
      receiverName: sql<string>`CASE 
        WHEN receiver_users.first_name IS NOT NULL THEN receiver_users.first_name || ' ' || receiver_users.last_name
        ELSE receiver_vendors.vendor_name
      END`,
      receiverType: sql<string>`CASE 
        WHEN receiver_users.id IS NOT NULL THEN 'user'
        ELSE 'vendor'
      END`,
    })
    .from(chats)
    .leftJoin(senderUsers, eq(chats.senderId, senderUsers.id))
    .leftJoin(senderVendors, eq(chats.senderId, senderVendors.id))
    .leftJoin(receiverUsers, eq(chats.receiverId, receiverUsers.id))
    .leftJoin(receiverVendors, eq(chats.receiverId, receiverVendors.id))
    .$dynamic();

    // Apply where conditions if they exist
    if (conditions.length > 0) {
      baseQuery.where(and(...conditions));
    }

    // Apply ordering and pagination
    baseQuery.orderBy(desc(chats.sentAt));

    if (limit) {
      baseQuery.limit(limit);
    }
    
    if (offset) {
      baseQuery.offset(offset);
    }

    return await baseQuery;
  }

  static async getChatById(chatId: string) {
    return await db.select()
      .from(chats)
      .where(eq(chats.id, chatId))
      .limit(1);
  }

  static async deleteChat(chatId: string) {
    return await db.update(chats)
      .set({ 
        status: 'Deleted',
        deletedAt: new Date()
      })
      .where(eq(chats.id, chatId))
      .returning();
  }

  static async bulkDeleteChats(chatIds: string[]) {
    return await db.update(chats)
      .set({ 
        status: 'Deleted',
        deletedAt: new Date()
      })
      .where(sql`id = ANY(${chatIds})`)
      .returning();
  }

  // Service Inquiries Operations
  static async getAllServiceInquiries(filter?: ServiceInquiryFilter, limit?: number, offset?: number) {
    // Build conditions array
    const conditions = [];
    
    if (filter) {
      if (filter.status) {
        conditions.push(eq(serviceInquiries.status, filter.status as any));
      }
      
      if (filter.serviceType) {
        conditions.push(eq(serviceInquiries.serviceType, filter.serviceType as any));
      }
      
      if (filter.userId) {
        conditions.push(eq(serviceInquiries.userId, filter.userId));
      }
      
      if (filter.vendorId) {
        conditions.push(eq(serviceInquiries.vendorId, filter.vendorId));
      }
      
      if (filter.dateFrom) {
        conditions.push(gte(serviceInquiries.createdAt, filter.dateFrom));
      }
      
      if (filter.dateTo) {
        conditions.push(lte(serviceInquiries.createdAt, filter.dateTo));
      }
    }

    const baseQuery = db.select({
      id: serviceInquiries.id,
      chatId: serviceInquiries.chatId,
      userId: serviceInquiries.userId,
      vendorId: serviceInquiries.vendorId,
      serviceType: serviceInquiries.serviceType,
      serviceId: serviceInquiries.serviceId,
      inquiryText: serviceInquiries.inquiryText,
      status: serviceInquiries.status,
      convertedToBookingId: serviceInquiries.convertedToBookingId,
      createdAt: serviceInquiries.createdAt,
      updatedAt: serviceInquiries.updatedAt,
      closedAt: serviceInquiries.closedAt,
      // User details
      userName: sql<string>`users.first_name || ' ' || users.last_name`,
      userEmail: users.email,
      // Vendor details
      vendorName: vendors.vendorName,
      vendorEmail: vendors.vendorEmail,
    })
    .from(serviceInquiries)
    .leftJoin(users, eq(serviceInquiries.userId, users.id))
    .leftJoin(vendors, eq(serviceInquiries.vendorId, vendors.id))
    .$dynamic();

    if (conditions.length > 0) {
      baseQuery.where(and(...conditions));
    }

    baseQuery.orderBy(desc(serviceInquiries.createdAt));

    if (limit) {
      baseQuery.limit(limit);
    }
    
    if (offset) {
      baseQuery.offset(offset);
    }

    return await baseQuery;
  }

  static async updateServiceInquiryStatus(inquiryId: string, status: string) {
    return await db.update(serviceInquiries)
      .set({ 
        status: status as any,
        updatedAt: new Date(),
        ...(status === 'Closed' && { closedAt: new Date() })
      })
      .where(eq(serviceInquiries.id, inquiryId))
      .returning();
  }

  // Ad Inquiries Operations
  static async getAllAdInquiries(filter?: Omit<ServiceInquiryFilter, 'serviceType'>, limit?: number, offset?: number) {
    // Build conditions array
    const conditions = [];
    
    if (filter) {
      if (filter.status) {
        conditions.push(eq(adInquiries.status, filter.status as any));
      }
      
      if (filter.userId) {
        conditions.push(eq(adInquiries.userId, filter.userId));
      }
      
      if (filter.vendorId) {
        conditions.push(eq(adInquiries.vendorId, filter.vendorId));
      }
      
      if (filter.dateFrom) {
        conditions.push(gte(adInquiries.createdAt, filter.dateFrom));
      }
      
      if (filter.dateTo) {
        conditions.push(lte(adInquiries.createdAt, filter.dateTo));
      }
    }

    const baseQuery = db.select({
      id: adInquiries.id,
      chatId: adInquiries.chatId,
      userId: adInquiries.userId,
      vendorId: adInquiries.vendorId,
      adId: adInquiries.adId,
      inquiryText: adInquiries.inquiryText,
      status: adInquiries.status,
      convertedToBookingId: adInquiries.convertedToBookingId,
      createdAt: adInquiries.createdAt,
      updatedAt: adInquiries.updatedAt,
      closedAt: adInquiries.closedAt,
      // User details
      userName: sql<string>`users.first_name || ' ' || users.last_name`,
      userEmail: users.email,
      // Vendor details
      vendorName: vendors.vendorName,
      vendorEmail: vendors.vendorEmail,
    })
    .from(adInquiries)
    .leftJoin(users, eq(adInquiries.userId, users.id))
    .leftJoin(vendors, eq(adInquiries.vendorId, vendors.id))
    .$dynamic();

    if (conditions.length > 0) {
      baseQuery.where(and(...conditions));
    }

    baseQuery.orderBy(desc(adInquiries.createdAt));

    if (limit) {
      baseQuery.limit(limit);
    }
    
    if (offset) {
      baseQuery.offset(offset);
    }

    return await baseQuery;
  }

  static async updateAdInquiryStatus(inquiryId: string, status: string) {
    return await db.update(adInquiries)
      .set({ 
        status: status as any,
        updatedAt: new Date(),
        ...(status === 'Closed' && { closedAt: new Date() })
      })
      .where(eq(adInquiries.id, inquiryId))
      .returning();
  }

  // Analytics and Statistics
  static async getChatStatistics(dateFrom?: Date, dateTo?: Date): Promise<ChatStats> {
    const conditions = [];
    
    if (dateFrom) {
      conditions.push(gte(chats.sentAt, dateFrom));
    }
    
    if (dateTo) {
      conditions.push(lte(chats.sentAt, dateTo));
    }

    // Total messages
    const totalMessages = await db.select({ count: count() })
      .from(chats)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    // Messages by type
    const messagesByType = await db.select({
      messageType: chats.messageType,
      count: count()
    })
    .from(chats)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .groupBy(chats.messageType);

    // Messages by status
    const messagesByStatus = await db.select({
      status: chats.status,
      count: count()
    })
    .from(chats)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .groupBy(chats.status);

    // Daily message count (last 30 days)
    const dailyMessages = await db.select({
      date: sql<string>`DATE(sent_at)`,
      count: count()
    })
    .from(chats)
    .where(
      and(
        gte(chats.sentAt, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
        ...(conditions.length > 0 ? conditions : [])
      )
    )
    .groupBy(sql`DATE(sent_at)`)
    .orderBy(sql`DATE(sent_at)`);

    return {
      totalMessages: totalMessages[0]?.count || 0,
      totalByType: messagesByType.reduce((acc, item) => {
        acc[item.messageType || 'Unknown'] = item.count;
        return acc;
      }, {} as Record<string, number>),
      totalByStatus: messagesByStatus.reduce((acc, item) => {
        acc[item.status || 'Unknown'] = item.count;
        return acc;
      }, {} as Record<string, number>),
      dailyMessageCount: dailyMessages.map(item => ({
        date: item.date,
        count: item.count
      }))
    };
  }

  // Search functionality
  static async searchChats(searchTerm: string, limit = 20) {
    return await db.select()
      .from(chats)
      .where(like(chats.message, `%${searchTerm}%`))
      .orderBy(desc(chats.sentAt))
      .limit(limit);
  }

  static async getConversation(userId1: string, userId2: string, limit = 50) {
    return await db.select()
      .from(chats)
      .where(
        or(
          and(eq(chats.senderId, userId1), eq(chats.receiverId, userId2)),
          and(eq(chats.senderId, userId2), eq(chats.receiverId, userId1))
        )
      )
      .orderBy(desc(chats.sentAt))
      .limit(limit);
  }
}