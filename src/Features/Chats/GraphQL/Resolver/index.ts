import { eq, or } from 'drizzle-orm';
import { db } from '../../../../Config/db';
import { chats, serviceInquiries, adInquiries } from '../../../../Schema';
import { Context } from '../../../../GraphQL/Context';
import { ChatService } from '../../Service';
import { GraphQLJSON } from 'graphql-type-json';

export const chatResolvers = {
  JSON: GraphQLJSON,

  Query: {
    // User-specific queries
    getUserChats: async (_: any, __: any, { user, vendor }: Context) => {
      if (!user || vendor) throw new Error('Unauthorized: Must be a user');
      return await ChatService.getUserChats(user.id);
    },
    
    getUserServiceInquiries: async (_: any, __: any, { user, vendor }: Context) => {
      if (!user || vendor) throw new Error('Unauthorized: Must be a user');
      return await ChatService.getUserServiceInquiries(user.id);
    },
    
    getUserAdInquiries: async (_: any, __: any, { user, vendor}: Context) => {
      if (!user || vendor) throw new Error('Unauthorized: Must be a user');
      return await ChatService.getUserAdInquiries(user.id);
    },

    getUnreadMessageCount: async (_: any, __: any, { user, vendor }: Context) => {
      if (!user || vendor) throw new Error('Unauthorized: Must be a user');
      return await ChatService.getUnreadMessageCount(user.id);
    },

    // Vendor-specific queries
    getVendorChats: async (_: any, __: any, { user, vendor }: Context) => {
      if (!vendor || user ) throw new Error('Unauthorized: Must be a vendor');
      return await ChatService.getVendorChats(vendor.id);
    },
    
    getVendorServiceInquiries: async (_: any, __: any, { user, vendor }: Context) => {
      if (!vendor || user) throw new Error('Unauthorized: Must be a vendor');
      return await ChatService.getVendorServiceInquiries(vendor.id);
    },
    
    getVendorAdInquiries: async (_: any, __: any, { user, vendor }: Context) => {
      if (!vendor || user ) throw new Error('Unauthorized: Must be a vendor');
      return await ChatService.getVendorAdInquiries(vendor.id);
    },

    // Admin-specific queries
    getAllChats: async (_: any, { filter, pagination }: any, { Admin }: Context) => {
      if (!Admin) throw new Error('Unauthorized: Admin access required');
      
      const chatFilter = filter ? {
        status: filter.status,
        messageType: filter.messageType,
        serviceType: filter.serviceType,
        senderId: filter.senderId,
        receiverId: filter.receiverId,
        dateFrom: filter.dateFrom ? new Date(filter.dateFrom) : undefined,
        dateTo: filter.dateTo ? new Date(filter.dateTo) : undefined,
      } : undefined;

      return await ChatService.getAllChatsForAdmin(chatFilter, pagination);
    },

    getAllServiceInquiries: async (_: any, { filter, pagination }: any, { Admin }: Context) => {
      if (!Admin) throw new Error('Unauthorized: Admin access required');
      
      const inquiryFilter = filter ? {
        status: filter.status,
        serviceType: filter.serviceType,
        userId: filter.userId,
        vendorId: filter.vendorId,
        dateFrom: filter.dateFrom ? new Date(filter.dateFrom) : undefined,
        dateTo: filter.dateTo ? new Date(filter.dateTo) : undefined,
      } : undefined;

      return await ChatService.getAllServiceInquiriesForAdmin(inquiryFilter, pagination);
    },

    getAllAdInquiries: async (_: any, { filter, pagination }: any, { Admin }: Context) => {
      if (!Admin) throw new Error('Unauthorized: Admin access required');
      
      const inquiryFilter = filter ? {
        status: filter.status,
        userId: filter.userId,
        vendorId: filter.vendorId,
        dateFrom: filter.dateFrom ? new Date(filter.dateFrom) : undefined,
        dateTo: filter.dateTo ? new Date(filter.dateTo) : undefined,
      } : undefined;

      return await ChatService.getAllAdInquiriesForAdmin(inquiryFilter, pagination);
    },

    // Admin analytics and reporting
    getChatStatistics: async (_: any, { dateFrom, dateTo }: any, { Admin }: Context) => {
      if (!Admin) throw new Error('Unauthorized: Admin access required');
      
      return await ChatService.getChatStatistics(
        dateFrom ? new Date(dateFrom) : undefined,
        dateTo ? new Date(dateTo) : undefined
      );
    },

    generateChatReport: async (_: any, { dateFrom, dateTo }: any, { Admin }: Context) => {
      if (!Admin) throw new Error('Unauthorized: Admin access required');
      
      return await ChatService.generateChatReport(
        new Date(dateFrom),
        new Date(dateTo)
      );
    },

    // Admin search and monitoring
    searchChats: async (_: any, { searchTerm, limit }: any, { Admin }: Context) => {
      if (!Admin) throw new Error('Unauthorized: Admin access required');
      return await ChatService.searchChats(searchTerm, limit);
    },

    getConversation: async (_: any, { userId1, userId2, limit }: any, { Admin }: Context) => {
      if (!Admin) throw new Error('Unauthorized: Admin access required');
      return await ChatService.getConversation(userId1, userId2, limit);
    },

    getChatById: async (_: any, { chatId }: any, { Admin }: Context) => {
      if (!Admin) throw new Error('Unauthorized: Admin access required');
      const chat = await db.select()
        .from(chats)
        .where(eq(chats.id, chatId))
        .limit(1);
      return chat[0] || null;
    },

    // Admin dashboard queries
    getRecentChats: async (_: any, { limit = 10 }: any, { Admin }: Context) => {
      if (!Admin) throw new Error('Unauthorized: Admin access required');
      return await ChatService.getAllChatsForAdmin(undefined, { limit, offset: 0 });
    },

    getPendingInquiries: async (_: any, __: any, { Admin }: Context) => {
      if (!Admin) throw new Error('Unauthorized: Admin access required');
      return await ChatService.getAllServiceInquiriesForAdmin({ status: 'Open' });
    },

    getFlaggedMessages: async (_: any, __: any, { Admin }: Context) => {
      if (!Admin) throw new Error('Unauthorized: Admin access required');
      // This would require a separate flagged messages system
      // For now, return deleted messages as an example
      return await ChatService.getAllChatsForAdmin({ status: 'Deleted' });
    },
  },

  Mutation: {
    // User/Vendor mutations
    updateMessageStatus: async (_: any, { chatId, status }: { chatId: string; status: "Delivered" | "Read" | "Deleted" }, { user, vendor}: Context) => {
      if (!user && !vendor ) throw new Error('Unauthorized');
      
      const updated = await ChatService.updateMessageStatus(chatId, status);
      return updated[0];
    },

    markConversationAsRead: async (_: any, { otherUserId }: any, { user, vendor }: Context) => {
      const currentUserId = user?.id || vendor?.id;
      if (!currentUserId) throw new Error('Unauthorized');

      await ChatService.markConversationAsRead(currentUserId, otherUserId);
      
      return {
        success: true,
        message: 'Conversation marked as read',
        data: null
      };
    },

    // Admin-specific mutations
    deleteChat: async (_: any, { chatId }: any, { Admin }: Context) => {
      if (!Admin) throw new Error('Unauthorized: Admin access required');
      
      const result = await ChatService.deleteChat(chatId);
      
      return {
        success: result.length > 0,
        message: result.length > 0 ? 'Chat deleted successfully' : 'Chat not found',
        data: result[0] || null
      };
    },

    bulkDeleteChats: async (_: any, { chatIds }: any, { Admin }: Context) => {
      if (!Admin) throw new Error('Unauthorized: Admin access required');
      
      try {
        const result = await ChatService.bulkDeleteChats(chatIds);
        
        return {
          success: true,
          affectedCount: result.length,
          message: `${result.length} chats deleted successfully`,
          errors: []
        };
      } catch (error) {
        return {
          success: false,
          affectedCount: 0,
          message: 'Failed to delete chats',
          errors: [error instanceof Error ? error.message : 'Unknown error']
        };
      }
    },

    // Inquiry management
    updateServiceInquiryStatus: async (_: any, { inquiryId, status }: any, { Admin, vendor }: Context) => {
      if (!Admin && !vendor) throw new Error('Unauthorized: Admin or vendor access required');
      
      const result = await ChatService.updateServiceInquiryStatus(inquiryId, status);
      return result[0];
    },

    updateAdInquiryStatus: async (_: any, { inquiryId, status }: any, { Admin, vendor }: Context) => {
      if (!Admin && !vendor) throw new Error('Unauthorized: Admin or vendor access required');
      
      const result = await ChatService.updateAdInquiryStatus(inquiryId, status);
      return result[0];
    },

    bulkUpdateInquiryStatus: async (_: any, { inquiryIds, status, type }: any, { Admin }: Context) => {
      if (!Admin) throw new Error('Unauthorized: Admin access required');
      
      try {
        await ChatService.bulkUpdateInquiryStatus(inquiryIds, status, type);
        
        return {
          success: true,
          affectedCount: inquiryIds.length,
          message: `${inquiryIds.length} inquiries updated successfully`,
          errors: []
        };
      } catch (error) {
        return {
          success: false,
          affectedCount: 0,
          message: 'Failed to update inquiries',
          errors: [error instanceof Error ? error.message : 'Unknown error']
        };
      }
    },

    // Content moderation
    flagMessage: async (_: any, { chatId, reason }: any, { Admin }: Context) => {
      if (!Admin) throw new Error('Unauthorized: Admin access required');
      
      const result = await ChatService.flagMessage(chatId, reason, Admin.id);
      
      return {
        success: result.success,
        message: result.message,
        data: result
      };
    },

    escalateConversation: async (_: any, { userId1, userId2, priority }: any, { Admin }: Context) => {
      if (!Admin) throw new Error('Unauthorized: Admin access required');
      
      const result = await ChatService.escalateConversation(userId1, userId2, priority, Admin.id);
      
      return {
        success: result.success,
        message: result.message,
        data: result
      };
    },

    // Admin message management
    sendAdminMessage: async (_: any, { receiverId, message, messageType }: any, { Admin }: Context) => {
      if (!Admin) throw new Error('Unauthorized: Admin access required');
      
      const newMessage = await ChatService.createMessage({
        senderId: Admin.id,
        receiverId,
        message,
        messageType: messageType || 'Text'
      });
      
      return newMessage;
    },

    broadcastMessage: async (_: any, { userIds, message, messageType }: any, { Admin }: Context) => {
      if (!Admin) throw new Error('Unauthorized: Admin access required');
      
      try {
        const promises = userIds.map((userId: string) => 
          ChatService.createMessage({
            senderId: Admin.id,
            receiverId: userId,
            message,
            messageType: messageType || 'Text'
          })
        );
        
        await Promise.all(promises);
        
        return {
          success: true,
          affectedCount: userIds.length,
          message: `Message broadcast to ${userIds.length} users`,
          errors: []
        };
      } catch (error) {
        return {
          success: false,
          affectedCount: 0,
          message: 'Failed to broadcast message',
          errors: [error instanceof Error ? error.message : 'Unknown error']
        };
      }
    },
  },
};