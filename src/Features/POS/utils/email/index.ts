// src/utils/email.ts

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
    // In a real implementation, this would connect to an email service
    // For demonstration purposes, we'll just log the email data
    console.log('Sending payment reminder email:');
    console.log(`To: ${data.to}`);
    console.log(`Subject: Payment Reminder: Amount due $${data.amount}`);
    console.log(`Body: Dear ${data.name}, this is a friendly reminder that a payment of $${data.amount} is due on ${data.dueDate.toLocaleDateString()}. ${data.description || ''}`);
    
    // Simulate successful email sending
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
    // In a real implementation, this would connect to an email service
    // For demonstration purposes, we'll just log the email data
    console.log('Sending booking confirmation email:');
    console.log(`To: ${data.to}`);
    console.log(`Subject: Booking Confirmation: ${data.bookingReference}`);
    console.log(`Body: Dear ${data.name}, your booking (Ref: ${data.bookingReference}) for ${data.serviceName} on ${data.serviceDate.toLocaleDateString()} has been confirmed. Total amount: $${data.amount}.`);
    
    // Simulate successful email sending
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
    // In a real implementation, this would connect to an email service
    // For demonstration purposes, we'll just log the email data
    console.log('Sending invoice email:');
    console.log(`To: ${data.to}`);
    console.log(`Subject: Invoice: ${data.invoiceNumber}`);
    
    let itemsText = '';
    data.items.forEach(item => {
      itemsText += `\n- ${item.description} (${item.quantity} x $${item.unitPrice}) = $${item.totalPrice}`;
    });
    
    console.log(`Body: Dear ${data.name}, please find your invoice (${data.invoiceNumber}) attached. Total amount due: $${data.amount} by ${data.dueDate.toLocaleDateString()}.${itemsText}`);
    
    // Simulate successful email sending
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
    // In a real implementation, this would connect to an email service
    // For demonstration purposes, we'll just log the email data
    console.log('Sending receipt email:');
    console.log(`To: ${data.to}`);
    console.log(`Subject: Receipt: ${data.receiptNumber}`);
    console.log(`Body: Dear ${data.name}, thank you for your payment of $${data.amount} on ${data.paymentDate.toLocaleDateString()} via ${data.paymentMethod}. ${data.description || ''} Your receipt number is ${data.receiptNumber}.`);
    
    // Simulate successful email sending
    return true;
  } catch (error) {
    console.error('Failed to send receipt email:', error);
    return false;
  }
}