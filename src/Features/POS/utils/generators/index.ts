// src/utils/generators.ts

/**
 * Generates a unique transaction number with a prefix and random digits
 * Format: TX-YYYYMMDD-XXXXX (where X is a random digit)
 * @returns A transaction number string
 */
export function generateTransactionNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateString = `${year}${month}${day}`;
  
  // Generate a 5-digit random number
  const randomDigits = Math.floor(10000 + Math.random() * 90000);
  
  return `TX-${dateString}-${randomDigits}`;
}

/**
 * Generates a unique invoice number
 * Format: INV-YYYYMMDD-XXXXX (where X is a random digit)
 * @returns An invoice number string
 */
export function generateInvoiceNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateString = `${year}${month}${day}`;
  
  // Generate a 5-digit random number
  const randomDigits = Math.floor(10000 + Math.random() * 90000);
  
  return `INV-${dateString}-${randomDigits}`;
}

/**
 * Generates a unique booking reference number
 * Format: BK-YYYYMMDD-XXXXX (where X is a random digit)
 * @returns A booking reference number string
 */
export function generateBookingReference(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateString = `${year}${month}${day}`;
  
  // Generate a 5-digit random number
  const randomDigits = Math.floor(10000 + Math.random() * 90000);
  
  return `BK-${dateString}-${randomDigits}`;
}

/**
 * Generates a formatted receipt number
 * Format: RCPT-YYYYMMDD-XXXXX (where X is a random digit)
 * @returns A receipt number string
 */
export function generateReceiptNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateString = `${year}${month}${day}`;
  
  // Generate a 5-digit random number
  const randomDigits = Math.floor(10000 + Math.random() * 90000);
  
  return `RCPT-${dateString}-${randomDigits}`;
}