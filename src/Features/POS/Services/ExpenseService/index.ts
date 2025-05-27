// src/Features/POS/services/ExpenseService.ts

import { DrizzleDB } from '../../../../Config/db';
import { ExpenseModel } from '../../Model/ExpenseModel';
import {
  ServiceExpense,
  CreateServiceExpenseInput,
  UpdateServiceExpenseInput
} from '../../Types';

export class ExpenseService {
  private expenseModel: ExpenseModel;

  constructor(db: DrizzleDB, vendorId: string) {
    this.expenseModel = new ExpenseModel(db, vendorId);
  }

  async createExpense(input: CreateServiceExpenseInput): Promise<ServiceExpense> {
    // Verify booking belongs to vendor
    const bookingExists = await this.expenseModel.verifyBookingOwnership(input.bookingId);
    if (!bookingExists) {
      throw new Error('Booking not found or does not belong to vendor');
    }

    // Create new expense
    return this.expenseModel.create(input);
  }

  async updateExpense(input: UpdateServiceExpenseInput): Promise<ServiceExpense> {
    // First get the expense and check ownership
    const existingExpense = await this.expenseModel.findById(input.id);
    if (!existingExpense) {
      throw new Error('Expense not found or does not belong to vendor');
    }

    // Prepare update values matching the expected UpdateServiceExpenseInput type
    const updateValues: Partial<UpdateServiceExpenseInput> = {};

    if (input.description !== undefined) updateValues.description = input.description;
    if (input.amount !== undefined) updateValues.amount = input.amount;
    if (input.category !== undefined) updateValues.category = input.category;
    if (input.receiptUrl !== undefined) updateValues.receiptUrl = input.receiptUrl;
    if (input.expenseDate !== undefined) updateValues.expenseDate = input.expenseDate;

    // Update expense
    await this.expenseModel.update(input.id, updateValues);

    // Return updated expense
    const updatedExpense = await this.expenseModel.findById(input.id);
    return updatedExpense as ServiceExpense;
  }

  async deleteExpense(id: string): Promise<boolean> {
    // Check if expense exists and belongs to vendor
    const existingExpense = await this.expenseModel.findById(id);
    if (!existingExpense) {
      throw new Error('Expense not found or does not belong to vendor');
    }

    // Delete expense
    await this.expenseModel.delete(id);
    return true;
  }

  async getExpenseById(id: string): Promise<ServiceExpense | null> {
    return this.expenseModel.findById(id);
  }

  async getExpensesByBooking(bookingId: string): Promise<ServiceExpense[]> {
    // Verify booking belongs to vendor
    const bookingExists = await this.expenseModel.verifyBookingOwnership(bookingId);
    if (!bookingExists) {
      throw new Error('Booking not found or does not belong to vendor');
    }

    return this.expenseModel.findByBooking(bookingId);
  }

  async getAllExpenses(startDate?: string, endDate?: string): Promise<ServiceExpense[]> {
    return this.expenseModel.findAll(startDate, endDate);
  }

  async getTotalExpenses(startDate?: string, endDate?: string): Promise<number> {
    return this.expenseModel.getTotal(startDate, endDate);
  }

  async getExpensesByCategory(): Promise<{ category: string; amount: number }[]> {
    return this.expenseModel.getByCategory();
  }

  async getMonthlyExpenses(year: number): Promise<{ month: number; amount: number }[]> {
    return this.expenseModel.getMonthlyExpenses(year);
  }
}