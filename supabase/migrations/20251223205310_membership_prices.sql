drop trigger if exists "checkout_sessions_enforce_times_trg" on "public"."checkout_sessions";

revoke delete on table "public"."checkout_sessions" from "anon";

revoke insert on table "public"."checkout_sessions" from "anon";

revoke references on table "public"."checkout_sessions" from "anon";

revoke select on table "public"."checkout_sessions" from "anon";

revoke trigger on table "public"."checkout_sessions" from "anon";

revoke truncate on table "public"."checkout_sessions" from "anon";

revoke update on table "public"."checkout_sessions" from "anon";

revoke delete on table "public"."checkout_sessions" from "authenticated";

revoke insert on table "public"."checkout_sessions" from "authenticated";

revoke references on table "public"."checkout_sessions" from "authenticated";

revoke select on table "public"."checkout_sessions" from "authenticated";

revoke trigger on table "public"."checkout_sessions" from "authenticated";

revoke truncate on table "public"."checkout_sessions" from "authenticated";

revoke update on table "public"."checkout_sessions" from "authenticated";

revoke delete on table "public"."checkout_sessions" from "service_role";

revoke insert on table "public"."checkout_sessions" from "service_role";

revoke references on table "public"."checkout_sessions" from "service_role";

revoke select on table "public"."checkout_sessions" from "service_role";

revoke trigger on table "public"."checkout_sessions" from "service_role";

revoke truncate on table "public"."checkout_sessions" from "service_role";

revoke update on table "public"."checkout_sessions" from "service_role";

alter table "public"."checkout_sessions" drop constraint "checkout_sessions_trip_id_fkey";

alter table "public"."checkout_sessions" drop constraint "checkout_sessions_user_id_fkey";

alter table "public"."checkout_sessions" drop constraint "ticket_reservations_stripe_checkout_session_id_key";

alter table "public"."checkout_sessions" drop constraint "user_trip_unique";

alter table "public"."checkout_sessions" drop constraint "ticket_reservations_pkey";

drop index if exists "public"."ticket_reservations_stripe_checkout_session_id_key";

drop index if exists "public"."ticket_reservations_pkey";

drop index if exists "public"."user_trip_unique";

drop table "public"."checkout_sessions";


  create table "public"."membership_prices" (
    "length" public.membership_length not null,
    "created_at" timestamp with time zone not null default now(),
    "stripe_price_id" text not null,
    "unit_amount" integer not null
      );


alter table "public"."membership_prices" enable row level security;


  create table "public"."trip_checkout_sessions" (
    "created_at" timestamp with time zone not null default now(),
    "user_id" uuid not null,
    "trip_id" uuid not null,
    "expires_at" timestamp with time zone not null default (now() + '00:15:00'::interval),
    "stripe_cs_id" text not null,
    "status" public.checkout_session_status not null default 'open'::public.checkout_session_status,
    "price_id" text not null
      );


alter table "public"."trip_checkout_sessions" enable row level security;

CREATE UNIQUE INDEX membership_prices_pkey ON public.membership_prices USING btree (length);

CREATE UNIQUE INDEX ticket_reservations_pkey ON public.trip_checkout_sessions USING btree (stripe_cs_id);

CREATE UNIQUE INDEX user_trip_unique ON public.trip_checkout_sessions USING btree (user_id, trip_id);

alter table "public"."membership_prices" add constraint "membership_prices_pkey" PRIMARY KEY using index "membership_prices_pkey";

alter table "public"."trip_checkout_sessions" add constraint "ticket_reservations_pkey" PRIMARY KEY using index "ticket_reservations_pkey";

alter table "public"."trip_checkout_sessions" add constraint "checkout_sessions_trip_id_fkey" FOREIGN KEY (trip_id) REFERENCES public.trips(id) not valid;

alter table "public"."trip_checkout_sessions" validate constraint "checkout_sessions_trip_id_fkey";

alter table "public"."trip_checkout_sessions" add constraint "checkout_sessions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) not valid;

alter table "public"."trip_checkout_sessions" validate constraint "checkout_sessions_user_id_fkey";

alter table "public"."trip_checkout_sessions" add constraint "trip_checkout_sessions_price_id_fkey" FOREIGN KEY (price_id) REFERENCES public.trip_prices(stripe_price_id) not valid;

alter table "public"."trip_checkout_sessions" validate constraint "trip_checkout_sessions_price_id_fkey";

alter table "public"."trip_checkout_sessions" add constraint "user_trip_unique" UNIQUE using index "user_trip_unique";

grant delete on table "public"."membership_prices" to "anon";

grant insert on table "public"."membership_prices" to "anon";

grant references on table "public"."membership_prices" to "anon";

grant select on table "public"."membership_prices" to "anon";

grant trigger on table "public"."membership_prices" to "anon";

grant truncate on table "public"."membership_prices" to "anon";

grant update on table "public"."membership_prices" to "anon";

grant delete on table "public"."membership_prices" to "authenticated";

grant insert on table "public"."membership_prices" to "authenticated";

grant references on table "public"."membership_prices" to "authenticated";

grant select on table "public"."membership_prices" to "authenticated";

grant trigger on table "public"."membership_prices" to "authenticated";

grant truncate on table "public"."membership_prices" to "authenticated";

grant update on table "public"."membership_prices" to "authenticated";

grant delete on table "public"."membership_prices" to "postgres";

grant insert on table "public"."membership_prices" to "postgres";

grant references on table "public"."membership_prices" to "postgres";

grant select on table "public"."membership_prices" to "postgres";

grant trigger on table "public"."membership_prices" to "postgres";

grant truncate on table "public"."membership_prices" to "postgres";

grant update on table "public"."membership_prices" to "postgres";

grant delete on table "public"."membership_prices" to "service_role";

grant insert on table "public"."membership_prices" to "service_role";

grant references on table "public"."membership_prices" to "service_role";

grant select on table "public"."membership_prices" to "service_role";

grant trigger on table "public"."membership_prices" to "service_role";

grant truncate on table "public"."membership_prices" to "service_role";

grant update on table "public"."membership_prices" to "service_role";

grant delete on table "public"."trip_checkout_sessions" to "anon";

grant insert on table "public"."trip_checkout_sessions" to "anon";

grant references on table "public"."trip_checkout_sessions" to "anon";

grant select on table "public"."trip_checkout_sessions" to "anon";

grant trigger on table "public"."trip_checkout_sessions" to "anon";

grant truncate on table "public"."trip_checkout_sessions" to "anon";

grant update on table "public"."trip_checkout_sessions" to "anon";

grant delete on table "public"."trip_checkout_sessions" to "authenticated";

grant insert on table "public"."trip_checkout_sessions" to "authenticated";

grant references on table "public"."trip_checkout_sessions" to "authenticated";

grant select on table "public"."trip_checkout_sessions" to "authenticated";

grant trigger on table "public"."trip_checkout_sessions" to "authenticated";

grant truncate on table "public"."trip_checkout_sessions" to "authenticated";

grant update on table "public"."trip_checkout_sessions" to "authenticated";

grant delete on table "public"."trip_checkout_sessions" to "service_role";

grant insert on table "public"."trip_checkout_sessions" to "service_role";

grant references on table "public"."trip_checkout_sessions" to "service_role";

grant select on table "public"."trip_checkout_sessions" to "service_role";

grant trigger on table "public"."trip_checkout_sessions" to "service_role";

grant truncate on table "public"."trip_checkout_sessions" to "service_role";

grant update on table "public"."trip_checkout_sessions" to "service_role";

CREATE TRIGGER checkout_sessions_enforce_times_trg BEFORE INSERT OR UPDATE ON public.trip_checkout_sessions FOR EACH ROW EXECUTE FUNCTION public.enforce_times();


