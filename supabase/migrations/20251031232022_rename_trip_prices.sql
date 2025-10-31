drop trigger if exists "prices_enforce_times_trg" on "public"."prices";

revoke delete on table "public"."prices" from "anon";

revoke insert on table "public"."prices" from "anon";

revoke references on table "public"."prices" from "anon";

revoke select on table "public"."prices" from "anon";

revoke trigger on table "public"."prices" from "anon";

revoke truncate on table "public"."prices" from "anon";

revoke update on table "public"."prices" from "anon";

revoke delete on table "public"."prices" from "authenticated";

revoke insert on table "public"."prices" from "authenticated";

revoke references on table "public"."prices" from "authenticated";

revoke select on table "public"."prices" from "authenticated";

revoke trigger on table "public"."prices" from "authenticated";

revoke truncate on table "public"."prices" from "authenticated";

revoke update on table "public"."prices" from "authenticated";

revoke delete on table "public"."prices" from "service_role";

revoke insert on table "public"."prices" from "service_role";

revoke references on table "public"."prices" from "service_role";

revoke select on table "public"."prices" from "service_role";

revoke trigger on table "public"."prices" from "service_role";

revoke truncate on table "public"."prices" from "service_role";

revoke update on table "public"."prices" from "service_role";

alter table "public"."prices" drop constraint "prices_id_fkey";

alter table "public"."prices" drop constraint "prices_stripe_driver_price_id_key";

alter table "public"."prices" drop constraint "prices_stripe_driver_product_id_key";

alter table "public"."prices" drop constraint "prices_stripe_member_price_id_key";

alter table "public"."prices" drop constraint "prices_stripe_nonmember_price_id_key";

alter table "public"."prices" drop constraint "prices_stripe_participant_product_id_key";

alter table "public"."prices" drop constraint "prices_pkey";

drop index if exists "public"."prices_pkey";

drop index if exists "public"."prices_stripe_driver_price_id_key";

drop index if exists "public"."prices_stripe_driver_product_id_key";

drop index if exists "public"."prices_stripe_member_price_id_key";

drop index if exists "public"."prices_stripe_nonmember_price_id_key";

drop index if exists "public"."prices_stripe_participant_product_id_key";

drop table "public"."prices";

create table "public"."trip_prices" (
    "trip_id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "stripe_participant_product_id" text not null,
    "stripe_member_price_id" text not null,
    "stripe_nonmember_price_id" text not null,
    "stripe_driver_product_id" text,
    "stripe_driver_price_id" text,
    "member_price" numeric not null,
    "nonmember_price" numeric not null,
    "driver_price" numeric
);


alter table "public"."trip_prices" enable row level security;

CREATE UNIQUE INDEX trip_prices_pkey ON public.trip_prices USING btree (trip_id);

CREATE UNIQUE INDEX prices_stripe_driver_price_id_key ON public.trip_prices USING btree (stripe_driver_price_id);

CREATE UNIQUE INDEX prices_stripe_driver_product_id_key ON public.trip_prices USING btree (stripe_driver_product_id);

CREATE UNIQUE INDEX prices_stripe_member_price_id_key ON public.trip_prices USING btree (stripe_member_price_id);

CREATE UNIQUE INDEX prices_stripe_nonmember_price_id_key ON public.trip_prices USING btree (stripe_nonmember_price_id);

CREATE UNIQUE INDEX prices_stripe_participant_product_id_key ON public.trip_prices USING btree (stripe_participant_product_id);

alter table "public"."trip_prices" add constraint "trip_prices_pkey" PRIMARY KEY using index "trip_prices_pkey";

alter table "public"."trip_prices" add constraint "prices_id_fkey" FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE not valid;

alter table "public"."trip_prices" validate constraint "prices_id_fkey";

alter table "public"."trip_prices" add constraint "prices_stripe_driver_price_id_key" UNIQUE using index "prices_stripe_driver_price_id_key";

alter table "public"."trip_prices" add constraint "prices_stripe_driver_product_id_key" UNIQUE using index "prices_stripe_driver_product_id_key";

alter table "public"."trip_prices" add constraint "prices_stripe_member_price_id_key" UNIQUE using index "prices_stripe_member_price_id_key";

alter table "public"."trip_prices" add constraint "prices_stripe_nonmember_price_id_key" UNIQUE using index "prices_stripe_nonmember_price_id_key";

alter table "public"."trip_prices" add constraint "prices_stripe_participant_product_id_key" UNIQUE using index "prices_stripe_participant_product_id_key";

grant delete on table "public"."trip_prices" to "anon";

grant insert on table "public"."trip_prices" to "anon";

grant references on table "public"."trip_prices" to "anon";

grant select on table "public"."trip_prices" to "anon";

grant trigger on table "public"."trip_prices" to "anon";

grant truncate on table "public"."trip_prices" to "anon";

grant update on table "public"."trip_prices" to "anon";

grant delete on table "public"."trip_prices" to "authenticated";

grant insert on table "public"."trip_prices" to "authenticated";

grant references on table "public"."trip_prices" to "authenticated";

grant select on table "public"."trip_prices" to "authenticated";

grant trigger on table "public"."trip_prices" to "authenticated";

grant truncate on table "public"."trip_prices" to "authenticated";

grant update on table "public"."trip_prices" to "authenticated";

grant delete on table "public"."trip_prices" to "service_role";

grant insert on table "public"."trip_prices" to "service_role";

grant references on table "public"."trip_prices" to "service_role";

grant select on table "public"."trip_prices" to "service_role";

grant trigger on table "public"."trip_prices" to "service_role";

grant truncate on table "public"."trip_prices" to "service_role";

grant update on table "public"."trip_prices" to "service_role";

CREATE TRIGGER prices_enforce_times_trg BEFORE INSERT OR UPDATE ON public.trip_prices FOR EACH ROW EXECUTE FUNCTION enforce_times();


