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

  # Helper type for count by type responses
  type TypeAmountPair {
    type: String!
    amount: Float!
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

  input TransactionFilterInput {
    startDate: String
    endDate: String
    transactionType: TransactionType
    status: TransactionStatus
    bookingId: ID
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

  # Extend existing types
  extend type Query {
    # Transaction Queries
    transaction(id: ID!): PosTransaction
    transactions(filter: TransactionFilterInput): [PosTransaction!]!
    recentTransactions(limit: Int): [PosTransaction!]!
    totalRevenue: Float!
    transactionCountByType: [TypeAmountPair!]!
    transactionCount: Int!
    
    # Payment Schedule Queries
    paymentSchedule(id: ID!): PaymentSchedule
    paymentSchedulesByBooking(bookingId: ID!): [PaymentSchedule!]!
    allPaymentSchedules: [PaymentSchedule!]!
    upcomingPayments(limit: Int): [PaymentSchedule!]!
    pendingPaymentsTotal: Float!
    overduePayments: [PaymentSchedule!]!
    
    # Expense Queries
    expense(id: ID!): ServiceExpense
    expensesByBooking(bookingId: ID!): [ServiceExpense!]!
    allExpenses(startDate: String, endDate: String): [ServiceExpense!]!
    totalExpenses(startDate: String, endDate: String): Float!
    expensesByCategory: [TypeAmountPair!]!
    monthlyExpenses(year: Int!): [TypeAmountPair!]!
  }

  extend type Mutation {
    # Transaction Mutations
    createTransaction(input: CreateTransactionInput!): PosTransaction!
    updateTransaction(input: UpdateTransactionInput!): PosTransaction!
    processTransaction(id: ID!): PosTransaction!
    deleteTransaction(id: ID!): Boolean!
    
    # Payment Schedule Mutations
    createPaymentSchedule(input: CreatePaymentScheduleInput!): PaymentSchedule!
    updatePaymentSchedule(input: UpdatePaymentScheduleInput!): PaymentSchedule!
    deletePaymentSchedule(id: ID!): Boolean!
    markPaymentAsPaid(id: ID!, transactionId: ID): PaymentSchedule!
    sendPaymentReminder(id: ID!): PaymentSchedule!
    
    # Expense Mutations
    createExpense(input: CreateServiceExpenseInput!): ServiceExpense!
    updateExpense(input: UpdateServiceExpenseInput!): ServiceExpense!
    deleteExpense(id: ID!): Boolean!
  }
`;