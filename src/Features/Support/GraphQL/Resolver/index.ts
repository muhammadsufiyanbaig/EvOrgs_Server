import { SupportService } from '../../Service';
import { Context } from '../../../../GraphQL/Context';
import { CreateTicketInput, CreateResponseInput } from '../../Types';

export const supportResolvers = {
  Query: {
    getMyTickets: async (_: any, __: any, context: Context) => {
      const service = new SupportService(context.db);
      return service.getMyTickets(context);
    },

    getAllTickets: async (_: any, __: any, context: Context) => {
      const service = new SupportService(context.db);
      return service.getAllTickets(context);
    },

    getTicket: async (_: any, { id }: { id: string }, context: Context) => {
      const service = new SupportService(context.db);
      return service.getTicket(id, context);
    },

    getTicketResponses: async (_: any, { ticketId }: { ticketId: string }, context: Context) => {
      const service = new SupportService(context.db);
      return service.getTicketResponses(ticketId, context);
    },
  },

  Mutation: {
    createTicket: async (_: any, { input }: { input: CreateTicketInput }, context: Context) => {
      const service = new SupportService(context.db);
      return service.createTicket(input, context);
    },

    addResponse: async (_: any, { input }: { input: CreateResponseInput }, context: Context) => {
      const service = new SupportService(context.db);
      return service.addResponse(input, context);
    },

    updateTicketPriority: async (_: any, { id, priority }: { id: string; priority: string }, context: Context) => {
      const service = new SupportService(context.db);
      return service.updateTicketPriority(id, priority, context);
    },

    updateTicketStatus: async (_: any, { id, status }: { id: string; status: string }, context: Context) => {
      const service = new SupportService(context.db);
      return service.updateTicketStatus(id, status, context);
    },

    resolveTicket: async (
      _: any,
      { id, responseText, attachments }: { id: string; responseText: string; attachments?: string[] },
      context: Context
    ) => {
      const service = new SupportService(context.db);
      return service.resolveTicket(id, responseText, attachments, context);
    },

    closeTicket: async (_: any, { id }: { id: string }, context: Context) => {
      const service = new SupportService(context.db);
      return service.closeTicket(id, context);
    },

    reopenTicket: async (_: any, { id }: { id: string }, context: Context) => {
      const service = new SupportService(context.db);
      return service.reopenTicket(id, context);
    },
  },

  SupportTicket: {
    responses: async (parent: any, _: any, context: Context) => {
      const service = new SupportService(context.db);
      return service.getTicketResponses(parent.id, context);
    },

    creator: async (parent: any, _: any, context: Context) => {
      const service = new SupportService(context.db);
      return service.getTicketCreator(parent);
    },
  },

  SupportResponse: {
    responder: async (parent: any, _: any, context: Context) => {
      const service = new SupportService(context.db);
      return service.getResponseResponder(parent);
    },
  },

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