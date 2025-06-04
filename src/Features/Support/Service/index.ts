import { SupportModel } from '../Model';
import { CreateTicketInput, CreateResponseInput } from '../Types';
import { Context } from '../../../GraphQL/Context';

export class SupportService {
  private model: SupportModel;

  constructor(db: Context['db']) {
    this.model = new SupportModel(db);
  }

  async getMyTickets(context: Context) {
    const { user, vendor } = context;

    if (!user && !vendor) {
      throw new Error('Authentication required');
    }

    return this.model.getTicketsByUserOrVendor(user?.id, vendor?.id);
  }

  async getAllTickets(context: Context) {
    const { Admin } = context;

    if (!Admin) {
      throw new Error('Admin access required');
    }

    return this.model.getAllTickets();
  }

  async getTicket(id: string, context: Context) {
    const { user, vendor, Admin } = context;

    if (!user && !vendor && !Admin) {
      throw new Error('Authentication required');
    }

    const ticket = await this.model.getTicketById(id);
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    if (!Admin) {
      const hasAccess = (user && ticket.userId === user.id) || (vendor && ticket.vendorId === vendor.id);
      if (!hasAccess) {
        throw new Error('Access denied');
      }
    }

    return ticket;
  }

  async getTicketResponses(ticketId: string, context: Context) {
    const { user, vendor, Admin } = context;

    if (!user && !vendor && !Admin) {
      throw new Error('Authentication required');
    }

    const ticket = await this.model.getTicketById(ticketId);
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    if (!Admin) {
      const hasAccess = (user && ticket.userId === user.id) || (vendor && ticket.vendorId === vendor.id);
      if (!hasAccess) {
        throw new Error('Access denied');
      }
    }

    let responses = await this.model.getResponsesByTicketId(ticketId);
    if (!Admin) {
      responses = responses.filter((response) => !response.isInternal);
    }

    return responses;
  }

  async createTicket(input: CreateTicketInput, context: Context) {
    const { user, vendor } = context;

    if (!user && !vendor) {
      throw new Error('Authentication required');
    }

    return this.model.createTicket(input, user?.id, vendor?.id);
  }

  async addResponse(input: CreateResponseInput, context: Context) {
    const { user, vendor, Admin } = context;

    if (!user && !vendor && !Admin) {
      throw new Error('Authentication required');
    }

    const ticket = await this.model.getTicketById(input.ticketId);
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    if (!Admin) {
      const hasAccess = (user && ticket.userId === user.id) || (vendor && ticket.vendorId === vendor.id);
      if (!hasAccess) {
        throw new Error('Access denied');
      }
      if (input.isInternal) {
        throw new Error('Only admins can create internal responses');
      }
    }

    const response = await this.model.createResponse(input, user?.id, vendor?.id, Admin?.id);
    await this.model.updateTicketTimestamp(input.ticketId);
    return response;
  }

  async updateTicketPriority(id: string, priority: string, context: Context) {
    const { Admin } = context;

    if (!Admin) {
      throw new Error('Admin access required');
    }

    const updatedTicket = await this.model.updateTicketPriority(id, priority);
    if (!updatedTicket) {
      throw new Error('Ticket not found');
    }

    return updatedTicket;
  }

  async updateTicketStatus(id: string, status: string, context: Context) {
    const { Admin } = context;

    if (!Admin) {
      throw new Error('Admin access required');
    }

    const updatedTicket = await this.model.updateTicketStatus(id, status);
    if (!updatedTicket) {
      throw new Error('Ticket not found');
    }

    return updatedTicket;
  }

  async resolveTicket(id: string, responseText: string, attachments: string[] | undefined, context: Context) {
    const { Admin } = context;

    if (!Admin) {
      throw new Error('Admin access required');
    }

    const responseData = {
      ticketId: id,
      responseText,
      attachments: attachments || [],
      isInternal: false,
    };

    await this.model.createResponse(responseData, undefined, undefined, Admin.id);
    const updatedTicket = await this.model.updateTicketStatus(id, 'Resolved');
    if (!updatedTicket) {
      throw new Error('Ticket not found');
    }

    return updatedTicket;
  }

  async closeTicket(id: string, context: Context) {
    const { Admin } = context;

    if (!Admin) {
      throw new Error('Admin access required');
    }

    const updatedTicket = await this.model.updateTicketStatus(id, 'Closed');
    if (!updatedTicket) {
      throw new Error('Ticket not found');
    }

    return updatedTicket;
  }

  async reopenTicket(id: string, context: Context) {
    const { Admin } = context;

    if (!Admin) {
      throw new Error('Admin access required');
    }

    const updatedTicket = await this.model.updateTicketStatus(id, 'Reopened');
    if (!updatedTicket) {
      throw new Error('Ticket not found');
    }

    return updatedTicket;
  }

  async getTicketCreator(parent: any) {
    if (parent.userId) {
      return this.model.getUserById(parent.userId);
    }
    if (parent.vendorId) {
      return this.model.getVendorById(parent.vendorId);
    }
    return null;
  }

  async getResponseResponder(parent: any) {
    if (parent.adminId) {
      return this.model.getAdminById(parent.adminId);
    }
    if (parent.userId) {
      return this.model.getUserById(parent.userId);
    }
    if (parent.vendorId) {
      return this.model.getVendorById(parent.vendorId);
    }
    return null;
  }
}