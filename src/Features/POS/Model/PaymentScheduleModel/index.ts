// src/Features/POS/models/PaymentScheduleModel.ts

import { DrizzleDB } from '../../../../Config/db';
import { paymentSchedules, bookings, posTransactions, users } from '../../../../Schema';
import { v4 as uuidv4 } from 'uuid';
import { and, eq, gte, desc, lte, isNull } from 'drizzle-orm';
import { 
  PaymentSchedule, 
  CreatePaymentScheduleInput, 
  UpdatePaymentScheduleInput,
  PaymentScheduleStatus
} from '../../Types';

export class PaymentScheduleModel {
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

  async verifyTransactionOwnership(transactionId: string): Promise<boolean> {
    const transactionCheck = await this.db.select({ id: posTransactions.id })
      .from(posTransactions)
      .where(and(
        eq(posTransactions.id, transactionId),
        eq(posTransactions.vendorId, this.vendorId)
      ))
      .limit(1);

    return transactionCheck.length > 0;
  }

  async create(input: CreatePaymentScheduleInput): Promise<PaymentSchedule> {
    const paymentSchedule = {
      id: uuidv4(),
      bookingId: input.bookingId,
      dueDate: new Date(input.dueDate),
      amount: input.amount,
      description: input.description,
      status: 'Pending' as PaymentScheduleStatus,
      reminderSent: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.db.insert(paymentSchedules).values(paymentSchedule);

    return paymentSchedule as PaymentSchedule;
  }

  async findById(id: string): Promise<{ schedule: PaymentSchedule, vendorId: string } | null> {
    const schedule = await this.db
      .select({
        schedule: paymentSchedules,
        vendorId: bookings.vendorId
      })
      .from(paymentSchedules)
      .innerJoin(bookings, eq(paymentSchedules.bookingId, bookings.id))
      .where(eq(paymentSchedules.id, id))
      .limit(1);

    return schedule.length > 0 ? schedule[0] : null;
  }

  async update(id: string, updateValues: Partial<PaymentSchedule>): Promise<void> {
    await this.db.update(paymentSchedules)
      .set({ ...updateValues, updatedAt: new Date() })
      .where(eq(paymentSchedules.id, id));
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(paymentSchedules)
      .where(eq(paymentSchedules.id, id));
  }

  async getById(id: string): Promise<PaymentSchedule | null> {
    const schedule = await this.db.select()
      .from(paymentSchedules)
      .where(eq(paymentSchedules.id, id))
      .limit(1);

    return schedule.length > 0 ? schedule[0] as unknown as PaymentSchedule : null;
  }

  async findByBooking(bookingId: string): Promise<PaymentSchedule[]> {
    const schedules = await this.db.select()
      .from(paymentSchedules)
      .where(eq(paymentSchedules.bookingId, bookingId))
      .orderBy(paymentSchedules.dueDate);

    return schedules as unknown as PaymentSchedule[];
  }

  async findAll(): Promise<PaymentSchedule[]> {
    const schedules = await this.db
      .select({
        schedule: paymentSchedules
      })
      .from(paymentSchedules)
      .innerJoin(bookings, eq(paymentSchedules.bookingId, bookings.id))
      .where(eq(bookings.vendorId, this.vendorId))
      .orderBy(paymentSchedules.dueDate);

    return schedules.map(item => item.schedule) as unknown as PaymentSchedule[];
  }

  async findUpcoming(limit: number = 5): Promise<PaymentSchedule[]> {
    const today = new Date();
    
    const schedules = await this.db
      .select({
        schedule: paymentSchedules
      })
      .from(paymentSchedules)
      .innerJoin(bookings, eq(paymentSchedules.bookingId, bookings.id))
      .where(and(
        eq(bookings.vendorId, this.vendorId),
        eq(paymentSchedules.status, 'Pending'),
        gte(paymentSchedules.dueDate, today)
      ))
      .orderBy(paymentSchedules.dueDate)
      .limit(limit);

    return schedules.map(item => item.schedule) as unknown as PaymentSchedule[];
  }

  async getPendingTotal(): Promise<number> {
    const result = await this.db
      .select({
        total: paymentSchedules.amount
      })
      .from(paymentSchedules)
      .innerJoin(bookings, eq(paymentSchedules.bookingId, bookings.id))
      .where(and(
        eq(bookings.vendorId, this.vendorId),
        eq(paymentSchedules.status, 'Pending')
      ));

    // Sum the amounts manually since we can't use SQL aggregate functions directly
    return result.reduce((sum, item) => sum + Number(item.total), 0);
  }

  async findOverdue(): Promise<PaymentSchedule[]> {
    const today = new Date();
    
    const schedules = await this.db
      .select({
        schedule: paymentSchedules
      })
      .from(paymentSchedules)
      .innerJoin(bookings, eq(paymentSchedules.bookingId, bookings.id))
      .where(and(
        eq(bookings.vendorId, this.vendorId),
        eq(paymentSchedules.status, 'Pending'),
        lte(paymentSchedules.dueDate, today)
      ))
      .orderBy(paymentSchedules.dueDate);

    return schedules.map(item => item.schedule) as unknown as PaymentSchedule[];
  }

  async getScheduleWithUserDetails(id: string): Promise<{
    schedule: PaymentSchedule,
    userEmail: string,
    userName: string,
    vendorId: string
  } | null> {
    const details = await this.db
      .select({
        schedule: paymentSchedules,
        booking: bookings,
        userEmail: users.email,
        userName: users.name,
        vendorId: bookings.vendorId
      })
      .from(paymentSchedules)
      .innerJoin(bookings, eq(paymentSchedules.bookingId, bookings.id))
      .innerJoin(users, eq(bookings.userId, users.id))
      .where(eq(paymentSchedules.id, id))
      .limit(1);

    if (details.length === 0) {
      return null;
    }

    const { schedule, userEmail, userName, vendorId } = details[0];
    return { schedule, userEmail, userName, vendorId };
  }
}