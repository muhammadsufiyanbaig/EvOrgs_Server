import { ChatModel, ChatFilter, ServiceInquiryFilter, ChatStats } from '../Model';
import { db } from '../../../Config/db';
import { chats, serviceInquiries, adInquiries } from '../../../Schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export interface CreateChatInput {
  senderId: string;
  receiverId: string;
  message: string;
  messageType?: 'Text' | 'Image' | 'File' | 'Location';
  bookingId?: string;
  serviceType?: 'Venue' | 'Farmhouse' | 'CateringPackage' | 'PhotographyPackage' | 'Advertisement';
  serviceId?: string;
  parentMessageId?: string;
  attachmentUrl?: string;
}

export interface AdminChatActions {
  moderateMessage: (chatId: string, action: 'approve' | 'hide' | 'delete') => Promise<any>;
  flagInappropriateContent: (chatId: string, reason: string) => Promise<any>;
  escalateToSupport: (chatId: string, priority: 'low' | 'medium' | 'high') => Promise<any>;
}

export class ChatService {
  // Core Chat Operations
  static async createMessage(input: CreateChatInput) {
    const messageId = uuidv4();
    
    const messageData = {
      id: messageId,
      senderId: input.senderId,
      receiverId: input.receiverId,
      message: input.message,
      messageType: input.messageType || 'Text',
      bookingId: input.bookingId,
      serviceType: input.serviceType,
      parentMessageId: input.parentMessageId,
      attachmentUrl: input.attachmentUrl,
      status: 'Sent' as const,
      sentAt: new Date(),
    };

    // Add service-specific fields
    if (input.serviceType && input.serviceId) {
      switch (input.serviceType) {
        case 'Venue':
          (messageData as any).venueId = input.serviceId;
          break;
        case 'Farmhouse':
          (messageData as any).farmhouseId = input.serviceId;
          break;
        case 'CateringPackage':
          (messageData as any).cateringPackageId = input.serviceId;
          break;
        case 'PhotographyPackage':
          (messageData as any).photographyPackageId = input.serviceId;
          break;
        case 'Advertisement':
          (messageData as any).serviceAdId = input.serviceId;
          break;
      }
    }

    const result = await db.insert(chats).values(messageData).returning();
    return result[0];
  }

  static async updateMessageStatus(chatId: string, status: 'Delivered' | 'Read' | 'Deleted') {
    const updateData: any = { status };
    
    if (status === 'Delivered') {
      updateData.deliveredAt = new Date();
    } else if (status === 'Read') {
      updateData.readAt = new Date();
    } else if (status === 'Deleted') {
      updateData.deletedAt = new Date();
    }

    return await db.update(chats)
      .set(updateData)
      .where(eq(chats.id, chatId))
      .returning();
  }

  // Admin-specific operations
  static async getAllChatsForAdmin(filter?: ChatFilter, pagination?: { limit: number; offset: number }) {
    return await ChatModel.getAllChats(
      filter,
      pagination?.limit,
      pagination?.offset
    );
  }

  static async getAllServiceInquiriesForAdmin(filter?: ServiceInquiryFilter, pagination?: { limit: number; offset: number }) {
    return await ChatModel.getAllServiceInquiries(
      filter,
      pagination?.limit,
      pagination?.offset
    );
  }

  static async getAllAdInquiriesForAdmin(filter?: Omit<ServiceInquiryFilter, 'serviceType'>, pagination?: { limit: number; offset: number }) {
    return await ChatModel.getAllAdInquiries(
      filter,
      pagination?.limit,
      pagination?.offset
    );
  }

  static async getChatStatistics(dateFrom?: Date, dateTo?: Date): Promise<ChatStats> {
    return await ChatModel.getChatStatistics(dateFrom, dateTo);
  }

  static async searchChats(searchTerm: string, limit = 20) {
    return await ChatModel.searchChats(searchTerm, limit);
  }

  static async getConversation(userId1: string, userId2: string, limit = 50) {
    return await ChatModel.getConversation(userId1, userId2, limit);
  }

  static async deleteChat(chatId: string) {
    return await ChatModel.deleteChat(chatId);
  }

  static async bulkDeleteChats(chatIds: string[]) {
    return await ChatModel.bulkDeleteChats(chatIds);
  }

  // Service Inquiry Management
  static async updateServiceInquiryStatus(inquiryId: string, status: 'Open' | 'Answered' | 'Converted' | 'Closed') {
    return await ChatModel.updateServiceInquiryStatus(inquiryId, status);
  }

  static async updateAdInquiryStatus(inquiryId: string, status: 'Open' | 'Answered' | 'Converted' | 'Closed') {
    return await ChatModel.updateAdInquiryStatus(inquiryId, status);
  }

  static async bulkUpdateInquiryStatus(inquiryIds: string[], status: string, type: 'service' | 'ad') {
    const promises = inquiryIds.map(id => 
      type === 'service' 
        ? ChatModel.updateServiceInquiryStatus(id, status)
        : ChatModel.updateAdInquiryStatus(id, status)
    );
    
    return await Promise.all(promises);
  }

  // Content Moderation
  static async flagMessage(chatId: string, reason: string, flaggedBy: string) {
    // This would typically create a moderation record
    // For now, we'll update the message status to indicate it's flagged
    const message = await ChatModel.getChatById(chatId);
    if (!message.length) {
      throw new Error('Message not found');
    }

    // In a real implementation, you'd create a separate moderation table
    console.log(`Message ${chatId} flagged by ${flaggedBy} for: ${reason}`);
    
    return {
      success: true,
      message: 'Message flagged for review',
      flaggedAt: new Date(),
      reason
    };
  }

  static async escalateConversation(userId1: string, userId2: string, priority: 'low' | 'medium' | 'high', escalatedBy: string) {
    const conversation = await this.getConversation(userId1, userId2);
    
    // In a real implementation, you'd create an escalation record
    console.log(`Conversation between ${userId1} and ${userId2} escalated by ${escalatedBy} with priority: ${priority}`);
    
    return {
      success: true,
      message: 'Conversation escalated to support team',
      escalatedAt: new Date(),
      priority,
      conversationLength: conversation.length
    };
  }

  // Analytics and Reporting
  static async generateChatReport(dateFrom: Date, dateTo: Date) {
    const stats = await this.getChatStatistics(dateFrom, dateTo);
    const serviceInquiries = await ChatModel.getAllServiceInquiries({ dateFrom, dateTo });
    const adInquiries = await ChatModel.getAllAdInquiries({ dateFrom, dateTo });

    return {
      period: { from: dateFrom, to: dateTo },
      chatStatistics: stats,
      inquiries: {
        service: {
          total: serviceInquiries.length,
          byStatus: serviceInquiries.reduce((acc, inquiry) => {
            const status = inquiry.status || 'Unknown';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
          byServiceType: serviceInquiries.reduce((acc, inquiry) => {
            const serviceType = inquiry.serviceType || 'Unknown';
            acc[serviceType] = (acc[serviceType] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        },
        advertisement: {
          total: adInquiries.length,
          byStatus: adInquiries.reduce((acc, inquiry) => {
            const status = inquiry.status || 'Unknown';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        }
      },
      generatedAt: new Date()
    };
  }

  // User and Vendor specific operations
  static async getUserChats(userId: string) {
    return await ChatModel.getAllChats({ 
      senderId: userId 
    });
  }

  static async getVendorChats(vendorId: string) {
    return await ChatModel.getAllChats({ 
      senderId: vendorId 
    });
  }

  static async getUserServiceInquiries(userId: string) {
    return await ChatModel.getAllServiceInquiries({ userId });
  }

  static async getVendorServiceInquiries(vendorId: string) {
    return await ChatModel.getAllServiceInquiries({ vendorId });
  }

  static async getUserAdInquiries(userId: string) {
    return await ChatModel.getAllAdInquiries({ userId });
  }

  static async getVendorAdInquiries(vendorId: string) {
    return await ChatModel.getAllAdInquiries({ vendorId });
  }

  // Real-time notification helpers
  static async getUnreadMessageCount(userId: string) {
    const messages = await ChatModel.getAllChats({
      receiverId: userId
    });

    return messages.filter(msg => msg.status !== 'Read').length;
  }

  static async markConversationAsRead(userId1: string, userId2: string) {
    const conversation = await ChatModel.getConversation(userId1, userId2);
    const unreadMessages = conversation.filter(msg => 
      msg.receiverId === userId1 && msg.status !== 'Read'
    );

    const promises = unreadMessages.map(msg => 
      this.updateMessageStatus(msg.id, 'Read')
    );

    return await Promise.all(promises);
  }
}
