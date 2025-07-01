import { eq, or } from 'drizzle-orm';
import { db } from '../../../../Config/db';
import { chats, serviceInquiries, adInquiries } from '../../../../Schema';
import { Context } from '../../../../GraphQL/Context';

export const chatResolvers = {
  Query: {
    // User-specific queries
    getUserChats: async (_: any, __: any, { user, vendor }: Context) => {
      if (!user || vendor) throw new Error('Unauthorized: Must be a user');
      return await db.select()
        .from(chats)
        .where(or(eq(chats.senderId, user.id), eq(chats.receiverId, user.id)));
    },
    getUserServiceInquiries: async (_: any, __: any, { user, vendor }: Context) => {
      if (!user || vendor) throw new Error('Unauthorized: Must be a user');
      return await db.select()
        .from(serviceInquiries)
        .where(eq(serviceInquiries.userId, user.id));
    },
    getUserAdInquiries: async (_: any, __: any, { user, vendor}: Context) => {
      if (!user || vendor) throw new Error('Unauthorized: Must be a user');
      return await db.select()
        .from(adInquiries)
        .where(eq(adInquiries.userId, user.id));
    },

    // Vendor-specific queries
    getVendorChats: async (_: any, __: any, { user, vendor }: Context) => {
      if (!vendor || user ) throw new Error('Unauthorized: Must be a vendor');
      return await db.select()
        .from(chats)
        .where(or(eq(chats.senderId, vendor.id), eq(chats.receiverId, vendor.id)));
    },
    getVendorServiceInquiries: async (_: any, __: any, { user, vendor }: Context) => {
      if (!vendor || user) throw new Error('Unauthorized: Must be a vendor');
      return await db.select()
        .from(serviceInquiries)
        .where(eq(serviceInquiries.vendorId, vendor.id));
    },
    getVendorAdInquiries: async (_: any, __: any, { user, vendor }: Context) => {
      if (!vendor || user ) throw new Error('Unauthorized: Must be a vendor');
      return await db.select()
        .from(adInquiries)
        .where(eq(adInquiries.vendorId, vendor.id));
    },

    // Admin-specific queries
    getAllChats: async (_: any, __: any ) => {
      return await db.select().from(chats);
    },
    getAllServiceInquiries: async (_: any, __: any, ) => {
      return await db.select().from(serviceInquiries);
    },
    getAllAdInquiries: async (_: any, __: any,) => {
      return await db.select().from(adInquiries);
    },
  },
  Mutation: {
    updateMessageStatus: async (_: any, { chatId, status }: { chatId: string; status: "Sent" | "Delivered" | "Read" | "Deleted" }, { user, vendor}: Context) => {
      if (!user && !vendor ) throw new Error('Unauthorized');
      const updateData = status === 'Read'
        ? { status, readAt: new Date() }
        : { status, deletedAt: new Date() };

      const updated = await db.update(chats)
        .set(updateData)
        .where(eq(chats.id, chatId))
        .returning();

      return updated[0];
    },
  },
};