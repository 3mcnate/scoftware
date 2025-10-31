create type "public"."guide_position" as enum ('new_guide', 'guide', 'longboard', 'alum');

create type "public"."membership_length" as enum ('semester', 'year');

create type "public"."waitlist_status" as enum ('waiting', 'notification_sent', 'signed_up', 'expired');

alter table "public"."participant_info" drop constraint "participant_info_id_fkey";

alter table "public"."tickets" drop constraint "tickets_stripe_checkout_session_id_key";

alter table "public"."participant_info" drop constraint "participant_info_pkey";

drop index if exists "public"."participant_info_pkey";

drop index if exists "public"."tickets_stripe_checkout_session_id_key";

create table "public"."guide_info" (
    "user_id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "has_car" boolean not null,
    "guide_class" integer not null,
    "active" boolean not null default true,
    "position" guide_position not null default 'new_guide'::guide_position
);


alter table "public"."guide_info" enable row level security;

create table "public"."hard_trip_participants" (
    "user_id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "approved_by" uuid not null,
    "notes" text
);


alter table "public"."hard_trip_participants" enable row level security;

create table "public"."memberships" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "expires_at" timestamp with time zone not null,
    "stripe_payment_id" text not null,
    "length" membership_length not null
);


alter table "public"."memberships" enable row level security;

create table "public"."trip_budgets" (
    "trip_id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "car_rental_price" numeric not null default '0'::numeric,
    "car_mpgs" real[] not null default '{0}'::real[],
    "total_miles" integer not null default 0,
    "breakfasts" integer not null default 0,
    "lunches" integer not null default 0,
    "dinners" integer not null default 0,
    "snacks" integer not null default 0,
    "permit_cost" numeric not null default '0'::numeric,
    "parking_cost" numeric not null default '0'::numeric,
    "other" jsonb
);


alter table "public"."trip_budgets" enable row level security;

create table "public"."waitlist_signups" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone default now(),
    "user_id" uuid not null,
    "trip_id" uuid not null default gen_random_uuid(),
    "status" waitlist_status not null default 'waiting'::waitlist_status,
    "open_until" timestamp with time zone,
    "notification_sent_at" timestamp with time zone
);


alter table "public"."waitlist_signups" enable row level security;

alter table "public"."participant_info" drop column "id";

alter table "public"."participant_info" add column "health_insurance_bin_number" text;

alter table "public"."participant_info" add column "health_insurance_group_number" text;

alter table "public"."participant_info" add column "health_insurance_member_id" text;

alter table "public"."participant_info" add column "health_insurance_provider" text;

alter table "public"."participant_info" add column "user_id" uuid not null;

alter table "public"."tickets" drop column "stripe_checkout_session_id";

alter table "public"."tickets" add column "cancelled_at" timestamp with time zone;

alter table "public"."tickets" add column "stripe_payment_id" text not null;

alter table "public"."trips" drop column "total_driver_tickets";

alter table "public"."trips" drop column "total_participant_tickets";

alter table "public"."trips" add column "cancelled_driver_tickets" integer not null default 0;

alter table "public"."trips" add column "cancelled_participant_tickets" integer not null default 0;

alter table "public"."trips" add column "driver_spots" integer not null default 0;

alter table "public"."trips" add column "participant_spots" integer not null default 8;

alter table "public"."trips" alter column "participant_tickets_sold" set default 0;

alter table "public"."trips" alter column "participant_tickets_sold" set not null;

CREATE UNIQUE INDEX guide_info_pkey ON public.guide_info USING btree (user_id);

CREATE UNIQUE INDEX hard_trip_participants_pkey ON public.hard_trip_participants USING btree (user_id);

CREATE UNIQUE INDEX memberships_pkey ON public.memberships USING btree (id);

CREATE UNIQUE INDEX memberships_stripe_payment_id_key ON public.memberships USING btree (stripe_payment_id);

CREATE UNIQUE INDEX trip_budgets_pkey ON public.trip_budgets USING btree (trip_id);

CREATE UNIQUE INDEX waitlist_signups_pkey ON public.waitlist_signups USING btree (id);

CREATE UNIQUE INDEX participant_info_pkey ON public.participant_info USING btree (user_id);

CREATE UNIQUE INDEX tickets_stripe_checkout_session_id_key ON public.tickets USING btree (stripe_payment_id);

alter table "public"."guide_info" add constraint "guide_info_pkey" PRIMARY KEY using index "guide_info_pkey";

alter table "public"."hard_trip_participants" add constraint "hard_trip_participants_pkey" PRIMARY KEY using index "hard_trip_participants_pkey";

alter table "public"."memberships" add constraint "memberships_pkey" PRIMARY KEY using index "memberships_pkey";

alter table "public"."trip_budgets" add constraint "trip_budgets_pkey" PRIMARY KEY using index "trip_budgets_pkey";

alter table "public"."waitlist_signups" add constraint "waitlist_signups_pkey" PRIMARY KEY using index "waitlist_signups_pkey";

alter table "public"."participant_info" add constraint "participant_info_pkey" PRIMARY KEY using index "participant_info_pkey";

alter table "public"."guide_info" add constraint "guide_info_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) not valid;

alter table "public"."guide_info" validate constraint "guide_info_user_id_fkey";

alter table "public"."hard_trip_participants" add constraint "hard_trip_participants_approved_by_fkey" FOREIGN KEY (approved_by) REFERENCES profiles(id) not valid;

alter table "public"."hard_trip_participants" validate constraint "hard_trip_participants_approved_by_fkey";

alter table "public"."hard_trip_participants" add constraint "hard_trip_participants_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) not valid;

alter table "public"."hard_trip_participants" validate constraint "hard_trip_participants_user_id_fkey";

alter table "public"."memberships" add constraint "memberships_stripe_payment_id_key" UNIQUE using index "memberships_stripe_payment_id_key";

alter table "public"."participant_info" add constraint "participant_info_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) not valid;

alter table "public"."participant_info" validate constraint "participant_info_user_id_fkey";

alter table "public"."waitlist_signups" add constraint "waitlist_signups_trip_id_fkey" FOREIGN KEY (trip_id) REFERENCES trips(id) not valid;

alter table "public"."waitlist_signups" validate constraint "waitlist_signups_trip_id_fkey";

alter table "public"."waitlist_signups" add constraint "waitlist_signups_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) not valid;

alter table "public"."waitlist_signups" validate constraint "waitlist_signups_user_id_fkey";

alter table "public"."tickets" add constraint "tickets_stripe_checkout_session_id_key" UNIQUE using index "tickets_stripe_checkout_session_id_key";

grant delete on table "public"."guide_info" to "anon";

grant insert on table "public"."guide_info" to "anon";

grant references on table "public"."guide_info" to "anon";

grant select on table "public"."guide_info" to "anon";

grant trigger on table "public"."guide_info" to "anon";

grant truncate on table "public"."guide_info" to "anon";

grant update on table "public"."guide_info" to "anon";

grant delete on table "public"."guide_info" to "authenticated";

grant insert on table "public"."guide_info" to "authenticated";

grant references on table "public"."guide_info" to "authenticated";

grant select on table "public"."guide_info" to "authenticated";

grant trigger on table "public"."guide_info" to "authenticated";

grant truncate on table "public"."guide_info" to "authenticated";

grant update on table "public"."guide_info" to "authenticated";

grant delete on table "public"."guide_info" to "service_role";

grant insert on table "public"."guide_info" to "service_role";

grant references on table "public"."guide_info" to "service_role";

grant select on table "public"."guide_info" to "service_role";

grant trigger on table "public"."guide_info" to "service_role";

grant truncate on table "public"."guide_info" to "service_role";

grant update on table "public"."guide_info" to "service_role";

grant delete on table "public"."hard_trip_participants" to "anon";

grant insert on table "public"."hard_trip_participants" to "anon";

grant references on table "public"."hard_trip_participants" to "anon";

grant select on table "public"."hard_trip_participants" to "anon";

grant trigger on table "public"."hard_trip_participants" to "anon";

grant truncate on table "public"."hard_trip_participants" to "anon";

grant update on table "public"."hard_trip_participants" to "anon";

grant delete on table "public"."hard_trip_participants" to "authenticated";

grant insert on table "public"."hard_trip_participants" to "authenticated";

grant references on table "public"."hard_trip_participants" to "authenticated";

grant select on table "public"."hard_trip_participants" to "authenticated";

grant trigger on table "public"."hard_trip_participants" to "authenticated";

grant truncate on table "public"."hard_trip_participants" to "authenticated";

grant update on table "public"."hard_trip_participants" to "authenticated";

grant delete on table "public"."hard_trip_participants" to "service_role";

grant insert on table "public"."hard_trip_participants" to "service_role";

grant references on table "public"."hard_trip_participants" to "service_role";

grant select on table "public"."hard_trip_participants" to "service_role";

grant trigger on table "public"."hard_trip_participants" to "service_role";

grant truncate on table "public"."hard_trip_participants" to "service_role";

grant update on table "public"."hard_trip_participants" to "service_role";

grant delete on table "public"."memberships" to "anon";

grant insert on table "public"."memberships" to "anon";

grant references on table "public"."memberships" to "anon";

grant select on table "public"."memberships" to "anon";

grant trigger on table "public"."memberships" to "anon";

grant truncate on table "public"."memberships" to "anon";

grant update on table "public"."memberships" to "anon";

grant delete on table "public"."memberships" to "authenticated";

grant insert on table "public"."memberships" to "authenticated";

grant references on table "public"."memberships" to "authenticated";

grant select on table "public"."memberships" to "authenticated";

grant trigger on table "public"."memberships" to "authenticated";

grant truncate on table "public"."memberships" to "authenticated";

grant update on table "public"."memberships" to "authenticated";

grant delete on table "public"."memberships" to "service_role";

grant insert on table "public"."memberships" to "service_role";

grant references on table "public"."memberships" to "service_role";

grant select on table "public"."memberships" to "service_role";

grant trigger on table "public"."memberships" to "service_role";

grant truncate on table "public"."memberships" to "service_role";

grant update on table "public"."memberships" to "service_role";

grant delete on table "public"."trip_budgets" to "anon";

grant insert on table "public"."trip_budgets" to "anon";

grant references on table "public"."trip_budgets" to "anon";

grant select on table "public"."trip_budgets" to "anon";

grant trigger on table "public"."trip_budgets" to "anon";

grant truncate on table "public"."trip_budgets" to "anon";

grant update on table "public"."trip_budgets" to "anon";

grant delete on table "public"."trip_budgets" to "authenticated";

grant insert on table "public"."trip_budgets" to "authenticated";

grant references on table "public"."trip_budgets" to "authenticated";

grant select on table "public"."trip_budgets" to "authenticated";

grant trigger on table "public"."trip_budgets" to "authenticated";

grant truncate on table "public"."trip_budgets" to "authenticated";

grant update on table "public"."trip_budgets" to "authenticated";

grant delete on table "public"."trip_budgets" to "service_role";

grant insert on table "public"."trip_budgets" to "service_role";

grant references on table "public"."trip_budgets" to "service_role";

grant select on table "public"."trip_budgets" to "service_role";

grant trigger on table "public"."trip_budgets" to "service_role";

grant truncate on table "public"."trip_budgets" to "service_role";

grant update on table "public"."trip_budgets" to "service_role";

grant delete on table "public"."waitlist_signups" to "anon";

grant insert on table "public"."waitlist_signups" to "anon";

grant references on table "public"."waitlist_signups" to "anon";

grant select on table "public"."waitlist_signups" to "anon";

grant trigger on table "public"."waitlist_signups" to "anon";

grant truncate on table "public"."waitlist_signups" to "anon";

grant update on table "public"."waitlist_signups" to "anon";

grant delete on table "public"."waitlist_signups" to "authenticated";

grant insert on table "public"."waitlist_signups" to "authenticated";

grant references on table "public"."waitlist_signups" to "authenticated";

grant select on table "public"."waitlist_signups" to "authenticated";

grant trigger on table "public"."waitlist_signups" to "authenticated";

grant truncate on table "public"."waitlist_signups" to "authenticated";

grant update on table "public"."waitlist_signups" to "authenticated";

grant delete on table "public"."waitlist_signups" to "service_role";

grant insert on table "public"."waitlist_signups" to "service_role";

grant references on table "public"."waitlist_signups" to "service_role";

grant select on table "public"."waitlist_signups" to "service_role";

grant trigger on table "public"."waitlist_signups" to "service_role";

grant truncate on table "public"."waitlist_signups" to "service_role";

grant update on table "public"."waitlist_signups" to "service_role";


