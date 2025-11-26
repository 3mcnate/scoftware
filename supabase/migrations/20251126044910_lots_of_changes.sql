create type "public"."trip_signup_status" as enum ('open', 'closed', 'access_code', 'select_participants', 'waitlist');

drop trigger if exists "prices_enforce_times_trg" on "public"."trip_prices";

drop trigger if exists "trip_ticket_info_enforce_times_trg" on "public"."trip_ticket_info";

drop trigger if exists "waiver_uploads_enforce_times_trg" on "public"."waiver_uploads";

revoke delete on table "public"."trip_ticket_info" from "anon";

revoke insert on table "public"."trip_ticket_info" from "anon";

revoke references on table "public"."trip_ticket_info" from "anon";

revoke select on table "public"."trip_ticket_info" from "anon";

revoke trigger on table "public"."trip_ticket_info" from "anon";

revoke truncate on table "public"."trip_ticket_info" from "anon";

revoke update on table "public"."trip_ticket_info" from "anon";

revoke delete on table "public"."trip_ticket_info" from "authenticated";

revoke insert on table "public"."trip_ticket_info" from "authenticated";

revoke references on table "public"."trip_ticket_info" from "authenticated";

revoke select on table "public"."trip_ticket_info" from "authenticated";

revoke trigger on table "public"."trip_ticket_info" from "authenticated";

revoke truncate on table "public"."trip_ticket_info" from "authenticated";

revoke update on table "public"."trip_ticket_info" from "authenticated";

revoke delete on table "public"."trip_ticket_info" from "service_role";

revoke insert on table "public"."trip_ticket_info" from "service_role";

revoke references on table "public"."trip_ticket_info" from "service_role";

revoke select on table "public"."trip_ticket_info" from "service_role";

revoke trigger on table "public"."trip_ticket_info" from "service_role";

revoke truncate on table "public"."trip_ticket_info" from "service_role";

revoke update on table "public"."trip_ticket_info" from "service_role";

revoke delete on table "public"."waiver_uploads" from "anon";

revoke insert on table "public"."waiver_uploads" from "anon";

revoke references on table "public"."waiver_uploads" from "anon";

revoke select on table "public"."waiver_uploads" from "anon";

revoke trigger on table "public"."waiver_uploads" from "anon";

revoke truncate on table "public"."waiver_uploads" from "anon";

revoke update on table "public"."waiver_uploads" from "anon";

revoke delete on table "public"."waiver_uploads" from "authenticated";

revoke insert on table "public"."waiver_uploads" from "authenticated";

revoke references on table "public"."waiver_uploads" from "authenticated";

revoke select on table "public"."waiver_uploads" from "authenticated";

revoke trigger on table "public"."waiver_uploads" from "authenticated";

revoke truncate on table "public"."waiver_uploads" from "authenticated";

revoke update on table "public"."waiver_uploads" from "authenticated";

revoke delete on table "public"."waiver_uploads" from "service_role";

revoke insert on table "public"."waiver_uploads" from "service_role";

revoke references on table "public"."waiver_uploads" from "service_role";

revoke select on table "public"."waiver_uploads" from "service_role";

revoke trigger on table "public"."waiver_uploads" from "service_role";

revoke truncate on table "public"."waiver_uploads" from "service_role";

revoke update on table "public"."waiver_uploads" from "service_role";

alter table "public"."trip_prices" drop constraint "prices_id_fkey";

alter table "public"."trip_prices" drop constraint "prices_stripe_driver_price_id_key";

alter table "public"."trip_prices" drop constraint "prices_stripe_driver_product_id_key";

alter table "public"."trip_prices" drop constraint "prices_stripe_member_price_id_key";

alter table "public"."trip_prices" drop constraint "prices_stripe_nonmember_price_id_key";

alter table "public"."trip_prices" drop constraint "prices_stripe_participant_product_id_key";

alter table "public"."trip_prices" drop constraint "trip_prices_driver_price_check";

alter table "public"."trip_prices" drop constraint "trip_prices_member_price_check";

alter table "public"."trip_prices" drop constraint "trip_prices_nonmember_price_check";

alter table "public"."trip_ticket_info" drop constraint "trip_ticket_info_driver_tickets_sold_check";

alter table "public"."trip_ticket_info" drop constraint "trip_ticket_info_participant_tickets_sold_check";

alter table "public"."trip_ticket_info" drop constraint "trip_ticket_info_trip_id_fkey";

alter table "public"."waiver_uploads" drop constraint "waiver_uploads_bucket_fkey";

alter table "public"."waiver_uploads" drop constraint "waivers_ticket_id_fkey";

alter table "public"."waiver_uploads" drop constraint "waivers_user_id_fkey";

alter table "public"."trip_prices" drop constraint "trip_prices_pkey";

alter table "public"."trip_ticket_info" drop constraint "trip_ticket_info_pkey";

alter table "public"."waiver_uploads" drop constraint "waivers_pkey";

drop index if exists "public"."prices_stripe_driver_price_id_key";

drop index if exists "public"."prices_stripe_driver_product_id_key";

drop index if exists "public"."prices_stripe_member_price_id_key";

drop index if exists "public"."prices_stripe_nonmember_price_id_key";

drop index if exists "public"."prices_stripe_participant_product_id_key";

drop index if exists "public"."trip_prices_pkey";

drop index if exists "public"."trip_ticket_info_pkey";

drop index if exists "public"."waivers_pkey";

drop table "public"."trip_ticket_info";

drop table "public"."waiver_uploads";

alter table "public"."trip_prices" drop column "driver_price";

alter table "public"."trip_prices" drop column "member_price";

alter table "public"."trip_prices" drop column "nonmember_price";

alter table "public"."trip_prices" drop column "stripe_driver_price_id";

alter table "public"."trip_prices" drop column "stripe_driver_product_id";

alter table "public"."trip_prices" drop column "stripe_member_price_id";

alter table "public"."trip_prices" drop column "stripe_nonmember_price_id";

alter table "public"."trip_prices" drop column "stripe_participant_product_id";

alter table "public"."trip_prices" add column "active" boolean not null default true;

alter table "public"."trip_prices" add column "amount" numeric not null;

alter table "public"."trip_prices" add column "archived_at" timestamp with time zone;

alter table "public"."trip_prices" add column "stripe_price_id" text not null;

alter table "public"."trip_prices" add column "stripe_product_id" text not null;

alter table "public"."trip_prices" add column "ticket_type" public.ticket_type not null;

alter table "public"."trips" drop column "packing_list";

alter table "public"."trips" drop column "ready_to_publish";

alter table "public"."trips" add column "signup_status" public.trip_signup_status not null default 'open'::public.trip_signup_status;

alter table "public"."trips" add column "what_to_bring" text;

CREATE UNIQUE INDEX stripe_prices_pkey ON public.trip_prices USING btree (stripe_price_id);

alter table "public"."trip_prices" add constraint "stripe_prices_pkey" PRIMARY KEY using index "stripe_prices_pkey";

alter table "public"."trip_prices" add constraint "stripe_prices_trip_id_fkey" FOREIGN KEY (trip_id) REFERENCES public.trips(id) not valid;

alter table "public"."trip_prices" validate constraint "stripe_prices_trip_id_fkey";

grant delete on table "public"."participant_comments" to "postgres";

grant insert on table "public"."participant_comments" to "postgres";

grant references on table "public"."participant_comments" to "postgres";

grant select on table "public"."participant_comments" to "postgres";

grant trigger on table "public"."participant_comments" to "postgres";

grant truncate on table "public"."participant_comments" to "postgres";

grant update on table "public"."participant_comments" to "postgres";

grant delete on table "public"."published_trips" to "postgres";

grant insert on table "public"."published_trips" to "postgres";

grant references on table "public"."published_trips" to "postgres";

grant select on table "public"."published_trips" to "postgres";

grant trigger on table "public"."published_trips" to "postgres";

grant truncate on table "public"."published_trips" to "postgres";

grant update on table "public"."published_trips" to "postgres";

grant delete on table "public"."trip_details" to "postgres";

grant insert on table "public"."trip_details" to "postgres";

grant references on table "public"."trip_details" to "postgres";

grant select on table "public"."trip_details" to "postgres";

grant trigger on table "public"."trip_details" to "postgres";

grant truncate on table "public"."trip_details" to "postgres";

grant update on table "public"."trip_details" to "postgres";

grant delete on table "public"."trip_prices" to "postgres";

grant insert on table "public"."trip_prices" to "postgres";

grant references on table "public"."trip_prices" to "postgres";

grant select on table "public"."trip_prices" to "postgres";

grant trigger on table "public"."trip_prices" to "postgres";

grant truncate on table "public"."trip_prices" to "postgres";

grant update on table "public"."trip_prices" to "postgres";


