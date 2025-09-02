"use strict";
// src/Features/POS/services/TransactionService.ts
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
exports.TransactionService = void 0;
const uuid_1 = require("uuid");
const generators_1 = require("../../utils/generators");
const Transaction_1 = require("../../Model/Transaction");
class TransactionService {
    constructor(db, vendorId) {
        this.transactionModel = new Transaction_1.PosTransactionModel(db);
        this.vendorId = vendorId;
    }
    createTransaction(input) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verify booking belongs to vendor
            const bookingExists = yield this.transactionModel.findBookingById(input.bookingId, this.vendorId);
            if (!bookingExists) {
                throw new Error('Booking not found or does not belong to vendor');
            }
            const userId = yield this.transactionModel.getBookingUserId(input.bookingId);
            if (!userId) {
                throw new Error('Booking not found');
            }
            // Generate transaction number
            const transactionNumber = (0, generators_1.generateTransactionNumber)();
            // Create new transaction
            const transaction = {
                id: (0, uuid_1.v4)(),
                vendorId: this.vendorId,
                bookingId: input.bookingId,
                userId,
                transactionNumber,
                amount: input.amount,
                transactionType: input.transactionType,
                paymentMethod: input.paymentMethod,
                description: input.description,
                receiptNumber: input.receiptNumber,
                paymentGatewayReference: input.paymentGatewayReference,
                status: 'Pending',
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            return yield this.transactionModel.insertTransaction(transaction);
        });
    }
    updateTransaction(input) {
        return __awaiter(this, void 0, void 0, function* () {
            // First get the transaction and check ownership
            const existingTransaction = yield this.transactionModel.findTransactionById(input.id, this.vendorId);
            if (!existingTransaction) {
                throw new Error('Transaction not found or does not belong to vendor');
            }
            // Prepare update values
            const updateValues = {
                updatedAt: new Date(),
            };
            if (input.amount !== undefined)
                updateValues.amount = input.amount;
            if (input.transactionType !== undefined)
                updateValues.transactionType = input.transactionType;
            if (input.paymentMethod !== undefined)
                updateValues.paymentMethod = input.paymentMethod;
            if (input.description !== undefined)
                updateValues.description = input.description;
            if (input.receiptNumber !== undefined)
                updateValues.receiptNumber = input.receiptNumber;
            if (input.paymentGatewayReference !== undefined)
                updateValues.paymentGatewayReference = input.paymentGatewayReference;
            if (input.status !== undefined)
                updateValues.status = input.status;
            // Update transaction
            return yield this.transactionModel.updateTransaction(input.id, updateValues);
        });
    }
    processTransaction(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get transaction and check ownership
            const existingTransaction = yield this.transactionModel.findTransactionById(id, this.vendorId);
            if (!existingTransaction) {
                throw new Error('Transaction not found or does not belong to vendor');
            }
            // Process transaction - in a real system, this would integrate with a payment gateway
            const updateValues = {
                status: 'Completed',
                processedAt: new Date(),
                updatedAt: new Date(),
            };
            // Update transaction
            return yield this.transactionModel.updateTransaction(id, updateValues);
        });
    }
    deleteTransaction(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if transaction exists and belongs to vendor
            const existingTransaction = yield this.transactionModel.findTransactionById(id, this.vendorId);
            if (!existingTransaction) {
                throw new Error('Transaction not found or does not belong to vendor');
            }
            // Delete transaction
            return yield this.transactionModel.deleteTransaction(id);
        });
    }
    getTransactionById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.transactionModel.findTransactionById(id, this.vendorId);
        });
    }
    getTransactions(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.transactionModel.findTransactions(this.vendorId, filter);
        });
    }
    getRecentTransactions() {
        return __awaiter(this, arguments, void 0, function* (limit = 5) {
            return yield this.transactionModel.findRecentTransactions(this.vendorId, limit);
        });
    }
    getTotalRevenue() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.transactionModel.calculateTotalRevenue(this.vendorId);
        });
    }
    getTransactionCountByType() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.transactionModel.getTransactionCountByType(this.vendorId);
        });
    }
    getTransactionCount() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.transactionModel.getTransactionCount(this.vendorId);
        });
    }
}
exports.TransactionService = TransactionService;
