drop trigger if exists "trip_budgets_enforce_times_trg" on "public"."trip_budgets";

revoke delete on table "public"."trip_budgets" from "anon";

revoke insert on table "public"."trip_budgets" from "anon";

revoke references on table "public"."trip_budgets" from "anon";

revoke select on table "public"."trip_budgets" from "anon";

revoke trigger on table "public"."trip_budgets" from "anon";

revoke truncate on table "public"."trip_budgets" from "anon";

revoke update on table "public"."trip_budgets" from "anon";

revoke delete on table "public"."trip_budgets" from "authenticated";

revoke insert on table "public"."trip_budgets" from "authenticated";

revoke references on table "public"."trip_budgets" from "authenticated";

revoke select on table "public"."trip_budgets" from "authenticated";

revoke trigger on table "public"."trip_budgets" from "authenticated";

revoke truncate on table "public"."trip_budgets" from "authenticated";

revoke update on table "public"."trip_budgets" from "authenticated";

revoke delete on table "public"."trip_budgets" from "service_role";

revoke insert on table "public"."trip_budgets" from "service_role";

revoke references on table "public"."trip_budgets" from "service_role";

revoke select on table "public"."trip_budgets" from "service_role";

revoke trigger on table "public"."trip_budgets" from "service_role";

revoke truncate on table "public"."trip_budgets" from "service_role";

revoke update on table "public"."trip_budgets" from "service_role";

revoke delete on table "public"."trip_details" from "anon";

revoke insert on table "public"."trip_details" from "anon";

revoke references on table "public"."trip_details" from "anon";

revoke select on table "public"."trip_details" from "anon";

revoke trigger on table "public"."trip_details" from "anon";

revoke truncate on table "public"."trip_details" from "anon";

revoke update on table "public"."trip_details" from "anon";

revoke delete on table "public"."trip_details" from "authenticated";

revoke insert on table "public"."trip_details" from "authenticated";

revoke references on table "public"."trip_details" from "authenticated";

revoke select on table "public"."trip_details" from "authenticated";

revoke trigger on table "public"."trip_details" from "authenticated";

revoke truncate on table "public"."trip_details" from "authenticated";

revoke update on table "public"."trip_details" from "authenticated";

revoke delete on table "public"."trip_details" from "service_role";

revoke insert on table "public"."trip_details" from "service_role";

revoke references on table "public"."trip_details" from "service_role";

revoke select on table "public"."trip_details" from "service_role";

revoke trigger on table "public"."trip_details" from "service_role";

revoke truncate on table "public"."trip_details" from "service_role";

revoke update on table "public"."trip_details" from "service_role";

alter table "public"."trip_budgets" drop constraint "trip_budgets_breakfasts_check";

alter table "public"."trip_budgets" drop constraint "trip_budgets_car_rental_price_check";

alter table "public"."trip_budgets" drop constraint "trip_budgets_dinners_check";

alter table "public"."trip_budgets" drop constraint "trip_budgets_lunches_check";

alter table "public"."trip_budgets" drop constraint "trip_budgets_parking_cost_check";

alter table "public"."trip_budgets" drop constraint "trip_budgets_permit_cost_check";

alter table "public"."trip_budgets" drop constraint "trip_budgets_snacks_check";

alter table "public"."trip_budgets" drop constraint "trip_budgets_total_miles_check";

alter table "public"."trip_budgets" drop constraint "trip_budgets_trip_id_fkey";

alter table "public"."trip_details" drop constraint "trip_details_trip_id_fkey";

alter table "public"."trip_budgets" drop constraint "trip_budgets_pkey";

alter table "public"."trip_details" drop constraint "trip_details_pkey";

drop index if exists "public"."trip_budgets_pkey";

drop index if exists "public"."trip_details_pkey";

drop table "public"."trip_budgets";

drop table "public"."trip_details";

alter table "public"."trips" add column "activity" text;

alter table "public"."trips" add column "breakfasts" smallint;

alter table "public"."trips" add column "budget_confirmed" boolean not null default false;

alter table "public"."trips" add column "car_mpgs" numeric[];

alter table "public"."trips" add column "difficulty" text;

alter table "public"."trips" add column "dinners" smallint;

alter table "public"."trips" add column "location" text;

alter table "public"."trips" add column "lunches" smallint;

alter table "public"."trips" add column "meet" text;

alter table "public"."trips" add column "native_land" text;

alter table "public"."trips" add column "other_costs" jsonb;

alter table "public"."trips" add column "prior_experience" text;

alter table "public"."trips" add column "return" text;

alter table "public"."trips" add column "snacks" smallint;

alter table "public"."trips" add column "total_miles" integer;

alter table "public"."trips" add column "trail" text;


