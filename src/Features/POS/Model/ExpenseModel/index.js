"use strict";
// src/Features/POS/models/ExpenseModel.ts
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
exports.ExpenseModel = void 0;
const Schema_1 = require("../../../../Schema");
const uuid_1 = require("uuid");
const drizzle_orm_1 = require("drizzle-orm");
class ExpenseModel {
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
    create(input) {
        return __awaiter(this, void 0, void 0, function* () {
            // Create a date object for database operations
            const now = new Date();
            const expenseDate = input.expenseDate ? new Date(input.expenseDate) : now;
            // Create object for database insertion with proper types
            const dbExpense = {
                id: (0, uuid_1.v4)(),
                bookingId: input.bookingId,
                vendorId: this.vendorId,
                description: input.description,
                amount: input.amount.toString(),
                category: input.category,
                receiptUrl: input.receiptUrl,
                expenseDate: expenseDate.toISOString(),
            };
            // Insert into database
            yield this.db.insert(Schema_1.serviceExpenses).values(dbExpense);
            // Return the complete expense object with correct types for the application
            return Object.assign(Object.assign({}, dbExpense), { amount: input.amount, expenseDate: expenseDate, createdAt: now, updatedAt: now });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const expense = yield this.db.select()
                .from(Schema_1.serviceExpenses)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.serviceExpenses.id, id), (0, drizzle_orm_1.eq)(Schema_1.serviceExpenses.vendorId, this.vendorId)))
                .limit(1);
            if (expense.length === 0)
                return null;
            // Convert DB result to ServiceExpense type
            const result = expense[0];
            return Object.assign(Object.assign({}, result), { amount: parseFloat(result.amount), expenseDate: new Date(result.expenseDate), createdAt: new Date(result.createdAt), updatedAt: new Date(result.updatedAt) });
        });
    }
    update(id, updateValues) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbUpdateValues = {
                updatedAt: new Date().toISOString()
            };
            // Convert all update values to string format for DB
            if (updateValues.description !== undefined)
                dbUpdateValues.description = updateValues.description;
            if (updateValues.amount !== undefined)
                dbUpdateValues.amount = updateValues.amount.toString();
            if (updateValues.category !== undefined)
                dbUpdateValues.category = updateValues.category;
            if (updateValues.receiptUrl !== undefined)
                dbUpdateValues.receiptUrl = updateValues.receiptUrl;
            if (updateValues.expenseDate !== undefined) {
                dbUpdateValues.expenseDate = updateValues.expenseDate;
            }
            yield this.db.update(Schema_1.serviceExpenses)
                .set(dbUpdateValues)
                .where((0, drizzle_orm_1.eq)(Schema_1.serviceExpenses.id, id));
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.delete(Schema_1.serviceExpenses)
                .where((0, drizzle_orm_1.eq)(Schema_1.serviceExpenses.id, id));
        });
    }
    findByBooking(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            const expenses = yield this.db.select()
                .from(Schema_1.serviceExpenses)
                .where((0, drizzle_orm_1.eq)(Schema_1.serviceExpenses.bookingId, bookingId))
                .orderBy((0, drizzle_orm_1.desc)(Schema_1.serviceExpenses.expenseDate));
            // Convert DB results to ServiceExpense type
            return expenses.map(e => (Object.assign(Object.assign({}, e), { amount: parseFloat(e.amount), expenseDate: new Date(e.expenseDate), createdAt: new Date(e.createdAt), updatedAt: new Date(e.updatedAt) })));
        });
    }
    findAll(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            let conditions = [(0, drizzle_orm_1.eq)(Schema_1.serviceExpenses.vendorId, this.vendorId)];
            if (startDate) {
                conditions.push((0, drizzle_orm_1.gte)(Schema_1.serviceExpenses.expenseDate, startDate));
            }
            if (endDate) {
                conditions.push((0, drizzle_orm_1.lte)(Schema_1.serviceExpenses.expenseDate, endDate));
            }
            const expenses = yield this.db.select()
                .from(Schema_1.serviceExpenses)
                .where((0, drizzle_orm_1.and)(...conditions))
                .orderBy((0, drizzle_orm_1.desc)(Schema_1.serviceExpenses.expenseDate));
            // Convert DB results to ServiceExpense type
            return expenses.map(e => (Object.assign(Object.assign({}, e), { amount: parseFloat(e.amount), expenseDate: new Date(e.expenseDate), createdAt: new Date(e.createdAt), updatedAt: new Date(e.updatedAt) })));
        });
    }
    getTotal(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            let conditions = [(0, drizzle_orm_1.eq)(Schema_1.serviceExpenses.vendorId, this.vendorId)];
            if (startDate) {
                conditions.push((0, drizzle_orm_1.gte)(Schema_1.serviceExpenses.expenseDate, startDate));
            }
            if (endDate) {
                conditions.push((0, drizzle_orm_1.lte)(Schema_1.serviceExpenses.expenseDate, endDate));
            }
            const result = yield this.db
                .select({
                total: (0, drizzle_orm_1.sql) `SUM(amount)`
            })
                .from(Schema_1.serviceExpenses)
                .where((0, drizzle_orm_1.and)(...conditions));
            return ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.total) ? parseFloat(result[0].total) : 0;
        });
    }
    getByCategory() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db
                .select({
                category: Schema_1.serviceExpenses.category,
                amount: (0, drizzle_orm_1.sql) `SUM(amount)`
            })
                .from(Schema_1.serviceExpenses)
                .where((0, drizzle_orm_1.eq)(Schema_1.serviceExpenses.vendorId, this.vendorId))
                .groupBy(Schema_1.serviceExpenses.category);
            return result.map(item => ({
                category: item.category || 'Uncategorized',
                amount: parseFloat(item.amount || '0')
            }));
        });
    }
    getMonthlyExpenses(year) {
        return __awaiter(this, void 0, void 0, function* () {
            // Create ISO string for dates
            const startDate = new Date(year, 0, 1).toISOString(); // January 1st of the given year
            const endDate = new Date(year, 11, 31).toISOString(); // December 31st of the given year
            const result = yield this.db
                .select({
                month: (0, drizzle_orm_1.sql) `EXTRACT(MONTH FROM expense_date)`,
                amount: (0, drizzle_orm_1.sql) `SUM(amount)`
            })
                .from(Schema_1.serviceExpenses)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.serviceExpenses.vendorId, this.vendorId), (0, drizzle_orm_1.gte)(Schema_1.serviceExpenses.expenseDate, startDate), (0, drizzle_orm_1.lte)(Schema_1.serviceExpenses.expenseDate, endDate)))
                .groupBy((0, drizzle_orm_1.sql) `EXTRACT(MONTH FROM expense_date)`);
            return result.map(item => ({
                month: item.month,
                amount: parseFloat(item.amount || '0')
            }));
        });
    }
}
exports.ExpenseModel = ExpenseModel;
