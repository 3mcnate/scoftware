drop policy "Allow guides to update trip settings" on "public"."trip_signup_settings";

drop policy "Allow guides to view trip settings" on "public"."trip_signup_settings";

revoke delete on table "public"."trip_signup_settings" from "anon";

revoke insert on table "public"."trip_signup_settings" from "anon";

revoke references on table "public"."trip_signup_settings" from "anon";

revoke select on table "public"."trip_signup_settings" from "anon";

revoke trigger on table "public"."trip_signup_settings" from "anon";

revoke truncate on table "public"."trip_signup_settings" from "anon";

revoke update on table "public"."trip_signup_settings" from "anon";

revoke delete on table "public"."trip_signup_settings" from "authenticated";

revoke insert on table "public"."trip_signup_settings" from "authenticated";

revoke references on table "public"."trip_signup_settings" from "authenticated";

revoke select on table "public"."trip_signup_settings" from "authenticated";

revoke trigger on table "public"."trip_signup_settings" from "authenticated";

revoke truncate on table "public"."trip_signup_settings" from "authenticated";

revoke update on table "public"."trip_signup_settings" from "authenticated";

revoke delete on table "public"."trip_signup_settings" from "service_role";

revoke insert on table "public"."trip_signup_settings" from "service_role";

revoke references on table "public"."trip_signup_settings" from "service_role";

revoke select on table "public"."trip_signup_settings" from "service_role";

revoke trigger on table "public"."trip_signup_settings" from "service_role";

revoke truncate on table "public"."trip_signup_settings" from "service_role";

revoke update on table "public"."trip_signup_settings" from "service_role";

alter table "public"."trip_signup_settings" drop constraint "trip_settings_trip_id_fkey";

alter table "public"."trip_signup_settings" drop constraint "trip_settings_pkey";

drop index if exists "public"."trip_settings_pkey";

drop table "public"."trip_signup_settings";


  create table "public"."trip_settings" (
    "trip_id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "allow_signups" boolean not null default true,
    "enable_participant_waitlist" boolean not null default false,
    "enable_driver_waitlist" boolean not null default false,
    "require_code" boolean not null default false,
    "driver_signup_date_override" timestamp with time zone,
    "member_signup_date_override" timestamp with time zone,
    "nonmember_signup_date_override" timestamp with time zone,
    "publish_date_override" timestamp with time zone,
    "hide_trip" boolean not null default false
      );


alter table "public"."trip_settings" enable row level security;

alter table "public"."trips" drop column "publish_date_override";

alter table "public"."trips" drop column "visible";

CREATE UNIQUE INDEX trip_settings_pkey ON public.trip_settings USING btree (trip_id);

alter table "public"."trip_settings" add constraint "trip_settings_pkey" PRIMARY KEY using index "trip_settings_pkey";

alter table "public"."trip_settings" add constraint "trip_settings_trip_id_fkey" FOREIGN KEY (trip_id) REFERENCES public.trips(id) ON DELETE CASCADE not valid;

alter table "public"."trip_settings" validate constraint "trip_settings_trip_id_fkey";

grant delete on table "public"."trip_settings" to "anon";

grant insert on table "public"."trip_settings" to "anon";

grant references on table "public"."trip_settings" to "anon";

grant select on table "public"."trip_settings" to "anon";

grant trigger on table "public"."trip_settings" to "anon";

grant truncate on table "public"."trip_settings" to "anon";

grant update on table "public"."trip_settings" to "anon";

grant delete on table "public"."trip_settings" to "authenticated";

grant insert on table "public"."trip_settings" to "authenticated";

grant references on table "public"."trip_settings" to "authenticated";

grant select on table "public"."trip_settings" to "authenticated";

grant trigger on table "public"."trip_settings" to "authenticated";

grant truncate on table "public"."trip_settings" to "authenticated";

grant update on table "public"."trip_settings" to "authenticated";

grant delete on table "public"."trip_settings" to "service_role";

grant insert on table "public"."trip_settings" to "service_role";

grant references on table "public"."trip_settings" to "service_role";

grant select on table "public"."trip_settings" to "service_role";

grant trigger on table "public"."trip_settings" to "service_role";

grant truncate on table "public"."trip_settings" to "service_role";

grant update on table "public"."trip_settings" to "service_role";


  create policy "Allow guides to update trip settings"
  on "public"."trip_settings"
  as permissive
  for update
  to authenticated
using (public.authorize('guide'::public.user_role))
with check (public.authorize('guide'::public.user_role));



  create policy "Allow guides to view trip settings"
  on "public"."trip_settings"
  as permissive
  for select
  to authenticated
using (public.authorize('guide'::public.user_role));



