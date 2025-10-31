create extension if not exists "btree_gist" with schema "public" version '1.7';

create table "public"."trip_cycles" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "name" text not null,
    "starts_at" timestamp with time zone not null,
    "ends_at" timestamp with time zone not null,
    "trips_published_at" timestamp with time zone not null,
    "member_signups_start_at" timestamp with time zone not null,
    "nonmember_signups_start_at" timestamp with time zone not null,
    "range" tstzrange generated always as (tstzrange(starts_at, ends_at, '[)'::text)) stored
);


alter table "public"."trip_cycles" enable row level security;

alter table "public"."trips" alter column "ends_at" set not null;

alter table "public"."trips" alter column "starts_at" set not null;

select 1; -- CREATE INDEX no_overlapping_trip_cycles ON public.trip_cycles USING gist (range);

CREATE UNIQUE INDEX trip_cycles_pkey ON public.trip_cycles USING btree (id);

alter table "public"."trip_cycles" add constraint "trip_cycles_pkey" PRIMARY KEY using index "trip_cycles_pkey";

alter table "public"."trip_cycles" add constraint "end_after_start" CHECK ((starts_at < ends_at)) not valid;

alter table "public"."trip_cycles" validate constraint "end_after_start";

alter table "public"."trip_cycles" add constraint "no_overlapping_trip_cycles" EXCLUDE USING gist (range WITH &&);

grant delete on table "public"."trip_cycles" to "anon";

grant insert on table "public"."trip_cycles" to "anon";

grant references on table "public"."trip_cycles" to "anon";

grant select on table "public"."trip_cycles" to "anon";

grant trigger on table "public"."trip_cycles" to "anon";

grant truncate on table "public"."trip_cycles" to "anon";

grant update on table "public"."trip_cycles" to "anon";

grant delete on table "public"."trip_cycles" to "authenticated";

grant insert on table "public"."trip_cycles" to "authenticated";

grant references on table "public"."trip_cycles" to "authenticated";

grant select on table "public"."trip_cycles" to "authenticated";

grant trigger on table "public"."trip_cycles" to "authenticated";

grant truncate on table "public"."trip_cycles" to "authenticated";

grant update on table "public"."trip_cycles" to "authenticated";

grant delete on table "public"."trip_cycles" to "service_role";

grant insert on table "public"."trip_cycles" to "service_role";

grant references on table "public"."trip_cycles" to "service_role";

grant select on table "public"."trip_cycles" to "service_role";

grant trigger on table "public"."trip_cycles" to "service_role";

grant truncate on table "public"."trip_cycles" to "service_role";

grant update on table "public"."trip_cycles" to "service_role";


