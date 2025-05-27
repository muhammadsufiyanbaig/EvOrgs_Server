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
    // Create a date object for database operations
    const now = new Date();
    const expenseDate = input.expenseDate ? new Date(input.expenseDate) : now;
    
    // Create object for database insertion with proper types
    const dbExpense = {
      id: uuidv4(),
      bookingId: input.bookingId,
      vendorId: this.vendorId,
      description: input.description,
      amount: input.amount.toString(),
      category: input.category,
      receiptUrl: input.receiptUrl,
      expenseDate: expenseDate.toISOString(),
    };

    // Insert into database
    await this.db.insert(serviceExpenses).values(dbExpense);
    
    // Return the complete expense object with correct types for the application
    return {
      ...dbExpense,
      amount: input.amount,
      expenseDate: expenseDate,
      createdAt: now,
      updatedAt: now,
    } as ServiceExpense;
  }

  async findById(id: string): Promise<ServiceExpense | null> {
    const expense = await this.db.select()
      .from(serviceExpenses)
      .where(and(
        eq(serviceExpenses.id, id),
        eq(serviceExpenses.vendorId, this.vendorId)
      ))
      .limit(1);

    if (expense.length === 0) return null;
    
    // Convert DB result to ServiceExpense type
    const result = expense[0];
    return {
      ...result,
      amount: parseFloat(result.amount as string),
      expenseDate: new Date(result.expenseDate as string),
      createdAt: new Date(result.createdAt as unknown as string),
      updatedAt: new Date(result.updatedAt as unknown as string),
    } as ServiceExpense;
  }

  async update(id: string, updateValues: Partial<UpdateServiceExpenseInput>): Promise<void> {
    const dbUpdateValues: Record<string, any> = { 
      updatedAt: new Date().toISOString() 
    };
    
    // Convert all update values to string format for DB
    if (updateValues.description !== undefined) dbUpdateValues.description = updateValues.description;
    if (updateValues.amount !== undefined) dbUpdateValues.amount = updateValues.amount.toString();
    if (updateValues.category !== undefined) dbUpdateValues.category = updateValues.category;
    if (updateValues.receiptUrl !== undefined) dbUpdateValues.receiptUrl = updateValues.receiptUrl;
    if (updateValues.expenseDate !== undefined) {
      dbUpdateValues.expenseDate = updateValues.expenseDate;
    }

    await this.db.update(serviceExpenses)
      .set(dbUpdateValues)
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

    // Convert DB results to ServiceExpense type
    return expenses.map(e => ({
      ...e,
      amount: parseFloat(e.amount as string),
      expenseDate: new Date(e.expenseDate as string),
      createdAt: new Date(e.createdAt as unknown as string),
      updatedAt: new Date(e.updatedAt as unknown as string),
    })) as ServiceExpense[];
  }

  async findAll(startDate?: string, endDate?: string): Promise<ServiceExpense[]> {
    let conditions = [eq(serviceExpenses.vendorId, this.vendorId)];

    if (startDate) {
      conditions.push(gte(serviceExpenses.expenseDate, startDate));
    }

    if (endDate) {
      conditions.push(lte(serviceExpenses.expenseDate, endDate));
    }

    const expenses = await this.db.select()
      .from(serviceExpenses)
      .where(and(...conditions))
      .orderBy(desc(serviceExpenses.expenseDate));

    // Convert DB results to ServiceExpense type
    return expenses.map(e => ({
      ...e,
      amount: parseFloat(e.amount as string),
      expenseDate: new Date(e.expenseDate as string),
      createdAt: new Date(e.createdAt as unknown as string),
      updatedAt: new Date(e.updatedAt as unknown as string),
    })) as ServiceExpense[];
  }

  async getTotal(startDate?: string, endDate?: string): Promise<number> {
    let conditions = [eq(serviceExpenses.vendorId, this.vendorId)];

    if (startDate) {
      conditions.push(gte(serviceExpenses.expenseDate, startDate));
    }

    if (endDate) {
      conditions.push(lte(serviceExpenses.expenseDate, endDate));
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
    // Create ISO string for dates
    const startDate = new Date(year, 0, 1).toISOString(); // January 1st of the given year
    const endDate = new Date(year, 11, 31).toISOString(); // December 31st of the given year

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