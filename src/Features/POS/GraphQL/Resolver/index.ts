import { GraphQLError } from 'graphql';
import { DrizzleDB } from '../../../../Config/db';
import { TransactionService } from '../../Services/TransactionService';
import { PaymentScheduleService } from '../../Services/PaymentScheduleService';
import { ExpenseService } from '../../Services/ExpenseService';
import { Context } from '../../../../GraphQL/Context';

import {
  PosTransaction,
  CreateTransactionInput,
  UpdateTransactionInput,
  TransactionFilterInput,
  PaymentSchedule,
  CreatePaymentScheduleInput,
  UpdatePaymentScheduleInput,
  ServiceExpense,
  CreateServiceExpenseInput,
  UpdateServiceExpenseInput,
  TypeAmountPair
} from '../../Types';

// Helper function to get vendor ID from context
const getVendorId = (context: Context): string => {
  const vendorId = context.vendor?.id;
  if (!vendorId) {
    throw new GraphQLError('Not authenticated', {
      extensions: { code: 'UNAUTHENTICATED' }
    });
  }
  return vendorId;
};

// Initialize services
const initializeServices = (context: Context) => {
  const vendorId = getVendorId(context);
  return {
    transactionService: new TransactionService(context.db, vendorId),
    paymentScheduleService: new PaymentScheduleService(context.db, vendorId),
    expenseService: new ExpenseService(context.db, vendorId)
  };
};

export const posResolvers = {
  Query: {
    // Transaction Queries
    transaction: async (_: any, { id }: { id: string }, context: Context): Promise<PosTransaction | null> => {
      const { transactionService } = initializeServices(context);
      return transactionService.getTransactionById(id);
    },
    
    transactions: async (_: any, { filter }: { filter?: TransactionFilterInput }, context: Context): Promise<PosTransaction[]> => {
      const { transactionService } = initializeServices(context);
      return transactionService.getTransactions(filter);
    },
    
    recentTransactions: async (_: any, { limit }: { limit?: number }, context: Context): Promise<PosTransaction[]> => {
      const { transactionService } = initializeServices(context);
      return transactionService.getRecentTransactions(limit);
    },
    
    totalRevenue: async (_: any, __: any, context: Context): Promise<number> => {
      const { transactionService } = initializeServices(context);
      return transactionService.getTotalRevenue();
    },
    
    transactionCountByType: async (_: any, __: any, context: Context): Promise<TypeAmountPair[]> => {
      const { transactionService } = initializeServices(context);
      return transactionService.getTransactionCountByType();
    },
    
    transactionCount: async (_: any, __: any, context: Context): Promise<number> => {
      const { transactionService } = initializeServices(context);
      return transactionService.getTransactionCount();
    },
    
    // Payment Schedule Queries
    paymentSchedule: async (_: any, { id }: { id: string }, context: Context): Promise<PaymentSchedule | null> => {
      const { paymentScheduleService } = initializeServices(context);
      return paymentScheduleService.getPaymentScheduleById(id);
    },
    
    paymentSchedulesByBooking: async (_: any, { bookingId }: { bookingId: string }, context: Context): Promise<PaymentSchedule[]> => {
      const { paymentScheduleService } = initializeServices(context);
      return paymentScheduleService.getPaymentSchedulesByBooking(bookingId);
    },
    
    allPaymentSchedules: async (_: any, __: any, context: Context): Promise<PaymentSchedule[]> => {
      const { paymentScheduleService } = initializeServices(context);
      return paymentScheduleService.getAllPaymentSchedules();
    },
    
    upcomingPayments: async (_: any, { limit }: { limit?: number }, context: Context): Promise<PaymentSchedule[]> => {
      const { paymentScheduleService } = initializeServices(context);
      return paymentScheduleService.getUpcomingPayments(limit);
    },
    
    pendingPaymentsTotal: async (_: any, __: any, context: Context): Promise<number> => {
      const { paymentScheduleService } = initializeServices(context);
      return paymentScheduleService.getPendingPaymentsTotal();
    },
    
    overduePayments: async (_: any, __: any, context: Context): Promise<PaymentSchedule[]> => {
      const { paymentScheduleService } = initializeServices(context);
      return paymentScheduleService.findOverduePayments();
    },
    
    // Expense Queries
    expense: async (_: any, { id }: { id: string }, context: Context): Promise<ServiceExpense | null> => {
      const { expenseService } = initializeServices(context);
      return expenseService.getExpenseById(id);
    },
    
    expensesByBooking: async (_: any, { bookingId }: { bookingId: string }, context: Context): Promise<ServiceExpense[]> => {
      const { expenseService } = initializeServices(context);
      return expenseService.getExpensesByBooking(bookingId);
    },
    
    allExpenses: async (_: any, { startDate, endDate }: { startDate?: string, endDate?: string }, context: Context): Promise<ServiceExpense[]> => {
      const { expenseService } = initializeServices(context);
      return expenseService.getAllExpenses(startDate, endDate);
    },
    
    totalExpenses: async (_: any, { startDate, endDate }: { startDate?: string, endDate?: string }, context: Context): Promise<number> => {
      const { expenseService } = initializeServices(context);
      return expenseService.getTotalExpenses(startDate, endDate);
    },
    
    expensesByCategory: async (_: any, __: any, context: Context): Promise<{ category: string; amount: number }[]> => {
      const { expenseService } = initializeServices(context);
      return expenseService.getExpensesByCategory();
    },
    
    monthlyExpenses: async (_: any, { year }: { year: number }, context: Context): Promise<{ month: number; amount: number }[]> => {
      const { expenseService } = initializeServices(context);
      return expenseService.getMonthlyExpenses(year);
    }
  },
  
  Mutation: {
    // Transaction Mutations
    createTransaction: async (_: any, { input }: { input: CreateTransactionInput }, context: Context): Promise<PosTransaction> => {
      const { transactionService } = initializeServices(context);
      return transactionService.createTransaction(input);
    },
    
    updateTransaction: async (_: any, { input }: { input: UpdateTransactionInput }, context: Context): Promise<PosTransaction> => {
      const { transactionService } = initializeServices(context);
      return transactionService.updateTransaction(input);
    },
    
    processTransaction: async (_: any, { id }: { id: string }, context: Context): Promise<PosTransaction> => {
      const { transactionService } = initializeServices(context);
      return transactionService.processTransaction(id);
    },
    
    deleteTransaction: async (_: any, { id }: { id: string }, context: Context): Promise<boolean> => {
      const { transactionService } = initializeServices(context);
      return transactionService.deleteTransaction(id);
    },
    
    // Payment Schedule Mutations
    createPaymentSchedule: async (_: any, { input }: { input: CreatePaymentScheduleInput }, context: Context): Promise<PaymentSchedule> => {
      const { paymentScheduleService } = initializeServices(context);
      return paymentScheduleService.createPaymentSchedule(input);
    },
    
    updatePaymentSchedule: async (_: any, { input }: { input: UpdatePaymentScheduleInput }, context: Context): Promise<PaymentSchedule> => {
      const { paymentScheduleService } = initializeServices(context);
      return paymentScheduleService.updatePaymentSchedule(input);
    },
    
    deletePaymentSchedule: async (_: any, { id }: { id: string }, context: Context): Promise<boolean> => {
      const { paymentScheduleService } = initializeServices(context);
      return paymentScheduleService.deletePaymentSchedule(id);
    },
    
    markPaymentAsPaid: async (_: any, { id, transactionId }: { id: string, transactionId?: string }, context: Context): Promise<PaymentSchedule> => {
      const { paymentScheduleService } = initializeServices(context);
      return paymentScheduleService.markPaymentAsPaid(id, transactionId);
    },
    
    sendPaymentReminder: async (_: any, { id }: { id: string }, context: Context): Promise<PaymentSchedule> => {
      const { paymentScheduleService } = initializeServices(context);
      return paymentScheduleService.sendPaymentReminder(id);
    },
    
    // Expense Mutations
    createExpense: async (_: any, { input }: { input: CreateServiceExpenseInput }, context: Context): Promise<ServiceExpense> => {
      const { expenseService } = initializeServices(context);
      return expenseService.createExpense(input);
    },
    
    updateExpense: async (_: any, { input }: { input: UpdateServiceExpenseInput }, context: Context): Promise<ServiceExpense> => {
      const { expenseService } = initializeServices(context);
      return expenseService.updateExpense(input);
    },
    
    deleteExpense: async (_: any, { id }: { id: string }, context: Context): Promise<boolean> => {
      const { expenseService } = initializeServices(context);
      return expenseService.deleteExpense(id);
    }
  }
};