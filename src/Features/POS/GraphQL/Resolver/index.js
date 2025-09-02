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
exports.posResolvers = void 0;
const graphql_1 = require("graphql");
const TransactionService_1 = require("../../Services/TransactionService");
const PaymentScheduleService_1 = require("../../Services/PaymentScheduleService");
const ExpenseService_1 = require("../../Services/ExpenseService");
// Helper function to get vendor ID from context
const getVendorId = (context) => {
    var _a;
    const vendorId = (_a = context.vendor) === null || _a === void 0 ? void 0 : _a.id;
    if (!vendorId) {
        throw new graphql_1.GraphQLError('Not authenticated', {
            extensions: { code: 'UNAUTHENTICATED' }
        });
    }
    return vendorId;
};
// Initialize services
const initializeServices = (context) => {
    const vendorId = getVendorId(context);
    return {
        transactionService: new TransactionService_1.TransactionService(context.db, vendorId),
        paymentScheduleService: new PaymentScheduleService_1.PaymentScheduleService(context.db, vendorId),
        expenseService: new ExpenseService_1.ExpenseService(context.db, vendorId)
    };
};
exports.posResolvers = {
    Query: {
        // Transaction Queries
        transaction: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            const { transactionService } = initializeServices(context);
            return transactionService.getTransactionById(id);
        }),
        transactions: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { filter }, context) {
            const { transactionService } = initializeServices(context);
            return transactionService.getTransactions(filter);
        }),
        recentTransactions: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { limit }, context) {
            const { transactionService } = initializeServices(context);
            return transactionService.getRecentTransactions(limit);
        }),
        totalRevenue: (_, __, context) => __awaiter(void 0, void 0, void 0, function* () {
            const { transactionService } = initializeServices(context);
            return transactionService.getTotalRevenue();
        }),
        transactionCountByType: (_, __, context) => __awaiter(void 0, void 0, void 0, function* () {
            const { transactionService } = initializeServices(context);
            return transactionService.getTransactionCountByType();
        }),
        transactionCount: (_, __, context) => __awaiter(void 0, void 0, void 0, function* () {
            const { transactionService } = initializeServices(context);
            return transactionService.getTransactionCount();
        }),
        // Payment Schedule Queries
        paymentSchedule: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            const { paymentScheduleService } = initializeServices(context);
            return paymentScheduleService.getPaymentScheduleById(id);
        }),
        paymentSchedulesByBooking: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { bookingId }, context) {
            const { paymentScheduleService } = initializeServices(context);
            return paymentScheduleService.getPaymentSchedulesByBooking(bookingId);
        }),
        allPaymentSchedules: (_, __, context) => __awaiter(void 0, void 0, void 0, function* () {
            const { paymentScheduleService } = initializeServices(context);
            return paymentScheduleService.getAllPaymentSchedules();
        }),
        upcomingPayments: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { limit }, context) {
            const { paymentScheduleService } = initializeServices(context);
            return paymentScheduleService.getUpcomingPayments(limit);
        }),
        pendingPaymentsTotal: (_, __, context) => __awaiter(void 0, void 0, void 0, function* () {
            const { paymentScheduleService } = initializeServices(context);
            return paymentScheduleService.getPendingPaymentsTotal();
        }),
        overduePayments: (_, __, context) => __awaiter(void 0, void 0, void 0, function* () {
            const { paymentScheduleService } = initializeServices(context);
            return paymentScheduleService.findOverduePayments();
        }),
        // Expense Queries
        expense: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            const { expenseService } = initializeServices(context);
            return expenseService.getExpenseById(id);
        }),
        expensesByBooking: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { bookingId }, context) {
            const { expenseService } = initializeServices(context);
            return expenseService.getExpensesByBooking(bookingId);
        }),
        allExpenses: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { startDate, endDate }, context) {
            const { expenseService } = initializeServices(context);
            return expenseService.getAllExpenses(startDate, endDate);
        }),
        totalExpenses: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { startDate, endDate }, context) {
            const { expenseService } = initializeServices(context);
            return expenseService.getTotalExpenses(startDate, endDate);
        }),
        expensesByCategory: (_, __, context) => __awaiter(void 0, void 0, void 0, function* () {
            const { expenseService } = initializeServices(context);
            return expenseService.getExpensesByCategory();
        }),
        monthlyExpenses: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { year }, context) {
            const { expenseService } = initializeServices(context);
            return expenseService.getMonthlyExpenses(year);
        })
    },
    Mutation: {
        // Transaction Mutations
        createTransaction: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { input }, context) {
            const { transactionService } = initializeServices(context);
            return transactionService.createTransaction(input);
        }),
        updateTransaction: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { input }, context) {
            const { transactionService } = initializeServices(context);
            return transactionService.updateTransaction(input);
        }),
        processTransaction: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            const { transactionService } = initializeServices(context);
            return transactionService.processTransaction(id);
        }),
        deleteTransaction: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            const { transactionService } = initializeServices(context);
            return transactionService.deleteTransaction(id);
        }),
        // Payment Schedule Mutations
        createPaymentSchedule: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { input }, context) {
            const { paymentScheduleService } = initializeServices(context);
            return paymentScheduleService.createPaymentSchedule(input);
        }),
        updatePaymentSchedule: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { input }, context) {
            const { paymentScheduleService } = initializeServices(context);
            return paymentScheduleService.updatePaymentSchedule(input);
        }),
        deletePaymentSchedule: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            const { paymentScheduleService } = initializeServices(context);
            return paymentScheduleService.deletePaymentSchedule(id);
        }),
        markPaymentAsPaid: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id, transactionId }, context) {
            const { paymentScheduleService } = initializeServices(context);
            return paymentScheduleService.markPaymentAsPaid(id, transactionId);
        }),
        sendPaymentReminder: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            const { paymentScheduleService } = initializeServices(context);
            return paymentScheduleService.sendPaymentReminder(id);
        }),
        // Expense Mutations
        createExpense: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { input }, context) {
            const { expenseService } = initializeServices(context);
            return expenseService.createExpense(input);
        }),
        updateExpense: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { input }, context) {
            const { expenseService } = initializeServices(context);
            return expenseService.updateExpense(input);
        }),
        deleteExpense: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            const { expenseService } = initializeServices(context);
            return expenseService.deleteExpense(id);
        })
    }
};
