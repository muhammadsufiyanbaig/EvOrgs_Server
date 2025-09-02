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
exports.SupportModel = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const uuid_1 = require("uuid");
const Schema_1 = require("../../../Schema");
class SupportModel {
    constructor(db) {
        this.db = db;
    }
    getTicketsByUserOrVendor(userId, vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const whereClause = userId
                ? (0, drizzle_orm_1.eq)(Schema_1.supportTickets.userId, userId)
                : (0, drizzle_orm_1.eq)(Schema_1.supportTickets.vendorId, vendorId);
            return this.db
                .select()
                .from(Schema_1.supportTickets)
                .where(whereClause)
                .orderBy((0, drizzle_orm_1.desc)(Schema_1.supportTickets.createdAt));
        });
    }
    getAllTickets() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db
                .select()
                .from(Schema_1.supportTickets)
                .orderBy((0, drizzle_orm_1.desc)(Schema_1.supportTickets.createdAt));
        });
    }
    getTicketById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const ticket = yield this.db
                .select()
                .from(Schema_1.supportTickets)
                .where((0, drizzle_orm_1.eq)(Schema_1.supportTickets.id, id))
                .limit(1);
            return ticket.length > 0 ? ticket[0] : null;
        });
    }
    getResponsesByTicketId(ticketId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db
                .select()
                .from(Schema_1.supportResponses)
                .where((0, drizzle_orm_1.eq)(Schema_1.supportResponses.ticketId, ticketId))
                .orderBy(Schema_1.supportResponses.createdAt);
        });
    }
    createTicket(input, userId, vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const ticketData = {
                id: (0, uuid_1.v4)(),
                userId: userId || null,
                vendorId: vendorId || null,
                subject: input.subject,
                description: input.description,
                ticketType: input.ticketType,
                priority: 'Medium',
                status: 'Open',
                attachments: input.attachments || [],
                createdAt: new Date(),
                updatedAt: new Date(),
                resolvedAt: null,
                closedAt: null,
            };
            const [newTicket] = yield this.db
                .insert(Schema_1.supportTickets)
                .values(ticketData)
                .returning();
            return newTicket;
        });
    }
    createResponse(input, userId, vendorId, adminId) {
        return __awaiter(this, void 0, void 0, function* () {
            const responseData = {
                id: (0, uuid_1.v4)(),
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
            const [newResponse] = yield this.db
                .insert(Schema_1.supportResponses)
                .values(responseData)
                .returning();
            return newResponse;
        });
    }
    updateTicketPriority(id, priority) {
        return __awaiter(this, void 0, void 0, function* () {
            const [updatedTicket] = yield this.db
                .update(Schema_1.supportTickets)
                .set({ priority: priority, updatedAt: new Date() })
                .where((0, drizzle_orm_1.eq)(Schema_1.supportTickets.id, id))
                .returning();
            return updatedTicket || null;
        });
    }
    updateTicketStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateData = {
                status: status,
                updatedAt: new Date(),
            };
            if (status === 'Resolved') {
                updateData.resolvedAt = new Date();
            }
            else if (status === 'Closed') {
                updateData.closedAt = new Date();
            }
            else if (status === 'Reopened') {
                updateData.resolvedAt = null;
                updateData.closedAt = null;
            }
            const [updatedTicket] = yield this.db
                .update(Schema_1.supportTickets)
                .set(updateData)
                .where((0, drizzle_orm_1.eq)(Schema_1.supportTickets.id, id))
                .returning();
            return updatedTicket || null;
        });
    }
    updateTicketTimestamp(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db
                .update(Schema_1.supportTickets)
                .set({ updatedAt: new Date() })
                .where((0, drizzle_orm_1.eq)(Schema_1.supportTickets.id, id));
        });
    }
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [user] = yield this.db
                .select()
                .from(Schema_1.users)
                .where((0, drizzle_orm_1.eq)(Schema_1.users.id, userId))
                .limit(1);
            return user || null;
        });
    }
    getVendorById(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [vendor] = yield this.db
                .select()
                .from(Schema_1.vendors)
                .where((0, drizzle_orm_1.eq)(Schema_1.vendors.id, vendorId))
                .limit(1);
            return vendor || null;
        });
    }
    getAdminById(adminId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [adminUser] = yield this.db
                .select()
                .from(Schema_1.admin)
                .where((0, drizzle_orm_1.eq)(Schema_1.admin.id, adminId))
                .limit(1);
            return adminUser || null;
        });
    }
}
exports.SupportModel = SupportModel;
