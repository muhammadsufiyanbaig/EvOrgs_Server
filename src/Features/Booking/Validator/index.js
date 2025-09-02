"use strict";
// src/Features/Booking/Validators.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateBookingInput = validateCreateBookingInput;
exports.validateRequestVisitInput = validateRequestVisitInput;
exports.validateScheduleVisitInput = validateScheduleVisitInput;
exports.validateUpdatePaymentInput = validateUpdatePaymentInput;
exports.validateCancelBookingInput = validateCancelBookingInput;
exports.validateBookingFiltersInput = validateBookingFiltersInput;
const Types_1 = require("../Types");
const apollo_server_express_1 = require("apollo-server-express");
const uuid_1 = require("uuid");
/**
 * Validates that a string is a valid UUID
 */
function isValidUUID(value) {
    return (0, uuid_1.validate)(value);
}
/**
 * Validates that a string is a valid ISO date string
 */
function isValidISODate(value) {
    try {
        const date = new Date(value);
        return !isNaN(date.getTime());
    }
    catch (_a) {
        return false;
    }
}
/**
 * Validates that a string is a valid time format (HH:MM)
 */
function isValidTimeFormat(value) {
    const timePattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timePattern.test(value);
}
/**
 * Validates create booking input
 */
function validateCreateBookingInput(input) {
    // Check required fields
    if (!input.vendorId) {
        throw new apollo_server_express_1.UserInputError('Vendor ID is required');
    }
    if (!input.serviceType) {
        throw new apollo_server_express_1.UserInputError('Service type is required');
    }
    if (!input.serviceId) {
        throw new apollo_server_express_1.UserInputError('Service ID is required');
    }
    // Validate UUIDs
    if (!isValidUUID(input.vendorId)) {
        throw new apollo_server_express_1.UserInputError('Invalid vendor ID format');
    }
    if (!isValidUUID(input.serviceId)) {
        throw new apollo_server_express_1.UserInputError('Invalid service ID format');
    }
    // Validate service type
    if (!Object.values(Types_1.ServiceType).includes(input.serviceType)) {
        throw new apollo_server_express_1.UserInputError('Invalid service type');
    }
    // Validate dates if provided
    if (input.eventDate && !isValidISODate(input.eventDate)) {
        throw new apollo_server_express_1.UserInputError('Invalid event date format');
    }
    if (input.eventStartTime && !isValidISODate(input.eventStartTime)) {
        throw new apollo_server_express_1.UserInputError('Invalid event start time format');
    }
    if (input.eventEndTime && !isValidISODate(input.eventEndTime)) {
        throw new apollo_server_express_1.UserInputError('Invalid event end time format');
    }
    // Validate number of guests if provided
    if (input.numberOfGuests !== undefined && (input.numberOfGuests < 1 || !Number.isInteger(input.numberOfGuests))) {
        throw new apollo_server_express_1.UserInputError('Number of guests must be a positive integer');
    }
}
/**
 * Validates request visit input
 */
function validateRequestVisitInput(input) {
    // Check required fields
    if (!input.bookingId) {
        throw new apollo_server_express_1.UserInputError('Booking ID is required');
    }
    if (!input.preferredDate) {
        throw new apollo_server_express_1.UserInputError('Preferred date is required');
    }
    if (!input.preferredTime) {
        throw new apollo_server_express_1.UserInputError('Preferred time is required');
    }
    // Validate UUID
    if (!isValidUUID(input.bookingId)) {
        throw new apollo_server_express_1.UserInputError('Invalid booking ID format');
    }
    // Validate date
    if (!isValidISODate(input.preferredDate)) {
        throw new apollo_server_express_1.UserInputError('Invalid preferred date format');
    }
    // Validate time
    if (!isValidTimeFormat(input.preferredTime)) {
        throw new apollo_server_express_1.UserInputError('Invalid preferred time format (should be HH:MM)');
    }
}
/**
 * Validates schedule visit input
 */
function validateScheduleVisitInput(input) {
    // Check required fields
    if (!input.bookingId) {
        throw new apollo_server_express_1.UserInputError('Booking ID is required');
    }
    if (!input.scheduledDate) {
        throw new apollo_server_express_1.UserInputError('Scheduled date is required');
    }
    if (!input.scheduledTime) {
        throw new apollo_server_express_1.UserInputError('Scheduled time is required');
    }
    // Validate UUID
    if (!isValidUUID(input.bookingId)) {
        throw new apollo_server_express_1.UserInputError('Invalid booking ID format');
    }
    // Validate date
    if (!isValidISODate(input.scheduledDate)) {
        throw new apollo_server_express_1.UserInputError('Invalid scheduled date format');
    }
    // Validate time
    if (!isValidTimeFormat(input.scheduledTime)) {
        throw new apollo_server_express_1.UserInputError('Invalid scheduled time format (should be HH:MM)');
    }
}
/**
 * Validates update payment input
 */
function validateUpdatePaymentInput(input) {
    // Check required fields
    if (!input.bookingId) {
        throw new apollo_server_express_1.UserInputError('Booking ID is required');
    }
    // Validate UUID
    if (!isValidUUID(input.bookingId)) {
        throw new apollo_server_express_1.UserInputError('Invalid booking ID format');
    }
    // Validate amounts if provided
    if (input.advanceAmount !== undefined && input.advanceAmount <= 0) {
        throw new apollo_server_express_1.UserInputError('Advance amount must be positive');
    }
    if (input.balanceAmount !== undefined && input.balanceAmount < 0) {
        throw new apollo_server_express_1.UserInputError('Balance amount cannot be negative');
    }
    // Validate payment status if provided
    if (input.paymentStatus && !Object.values(Types_1.PaymentStatus).includes(input.paymentStatus)) {
        throw new apollo_server_express_1.UserInputError('Invalid payment status');
    }
}
/**
 * Validates cancel booking input
 */
function validateCancelBookingInput(input) {
    // Check required fields
    if (!input.bookingId) {
        throw new apollo_server_express_1.UserInputError('Booking ID is required');
    }
    if (!input.cancellationReason) {
        throw new apollo_server_express_1.UserInputError('Cancellation reason is required');
    }
    // Validate UUID
    if (!isValidUUID(input.bookingId)) {
        throw new apollo_server_express_1.UserInputError('Invalid booking ID format');
    }
    // Validate reason
    if (input.cancellationReason.trim().length < 5) {
        throw new apollo_server_express_1.UserInputError('Cancellation reason must be at least 5 characters');
    }
}
/**
 * Validates booking filters input
 */
function validateBookingFiltersInput(input) {
    // Validate status if provided
    if (input.status && !Object.values(Types_1.BookingStatus).includes(input.status)) {
        throw new apollo_server_express_1.UserInputError('Invalid booking status');
    }
    // Validate service type if provided
    if (input.serviceType && !Object.values(Types_1.ServiceType).includes(input.serviceType)) {
        throw new apollo_server_express_1.UserInputError('Invalid service type');
    }
    // Validate date range if provided
    if (input.from && !isValidISODate(input.from)) {
        throw new apollo_server_express_1.UserInputError('Invalid from date format');
    }
    if (input.to && !isValidISODate(input.to)) {
        throw new apollo_server_express_1.UserInputError('Invalid to date format');
    }
    // Validate pagination if provided
    if (input.limit !== undefined && (input.limit < 1 || !Number.isInteger(input.limit))) {
        throw new apollo_server_express_1.UserInputError('Limit must be a positive integer');
    }
    if (input.offset !== undefined && (input.offset < 0 || !Number.isInteger(input.offset))) {
        throw new apollo_server_express_1.UserInputError('Offset must be a non-negative integer');
    }
}
