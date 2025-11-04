create type "public"."checkout_session_status" as enum ('open', 'complete', 'expired');

alter table "public"."checkout_sessions" drop constraint "ticket_reservations_trip_id_fkey";

alter table "public"."checkout_sessions" drop constraint "ticket_reservations_user_id_fkey";

alter table "public"."checkout_sessions" drop column "confirmed";

alter table "public"."checkout_sessions" add column "status" checkout_session_status not null default 'open'::checkout_session_status;

alter table "public"."tickets" add column "stripe_refund_id" text;

alter table "public"."checkout_sessions" add constraint "checkout_sessions_trip_id_fkey" FOREIGN KEY (trip_id) REFERENCES trips(id) not valid;

alter table "public"."checkout_sessions" validate constraint "checkout_sessions_trip_id_fkey";

alter table "public"."checkout_sessions" add constraint "checkout_sessions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) not valid;

alter table "public"."checkout_sessions" validate constraint "checkout_sessions_user_id_fkey";


