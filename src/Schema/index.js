"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.voucherUsage = exports.vouchers = exports.supportResponses = exports.supportTickets = exports.reports = exports.analyticsEvents = exports.vendorPreferences = exports.userPreferences = exports.notificationReadStatus = exports.notifications = exports.adInquiries = exports.serviceInquiries = exports.chats = exports.adExecutionLogs = exports.adSchedules = exports.adTimeSlots = exports.adPayments = exports.externalAds = exports.servicesAds = exports.blogLikes = exports.blogComments = exports.blogs = exports.reviewResponses = exports.reviews = exports.serviceExpenses = exports.paymentSchedules = exports.posTransactions = exports.bookings = exports.photographyCustomOrders = exports.photographyPackages = exports.cateringCustomPackages = exports.cateringPackages = exports.farmhouseAvailability = exports.farmhouses = exports.venueAvailability = exports.venues = exports.socialAuthSettings = exports.socialAuth = exports.otps = exports.vendorReports = exports.vendors = exports.category = exports.admin = exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
/**
 * EVORGS: Event Management & Booking Platform Schema
 * This schema defines the complete data model for the EVORGS platform
 */
/* ======================== ROLE MANAGEMENT ======================== */
// USERS TABLE
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.uuid)("id").primaryKey(),
    firstName: (0, pg_core_1.varchar)("first_name", { length: 255 }).notNull(),
    lastName: (0, pg_core_1.varchar)("last_name", { length: 255 }).notNull(),
    email: (0, pg_core_1.varchar)("email", { length: 255 }).unique().notNull(),
    phone: (0, pg_core_1.varchar)("phone", { length: 20 }),
    address: (0, pg_core_1.text)("address"),
    fcmToken: (0, pg_core_1.text)("fcm_token").array(),
    passwordHash: (0, pg_core_1.text)("password_hash").notNull(),
    profileImage: (0, pg_core_1.varchar)("profile_image", { length: 255 }),
    dateOfBirth: (0, pg_core_1.timestamp)("date_of_birth"),
    gender: (0, pg_core_1.varchar)("gender", { length: 10 }).notNull().$type(),
    isVerified: (0, pg_core_1.boolean)("is_verified").default(false),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// ADMIN TABLE
exports.admin = (0, pg_core_1.pgTable)("admin", {
    id: (0, pg_core_1.uuid)("id").primaryKey(),
    firstName: (0, pg_core_1.varchar)("first_name", { length: 255 }).notNull(),
    lastName: (0, pg_core_1.varchar)("last_name", { length: 255 }).notNull(),
    email: (0, pg_core_1.varchar)("email", { length: 255 }).unique().notNull(),
    phone: (0, pg_core_1.varchar)("phone", { length: 20 }),
    passwordHash: (0, pg_core_1.text)("password_hash").notNull(),
    profileImage: (0, pg_core_1.varchar)("profile_image", { length: 255 }),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// CATEGORY TABLE
exports.category = (0, pg_core_1.pgTable)("category", {
    id: (0, pg_core_1.uuid)("id").primaryKey(),
    typeName: (0, pg_core_1.varchar)("type_name", { length: 50 }).unique().notNull(),
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// VENDORS TABLE
exports.vendors = (0, pg_core_1.pgTable)("vendors", {
    id: (0, pg_core_1.uuid)("id").primaryKey(),
    vendorName: (0, pg_core_1.varchar)("vendor_name", { length: 255 }).notNull(),
    vendorEmail: (0, pg_core_1.varchar)("vendor_email", { length: 255 }).unique().notNull(),
    vendorPhone: (0, pg_core_1.varchar)("vendor_phone", { length: 20 }),
    fcmToken: (0, pg_core_1.text)("fcm_token").array(),
    vendorAddress: (0, pg_core_1.text)("vendor_address"),
    vendorProfileDescription: (0, pg_core_1.text)("vendor_description"),
    vendorWebsite: (0, pg_core_1.varchar)("vendor_website", { length: 255 }),
    vendorSocialLinks: (0, pg_core_1.text)("vendor_social_links").array(),
    passwordHash: (0, pg_core_1.text)("password_hash").notNull(),
    profileImage: (0, pg_core_1.varchar)("profile_image", { length: 255 }),
    bannerImage: (0, pg_core_1.varchar)("banner_image", { length: 255 }),
    vendorType: (0, pg_core_1.varchar)("vendor_type", { length: 50 }).notNull().$type(),
    vendorStatus: (0, pg_core_1.varchar)("vendor_status", { length: 20 }).default("Pending").$type(),
    vendorTypeId: (0, pg_core_1.uuid)("vendor_type_id").references(() => exports.category.id, { onDelete: "set null" }),
    rating: (0, pg_core_1.decimal)("rating", { precision: 3, scale: 2 }),
    reviewCount: (0, pg_core_1.integer)("review_count").default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// VENDOR REPORT TABLE
exports.vendorReports = (0, pg_core_1.pgTable)("reports", {
    id: (0, pg_core_1.uuid)("id").primaryKey(),
    adminId: (0, pg_core_1.uuid)("admin_id").references(() => exports.admin.id, { onDelete: "cascade" }).notNull(),
    vendorId: (0, pg_core_1.uuid)("vendor_id").references(() => exports.vendors.id, { onDelete: "cascade" }).notNull(),
    reportDetails: (0, pg_core_1.text)("report_details").notNull(),
    status: (0, pg_core_1.varchar)("status", { length: 20 }).default("Open").$type(),
    resolution: (0, pg_core_1.text)("resolution"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
    resolvedAt: (0, pg_core_1.timestamp)("resolved_at"),
});
// New OTP table
exports.otps = (0, pg_core_1.pgTable)("otps", {
    id: (0, pg_core_1.uuid)("id").primaryKey(),
    userType: (0, pg_core_1.varchar)("user_type", { length: 50 }).notNull().$type(),
    userId: (0, pg_core_1.uuid)("user_id").references(() => exports.users.id, { onDelete: 'cascade' }),
    vendorId: (0, pg_core_1.uuid)("vendor_id").references(() => exports.vendors.id, { onDelete: 'cascade' }),
    adminId: (0, pg_core_1.uuid)("admin_id").references(() => exports.admin.id, { onDelete: 'cascade' }),
    email: (0, pg_core_1.varchar)("email", { length: 255 }).notNull(),
    otp: (0, pg_core_1.varchar)("otp", { length: 6 }).notNull(),
    purpose: (0, pg_core_1.varchar)("purpose", { length: 20 }).notNull().$type(),
    expiresAt: (0, pg_core_1.timestamp)("expires_at").notNull(),
    isVerified: (0, pg_core_1.boolean)("is_verified").default(false),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
/* ===================== SOCIAL AUTHENTICATION ===================== */
// SOCIAL AUTH TABLE
exports.socialAuth = (0, pg_core_1.pgTable)("social_auth", {
    id: (0, pg_core_1.uuid)("id").primaryKey(),
    // Linked user or vendor
    userId: (0, pg_core_1.uuid)("user_id").references(() => exports.users.id, { onDelete: "cascade" }),
    vendorId: (0, pg_core_1.uuid)("vendor_id").references(() => exports.vendors.id, { onDelete: "cascade" }),
    userType: (0, pg_core_1.varchar)("user_type", { length: 10 }).notNull().$type(),
    // Provider information
    provider: (0, pg_core_1.varchar)("provider", { length: 20 }).notNull().$type(),
    providerId: (0, pg_core_1.varchar)("provider_id", { length: 255 }).notNull(),
    providerEmail: (0, pg_core_1.varchar)("provider_email", { length: 255 }).notNull(),
    providerName: (0, pg_core_1.varchar)("provider_name", { length: 255 }),
    accessToken: (0, pg_core_1.text)("access_token"),
    refreshToken: (0, pg_core_1.text)("refresh_token"),
    tokenExpiry: (0, pg_core_1.timestamp)("token_expiry"),
    profileData: (0, pg_core_1.text)("profile_data"), // JSON stringified profile data
    // Metadata
    lastLogin: (0, pg_core_1.timestamp)("last_login").defaultNow(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// SOCIAL AUTH SETTINGS TABLE
exports.socialAuthSettings = (0, pg_core_1.pgTable)("social_auth_settings", {
    id: (0, pg_core_1.uuid)("id").primaryKey(),
    // Which provider this setting is for
    provider: (0, pg_core_1.varchar)("provider", { length: 20 }).unique().notNull().$type(),
    // Provider API configuration
    clientId: (0, pg_core_1.varchar)("client_id", { length: 255 }).notNull(),
    clientSecret: (0, pg_core_1.varchar)("client_secret", { length: 255 }).notNull(),
    // Provider status
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    // Metadata
    createdBy: (0, pg_core_1.uuid)("created_by").references(() => exports.admin.id, { onDelete: "set null" }).notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
/* ===================== SERVICE MANAGEMENT ===================== */
// VENUE TABLE
exports.venues = (0, pg_core_1.pgTable)("venues", {
    id: (0, pg_core_1.uuid)("id").primaryKey(),
    vendorId: (0, pg_core_1.uuid)("vendor_id").references(() => exports.vendors.id, { onDelete: "cascade" }).notNull(),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    location: (0, pg_core_1.text)("location").notNull(),
    description: (0, pg_core_1.text)("description").notNull(),
    imageUrl: (0, pg_core_1.varchar)("image_url", { length: 255 }).notNull().array(),
    price: (0, pg_core_1.varchar)("price", { length: 20 }).notNull(),
    tags: (0, pg_core_1.varchar)("tags", { length: 255 }).notNull().array(),
    amenities: (0, pg_core_1.varchar)("amenities", { length: 255 }).notNull().array(),
    minPersonLimit: (0, pg_core_1.integer)("min_person_limit").notNull(),
    maxPersonLimit: (0, pg_core_1.integer)("max_person_limit").notNull(),
    isAvailable: (0, pg_core_1.boolean)("is_available").default(true),
    rating: (0, pg_core_1.decimal)("rating", { precision: 3, scale: 2 }),
    reviewCount: (0, pg_core_1.integer)("review_count").default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// VENUE AVAILABILITY TABLE
exports.venueAvailability = (0, pg_core_1.pgTable)("venue_availability", {
    id: (0, pg_core_1.uuid)("id").primaryKey(),
    venueId: (0, pg_core_1.uuid)("venue_id").references(() => exports.venues.id, { onDelete: "cascade" }).notNull(),
    date: (0, pg_core_1.date)("date").notNull(),
    isBooked: (0, pg_core_1.boolean)("is_booked").default(false),
    bookedTimeSlots: (0, pg_core_1.varchar)("booked_time_slots", { length: 255 }).array(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// FARMHOUSE TABLE
exports.farmhouses = (0, pg_core_1.pgTable)("farmhouses", {
    id: (0, pg_core_1.uuid)("id").primaryKey(),
    vendorId: (0, pg_core_1.uuid)("vendor_id").references(() => exports.vendors.id, { onDelete: "cascade" }).notNull(),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    location: (0, pg_core_1.text)("location").notNull(),
    description: (0, pg_core_1.text)("description").notNull(),
    imageUrl: (0, pg_core_1.varchar)("image_url", { length: 255 }).notNull().array(),
    perNightPrice: (0, pg_core_1.decimal)("per_night_price", { precision: 10, scale: 2 }).notNull(),
    minNights: (0, pg_core_1.integer)("min_nights").default(1),
    maxNights: (0, pg_core_1.integer)("max_nights"),
    maxGuests: (0, pg_core_1.integer)("max_guests").notNull(),
    amenities: (0, pg_core_1.varchar)("amenities", { length: 255 }).notNull().array(),
    isAvailable: (0, pg_core_1.boolean)("is_available").default(true),
    rating: (0, pg_core_1.decimal)("rating", { precision: 3, scale: 2 }),
    reviewCount: (0, pg_core_1.integer)("review_count").default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// FARMHOUSE AVAILABILITY TABLE
exports.farmhouseAvailability = (0, pg_core_1.pgTable)("farmhouse_availability", {
    id: (0, pg_core_1.uuid)("id").primaryKey(),
    farmhouseId: (0, pg_core_1.uuid)("farmhouse_id").references(() => exports.farmhouses.id, { onDelete: "cascade" }).notNull(),
    date: (0, pg_core_1.date)("date").notNull(),
    isBooked: (0, pg_core_1.boolean)("is_booked").default(false),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// CATERING TABLE
exports.cateringPackages = (0, pg_core_1.pgTable)("catering_packages", {
    id: (0, pg_core_1.uuid)("id").primaryKey(),
    vendorId: (0, pg_core_1.uuid)("vendor_id").references(() => exports.vendors.id, { onDelete: "cascade" }).notNull(),
    packageName: (0, pg_core_1.varchar)("package_name", { length: 255 }).notNull(),
    serviceArea: (0, pg_core_1.varchar)("service_area", { length: 255 }).array().notNull(),
    description: (0, pg_core_1.text)("description").notNull(),
    imageUrl: (0, pg_core_1.varchar)("image_url", { length: 255 }).notNull().array(),
    price: (0, pg_core_1.decimal)("price", { precision: 10, scale: 2 }).notNull(),
    minGuests: (0, pg_core_1.integer)("min_guests").notNull(),
    maxGuests: (0, pg_core_1.integer)("max_guests").notNull(),
    menuItems: (0, pg_core_1.text)("menu_items").array(),
    dietaryOptions: (0, pg_core_1.varchar)("dietary_options", { length: 100 }).array(),
    amenities: (0, pg_core_1.varchar)("amenities", { length: 255 }).notNull().array(),
    isAvailable: (0, pg_core_1.boolean)("is_available").default(true),
    rating: (0, pg_core_1.decimal)("rating", { precision: 3, scale: 2 }),
    reviewCount: (0, pg_core_1.integer)("review_count").default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// CUSTOM CATERING PACKAGES TABLE
exports.cateringCustomPackages = (0, pg_core_1.pgTable)("catering_custom_packages", {
    id: (0, pg_core_1.uuid)("id").primaryKey(),
    vendorId: (0, pg_core_1.uuid)("vendor_id").references(() => exports.vendors.id, { onDelete: "cascade" }).notNull(),
    userId: (0, pg_core_1.uuid)("user_id").references(() => exports.users.id, { onDelete: "cascade" }).notNull(),
    orderDetails: (0, pg_core_1.text)("order_details").notNull(),
    guestCount: (0, pg_core_1.integer)("guest_count").notNull(),
    eventDate: (0, pg_core_1.date)("event_date"),
    price: (0, pg_core_1.decimal)("price", { precision: 10, scale: 2 }).notNull(),
    status: (0, pg_core_1.varchar)("status", { length: 20 }).default("Requested").$type(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// PHOTOGRAPHY TABLE
exports.photographyPackages = (0, pg_core_1.pgTable)("photography_packages", {
    id: (0, pg_core_1.uuid)("id").primaryKey(),
    vendorId: (0, pg_core_1.uuid)("vendor_id").references(() => exports.vendors.id, { onDelete: "cascade" }).notNull(),
    packageName: (0, pg_core_1.varchar)("package_name", { length: 255 }).notNull(),
    serviceArea: (0, pg_core_1.varchar)("service_area", { length: 255 }).array().notNull(),
    description: (0, pg_core_1.text)("description").notNull(),
    imageUrl: (0, pg_core_1.varchar)("image_url", { length: 255 }).notNull().array(),
    price: (0, pg_core_1.decimal)("price", { precision: 10, scale: 2 }).notNull(),
    duration: (0, pg_core_1.integer)("duration").notNull(), // in hours
    photographerCount: (0, pg_core_1.integer)("photographer_count").default(1),
    deliverables: (0, pg_core_1.text)("deliverables").array(),
    amenities: (0, pg_core_1.varchar)("amenities", { length: 255 }).notNull().array(),
    isAvailable: (0, pg_core_1.boolean)("is_available").default(true),
    rating: (0, pg_core_1.decimal)("rating", { precision: 3, scale: 2 }),
    reviewCount: (0, pg_core_1.integer)("review_count").default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// CUSTOM PHOTOGRAPHY ORDER TABLE
exports.photographyCustomOrders = (0, pg_core_1.pgTable)("photography_custom_orders", {
    id: (0, pg_core_1.uuid)("id").primaryKey(),
    vendorId: (0, pg_core_1.uuid)("vendor_id").references(() => exports.vendors.id, { onDelete: "cascade" }).notNull(),
    userId: (0, pg_core_1.uuid)("user_id").references(() => exports.users.id, { onDelete: "cascade" }).notNull(),
    orderDetails: (0, pg_core_1.text)("order_details").notNull(),
    eventDate: (0, pg_core_1.date)("event_date"),
    eventDuration: (0, pg_core_1.integer)("event_duration"), // in hours
    price: (0, pg_core_1.decimal)("price", { precision: 10, scale: 2 }).notNull(),
    status: (0, pg_core_1.varchar)("status", { length: 20 }).default("Requested").$type(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
/* ===================== BOOKING & PAYMENT MANAGEMENT ===================== */
// BOOKINGS TABLE
exports.bookings = (0, pg_core_1.pgTable)("bookings", {
    id: (0, pg_core_1.uuid)("id").primaryKey(),
    userId: (0, pg_core_1.uuid)("user_id").references(() => exports.users.id, { onDelete: "cascade" }).notNull(),
    vendorId: (0, pg_core_1.uuid)("vendor_id").references(() => exports.vendors.id, { onDelete: "cascade" }).notNull(),
    // Service information
    serviceType: (0, pg_core_1.varchar)("service_type", { length: 50 }).notNull().$type(),
    serviceId: (0, pg_core_1.uuid)("service_id").notNull(),
    // Event specifics
    eventDate: (0, pg_core_1.date)("event_date"),
    eventStartTime: (0, pg_core_1.timestamp)("event_start_time"),
    eventEndTime: (0, pg_core_1.timestamp)("event_end_time"),
    numberOfGuests: (0, pg_core_1.integer)("number_of_guests"),
    // Booking details
    totalAmount: (0, pg_core_1.decimal)("total_amount", { precision: 10, scale: 2 }).notNull(),
    advanceAmount: (0, pg_core_1.decimal)("advance_amount", { precision: 10, scale: 2 }),
    balanceAmount: (0, pg_core_1.decimal)("balance_amount", { precision: 10, scale: 2 }),
    // Status tracking
    status: (0, pg_core_1.varchar)("status", { length: 20 }).default("Pending").$type(),
    paymentStatus: (0, pg_core_1.varchar)("payment_status", { length: 20 }).default("Awaiting Advance").$type(),
    // Special requests
    visitRequested: (0, pg_core_1.boolean)("visit_requested").default(false),
    visitStatus: (0, pg_core_1.varchar)("visit_status", { length: 20 }).$type(),
    visitScheduledFor: (0, pg_core_1.timestamp)("visit_scheduled_for"),
    specialRequests: (0, pg_core_1.text)("special_requests"),
    // Audit trail
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
    canceledAt: (0, pg_core_1.timestamp)("canceled_at"),
    cancellationReason: (0, pg_core_1.text)("cancellation_reason"),
    // Additional tracking
    bookingReference: (0, pg_core_1.varchar)("booking_reference", { length: 50 }),
    isReviewed: (0, pg_core_1.boolean)("is_reviewed").default(false),
});
// POS TRANSACTIONS TABLE
exports.posTransactions = (0, pg_core_1.pgTable)("pos_transactions", {
    id: (0, pg_core_1.uuid)("id").primaryKey(),
    // Relations
    vendorId: (0, pg_core_1.uuid)("vendor_id").references(() => exports.vendors.id, { onDelete: "cascade" }).notNull(),
    bookingId: (0, pg_core_1.uuid)("booking_id").references(() => exports.bookings.id, { onDelete: "cascade" }).notNull(),
    userId: (0, pg_core_1.uuid)("user_id").references(() => exports.users.id, { onDelete: "cascade" }).notNull(),
    // Transaction details
    transactionNumber: (0, pg_core_1.varchar)("transaction_number", { length: 50 }).unique().notNull(),
    amount: (0, pg_core_1.decimal)("amount", { precision: 10, scale: 2 }).notNull(),
    transactionType: (0, pg_core_1.varchar)("transaction_type", { length: 20 }).notNull().$type(),
    paymentMethod: (0, pg_core_1.varchar)("payment_method", { length: 20 }).$type(),
    // Additional transaction info
    description: (0, pg_core_1.text)("description"),
    receiptNumber: (0, pg_core_1.varchar)("receipt_number", { length: 50 }),
    // External payment reference
    paymentGatewayReference: (0, pg_core_1.varchar)("payment_gateway_reference", { length: 255 }),
    // Status info
    status: (0, pg_core_1.varchar)("status", { length: 20 }).default("Completed").$type(),
    // Timestamps
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    processedAt: (0, pg_core_1.timestamp)("processed_at"),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// PAYMENT SCHEDULES TABLE
exports.paymentSchedules = (0, pg_core_1.pgTable)("payment_schedules", {
    id: (0, pg_core_1.uuid)("id").primaryKey(),
    bookingId: (0, pg_core_1.uuid)("booking_id").references(() => exports.bookings.id, { onDelete: "cascade" }).notNull(),
    dueDate: (0, pg_core_1.date)("due_date").notNull(),
    amount: (0, pg_core_1.decimal)("amount", { precision: 10, scale: 2 }).notNull(),
    description: (0, pg_core_1.varchar)("description", { length: 255 }),
    status: (0, pg_core_1.varchar)("status", { length: 20 }).default("Pending").$type(),
    reminderSent: (0, pg_core_1.boolean)("reminder_sent").default(false),
    lastReminderDate: (0, pg_core_1.date)("last_reminder_date"),
    transactionId: (0, pg_core_1.uuid)("transaction_id").references(() => exports.posTransactions.id, { onDelete: "set null" }),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// SERVICE EXPENSES TABLE
exports.serviceExpenses = (0, pg_core_1.pgTable)("service_expenses", {
    id: (0, pg_core_1.uuid)("id").primaryKey(),
    bookingId: (0, pg_core_1.uuid)("booking_id").references(() => exports.bookings.id, { onDelete: "cascade" }).notNull(),
    vendorId: (0, pg_core_1.uuid)("vendor_id").references(() => exports.vendors.id, { onDelete: "cascade" }).notNull(),
    description: (0, pg_core_1.varchar)("description", { length: 255 }).notNull(),
    amount: (0, pg_core_1.decimal)("amount", { precision: 10, scale: 2 }).notNull(),
    category: (0, pg_core_1.varchar)("category", { length: 50 }),
    receiptUrl: (0, pg_core_1.varchar)("receipt_url", { length: 255 }),
    expenseDate: (0, pg_core_1.date)("expense_date").defaultNow(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
/* ===================== REVIEW MANAGEMENT ===================== */
// REVIEWS TABLE
exports.reviews = (0, pg_core_1.pgTable)("reviews", {
    id: (0, pg_core_1.uuid)("id").primaryKey(),
    userId: (0, pg_core_1.uuid)("user_id").references(() => exports.users.id, { onDelete: "cascade" }).notNull(),
    vendorId: (0, pg_core_1.uuid)("vendor_id").references(() => exports.vendors.id, { onDelete: "cascade" }).notNull(),
    serviceType: (0, pg_core_1.varchar)("service_type", { length: 50 }).notNull().$type(),
    serviceId: (0, pg_core_1.uuid)("service_id").notNull(),
    bookingId: (0, pg_core_1.uuid)("booking_id").references(() => exports.bookings.id, { onDelete: "set null" }),
    rating: (0, pg_core_1.integer)("rating").notNull(),
    reviewText: (0, pg_core_1.text)("review_text"),
    images: (0, pg_core_1.varchar)("images", { length: 255 }).array(),
    isPublished: (0, pg_core_1.boolean)("is_published").default(true),
    isVerified: (0, pg_core_1.boolean)("is_verified").default(false),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => {
    return {
        ratingCheck: (0, pg_core_1.check)("rating_check", (0, drizzle_orm_1.sql) `${table.rating} BETWEEN 1 AND 5`)
    };
});
// VENDOR RESPONSES TO REVIEWS
exports.reviewResponses = (0, pg_core_1.pgTable)("review_responses", {
    id: (0, pg_core_1.uuid)("id").primaryKey(),
    reviewId: (0, pg_core_1.uuid)("review_id").references(() => exports.reviews.id, { onDelete: "cascade" }).notNull(),
    vendorId: (0, pg_core_1.uuid)("vendor_id").references(() => exports.vendors.id, { onDelete: "cascade" }).notNull(),
    responseText: (0, pg_core_1.text)("response_text").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
/* ===================== BLOG MANAGEMENT ===================== */
// BLOG TABLE
exports.blogs = (0, pg_core_1.pgTable)("blogs", {
    id: (0, pg_core_1.uuid)("id").primaryKey(),
    authorId: (0, pg_core_1.uuid)("author_id").notNull(),
    authorRole: (0, pg_core_1.varchar)("author_role", { length: 10 }).notNull().$type(),
    title: (0, pg_core_1.varchar)("title", { length: 255 }).notNull(),
    slug: (0, pg_core_1.varchar)("slug", { length: 255 }).unique().notNull(),
    summary: (0, pg_core_1.text)("summary"),
    content: (0, pg_core_1.text)("content").notNull(),
    featuredImage: (0, pg_core_1.varchar)("featured_image", { length: 255 }),
    tags: (0, pg_core_1.varchar)("tags", { length: 100 }).array(),
    status: (0, pg_core_1.varchar)("status", { length: 20 }).default("Published").$type(),
    viewCount: (0, pg_core_1.integer)("view_count").default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
    publishedAt: (0, pg_core_1.timestamp)("published_at"),
});
// BLOG COMMENTS TABLE
exports.blogComments = (0, pg_core_1.pgTable)("blog_comments", {
    id: (0, pg_core_1.uuid)("id").primaryKey(),
    blogId: (0, pg_core_1.uuid)("blog_id").references(() => exports.blogs.id, { onDelete: "cascade" }).notNull(),
    userId: (0, pg_core_1.uuid)("user_id").references(() => exports.users.id, { onDelete: "cascade" }).notNull(),
    comment: (0, pg_core_1.text)("comment").notNull(),
    isApproved: (0, pg_core_1.boolean)("is_approved").default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// BLOG LIKES TABLE
exports.blogLikes = (0, pg_core_1.pgTable)("blog_likes", {
    id: (0, pg_core_1.uuid)("id").primaryKey(),
    blogId: (0, pg_core_1.uuid)("blog_id").references(() => exports.blogs.id, { onDelete: "cascade" }).notNull(),
    userId: (0, pg_core_1.uuid)("user_id").references(() => exports.users.id, { onDelete: "cascade" }).notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
/* ===================== ADVERTISEMENT MANAGEMENT ===================== */
// SERVICE ADS TABLE
exports.servicesAds = (0, pg_core_1.pgTable)("service_ads", {
    id: (0, pg_core_1.uuid)("id").primaryKey(),
    vendorId: (0, pg_core_1.uuid)("vendor_id").references(() => exports.vendors.id, { onDelete: "cascade" }).notNull(),
    adType: (0, pg_core_1.varchar)("ad_type", { length: 20 }).notNull().$type(),
    entityType: (0, pg_core_1.varchar)("entity_type", { length: 20 }).notNull().$type(),
    entityId: (0, pg_core_1.uuid)("entity_id").notNull(),
    adTitle: (0, pg_core_1.varchar)("ad_title", { length: 255 }).notNull(),
    adDescription: (0, pg_core_1.text)("ad_description"),
    adImage: (0, pg_core_1.varchar)("ad_image", { length: 255 }),
    price: (0, pg_core_1.decimal)("price", { precision: 10, scale: 2 }).notNull(),
    status: (0, pg_core_1.varchar)("status", { length: 20 }).default("Pending").$type(),
    startDate: (0, pg_core_1.timestamp)("start_date"),
    endDate: (0, pg_core_1.timestamp)("end_date"),
    impressionCount: (0, pg_core_1.integer)("impression_count").default(0),
    clickCount: (0, pg_core_1.integer)("click_count").default(0),
    conversionCount: (0, pg_core_1.integer)("conversion_count").default(0),
    targetAudience: (0, pg_core_1.varchar)("target_audience", { length: 255 }).array(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// EXTERNAL ADS TABLE
exports.externalAds = (0, pg_core_1.pgTable)("external_ads", {
    id: (0, pg_core_1.uuid)("id").primaryKey(),
    advertiserName: (0, pg_core_1.varchar)("advertiser_name", { length: 255 }).notNull(),
    advertiserEmail: (0, pg_core_1.varchar)("advertiser_email", { length: 255 }).notNull(),
    advertiserPhone: (0, pg_core_1.varchar)("advertiser_phone", { length: 20 }),
    imageUrl: (0, pg_core_1.varchar)("image_url", { length: 255 }).notNull(),
    redirectUrl: (0, pg_core_1.varchar)("redirect_url", { length: 500 }).notNull(),
    adTitle: (0, pg_core_1.varchar)("ad_title", { length: 255 }).notNull(),
    adDescription: (0, pg_core_1.text)("ad_description"),
    price: (0, pg_core_1.decimal)("price", { precision: 10, scale: 2 }).notNull(),
    status: (0, pg_core_1.varchar)("status", { length: 20 }).default("Active").$type(),
    startDate: (0, pg_core_1.timestamp)("start_date"),
    endDate: (0, pg_core_1.timestamp)("end_date"),
    impressionCount: (0, pg_core_1.integer)("impression_count").default(0),
    clickCount: (0, pg_core_1.integer)("click_count").default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// AD PAYMENTS TABLE
exports.adPayments = (0, pg_core_1.pgTable)("ad_payments", {
    id: (0, pg_core_1.uuid)("id").primaryKey(),
    adId: (0, pg_core_1.uuid)("ad_id").references(() => exports.servicesAds.id, { onDelete: "cascade" }),
    externalAdId: (0, pg_core_1.uuid)("external_ad_id").references(() => exports.externalAds.id, { onDelete: "cascade" }),
    vendorId: (0, pg_core_1.uuid)("vendor_id").references(() => exports.vendors.id, { onDelete: "cascade" }),
    amountPaid: (0, pg_core_1.decimal)("amount_paid", { precision: 10, scale: 2 }).notNull(),
    paymentStatus: (0, pg_core_1.varchar)("payment_status", { length: 20 }).default("Pending").$type(),
    paymentMethod: (0, pg_core_1.varchar)("payment_method", { length: 20 }).$type(),
    transactionId: (0, pg_core_1.varchar)("transaction_id", { length: 255 }).unique(),
    paidAt: (0, pg_core_1.timestamp)("paid_at"),
    invoiceNumber: (0, pg_core_1.varchar)("invoice_number", { length: 50 }),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// AD TIME SLOTS TABLE
exports.adTimeSlots = (0, pg_core_1.pgTable)("ad_time_slots", {
    id: (0, pg_core_1.uuid)("id").primaryKey(),
    adId: (0, pg_core_1.uuid)("ad_id").references(() => exports.servicesAds.id, { onDelete: "cascade" }).notNull(),
    startTime: (0, pg_core_1.varchar)("start_time", { length: 5 }).notNull(), // Format: "HH:MM"
    endTime: (0, pg_core_1.varchar)("end_time", { length: 5 }).notNull(), // Format: "HH:MM"
    daysOfWeek: (0, pg_core_1.jsonb)("days_of_week").$type().notNull(), // [0,1,2,3,4,5,6] for Sunday-Saturday
    priority: (0, pg_core_1.integer)("priority").notNull().default(5), // 1 = highest, 5 = lowest
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// AD SCHEDULES TABLE - Tracks when ads are scheduled to run
exports.adSchedules = (0, pg_core_1.pgTable)("ad_schedules", {
    id: (0, pg_core_1.uuid)("id").primaryKey(),
    adId: (0, pg_core_1.uuid)("ad_id").references(() => exports.servicesAds.id, { onDelete: "cascade" }).notNull(),
    timeSlotId: (0, pg_core_1.uuid)("time_slot_id").references(() => exports.adTimeSlots.id, { onDelete: "cascade" }).notNull(),
    scheduledDate: (0, pg_core_1.date)("scheduled_date").notNull(),
    scheduledDateTime: (0, pg_core_1.timestamp)("scheduled_date_time").notNull(), // Combination of date + time slot
    status: (0, pg_core_1.varchar)("status", { length: 20 }).default("Scheduled").$type(),
    executedAt: (0, pg_core_1.timestamp)("executed_at"),
    completedAt: (0, pg_core_1.timestamp)("completed_at"),
    failureReason: (0, pg_core_1.text)("failure_reason"),
    retryCount: (0, pg_core_1.integer)("retry_count").default(0),
    maxRetries: (0, pg_core_1.integer)("max_retries").default(3),
    nextRetry: (0, pg_core_1.timestamp)("next_retry"),
    metadata: (0, pg_core_1.jsonb)("metadata").$type(), // Store additional scheduling info
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// AD EXECUTION LOGS TABLE - Detailed logs of ad executions
exports.adExecutionLogs = (0, pg_core_1.pgTable)("ad_execution_logs", {
    id: (0, pg_core_1.uuid)("id").primaryKey(),
    scheduleId: (0, pg_core_1.uuid)("schedule_id").references(() => exports.adSchedules.id, { onDelete: "cascade" }).notNull(),
    adId: (0, pg_core_1.uuid)("ad_id").references(() => exports.servicesAds.id, { onDelete: "cascade" }).notNull(),
    action: (0, pg_core_1.varchar)("action", { length: 50 }).notNull().$type(),
    status: (0, pg_core_1.varchar)("status", { length: 20 }).notNull().$type(),
    message: (0, pg_core_1.text)("message"),
    errorDetails: (0, pg_core_1.jsonb)("error_details").$type(),
    performanceMetrics: (0, pg_core_1.jsonb)("performance_metrics").$type(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
/* ===================== CHAT MANAGEMENT ===================== */
// CHATS TABLE
exports.chats = (0, pg_core_1.pgTable)("chats", {
    id: (0, pg_core_1.uuid)("id").primaryKey(),
    bookingId: (0, pg_core_1.uuid)("booking_id").references(() => exports.bookings.id, { onDelete: "cascade" }),
    senderId: (0, pg_core_1.uuid)("sender_id").notNull(),
    receiverId: (0, pg_core_1.uuid)("receiver_id").notNull(),
    message: (0, pg_core_1.text)("message").notNull(),
    messageType: (0, pg_core_1.varchar)("message_type", { length: 20 }).default("Text").$type(),
    parentMessageId: (0, pg_core_1.uuid)("parent_message_id"),
    attachmentUrl: (0, pg_core_1.varchar)("attachment_url", { length: 500 }),
    // Service context
    serviceType: (0, pg_core_1.varchar)("service_type", { length: 50 }).$type(),
    // Service-specific references
    venueId: (0, pg_core_1.uuid)("venue_id").references(() => exports.venues.id, { onDelete: "set null" }),
    farmhouseId: (0, pg_core_1.uuid)("farmhouse_id").references(() => exports.farmhouses.id, { onDelete: "set null" }),
    cateringPackageId: (0, pg_core_1.uuid)("catering_package_id").references(() => exports.cateringPackages.id, { onDelete: "set null" }),
    photographyPackageId: (0, pg_core_1.uuid)("photography_package_id").references(() => exports.photographyPackages.id, { onDelete: "set null" }),
    serviceAdId: (0, pg_core_1.uuid)("service_ad_id").references(() => exports.servicesAds.id, { onDelete: "set null" }),
    // Message status
    status: (0, pg_core_1.varchar)("status", { length: 20 }).default("Sent").$type(),
    sentAt: (0, pg_core_1.timestamp)("sent_at").defaultNow(),
    deliveredAt: (0, pg_core_1.timestamp)("delivered_at"),
    readAt: (0, pg_core_1.timestamp)("read_at"),
    deletedAt: (0, pg_core_1.timestamp)("deleted_at"),
});
// SERVICE INQUIRIES TABLE
exports.serviceInquiries = (0, pg_core_1.pgTable)("service_inquiries", {
    id: (0, pg_core_1.uuid)("id").primaryKey(),
    chatId: (0, pg_core_1.uuid)("chat_id").references(() => exports.chats.id, { onDelete: "cascade" }).notNull(),
    userId: (0, pg_core_1.uuid)("user_id").references(() => exports.users.id, { onDelete: "cascade" }).notNull(),
    vendorId: (0, pg_core_1.uuid)("vendor_id").references(() => exports.vendors.id, { onDelete: "cascade" }).notNull(),
    serviceType: (0, pg_core_1.varchar)("service_type", { length: 50 }).notNull().$type(),
    serviceId: (0, pg_core_1.uuid)("service_id").notNull(),
    inquiryText: (0, pg_core_1.text)("inquiry_text").notNull(),
    status: (0, pg_core_1.varchar)("status", { length: 20 }).default("Open").$type(),
    convertedToBookingId: (0, pg_core_1.uuid)("converted_to_booking_id").references(() => exports.bookings.id, { onDelete: "set null" }),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
    closedAt: (0, pg_core_1.timestamp)("closed_at"),
});
// AD INQUIRIES TABLE - Completing this table
exports.adInquiries = (0, pg_core_1.pgTable)("ad_inquiries", {
    id: (0, pg_core_1.uuid)("id").primaryKey(),
    chatId: (0, pg_core_1.uuid)("chat_id").references(() => exports.chats.id, { onDelete: "cascade" }).notNull(),
    userId: (0, pg_core_1.uuid)("user_id").references(() => exports.users.id, { onDelete: "cascade" }).notNull(),
    vendorId: (0, pg_core_1.uuid)("vendor_id").references(() => exports.vendors.id, { onDelete: "cascade" }).notNull(),
    adId: (0, pg_core_1.uuid)("ad_id").references(() => exports.servicesAds.id, { onDelete: "cascade" }).notNull(),
    inquiryText: (0, pg_core_1.text)("inquiry_text").notNull(),
    status: (0, pg_core_1.varchar)("status", { length: 20 }).default("Open").$type(),
    convertedToBookingId: (0, pg_core_1.uuid)("converted_to_booking_id").references(() => exports.bookings.id, { onDelete: "set null" }),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
    closedAt: (0, pg_core_1.timestamp)("closed_at"),
});
/* ===================== NOTIFICATION MANAGEMENT ===================== */
// NOTIFICATIONS TABLE - Simplified version
exports.notifications = (0, pg_core_1.pgTable)("notifications", {
    id: (0, pg_core_1.uuid)("id").primaryKey(),
    notificationType: (0, pg_core_1.varchar)("notification_type", { length: 30 }).notNull()
        .$type(),
    targetUserId: (0, pg_core_1.uuid)("target_user_id").references(() => exports.users.id, { onDelete: "cascade" }),
    targetVendorId: (0, pg_core_1.uuid)("target_vendor_id").references(() => exports.vendors.id, { onDelete: "cascade" }),
    title: (0, pg_core_1.varchar)("title", { length: 255 }).notNull(),
    message: (0, pg_core_1.text)("message").notNull(),
    category: (0, pg_core_1.varchar)("category", { length: 50 }).notNull()
        .$type(),
    linkTo: (0, pg_core_1.varchar)("link_to", { length: 255 }),
    relatedId: (0, pg_core_1.uuid)("related_id"),
    relatedType: (0, pg_core_1.varchar)("related_type", { length: 50 })
        .$type(),
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    priority: (0, pg_core_1.varchar)("priority", { length: 30 }).notNull().default("medium")
        .$type(),
    data: (0, pg_core_1.jsonb)("data"),
    scheduledAt: (0, pg_core_1.timestamp)("scheduled_at"),
    sentAt: (0, pg_core_1.timestamp)("sent_at"),
    totalRecipients: (0, pg_core_1.integer)("total_recipients").default(0),
    successfulSends: (0, pg_core_1.integer)("successful_sends").default(0),
    failedSends: (0, pg_core_1.integer)("failed_sends").default(0),
    createdBy: (0, pg_core_1.uuid)("created_by").references(() => exports.admin.id, { onDelete: "set null" }),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
}, (table) => {
    return {
        userPersonalCheck: (0, pg_core_1.check)("user_personal_check", (0, drizzle_orm_1.sql) `(${table.notificationType} = 'User Personal' AND ${table.targetUserId} IS NOT NULL) OR ${table.notificationType} != 'User Personal'`),
        vendorPersonalCheck: (0, pg_core_1.check)("vendor_personal_check", (0, drizzle_orm_1.sql) `(${table.notificationType} = 'Vendor Personal' AND ${table.targetVendorId} IS NOT NULL) OR ${table.notificationType} != 'Vendor Personal'`),
    };
});
// NOTIFICATION READ STATUS - Simple read tracking
exports.notificationReadStatus = (0, pg_core_1.pgTable)("notification_read_status", {
    id: (0, pg_core_1.uuid)("id").primaryKey(),
    notificationId: (0, pg_core_1.uuid)("notification_id").references(() => exports.notifications.id, { onDelete: "cascade" }).notNull(),
    // Who read it
    userId: (0, pg_core_1.uuid)("user_id").references(() => exports.users.id, { onDelete: "cascade" }),
    vendorId: (0, pg_core_1.uuid)("vendor_id").references(() => exports.vendors.id, { onDelete: "cascade" }),
    adminId: (0, pg_core_1.uuid)("admin_id").references(() => exports.admin.id, { onDelete: "cascade" }),
    // When read
    readAt: (0, pg_core_1.timestamp)("read_at").defaultNow(),
}, (table) => {
    return {
        // Prevent duplicate read entries
        uniqueRead: (0, pg_core_1.unique)("unique_notification_read").on(table.notificationId, table.userId, table.vendorId, table.adminId),
    };
});
/* ===================== SETTINGS & PREFERENCES ===================== */
// USER PREFERENCES TABLE
exports.userPreferences = (0, pg_core_1.pgTable)("user_preferences", {
    id: (0, pg_core_1.uuid)("id").primaryKey(),
    userId: (0, pg_core_1.uuid)("user_id").references(() => exports.users.id, { onDelete: "cascade" }).notNull(),
    pushNotifications: (0, pg_core_1.boolean)("push_notifications").default(true),
    emailNotifications: (0, pg_core_1.boolean)("email_notifications").default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// VENDOR PREFERENCES TABLE
exports.vendorPreferences = (0, pg_core_1.pgTable)("vendor_preferences", {
    id: (0, pg_core_1.uuid)("id").primaryKey(),
    vendorId: (0, pg_core_1.uuid)("vendor_id").references(() => exports.vendors.id, { onDelete: "cascade" }).notNull(),
    pushNotifications: (0, pg_core_1.boolean)("push_notifications").default(true),
    emailNotifications: (0, pg_core_1.boolean)("email_notifications").default(true),
    visibleInSearch: (0, pg_core_1.boolean)("visible_in_search").default(true),
    visibleReviews: (0, pg_core_1.boolean)("visible_reviews").default(true),
    workingHoursStart: (0, pg_core_1.varchar)("working_hours_start", { length: 10 }),
    workingHoursEnd: (0, pg_core_1.varchar)("working_hours_end", { length: 10 }),
    workingDays: (0, pg_core_1.varchar)("working_days", { length: 20 }).array(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
/* ===================== ANALYTICS & REPORTS ===================== */
// ANALYTICS EVENTS TABLE
exports.analyticsEvents = (0, pg_core_1.pgTable)("analytics_events", {
    id: (0, pg_core_1.uuid)("id").primaryKey(),
    eventType: (0, pg_core_1.varchar)("event_type", { length: 50 }).notNull(),
    userId: (0, pg_core_1.uuid)("user_id").references(() => exports.users.id, { onDelete: "set null" }),
    vendorId: (0, pg_core_1.uuid)("vendor_id").references(() => exports.vendors.id, { onDelete: "set null" }),
    objectId: (0, pg_core_1.uuid)("object_id"),
    objectType: (0, pg_core_1.varchar)("object_type", { length: 50 }),
    metadata: (0, pg_core_1.text)("metadata"),
    ipAddress: (0, pg_core_1.varchar)("ip_address", { length: 50 }),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// REPORTS TABLE
exports.reports = (0, pg_core_1.pgTable)("reports", {
    id: (0, pg_core_1.uuid)("id").primaryKey(),
    reportName: (0, pg_core_1.varchar)("report_name", { length: 255 }).notNull(),
    reportType: (0, pg_core_1.varchar)("report_type", { length: 50 }).notNull().$type(),
    generatedBy: (0, pg_core_1.uuid)("generated_by").references(() => exports.admin.id, { onDelete: "set null" }),
    dateRange: (0, pg_core_1.varchar)("date_range", { length: 50 }),
    parameters: (0, pg_core_1.text)("parameters"),
    reportFormat: (0, pg_core_1.varchar)("report_format", { length: 20 }).default("PDF").$type(),
    reportUrl: (0, pg_core_1.varchar)("report_url", { length: 500 }),
    status: (0, pg_core_1.varchar)("status", { length: 20 }).default("Generated").$type(),
    isScheduled: (0, pg_core_1.boolean)("is_scheduled").default(false),
    scheduleFrequency: (0, pg_core_1.varchar)("schedule_frequency", { length: 20 }).$type(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
/* ===================== SUPPORT MANAGEMENT ===================== */
// SUPPORT TICKETS TABLE
exports.supportTickets = (0, pg_core_1.pgTable)("support_tickets", {
    id: (0, pg_core_1.uuid)("id").primaryKey(),
    // Who is creating the ticket
    userId: (0, pg_core_1.uuid)("user_id").references(() => exports.users.id, { onDelete: "set null" }),
    vendorId: (0, pg_core_1.uuid)("vendor_id").references(() => exports.vendors.id, { onDelete: "set null" }),
    // Ticket details
    subject: (0, pg_core_1.varchar)("subject", { length: 255 }).notNull(),
    description: (0, pg_core_1.text)("description").notNull(),
    ticketType: (0, pg_core_1.varchar)("ticket_type", { length: 30 }).notNull().$type(),
    priority: (0, pg_core_1.varchar)("priority", { length: 20 }).default("Medium").$type(),
    status: (0, pg_core_1.varchar)("status", { length: 20 }).default("Open").$type(),
    // Attached files
    attachments: (0, pg_core_1.varchar)("attachments", { length: 500 }).array(),
    // Metadata
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
    resolvedAt: (0, pg_core_1.timestamp)("resolved_at"),
    closedAt: (0, pg_core_1.timestamp)("closed_at"),
});
// SUPPORT RESPONSES TABLE
exports.supportResponses = (0, pg_core_1.pgTable)("support_responses", {
    id: (0, pg_core_1.uuid)("id").primaryKey(),
    ticketId: (0, pg_core_1.uuid)("ticket_id").references(() => exports.supportTickets.id, { onDelete: "cascade" }).notNull(),
    // Who is responding
    adminId: (0, pg_core_1.uuid)("admin_id").references(() => exports.admin.id, { onDelete: "set null" }),
    userId: (0, pg_core_1.uuid)("user_id").references(() => exports.users.id, { onDelete: "set null" }),
    vendorId: (0, pg_core_1.uuid)("vendor_id").references(() => exports.vendors.id, { onDelete: "set null" }),
    // Response content
    responseText: (0, pg_core_1.text)("response_text").notNull(),
    attachments: (0, pg_core_1.varchar)("attachments", { length: 500 }).array(),
    isInternal: (0, pg_core_1.boolean)("is_internal").default(false), // For admin-only notes
    // Metadata
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
/* ===================== VOUCHER/COUPON MANAGEMENT SYSTEM ===================== */
// MAIN VOUCHERS TABLE
exports.vouchers = (0, pg_core_1.pgTable)("vouchers", {
    id: (0, pg_core_1.uuid)("id").primaryKey(),
    vendorId: (0, pg_core_1.uuid)("vendor_id").references(() => exports.vendors.id, { onDelete: "cascade" }).notNull(),
    // Basic info
    couponCode: (0, pg_core_1.varchar)("coupon_code", { length: 50 }).notNull(),
    title: (0, pg_core_1.varchar)("title", { length: 255 }).notNull(),
    description: (0, pg_core_1.text)("description"),
    // Discount config
    discountType: (0, pg_core_1.varchar)("discount_type", { length: 20 }).notNull().$type(),
    discountValue: (0, pg_core_1.decimal)("discount_value", { precision: 10, scale: 2 }).notNull(),
    maxDiscountAmount: (0, pg_core_1.decimal)("max_discount_amount", { precision: 10, scale: 2 }),
    minOrderValue: (0, pg_core_1.decimal)("min_order_value", { precision: 10, scale: 2 }),
    // Service targeting
    applicableFor: (0, pg_core_1.varchar)("applicable_for", { length: 20 }).notNull().$type(),
    serviceTypes: (0, pg_core_1.varchar)("service_types", { length: 50 }).array(), // ["FarmHouse", "Venue", "Catering", "Photography"]
    specificServiceIds: (0, pg_core_1.uuid)("specific_service_ids").array(),
    // Usage limits
    totalUsageLimit: (0, pg_core_1.integer)("total_usage_limit"),
    usagePerUser: (0, pg_core_1.integer)("usage_per_user").default(1),
    currentUsageCount: (0, pg_core_1.integer)("current_usage_count").default(0),
    // Validity
    validFrom: (0, pg_core_1.timestamp)("valid_from").notNull(),
    validUntil: (0, pg_core_1.timestamp)("valid_until").notNull(),
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => {
    return {
        uniqueCouponCode: (0, pg_core_1.unique)("unique_vendor_coupon").on(table.vendorId, table.couponCode),
        discountValueCheck: (0, pg_core_1.check)("discount_value_check", (0, drizzle_orm_1.sql) `${table.discountValue} > 0`),
        validDateCheck: (0, pg_core_1.check)("valid_date_check", (0, drizzle_orm_1.sql) `${table.validFrom} < ${table.validUntil}`),
    };
});
// VOUCHER USAGE TRACKING
exports.voucherUsage = (0, pg_core_1.pgTable)("voucher_usage", {
    id: (0, pg_core_1.uuid)("id").primaryKey(),
    voucherId: (0, pg_core_1.uuid)("voucher_id").references(() => exports.vouchers.id, { onDelete: "cascade" }).notNull(),
    userId: (0, pg_core_1.uuid)("user_id").references(() => exports.users.id, { onDelete: "cascade" }).notNull(),
    bookingId: (0, pg_core_1.uuid)("booking_id").references(() => exports.bookings.id, { onDelete: "cascade" }).notNull(),
    originalAmount: (0, pg_core_1.decimal)("original_amount", { precision: 10, scale: 2 }).notNull(),
    discountAmount: (0, pg_core_1.decimal)("discount_amount", { precision: 10, scale: 2 }).notNull(),
    finalAmount: (0, pg_core_1.decimal)("final_amount", { precision: 10, scale: 2 }).notNull(),
    serviceType: (0, pg_core_1.varchar)("service_type", { length: 50 }).notNull().$type(),
    serviceId: (0, pg_core_1.uuid)("service_id").notNull(),
    appliedAt: (0, pg_core_1.timestamp)("applied_at").defaultNow(),
});
