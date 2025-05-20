export type TransactionType = 'Advance' | 'Balance' | 'Full Payment' | 'Refund' | 'Additional Service';
export type PaymentMethod = 'Cash' | 'Credit Card' | 'Debit Card' | 'Bank Transfer' | 'Mobile Payment' | 'Other';
export type TransactionStatus = 'Completed' | 'Failed' | 'Pending' | 'Disputed';
export type PaymentScheduleStatus = 'Pending' | 'Paid' | 'Overdue' | 'Canceled';

// POS Transaction
export interface PosTransaction {
  id: string;
  vendorId: string;
  bookingId: string;
  userId: string;
  transactionNumber: string;
  amount: number;
  transactionType: TransactionType;
  paymentMethod?: PaymentMethod;
  description?: string;
  receiptNumber?: string;
  paymentGatewayReference?: string;
  status: TransactionStatus;
  createdAt: Date;
  processedAt?: Date;
  updatedAt: Date;
}

// Payment Schedule
export interface PaymentSchedule {
  id: string;
  bookingId: string;
  dueDate: Date;
  amount: number;
  description?: string;
  status: PaymentScheduleStatus;
  reminderSent: boolean;
  lastReminderDate?: Date;
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Service Expense
export interface ServiceExpense {
  id: string;
  bookingId: string;
  vendorId: string;
  description: string;
  amount: number;
  category?: string;
  receiptUrl?: string;
  expenseDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Input Types
export interface CreateTransactionInput {
  bookingId: string;
  amount: number;
  transactionType: TransactionType;
  paymentMethod?: PaymentMethod;
  description?: string;
  receiptNumber?: string;
  paymentGatewayReference?: string;
}

export interface UpdateTransactionInput {
  id: string;
  amount?: number;
  transactionType?: TransactionType;
  paymentMethod?: PaymentMethod;
  description?: string;
  receiptNumber?: string;
  paymentGatewayReference?: string;
  status?: TransactionStatus;
}

export interface CreatePaymentScheduleInput {
  bookingId: string;
  dueDate: string; // ISO date string
  amount: number;
  description?: string;
}

export interface UpdatePaymentScheduleInput {
  id: string;
  dueDate?: string; // ISO date string
  amount?: number;
  description?: string;
  status?: PaymentScheduleStatus;
  reminderSent?: boolean;
}

export interface CreateServiceExpenseInput {
  bookingId: string;
  description: string;
  amount: number;
  category?: string;
  receiptUrl?: string;
  expenseDate?: string; // ISO date string
}

export interface UpdateServiceExpenseInput {
  id: string;
  description?: string;
  amount?: number;
  category?: string;
  receiptUrl?: string;
  expenseDate?: string; // ISO date string
}

export interface TransactionFilterInput {
  startDate?: string;
  endDate?: string;
  transactionType?: TransactionType;
  status?: TransactionStatus;
  bookingId?: string;
}

export interface ReportPeriodInput {
  startDate: string;
  endDate: string;
  groupBy?: 'daily' | 'weekly' | 'monthly';
}

export interface FinancialSummary {
  totalTransactions: number;
  totalRevenue: number;
  pendingPayments: number;
  totalExpenses: number;
  netProfit: number;
  transactionsByType: TypeAmountPair[];
  recentTransactions: PosTransaction[];
  upcomingPayments: PaymentSchedule[];
}

export interface TypeAmountPair {
  type: string;
  amount: number;
}

export interface RevenueReportData {
  period: string;
  revenue: number;
  expenses: number;
  profit: number;
  transactionCount: number;
}

export interface RevenueReport {
  total: number;
  data: RevenueReportData[];
}