"use strict";
// src/Features/POS/models/PosTransactionModel.ts
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
exports.PosTransactionModel = void 0;
const Schema_1 = require("../../../../Schema");
const drizzle_orm_1 = require("drizzle-orm");
class PosTransactionModel {
    constructor(db) {
        this.db = db;
    }
    findTransactionById(id, vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.db.select()
                .from(Schema_1.posTransactions)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.posTransactions.id, id), (0, drizzle_orm_1.eq)(Schema_1.posTransactions.vendorId, vendorId)))
                .limit(1);
            return transaction.length > 0 ? transaction[0] : null;
        });
    }
    findBookingById(bookingId, vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const bookingCheck = yield this.db.select({ id: Schema_1.bookings.id })
                .from(Schema_1.bookings)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.bookings.id, bookingId), (0, drizzle_orm_1.eq)(Schema_1.bookings.vendorId, vendorId)))
                .limit(1);
            return bookingCheck.length > 0;
        });
    }
    getBookingUserId(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            const booking = yield this.db.select({
                userId: Schema_1.bookings.userId
            })
                .from(Schema_1.bookings)
                .where((0, drizzle_orm_1.eq)(Schema_1.bookings.id, bookingId))
                .limit(1);
            return booking.length > 0 ? booking[0].userId : null;
        });
    }
    insertTransaction(transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbTransaction = Object.assign(Object.assign({}, transaction), { amount: transaction.amount.toString() });
            yield this.db.insert(Schema_1.posTransactions).values(dbTransaction);
            return transaction;
        });
    }
    updateTransaction(id, values) {
        return __awaiter(this, void 0, void 0, function* () {
            const filteredValues = Object.fromEntries(Object.entries(values).filter(([_, v]) => v !== undefined));
            yield this.db.update(Schema_1.posTransactions)
                .set(filteredValues)
                .where((0, drizzle_orm_1.eq)(Schema_1.posTransactions.id, id));
            const updatedTransaction = yield this.db.select()
                .from(Schema_1.posTransactions)
                .where((0, drizzle_orm_1.eq)(Schema_1.posTransactions.id, id))
                .limit(1);
            return updatedTransaction[0];
        });
    }
    deleteTransaction(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.delete(Schema_1.posTransactions)
                .where((0, drizzle_orm_1.eq)(Schema_1.posTransactions.id, id));
            return true;
        });
    }
    findTransactions(vendorId, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            let conditions = [(0, drizzle_orm_1.eq)(Schema_1.posTransactions.vendorId, vendorId)];
            if (filter) {
                if (filter.startDate) {
                    conditions.push((0, drizzle_orm_1.gte)(Schema_1.posTransactions.createdAt, new Date(filter.startDate)));
                }
                if (filter.endDate) {
                    conditions.push((0, drizzle_orm_1.lte)(Schema_1.posTransactions.createdAt, new Date(filter.endDate)));
                }
                if (filter.transactionType) {
                    conditions.push((0, drizzle_orm_1.eq)(Schema_1.posTransactions.transactionType, filter.transactionType));
                }
                if (filter.status) {
                    conditions.push((0, drizzle_orm_1.eq)(Schema_1.posTransactions.status, filter.status));
                }
                if (filter.bookingId) {
                    conditions.push((0, drizzle_orm_1.eq)(Schema_1.posTransactions.bookingId, filter.bookingId));
                }
            }
            const transactions = yield this.db.select()
                .from(Schema_1.posTransactions)
                .where((0, drizzle_orm_1.and)(...conditions))
                .orderBy((0, drizzle_orm_1.desc)(Schema_1.posTransactions.createdAt));
            return transactions;
        });
    }
    findRecentTransactions(vendorId, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const transactions = yield this.db.select()
                .from(Schema_1.posTransactions)
                .where((0, drizzle_orm_1.eq)(Schema_1.posTransactions.vendorId, vendorId))
                .orderBy((0, drizzle_orm_1.desc)(Schema_1.posTransactions.createdAt))
                .limit(limit);
            return transactions;
        });
    }
    calculateTotalRevenue(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const result = yield this.db
                .select({
                total: (0, drizzle_orm_1.sql) `SUM(CASE WHEN transaction_type IN ('Advance', 'Balance', 'Full Payment', 'Additional Service') THEN amount ELSE 0 END) - SUM(CASE WHEN transaction_type = 'Refund' THEN amount ELSE 0 END)`
            })
                .from(Schema_1.posTransactions)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.posTransactions.vendorId, vendorId), (0, drizzle_orm_1.eq)(Schema_1.posTransactions.status, 'Completed')));
            return ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.total) ? parseFloat(result[0].total) : 0;
        });
    }
    getTransactionCountByType(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db
                .select({
                type: Schema_1.posTransactions.transactionType,
                amount: (0, drizzle_orm_1.sql) `SUM(amount)`
            })
                .from(Schema_1.posTransactions)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(Schema_1.posTransactions.vendorId, vendorId), (0, drizzle_orm_1.eq)(Schema_1.posTransactions.status, 'Completed')))
                .groupBy(Schema_1.posTransactions.transactionType);
            return result.map(item => ({
                type: item.type,
                amount: parseFloat(item.amount || '0')
            }));
        });
    }
    getTransactionCount(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const result = yield this.db
                .select({
                count: (0, drizzle_orm_1.sql) `COUNT(*)`
            })
                .from(Schema_1.posTransactions)
                .where((0, drizzle_orm_1.eq)(Schema_1.posTransactions.vendorId, vendorId));
            return ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.count) || 0;
        });
    }
}
exports.PosTransactionModel = PosTransactionModel;
