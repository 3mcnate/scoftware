drop trigger if exists "form_responses_enforce_times_trg" on "public"."form_responses";

drop trigger if exists "forms_enforce_times_trg" on "public"."forms";

revoke delete on table "public"."form_responses" from "anon";

revoke insert on table "public"."form_responses" from "anon";

revoke references on table "public"."form_responses" from "anon";

revoke select on table "public"."form_responses" from "anon";

revoke trigger on table "public"."form_responses" from "anon";

revoke truncate on table "public"."form_responses" from "anon";

revoke update on table "public"."form_responses" from "anon";

revoke delete on table "public"."form_responses" from "authenticated";

revoke insert on table "public"."form_responses" from "authenticated";

revoke references on table "public"."form_responses" from "authenticated";

revoke select on table "public"."form_responses" from "authenticated";

revoke trigger on table "public"."form_responses" from "authenticated";

revoke truncate on table "public"."form_responses" from "authenticated";

revoke update on table "public"."form_responses" from "authenticated";

revoke delete on table "public"."form_responses" from "service_role";

revoke insert on table "public"."form_responses" from "service_role";

revoke references on table "public"."form_responses" from "service_role";

revoke select on table "public"."form_responses" from "service_role";

revoke trigger on table "public"."form_responses" from "service_role";

revoke truncate on table "public"."form_responses" from "service_role";

revoke update on table "public"."form_responses" from "service_role";

revoke delete on table "public"."forms" from "anon";

revoke insert on table "public"."forms" from "anon";

revoke references on table "public"."forms" from "anon";

revoke select on table "public"."forms" from "anon";

revoke trigger on table "public"."forms" from "anon";

revoke truncate on table "public"."forms" from "anon";

revoke update on table "public"."forms" from "anon";

revoke delete on table "public"."forms" from "authenticated";

revoke insert on table "public"."forms" from "authenticated";

revoke references on table "public"."forms" from "authenticated";

revoke select on table "public"."forms" from "authenticated";

revoke trigger on table "public"."forms" from "authenticated";

revoke truncate on table "public"."forms" from "authenticated";

revoke update on table "public"."forms" from "authenticated";

revoke delete on table "public"."forms" from "service_role";

revoke insert on table "public"."forms" from "service_role";

revoke references on table "public"."forms" from "service_role";

revoke select on table "public"."forms" from "service_role";

revoke trigger on table "public"."forms" from "service_role";

revoke truncate on table "public"."forms" from "service_role";

revoke update on table "public"."forms" from "service_role";

alter table "public"."form_responses" drop constraint "form_responses_form_id_fkey";

alter table "public"."form_responses" drop constraint "form_responses_user_id_fkey";

alter table "public"."form_responses" drop constraint "form_responses_pkey";

alter table "public"."forms" drop constraint "forms_pkey";

drop index if exists "public"."form_responses_pkey";

drop index if exists "public"."forms_pkey";

drop table "public"."form_responses";

drop table "public"."forms";


  create table "public"."participant_comments" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "user_id" uuid not null,
    "content" text not null
      );


alter table "public"."participant_comments" enable row level security;


  create table "public"."published_trips" (
    "id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "name" text not null,
    "picture" text not null,
    "start_date" timestamp with time zone not null,
    "end_date" timestamp with time zone not null,
    "meet" text not null,
    "return" text not null,
    "activity" text not null,
    "difficulty" text not null,
    "trail" text not null,
    "recommended_prior_experience" text not null,
    "location" text not null,
    "native_land" text not null,
    "description" text not null,
    "what_to_bring" text[] not null,
    "guides" jsonb not null
      );


alter table "public"."published_trips" enable row level security;

CREATE UNIQUE INDEX participant_comments_pkey ON public.participant_comments USING btree (id);

CREATE UNIQUE INDEX published_trips_pkey ON public.published_trips USING btree (id);

alter table "public"."participant_comments" add constraint "participant_comments_pkey" PRIMARY KEY using index "participant_comments_pkey";

alter table "public"."published_trips" add constraint "published_trips_pkey" PRIMARY KEY using index "published_trips_pkey";

alter table "public"."participant_comments" add constraint "participant_comments_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) not valid;

alter table "public"."participant_comments" validate constraint "participant_comments_user_id_fkey";

grant delete on table "public"."participant_comments" to "anon";

grant insert on table "public"."participant_comments" to "anon";

grant references on table "public"."participant_comments" to "anon";

grant select on table "public"."participant_comments" to "anon";

grant trigger on table "public"."participant_comments" to "anon";

grant truncate on table "public"."participant_comments" to "anon";

grant update on table "public"."participant_comments" to "anon";

grant delete on table "public"."participant_comments" to "authenticated";

grant insert on table "public"."participant_comments" to "authenticated";

grant references on table "public"."participant_comments" to "authenticated";

grant select on table "public"."participant_comments" to "authenticated";

grant trigger on table "public"."participant_comments" to "authenticated";

grant truncate on table "public"."participant_comments" to "authenticated";

grant update on table "public"."participant_comments" to "authenticated";

grant delete on table "public"."participant_comments" to "postgres";

grant insert on table "public"."participant_comments" to "postgres";

grant references on table "public"."participant_comments" to "postgres";

grant select on table "public"."participant_comments" to "postgres";

grant trigger on table "public"."participant_comments" to "postgres";

grant truncate on table "public"."participant_comments" to "postgres";

grant update on table "public"."participant_comments" to "postgres";

grant delete on table "public"."participant_comments" to "service_role";

grant insert on table "public"."participant_comments" to "service_role";

grant references on table "public"."participant_comments" to "service_role";

grant select on table "public"."participant_comments" to "service_role";

grant trigger on table "public"."participant_comments" to "service_role";

grant truncate on table "public"."participant_comments" to "service_role";

grant update on table "public"."participant_comments" to "service_role";

grant delete on table "public"."published_trips" to "anon";

grant insert on table "public"."published_trips" to "anon";

grant references on table "public"."published_trips" to "anon";

grant select on table "public"."published_trips" to "anon";

grant trigger on table "public"."published_trips" to "anon";

grant truncate on table "public"."published_trips" to "anon";

grant update on table "public"."published_trips" to "anon";

grant delete on table "public"."published_trips" to "authenticated";

grant insert on table "public"."published_trips" to "authenticated";

grant references on table "public"."published_trips" to "authenticated";

grant select on table "public"."published_trips" to "authenticated";

grant trigger on table "public"."published_trips" to "authenticated";

grant truncate on table "public"."published_trips" to "authenticated";

grant update on table "public"."published_trips" to "authenticated";

grant delete on table "public"."published_trips" to "postgres";

grant insert on table "public"."published_trips" to "postgres";

grant references on table "public"."published_trips" to "postgres";

grant select on table "public"."published_trips" to "postgres";

grant trigger on table "public"."published_trips" to "postgres";

grant truncate on table "public"."published_trips" to "postgres";

grant update on table "public"."published_trips" to "postgres";

grant delete on table "public"."published_trips" to "service_role";

grant insert on table "public"."published_trips" to "service_role";

grant references on table "public"."published_trips" to "service_role";

grant select on table "public"."published_trips" to "service_role";

grant trigger on table "public"."published_trips" to "service_role";

grant truncate on table "public"."published_trips" to "service_role";

grant update on table "public"."published_trips" to "service_role";

grant delete on table "public"."trip_details" to "postgres";

grant insert on table "public"."trip_details" to "postgres";

grant references on table "public"."trip_details" to "postgres";

grant select on table "public"."trip_details" to "postgres";

grant trigger on table "public"."trip_details" to "postgres";

grant truncate on table "public"."trip_details" to "postgres";

grant update on table "public"."trip_details" to "postgres";


