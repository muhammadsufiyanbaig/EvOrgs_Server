// src/Features/POS/models/ExpenseModel.ts

import { DrizzleDB } from '../../../../Config/db';
import { serviceExpenses, bookings } from '../../../../Schema';
import { v4 as uuidv4 } from 'uuid';
import { and, eq, gte, lte, desc, sql } from 'drizzle-orm';
import { 
  ServiceExpense, 
  CreateServiceExpenseInput, 
  UpdateServiceExpenseInput 
} from '../../Types';

export class ExpenseModel {
  private db: DrizzleDB;
  private vendorId: string;

  constructor(db: DrizzleDB, vendorId: string) {
    this.db = db;
    this.vendorId = vendorId;
  }

  async verifyBookingOwnership(bookingId: string): Promise<boolean> {
    const bookingCheck = await this.db.select({ id: bookings.id })
      .from(bookings)
      .where(and(
        eq(bookings.id, bookingId),
        eq(bookings.vendorId, this.vendorId)
      ))
      .limit(1);

    return bookingCheck.length > 0;
  }

  async create(input: CreateServiceExpenseInput): Promise<ServiceExpense> {
    const expense = {
      id: uuidv4(),
      bookingId: input.bookingId,
      vendorId: this.vendorId,
      description: input.description,
      amount: input.amount,
      category: input.category,
      receiptUrl: input.receiptUrl,
      expenseDate: input.expenseDate ? new Date(input.expenseDate) : new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.db.insert(serviceExpenses).values(expense);

    return expense as ServiceExpense;
  }

  async findById(id: string): Promise<ServiceExpense | null> {
    const expense = await this.db.select()
      .from(serviceExpenses)
      .where(and(
        eq(serviceExpenses.id, id),
        eq(serviceExpenses.vendorId, this.vendorId)
      ))
      .limit(1);

    return expense.length > 0 ? expense[0] as unknown as ServiceExpense : null;
  }

  async update(id: string, updateValues: Partial<ServiceExpense>): Promise<void> {
    await this.db.update(serviceExpenses)
      .set({ ...updateValues, updatedAt: new Date() })
      .where(eq(serviceExpenses.id, id));
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(serviceExpenses)
      .where(eq(serviceExpenses.id, id));
  }

  async findByBooking(bookingId: string): Promise<ServiceExpense[]> {
    const expenses = await this.db.select()
      .from(serviceExpenses)
      .where(eq(serviceExpenses.bookingId, bookingId))
      .orderBy(desc(serviceExpenses.expenseDate));

    return expenses as unknown as ServiceExpense[];
  }

  async findAll(startDate?: string, endDate?: string): Promise<ServiceExpense[]> {
    let conditions = [eq(serviceExpenses.vendorId, this.vendorId)];

    if (startDate) {
      conditions.push(gte(serviceExpenses.expenseDate, new Date(startDate)));
    }

    if (endDate) {
      conditions.push(lte(serviceExpenses.expenseDate, new Date(endDate)));
    }

    const expenses = await this.db.select()
      .from(serviceExpenses)
      .where(and(...conditions))
      .orderBy(desc(serviceExpenses.expenseDate));

    return expenses as unknown as ServiceExpense[];
  }

  async getTotal(startDate?: string, endDate?: string): Promise<number> {
    let conditions = [eq(serviceExpenses.vendorId, this.vendorId)];

    if (startDate) {
      conditions.push(gte(serviceExpenses.expenseDate, new Date(startDate)));
    }

    if (endDate) {
      conditions.push(lte(serviceExpenses.expenseDate, new Date(endDate)));
    }

    const result = await this.db
      .select({
        total: sql<string>`SUM(amount)`
      })
      .from(serviceExpenses)
      .where(and(...conditions));

    return result[0]?.total ? parseFloat(result[0].total) : 0;
  }

  async getByCategory(): Promise<{ category: string; amount: number }[]> {
    const result = await this.db
      .select({
        category: serviceExpenses.category,
        amount: sql<string>`SUM(amount)`
      })
      .from(serviceExpenses)
      .where(eq(serviceExpenses.vendorId, this.vendorId))
      .groupBy(serviceExpenses.category);

    return result.map(item => ({
      category: item.category || 'Uncategorized',
      amount: parseFloat(item.amount || '0')
    }));
  }

  async getMonthlyExpenses(year: number): Promise<{ month: number; amount: number }[]> {
    const startDate = new Date(year, 0, 1); // January 1st of the given year
    const endDate = new Date(year, 11, 31); // December 31st of the given year

    const result = await this.db
      .select({
        month: sql<number>`EXTRACT(MONTH FROM expense_date)`,
        amount: sql<string>`SUM(amount)`
      })
      .from(serviceExpenses)
      .where(and(
        eq(serviceExpenses.vendorId, this.vendorId),
        gte(serviceExpenses.expenseDate, startDate),
        lte(serviceExpenses.expenseDate, endDate)
      ))
      .groupBy(sql`EXTRACT(MONTH FROM expense_date)`);

    return result.map(item => ({
      month: item.month,
      amount: parseFloat(item.amount || '0')
    }));
  }
}