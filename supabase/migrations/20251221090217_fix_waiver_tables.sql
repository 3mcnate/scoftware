
  create table "public"."trip_waivers" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "trip_id" uuid not null,
    "content" text not null,
    "type" public.ticket_type not null,
    "template_id" uuid not null
      );


alter table "public"."trip_waivers" enable row level security;


  create table "public"."waiver_events" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "event" public.waiver_event not null,
    "user_id" uuid not null,
    "trip_id" uuid not null,
    "ip_address" text not null,
    "user_agent" text not null default 'unknown'::text,
    "file_path" text
      );


alter table "public"."waiver_events" enable row level security;

CREATE UNIQUE INDEX trip_ticket_type_unique ON public.trip_waivers USING btree (trip_id, type);

CREATE UNIQUE INDEX trip_waivers_pkey ON public.trip_waivers USING btree (id);

CREATE UNIQUE INDEX waiver_events_pkey ON public.waiver_events USING btree (id);

alter table "public"."trip_waivers" add constraint "trip_waivers_pkey" PRIMARY KEY using index "trip_waivers_pkey";

alter table "public"."waiver_events" add constraint "waiver_events_pkey" PRIMARY KEY using index "waiver_events_pkey";

alter table "public"."trip_waivers" add constraint "trip_ticket_type_unique" UNIQUE using index "trip_ticket_type_unique";

alter table "public"."trip_waivers" add constraint "trip_waivers_template_id_fkey" FOREIGN KEY (template_id) REFERENCES public.waiver_templates(id) not valid;

alter table "public"."trip_waivers" validate constraint "trip_waivers_template_id_fkey";

alter table "public"."trip_waivers" add constraint "trip_waivers_trip_id_fkey" FOREIGN KEY (trip_id) REFERENCES public.trips(id) not valid;

alter table "public"."trip_waivers" validate constraint "trip_waivers_trip_id_fkey";

alter table "public"."waiver_events" add constraint "waiver_events_trip_id_fkey" FOREIGN KEY (trip_id) REFERENCES public.trips(id) not valid;

alter table "public"."waiver_events" validate constraint "waiver_events_trip_id_fkey";

alter table "public"."waiver_events" add constraint "waiver_events_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) not valid;

alter table "public"."waiver_events" validate constraint "waiver_events_user_id_fkey";

grant delete on table "public"."trip_waivers" to "anon";

grant insert on table "public"."trip_waivers" to "anon";

grant references on table "public"."trip_waivers" to "anon";

grant select on table "public"."trip_waivers" to "anon";

grant trigger on table "public"."trip_waivers" to "anon";

grant truncate on table "public"."trip_waivers" to "anon";

grant update on table "public"."trip_waivers" to "anon";

grant delete on table "public"."trip_waivers" to "authenticated";

grant insert on table "public"."trip_waivers" to "authenticated";

grant references on table "public"."trip_waivers" to "authenticated";

grant select on table "public"."trip_waivers" to "authenticated";

grant trigger on table "public"."trip_waivers" to "authenticated";

grant truncate on table "public"."trip_waivers" to "authenticated";

grant update on table "public"."trip_waivers" to "authenticated";

grant delete on table "public"."trip_waivers" to "service_role";

grant insert on table "public"."trip_waivers" to "service_role";

grant references on table "public"."trip_waivers" to "service_role";

grant select on table "public"."trip_waivers" to "service_role";

grant trigger on table "public"."trip_waivers" to "service_role";

grant truncate on table "public"."trip_waivers" to "service_role";

grant update on table "public"."trip_waivers" to "service_role";

grant delete on table "public"."waiver_events" to "anon";

grant insert on table "public"."waiver_events" to "anon";

grant references on table "public"."waiver_events" to "anon";

grant select on table "public"."waiver_events" to "anon";

grant trigger on table "public"."waiver_events" to "anon";

grant truncate on table "public"."waiver_events" to "anon";

grant update on table "public"."waiver_events" to "anon";

grant delete on table "public"."waiver_events" to "authenticated";

grant insert on table "public"."waiver_events" to "authenticated";

grant references on table "public"."waiver_events" to "authenticated";

grant select on table "public"."waiver_events" to "authenticated";

grant trigger on table "public"."waiver_events" to "authenticated";

grant truncate on table "public"."waiver_events" to "authenticated";

grant update on table "public"."waiver_events" to "authenticated";

grant delete on table "public"."waiver_events" to "service_role";

grant insert on table "public"."waiver_events" to "service_role";

grant references on table "public"."waiver_events" to "service_role";

grant select on table "public"."waiver_events" to "service_role";

grant trigger on table "public"."waiver_events" to "service_role";

grant truncate on table "public"."waiver_events" to "service_role";

grant update on table "public"."waiver_events" to "service_role";


