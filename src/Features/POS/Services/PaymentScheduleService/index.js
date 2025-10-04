"use strict";
// src/Features/POS/services/PaymentScheduleService.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentScheduleService = void 0;
const PaymentScheduleModel_1 = require("../../Model/PaymentScheduleModel");
const email_1 = require("../../utils/email");
class PaymentScheduleService {
    constructor(db, vendorId) {
        this.paymentScheduleModel = new PaymentScheduleModel_1.PaymentScheduleModel(db, vendorId);
        this.vendorId = vendorId;
    }
    createPaymentSchedule(input) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verify booking belongs to vendor
            const bookingExists = yield this.paymentScheduleModel.verifyBookingOwnership(input.bookingId);
            if (!bookingExists) {
                throw new Error('Booking not found or does not belong to vendor');
            }
            // Create new payment schedule
            return this.paymentScheduleModel.create(input);
        });
    }
    updatePaymentSchedule(input) {
        return __awaiter(this, void 0, void 0, function* () {
            // First check if payment schedule exists and is associated with vendor's booking
            const existingSchedule = yield this.paymentScheduleModel.findById(input.id);
            if (!existingSchedule || existingSchedule.vendorId !== this.vendorId) {
                throw new Error('Payment schedule not found or does not belong to vendor');
            }
            // Prepare update values
            const updateValues = {};
            if (input.dueDate !== undefined)
                updateValues.dueDate = input.dueDate;
            if (input.amount !== undefined)
                updateValues.amount = input.amount;
            if (input.description !== undefined)
                updateValues.description = input.description;
            if (input.status !== undefined)
                updateValues.status = input.status;
            if (input.reminderSent !== undefined)
                updateValues.reminderSent = input.reminderSent;
            // Update payment schedule
            yield this.paymentScheduleModel.update(input.id, updateValues);
            // Return updated payment schedule
            const updatedSchedule = yield this.paymentScheduleModel.getById(input.id);
            return updatedSchedule;
        });
    }
    deletePaymentSchedule(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if payment schedule exists and is associated with vendor's booking
            const existingSchedule = yield this.paymentScheduleModel.findById(id);
            if (!existingSchedule || existingSchedule.vendorId !== this.vendorId) {
                throw new Error('Payment schedule not found or does not belong to vendor');
            }
            // Delete payment schedule
            yield this.paymentScheduleModel.delete(id);
            return true;
        });
    }
    markPaymentAsPaid(id, transactionId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if payment schedule exists and is associated with vendor's booking
            const existingSchedule = yield this.paymentScheduleModel.findById(id);
            if (!existingSchedule || existingSchedule.vendorId !== this.vendorId) {
                throw new Error('Payment schedule not found or does not belong to vendor');
            }
            // If transactionId provided, verify it exists and belongs to vendor
            if (transactionId) {
                const transactionExists = yield this.paymentScheduleModel.verifyTransactionOwnership(transactionId);
                if (!transactionExists) {
                    throw new Error('Transaction not found or does not belong to vendor');
                }
            }
            // Create update object that matches UpdatePaymentScheduleInput
            const updateData = {
                id,
                status: 'Paid'
            };
            // Add transactionId to the separate update object for the model
            // since it's not part of the UpdatePaymentScheduleInput type
            const modelUpdateData = Object.assign(Object.assign({}, updateData), { transactionId });
            // Update payment schedule
            yield this.paymentScheduleModel.update(id, modelUpdateData);
            // Return updated payment schedule
            const updatedSchedule = yield this.paymentScheduleModel.getById(id);
            return updatedSchedule;
        });
    }
    sendPaymentReminder(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get payment schedule details with user information
            const scheduleDetails = yield this.paymentScheduleModel.getScheduleWithUserDetails(id);
            if (!scheduleDetails || scheduleDetails.vendorId !== this.vendorId) {
                throw new Error('Payment schedule not found or does not belong to vendor');
            }
            const { schedule, userEmail, userName } = scheduleDetails;
            // In a real implementation, this would send an actual email
            yield (0, email_1.sendPaymentReminderEmail)({
                to: userEmail,
                name: userName,
                amount: schedule.amount,
                dueDate: schedule.dueDate,
                description: schedule.description
            });
            // Create update object that matches UpdatePaymentScheduleInput
            const updateData = {
                id,
                reminderSent: true
            };
            // Add lastReminderDate to the separate update object for the model
            // since it's not part of the UpdatePaymentScheduleInput type
            const modelUpdateData = Object.assign(Object.assign({}, updateData), { lastReminderDate: new Date() });
            // Update payment schedule
            yield this.paymentScheduleModel.update(id, modelUpdateData);
            // Return updated payment schedule
            const updatedSchedule = yield this.paymentScheduleModel.getById(id);
            return updatedSchedule;
        });
    }
    getPaymentScheduleById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const scheduleData = yield this.paymentScheduleModel.findById(id);
            if (!scheduleData || scheduleData.vendorId !== this.vendorId) {
                return null;
            }
            return scheduleData.schedule;
        });
    }
    getPaymentSchedulesByBooking(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verify booking belongs to vendor
            const bookingExists = yield this.paymentScheduleModel.verifyBookingOwnership(bookingId);
            if (!bookingExists) {
                throw new Error('Booking not found or does not belong to vendor');
            }
            return this.paymentScheduleModel.findByBooking(bookingId);
        });
    }
    getAllPaymentSchedules() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.paymentScheduleModel.findAll();
        });
    }
    getUpcomingPayments() {
        return __awaiter(this, arguments, void 0, function* (limit = 5) {
            return this.paymentScheduleModel.findUpcoming(limit);
        });
    }
    getPendingPaymentsTotal() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.paymentScheduleModel.getPendingTotal();
        });
    }
    findOverduePayments() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.paymentScheduleModel.findOverdue();
        });
    }
}
exports.PaymentScheduleService = PaymentScheduleService;
// Helper function for sending emails (mock implementation)
// This should be in the utils/email.ts file referenced in the import
/*
async function sendPaymentReminderEmail(params: {
  to: string;
  name: string;
  amount: number;
  dueDate: Date;
  description?: string;
}): Promise<void> {
  // Email sending logic would go here
  console.log(`Email sent to ${params.to} for payment reminder of ${params.amount}`);
}
*/ 
