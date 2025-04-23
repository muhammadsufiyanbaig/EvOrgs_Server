CREATE TABLE "analytics_events" (
	"id" uuid PRIMARY KEY NOT NULL,
	"event_type" varchar(50) NOT NULL,
	"user_id" uuid,
	"vendor_id" uuid,
	"object_id" uuid,
	"object_type" varchar(50),
	"metadata" text,
	"ip_address" varchar(50),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "farmhouse_availability" (
	"id" uuid PRIMARY KEY NOT NULL,
	"farmhouse_id" uuid NOT NULL,
	"date" date NOT NULL,
	"is_booked" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "review_responses" (
	"id" uuid PRIMARY KEY NOT NULL,
	"review_id" uuid NOT NULL,
	"vendor_id" uuid NOT NULL,
	"response_text" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "service_ads" (
	"id" uuid PRIMARY KEY NOT NULL,
	"vendor_id" uuid NOT NULL,
	"ad_type" varchar(20) NOT NULL,
	"entity_type" varchar(20) NOT NULL,
	"entity_id" uuid NOT NULL,
	"ad_title" varchar(255) NOT NULL,
	"ad_description" text,
	"ad_image" varchar(255),
	"price" numeric(10, 2) NOT NULL,
	"status" varchar(20) DEFAULT 'Pending',
	"start_date" timestamp,
	"end_date" timestamp,
	"impression_count" integer DEFAULT 0,
	"click_count" integer DEFAULT 0,
	"conversion_count" integer DEFAULT 0,
	"target_audience" varchar(255)[],
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_preferences" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"push_notifications" boolean DEFAULT true,
	"email_notifications" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "vendor_preferences" (
	"id" uuid PRIMARY KEY NOT NULL,
	"vendor_id" uuid NOT NULL,
	"push_notifications" boolean DEFAULT true,
	"email_notifications" boolean DEFAULT true,
	"visible_in_search" boolean DEFAULT true,
	"visible_reviews" boolean DEFAULT true,
	"working_hours_start" varchar(10),
	"working_hours_end" varchar(10),
	"working_days" varchar(20)[],
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "venue_availability" (
	"id" uuid PRIMARY KEY NOT NULL,
	"venue_id" uuid NOT NULL,
	"date" date NOT NULL,
	"is_booked" boolean DEFAULT false,
	"booked_time_slots" varchar(255)[],
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "chat_blocks" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "notification_settings" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "ads" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "chat_blocks" CASCADE;--> statement-breakpoint
DROP TABLE "notification_settings" CASCADE;--> statement-breakpoint
DROP TABLE "ads" CASCADE;--> statement-breakpoint
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_receipt_id_unique";--> statement-breakpoint
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_visit_request_id_unique";--> statement-breakpoint
ALTER TABLE "ad_inquiries" DROP CONSTRAINT "ad_inquiries_ad_id_ads_id_fk";
--> statement-breakpoint
ALTER TABLE "ad_payments" DROP CONSTRAINT "ad_payments_ad_id_ads_id_fk";
--> statement-breakpoint
ALTER TABLE "chats" DROP CONSTRAINT "chats_service_ad_id_ads_id_fk";
--> statement-breakpoint
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_booking_id_bookings_id_fk";
--> statement-breakpoint
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_ad_id_ads_id_fk";
--> statement-breakpoint
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_blog_id_blogs_id_fk";
--> statement-breakpoint
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_chat_id_chats_id_fk";
--> statement-breakpoint
ALTER TABLE "ad_payments" ALTER COLUMN "ad_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "ad_payments" ALTER COLUMN "vendor_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "blog_comments" ALTER COLUMN "blog_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "blog_comments" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "external_ads" ALTER COLUMN "start_date" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "reviews" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "reviews" ALTER COLUMN "vendor_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "venues" ALTER COLUMN "vendor_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "ad_inquiries" ADD COLUMN "user_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "ad_inquiries" ADD COLUMN "vendor_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "ad_inquiries" ADD COLUMN "inquiry_text" text NOT NULL;--> statement-breakpoint
ALTER TABLE "ad_inquiries" ADD COLUMN "converted_to_booking_id" uuid;--> statement-breakpoint
ALTER TABLE "ad_inquiries" ADD COLUMN "closed_at" timestamp;--> statement-breakpoint
ALTER TABLE "ad_payments" ADD COLUMN "external_ad_id" uuid;--> statement-breakpoint
ALTER TABLE "ad_payments" ADD COLUMN "payment_method" varchar(20);--> statement-breakpoint
ALTER TABLE "ad_payments" ADD COLUMN "invoice_number" varchar(50);--> statement-breakpoint
ALTER TABLE "ad_payments" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "ad_payments" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "admin" ADD COLUMN "profile_image" varchar(255);--> statement-breakpoint
ALTER TABLE "admin" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "status" varchar(20) DEFAULT 'Open';--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "resolution" text;--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "resolved_at" timestamp;--> statement-breakpoint
ALTER TABLE "blog_comments" ADD COLUMN "is_approved" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "blog_comments" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "blogs" ADD COLUMN "slug" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "blogs" ADD COLUMN "summary" text;--> statement-breakpoint
ALTER TABLE "blogs" ADD COLUMN "featured_image" varchar(255);--> statement-breakpoint
ALTER TABLE "blogs" ADD COLUMN "tags" varchar(100)[];--> statement-breakpoint
ALTER TABLE "blogs" ADD COLUMN "status" varchar(20) DEFAULT 'Published';--> statement-breakpoint
ALTER TABLE "blogs" ADD COLUMN "view_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "blogs" ADD COLUMN "published_at" timestamp;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "booking_reference" varchar(50);--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "is_reviewed" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "category" ADD COLUMN "is_active" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "category" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "category" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "catering_custom_packages" ADD COLUMN "guest_count" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "catering_custom_packages" ADD COLUMN "event_date" date;--> statement-breakpoint
ALTER TABLE "catering_custom_packages" ADD COLUMN "status" varchar(20) DEFAULT 'Requested';--> statement-breakpoint
ALTER TABLE "catering_custom_packages" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "catering_packages" ADD COLUMN "package_name" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "catering_packages" ADD COLUMN "min_guests" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "catering_packages" ADD COLUMN "max_guests" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "catering_packages" ADD COLUMN "menu_items" text[];--> statement-breakpoint
ALTER TABLE "catering_packages" ADD COLUMN "dietary_options" varchar(100)[];--> statement-breakpoint
ALTER TABLE "catering_packages" ADD COLUMN "is_available" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "catering_packages" ADD COLUMN "rating" numeric(3, 2);--> statement-breakpoint
ALTER TABLE "catering_packages" ADD COLUMN "review_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "catering_packages" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "chats" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "external_ads" ADD COLUMN "advertiser_name" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "external_ads" ADD COLUMN "advertiser_email" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "external_ads" ADD COLUMN "advertiser_phone" varchar(20);--> statement-breakpoint
ALTER TABLE "external_ads" ADD COLUMN "ad_title" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "external_ads" ADD COLUMN "ad_description" text;--> statement-breakpoint
ALTER TABLE "external_ads" ADD COLUMN "price" numeric(10, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "external_ads" ADD COLUMN "impression_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "external_ads" ADD COLUMN "click_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "external_ads" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "farmhouses" ADD COLUMN "min_nights" integer DEFAULT 1;--> statement-breakpoint
ALTER TABLE "farmhouses" ADD COLUMN "max_nights" integer;--> statement-breakpoint
ALTER TABLE "farmhouses" ADD COLUMN "max_guests" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "farmhouses" ADD COLUMN "is_available" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "farmhouses" ADD COLUMN "rating" numeric(3, 2);--> statement-breakpoint
ALTER TABLE "farmhouses" ADD COLUMN "review_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "farmhouses" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "admin_id" uuid;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "link_to" varchar(255);--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "related_id" uuid;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "related_type" varchar(50);--> statement-breakpoint
ALTER TABLE "payment_schedules" ADD COLUMN "last_reminder_date" date;--> statement-breakpoint
ALTER TABLE "payment_schedules" ADD COLUMN "transaction_id" uuid;--> statement-breakpoint
ALTER TABLE "payment_schedules" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "photography_custom_orders" ADD COLUMN "event_date" date;--> statement-breakpoint
ALTER TABLE "photography_custom_orders" ADD COLUMN "event_duration" integer;--> statement-breakpoint
ALTER TABLE "photography_custom_orders" ADD COLUMN "status" varchar(20) DEFAULT 'Requested';--> statement-breakpoint
ALTER TABLE "photography_custom_orders" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "photography_packages" ADD COLUMN "duration" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "photography_packages" ADD COLUMN "photographer_count" integer DEFAULT 1;--> statement-breakpoint
ALTER TABLE "photography_packages" ADD COLUMN "deliverables" text[];--> statement-breakpoint
ALTER TABLE "photography_packages" ADD COLUMN "is_available" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "photography_packages" ADD COLUMN "rating" numeric(3, 2);--> statement-breakpoint
ALTER TABLE "photography_packages" ADD COLUMN "review_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "photography_packages" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "pos_transactions" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "reviews" ADD COLUMN "booking_id" uuid;--> statement-breakpoint
ALTER TABLE "reviews" ADD COLUMN "images" varchar(255)[];--> statement-breakpoint
ALTER TABLE "reviews" ADD COLUMN "is_published" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "reviews" ADD COLUMN "is_verified" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "reviews" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "service_expenses" ADD COLUMN "receipt_url" varchar(255);--> statement-breakpoint
ALTER TABLE "service_expenses" ADD COLUMN "expense_date" date DEFAULT now();--> statement-breakpoint
ALTER TABLE "service_expenses" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "service_inquiries" ADD COLUMN "user_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "service_inquiries" ADD COLUMN "vendor_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "service_inquiries" ADD COLUMN "inquiry_text" text NOT NULL;--> statement-breakpoint
ALTER TABLE "service_inquiries" ADD COLUMN "converted_to_booking_id" uuid;--> statement-breakpoint
ALTER TABLE "service_inquiries" ADD COLUMN "closed_at" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "rating" numeric(3, 2);--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "review_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "venues" ADD COLUMN "is_available" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "venues" ADD COLUMN "rating" numeric(3, 2);--> statement-breakpoint
ALTER TABLE "venues" ADD COLUMN "review_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "venues" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "farmhouse_availability" ADD CONSTRAINT "farmhouse_availability_farmhouse_id_farmhouses_id_fk" FOREIGN KEY ("farmhouse_id") REFERENCES "public"."farmhouses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_responses" ADD CONSTRAINT "review_responses_review_id_reviews_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_responses" ADD CONSTRAINT "review_responses_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_ads" ADD CONSTRAINT "service_ads_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_preferences" ADD CONSTRAINT "vendor_preferences_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "venue_availability" ADD CONSTRAINT "venue_availability_venue_id_venues_id_fk" FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ad_inquiries" ADD CONSTRAINT "ad_inquiries_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ad_inquiries" ADD CONSTRAINT "ad_inquiries_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ad_inquiries" ADD CONSTRAINT "ad_inquiries_ad_id_service_ads_id_fk" FOREIGN KEY ("ad_id") REFERENCES "public"."service_ads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ad_inquiries" ADD CONSTRAINT "ad_inquiries_converted_to_booking_id_bookings_id_fk" FOREIGN KEY ("converted_to_booking_id") REFERENCES "public"."bookings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ad_payments" ADD CONSTRAINT "ad_payments_ad_id_service_ads_id_fk" FOREIGN KEY ("ad_id") REFERENCES "public"."service_ads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ad_payments" ADD CONSTRAINT "ad_payments_external_ad_id_external_ads_id_fk" FOREIGN KEY ("external_ad_id") REFERENCES "public"."external_ads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chats" ADD CONSTRAINT "chats_service_ad_id_service_ads_id_fk" FOREIGN KEY ("service_ad_id") REFERENCES "public"."service_ads"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_admin_id_admin_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."admin"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_schedules" ADD CONSTRAINT "payment_schedules_transaction_id_pos_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."pos_transactions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_inquiries" ADD CONSTRAINT "service_inquiries_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_inquiries" ADD CONSTRAINT "service_inquiries_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_inquiries" ADD CONSTRAINT "service_inquiries_converted_to_booking_id_bookings_id_fk" FOREIGN KEY ("converted_to_booking_id") REFERENCES "public"."bookings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" DROP COLUMN "receipt_id";--> statement-breakpoint
ALTER TABLE "bookings" DROP COLUMN "visit_request_id";--> statement-breakpoint
ALTER TABLE "catering_packages" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "notifications" DROP COLUMN "is_all_users";--> statement-breakpoint
ALTER TABLE "notifications" DROP COLUMN "is_all_vendors";--> statement-breakpoint
ALTER TABLE "notifications" DROP COLUMN "booking_id";--> statement-breakpoint
ALTER TABLE "notifications" DROP COLUMN "payment_id";--> statement-breakpoint
ALTER TABLE "notifications" DROP COLUMN "ad_id";--> statement-breakpoint
ALTER TABLE "notifications" DROP COLUMN "blog_id";--> statement-breakpoint
ALTER TABLE "notifications" DROP COLUMN "chat_id";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "is_verified";--> statement-breakpoint
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_slug_unique" UNIQUE("slug");