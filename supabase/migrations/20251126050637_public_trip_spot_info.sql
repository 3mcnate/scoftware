
  create table "public"."public_trip_spot_info" (
    "id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "participant_spots" integer not null,
    "driver_spots" integer not null,
    "participant_spots_available" integer not null,
    "driver_spots_available" integer not null
      );


alter table "public"."public_trip_spot_info" enable row level security;

CREATE UNIQUE INDEX public_trip_spot_info_pkey ON public.public_trip_spot_info USING btree (id);

alter table "public"."public_trip_spot_info" add constraint "public_trip_spot_info_pkey" PRIMARY KEY using index "public_trip_spot_info_pkey";

alter table "public"."public_trip_spot_info" add constraint "public_trip_spot_info_id_fkey" FOREIGN KEY (id) REFERENCES public.trips(id) not valid;

alter table "public"."public_trip_spot_info" validate constraint "public_trip_spot_info_id_fkey";

grant delete on table "public"."allowed_trip_participants" to "postgres";

grant insert on table "public"."allowed_trip_participants" to "postgres";

grant references on table "public"."allowed_trip_participants" to "postgres";

grant select on table "public"."allowed_trip_participants" to "postgres";

grant trigger on table "public"."allowed_trip_participants" to "postgres";

grant truncate on table "public"."allowed_trip_participants" to "postgres";

grant update on table "public"."allowed_trip_participants" to "postgres";

grant delete on table "public"."public_trip_spot_info" to "anon";

grant insert on table "public"."public_trip_spot_info" to "anon";

grant references on table "public"."public_trip_spot_info" to "anon";

grant select on table "public"."public_trip_spot_info" to "anon";

grant trigger on table "public"."public_trip_spot_info" to "anon";

grant truncate on table "public"."public_trip_spot_info" to "anon";

grant update on table "public"."public_trip_spot_info" to "anon";

grant delete on table "public"."public_trip_spot_info" to "authenticated";

grant insert on table "public"."public_trip_spot_info" to "authenticated";

grant references on table "public"."public_trip_spot_info" to "authenticated";

grant select on table "public"."public_trip_spot_info" to "authenticated";

grant trigger on table "public"."public_trip_spot_info" to "authenticated";

grant truncate on table "public"."public_trip_spot_info" to "authenticated";

grant update on table "public"."public_trip_spot_info" to "authenticated";

grant delete on table "public"."public_trip_spot_info" to "postgres";

grant insert on table "public"."public_trip_spot_info" to "postgres";

grant references on table "public"."public_trip_spot_info" to "postgres";

grant select on table "public"."public_trip_spot_info" to "postgres";

grant trigger on table "public"."public_trip_spot_info" to "postgres";

grant truncate on table "public"."public_trip_spot_info" to "postgres";

grant update on table "public"."public_trip_spot_info" to "postgres";

grant delete on table "public"."public_trip_spot_info" to "service_role";

grant insert on table "public"."public_trip_spot_info" to "service_role";

grant references on table "public"."public_trip_spot_info" to "service_role";

grant select on table "public"."public_trip_spot_info" to "service_role";

grant trigger on table "public"."public_trip_spot_info" to "service_role";

grant truncate on table "public"."public_trip_spot_info" to "service_role";

grant update on table "public"."public_trip_spot_info" to "service_role";


