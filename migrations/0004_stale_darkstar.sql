ALTER TABLE "support_tickets" DROP CONSTRAINT "support_tickets_related_booking_id_bookings_id_fk";
--> statement-breakpoint
ALTER TABLE "social_auth_settings" DROP COLUMN "redirect_uri";--> statement-breakpoint
ALTER TABLE "social_auth_settings" DROP COLUMN "scope";--> statement-breakpoint
ALTER TABLE "support_tickets" DROP COLUMN "related_booking_id";--> statement-breakpoint
ALTER TABLE "support_tickets" DROP COLUMN "related_service_type";--> statement-breakpoint
ALTER TABLE "support_tickets" DROP COLUMN "related_service_id";