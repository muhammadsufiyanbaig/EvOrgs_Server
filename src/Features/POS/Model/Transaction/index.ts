// src/Features/POS/models/PosTransactionModel.ts

import { DrizzleDB } from '../../../../Config/db';
import { posTransactions, bookings, users } from '../../../../Schema';
import { and, eq, gte, lte, desc, sql } from 'drizzle-orm';
import { 
  PosTransaction, 
  TransactionStatus,
  TransactionFilterInput,
  TypeAmountPair
} from '../../Types';

export class PosTransactionModel {
  private db: DrizzleDB;

  constructor(db: DrizzleDB) {
    this.db = db;
  }

  async findTransactionById(id: string, vendorId: string): Promise<PosTransaction | null> {
    const transaction = await this.db.select()
      .from(posTransactions)
      .where(and(
        eq(posTransactions.id, id),
        eq(posTransactions.vendorId, vendorId)
      ))
      .limit(1);

    return transaction.length > 0 ? transaction[0] as unknown as PosTransaction : null;
  }

  async findBookingById(bookingId: string, vendorId: string) {
    const bookingCheck = await this.db.select({ id: bookings.id })
      .from(bookings)
      .where(and(
        eq(bookings.id, bookingId),
        eq(bookings.vendorId, vendorId)
      ))
      .limit(1);

    return bookingCheck.length > 0;
  }

  async getBookingUserId(bookingId: string): Promise<string | null> {
    const booking = await this.db.select({
      userId: bookings.userId
    })
    .from(bookings)
    .where(eq(bookings.id, bookingId))
    .limit(1);

    return booking.length > 0 ? booking[0].userId : null;
  }

  async insertTransaction(transaction: Omit<PosTransaction, 'processedAt'>): Promise<PosTransaction> {
    const dbTransaction = {
      ...transaction,
      amount: transaction.amount.toString()
    };
    await this.db.insert(posTransactions).values(dbTransaction);
    return transaction as PosTransaction;
  }

 async updateTransaction(id: string, values: Partial<PosTransaction>): Promise<PosTransaction> {
  const filteredValues = Object.fromEntries(
    Object.entries(values).filter(([_, v]) => v !== undefined)
  );

  await this.db.update(posTransactions)
    .set(filteredValues)
    .where(eq(posTransactions.id, id));

  const updatedTransaction = await this.db.select()
    .from(posTransactions)
    .where(eq(posTransactions.id, id))
    .limit(1);

  return updatedTransaction[0] as unknown as PosTransaction;
}


  async deleteTransaction(id: string): Promise<boolean> {
    await this.db.delete(posTransactions)
      .where(eq(posTransactions.id, id));

    return true;
  }

  async findTransactions(vendorId: string, filter?: TransactionFilterInput): Promise<PosTransaction[]> {
    let conditions = [eq(posTransactions.vendorId, vendorId)];

    if (filter) {
      if (filter.startDate) {
        conditions.push(gte(posTransactions.createdAt, new Date(filter.startDate)));
      }

      if (filter.endDate) {
        conditions.push(lte(posTransactions.createdAt, new Date(filter.endDate)));
      }

      if (filter.transactionType) {
        conditions.push(eq(posTransactions.transactionType, filter.transactionType));
      }

      if (filter.status) {
        conditions.push(eq(posTransactions.status, filter.status));
      }

      if (filter.bookingId) {
        conditions.push(eq(posTransactions.bookingId, filter.bookingId));
      }
    }

    const transactions = await this.db.select()
      .from(posTransactions)
      .where(and(...conditions))
      .orderBy(desc(posTransactions.createdAt));

    return transactions as unknown as PosTransaction[];
  }

  async findRecentTransactions(vendorId: string, limit: number): Promise<PosTransaction[]> {
    const transactions = await this.db.select()
      .from(posTransactions)
      .where(eq(posTransactions.vendorId, vendorId))
      .orderBy(desc(posTransactions.createdAt))
      .limit(limit);

    return transactions as unknown as PosTransaction[];
  }

  async calculateTotalRevenue(vendorId: string): Promise<number> {
    const result = await this.db
      .select({
        total: sql<string>`SUM(CASE WHEN transaction_type IN ('Advance', 'Balance', 'Full Payment', 'Additional Service') THEN amount ELSE 0 END) - SUM(CASE WHEN transaction_type = 'Refund' THEN amount ELSE 0 END)`
      })
      .from(posTransactions)
      .where(and(
        eq(posTransactions.vendorId, vendorId),
        eq(posTransactions.status, 'Completed')
      ));

    return result[0]?.total ? parseFloat(result[0].total) : 0;
  }

  async getTransactionCountByType(vendorId: string): Promise<TypeAmountPair[]> {
    const result = await this.db
      .select({
        type: posTransactions.transactionType,
        amount: sql<string>`SUM(amount)`
      })
      .from(posTransactions)
      .where(and(
        eq(posTransactions.vendorId, vendorId),
        eq(posTransactions.status, 'Completed')
      ))
      .groupBy(posTransactions.transactionType);

    return result.map(item => ({
      type: item.type,
      amount: parseFloat(item.amount || '0')
    }));
  }

  async getTransactionCount(vendorId: string): Promise<number> {
    const result = await this.db
      .select({
        count: sql<number>`COUNT(*)`
      })
      .from(posTransactions)
      .where(eq(posTransactions.vendorId, vendorId));

    return result[0]?.count || 0;
  }
}