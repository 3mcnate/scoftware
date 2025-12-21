revoke delete on table "public"."trip_waivers" from "anon";

revoke insert on table "public"."trip_waivers" from "anon";

revoke references on table "public"."trip_waivers" from "anon";

revoke select on table "public"."trip_waivers" from "anon";

revoke trigger on table "public"."trip_waivers" from "anon";

revoke truncate on table "public"."trip_waivers" from "anon";

revoke update on table "public"."trip_waivers" from "anon";

revoke delete on table "public"."trip_waivers" from "authenticated";

revoke insert on table "public"."trip_waivers" from "authenticated";

revoke references on table "public"."trip_waivers" from "authenticated";

revoke select on table "public"."trip_waivers" from "authenticated";

revoke trigger on table "public"."trip_waivers" from "authenticated";

revoke truncate on table "public"."trip_waivers" from "authenticated";

revoke update on table "public"."trip_waivers" from "authenticated";

revoke delete on table "public"."trip_waivers" from "service_role";

revoke insert on table "public"."trip_waivers" from "service_role";

revoke references on table "public"."trip_waivers" from "service_role";

revoke select on table "public"."trip_waivers" from "service_role";

revoke trigger on table "public"."trip_waivers" from "service_role";

revoke truncate on table "public"."trip_waivers" from "service_role";

revoke update on table "public"."trip_waivers" from "service_role";

revoke delete on table "public"."waiver_events" from "anon";

revoke insert on table "public"."waiver_events" from "anon";

revoke references on table "public"."waiver_events" from "anon";

revoke select on table "public"."waiver_events" from "anon";

revoke trigger on table "public"."waiver_events" from "anon";

revoke truncate on table "public"."waiver_events" from "anon";

revoke update on table "public"."waiver_events" from "anon";

revoke delete on table "public"."waiver_events" from "authenticated";

revoke insert on table "public"."waiver_events" from "authenticated";

revoke references on table "public"."waiver_events" from "authenticated";

revoke select on table "public"."waiver_events" from "authenticated";

revoke trigger on table "public"."waiver_events" from "authenticated";

revoke truncate on table "public"."waiver_events" from "authenticated";

revoke update on table "public"."waiver_events" from "authenticated";

revoke delete on table "public"."waiver_events" from "service_role";

revoke insert on table "public"."waiver_events" from "service_role";

revoke references on table "public"."waiver_events" from "service_role";

revoke select on table "public"."waiver_events" from "service_role";

revoke trigger on table "public"."waiver_events" from "service_role";

revoke truncate on table "public"."waiver_events" from "service_role";

revoke update on table "public"."waiver_events" from "service_role";

alter table "public"."trip_waivers" drop constraint "trip_ticket_type_unique";

alter table "public"."trip_waivers" drop constraint "trip_waivers_template_id_fkey";

alter table "public"."trip_waivers" drop constraint "trip_waivers_trip_id_fkey";

alter table "public"."waiver_events" drop constraint "waiver_events_trip_id_fkey";

alter table "public"."waiver_events" drop constraint "waiver_events_user_id_fkey";

alter table "public"."trip_waivers" drop constraint "trip_waivers_pkey";

alter table "public"."waiver_events" drop constraint "waiver_events_pkey";

drop index if exists "public"."trip_ticket_type_unique";

drop index if exists "public"."trip_waivers_pkey";

drop index if exists "public"."waiver_events_pkey";

drop table "public"."trip_waivers";

drop table "public"."waiver_events";


