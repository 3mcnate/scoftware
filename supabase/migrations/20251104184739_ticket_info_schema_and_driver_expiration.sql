alter table "public"."trip_ticket_info" drop constraint "trip_ticket_info_cancelled_driver_tickets_check";

alter table "public"."trip_ticket_info" drop constraint "trip_ticket_info_cancelled_participant_tickets_check";

alter table "public"."driver_info" add column "drivers_license_expiration" date not null;

alter table "public"."trip_ticket_info" drop column "cancelled_driver_tickets";

alter table "public"."trip_ticket_info" drop column "cancelled_participant_tickets";

alter table "public"."trip_ticket_info" add column "driver_waitlist_only" boolean not null default false;

alter table "public"."trip_ticket_info" add column "participant_waitlist_only" boolean not null default false;


