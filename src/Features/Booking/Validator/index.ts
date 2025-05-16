// src/Features/Booking/Validators.ts

import { 
  BookingFiltersInput, 
  BookingStatus, 
  CancelBookingInput, 
  CreateBookingInput, 
  PaymentStatus, 
  RequestVisitInput, 
  ScheduleVisitInput, 
  ServiceType, 
  UpdatePaymentInput 
} from '../Types';
import { UserInputError } from 'apollo-server-express';
import { validate as uuidValidate } from 'uuid';

/**
 * Validates that a string is a valid UUID
 */
function isValidUUID(value: string): boolean {
  return uuidValidate(value);
}

/**
 * Validates that a string is a valid ISO date string
 */
function isValidISODate(value: string): boolean {
  try {
    const date = new Date(value);
    return !isNaN(date.getTime());
  } catch {
    return false;
  }
}

/**
 * Validates that a string is a valid time format (HH:MM)
 */
function isValidTimeFormat(value: string): boolean {
  const timePattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timePattern.test(value);
}

/**
 * Validates create booking input
 */
export function validateCreateBookingInput(input: CreateBookingInput): void {
  // Check required fields
  if (!input.vendorId) {
    throw new UserInputError('Vendor ID is required');
  }
  
  if (!input.serviceType) {
    throw new UserInputError('Service type is required');
  }
  
  if (!input.serviceId) {
    throw new UserInputError('Service ID is required');
  }
  
  // Validate UUIDs
  if (!isValidUUID(input.vendorId)) {
    throw new UserInputError('Invalid vendor ID format');
  }
  
  if (!isValidUUID(input.serviceId)) {
    throw new UserInputError('Invalid service ID format');
  }
  
  // Validate service type
  if (!Object.values(ServiceType).includes(input.serviceType)) {
    throw new UserInputError('Invalid service type');
  }
  
  // Validate dates if provided
  if (input.eventDate && !isValidISODate(input.eventDate)) {
    throw new UserInputError('Invalid event date format');
  }
  
  if (input.eventStartTime && !isValidISODate(input.eventStartTime)) {
    throw new UserInputError('Invalid event start time format');
  }
  
  if (input.eventEndTime && !isValidISODate(input.eventEndTime)) {
    throw new UserInputError('Invalid event end time format');
  }
  
  // Validate number of guests if provided
  if (input.numberOfGuests !== undefined && (input.numberOfGuests < 1 || !Number.isInteger(input.numberOfGuests))) {
    throw new UserInputError('Number of guests must be a positive integer');
  }
}

/**
 * Validates request visit input
 */
export function validateRequestVisitInput(input: RequestVisitInput): void {
  // Check required fields
  if (!input.bookingId) {
    throw new UserInputError('Booking ID is required');
  }
  
  if (!input.preferredDate) {
    throw new UserInputError('Preferred date is required');
  }
  
  if (!input.preferredTime) {
    throw new UserInputError('Preferred time is required');
  }
  
  // Validate UUID
  if (!isValidUUID(input.bookingId)) {
    throw new UserInputError('Invalid booking ID format');
  }
  
  // Validate date
  if (!isValidISODate(input.preferredDate)) {
    throw new UserInputError('Invalid preferred date format');
  }
  
  // Validate time
  if (!isValidTimeFormat(input.preferredTime)) {
    throw new UserInputError('Invalid preferred time format (should be HH:MM)');
  }
}

/**
 * Validates schedule visit input
 */
export function validateScheduleVisitInput(input: ScheduleVisitInput): void {
  // Check required fields
  if (!input.bookingId) {
    throw new UserInputError('Booking ID is required');
  }
  
  if (!input.scheduledDate) {
    throw new UserInputError('Scheduled date is required');
  }
  
  if (!input.scheduledTime) {
    throw new UserInputError('Scheduled time is required');
  }
  
  // Validate UUID
  if (!isValidUUID(input.bookingId)) {
    throw new UserInputError('Invalid booking ID format');
  }
  
  // Validate date
  if (!isValidISODate(input.scheduledDate)) {
    throw new UserInputError('Invalid scheduled date format');
  }
  
  // Validate time
  if (!isValidTimeFormat(input.scheduledTime)) {
    throw new UserInputError('Invalid scheduled time format (should be HH:MM)');
  }
}

/**
 * Validates update payment input
 */
export function validateUpdatePaymentInput(input: UpdatePaymentInput): void {
  // Check required fields
  if (!input.bookingId) {
    throw new UserInputError('Booking ID is required');
  }
  
  // Validate UUID
  if (!isValidUUID(input.bookingId)) {
    throw new UserInputError('Invalid booking ID format');
  }
  
  // Validate amounts if provided
  if (input.advanceAmount !== undefined && input.advanceAmount <= 0) {
    throw new UserInputError('Advance amount must be positive');
  }
  
  if (input.balanceAmount !== undefined && input.balanceAmount < 0) {
    throw new UserInputError('Balance amount cannot be negative');
  }
  
  // Validate payment status if provided
  if (input.paymentStatus && !Object.values(PaymentStatus).includes(input.paymentStatus)) {
    throw new UserInputError('Invalid payment status');
  }
}

/**
 * Validates cancel booking input
 */
export function validateCancelBookingInput(input: CancelBookingInput): void {
  // Check required fields
  if (!input.bookingId) {
    throw new UserInputError('Booking ID is required');
  }
  
  if (!input.cancellationReason) {
    throw new UserInputError('Cancellation reason is required');
  }
  
  // Validate UUID
  if (!isValidUUID(input.bookingId)) {
    throw new UserInputError('Invalid booking ID format');
  }
  
  // Validate reason
  if (input.cancellationReason.trim().length < 5) {
    throw new UserInputError('Cancellation reason must be at least 5 characters');
  }
}

/**
 * Validates booking filters input
 */
export function validateBookingFiltersInput(input: BookingFiltersInput): void {
  // Validate status if provided
  if (input.status && !Object.values(BookingStatus).includes(input.status)) {
    throw new UserInputError('Invalid booking status');
  }
  
  // Validate service type if provided
  if (input.serviceType && !Object.values(ServiceType).includes(input.serviceType)) {
    throw new UserInputError('Invalid service type');
  }
  
  // Validate date range if provided
  if (input.from && !isValidISODate(input.from)) {
    throw new UserInputError('Invalid from date format');
  }
  
  if (input.to && !isValidISODate(input.to)) {
    throw new UserInputError('Invalid to date format');
  }
  
  // Validate pagination if provided
  if (input.limit !== undefined && (input.limit < 1 || !Number.isInteger(input.limit))) {
    throw new UserInputError('Limit must be a positive integer');
  }
  
  if (input.offset !== undefined && (input.offset < 0 || !Number.isInteger(input.offset))) {
    throw new UserInputError('Offset must be a non-negative integer');
  }
}