create table "public"."trip_ticket_info" (
    "trip_id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "participant_tickets_sold" integer not null default 0,
    "driver_tickets_sold" integer not null default 0,
    "cancelled_participant_tickets" integer not null default 0,
    "cancelled_driver_tickets" integer not null default 0
);


alter table "public"."trip_ticket_info" enable row level security;

alter table "public"."trips" drop column "cancelled_driver_tickets";

alter table "public"."trips" drop column "cancelled_participant_tickets";

alter table "public"."trips" drop column "driver_tickets_sold";

alter table "public"."trips" drop column "participant_tickets_sold";

alter table "public"."trips" add column "ends_at" timestamp with time zone;

alter table "public"."trips" add column "starts_at" timestamp with time zone;

CREATE UNIQUE INDEX trip_ticket_info_pkey ON public.trip_ticket_info USING btree (trip_id);

alter table "public"."trip_ticket_info" add constraint "trip_ticket_info_pkey" PRIMARY KEY using index "trip_ticket_info_pkey";

alter table "public"."trip_ticket_info" add constraint "trip_ticket_info_trip_id_fkey" FOREIGN KEY (trip_id) REFERENCES trips(id) not valid;

alter table "public"."trip_ticket_info" validate constraint "trip_ticket_info_trip_id_fkey";

grant delete on table "public"."trip_ticket_info" to "anon";

grant insert on table "public"."trip_ticket_info" to "anon";

grant references on table "public"."trip_ticket_info" to "anon";

grant select on table "public"."trip_ticket_info" to "anon";

grant trigger on table "public"."trip_ticket_info" to "anon";

grant truncate on table "public"."trip_ticket_info" to "anon";

grant update on table "public"."trip_ticket_info" to "anon";

grant delete on table "public"."trip_ticket_info" to "authenticated";

grant insert on table "public"."trip_ticket_info" to "authenticated";

grant references on table "public"."trip_ticket_info" to "authenticated";

grant select on table "public"."trip_ticket_info" to "authenticated";

grant trigger on table "public"."trip_ticket_info" to "authenticated";

grant truncate on table "public"."trip_ticket_info" to "authenticated";

grant update on table "public"."trip_ticket_info" to "authenticated";

grant delete on table "public"."trip_ticket_info" to "service_role";

grant insert on table "public"."trip_ticket_info" to "service_role";

grant references on table "public"."trip_ticket_info" to "service_role";

grant select on table "public"."trip_ticket_info" to "service_role";

grant trigger on table "public"."trip_ticket_info" to "service_role";

grant truncate on table "public"."trip_ticket_info" to "service_role";

grant update on table "public"."trip_ticket_info" to "service_role";


