"use strict";
// src/Features/POS/services/ExpenseService.ts
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
exports.ExpenseService = void 0;
const ExpenseModel_1 = require("../../Model/ExpenseModel");
class ExpenseService {
    constructor(db, vendorId) {
        this.expenseModel = new ExpenseModel_1.ExpenseModel(db, vendorId);
    }
    createExpense(input) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verify booking belongs to vendor
            const bookingExists = yield this.expenseModel.verifyBookingOwnership(input.bookingId);
            if (!bookingExists) {
                throw new Error('Booking not found or does not belong to vendor');
            }
            // Create new expense
            return this.expenseModel.create(input);
        });
    }
    updateExpense(input) {
        return __awaiter(this, void 0, void 0, function* () {
            // First get the expense and check ownership
            const existingExpense = yield this.expenseModel.findById(input.id);
            if (!existingExpense) {
                throw new Error('Expense not found or does not belong to vendor');
            }
            // Prepare update values matching the expected UpdateServiceExpenseInput type
            const updateValues = {};
            if (input.description !== undefined)
                updateValues.description = input.description;
            if (input.amount !== undefined)
                updateValues.amount = input.amount;
            if (input.category !== undefined)
                updateValues.category = input.category;
            if (input.receiptUrl !== undefined)
                updateValues.receiptUrl = input.receiptUrl;
            if (input.expenseDate !== undefined)
                updateValues.expenseDate = input.expenseDate;
            // Update expense
            yield this.expenseModel.update(input.id, updateValues);
            // Return updated expense
            const updatedExpense = yield this.expenseModel.findById(input.id);
            return updatedExpense;
        });
    }
    deleteExpense(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if expense exists and belongs to vendor
            const existingExpense = yield this.expenseModel.findById(id);
            if (!existingExpense) {
                throw new Error('Expense not found or does not belong to vendor');
            }
            // Delete expense
            yield this.expenseModel.delete(id);
            return true;
        });
    }
    getExpenseById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.expenseModel.findById(id);
        });
    }
    getExpensesByBooking(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verify booking belongs to vendor
            const bookingExists = yield this.expenseModel.verifyBookingOwnership(bookingId);
            if (!bookingExists) {
                throw new Error('Booking not found or does not belong to vendor');
            }
            return this.expenseModel.findByBooking(bookingId);
        });
    }
    getAllExpenses(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.expenseModel.findAll(startDate, endDate);
        });
    }
    getTotalExpenses(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.expenseModel.getTotal(startDate, endDate);
        });
    }
    getExpensesByCategory() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.expenseModel.getByCategory();
        });
    }
    getMonthlyExpenses(year) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.expenseModel.getMonthlyExpenses(year);
        });
    }
}
exports.ExpenseService = ExpenseService;
