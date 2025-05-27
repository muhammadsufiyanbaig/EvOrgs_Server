// src/Features/POS/services/TransactionService.ts

import { DrizzleDB } from '../../../../Config/db';
import { v4 as uuidv4 } from 'uuid';
import { 
  PosTransaction, 
  CreateTransactionInput, 
  UpdateTransactionInput,
  TransactionStatus,
  TransactionFilterInput,
  TypeAmountPair
} from '../../Types';
import { generateTransactionNumber } from '../../utils/generators';
import { PosTransactionModel } from '../../Model/Transaction';

export class TransactionService {
  private transactionModel: PosTransactionModel;
  private vendorId: string;

  constructor(db: DrizzleDB, vendorId: string) {
    this.transactionModel = new PosTransactionModel(db);
    this.vendorId = vendorId;
  }

  async createTransaction(input: CreateTransactionInput): Promise<PosTransaction> {
    // Verify booking belongs to vendor
    const bookingExists = await this.transactionModel.findBookingById(input.bookingId, this.vendorId);

    if (!bookingExists) {
      throw new Error('Booking not found or does not belong to vendor');
    }

    const userId = await this.transactionModel.getBookingUserId(input.bookingId);

    if (!userId) {
      throw new Error('Booking not found');
    }

    // Generate transaction number
    const transactionNumber = generateTransactionNumber();

    // Create new transaction
    const transaction = {
      id: uuidv4(),
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
      status: 'Pending' as TransactionStatus,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return await this.transactionModel.insertTransaction(transaction);
  }

  async updateTransaction(input: UpdateTransactionInput): Promise<PosTransaction> {
    // First get the transaction and check ownership
    const existingTransaction = await this.transactionModel.findTransactionById(input.id, this.vendorId);

    if (!existingTransaction) {
      throw new Error('Transaction not found or does not belong to vendor');
    }

    // Prepare update values
    const updateValues: Partial<PosTransaction> = {
      updatedAt: new Date(),
    };

    if (input.amount !== undefined) updateValues.amount = input.amount;
    if (input.transactionType !== undefined) updateValues.transactionType = input.transactionType;
    if (input.paymentMethod !== undefined) updateValues.paymentMethod = input.paymentMethod;
    if (input.description !== undefined) updateValues.description = input.description;
    if (input.receiptNumber !== undefined) updateValues.receiptNumber = input.receiptNumber;
    if (input.paymentGatewayReference !== undefined) updateValues.paymentGatewayReference = input.paymentGatewayReference;
    if (input.status !== undefined) updateValues.status = input.status;

    // Update transaction
    return await this.transactionModel.updateTransaction(input.id, updateValues);
  }

  async processTransaction(id: string): Promise<PosTransaction> {
    // Get transaction and check ownership
    const existingTransaction = await this.transactionModel.findTransactionById(id, this.vendorId);

    if (!existingTransaction) {
      throw new Error('Transaction not found or does not belong to vendor');
    }

    // Process transaction - in a real system, this would integrate with a payment gateway
    const updateValues = {
      status: 'Completed' as TransactionStatus,
      processedAt: new Date(),
      updatedAt: new Date(),
    };

    // Update transaction
    return await this.transactionModel.updateTransaction(id, updateValues);
  }

  async deleteTransaction(id: string): Promise<boolean> {
    // Check if transaction exists and belongs to vendor
    const existingTransaction = await this.transactionModel.findTransactionById(id, this.vendorId);

    if (!existingTransaction) {
      throw new Error('Transaction not found or does not belong to vendor');
    }

    // Delete transaction
    return await this.transactionModel.deleteTransaction(id);
  }

  async getTransactionById(id: string): Promise<PosTransaction | null> {
    return await this.transactionModel.findTransactionById(id, this.vendorId);
  }

  async getTransactions(filter?: TransactionFilterInput): Promise<PosTransaction[]> {
    return await this.transactionModel.findTransactions(this.vendorId, filter);
  }

  async getRecentTransactions(limit: number = 5): Promise<PosTransaction[]> {
    return await this.transactionModel.findRecentTransactions(this.vendorId, limit);
  }

  async getTotalRevenue(): Promise<number> {
    return await this.transactionModel.calculateTotalRevenue(this.vendorId);
  }

  async getTransactionCountByType(): Promise<TypeAmountPair[]> {
    return await this.transactionModel.getTransactionCountByType(this.vendorId);
  }

  async getTransactionCount(): Promise<number> {
    return await this.transactionModel.getTransactionCount(this.vendorId);
  }
}