import { pgTable, uuid, varchar, text, timestamp, integer, boolean, decimal, check, date, unique, jsonb } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

/**
 * EVORGS: Event Management & Booking Platform Schema
 * This schema defines the complete data model for the EVORGS platform
 */

/* ======================== ROLE MANAGEMENT ======================== */

// USERS TABLE
export const users = pgTable("users", {
    id: uuid("id").primaryKey(),
    firstName: varchar("first_name", { length: 255 }).notNull(),
    lastName: varchar("last_name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).unique().notNull(),
    phone: varchar("phone", { length: 20 }),
    address: text("address"),
    fcmToken: text("fcm_token").array(),
    passwordHash: text("password_hash").notNull(),
    profileImage: varchar("profile_image", { length: 255 }),
    dateOfBirth: timestamp("date_of_birth"),
    gender: varchar("gender", { length: 10 }).notNull().$type<"Male" | "Female" | "Others">(),
    isVerified: boolean("is_verified").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// ADMIN TABLE
export const admin = pgTable("admin", {
    id: uuid("id").primaryKey(),
    firstName: varchar("first_name", { length: 255 }).notNull(),
    lastName: varchar("last_name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).unique().notNull(),
    phone: varchar("phone", { length: 20 }),
    passwordHash: text("password_hash").notNull(),
    profileImage: varchar("profile_image", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// CATEGORY TABLE
export const category = pgTable("category", {
    id: uuid("id").primaryKey(),
    typeName: varchar("type_name", { length: 50 }).unique().notNull(),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// VENDORS TABLE
export const vendors = pgTable("vendors", {
    id: uuid("id").primaryKey(),
    vendorName: varchar("vendor_name", { length: 255 }).notNull(),
    vendorEmail: varchar("vendor_email", { length: 255 }).unique().notNull(),
    vendorPhone: varchar("vendor_phone", { length: 20 }),
    fcmToken: text("fcm_token").array(),
    vendorAddress: text("vendor_address"),
    vendorProfileDescription: text("vendor_description"),
    vendorWebsite: varchar("vendor_website", { length: 255 }),
    vendorSocialLinks: text("vendor_social_links").array(),
    passwordHash: text("password_hash").notNull(),
    profileImage: varchar("profile_image", { length: 255 }),
    bannerImage: varchar("banner_image", { length: 255 }),
    vendorType: varchar("vendor_type", { length: 50 }).notNull().$type<"FarmHouse" | "Venue" | "Catering" | "Photography">(),
    vendorStatus: varchar("vendor_status", { length: 20 }).default("Pending").$type<"Pending" | "Approved" | "Rejected">(),    
    vendorTypeId: uuid("vendor_type_id").references(() => category.id, { onDelete: "set null" }),
    rating: decimal("rating", { precision: 3, scale: 2 }),
    reviewCount: integer("review_count").default(0),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// VENDOR REPORT TABLE
export const vendorReports = pgTable("reports", {
    id: uuid("id").primaryKey(),
    adminId: uuid("admin_id").references(() => admin.id, { onDelete: "cascade" }).notNull(),
    vendorId: uuid("vendor_id").references(() => vendors.id, { onDelete: "cascade" }).notNull(),
    reportDetails: text("report_details").notNull(),
    status: varchar("status", { length: 20 }).default("Open").$type<"Open" | "Under Review" | "Resolved" | "Dismissed">(),
    resolution: text("resolution"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    resolvedAt: timestamp("resolved_at"),
});

// New OTP table
export const otps = pgTable("otps", {
    id: uuid("id").primaryKey(),
    userType: varchar("user_type", { length: 50 }).notNull().$type<"Vendor" | "User" | "Admin">(),
    userId: uuid("user_id").references(() => users.id, { onDelete: 'cascade' }),
    vendorId: uuid("vendor_id").references(() => vendors.id, { onDelete: 'cascade' }),
    adminId: uuid("admin_id").references(() => admin.id, { onDelete: 'cascade' }),
    email: varchar("email", { length: 255 }).notNull(),
    otp: varchar("otp", { length: 6 }).notNull(),
    purpose: varchar("purpose", { length: 20 }).notNull().$type<"registration" | 'login'| "password-reset">(),
    expiresAt: timestamp("expires_at").notNull(),
    isVerified: boolean("is_verified").default(false),
    createdAt: timestamp("created_at").defaultNow(),
});

/* ===================== SOCIAL AUTHENTICATION ===================== */

// SOCIAL AUTH TABLE
export const socialAuth = pgTable("social_auth", {
    id: uuid("id").primaryKey(),
    // Linked user or vendor
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    vendorId: uuid("vendor_id").references(() => vendors.id, { onDelete: "cascade" }),
    userType: varchar("user_type", { length: 10 }).notNull().$type<"User" | "Vendor">(),
    // Provider information
    provider: varchar("provider", { length: 20 }).notNull().$type<"Google" | "Apple" | "Facebook" | "LinkedIn">(),
    providerId: varchar("provider_id", { length: 255 }).notNull(),
    providerEmail: varchar("provider_email", { length: 255 }).notNull(),
    providerName: varchar("provider_name", { length: 255 }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    tokenExpiry: timestamp("token_expiry"),
    profileData: text("profile_data"), // JSON stringified profile data
    // Metadata
    lastLogin: timestamp("last_login").defaultNow(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// SOCIAL AUTH SETTINGS TABLE
export const socialAuthSettings = pgTable("social_auth_settings", {
    id: uuid("id").primaryKey(),
    // Which provider this setting is for
    provider: varchar("provider", { length: 20 }).unique().notNull().$type<"Google" | "Apple" | "Facebook" | "LinkedIn">(),
    // Provider API configuration
    clientId: varchar("client_id", { length: 255 }).notNull(),
    clientSecret: varchar("client_secret", { length: 255 }).notNull(),
    // Provider status
    isActive: boolean("is_active").default(true),
    // Metadata
    createdBy: uuid("created_by").references(() => admin.id, { onDelete: "set null" }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

/* ===================== SERVICE MANAGEMENT ===================== */

// VENUE TABLE
export const venues = pgTable("venues", {
    id: uuid("id").primaryKey(),
    vendorId: uuid("vendor_id").references(() => vendors.id, { onDelete: "cascade" }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    location: text("location").notNull(),
    description: text("description").notNull(),
    imageUrl: varchar("image_url", { length: 255 }).notNull().array(),
    price: varchar("price", { length: 20 }).notNull(),
    tags: varchar("tags", { length: 255 }).notNull().array(),
    amenities: varchar("amenities", { length: 255 }).notNull().array(),
    minPersonLimit: integer("min_person_limit").notNull(),
    maxPersonLimit: integer("max_person_limit").notNull(),
    isAvailable: boolean("is_available").default(true),
    rating: decimal("rating", { precision: 3, scale: 2 }),
    reviewCount: integer("review_count").default(0),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// VENUE AVAILABILITY TABLE
export const venueAvailability = pgTable("venue_availability", {
    id: uuid("id").primaryKey(),
    venueId: uuid("venue_id").references(() => venues.id, { onDelete: "cascade" }).notNull(),
    date: date("date").notNull(),
    isBooked: boolean("is_booked").default(false),
    bookedTimeSlots: varchar("booked_time_slots", { length: 255 }).array(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// FARMHOUSE TABLE
export const farmhouses = pgTable("farmhouses", {
    id: uuid("id").primaryKey(),
    vendorId: uuid("vendor_id").references(() => vendors.id, { onDelete: "cascade" }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    location: text("location").notNull(),
    description: text("description").notNull(),
    imageUrl: varchar("image_url", { length: 255 }).notNull().array(),
    perNightPrice: decimal("per_night_price", { precision: 10, scale: 2 }).notNull(),
    minNights: integer("min_nights").default(1),
    maxNights: integer("max_nights"),
    maxGuests: integer("max_guests").notNull(),
    amenities: varchar("amenities", { length: 255 }).notNull().array(),
    isAvailable: boolean("is_available").default(true),
    rating: decimal("rating", { precision: 3, scale: 2 }),
    reviewCount: integer("review_count").default(0),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});
// FARMHOUSE AVAILABILITY TABLE
export const farmhouseAvailability = pgTable("farmhouse_availability", {
    id: uuid("id").primaryKey(),
    farmhouseId: uuid("farmhouse_id").references(() => farmhouses.id, { onDelete: "cascade" }).notNull(),
    date: date("date").notNull(),
    isBooked: boolean("is_booked").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// CATERING TABLE
export const cateringPackages = pgTable("catering_packages", {
    id: uuid("id").primaryKey(),
    vendorId: uuid("vendor_id").references(() => vendors.id, { onDelete: "cascade" }).notNull(),
    packageName: varchar("package_name", { length: 255 }).notNull(),
    serviceArea: varchar("service_area", { length: 255 }).array().notNull(),
    description: text("description").notNull(),
    imageUrl: varchar("image_url", { length: 255 }).notNull().array(),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    minGuests: integer("min_guests").notNull(),
    maxGuests: integer("max_guests").notNull(),
    menuItems: text("menu_items").array(),
    dietaryOptions: varchar("dietary_options", { length: 100 }).array(),
    amenities: varchar("amenities", { length: 255 }).notNull().array(),
    isAvailable: boolean("is_available").default(true),
    rating: decimal("rating", { precision: 3, scale: 2 }),
    reviewCount: integer("review_count").default(0),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// CUSTOM CATERING PACKAGES TABLE
export const cateringCustomPackages = pgTable("catering_custom_packages", {
    id: uuid("id").primaryKey(),
    vendorId: uuid("vendor_id").references(() => vendors.id, { onDelete: "cascade" }).notNull(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    orderDetails: text("order_details").notNull(),
    guestCount: integer("guest_count").notNull(),
    eventDate: date("event_date"),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    status: varchar("status", { length: 20 }).default("Requested").$type<"Requested" | "Quoted" | "Accepted" | "Rejected">(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// PHOTOGRAPHY TABLE
export const photographyPackages = pgTable("photography_packages", {
    id: uuid("id").primaryKey(),
    vendorId: uuid("vendor_id").references(() => vendors.id, { onDelete: "cascade" }).notNull(),
    packageName: varchar("package_name", { length: 255 }).notNull(),
    serviceArea: varchar("service_area", { length: 255 }).array().notNull(),
    description: text("description").notNull(),
    imageUrl: varchar("image_url", { length: 255 }).notNull().array(),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    duration: integer("duration").notNull(), // in hours
    photographerCount: integer("photographer_count").default(1),
    deliverables: text("deliverables").array(),
    amenities: varchar("amenities", { length: 255 }).notNull().array(),
    isAvailable: boolean("is_available").default(true),
    rating: decimal("rating", { precision: 3, scale: 2 }),
    reviewCount: integer("review_count").default(0),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// CUSTOM PHOTOGRAPHY ORDER TABLE
export const photographyCustomOrders = pgTable("photography_custom_orders", {
    id: uuid("id").primaryKey(),
    vendorId: uuid("vendor_id").references(() => vendors.id, { onDelete: "cascade" }).notNull(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    orderDetails: text("order_details").notNull(),
    eventDate: date("event_date"),
    eventDuration: integer("event_duration"), // in hours
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    status: varchar("status", { length: 20 }).default("Requested").$type<"Requested" | "Quoted" | "Accepted" | "Rejected">(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

/* ===================== BOOKING & PAYMENT MANAGEMENT ===================== */

// BOOKINGS TABLE
export const bookings = pgTable("bookings", {
    id: uuid("id").primaryKey(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    vendorId: uuid("vendor_id").references(() => vendors.id, { onDelete: "cascade" }).notNull(),    
    // Service information
    serviceType: varchar("service_type", { length: 50 }).notNull().$type<"FarmHouse" | "Venue" | "Catering" | "Photography">(),
    serviceId: uuid("service_id").notNull(),
    // Event specifics
    eventDate: date("event_date"),
    eventStartTime: timestamp("event_start_time"),
    eventEndTime: timestamp("event_end_time"),
    numberOfGuests: integer("number_of_guests"),
    // Booking details
    totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
    advanceAmount: decimal("advance_amount", { precision: 10, scale: 2 }),
    balanceAmount: decimal("balance_amount", { precision: 10, scale: 2 }),
    // Status tracking
    status: varchar("status", { length: 20 }).default("Pending").$type<"Pending" | "Confirmed" | "Completed" | "Canceled">(),
    paymentStatus: varchar("payment_status", { length: 20 }).default("Awaiting Advance").$type<"Awaiting Advance" | "Advance Paid" | "Partially Paid" | "Fully Paid" | "Refunded" | "Canceled">(),
    // Special requests
    visitRequested: boolean("visit_requested").default(false),
    visitStatus: varchar("visit_status", { length: 20 }).$type<"Not Requested" | "Requested" | "Scheduled" | "Completed" | null>(),
    visitScheduledFor: timestamp("visit_scheduled_for"),
    specialRequests: text("special_requests"),
    // Audit trail
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    canceledAt: timestamp("canceled_at"),
    cancellationReason: text("cancellation_reason"),
    // Additional tracking
    bookingReference: varchar("booking_reference", { length: 50 }),
    isReviewed: boolean("is_reviewed").default(false),
});

// POS TRANSACTIONS TABLE
export const posTransactions = pgTable("pos_transactions", {
    id: uuid("id").primaryKey(),
    // Relations
    vendorId: uuid("vendor_id").references(() => vendors.id, { onDelete: "cascade" }).notNull(),
    bookingId: uuid("booking_id").references(() => bookings.id, { onDelete: "cascade" }).notNull(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    // Transaction details
    transactionNumber: varchar("transaction_number", { length: 50 }).unique().notNull(),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    transactionType: varchar("transaction_type", { length: 20 }).notNull().$type<"Advance" | "Balance" | "Full Payment" | "Refund" | "Additional Service">(),
    paymentMethod: varchar("payment_method", { length: 20 }).$type<"Cash" | "Credit Card" | "Debit Card" | "Bank Transfer" | "Mobile Payment" | "Other">(),    
    // Additional transaction info
    description: text("description"),
    receiptNumber: varchar("receipt_number", { length: 50 }),
    // External payment reference
    paymentGatewayReference: varchar("payment_gateway_reference", { length: 255 }),
    // Status info
    status: varchar("status", { length: 20 }).default("Completed").$type<"Completed" | "Failed" | "Pending" | "Disputed">(),
    // Timestamps
    createdAt: timestamp("created_at").defaultNow(),
    processedAt: timestamp("processed_at"),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// PAYMENT SCHEDULES TABLE
export const paymentSchedules = pgTable("payment_schedules", {
    id: uuid("id").primaryKey(),
    bookingId: uuid("booking_id").references(() => bookings.id, { onDelete: "cascade" }).notNull(),
    dueDate: date("due_date").notNull(),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    description: varchar("description", { length: 255 }),
    status: varchar("status", { length: 20 }).default("Pending").$type<"Pending" | "Paid" | "Overdue" | "Canceled">(),
    reminderSent: boolean("reminder_sent").default(false),
    lastReminderDate: date("last_reminder_date"),
    transactionId: uuid("transaction_id").references(() => posTransactions.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// SERVICE EXPENSES TABLE
export const serviceExpenses = pgTable("service_expenses", {
    id: uuid("id").primaryKey(),
    bookingId: uuid("booking_id").references(() => bookings.id, { onDelete: "cascade" }).notNull(),
    vendorId: uuid("vendor_id").references(() => vendors.id, { onDelete: "cascade" }).notNull(),
    description: varchar("description", { length: 255 }).notNull(),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    category: varchar("category", { length: 50 }),
    receiptUrl: varchar("receipt_url", { length: 255 }),
    expenseDate: date("expense_date").defaultNow(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

/* ===================== REVIEW MANAGEMENT ===================== */

// REVIEWS TABLE
export const reviews = pgTable("reviews", {
    id: uuid("id").primaryKey(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    vendorId: uuid("vendor_id").references(() => vendors.id, { onDelete: "cascade" }).notNull(),
    serviceType: varchar("service_type", { length: 50 }).notNull().$type<"FarmHouse" | "Venue" | "CateringPackage" | "PhotographyPackage">(),
    serviceId: uuid("service_id").notNull(),
    bookingId: uuid("booking_id").references(() => bookings.id, { onDelete: "set null" }),
    rating: integer("rating").notNull(),
    reviewText: text("review_text"),
    images: varchar("images", { length: 255 }).array(),
    isPublished: boolean("is_published").default(true),
    isVerified: boolean("is_verified").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
    return {
        ratingCheck: check("rating_check", sql`${table.rating} BETWEEN 1 AND 5`)
    };
});

// VENDOR RESPONSES TO REVIEWS
export const reviewResponses = pgTable("review_responses", {
    id: uuid("id").primaryKey(),
    reviewId: uuid("review_id").references(() => reviews.id, { onDelete: "cascade" }).notNull(),
    vendorId: uuid("vendor_id").references(() => vendors.id, { onDelete: "cascade" }).notNull(),
    responseText: text("response_text").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

/* ===================== BLOG MANAGEMENT ===================== */

// BLOG TABLE
export const blogs = pgTable("blogs", {
    id: uuid("id").primaryKey(),
    authorId: uuid("author_id").notNull(),
    authorRole: varchar("author_role", { length: 10 }).notNull().$type<"Vendor" | "Admin">(),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).unique().notNull(),
    summary: text("summary"),
    content: text("content").notNull(),
    featuredImage: varchar("featured_image", { length: 255 }),
    tags: varchar("tags", { length: 100 }).array(),
    status: varchar("status", { length: 20 }).default("Published").$type<"Draft" | "Published" | "Archived">(),
    viewCount: integer("view_count").default(0),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    publishedAt: timestamp("published_at"),
});

// BLOG COMMENTS TABLE
export const blogComments = pgTable("blog_comments", {
    id: uuid("id").primaryKey(),
    blogId: uuid("blog_id").references(() => blogs.id, { onDelete: "cascade" }).notNull(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    comment: text("comment").notNull(),
    isApproved: boolean("is_approved").default(true),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// BLOG LIKES TABLE
export const blogLikes = pgTable("blog_likes", {
    id: uuid("id").primaryKey(),
    blogId: uuid("blog_id").references(() => blogs.id, { onDelete: "cascade" }).notNull(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});

/* ===================== ADVERTISEMENT MANAGEMENT ===================== */

// SERVICE ADS TABLE
export const servicesAds = pgTable("service_ads", {
    id: uuid("id").primaryKey(),
    vendorId: uuid("vendor_id").references(() => vendors.id, { onDelete: "cascade" }).notNull(),
    adType: varchar("ad_type", { length: 20 }).notNull().$type<"Featured" | "Sponsored" | "Premium">(),
    entityType: varchar("entity_type", { length: 20 }).notNull().$type<"Farmhouse" | "Venue" | "Photography Package" | "Catering Package">(),
    entityId: uuid("entity_id").notNull(),
    adTitle: varchar("ad_title", { length: 255 }).notNull(),
    adDescription: text("ad_description"),
    adImage: varchar("ad_image", { length: 255 }),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    status: varchar("status", { length: 20 }).default("Pending").$type<"Pending" | "Approved" | "Rejected" | "Active" | "Expired">(),
    startDate: timestamp("start_date"),
    endDate: timestamp("end_date"),
    impressionCount: integer("impression_count").default(0),
    clickCount: integer("click_count").default(0),
    conversionCount: integer("conversion_count").default(0),
    targetAudience: varchar("target_audience", { length: 255 }).array(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// EXTERNAL ADS TABLE
export const externalAds = pgTable("external_ads", {
    id: uuid("id").primaryKey(),
    advertiserName: varchar("advertiser_name", { length: 255 }).notNull(),
    advertiserEmail: varchar("advertiser_email", { length: 255 }).notNull(),
    advertiserPhone: varchar("advertiser_phone", { length: 20 }),
    imageUrl: varchar("image_url", { length: 255 }).notNull(),
    redirectUrl: varchar("redirect_url", { length: 500 }).notNull(),
    adTitle: varchar("ad_title", { length: 255 }).notNull(),
    adDescription: text("ad_description"),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    status: varchar("status", { length: 20 }).default("Active").$type<"Active" | "Inactive" | "Expired">(),
    startDate: timestamp("start_date"),
    endDate: timestamp("end_date"),
    impressionCount: integer("impression_count").default(0),
    clickCount: integer("click_count").default(0),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// AD PAYMENTS TABLE
export const adPayments = pgTable("ad_payments", {
    id: uuid("id").primaryKey(),
    adId: uuid("ad_id").references(() => servicesAds.id, { onDelete: "cascade" }),
    externalAdId: uuid("external_ad_id").references(() => externalAds.id, { onDelete: "cascade" }),
    vendorId: uuid("vendor_id").references(() => vendors.id, { onDelete: "cascade" }),
    amountPaid: decimal("amount_paid", { precision: 10, scale: 2 }).notNull(),
    paymentStatus: varchar("payment_status", { length: 20 }).default("Pending").$type<"Pending" | "Paid" | "Failed" | "Refunded">(),
    paymentMethod: varchar("payment_method", { length: 20 }).$type<"Credit Card" | "Debit Card" | "Bank Transfer" | "Mobile Payment" | "Other">(),
    transactionId: varchar("transaction_id", { length: 255 }).unique(),
    paidAt: timestamp("paid_at"),
    invoiceNumber: varchar("invoice_number", { length: 50 }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

/* ===================== CHAT MANAGEMENT ===================== */

// CHATS TABLE
export const chats = pgTable("chats", {
    id: uuid("id").primaryKey(),
    bookingId: uuid("booking_id").references(() => bookings.id, { onDelete: "cascade" }),
    senderId: uuid("sender_id").notNull(),
    receiverId: uuid("receiver_id").notNull(),
    message: text("message").notNull(),
    messageType: varchar("message_type", { length: 20 }).default("Text").$type<"Text" | "Image" | "File" | "Location">(),
    parentMessageId: uuid("parent_message_id"),
    attachmentUrl: varchar("attachment_url", { length: 500 }),
    // Service context
    serviceType: varchar("service_type", { length: 50 }).$type<"Venue" | "Farmhouse" | "CateringPackage" | "PhotographyPackage" | "Advertisement" | null>(),
    // Service-specific references
    venueId: uuid("venue_id").references(() => venues.id, { onDelete: "set null" }),
    farmhouseId: uuid("farmhouse_id").references(() => farmhouses.id, { onDelete: "set null" }),
    cateringPackageId: uuid("catering_package_id").references(() => cateringPackages.id, { onDelete: "set null" }),
    photographyPackageId: uuid("photography_package_id").references(() => photographyPackages.id, { onDelete: "set null" }),
    serviceAdId: uuid("service_ad_id").references(() => servicesAds.id, { onDelete: "set null" }),
    // Message status
    status: varchar("status", { length: 20 }).default("Sent").$type<"Sent" | "Delivered" | "Read" | "Deleted">(),
    sentAt: timestamp("sent_at").defaultNow(),
    deliveredAt: timestamp("delivered_at"),
    readAt: timestamp("read_at"),
    deletedAt: timestamp("deleted_at"),
});

// SERVICE INQUIRIES TABLE
export const serviceInquiries = pgTable("service_inquiries", {
    id: uuid("id").primaryKey(),
    chatId: uuid("chat_id").references(() => chats.id, { onDelete: "cascade" }).notNull(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    vendorId: uuid("vendor_id").references(() => vendors.id, { onDelete: "cascade" }).notNull(),
    serviceType: varchar("service_type", { length: 50 }).notNull().$type<"Venue" | "Farmhouse" | "CateringPackage" | "PhotographyPackage">(),
    serviceId: uuid("service_id").notNull(),
    inquiryText: text("inquiry_text").notNull(),
    status: varchar("status", { length: 20 }).default("Open").$type<"Open" | "Answered" | "Converted" | "Closed">(),
    convertedToBookingId: uuid("converted_to_booking_id").references(() => bookings.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    closedAt: timestamp("closed_at"),
});

// AD INQUIRIES TABLE - Completing this table
export const adInquiries = pgTable("ad_inquiries", {
    id: uuid("id").primaryKey(),
    chatId: uuid("chat_id").references(() => chats.id, { onDelete: "cascade" }).notNull(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    vendorId: uuid("vendor_id").references(() => vendors.id, { onDelete: "cascade" }).notNull(),
    adId: uuid("ad_id").references(() => servicesAds.id, { onDelete: "cascade" }).notNull(),
    inquiryText: text("inquiry_text").notNull(),
    status: varchar("status", { length: 20 }).default("Open").$type<"Open" | "Answered" | "Converted" | "Closed">(),
    convertedToBookingId: uuid("converted_to_booking_id").references(() => bookings.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    closedAt: timestamp("closed_at"),
});

/* ===================== NOTIFICATION MANAGEMENT ===================== */

// NOTIFICATIONS TABLE - Simplified version
export const notifications = pgTable("notifications", {
    id: uuid("id").primaryKey(),
    notificationType: varchar("notification_type", { length: 30 }).notNull()
        .$type<"General" | "All Vendors" | "Vendor Personal" | "All Users" | "User Personal">(),
    targetUserId: uuid("target_user_id").references(() => users.id, { onDelete: "cascade" }),
    targetVendorId: uuid("target_vendor_id").references(() => vendors.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }).notNull(),
    message: text("message").notNull(),
    category: varchar("category", { length: 50 }).notNull()
        .$type<"Booking" | "Payment" | "System" | "Chat" | "Promotion">(),
    linkTo: varchar("link_to", { length: 255 }),
    relatedId: uuid("related_id"),
    relatedType: varchar("related_type", { length: 50 })
        .$type<"Booking" | "Payment" | "Chat" | "Review">(),
    isActive: boolean("is_active").default(true),
    priority: varchar("priority", { length: 30 }).notNull().default("medium")
        .$type<"low" | "medium" | "high" | "urgent">(),
    data: jsonb("data"),
    scheduledAt: timestamp("scheduled_at"),
    sentAt: timestamp("sent_at"),
    totalRecipients: integer("total_recipients").default(0),
    successfulSends: integer("successful_sends").default(0),
    failedSends: integer("failed_sends").default(0),
    createdBy: uuid("created_by").references(() => admin.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => {
    return {
        userPersonalCheck: check("user_personal_check",
            sql`(${table.notificationType} = 'User Personal' AND ${table.targetUserId} IS NOT NULL) OR ${table.notificationType} != 'User Personal'`),
        vendorPersonalCheck: check("vendor_personal_check",
            sql`(${table.notificationType} = 'Vendor Personal' AND ${table.targetVendorId} IS NOT NULL) OR ${table.notificationType} != 'Vendor Personal'`),
    };
});
// NOTIFICATION READ STATUS - Simple read tracking
export const notificationReadStatus = pgTable("notification_read_status", {
    id: uuid("id").primaryKey(),
    notificationId: uuid("notification_id").references(() => notifications.id, { onDelete: "cascade" }).notNull(),
    
    // Who read it
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    vendorId: uuid("vendor_id").references(() => vendors.id, { onDelete: "cascade" }),
    adminId: uuid("admin_id").references(() => admin.id, { onDelete: "cascade" }),
    
    // When read
    readAt: timestamp("read_at").defaultNow(),
}, (table) => {
    return {
        // Prevent duplicate read entries
        uniqueRead: unique("unique_notification_read").on(
            table.notificationId, 
            table.userId, 
            table.vendorId, 
            table.adminId
        ),
    };
});

/* ===================== SETTINGS & PREFERENCES ===================== */

// USER PREFERENCES TABLE
export const userPreferences = pgTable("user_preferences", {
    id: uuid("id").primaryKey(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    pushNotifications: boolean("push_notifications").default(true),
    emailNotifications: boolean("email_notifications").default(true),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// VENDOR PREFERENCES TABLE
export const vendorPreferences = pgTable("vendor_preferences", {
    id: uuid("id").primaryKey(),
    vendorId: uuid("vendor_id").references(() => vendors.id, { onDelete: "cascade" }).notNull(),
    pushNotifications: boolean("push_notifications").default(true),
    emailNotifications: boolean("email_notifications").default(true),
    visibleInSearch: boolean("visible_in_search").default(true),
    visibleReviews: boolean("visible_reviews").default(true),
    workingHoursStart: varchar("working_hours_start", { length: 10 }),
    workingHoursEnd: varchar("working_hours_end", { length: 10 }),
    workingDays: varchar("working_days", { length: 20 }).array(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

/* ===================== ANALYTICS & REPORTS ===================== */

// ANALYTICS EVENTS TABLE
export const analyticsEvents = pgTable("analytics_events", {
    id: uuid("id").primaryKey(),
    eventType: varchar("event_type", { length: 50 }).notNull(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    vendorId: uuid("vendor_id").references(() => vendors.id, { onDelete: "set null" }),
    objectId: uuid("object_id"),
    objectType: varchar("object_type", { length: 50 }),
    metadata: text("metadata"),
    ipAddress: varchar("ip_address", { length: 50 }),
    createdAt: timestamp("created_at").defaultNow(),
});

// REPORTS TABLE
export const reports = pgTable("reports", {
    id: uuid("id").primaryKey(),
    reportName: varchar("report_name", { length: 255 }).notNull(),
    reportType: varchar("report_type", { length: 50 }).notNull().$type<"System" | "Vendor" | "Revenue" | "Booking" | "Custom">(),
    generatedBy: uuid("generated_by").references(() => admin.id, { onDelete: "set null" }),
    dateRange: varchar("date_range", { length: 50 }),
    parameters: text("parameters"),
    reportFormat: varchar("report_format", { length: 20 }).default("PDF").$type<"PDF" | "CSV" | "Excel" | "JSON">(),
    reportUrl: varchar("report_url", { length: 500 }),
    status: varchar("status", { length: 20 }).default("Generated").$type<"Generating" | "Generated" | "Failed">(),
    isScheduled: boolean("is_scheduled").default(false),
    scheduleFrequency: varchar("schedule_frequency", { length: 20 }).$type<"Daily" | "Weekly" | "Monthly" | "Quarterly">(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});


/* ===================== SUPPORT MANAGEMENT ===================== */

// SUPPORT TICKETS TABLE
export const supportTickets = pgTable("support_tickets", {
    id: uuid("id").primaryKey(),
    // Who is creating the ticket
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    vendorId: uuid("vendor_id").references(() => vendors.id, { onDelete: "set null" }),
    // Ticket details
    subject: varchar("subject", { length: 255 }).notNull(),
    description: text("description").notNull(),
    ticketType: varchar("ticket_type", { length: 30 }).notNull().$type<"Account" | "Booking" | "Payment" | "Technical" | "Feature" | "Other">(),
    priority: varchar("priority", { length: 20 }).default("Medium").$type<"Low" | "Medium" | "High" | "Urgent">(),
    status: varchar("status", { length: 20 }).default("Open").$type<"Open" | "In Progress" | "Resolved" | "Closed" | "Reopened">(),
    // Attached files
    attachments: varchar("attachments", { length: 500 }).array(),
    // Metadata
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    resolvedAt: timestamp("resolved_at"),
    closedAt: timestamp("closed_at"),
});

// SUPPORT RESPONSES TABLE
export const supportResponses = pgTable("support_responses", {
    id: uuid("id").primaryKey(),
    ticketId: uuid("ticket_id").references(() => supportTickets.id, { onDelete: "cascade" }).notNull(),
    // Who is responding
    adminId: uuid("admin_id").references(() => admin.id, { onDelete: "set null" }),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    vendorId: uuid("vendor_id").references(() => vendors.id, { onDelete: "set null" }),
    // Response content
    responseText: text("response_text").notNull(),
    attachments: varchar("attachments", { length: 500 }).array(),
    isInternal: boolean("is_internal").default(false), // For admin-only notes
    // Metadata
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

/* ===================== VOUCHER/COUPON MANAGEMENT SYSTEM ===================== */

// MAIN VOUCHERS TABLE
export const vouchers = pgTable("vouchers", {
    id: uuid("id").primaryKey(),
    vendorId: uuid("vendor_id").references(() => vendors.id, { onDelete: "cascade" }).notNull(),
    
    // Basic info
    couponCode: varchar("coupon_code", { length: 50 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    
    // Discount config
    discountType: varchar("discount_type", { length: 20 }).notNull().$type<"Percentage" | "Fixed Amount">(),
    discountValue: decimal("discount_value", { precision: 10, scale: 2 }).notNull(),
    maxDiscountAmount: decimal("max_discount_amount", { precision: 10, scale: 2 }),
    minOrderValue: decimal("min_order_value", { precision: 10, scale: 2 }),
    
    // Service targeting
    applicableFor: varchar("applicable_for", { length: 20 }).notNull().$type<"All Services" | "Specific Services">(),
    serviceTypes: varchar("service_types", { length: 50 }).array(), // ["FarmHouse", "Venue", "Catering", "Photography"]
    specificServiceIds: uuid("specific_service_ids").array(),
    
    // Usage limits
    totalUsageLimit: integer("total_usage_limit"),
    usagePerUser: integer("usage_per_user").default(1),
    currentUsageCount: integer("current_usage_count").default(0),
    
    // Validity
    validFrom: timestamp("valid_from").notNull(),
    validUntil: timestamp("valid_until").notNull(),
    isActive: boolean("is_active").default(true),
    
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
    return {
        uniqueCouponCode: unique("unique_vendor_coupon").on(table.vendorId, table.couponCode),
        discountValueCheck: check("discount_value_check", sql`${table.discountValue} > 0`),
        validDateCheck: check("valid_date_check", sql`${table.validFrom} < ${table.validUntil}`),
    };
});

// VOUCHER USAGE TRACKING
export const voucherUsage = pgTable("voucher_usage", {
    id: uuid("id").primaryKey(),
    voucherId: uuid("voucher_id").references(() => vouchers.id, { onDelete: "cascade" }).notNull(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    bookingId: uuid("booking_id").references(() => bookings.id, { onDelete: "cascade" }).notNull(),
    
    originalAmount: decimal("original_amount", { precision: 10, scale: 2 }).notNull(),
    discountAmount: decimal("discount_amount", { precision: 10, scale: 2 }).notNull(),
    finalAmount: decimal("final_amount", { precision: 10, scale: 2 }).notNull(),
    
    serviceType: varchar("service_type", { length: 50 }).notNull().$type<"FarmHouse" | "Venue" | "Catering" | "Photography">(),
    serviceId: uuid("service_id").notNull(),
    
    appliedAt: timestamp("applied_at").defaultNow(),
});

