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
exports.PaymentScheduleModel = void 0;
const Schema_1 = require("../../../../Schema");
const uuid_1 = require("uuid");
const drizzle_orm_1 = require("drizzle-orm");
class PaymentScheduleModel {
    constructor(db, vendorId) {
        this.db = db;
        this.vendorId = vendorId;
    }
    verifyBookingOwnership(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            const bookingCheck = yield this.db.select({ id: Schema_1.bookings.id })
                .from(Schema_1.bookings)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.bookings.id, bookingId), (0, drizzle_orm_1.eq)(Schema_1.bookings.vendorId, this.vendorId)))
                .limit(1);
            return bookingCheck.length > 0;
        });
    }
    verifyTransactionOwnership(transactionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const transactionCheck = yield this.db.select({ id: Schema_1.posTransactions.id })
                .from(Schema_1.posTransactions)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.posTransactions.id, transactionId), (0, drizzle_orm_1.eq)(Schema_1.posTransactions.vendorId, this.vendorId)))
                .limit(1);
            return transactionCheck.length > 0;
        });
    }
    create(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const paymentScheduleData = {
                id: (0, uuid_1.v4)(),
                bookingId: input.bookingId,
                dueDate: new Date(input.dueDate).toISOString(),
                amount: String(input.amount),
                description: input.description || null,
                status: 'Pending',
                reminderSent: false,
                lastReminderDate: null,
                transactionId: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            yield this.db.insert(Schema_1.paymentSchedules).values(paymentScheduleData);
            // Convert back to PaymentSchedule type for return
            return Object.assign(Object.assign({}, paymentScheduleData), { dueDate: new Date(paymentScheduleData.dueDate), amount: Number(paymentScheduleData.amount) });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db
                .select({
                schedule: Schema_1.paymentSchedules,
                vendorId: Schema_1.bookings.vendorId
            })
                .from(Schema_1.paymentSchedules)
                .innerJoin(Schema_1.bookings, (0, drizzle_orm_1.eq)(Schema_1.paymentSchedules.bookingId, Schema_1.bookings.id))
                .where((0, drizzle_orm_1.eq)(Schema_1.paymentSchedules.id, id))
                .limit(1);
            if (result.length === 0)
                return null;
            const { schedule, vendorId } = result[0];
            return {
                schedule: Object.assign(Object.assign({}, schedule), { dueDate: new Date(schedule.dueDate), amount: Number(schedule.amount) }),
                vendorId
            };
        });
    }
    update(id, updateValues) {
        return __awaiter(this, void 0, void 0, function* () {
            // Convert values for database compatibility
            const dbUpdateValues = {
                updatedAt: new Date()
            };
            // Convert each property with proper type handling
            if (updateValues.id !== undefined)
                dbUpdateValues.id = updateValues.id;
            if (updateValues.dueDate !== undefined)
                dbUpdateValues.dueDate = new Date(updateValues.dueDate).toISOString();
            if (updateValues.amount !== undefined)
                dbUpdateValues.amount = String(updateValues.amount);
            if (updateValues.description !== undefined)
                dbUpdateValues.description = updateValues.description;
            if (updateValues.status !== undefined)
                dbUpdateValues.status = updateValues.status;
            if (updateValues.reminderSent !== undefined)
                dbUpdateValues.reminderSent = updateValues.reminderSent;
            yield this.db.update(Schema_1.paymentSchedules)
                .set(dbUpdateValues)
                .where((0, drizzle_orm_1.eq)(Schema_1.paymentSchedules.id, id));
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.delete(Schema_1.paymentSchedules).where((0, drizzle_orm_1.eq)(Schema_1.paymentSchedules.id, id));
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db.select()
                .from(Schema_1.paymentSchedules)
                .where((0, drizzle_orm_1.eq)(Schema_1.paymentSchedules.id, id))
                .limit(1);
            if (!result.length)
                return null;
            return Object.assign(Object.assign({}, result[0]), { dueDate: new Date(result[0].dueDate), amount: Number(result[0].amount) });
        });
    }
    findByBooking(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db.select()
                .from(Schema_1.paymentSchedules)
                .where((0, drizzle_orm_1.eq)(Schema_1.paymentSchedules.bookingId, bookingId))
                .orderBy(Schema_1.paymentSchedules.dueDate);
            return result;
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db
                .select()
                .from(Schema_1.paymentSchedules)
                .innerJoin(Schema_1.bookings, (0, drizzle_orm_1.eq)(Schema_1.paymentSchedules.bookingId, Schema_1.bookings.id))
                .where((0, drizzle_orm_1.eq)(Schema_1.bookings.vendorId, this.vendorId))
                .orderBy((0, drizzle_orm_1.desc)(Schema_1.paymentSchedules.dueDate));
            return result.map(row => (Object.assign(Object.assign({}, row.payment_schedules), { dueDate: new Date(row.payment_schedules.dueDate), amount: Number(row.payment_schedules.amount) })));
        });
    }
    findUpcoming() {
        return __awaiter(this, arguments, void 0, function* (limit = 5) {
            const today = new Date();
            const result = yield this.db
                .select()
                .from(Schema_1.paymentSchedules)
                .innerJoin(Schema_1.bookings, (0, drizzle_orm_1.eq)(Schema_1.paymentSchedules.bookingId, Schema_1.bookings.id))
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.bookings.vendorId, this.vendorId), (0, drizzle_orm_1.eq)(Schema_1.paymentSchedules.status, 'Pending'), (0, drizzle_orm_1.gte)(Schema_1.paymentSchedules.dueDate, today.toISOString().split('T')[0])))
                .orderBy(Schema_1.paymentSchedules.dueDate)
                .limit(limit);
            return result.map(row => (Object.assign(Object.assign({}, row.payment_schedules), { dueDate: new Date(row.payment_schedules.dueDate), amount: Number(row.payment_schedules.amount) })));
        });
    }
    getPendingTotal() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db
                .select({ amount: Schema_1.paymentSchedules.amount })
                .from(Schema_1.paymentSchedules)
                .innerJoin(Schema_1.bookings, (0, drizzle_orm_1.eq)(Schema_1.paymentSchedules.bookingId, Schema_1.bookings.id))
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.bookings.vendorId, this.vendorId), (0, drizzle_orm_1.eq)(Schema_1.paymentSchedules.status, 'Pending')));
            return result.reduce((sum, r) => sum + Number(r.amount), 0);
        });
    }
    findOverdue() {
        return __awaiter(this, void 0, void 0, function* () {
            const today = new Date();
            const result = yield this.db
                .select()
                .from(Schema_1.paymentSchedules)
                .innerJoin(Schema_1.bookings, (0, drizzle_orm_1.eq)(Schema_1.paymentSchedules.bookingId, Schema_1.bookings.id))
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.bookings.vendorId, this.vendorId), (0, drizzle_orm_1.eq)(Schema_1.paymentSchedules.status, 'Pending'), (0, drizzle_orm_1.lte)(Schema_1.paymentSchedules.dueDate, today.toISOString().split('T')[0])))
                .orderBy((0, drizzle_orm_1.desc)(Schema_1.paymentSchedules.dueDate));
            return result.map(row => (Object.assign(Object.assign({}, row.payment_schedules), { dueDate: new Date(row.payment_schedules.dueDate), amount: Number(row.payment_schedules.amount) })));
        });
    }
    getScheduleWithUserDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db
                .select({
                schedule: Schema_1.paymentSchedules,
                userEmail: Schema_1.users.email,
                userName: Schema_1.users.firstName, // Changed from users.name to users.firstName
                vendorId: Schema_1.bookings.vendorId
            })
                .from(Schema_1.paymentSchedules)
                .innerJoin(Schema_1.bookings, (0, drizzle_orm_1.eq)(Schema_1.paymentSchedules.bookingId, Schema_1.bookings.id))
                .innerJoin(Schema_1.users, (0, drizzle_orm_1.eq)(Schema_1.bookings.userId, Schema_1.users.id))
                .where((0, drizzle_orm_1.eq)(Schema_1.paymentSchedules.id, id))
                .limit(1);
            if (result.length === 0)
                return null;
            const { schedule, userEmail, userName, vendorId } = result[0];
            return {
                schedule: Object.assign(Object.assign({}, schedule), { dueDate: new Date(schedule.dueDate), amount: Number(schedule.amount) }),
                userEmail,
                userName,
                vendorId
            };
        });
    }
}
exports.PaymentScheduleModel = PaymentScheduleModel;
