// src/Config/email/index.ts

import nodemailer from 'nodemailer';
import { config } from 'dotenv';

config();

/**
 * Email configuration interface
 */
interface EmailConfig {
  service?: string;
  host?: string;
  port?: number;
  secure?: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

/**
 * Get email configuration from environment variables
 */
const getEmailConfig = (): EmailConfig => {
  // Support multiple email providers
  const emailProvider = process.env.EMAIL_PROVIDER || 'gmail';
  
  switch (emailProvider.toLowerCase()) {
    case 'gmail':
      return {
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER || '',
          pass: process.env.EMAIL_PASS || '', // Use app password for Gmail
        },
      };
    
    case 'outlook':
      return {
        service: 'hotmail',
        auth: {
          user: process.env.EMAIL_USER || '',
          pass: process.env.EMAIL_PASS || '',
        },
      };
    
    case 'smtp':
      return {
        host: process.env.SMTP_HOST || 'localhost',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER || '',
          pass: process.env.EMAIL_PASS || '',
        },
      };
    
    default:
      throw new Error(`Unsupported email provider: ${emailProvider}`);
  }
};

/**
 * Create and configure nodemailer transporter
 */
export const createEmailTransporter = () => {
  try {
    const config = getEmailConfig();
    const transporter = nodemailer.createTransport(config);
    
    // Verify the transporter configuration
    transporter.verify((error: any, success: any) => {
      if (error) {
        console.error('Email transporter verification failed:', error);
      } else {
        console.log('Email transporter is ready to send emails');
      }
    });
    
    return transporter;
  } catch (error) {
    console.error('Failed to create email transporter:', error);
    throw error;
  }
};

/**
 * Default email options
 */
export const getDefaultEmailOptions = () => ({
  from: process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@evorgs.com',
  replyTo: process.env.EMAIL_REPLY_TO || process.env.EMAIL_USER || 'support@evorgs.com',
});

/**
 * Validate email configuration
 */
export const validateEmailConfig = (): boolean => {
  const requiredVars = ['EMAIL_USER', 'EMAIL_PASS'];
  
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      console.error(`Missing required environment variable: ${varName}`);
      return false;
    }
  }
  
  return true;
};

/**
 * Email template configuration
 */
export const EMAIL_TEMPLATES = {
  PAYMENT_REMINDER: {
    subject: 'Payment Reminder: Amount Due $%AMOUNT%',
    template: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Payment Reminder</h2>
        <p>Dear %NAME%,</p>
        <p>This is a friendly reminder that a payment of <strong>$%AMOUNT%</strong> is due on <strong>%DUE_DATE%</strong>.</p>
        %DESCRIPTION%
        <p>Please ensure your payment is made on time to avoid any late fees.</p>
        <br>
        <p>Best regards,<br>The EvOrgs Team</p>
      </div>
    `
  },
  
  BOOKING_CONFIRMATION: {
    subject: 'Booking Confirmation: %BOOKING_REFERENCE%',
    template: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4CAF50;">Booking Confirmed!</h2>
        <p>Dear %NAME%,</p>
        <p>Your booking has been successfully confirmed. Here are the details:</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p><strong>Booking Reference:</strong> %BOOKING_REFERENCE%</p>
          <p><strong>Service:</strong> %SERVICE_NAME%</p>
          <p><strong>Date:</strong> %SERVICE_DATE%</p>
          <p><strong>Total Amount:</strong> $%AMOUNT%</p>
        </div>
        <p>We look forward to serving you!</p>
        <br>
        <p>Best regards,<br>The EvOrgs Team</p>
      </div>
    `
  },
  
  INVOICE: {
    subject: 'Invoice: %INVOICE_NUMBER%',
    template: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Invoice %INVOICE_NUMBER%</h2>
        <p>Dear %NAME%,</p>
        <p>Please find your invoice details below:</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p><strong>Invoice Number:</strong> %INVOICE_NUMBER%</p>
          <p><strong>Due Date:</strong> %DUE_DATE%</p>
          <p><strong>Total Amount:</strong> $%AMOUNT%</p>
        </div>
        <h3>Items:</h3>
        %ITEMS_TABLE%
        <p>Please make payment by the due date to avoid late fees.</p>
        <br>
        <p>Best regards,<br>The EvOrgs Team</p>
      </div>
    `
  },
  
  RECEIPT: {
    subject: 'Receipt: %RECEIPT_NUMBER%',
    template: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4CAF50;">Payment Receipt</h2>
        <p>Dear %NAME%,</p>
        <p>Thank you for your payment! Here are your receipt details:</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p><strong>Receipt Number:</strong> %RECEIPT_NUMBER%</p>
          <p><strong>Payment Date:</strong> %PAYMENT_DATE%</p>
          <p><strong>Amount Paid:</strong> $%AMOUNT%</p>
          <p><strong>Payment Method:</strong> %PAYMENT_METHOD%</p>
          %DESCRIPTION%
        </div>
        <p>This receipt serves as confirmation of your payment.</p>
        <br>
        <p>Best regards,<br>The EvOrgs Team</p>
      </div>
    `
  }
};
