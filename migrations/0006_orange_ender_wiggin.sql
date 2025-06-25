CREATE TABLE "notification_read_status" (
	"id" uuid PRIMARY KEY NOT NULL,
	"notification_id" uuid NOT NULL,
	"user_id" uuid,
	"vendor_id" uuid,
	"admin_id" uuid,
	"read_at" timestamp DEFAULT now(),
	CONSTRAINT "unique_notification_read" UNIQUE("notification_id","user_id","vendor_id","admin_id")
);
--> statement-breakpoint
CREATE TABLE "voucher_usage" (
	"id" uuid PRIMARY KEY NOT NULL,
	"voucher_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"booking_id" uuid NOT NULL,
	"original_amount" numeric(10, 2) NOT NULL,
	"discount_amount" numeric(10, 2) NOT NULL,
	"final_amount" numeric(10, 2) NOT NULL,
	"service_type" varchar(50) NOT NULL,
	"service_id" uuid NOT NULL,
	"applied_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "vouchers" (
	"id" uuid PRIMARY KEY NOT NULL,
	"vendor_id" uuid NOT NULL,
	"coupon_code" varchar(50) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"discount_type" varchar(20) NOT NULL,
	"discount_value" numeric(10, 2) NOT NULL,
	"max_discount_amount" numeric(10, 2),
	"min_order_value" numeric(10, 2),
	"applicable_for" varchar(20) NOT NULL,
	"service_types" varchar(50)[],
	"specific_service_ids" uuid[],
	"total_usage_limit" integer,
	"usage_per_user" integer DEFAULT 1,
	"current_usage_count" integer DEFAULT 0,
	"valid_from" timestamp NOT NULL,
	"valid_until" timestamp NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "unique_vendor_coupon" UNIQUE("vendor_id","coupon_code"),
	CONSTRAINT "discount_value_check" CHECK ("vouchers"."discount_value" > 0),
	CONSTRAINT "valid_date_check" CHECK ("vouchers"."valid_from" < "vouchers"."valid_until")
);
--> statement-breakpoint
ALTER TABLE "coupon_codes" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "coupon_usage" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "coupon_codes" CASCADE;--> statement-breakpoint
DROP TABLE "coupon_usage" CASCADE;--> statement-breakpoint
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_vendor_id_vendors_id_fk";
--> statement-breakpoint
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_admin_id_admin_id_fk";
--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "notification_type" varchar(30) NOT NULL;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "target_user_id" uuid;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "target_vendor_id" uuid;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "category" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "is_active" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "notification_read_status" ADD CONSTRAINT "notification_read_status_notification_id_notifications_id_fk" FOREIGN KEY ("notification_id") REFERENCES "public"."notifications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_read_status" ADD CONSTRAINT "notification_read_status_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_read_status" ADD CONSTRAINT "notification_read_status_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_read_status" ADD CONSTRAINT "notification_read_status_admin_id_admin_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."admin"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "voucher_usage" ADD CONSTRAINT "voucher_usage_voucher_id_vouchers_id_fk" FOREIGN KEY ("voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "voucher_usage" ADD CONSTRAINT "voucher_usage_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "voucher_usage" ADD CONSTRAINT "voucher_usage_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vouchers" ADD CONSTRAINT "vouchers_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_target_user_id_users_id_fk" FOREIGN KEY ("target_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_target_vendor_id_vendors_id_fk" FOREIGN KEY ("target_vendor_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" DROP COLUMN "user_id";--> statement-breakpoint
ALTER TABLE "notifications" DROP COLUMN "vendor_id";--> statement-breakpoint
ALTER TABLE "notifications" DROP COLUMN "admin_id";--> statement-breakpoint
ALTER TABLE "notifications" DROP COLUMN "type";--> statement-breakpoint
ALTER TABLE "notifications" DROP COLUMN "is_read";--> statement-breakpoint
ALTER TABLE "notifications" DROP COLUMN "read_at";--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "user_personal_check" CHECK (("notifications"."notification_type" = 'User Personal' AND "notifications"."target_user_id" IS NOT NULL) OR "notifications"."notification_type" != 'User Personal');--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "vendor_personal_check" CHECK (("notifications"."notification_type" = 'Vendor Personal' AND "notifications"."target_vendor_id" IS NOT NULL) OR "notifications"."notification_type" != 'Vendor Personal');