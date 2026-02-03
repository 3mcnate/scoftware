revoke delete on table "public"."public_trip_signup_settings" from "anon";

revoke insert on table "public"."public_trip_signup_settings" from "anon";

revoke references on table "public"."public_trip_signup_settings" from "anon";

revoke select on table "public"."public_trip_signup_settings" from "anon";

revoke trigger on table "public"."public_trip_signup_settings" from "anon";

revoke truncate on table "public"."public_trip_signup_settings" from "anon";

revoke update on table "public"."public_trip_signup_settings" from "anon";

revoke delete on table "public"."public_trip_signup_settings" from "authenticated";

revoke insert on table "public"."public_trip_signup_settings" from "authenticated";

revoke references on table "public"."public_trip_signup_settings" from "authenticated";

revoke select on table "public"."public_trip_signup_settings" from "authenticated";

revoke trigger on table "public"."public_trip_signup_settings" from "authenticated";

revoke truncate on table "public"."public_trip_signup_settings" from "authenticated";

revoke update on table "public"."public_trip_signup_settings" from "authenticated";

revoke delete on table "public"."public_trip_signup_settings" from "service_role";

revoke insert on table "public"."public_trip_signup_settings" from "service_role";

revoke references on table "public"."public_trip_signup_settings" from "service_role";

revoke select on table "public"."public_trip_signup_settings" from "service_role";

revoke trigger on table "public"."public_trip_signup_settings" from "service_role";

revoke truncate on table "public"."public_trip_signup_settings" from "service_role";

revoke update on table "public"."public_trip_signup_settings" from "service_role";

alter table "public"."public_trip_signup_settings" drop constraint "trip_settings_trip_id_fkey";

alter table "public"."public_trip_signup_settings" drop constraint "trip_settings_pkey";

drop index if exists "public"."trip_settings_pkey";

drop table "public"."public_trip_signup_settings";


  create table "public"."trip_signup_settings" (
    "trip_id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "allow_signups" boolean not null default true,
    "enable_participant_waitlist" boolean not null default false,
    "enable_driver_waitlist" boolean not null default false,
    "require_code" boolean not null default false
      );


alter table "public"."trip_signup_settings" enable row level security;

alter table "public"."trips" drop column "allow_signups";

alter table "public"."trips" drop column "enable_driver_waitlist";

alter table "public"."trips" drop column "enable_participant_waitlist";

alter table "public"."trips" add column "ready_to_publish" boolean not null default false;

alter table "public"."trips" add column "visible" boolean not null default true;

CREATE UNIQUE INDEX trip_settings_pkey ON public.trip_signup_settings USING btree (trip_id);

alter table "public"."trip_signup_settings" add constraint "trip_settings_pkey" PRIMARY KEY using index "trip_settings_pkey";

alter table "public"."trip_signup_settings" add constraint "trip_settings_trip_id_fkey" FOREIGN KEY (trip_id) REFERENCES public.trips(id) ON DELETE CASCADE not valid;

alter table "public"."trip_signup_settings" validate constraint "trip_settings_trip_id_fkey";

grant delete on table "public"."trip_signup_settings" to "anon";

grant insert on table "public"."trip_signup_settings" to "anon";

grant references on table "public"."trip_signup_settings" to "anon";

grant select on table "public"."trip_signup_settings" to "anon";

grant trigger on table "public"."trip_signup_settings" to "anon";

grant truncate on table "public"."trip_signup_settings" to "anon";

grant update on table "public"."trip_signup_settings" to "anon";

grant delete on table "public"."trip_signup_settings" to "authenticated";

grant insert on table "public"."trip_signup_settings" to "authenticated";

grant references on table "public"."trip_signup_settings" to "authenticated";

grant select on table "public"."trip_signup_settings" to "authenticated";

grant trigger on table "public"."trip_signup_settings" to "authenticated";

grant truncate on table "public"."trip_signup_settings" to "authenticated";

grant update on table "public"."trip_signup_settings" to "authenticated";

grant delete on table "public"."trip_signup_settings" to "postgres";

grant insert on table "public"."trip_signup_settings" to "postgres";

grant references on table "public"."trip_signup_settings" to "postgres";

grant select on table "public"."trip_signup_settings" to "postgres";

grant trigger on table "public"."trip_signup_settings" to "postgres";

grant truncate on table "public"."trip_signup_settings" to "postgres";

grant update on table "public"."trip_signup_settings" to "postgres";

grant delete on table "public"."trip_signup_settings" to "service_role";

grant insert on table "public"."trip_signup_settings" to "service_role";

grant references on table "public"."trip_signup_settings" to "service_role";

grant select on table "public"."trip_signup_settings" to "service_role";

grant trigger on table "public"."trip_signup_settings" to "service_role";

grant truncate on table "public"."trip_signup_settings" to "service_role";

grant update on table "public"."trip_signup_settings" to "service_role";


