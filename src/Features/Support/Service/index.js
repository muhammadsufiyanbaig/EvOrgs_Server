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
exports.SupportService = void 0;
const Model_1 = require("../Model");
class SupportService {
    constructor(db) {
        this.model = new Model_1.SupportModel(db);
    }
    getMyTickets(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user, vendor } = context;
            if (!user && !vendor) {
                throw new Error('Authentication required');
            }
            return this.model.getTicketsByUserOrVendor(user === null || user === void 0 ? void 0 : user.id, vendor === null || vendor === void 0 ? void 0 : vendor.id);
        });
    }
    getAllTickets(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const { Admin } = context;
            if (!Admin) {
                throw new Error('Admin access required');
            }
            return this.model.getAllTickets();
        });
    }
    getTicket(id, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user, vendor, Admin } = context;
            if (!user && !vendor && !Admin) {
                throw new Error('Authentication required');
            }
            const ticket = yield this.model.getTicketById(id);
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
        });
    }
    getTicketResponses(ticketId, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user, vendor, Admin } = context;
            if (!user && !vendor && !Admin) {
                throw new Error('Authentication required');
            }
            const ticket = yield this.model.getTicketById(ticketId);
            if (!ticket) {
                throw new Error('Ticket not found');
            }
            if (!Admin) {
                const hasAccess = (user && ticket.userId === user.id) || (vendor && ticket.vendorId === vendor.id);
                if (!hasAccess) {
                    throw new Error('Access denied');
                }
            }
            let responses = yield this.model.getResponsesByTicketId(ticketId);
            if (!Admin) {
                responses = responses.filter((response) => !response.isInternal);
            }
            return responses;
        });
    }
    createTicket(input, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user, vendor } = context;
            if (!user && !vendor) {
                throw new Error('Authentication required');
            }
            return this.model.createTicket(input, user === null || user === void 0 ? void 0 : user.id, vendor === null || vendor === void 0 ? void 0 : vendor.id);
        });
    }
    addResponse(input, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user, vendor, Admin } = context;
            if (!user && !vendor && !Admin) {
                throw new Error('Authentication required');
            }
            const ticket = yield this.model.getTicketById(input.ticketId);
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
            const response = yield this.model.createResponse(input, user === null || user === void 0 ? void 0 : user.id, vendor === null || vendor === void 0 ? void 0 : vendor.id, Admin === null || Admin === void 0 ? void 0 : Admin.id);
            yield this.model.updateTicketTimestamp(input.ticketId);
            return response;
        });
    }
    updateTicketPriority(id, priority, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const { Admin } = context;
            if (!Admin) {
                throw new Error('Admin access required');
            }
            const updatedTicket = yield this.model.updateTicketPriority(id, priority);
            if (!updatedTicket) {
                throw new Error('Ticket not found');
            }
            return updatedTicket;
        });
    }
    updateTicketStatus(id, status, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const { Admin } = context;
            if (!Admin) {
                throw new Error('Admin access required');
            }
            const updatedTicket = yield this.model.updateTicketStatus(id, status);
            if (!updatedTicket) {
                throw new Error('Ticket not found');
            }
            return updatedTicket;
        });
    }
    resolveTicket(id, responseText, attachments, context) {
        return __awaiter(this, void 0, void 0, function* () {
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
            yield this.model.createResponse(responseData, undefined, undefined, Admin.id);
            const updatedTicket = yield this.model.updateTicketStatus(id, 'Resolved');
            if (!updatedTicket) {
                throw new Error('Ticket not found');
            }
            return updatedTicket;
        });
    }
    closeTicket(id, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const { Admin } = context;
            if (!Admin) {
                throw new Error('Admin access required');
            }
            const updatedTicket = yield this.model.updateTicketStatus(id, 'Closed');
            if (!updatedTicket) {
                throw new Error('Ticket not found');
            }
            return updatedTicket;
        });
    }
    reopenTicket(id, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const { Admin } = context;
            if (!Admin) {
                throw new Error('Admin access required');
            }
            const updatedTicket = yield this.model.updateTicketStatus(id, 'Reopened');
            if (!updatedTicket) {
                throw new Error('Ticket not found');
            }
            return updatedTicket;
        });
    }
    getTicketCreator(parent) {
        return __awaiter(this, void 0, void 0, function* () {
            if (parent.userId) {
                return this.model.getUserById(parent.userId);
            }
            if (parent.vendorId) {
                return this.model.getVendorById(parent.vendorId);
            }
            return null;
        });
    }
    getResponseResponder(parent) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
}
exports.SupportService = SupportService;
