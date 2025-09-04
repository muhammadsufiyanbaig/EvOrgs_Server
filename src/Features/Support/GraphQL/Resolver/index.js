"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportResolvers = void 0;
const Service_1 = require("../../Service");
exports.supportResolvers = {
    Query: {
        getMyTickets: (_, __, context) => __awaiter(void 0, void 0, void 0, function* () {
            const service = new Service_1.SupportService(context.db);
            return service.getMyTickets(context);
        }),
        getAllTickets: (_, __, context) => __awaiter(void 0, void 0, void 0, function* () {
            const service = new Service_1.SupportService(context.db);
            return service.getAllTickets(context);
        }),
        getTicket: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            const service = new Service_1.SupportService(context.db);
            return service.getTicket(id, context);
        }),
        getTicketResponses: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { ticketId }, context) {
            const service = new Service_1.SupportService(context.db);
            return service.getTicketResponses(ticketId, context);
        }),
    },
    Mutation: {
        createTicket: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { input }, context) {
            const service = new Service_1.SupportService(context.db);
            return service.createTicket(input, context);
        }),
        addResponse: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { input }, context) {
            const service = new Service_1.SupportService(context.db);
            return service.addResponse(input, context);
        }),
        updateTicketPriority: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id, priority }, context) {
            const service = new Service_1.SupportService(context.db);
            return service.updateTicketPriority(id, priority, context);
        }),
        updateTicketStatus: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id, status }, context) {
            const service = new Service_1.SupportService(context.db);
            return service.updateTicketStatus(id, status, context);
        }),
        resolveTicket: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id, responseText, attachments }, context) {
            const service = new Service_1.SupportService(context.db);
            return service.resolveTicket(id, responseText, attachments, context);
        }),
        closeTicket: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            const service = new Service_1.SupportService(context.db);
            return service.closeTicket(id, context);
        }),
        reopenTicket: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            const service = new Service_1.SupportService(context.db);
            return service.reopenTicket(id, context);
        }),
    },
    SupportTicket: {
        responses: (parent, _, context) => __awaiter(void 0, void 0, void 0, function* () {
            const service = new Service_1.SupportService(context.db);
            return service.getTicketResponses(parent.id, context);
        }),
        creator: (parent, _, context) => __awaiter(void 0, void 0, void 0, function* () {
            const service = new Service_1.SupportService(context.db);
            return service.getTicketCreator(parent);
        }),
    },
    SupportResponse: {
        responder: (parent, _, context) => __awaiter(void 0, void 0, void 0, function* () {
            const service = new Service_1.SupportService(context.db);
            return service.getResponseResponder(parent);
        }),
    },
    TicketCreator: {
        __resolveType(obj) {
            if (obj.businessName)
                return 'Vendor';
            if (obj.firstName)
                return 'User';
            return null;
        },
    },
    ResponseCreator: {
        __resolveType(obj) {
            if (obj.role)
                return 'Admin';
            if (obj.businessName)
                return 'Vendor';
            if (obj.firstName)
                return 'User';
            return null;
        },
    },
};
