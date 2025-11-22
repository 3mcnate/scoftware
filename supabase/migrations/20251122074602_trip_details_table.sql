alter table "public"."trips" drop constraint "trips_difficulty_check";


  create table "public"."trip_details" (
    "trip_id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "meet" text not null,
    "return" text not null,
    "activity" text not null,
    "difficulty" text not null,
    "trail" text not null,
    "prior_experience" text not null,
    "location" text not null,
    "native_land" text not null
      );


alter table "public"."trip_details" enable row level security;

alter table "public"."trips" drop column "difficulty";

alter table "public"."trips" add column "gear" text;

alter table "public"."trips" add column "gear_questions" text[] not null;

alter table "public"."trips" add column "packing_list" text;

alter table "public"."trips" add column "ready_to_publish" boolean not null default false;

alter table "public"."trips" alter column "name" set not null;

CREATE UNIQUE INDEX trip_details_pkey ON public.trip_details USING btree (trip_id);

alter table "public"."trip_details" add constraint "trip_details_pkey" PRIMARY KEY using index "trip_details_pkey";

alter table "public"."trip_details" add constraint "trip_details_trip_id_fkey" FOREIGN KEY (trip_id) REFERENCES public.trips(id) not valid;

alter table "public"."trip_details" validate constraint "trip_details_trip_id_fkey";

grant delete on table "public"."trip_details" to "anon";

grant insert on table "public"."trip_details" to "anon";

grant references on table "public"."trip_details" to "anon";

grant select on table "public"."trip_details" to "anon";

grant trigger on table "public"."trip_details" to "anon";

grant truncate on table "public"."trip_details" to "anon";

grant update on table "public"."trip_details" to "anon";

grant delete on table "public"."trip_details" to "authenticated";

grant insert on table "public"."trip_details" to "authenticated";

grant references on table "public"."trip_details" to "authenticated";

grant select on table "public"."trip_details" to "authenticated";

grant trigger on table "public"."trip_details" to "authenticated";

grant truncate on table "public"."trip_details" to "authenticated";

grant update on table "public"."trip_details" to "authenticated";

grant delete on table "public"."trip_details" to "postgres";

grant insert on table "public"."trip_details" to "postgres";

grant references on table "public"."trip_details" to "postgres";

grant select on table "public"."trip_details" to "postgres";

grant trigger on table "public"."trip_details" to "postgres";

grant truncate on table "public"."trip_details" to "postgres";

grant update on table "public"."trip_details" to "postgres";

grant delete on table "public"."trip_details" to "service_role";

grant insert on table "public"."trip_details" to "service_role";

grant references on table "public"."trip_details" to "service_role";

grant select on table "public"."trip_details" to "service_role";

grant trigger on table "public"."trip_details" to "service_role";

grant truncate on table "public"."trip_details" to "service_role";

grant update on table "public"."trip_details" to "service_role";


