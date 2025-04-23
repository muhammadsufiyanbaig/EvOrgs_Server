CREATE TABLE "ad_inquiries" (
	"id" uuid PRIMARY KEY NOT NULL,
	"chat_id" uuid NOT NULL,
	"ad_id" uuid NOT NULL,
	"status" varchar(20) DEFAULT 'Open',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ad_payments" (
	"id" uuid PRIMARY KEY NOT NULL,
	"ad_id" uuid NOT NULL,
	"vendor_id" uuid NOT NULL,
	"amount_paid" numeric(10, 2) NOT NULL,
	"payment_status" varchar(20) DEFAULT 'Pending',
	"transaction_id" varchar(255),
	"paid_at" timestamp,
	CONSTRAINT "ad_payments_transaction_id_unique" UNIQUE("transaction_id")
);
--> statement-breakpoint
CREATE TABLE "admin" (
	"id" uuid PRIMARY KEY NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(20),
	"password_hash" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "admin_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"id" uuid PRIMARY KEY NOT NULL,
	"admin_id" uuid NOT NULL,
	"vendor_id" uuid NOT NULL,
	"report_details" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "blog_comments" (
	"id" uuid PRIMARY KEY NOT NULL,
	"blog_id" uuid,
	"user_id" uuid,
	"comment" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "blog_likes" (
	"id" uuid PRIMARY KEY NOT NULL,
	"blog_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "blogs" (
	"id" uuid PRIMARY KEY NOT NULL,
	"author_id" uuid NOT NULL,
	"author_role" varchar(10) NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"vendor_id" uuid NOT NULL,
	"service_type" varchar(50) NOT NULL,
	"service_id" uuid NOT NULL,
	"event_date" date,
	"event_start_time" timestamp,
	"event_end_time" timestamp,
	"number_of_guests" integer,
	"total_amount" numeric(10, 2) NOT NULL,
	"advance_amount" numeric(10, 2),
	"balance_amount" numeric(10, 2),
	"receipt_id" varchar(50),
	"status" varchar(20) DEFAULT 'Pending',
	"payment_status" varchar(20) DEFAULT 'Awaiting Advance',
	"visit_requested" boolean DEFAULT false,
	"visit_request_id" varchar(50),
	"visit_status" varchar(20),
	"visit_scheduled_for" timestamp,
	"special_requests" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"canceled_at" timestamp,
	"cancellation_reason" text,
	CONSTRAINT "bookings_receipt_id_unique" UNIQUE("receipt_id"),
	CONSTRAINT "bookings_visit_request_id_unique" UNIQUE("visit_request_id")
);
--> statement-breakpoint
CREATE TABLE "category" (
	"id" uuid PRIMARY KEY NOT NULL,
	"type_name" varchar(50) NOT NULL,
	CONSTRAINT "category_type_name_unique" UNIQUE("type_name")
);
--> statement-breakpoint
CREATE TABLE "catering_custom_packages" (
	"id" uuid PRIMARY KEY NOT NULL,
	"vendor_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"order_details" text NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "catering_packages" (
	"id" uuid PRIMARY KEY NOT NULL,
	"vendor_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"service_area" varchar(255)[] NOT NULL,
	"description" text NOT NULL,
	"image_url" varchar(255)[],
	"price" numeric(10, 2) NOT NULL,
	"amenities" varchar(255)[],
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "chat_blocks" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"blocked_user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "chats" (
	"id" uuid PRIMARY KEY NOT NULL,
	"booking_id" uuid,
	"sender_id" uuid NOT NULL,
	"receiver_id" uuid NOT NULL,
	"message" text NOT NULL,
	"message_type" varchar(20) DEFAULT 'Text',
	"parent_message_id" uuid,
	"attachment_url" varchar(500),
	"service_type" varchar(50),
	"venue_id" uuid,
	"farmhouse_id" uuid,
	"catering_package_id" uuid,
	"photography_package_id" uuid,
	"service_ad_id" uuid,
	"status" varchar(20) DEFAULT 'Sent',
	"sent_at" timestamp DEFAULT now(),
	"delivered_at" timestamp,
	"read_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "external_ads" (
	"id" uuid PRIMARY KEY NOT NULL,
	"image_url" varchar(255) NOT NULL,
	"redirect_url" varchar(500) NOT NULL,
	"status" varchar(20) DEFAULT 'Active',
	"start_date" timestamp DEFAULT now(),
	"end_date" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "farmhouses" (
	"id" uuid PRIMARY KEY NOT NULL,
	"vendor_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"location" text NOT NULL,
	"description" text NOT NULL,
	"image_url" varchar(255)[],
	"per_night_price" numeric(10, 2) NOT NULL,
	"amenities" varchar(255)[],
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "notification_settings" (
	"id" uuid PRIMARY KEY NOT NULL,
	"entity_type" varchar(10) NOT NULL,
	"entity_id" uuid NOT NULL,
	"email_enabled" boolean DEFAULT true,
	"push_enabled" boolean DEFAULT true,
	"in_app_enabled" boolean DEFAULT true,
	"general_notifications" boolean DEFAULT true,
	"booking_notifications" boolean DEFAULT true,
	"payment_notifications" boolean DEFAULT true,
	"ad_notifications" boolean DEFAULT true,
	"pos_notifications" boolean DEFAULT true,
	"chat_notifications" boolean DEFAULT true,
	"blog_notifications" boolean DEFAULT true,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY NOT NULL,
	"type" varchar(50) NOT NULL,
	"title" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"is_all_users" boolean DEFAULT false,
	"is_all_vendors" boolean DEFAULT false,
	"user_id" uuid,
	"vendor_id" uuid,
	"booking_id" uuid,
	"payment_id" uuid,
	"ad_id" uuid,
	"blog_id" uuid,
	"chat_id" uuid,
	"is_read" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"read_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "payment_schedules" (
	"id" uuid PRIMARY KEY NOT NULL,
	"booking_id" uuid NOT NULL,
	"due_date" date NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"description" varchar(255),
	"status" varchar(20) DEFAULT 'Pending',
	"reminder_sent" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "photography_custom_orders" (
	"id" uuid PRIMARY KEY NOT NULL,
	"vendor_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"order_details" text NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "photography_packages" (
	"id" uuid PRIMARY KEY NOT NULL,
	"vendor_id" uuid NOT NULL,
	"package_name" varchar(255) NOT NULL,
	"service_area" varchar(255)[] NOT NULL,
	"description" text NOT NULL,
	"image_url" varchar(255)[],
	"price" numeric(10, 2) NOT NULL,
	"amenities" varchar(255)[],
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pos_transactions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"vendor_id" uuid NOT NULL,
	"booking_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"transaction_number" varchar(50) NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"transaction_type" varchar(20) NOT NULL,
	"payment_method" varchar(20),
	"description" text,
	"receipt_number" varchar(50),
	"payment_gateway_reference" varchar(255),
	"status" varchar(20) DEFAULT 'Completed',
	"created_at" timestamp DEFAULT now(),
	"processed_at" timestamp,
	CONSTRAINT "pos_transactions_transaction_number_unique" UNIQUE("transaction_number")
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"vendor_id" uuid,
	"service_type" varchar(50) NOT NULL,
	"service_id" uuid NOT NULL,
	"rating" integer NOT NULL,
	"review_text" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "rating_check" CHECK ("reviews"."rating" BETWEEN 1 AND 5)
);
--> statement-breakpoint
CREATE TABLE "service_expenses" (
	"id" uuid PRIMARY KEY NOT NULL,
	"booking_id" uuid NOT NULL,
	"vendor_id" uuid NOT NULL,
	"description" varchar(255) NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"category" varchar(50),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "service_inquiries" (
	"id" uuid PRIMARY KEY NOT NULL,
	"chat_id" uuid NOT NULL,
	"service_type" varchar(50) NOT NULL,
	"service_id" uuid NOT NULL,
	"status" varchar(20) DEFAULT 'Open',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ads" (
	"id" uuid PRIMARY KEY NOT NULL,
	"vendor_id" uuid,
	"ad_type" varchar(20) NOT NULL,
	"entity_type" varchar(20) NOT NULL,
	"entity_id" uuid NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"status" varchar(20) DEFAULT 'Pending',
	"start_date" timestamp DEFAULT now(),
	"end_date" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(20),
	"address" text,
	"fcm_token" text[],
	"password_hash" text NOT NULL,
	"profile_image" varchar(255),
	"date_of_birth" timestamp,
	"gender" varchar(10) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "vendors" (
	"id" uuid PRIMARY KEY NOT NULL,
	"vendor_name" varchar(255) NOT NULL,
	"vendor_email" varchar(255) NOT NULL,
	"vendor_phone" varchar(20),
	"fcm_token" text[],
	"vendor_address" text,
	"vendor_description" text,
	"vendor_website" varchar(255),
	"vendor_social_links" text[],
	"password_hash" text NOT NULL,
	"profile_image" varchar(255),
	"banner_image" varchar(255),
	"vendor_type" varchar(50) NOT NULL,
	"vendor_status" varchar(20) DEFAULT 'Pending',
	"vendor_type_id" uuid,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "vendors_vendor_email_unique" UNIQUE("vendor_email")
);
--> statement-breakpoint
CREATE TABLE "venues" (
	"id" uuid PRIMARY KEY NOT NULL,
	"vendor_id" uuid,
	"name" varchar(255) NOT NULL,
	"location" text NOT NULL,
	"description" text NOT NULL,
	"image_url" varchar(255)[],
	"price" varchar(20) NOT NULL,
	"tags" varchar(255)[],
	"amenities" varchar(255)[],
	"min_person_limit" integer NOT NULL,
	"max_person_limit" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "ad_inquiries" ADD CONSTRAINT "ad_inquiries_chat_id_chats_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."chats"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ad_inquiries" ADD CONSTRAINT "ad_inquiries_ad_id_ads_id_fk" FOREIGN KEY ("ad_id") REFERENCES "public"."ads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ad_payments" ADD CONSTRAINT "ad_payments_ad_id_ads_id_fk" FOREIGN KEY ("ad_id") REFERENCES "public"."ads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ad_payments" ADD CONSTRAINT "ad_payments_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_admin_id_admin_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."admin"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_comments" ADD CONSTRAINT "blog_comments_blog_id_blogs_id_fk" FOREIGN KEY ("blog_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_comments" ADD CONSTRAINT "blog_comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_likes" ADD CONSTRAINT "blog_likes_blog_id_blogs_id_fk" FOREIGN KEY ("blog_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_likes" ADD CONSTRAINT "blog_likes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catering_custom_packages" ADD CONSTRAINT "catering_custom_packages_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catering_custom_packages" ADD CONSTRAINT "catering_custom_packages_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catering_packages" ADD CONSTRAINT "catering_packages_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_blocks" ADD CONSTRAINT "chat_blocks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_blocks" ADD CONSTRAINT "chat_blocks_blocked_user_id_users_id_fk" FOREIGN KEY ("blocked_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chats" ADD CONSTRAINT "chats_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chats" ADD CONSTRAINT "chats_venue_id_venues_id_fk" FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chats" ADD CONSTRAINT "chats_farmhouse_id_farmhouses_id_fk" FOREIGN KEY ("farmhouse_id") REFERENCES "public"."farmhouses"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chats" ADD CONSTRAINT "chats_catering_package_id_catering_packages_id_fk" FOREIGN KEY ("catering_package_id") REFERENCES "public"."catering_packages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chats" ADD CONSTRAINT "chats_photography_package_id_photography_packages_id_fk" FOREIGN KEY ("photography_package_id") REFERENCES "public"."photography_packages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chats" ADD CONSTRAINT "chats_service_ad_id_ads_id_fk" FOREIGN KEY ("service_ad_id") REFERENCES "public"."ads"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "farmhouses" ADD CONSTRAINT "farmhouses_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_ad_id_ads_id_fk" FOREIGN KEY ("ad_id") REFERENCES "public"."ads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_blog_id_blogs_id_fk" FOREIGN KEY ("blog_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_chat_id_chats_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."chats"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_schedules" ADD CONSTRAINT "payment_schedules_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "photography_custom_orders" ADD CONSTRAINT "photography_custom_orders_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "photography_custom_orders" ADD CONSTRAINT "photography_custom_orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "photography_packages" ADD CONSTRAINT "photography_packages_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pos_transactions" ADD CONSTRAINT "pos_transactions_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pos_transactions" ADD CONSTRAINT "pos_transactions_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pos_transactions" ADD CONSTRAINT "pos_transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_expenses" ADD CONSTRAINT "service_expenses_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_expenses" ADD CONSTRAINT "service_expenses_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_inquiries" ADD CONSTRAINT "service_inquiries_chat_id_chats_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."chats"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ads" ADD CONSTRAINT "ads_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendors" ADD CONSTRAINT "vendors_vendor_type_id_category_id_fk" FOREIGN KEY ("vendor_type_id") REFERENCES "public"."category"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "venues" ADD CONSTRAINT "venues_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;