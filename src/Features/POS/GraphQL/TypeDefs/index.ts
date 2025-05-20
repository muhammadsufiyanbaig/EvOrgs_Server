import { gql } from 'apollo-server-express';

export const posTypeDefs = gql`
  # POS Transaction Types
  enum TransactionType {
    Advance
    Balance
    FullPayment
    Refund
    AdditionalService
  }

  enum PaymentMethod {
    Cash
    CreditCard
    DebitCard
    BankTransfer
    MobilePayment
    Other
  }

  enum TransactionStatus {
    Completed
    Failed
    Pending
    Disputed
  }

  # Payment Schedule Types
  enum PaymentScheduleStatus {
    Pending
    Paid
    Overdue
    Canceled
  }

  # POS Transaction
  type PosTransaction {
    id: ID!
    vendorId: ID!
    bookingId: ID!
    userId: ID!
    transactionNumber: String!
    amount: Float!
    transactionType: TransactionType!
    paymentMethod: PaymentMethod
    description: String
    receiptNumber: String
    paymentGatewayReference: String
    status: TransactionStatus!
    createdAt: String!
    processedAt: String
    updatedAt: String!
    
    # Related data
    vendor: Vendor
    booking: Booking
    user: User
  }

  # Payment Schedule
  type PaymentSchedule {
    id: ID!
    bookingId: ID!
    dueDate: String!
    amount: Float!
    description: String
    status: PaymentScheduleStatus!
    reminderSent: Boolean!
    lastReminderDate: String
    transactionId: ID
    createdAt: String!
    updatedAt: String!
    
    # Related data
    booking: Booking
    transaction: PosTransaction
  }

  # Service Expense
  type ServiceExpense {
    id: ID!
    bookingId: ID!
    vendorId: ID!
    description: String!
    amount: Float!
    category: String
    receiptUrl: String
    expenseDate: String!
    createdAt: String!
    updatedAt: String!
    
    # Related data
    booking: Booking
    vendor: Vendor
  }

  # Input Types
  input CreateTransactionInput {
    bookingId: ID!
    amount: Float!
    transactionType: TransactionType!
    paymentMethod: PaymentMethod
    description: String
    receiptNumber: String
    paymentGatewayReference: String
  }

  input UpdateTransactionInput {
    id: ID!
    amount: Float
    transactionType: TransactionType
    paymentMethod: PaymentMethod
    description: String
    receiptNumber: String
    paymentGatewayReference: String
    status: TransactionStatus
  }

  input CreatePaymentScheduleInput {
    bookingId: ID!
    dueDate: String!
    amount: Float!
    description: String
  }

  input UpdatePaymentScheduleInput {
    id: ID!
    dueDate: String
    amount: Float
    description: String
    status: PaymentScheduleStatus
    reminderSent: Boolean
  }

  input CreateServiceExpenseInput {
    bookingId: ID!
    description: String!
    amount: Float!
    category: String
    receiptUrl: String
    expenseDate: String
  }

  input UpdateServiceExpenseInput {
    id: ID!
    description: String
    amount: Float
    category: String
    receiptUrl: String
    expenseDate: String
  }

  # Dashboard summary response
  type FinancialSummary {
    totalTransactions: Int!
    totalRevenue: Float!
    pendingPayments: Float!
    totalExpenses: Float!
    netProfit: Float!
    transactionsByType: [TypeAmountPair!]!
    recentTransactions: [PosTransaction!]!
    upcomingPayments: [PaymentSchedule!]!
  }

  type TypeAmountPair {
    type: String!
    amount: Float!
  }

  # Filter input for transactions
  input TransactionFilterInput {
    startDate: String
    endDate: String
    transactionType: TransactionType
    status: TransactionStatus
    bookingId: ID
  }

  # Report input
  input ReportPeriodInput {
    startDate: String!
    endDate: String!
    groupBy: String # daily, weekly, monthly
  }

  # Report response
  type RevenueReportData {
    period: String!
    revenue: Float!
    expenses: Float!
    profit: Float!
    transactionCount: Int!
  }

  type RevenueReport {
    total: Float!
    data: [RevenueReportData!]!
  }

  # Extend existing types
  extend type Query {
    # Transactions
    posTransactions(filter: TransactionFilterInput): [PosTransaction!]!
    posTransaction(id: ID!): PosTransaction
    
    # Payment Schedules
    paymentSchedules(bookingId: ID): [PaymentSchedule!]!
    paymentSchedule(id: ID!): PaymentSchedule
    
    # Service Expenses
    serviceExpenses(bookingId: ID): [ServiceExpense!]!
    serviceExpense(id: ID!): ServiceExpense
    
    # Dashboard and reports
    vendorFinancialSummary: FinancialSummary!
    vendorRevenueReport(input: ReportPeriodInput!): RevenueReport!
  }

  extend type Mutation {
    # Transaction mutations
    createPosTransaction(input: CreateTransactionInput!): PosTransaction!
    updatePosTransaction(input: UpdateTransactionInput!): PosTransaction!
    deletePosTransaction(id: ID!): Boolean!
    processPosTransaction(id: ID!): PosTransaction!
    
    # Payment schedule mutations
    createPaymentSchedule(input: CreatePaymentScheduleInput!): PaymentSchedule!
    updatePaymentSchedule(input: UpdatePaymentScheduleInput!): PaymentSchedule!
    deletePaymentSchedule(id: ID!): Boolean!
    markPaymentAsPaid(id: ID!, transactionId: ID): PaymentSchedule!
    sendPaymentReminder(id: ID!): PaymentSchedule!
    
    # Service expense mutations
    createServiceExpense(input: CreateServiceExpenseInput!): ServiceExpense!
    updateServiceExpense(input: UpdateServiceExpenseInput!): ServiceExpense!
    deleteServiceExpense(id: ID!): Boolean!
  }
`;