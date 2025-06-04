
import { supportTickets, supportResponses, users, vendors, admin } from '../../../../Schema';
import { eq, desc, and } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { CreateTicketInput, UpdateTicketInput, CreateResponseInput } from '../../Types';
import { Context } from '../../../../GraphQL/Context';

export const supportResolvers = {
  Query: {
    // Get tickets for current user/vendor
    getMyTickets: async (_: any, __: any, context: Context) => {
      const { db, user, vendor } = context;

      if (!user && !vendor) {
        throw new Error('Authentication required');
      }

      const whereClause = user 
        ? eq(supportTickets.userId, user.id)
        : eq(supportTickets.vendorId, vendor!.id);

      const tickets = await db.select()
        .from(supportTickets)
        .where(whereClause)
        .orderBy(desc(supportTickets.createdAt));

      return tickets;
    },

    // Get all tickets (Admin only)
    getAllTickets: async (_: any, __: any, context: Context) => {
      const { db, Admin } = context;

      if (!Admin) {
        throw new Error('Admin access required');
      }

      const tickets = await db.select()
        .from(supportTickets)
        .orderBy(desc(supportTickets.createdAt));

      return tickets;
    },

    // Get specific ticket
    getTicket: async (_: any, { id }: { id: string }, context: Context) => {
      const { db, user, vendor, Admin } = context;

      if (!user && !vendor && !Admin) {
        throw new Error('Authentication required');
      }

      const ticket = await db.select()
        .from(supportTickets)
        .where(eq(supportTickets.id, id))
        .limit(1);

      if (ticket.length === 0) {
        throw new Error('Ticket not found');
      }

      const ticketData = ticket[0];

      // Check permissions
      if (!Admin) {
        const hasAccess = (user && ticketData.userId === user.id) ||
                         (vendor && ticketData.vendorId === vendor.id);
        
        if (!hasAccess) {
          throw new Error('Access denied');
        }
      }

      return ticketData;
    },

    // Get ticket responses
    getTicketResponses: async (_: any, { ticketId }: { ticketId: string }, context: Context) => {
      const { db, user, vendor, Admin } = context;

      if (!user && !vendor && !Admin) {
        throw new Error('Authentication required');
      }

      // First check if user has access to the ticket
      const ticket = await db.select()
        .from(supportTickets)
        .where(eq(supportTickets.id, ticketId))
        .limit(1);

      if (ticket.length === 0) {
        throw new Error('Ticket not found');
      }

      const ticketData = ticket[0];

      // Check permissions
      if (!Admin) {
        const hasAccess = (user && ticketData.userId === user.id) ||
                         (vendor && ticketData.vendorId === vendor.id);
        
        if (!hasAccess) {
          throw new Error('Access denied');
        }
      }

      // Get responses - filter internal notes if not admin
      let responses = await db.select()
        .from(supportResponses)
        .where(eq(supportResponses.ticketId, ticketId))
        .orderBy(supportResponses.createdAt);

      // Hide internal responses from non-admin users
      if (!Admin) {
        responses = responses.filter(response => !response.isInternal);
      }

      return responses;
    },
  },

  Mutation: {
    // Create new ticket (User/Vendor)
    createTicket: async (_: any, { input }: { input: CreateTicketInput }, context: Context) => {
      const { db, user, vendor } = context;

      if (!user && !vendor) {
        throw new Error('Authentication required');
      }

      const ticketData = {
        id: uuidv4(),
        userId: user?.id || null,
        vendorId: vendor?.id || null,
        subject: input.subject,
        description: input.description,
        ticketType: input.ticketType,
        priority: 'Medium' as const,
        status: 'Open' as const,
        attachments: input.attachments || [],
        createdAt: new Date(),
        updatedAt: new Date(),
        resolvedAt: null,
        closedAt: null,
      };

      const [newTicket] = await db.insert(supportTickets)
        .values(ticketData)
        .returning();

      return newTicket;
    },

    // Add response to ticket
    addResponse: async (_: any, { input }: { input: CreateResponseInput }, context: Context) => {
      const { db, user, vendor, Admin } = context;

      if (!user && !vendor && !Admin) {
        throw new Error('Authentication required');
      }

      // Check if ticket exists and user has access
      const ticket = await db.select()
        .from(supportTickets)
        .where(eq(supportTickets.id, input.ticketId))
        .limit(1);

      if (ticket.length === 0) {
        throw new Error('Ticket not found');
      }

      const ticketData = ticket[0];

      // Check permissions
      if (!Admin) {
        const hasAccess = (user && ticketData.userId === user.id) ||
                         (vendor && ticketData.vendorId === vendor.id);
        
        if (!hasAccess) {
          throw new Error('Access denied');
        }

        // Non-admin users cannot create internal responses
        if (input.isInternal) {
          throw new Error('Only admins can create internal responses');
        }
      }

      const responseData = {
        id: uuidv4(),
        ticketId: input.ticketId,
        adminId: Admin?.id || null,
        userId: user?.id || null,
        vendorId: vendor?.id || null,
        responseText: input.responseText,
        attachments: input.attachments || [],
        isInternal: input.isInternal || false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const [newResponse] = await db.insert(supportResponses)
        .values(responseData)
        .returning();

      // Update ticket's updatedAt timestamp
      await db.update(supportTickets)
        .set({ updatedAt: new Date() })
        .where(eq(supportTickets.id, input.ticketId));

      return newResponse;
    },

    // Update ticket priority (Admin only)
    updateTicketPriority: async (_: any, { id, priority }: { id: string, priority: string }, context: Context) => {
      const { db, Admin } = context;

      if (!Admin) {
        throw new Error('Admin access required');
      }

      const [updatedTicket] = await db.update(supportTickets)
        .set({ 
          priority: priority as any,
          updatedAt: new Date()
        })
        .where(eq(supportTickets.id, id))
        .returning();

      if (!updatedTicket) {
        throw new Error('Ticket not found');
      }

      return updatedTicket;
    },

    // Update ticket status (Admin only)
    updateTicketStatus: async (_: any, { id, status }: { id: string, status: string }, context: Context) => {
      const { db, Admin } = context;

      if (!Admin) {
        throw new Error('Admin access required');
      }

      const updateData: any = {
        status: status as any,
        updatedAt: new Date()
      };

      // Set resolved/closed timestamps
      if (status === 'Resolved') {
        updateData.resolvedAt = new Date();
      } else if (status === 'Closed') {
        updateData.closedAt = new Date();
      } else if (status === 'Reopened') {
        updateData.resolvedAt = null;
        updateData.closedAt = null;
      }

      const [updatedTicket] = await db.update(supportTickets)
        .set(updateData)
        .where(eq(supportTickets.id, id))
        .returning();

      if (!updatedTicket) {
        throw new Error('Ticket not found');
      }

      return updatedTicket;
    },

    // Resolve ticket with response (Admin only)
    resolveTicket: async (_: any, { id, responseText, attachments }: { id: string, responseText: string, attachments?: string[] }, context: Context) => {
      const { db, Admin } = context;

      if (!Admin) {
        throw new Error('Admin access required');
      }

      // Add admin response
      const responseData = {
        id: uuidv4(),
        ticketId: id,
        adminId: Admin.id,
        userId: null,
        vendorId: null,
        responseText,
        attachments: attachments || [],
        isInternal: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await db.insert(supportResponses)
        .values(responseData);

      // Update ticket status to resolved
      const [updatedTicket] = await db.update(supportTickets)
        .set({ 
          status: 'Resolved',
          resolvedAt: new Date(),
          updatedAt: new Date()
        })
        .where(eq(supportTickets.id, id))
        .returning();

      if (!updatedTicket) {
        throw new Error('Ticket not found');
      }

      return updatedTicket;
    },

    // Close ticket (Admin only)
    closeTicket: async (_: any, { id }: { id: string }, context: Context) => {
      const { db, Admin } = context;

      if (!Admin) {
        throw new Error('Admin access required');
      }

      const [updatedTicket] = await db.update(supportTickets)
        .set({ 
          status: 'Closed',
          closedAt: new Date(),
          updatedAt: new Date()
        })
        .where(eq(supportTickets.id, id))
        .returning();

      if (!updatedTicket) {
        throw new Error('Ticket not found');
      }

      return updatedTicket;
    },

    // Reopen ticket (Admin only)
    reopenTicket: async (_: any, { id }: { id: string }, context: Context) => {
      const { db, Admin } = context;

      if (!Admin) {
        throw new Error('Admin access required');
      }

      const [updatedTicket] = await db.update(supportTickets)
        .set({ 
          status: 'Reopened',
          resolvedAt: null,
          closedAt: null,
          updatedAt: new Date()
        })
        .where(eq(supportTickets.id, id))
        .returning();

      if (!updatedTicket) {
        throw new Error('Ticket not found');
      }

      return updatedTicket;
    },
  },

  // Resolve union types and relationships
  SupportTicket: {
    responses: async (parent: any, _: any, context: Context) => {
      const { db, Admin } = context;

      let responses = await db.select()
        .from(supportResponses)
        .where(eq(supportResponses.ticketId, parent.id))
        .orderBy(supportResponses.createdAt);

      // Hide internal responses from non-admin users
      if (!Admin) {
        responses = responses.filter(response => !response.isInternal);
      }

      return responses;
    },

    creator: async (parent: any, _: any, context: Context) => {
      const { db } = context;

      if (parent.userId) {
        const [user] = await db.select()
          .from(users)
          .where(eq(users.id, parent.userId))
          .limit(1);
        return user;
      }

      if (parent.vendorId) {
        const [vendor] = await db.select()
          .from(vendors)
          .where(eq(vendors.id, parent.vendorId))
          .limit(1);
        return vendor;
      }

      return null;
    },
  },

  SupportResponse: {
    responder: async (parent: any, _: any, context: Context) => {
      const { db } = context;

      if (parent.adminId) {
        const [adminUser] = await db.select()
          .from(admin)
          .where(eq(admin.id, parent.adminId))
          .limit(1);
        return adminUser;
      }

      if (parent.userId) {
        const [user] = await db.select()
          .from(users)
          .where(eq(users.id, parent.userId))
          .limit(1);
        return user;
      }

      if (parent.vendorId) {
        const [vendor] = await db.select()
          .from(vendors)
          .where(eq(vendors.id, parent.vendorId))
          .limit(1);
        return vendor;
      }

      return null;
    },
  },

  // Union type resolvers
  TicketCreator: {
    __resolveType(obj: any) {
      if (obj.businessName) return 'Vendor';
      if (obj.firstName) return 'User';
      return null;
    },
  },

  ResponseCreator: {
    __resolveType(obj: any) {
      if (obj.role) return 'Admin';
      if (obj.businessName) return 'Vendor';
      if (obj.firstName) return 'User';
      return null;
    },
  },
};