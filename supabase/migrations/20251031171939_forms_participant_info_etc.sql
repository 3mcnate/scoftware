revoke delete on table "public"."ticket_reservations" from "anon";

revoke insert on table "public"."ticket_reservations" from "anon";

revoke references on table "public"."ticket_reservations" from "anon";

revoke select on table "public"."ticket_reservations" from "anon";

revoke trigger on table "public"."ticket_reservations" from "anon";

revoke truncate on table "public"."ticket_reservations" from "anon";

revoke update on table "public"."ticket_reservations" from "anon";

revoke delete on table "public"."ticket_reservations" from "authenticated";

revoke insert on table "public"."ticket_reservations" from "authenticated";

revoke references on table "public"."ticket_reservations" from "authenticated";

revoke select on table "public"."ticket_reservations" from "authenticated";

revoke trigger on table "public"."ticket_reservations" from "authenticated";

revoke truncate on table "public"."ticket_reservations" from "authenticated";

revoke update on table "public"."ticket_reservations" from "authenticated";

revoke delete on table "public"."ticket_reservations" from "service_role";

revoke insert on table "public"."ticket_reservations" from "service_role";

revoke references on table "public"."ticket_reservations" from "service_role";

revoke select on table "public"."ticket_reservations" from "service_role";

revoke trigger on table "public"."ticket_reservations" from "service_role";

revoke truncate on table "public"."ticket_reservations" from "service_role";

revoke update on table "public"."ticket_reservations" from "service_role";

alter table "public"."ticket_reservations" drop constraint "ticket_reservations_stripe_checkout_session_id_key";

alter table "public"."ticket_reservations" drop constraint "ticket_reservations_trip_id_fkey";

alter table "public"."ticket_reservations" drop constraint "ticket_reservations_user_id_fkey";

alter table "public"."ticket_reservations" drop constraint "user_trip_unique";

alter table "public"."ticket_reservations" drop constraint "ticket_reservations_pkey";

drop index if exists "public"."ticket_reservations_pkey";

drop index if exists "public"."ticket_reservations_stripe_checkout_session_id_key";

drop index if exists "public"."user_trip_unique";

drop table "public"."ticket_reservations";

create table "public"."checkout_sessions" (
    "created_at" timestamp with time zone not null default now(),
    "user_id" uuid not null,
    "trip_id" uuid not null,
    "expires_at" timestamp with time zone not null default (now() + '00:15:00'::interval),
    "confirmed" boolean not null default false,
    "stripe_checkout_session_id" text,
    "id" uuid not null default gen_random_uuid()
);


alter table "public"."checkout_sessions" enable row level security;

create table "public"."form_responses" (
    "id" uuid not null default gen_random_uuid(),
    "form_id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "response" jsonb not null,
    "user_id" uuid not null
);


alter table "public"."form_responses" enable row level security;

create table "public"."forms" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "form_schema" jsonb not null
);


alter table "public"."forms" enable row level security;

create table "public"."participant_info" (
    "id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "allergies" text,
    "medical_history" text,
    "medications" text,
    "dietary_restrictions" text,
    "emergency_contact_name" text,
    "emergency_contact_phone_number" text,
    "emergency_contact_relationship" text
);


alter table "public"."participant_info" enable row level security;

alter table "public"."trip_guides" drop column "role";

CREATE UNIQUE INDEX form_responses_pkey ON public.form_responses USING btree (id);

CREATE UNIQUE INDEX forms_pkey ON public.forms USING btree (id);

CREATE UNIQUE INDEX participant_info_pkey ON public.participant_info USING btree (id);

CREATE UNIQUE INDEX ticket_reservations_pkey ON public.checkout_sessions USING btree (id);

CREATE UNIQUE INDEX ticket_reservations_stripe_checkout_session_id_key ON public.checkout_sessions USING btree (stripe_checkout_session_id);

CREATE UNIQUE INDEX user_trip_unique ON public.checkout_sessions USING btree (user_id, trip_id);

alter table "public"."checkout_sessions" add constraint "ticket_reservations_pkey" PRIMARY KEY using index "ticket_reservations_pkey";

alter table "public"."form_responses" add constraint "form_responses_pkey" PRIMARY KEY using index "form_responses_pkey";

alter table "public"."forms" add constraint "forms_pkey" PRIMARY KEY using index "forms_pkey";

alter table "public"."participant_info" add constraint "participant_info_pkey" PRIMARY KEY using index "participant_info_pkey";

alter table "public"."checkout_sessions" add constraint "ticket_reservations_stripe_checkout_session_id_key" UNIQUE using index "ticket_reservations_stripe_checkout_session_id_key";

alter table "public"."checkout_sessions" add constraint "ticket_reservations_trip_id_fkey" FOREIGN KEY (trip_id) REFERENCES trips(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."checkout_sessions" validate constraint "ticket_reservations_trip_id_fkey";

alter table "public"."checkout_sessions" add constraint "ticket_reservations_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."checkout_sessions" validate constraint "ticket_reservations_user_id_fkey";

alter table "public"."checkout_sessions" add constraint "user_trip_unique" UNIQUE using index "user_trip_unique";

alter table "public"."form_responses" add constraint "form_responses_form_id_fkey" FOREIGN KEY (form_id) REFERENCES forms(id) not valid;

alter table "public"."form_responses" validate constraint "form_responses_form_id_fkey";

alter table "public"."form_responses" add constraint "form_responses_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) not valid;

alter table "public"."form_responses" validate constraint "form_responses_user_id_fkey";

alter table "public"."participant_info" add constraint "participant_info_id_fkey" FOREIGN KEY (id) REFERENCES profiles(id) not valid;

alter table "public"."participant_info" validate constraint "participant_info_id_fkey";

grant delete on table "public"."checkout_sessions" to "anon";

grant insert on table "public"."checkout_sessions" to "anon";

grant references on table "public"."checkout_sessions" to "anon";

grant select on table "public"."checkout_sessions" to "anon";

grant trigger on table "public"."checkout_sessions" to "anon";

grant truncate on table "public"."checkout_sessions" to "anon";

grant update on table "public"."checkout_sessions" to "anon";

grant delete on table "public"."checkout_sessions" to "authenticated";

grant insert on table "public"."checkout_sessions" to "authenticated";

grant references on table "public"."checkout_sessions" to "authenticated";

grant select on table "public"."checkout_sessions" to "authenticated";

grant trigger on table "public"."checkout_sessions" to "authenticated";

grant truncate on table "public"."checkout_sessions" to "authenticated";

grant update on table "public"."checkout_sessions" to "authenticated";

grant delete on table "public"."checkout_sessions" to "service_role";

grant insert on table "public"."checkout_sessions" to "service_role";

grant references on table "public"."checkout_sessions" to "service_role";

grant select on table "public"."checkout_sessions" to "service_role";

grant trigger on table "public"."checkout_sessions" to "service_role";

grant truncate on table "public"."checkout_sessions" to "service_role";

grant update on table "public"."checkout_sessions" to "service_role";

grant delete on table "public"."form_responses" to "anon";

grant insert on table "public"."form_responses" to "anon";

grant references on table "public"."form_responses" to "anon";

grant select on table "public"."form_responses" to "anon";

grant trigger on table "public"."form_responses" to "anon";

grant truncate on table "public"."form_responses" to "anon";

grant update on table "public"."form_responses" to "anon";

grant delete on table "public"."form_responses" to "authenticated";

grant insert on table "public"."form_responses" to "authenticated";

grant references on table "public"."form_responses" to "authenticated";

grant select on table "public"."form_responses" to "authenticated";

grant trigger on table "public"."form_responses" to "authenticated";

grant truncate on table "public"."form_responses" to "authenticated";

grant update on table "public"."form_responses" to "authenticated";

grant delete on table "public"."form_responses" to "service_role";

grant insert on table "public"."form_responses" to "service_role";

grant references on table "public"."form_responses" to "service_role";

grant select on table "public"."form_responses" to "service_role";

grant trigger on table "public"."form_responses" to "service_role";

grant truncate on table "public"."form_responses" to "service_role";

grant update on table "public"."form_responses" to "service_role";

grant delete on table "public"."forms" to "anon";

grant insert on table "public"."forms" to "anon";

grant references on table "public"."forms" to "anon";

grant select on table "public"."forms" to "anon";

grant trigger on table "public"."forms" to "anon";

grant truncate on table "public"."forms" to "anon";

grant update on table "public"."forms" to "anon";

grant delete on table "public"."forms" to "authenticated";

grant insert on table "public"."forms" to "authenticated";

grant references on table "public"."forms" to "authenticated";

grant select on table "public"."forms" to "authenticated";

grant trigger on table "public"."forms" to "authenticated";

grant truncate on table "public"."forms" to "authenticated";

grant update on table "public"."forms" to "authenticated";

grant delete on table "public"."forms" to "service_role";

grant insert on table "public"."forms" to "service_role";

grant references on table "public"."forms" to "service_role";

grant select on table "public"."forms" to "service_role";

grant trigger on table "public"."forms" to "service_role";

grant truncate on table "public"."forms" to "service_role";

grant update on table "public"."forms" to "service_role";

grant delete on table "public"."participant_info" to "anon";

grant insert on table "public"."participant_info" to "anon";

grant references on table "public"."participant_info" to "anon";

grant select on table "public"."participant_info" to "anon";

grant trigger on table "public"."participant_info" to "anon";

grant truncate on table "public"."participant_info" to "anon";

grant update on table "public"."participant_info" to "anon";

grant delete on table "public"."participant_info" to "authenticated";

grant insert on table "public"."participant_info" to "authenticated";

grant references on table "public"."participant_info" to "authenticated";

grant select on table "public"."participant_info" to "authenticated";

grant trigger on table "public"."participant_info" to "authenticated";

grant truncate on table "public"."participant_info" to "authenticated";

grant update on table "public"."participant_info" to "authenticated";

grant delete on table "public"."participant_info" to "service_role";

grant insert on table "public"."participant_info" to "service_role";

grant references on table "public"."participant_info" to "service_role";

grant select on table "public"."participant_info" to "service_role";

grant trigger on table "public"."participant_info" to "service_role";

grant truncate on table "public"."participant_info" to "service_role";

grant update on table "public"."participant_info" to "service_role";


