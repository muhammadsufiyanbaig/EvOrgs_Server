CREATE TABLE "coupon_codes" (
	"id" uuid PRIMARY KEY NOT NULL,
	"code" varchar(50) NOT NULL,
	"description" text NOT NULL,
	"discount_type" varchar(20) NOT NULL,
	"discount_value" numeric(10, 2) NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"is_active" boolean DEFAULT true,
	"max_usage" integer,
	"current_usage" integer DEFAULT 0,
	"max_usage_per_vendor" integer DEFAULT 1,
	"min_purchase_amount" numeric(10, 2),
	"ad_types" varchar(20)[],
	"created_by" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "coupon_codes_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "coupon_usage" (
	"id" uuid PRIMARY KEY NOT NULL,
	"coupon_id" uuid NOT NULL,
	"vendor_id" uuid NOT NULL,
	"ad_payment_id" uuid NOT NULL,
	"discount_amount" numeric(10, 2) NOT NULL,
	"original_amount" numeric(10, 2) NOT NULL,
	"final_amount" numeric(10, 2) NOT NULL,
	"used_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "social_auth" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"vendor_id" uuid,
	"user_type" varchar(10) NOT NULL,
	"provider" varchar(20) NOT NULL,
	"provider_id" varchar(255) NOT NULL,
	"provider_email" varchar(255) NOT NULL,
	"provider_name" varchar(255),
	"access_token" text,
	"refresh_token" text,
	"token_expiry" timestamp,
	"profile_data" text,
	"last_login" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "social_auth_settings" (
	"id" uuid PRIMARY KEY NOT NULL,
	"provider" varchar(20) NOT NULL,
	"client_id" varchar(255) NOT NULL,
	"client_secret" varchar(255) NOT NULL,
	"redirect_uri" varchar(255) NOT NULL,
	"scope" text,
	"is_active" boolean DEFAULT true,
	"created_by" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "social_auth_settings_provider_unique" UNIQUE("provider")
);
--> statement-breakpoint
CREATE TABLE "support_responses" (
	"id" uuid PRIMARY KEY NOT NULL,
	"ticket_id" uuid NOT NULL,
	"admin_id" uuid,
	"user_id" uuid,
	"vendor_id" uuid,
	"response_text" text NOT NULL,
	"attachments" varchar(500)[],
	"is_internal" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "support_tickets" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"vendor_id" uuid,
	"subject" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"ticket_type" varchar(30) NOT NULL,
	"priority" varchar(20) DEFAULT 'Medium',
	"status" varchar(20) DEFAULT 'Open',
	"related_booking_id" uuid,
	"related_service_type" varchar(50),
	"related_service_id" uuid,
	"attachments" varchar(500)[],
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"resolved_at" timestamp,
	"closed_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "coupon_codes" ADD CONSTRAINT "coupon_codes_created_by_admin_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."admin"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coupon_usage" ADD CONSTRAINT "coupon_usage_coupon_id_coupon_codes_id_fk" FOREIGN KEY ("coupon_id") REFERENCES "public"."coupon_codes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coupon_usage" ADD CONSTRAINT "coupon_usage_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coupon_usage" ADD CONSTRAINT "coupon_usage_ad_payment_id_ad_payments_id_fk" FOREIGN KEY ("ad_payment_id") REFERENCES "public"."ad_payments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "social_auth" ADD CONSTRAINT "social_auth_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "social_auth" ADD CONSTRAINT "social_auth_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "social_auth_settings" ADD CONSTRAINT "social_auth_settings_created_by_admin_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."admin"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_responses" ADD CONSTRAINT "support_responses_ticket_id_support_tickets_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."support_tickets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_responses" ADD CONSTRAINT "support_responses_admin_id_admin_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."admin"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_responses" ADD CONSTRAINT "support_responses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_responses" ADD CONSTRAINT "support_responses_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_related_booking_id_bookings_id_fk" FOREIGN KEY ("related_booking_id") REFERENCES "public"."bookings"("id") ON DELETE set null ON UPDATE no action;