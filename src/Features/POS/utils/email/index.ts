// src/Features/POS/utils/email/index.ts

import { createEmailTransporter, getDefaultEmailOptions, EMAIL_TEMPLATES } from '../../../../Config/email';
import { 
  replaceTemplatePlaceholders, 
  generateItemsTable, 
  formatDateForEmail, 
  formatDescription 
} from '../../../../Config/email/templates';

/**
 * Interface for payment reminder email data
 */
interface PaymentReminderEmailData {
  to: string;
  name: string;
  amount: number;
  dueDate: Date;
  description?: string;
}

/**
 * Interface for booking confirmation email data
 */
interface BookingConfirmationEmailData {
  to: string;
  name: string;
  bookingReference: string;
  serviceDate: Date;
  serviceName: string;
  amount: number;
}

/**
 * Interface for invoice email data
 */
interface InvoiceEmailData {
  to: string;
  name: string;
  invoiceNumber: string;
  dueDate: Date;
  amount: number;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
}

/**
 * Interface for receipt email data
 */
interface ReceiptEmailData {
  to: string;
  name: string;
  receiptNumber: string;
  paymentDate: Date;
  amount: number;
  paymentMethod: string;
  description?: string;
}

/**
 * Sends a payment reminder email to a customer
 * @param data The email data including recipient details and payment information
 * @returns A promise that resolves when the email is sent
 */
export async function sendPaymentReminderEmail(data: PaymentReminderEmailData): Promise<boolean> {
  try {
    const transporter = createEmailTransporter();
    const defaultOptions = getDefaultEmailOptions();
    
    const templateData = {
      name: data.name,
      amount: data.amount.toFixed(2),
      due_date: formatDateForEmail(data.dueDate),
      description: formatDescription(data.description)
    };
    
    const subject = replaceTemplatePlaceholders(EMAIL_TEMPLATES.PAYMENT_REMINDER.subject, templateData);
    const htmlContent = replaceTemplatePlaceholders(EMAIL_TEMPLATES.PAYMENT_REMINDER.template, templateData);
    
    const mailOptions = {
      ...defaultOptions,
      to: data.to,
      subject,
      html: htmlContent,
      text: `Dear ${data.name}, this is a friendly reminder that a payment of $${data.amount} is due on ${formatDateForEmail(data.dueDate)}. ${data.description || ''}`
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log('Payment reminder email sent successfully:', result.messageId);
    return true;
  } catch (error) {
    console.error('Failed to send payment reminder email:', error);
    return false;
  }
}

/**
 * Sends a booking confirmation email to a customer
 * @param data The email data including recipient details and booking information
 * @returns A promise that resolves when the email is sent
 */
export async function sendBookingConfirmationEmail(data: BookingConfirmationEmailData): Promise<boolean> {
  try {
    const transporter = createEmailTransporter();
    const defaultOptions = getDefaultEmailOptions();
    
    const templateData = {
      name: data.name,
      booking_reference: data.bookingReference,
      service_name: data.serviceName,
      service_date: formatDateForEmail(data.serviceDate),
      amount: data.amount.toFixed(2)
    };
    
    const subject = replaceTemplatePlaceholders(EMAIL_TEMPLATES.BOOKING_CONFIRMATION.subject, templateData);
    const htmlContent = replaceTemplatePlaceholders(EMAIL_TEMPLATES.BOOKING_CONFIRMATION.template, templateData);
    
    const mailOptions = {
      ...defaultOptions,
      to: data.to,
      subject,
      html: htmlContent,
      text: `Dear ${data.name}, your booking (Ref: ${data.bookingReference}) for ${data.serviceName} on ${formatDateForEmail(data.serviceDate)} has been confirmed. Total amount: $${data.amount}.`
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log('Booking confirmation email sent successfully:', result.messageId);
    return true;
  } catch (error) {
    console.error('Failed to send booking confirmation email:', error);
    return false;
  }
}

/**
 * Sends an invoice email to a customer
 * @param data The email data including recipient details and invoice information
 * @returns A promise that resolves when the email is sent
 */
export async function sendInvoiceEmail(data: InvoiceEmailData): Promise<boolean> {
  try {
    const transporter = createEmailTransporter();
    const defaultOptions = getDefaultEmailOptions();
    
    const itemsTable = generateItemsTable(data.items);
    
    const templateData = {
      name: data.name,
      invoice_number: data.invoiceNumber,
      due_date: formatDateForEmail(data.dueDate),
      amount: data.amount.toFixed(2),
      items_table: itemsTable
    };
    
    const subject = replaceTemplatePlaceholders(EMAIL_TEMPLATES.INVOICE.subject, templateData);
    const htmlContent = replaceTemplatePlaceholders(EMAIL_TEMPLATES.INVOICE.template, templateData);
    
    let itemsText = '';
    data.items.forEach(item => {
      itemsText += `\n- ${item.description} (${item.quantity} x $${item.unitPrice}) = $${item.totalPrice}`;
    });
    
    const mailOptions = {
      ...defaultOptions,
      to: data.to,
      subject,
      html: htmlContent,
      text: `Dear ${data.name}, please find your invoice (${data.invoiceNumber}) attached. Total amount due: $${data.amount} by ${formatDateForEmail(data.dueDate)}.${itemsText}`
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log('Invoice email sent successfully:', result.messageId);
    return true;
  } catch (error) {
    console.error('Failed to send invoice email:', error);
    return false;
  }
}

/**
 * Sends a receipt email to a customer
 * @param data The email data including recipient details and receipt information
 * @returns A promise that resolves when the email is sent
 */
export async function sendReceiptEmail(data: ReceiptEmailData): Promise<boolean> {
  try {
    const transporter = createEmailTransporter();
    const defaultOptions = getDefaultEmailOptions();
    
    const templateData = {
      name: data.name,
      receipt_number: data.receiptNumber,
      payment_date: formatDateForEmail(data.paymentDate),
      amount: data.amount.toFixed(2),
      payment_method: data.paymentMethod,
      description: formatDescription(data.description)
    };
    
    const subject = replaceTemplatePlaceholders(EMAIL_TEMPLATES.RECEIPT.subject, templateData);
    const htmlContent = replaceTemplatePlaceholders(EMAIL_TEMPLATES.RECEIPT.template, templateData);
    
    const mailOptions = {
      ...defaultOptions,
      to: data.to,
      subject,
      html: htmlContent,
      text: `Dear ${data.name}, thank you for your payment of $${data.amount} on ${formatDateForEmail(data.paymentDate)} via ${data.paymentMethod}. ${data.description || ''} Your receipt number is ${data.receiptNumber}.`
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log('Receipt email sent successfully:', result.messageId);
    return true;
  } catch (error) {
    console.error('Failed to send receipt email:', error);
    return false;
  }
}

/**
 * Test email configuration by sending a test email
 * @param testEmail The email address to send the test email to
 * @returns A promise that resolves to true if test email is sent successfully
 */
export async function sendTestEmail(testEmail: string): Promise<boolean> {
  try {
    const transporter = createEmailTransporter();
    const defaultOptions = getDefaultEmailOptions();
    
    const mailOptions = {
      ...defaultOptions,
      to: testEmail,
      subject: 'EvOrgs Email Configuration Test',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4CAF50;">Email Configuration Test</h2>
          <p>Congratulations! Your email configuration is working correctly.</p>
          <p>This test email was sent from EvOrgs Server.</p>
          <p>Date: ${new Date().toLocaleString()}</p>
          <br>
          <p>Best regards,<br>The EvOrgs Team</p>
        </div>
      `,
      text: `Email Configuration Test - Congratulations! Your email configuration is working correctly. This test email was sent from EvOrgs Server on ${new Date().toLocaleString()}.`
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log('Test email sent successfully:', result.messageId);
    return true;
  } catch (error) {
    console.error('Failed to send test email:', error);
    return false;
  }
}