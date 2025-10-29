create type "public"."trip_guide_role" as enum ('owner', 'guide');

create type "public"."user_role" as enum ('participant', 'guide', 'admin', 'superadmin');

create table "public"."profiles" (
    "id" uuid not null default gen_random_uuid(),
    "first_name" text not null,
    "last_name" text not null,
    "avatar" text
);


alter table "public"."profiles" enable row level security;

create table "public"."roles" (
    "user_id" uuid not null default gen_random_uuid(),
    "role" user_role not null default 'participant'::user_role,
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."roles" enable row level security;

create table "public"."trip_guides" (
    "user_id" uuid not null default gen_random_uuid(),
    "trip_id" uuid not null default gen_random_uuid(),
    "role" trip_guide_role not null default 'guide'::trip_guide_role
);


alter table "public"."trip_guides" enable row level security;

create table "public"."trips" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "name" text not null,
    "description" text not null,
    "difficulty" bigint not null,
    "picture" text not null
);


alter table "public"."trips" enable row level security;

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX roles_pkey ON public.roles USING btree (user_id);

CREATE UNIQUE INDEX trip_guides_pkey ON public.trip_guides USING btree (user_id, trip_id);

CREATE UNIQUE INDEX trips_pkey ON public.trips USING btree (id);

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."roles" add constraint "roles_pkey" PRIMARY KEY using index "roles_pkey";

alter table "public"."trip_guides" add constraint "trip_guides_pkey" PRIMARY KEY using index "trip_guides_pkey";

alter table "public"."trips" add constraint "trips_pkey" PRIMARY KEY using index "trips_pkey";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."roles" add constraint "roles_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."roles" validate constraint "roles_user_id_fkey";

alter table "public"."trip_guides" add constraint "trip_guides_trip_id_fkey" FOREIGN KEY (trip_id) REFERENCES trips(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."trip_guides" validate constraint "trip_guides_trip_id_fkey";

alter table "public"."trip_guides" add constraint "trip_guides_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."trip_guides" validate constraint "trip_guides_user_id_fkey";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

grant delete on table "public"."roles" to "anon";

grant insert on table "public"."roles" to "anon";

grant references on table "public"."roles" to "anon";

grant select on table "public"."roles" to "anon";

grant trigger on table "public"."roles" to "anon";

grant truncate on table "public"."roles" to "anon";

grant update on table "public"."roles" to "anon";

grant delete on table "public"."roles" to "authenticated";

grant insert on table "public"."roles" to "authenticated";

grant references on table "public"."roles" to "authenticated";

grant select on table "public"."roles" to "authenticated";

grant trigger on table "public"."roles" to "authenticated";

grant truncate on table "public"."roles" to "authenticated";

grant update on table "public"."roles" to "authenticated";

grant delete on table "public"."roles" to "service_role";

grant insert on table "public"."roles" to "service_role";

grant references on table "public"."roles" to "service_role";

grant select on table "public"."roles" to "service_role";

grant trigger on table "public"."roles" to "service_role";

grant truncate on table "public"."roles" to "service_role";

grant update on table "public"."roles" to "service_role";

grant delete on table "public"."trip_guides" to "anon";

grant insert on table "public"."trip_guides" to "anon";

grant references on table "public"."trip_guides" to "anon";

grant select on table "public"."trip_guides" to "anon";

grant trigger on table "public"."trip_guides" to "anon";

grant truncate on table "public"."trip_guides" to "anon";

grant update on table "public"."trip_guides" to "anon";

grant delete on table "public"."trip_guides" to "authenticated";

grant insert on table "public"."trip_guides" to "authenticated";

grant references on table "public"."trip_guides" to "authenticated";

grant select on table "public"."trip_guides" to "authenticated";

grant trigger on table "public"."trip_guides" to "authenticated";

grant truncate on table "public"."trip_guides" to "authenticated";

grant update on table "public"."trip_guides" to "authenticated";

grant delete on table "public"."trip_guides" to "service_role";

grant insert on table "public"."trip_guides" to "service_role";

grant references on table "public"."trip_guides" to "service_role";

grant select on table "public"."trip_guides" to "service_role";

grant trigger on table "public"."trip_guides" to "service_role";

grant truncate on table "public"."trip_guides" to "service_role";

grant update on table "public"."trip_guides" to "service_role";

grant delete on table "public"."trips" to "anon";

grant insert on table "public"."trips" to "anon";

grant references on table "public"."trips" to "anon";

grant select on table "public"."trips" to "anon";

grant trigger on table "public"."trips" to "anon";

grant truncate on table "public"."trips" to "anon";

grant update on table "public"."trips" to "anon";

grant delete on table "public"."trips" to "authenticated";

grant insert on table "public"."trips" to "authenticated";

grant references on table "public"."trips" to "authenticated";

grant select on table "public"."trips" to "authenticated";

grant trigger on table "public"."trips" to "authenticated";

grant truncate on table "public"."trips" to "authenticated";

grant update on table "public"."trips" to "authenticated";

grant delete on table "public"."trips" to "service_role";

grant insert on table "public"."trips" to "service_role";

grant references on table "public"."trips" to "service_role";

grant select on table "public"."trips" to "service_role";

grant trigger on table "public"."trips" to "service_role";

grant truncate on table "public"."trips" to "service_role";

grant update on table "public"."trips" to "service_role";


