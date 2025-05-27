import { DrizzleDB } from '../../../../Config/db';
import { paymentSchedules, bookings, posTransactions, users } from '../../../../Schema';
import { v4 as uuidv4 } from 'uuid';
import { and, eq, gte, desc, lte, SQL } from 'drizzle-orm';
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
    const paymentScheduleData = {
      id: uuidv4(),
      bookingId: input.bookingId,
      dueDate: new Date(input.dueDate).toISOString(),
      amount: String(input.amount),
      description: input.description || null,
      status: 'Pending' as PaymentScheduleStatus,
      reminderSent: false,
      lastReminderDate: null,
      transactionId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.db.insert(paymentSchedules).values(paymentScheduleData);

    // Convert back to PaymentSchedule type for return
    return {
      ...paymentScheduleData,
      dueDate: new Date(paymentScheduleData.dueDate),
      amount: Number(paymentScheduleData.amount),
    } as unknown as PaymentSchedule;
  }

  async findById(id: string): Promise<{ schedule: PaymentSchedule, vendorId: string } | null> {
    const result = await this.db
      .select({
        schedule: paymentSchedules,
        vendorId: bookings.vendorId
      })
      .from(paymentSchedules)
      .innerJoin(bookings, eq(paymentSchedules.bookingId, bookings.id))
      .where(eq(paymentSchedules.id, id))
      .limit(1);

    if (result.length === 0) return null;

    const { schedule, vendorId } = result[0];
    return { 
      schedule: {
        ...schedule,
        dueDate: new Date(schedule.dueDate),
        amount: Number(schedule.amount)
      } as unknown as PaymentSchedule, 
      vendorId 
    };
  }

   async update(id: string, updateValues: Partial<UpdatePaymentScheduleInput>): Promise<void> {
    // Convert values for database compatibility
    const dbUpdateValues: Record<string, any> = { 
      updatedAt: new Date() 
    };
    
    // Convert each property with proper type handling
    if (updateValues.id !== undefined) dbUpdateValues.id = updateValues.id;
    if (updateValues.dueDate !== undefined) dbUpdateValues.dueDate = new Date(updateValues.dueDate).toISOString();
    if (updateValues.amount !== undefined) dbUpdateValues.amount = String(updateValues.amount);
    if (updateValues.description !== undefined) dbUpdateValues.description = updateValues.description;
    if (updateValues.status !== undefined) dbUpdateValues.status = updateValues.status;
    if (updateValues.reminderSent !== undefined) dbUpdateValues.reminderSent = updateValues.reminderSent;
    
    await this.db.update(paymentSchedules)
      .set(dbUpdateValues)
      .where(eq(paymentSchedules.id, id));
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(paymentSchedules).where(eq(paymentSchedules.id, id));
  }

  async getById(id: string): Promise<PaymentSchedule | null> {
    const result = await this.db.select()
      .from(paymentSchedules)
      .where(eq(paymentSchedules.id, id))
      .limit(1);

    if (!result.length) return null;
    
    return {
      ...result[0],
      dueDate: new Date(result[0].dueDate),
      amount: Number(result[0].amount)
    } as unknown as PaymentSchedule;
  }

  async findByBooking(bookingId: string): Promise<PaymentSchedule[]> {
    const result = await this.db.select()
      .from(paymentSchedules)
      .where(eq(paymentSchedules.bookingId, bookingId))
      .orderBy(paymentSchedules.dueDate);

    return result as unknown as PaymentSchedule[];
  }

 async findAll(): Promise<PaymentSchedule[]> {
    const result = await this.db
      .select()
      .from(paymentSchedules)
      .innerJoin(bookings, eq(paymentSchedules.bookingId, bookings.id))
      .where(eq(bookings.vendorId, this.vendorId))
      .orderBy(desc(paymentSchedules.dueDate));

    return result.map(row => ({
      ...row.payment_schedules,
      dueDate: new Date(row.payment_schedules.dueDate),
      amount: Number(row.payment_schedules.amount)
    })) as unknown as PaymentSchedule[];
  }
    async findUpcoming(limit = 5): Promise<PaymentSchedule[]> {
    const today = new Date();

    const result = await this.db
      .select()
      .from(paymentSchedules)
      .innerJoin(bookings, eq(paymentSchedules.bookingId, bookings.id))
      .where(and(
        eq(bookings.vendorId, this.vendorId),
        eq(paymentSchedules.status, 'Pending'),
        gte(paymentSchedules.dueDate, today.toISOString().split('T')[0])
      ))
      .orderBy(paymentSchedules.dueDate)
      .limit(limit);

    return result.map(row => ({
      ...row.payment_schedules,
      dueDate: new Date(row.payment_schedules.dueDate),
      amount: Number(row.payment_schedules.amount)
    })) as unknown as PaymentSchedule[];
  }


  async getPendingTotal(): Promise<number> {
    const result = await this.db
      .select({ amount: paymentSchedules.amount })
      .from(paymentSchedules)
      .innerJoin(bookings, eq(paymentSchedules.bookingId, bookings.id))
      .where(and(
        eq(bookings.vendorId, this.vendorId),
        eq(paymentSchedules.status, 'Pending')
      ));

    return result.reduce((sum, r) => sum + Number(r.amount), 0);
  }

  async findOverdue(): Promise<PaymentSchedule[]> {
    const today = new Date();

    const result = await this.db
      .select()
      .from(paymentSchedules)
      .innerJoin(bookings, eq(paymentSchedules.bookingId, bookings.id))
      .where(and(
        eq(bookings.vendorId, this.vendorId),
        eq(paymentSchedules.status, 'Pending'),
        lte(paymentSchedules.dueDate, today.toISOString().split('T')[0])
      ))
      .orderBy(desc(paymentSchedules.dueDate));

    return result.map(row => ({
      ...row.payment_schedules,
      dueDate: new Date(row.payment_schedules.dueDate),
      amount: Number(row.payment_schedules.amount)
    })) as unknown as PaymentSchedule[];
  }

  async getScheduleWithUserDetails(id: string): Promise<{
    schedule: PaymentSchedule,
    userEmail: string,
    userName: string,
    vendorId: string
  } | null> {
    const result = await this.db
      .select({
        schedule: paymentSchedules,
        userEmail: users.email,
        userName: users.firstName, // Changed from users.name to users.firstName
        vendorId: bookings.vendorId
      })
      .from(paymentSchedules)
      .innerJoin(bookings, eq(paymentSchedules.bookingId, bookings.id))
      .innerJoin(users, eq(bookings.userId, users.id))
      .where(eq(paymentSchedules.id, id))
      .limit(1);

    if (result.length === 0) return null;

    const { schedule, userEmail, userName, vendorId } = result[0];
    return { 
      schedule: {
        ...schedule,
        dueDate: new Date(schedule.dueDate),
        amount: Number(schedule.amount)
      } as unknown as PaymentSchedule, 
      userEmail, 
      userName, 
      vendorId 
    };
  }
}