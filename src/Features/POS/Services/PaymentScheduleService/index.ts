// src/Features/POS/services/PaymentScheduleService.ts

import { DrizzleDB } from '../../../../Config/db';
import { PaymentScheduleModel } from '../../Model/PaymentScheduleModel';
import { 
  PaymentSchedule, 
  CreatePaymentScheduleInput, 
  UpdatePaymentScheduleInput,
  PaymentScheduleStatus
} from '../../Types';
import { sendPaymentReminderEmail } from '../../utils/email';

export class PaymentScheduleService {
  private paymentScheduleModel: PaymentScheduleModel;
  private vendorId: string;

  constructor(db: DrizzleDB, vendorId: string) {
    this.paymentScheduleModel = new PaymentScheduleModel(db, vendorId);
    this.vendorId = vendorId;
  }

  async createPaymentSchedule(input: CreatePaymentScheduleInput): Promise<PaymentSchedule> {
    // Verify booking belongs to vendor
    const bookingExists = await this.paymentScheduleModel.verifyBookingOwnership(input.bookingId);
    if (!bookingExists) {
      throw new Error('Booking not found or does not belong to vendor');
    }

    // Create new payment schedule
    return this.paymentScheduleModel.create(input);
  }

  async updatePaymentSchedule(input: UpdatePaymentScheduleInput): Promise<PaymentSchedule> {
    // First check if payment schedule exists and is associated with vendor's booking
    const existingSchedule = await this.paymentScheduleModel.findById(input.id);
    if (!existingSchedule || existingSchedule.vendorId !== this.vendorId) {
      throw new Error('Payment schedule not found or does not belong to vendor');
    }

    // Prepare update values
    const updateValues: Partial<PaymentSchedule> = {};

    if (input.dueDate !== undefined) updateValues.dueDate = new Date(input.dueDate);
    if (input.amount !== undefined) updateValues.amount = input.amount;
    if (input.description !== undefined) updateValues.description = input.description;
    if (input.status !== undefined) updateValues.status = input.status;
    if (input.reminderSent !== undefined) updateValues.reminderSent = input.reminderSent;

    // Update payment schedule
    await this.paymentScheduleModel.update(input.id, updateValues);

    // Return updated payment schedule
    const updatedSchedule = await this.paymentScheduleModel.getById(input.id);
    return updatedSchedule as PaymentSchedule;
  }

  async deletePaymentSchedule(id: string): Promise<boolean> {
    // Check if payment schedule exists and is associated with vendor's booking
    const existingSchedule = await this.paymentScheduleModel.findById(id);
    if (!existingSchedule || existingSchedule.vendorId !== this.vendorId) {
      throw new Error('Payment schedule not found or does not belong to vendor');
    }

    // Delete payment schedule
    await this.paymentScheduleModel.delete(id);
    return true;
  }

  async markPaymentAsPaid(id: string, transactionId?: string): Promise<PaymentSchedule> {
    // Check if payment schedule exists and is associated with vendor's booking
    const existingSchedule = await this.paymentScheduleModel.findById(id);
    if (!existingSchedule || existingSchedule.vendorId !== this.vendorId) {
      throw new Error('Payment schedule not found or does not belong to vendor');
    }

    // If transactionId provided, verify it exists and belongs to vendor
    if (transactionId) {
      const transactionExists = await this.paymentScheduleModel.verifyTransactionOwnership(transactionId);
      if (!transactionExists) {
        throw new Error('Transaction not found or does not belong to vendor');
      }
    }

    // Update payment schedule
    await this.paymentScheduleModel.update(id, {
      status: 'Paid' as PaymentScheduleStatus,
      transactionId: transactionId
    });

    // Return updated payment schedule
    const updatedSchedule = await this.paymentScheduleModel.getById(id);
    return updatedSchedule as PaymentSchedule;
  }

  async sendPaymentReminder(id: string): Promise<PaymentSchedule> {
    // Get payment schedule details with user information
    const scheduleDetails = await this.paymentScheduleModel.getScheduleWithUserDetails(id);
    
    if (!scheduleDetails || scheduleDetails.vendorId !== this.vendorId) {
      throw new Error('Payment schedule not found or does not belong to vendor');
    }

    const { schedule, userEmail, userName } = scheduleDetails;
    
    // In a real implementation, this would send an actual email
    await sendPaymentReminderEmail({
      to: userEmail,
      name: userName,
      amount: schedule.amount,
      dueDate: schedule.dueDate,
      description: schedule.description
    });

    // Update payment schedule to mark reminder as sent
    await this.paymentScheduleModel.update(id, {
      reminderSent: true,
      lastReminderDate: new Date()
    });

    // Return updated payment schedule
    const updatedSchedule = await this.paymentScheduleModel.getById(id);
    return updatedSchedule as PaymentSchedule;
  }

  async getPaymentScheduleById(id: string): Promise<PaymentSchedule | null> {
    const scheduleData = await this.paymentScheduleModel.findById(id);
    
    if (!scheduleData || scheduleData.vendorId !== this.vendorId) {
      return null;
    }

    return scheduleData.schedule;
  }

  async getPaymentSchedulesByBooking(bookingId: string): Promise<PaymentSchedule[]> {
    // Verify booking belongs to vendor
    const bookingExists = await this.paymentScheduleModel.verifyBookingOwnership(bookingId);
    if (!bookingExists) {
      throw new Error('Booking not found or does not belong to vendor');
    }

    return this.paymentScheduleModel.findByBooking(bookingId);
  }

  async getAllPaymentSchedules(): Promise<PaymentSchedule[]> {
    return this.paymentScheduleModel.findAll();
  }

  async getUpcomingPayments(limit: number = 5): Promise<PaymentSchedule[]> {
    return this.paymentScheduleModel.findUpcoming(limit);
  }

  async getPendingPaymentsTotal(): Promise<number> {
    return this.paymentScheduleModel.getPendingTotal();
  }

  async findOverduePayments(): Promise<PaymentSchedule[]> {
    return this.paymentScheduleModel.findOverdue();
  }
}