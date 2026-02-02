alter table "public"."trips" drop column "signup_status";

alter table "public"."trips" add column "allow_signups" boolean not null default true;

alter table "public"."trips" add column "driver_ticket_drop_date_override" timestamp with time zone;

alter table "public"."trips" add column "enable_driver_waitlist" boolean not null default false;

alter table "public"."trips" add column "enable_participant_waitlist" boolean not null default false;

alter table "public"."trips" add column "member_ticket_drop_date_override" timestamp with time zone;

alter table "public"."trips" add column "nonmember_ticket_drop_date_override" timestamp with time zone;

alter table "public"."trips" add column "publish_date_override" timestamp with time zone;


