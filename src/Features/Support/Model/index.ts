import { eq, desc } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { supportTickets, supportResponses, users, vendors, admin } from '../../../Schema';
import { CreateTicketInput, CreateResponseInput } from '../Types';
import { Context } from '../../../GraphQL/Context';

export class SupportModel {
  private db: Context['db'];

  constructor(db: Context['db']) {
    this.db = db;
  }

  async getTicketsByUserOrVendor(userId?: string, vendorId?: string) {
    const whereClause = userId
      ? eq(supportTickets.userId, userId)
      : eq(supportTickets.vendorId, vendorId!);

    return this.db
      .select()
      .from(supportTickets)
      .where(whereClause)
      .orderBy(desc(supportTickets.createdAt));
  }

  async getAllTickets() {
    return this.db
      .select()
      .from(supportTickets)
      .orderBy(desc(supportTickets.createdAt));
  }

  async getTicketById(id: string) {
    const ticket = await this.db
      .select()
      .from(supportTickets)
      .where(eq(supportTickets.id, id))
      .limit(1);
    return ticket.length > 0 ? ticket[0] : null;
  }

  async getResponsesByTicketId(ticketId: string) {
    return this.db
      .select()
      .from(supportResponses)
      .where(eq(supportResponses.ticketId, ticketId))
      .orderBy(supportResponses.createdAt);
  }

  async createTicket(input: CreateTicketInput, userId?: string, vendorId?: string) {
    const ticketData = {
      id: uuidv4(),
      userId: userId || null,
      vendorId: vendorId || null,
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

    const [newTicket] = await this.db
      .insert(supportTickets)
      .values(ticketData)
      .returning();
    return newTicket;
  }

  async createResponse(input: CreateResponseInput, userId?: string, vendorId?: string, adminId?: string) {
    const responseData = {
      id: uuidv4(),
      ticketId: input.ticketId,
      adminId: adminId || null,
      userId: userId || null,
      vendorId: vendorId || null,
      responseText: input.responseText,
      attachments: input.attachments || [],
      isInternal: input.isInternal || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const [newResponse] = await this.db
      .insert(supportResponses)
      .values(responseData)
      .returning();
    return newResponse;
  }

  async updateTicketPriority(id: string, priority: string) {
    const [updatedTicket] = await this.db
      .update(supportTickets)
      .set({ priority: priority as any, updatedAt: new Date() })
      .where(eq(supportTickets.id, id))
      .returning();
    return updatedTicket || null;
  }

  async updateTicketStatus(id: string, status: string) {
    const updateData: any = {
      status: status as any,
      updatedAt: new Date(),
    };

    if (status === 'Resolved') {
      updateData.resolvedAt = new Date();
    } else if (status === 'Closed') {
      updateData.closedAt = new Date();
    } else if (status === 'Reopened') {
      updateData.resolvedAt = null;
      updateData.closedAt = null;
    }

    const [updatedTicket] = await this.db
      .update(supportTickets)
      .set(updateData)
      .where(eq(supportTickets.id, id))
      .returning();
    return updatedTicket || null;
  }

  async updateTicketTimestamp(id: string) {
    await this.db
      .update(supportTickets)
      .set({ updatedAt: new Date() })
      .where(eq(supportTickets.id, id));
  }

  async getUserById(userId: string) {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    return user || null;
  }

  async getVendorById(vendorId: string) {
    const [vendor] = await this.db
      .select()
      .from(vendors)
      .where(eq(vendors.id, vendorId))
      .limit(1);
    return vendor || null;
  }

  async getAdminById(adminId: string) {
    const [adminUser] = await this.db
      .select()
      .from(admin)
      .where(eq(admin.id, adminId))
      .limit(1);
    return adminUser || null;
  }
}