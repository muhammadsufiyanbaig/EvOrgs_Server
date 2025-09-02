"use strict";
// src/Features/POS/utils/email/index.ts
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
exports.sendPaymentReminderEmail = sendPaymentReminderEmail;
exports.sendBookingConfirmationEmail = sendBookingConfirmationEmail;
exports.sendInvoiceEmail = sendInvoiceEmail;
exports.sendReceiptEmail = sendReceiptEmail;
exports.sendTestEmail = sendTestEmail;
const email_1 = require("../../../../Config/email");
const templates_1 = require("../../../../Config/email/templates");
/**
 * Sends a payment reminder email to a customer
 * @param data The email data including recipient details and payment information
 * @returns A promise that resolves when the email is sent
 */
function sendPaymentReminderEmail(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const transporter = (0, email_1.createEmailTransporter)();
            const defaultOptions = (0, email_1.getDefaultEmailOptions)();
            const templateData = {
                name: data.name,
                amount: data.amount.toFixed(2),
                due_date: (0, templates_1.formatDateForEmail)(data.dueDate),
                description: (0, templates_1.formatDescription)(data.description)
            };
            const subject = (0, templates_1.replaceTemplatePlaceholders)(email_1.EMAIL_TEMPLATES.PAYMENT_REMINDER.subject, templateData);
            const htmlContent = (0, templates_1.replaceTemplatePlaceholders)(email_1.EMAIL_TEMPLATES.PAYMENT_REMINDER.template, templateData);
            const mailOptions = Object.assign(Object.assign({}, defaultOptions), { to: data.to, subject, html: htmlContent, text: `Dear ${data.name}, this is a friendly reminder that a payment of $${data.amount} is due on ${(0, templates_1.formatDateForEmail)(data.dueDate)}. ${data.description || ''}` });
            const result = yield transporter.sendMail(mailOptions);
            console.log('Payment reminder email sent successfully:', result.messageId);
            return true;
        }
        catch (error) {
            console.error('Failed to send payment reminder email:', error);
            return false;
        }
    });
}
/**
 * Sends a booking confirmation email to a customer
 * @param data The email data including recipient details and booking information
 * @returns A promise that resolves when the email is sent
 */
function sendBookingConfirmationEmail(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const transporter = (0, email_1.createEmailTransporter)();
            const defaultOptions = (0, email_1.getDefaultEmailOptions)();
            const templateData = {
                name: data.name,
                booking_reference: data.bookingReference,
                service_name: data.serviceName,
                service_date: (0, templates_1.formatDateForEmail)(data.serviceDate),
                amount: data.amount.toFixed(2)
            };
            const subject = (0, templates_1.replaceTemplatePlaceholders)(email_1.EMAIL_TEMPLATES.BOOKING_CONFIRMATION.subject, templateData);
            const htmlContent = (0, templates_1.replaceTemplatePlaceholders)(email_1.EMAIL_TEMPLATES.BOOKING_CONFIRMATION.template, templateData);
            const mailOptions = Object.assign(Object.assign({}, defaultOptions), { to: data.to, subject, html: htmlContent, text: `Dear ${data.name}, your booking (Ref: ${data.bookingReference}) for ${data.serviceName} on ${(0, templates_1.formatDateForEmail)(data.serviceDate)} has been confirmed. Total amount: $${data.amount}.` });
            const result = yield transporter.sendMail(mailOptions);
            console.log('Booking confirmation email sent successfully:', result.messageId);
            return true;
        }
        catch (error) {
            console.error('Failed to send booking confirmation email:', error);
            return false;
        }
    });
}
/**
 * Sends an invoice email to a customer
 * @param data The email data including recipient details and invoice information
 * @returns A promise that resolves when the email is sent
 */
function sendInvoiceEmail(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const transporter = (0, email_1.createEmailTransporter)();
            const defaultOptions = (0, email_1.getDefaultEmailOptions)();
            const itemsTable = (0, templates_1.generateItemsTable)(data.items);
            const templateData = {
                name: data.name,
                invoice_number: data.invoiceNumber,
                due_date: (0, templates_1.formatDateForEmail)(data.dueDate),
                amount: data.amount.toFixed(2),
                items_table: itemsTable
            };
            const subject = (0, templates_1.replaceTemplatePlaceholders)(email_1.EMAIL_TEMPLATES.INVOICE.subject, templateData);
            const htmlContent = (0, templates_1.replaceTemplatePlaceholders)(email_1.EMAIL_TEMPLATES.INVOICE.template, templateData);
            let itemsText = '';
            data.items.forEach(item => {
                itemsText += `\n- ${item.description} (${item.quantity} x $${item.unitPrice}) = $${item.totalPrice}`;
            });
            const mailOptions = Object.assign(Object.assign({}, defaultOptions), { to: data.to, subject, html: htmlContent, text: `Dear ${data.name}, please find your invoice (${data.invoiceNumber}) attached. Total amount due: $${data.amount} by ${(0, templates_1.formatDateForEmail)(data.dueDate)}.${itemsText}` });
            const result = yield transporter.sendMail(mailOptions);
            console.log('Invoice email sent successfully:', result.messageId);
            return true;
        }
        catch (error) {
            console.error('Failed to send invoice email:', error);
            return false;
        }
    });
}
/**
 * Sends a receipt email to a customer
 * @param data The email data including recipient details and receipt information
 * @returns A promise that resolves when the email is sent
 */
function sendReceiptEmail(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const transporter = (0, email_1.createEmailTransporter)();
            const defaultOptions = (0, email_1.getDefaultEmailOptions)();
            const templateData = {
                name: data.name,
                receipt_number: data.receiptNumber,
                payment_date: (0, templates_1.formatDateForEmail)(data.paymentDate),
                amount: data.amount.toFixed(2),
                payment_method: data.paymentMethod,
                description: (0, templates_1.formatDescription)(data.description)
            };
            const subject = (0, templates_1.replaceTemplatePlaceholders)(email_1.EMAIL_TEMPLATES.RECEIPT.subject, templateData);
            const htmlContent = (0, templates_1.replaceTemplatePlaceholders)(email_1.EMAIL_TEMPLATES.RECEIPT.template, templateData);
            const mailOptions = Object.assign(Object.assign({}, defaultOptions), { to: data.to, subject, html: htmlContent, text: `Dear ${data.name}, thank you for your payment of $${data.amount} on ${(0, templates_1.formatDateForEmail)(data.paymentDate)} via ${data.paymentMethod}. ${data.description || ''} Your receipt number is ${data.receiptNumber}.` });
            const result = yield transporter.sendMail(mailOptions);
            console.log('Receipt email sent successfully:', result.messageId);
            return true;
        }
        catch (error) {
            console.error('Failed to send receipt email:', error);
            return false;
        }
    });
}
/**
 * Test email configuration by sending a test email
 * @param testEmail The email address to send the test email to
 * @returns A promise that resolves to true if test email is sent successfully
 */
function sendTestEmail(testEmail) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const transporter = (0, email_1.createEmailTransporter)();
            const defaultOptions = (0, email_1.getDefaultEmailOptions)();
            const mailOptions = Object.assign(Object.assign({}, defaultOptions), { to: testEmail, subject: 'EvOrgs Email Configuration Test', html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4CAF50;">Email Configuration Test</h2>
          <p>Congratulations! Your email configuration is working correctly.</p>
          <p>This test email was sent from EvOrgs Server.</p>
          <p>Date: ${new Date().toLocaleString()}</p>
          <br>
          <p>Best regards,<br>The EvOrgs Team</p>
        </div>
      `, text: `Email Configuration Test - Congratulations! Your email configuration is working correctly. This test email was sent from EvOrgs Server on ${new Date().toLocaleString()}.` });
            const result = yield transporter.sendMail(mailOptions);
            console.log('Test email sent successfully:', result.messageId);
            return true;
        }
        catch (error) {
            console.error('Failed to send test email:', error);
            return false;
        }
    });
}
