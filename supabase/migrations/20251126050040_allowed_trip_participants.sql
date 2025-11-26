
  create table "public"."allowed_trip_participants" (
    "trip_id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null default gen_random_uuid(),
    "approved_by" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."allowed_trip_participants" enable row level security;

alter table "public"."trips" add column "access_code" text;

CREATE UNIQUE INDEX allowed_trip_participants_pkey ON public.allowed_trip_participants USING btree (trip_id);

alter table "public"."allowed_trip_participants" add constraint "allowed_trip_participants_pkey" PRIMARY KEY using index "allowed_trip_participants_pkey";

alter table "public"."allowed_trip_participants" add constraint "allowed_trip_participants_approved_by_fkey" FOREIGN KEY (approved_by) REFERENCES public.profiles(id) not valid;

alter table "public"."allowed_trip_participants" validate constraint "allowed_trip_participants_approved_by_fkey";

alter table "public"."allowed_trip_participants" add constraint "allowed_trip_participants_trip_id_fkey" FOREIGN KEY (trip_id) REFERENCES public.trips(id) not valid;

alter table "public"."allowed_trip_participants" validate constraint "allowed_trip_participants_trip_id_fkey";

alter table "public"."allowed_trip_participants" add constraint "allowed_trip_participants_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) not valid;

alter table "public"."allowed_trip_participants" validate constraint "allowed_trip_participants_user_id_fkey";

alter table "public"."published_trips" add constraint "published_trips_id_fkey" FOREIGN KEY (id) REFERENCES public.trips(id) not valid;

alter table "public"."published_trips" validate constraint "published_trips_id_fkey";

grant delete on table "public"."allowed_trip_participants" to "anon";

grant insert on table "public"."allowed_trip_participants" to "anon";

grant references on table "public"."allowed_trip_participants" to "anon";

grant select on table "public"."allowed_trip_participants" to "anon";

grant trigger on table "public"."allowed_trip_participants" to "anon";

grant truncate on table "public"."allowed_trip_participants" to "anon";

grant update on table "public"."allowed_trip_participants" to "anon";

grant delete on table "public"."allowed_trip_participants" to "authenticated";

grant insert on table "public"."allowed_trip_participants" to "authenticated";

grant references on table "public"."allowed_trip_participants" to "authenticated";

grant select on table "public"."allowed_trip_participants" to "authenticated";

grant trigger on table "public"."allowed_trip_participants" to "authenticated";

grant truncate on table "public"."allowed_trip_participants" to "authenticated";

grant update on table "public"."allowed_trip_participants" to "authenticated";

grant delete on table "public"."allowed_trip_participants" to "postgres";

grant insert on table "public"."allowed_trip_participants" to "postgres";

grant references on table "public"."allowed_trip_participants" to "postgres";

grant select on table "public"."allowed_trip_participants" to "postgres";

grant trigger on table "public"."allowed_trip_participants" to "postgres";

grant truncate on table "public"."allowed_trip_participants" to "postgres";

grant update on table "public"."allowed_trip_participants" to "postgres";

grant delete on table "public"."allowed_trip_participants" to "service_role";

grant insert on table "public"."allowed_trip_participants" to "service_role";

grant references on table "public"."allowed_trip_participants" to "service_role";

grant select on table "public"."allowed_trip_participants" to "service_role";

grant trigger on table "public"."allowed_trip_participants" to "service_role";

grant truncate on table "public"."allowed_trip_participants" to "service_role";

grant update on table "public"."allowed_trip_participants" to "service_role";


