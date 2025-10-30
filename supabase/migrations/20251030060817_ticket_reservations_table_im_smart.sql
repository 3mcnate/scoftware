create table "public"."ticket_reservations" (
    "created_at" timestamp with time zone not null default now(),
    "user_id" uuid not null,
    "trip_id" uuid not null,
    "expires_at" timestamp with time zone not null default (now() + '00:15:00'::interval),
    "confirmed" boolean not null default false,
    "stripe_checkout_session_id" text not null,
    "id" uuid not null default gen_random_uuid()
);


alter table "public"."ticket_reservations" enable row level security;

CREATE UNIQUE INDEX ticket_reservations_pkey ON public.ticket_reservations USING btree (id);

CREATE UNIQUE INDEX ticket_reservations_stripe_checkout_session_id_key ON public.ticket_reservations USING btree (stripe_checkout_session_id);

CREATE UNIQUE INDEX user_trip_unique ON public.ticket_reservations USING btree (user_id, trip_id);

alter table "public"."ticket_reservations" add constraint "ticket_reservations_pkey" PRIMARY KEY using index "ticket_reservations_pkey";

alter table "public"."ticket_reservations" add constraint "ticket_reservations_stripe_checkout_session_id_key" UNIQUE using index "ticket_reservations_stripe_checkout_session_id_key";

alter table "public"."ticket_reservations" add constraint "ticket_reservations_trip_id_fkey" FOREIGN KEY (trip_id) REFERENCES trips(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."ticket_reservations" validate constraint "ticket_reservations_trip_id_fkey";

alter table "public"."ticket_reservations" add constraint "ticket_reservations_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."ticket_reservations" validate constraint "ticket_reservations_user_id_fkey";

alter table "public"."ticket_reservations" add constraint "user_trip_unique" UNIQUE using index "user_trip_unique";

grant delete on table "public"."ticket_reservations" to "anon";

grant insert on table "public"."ticket_reservations" to "anon";

grant references on table "public"."ticket_reservations" to "anon";

grant select on table "public"."ticket_reservations" to "anon";

grant trigger on table "public"."ticket_reservations" to "anon";

grant truncate on table "public"."ticket_reservations" to "anon";

grant update on table "public"."ticket_reservations" to "anon";

grant delete on table "public"."ticket_reservations" to "authenticated";

grant insert on table "public"."ticket_reservations" to "authenticated";

grant references on table "public"."ticket_reservations" to "authenticated";

grant select on table "public"."ticket_reservations" to "authenticated";

grant trigger on table "public"."ticket_reservations" to "authenticated";

grant truncate on table "public"."ticket_reservations" to "authenticated";

grant update on table "public"."ticket_reservations" to "authenticated";

grant delete on table "public"."ticket_reservations" to "service_role";

grant insert on table "public"."ticket_reservations" to "service_role";

grant references on table "public"."ticket_reservations" to "service_role";

grant select on table "public"."ticket_reservations" to "service_role";

grant trigger on table "public"."ticket_reservations" to "service_role";

grant truncate on table "public"."ticket_reservations" to "service_role";

grant update on table "public"."ticket_reservations" to "service_role";


