alter table "public"."waitlist_signups" drop column "open_until";

alter table "public"."waitlist_signups" drop column "status";

alter table "public"."waitlist_signups" add column "spot_expires_at" timestamp with time zone;


