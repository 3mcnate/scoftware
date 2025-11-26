revoke delete on table "public"."public_trip_spot_info" from "anon";

revoke insert on table "public"."public_trip_spot_info" from "anon";

revoke references on table "public"."public_trip_spot_info" from "anon";

revoke select on table "public"."public_trip_spot_info" from "anon";

revoke trigger on table "public"."public_trip_spot_info" from "anon";

revoke truncate on table "public"."public_trip_spot_info" from "anon";

revoke update on table "public"."public_trip_spot_info" from "anon";

revoke delete on table "public"."public_trip_spot_info" from "authenticated";

revoke insert on table "public"."public_trip_spot_info" from "authenticated";

revoke references on table "public"."public_trip_spot_info" from "authenticated";

revoke select on table "public"."public_trip_spot_info" from "authenticated";

revoke trigger on table "public"."public_trip_spot_info" from "authenticated";

revoke truncate on table "public"."public_trip_spot_info" from "authenticated";

revoke update on table "public"."public_trip_spot_info" from "authenticated";

revoke delete on table "public"."public_trip_spot_info" from "service_role";

revoke insert on table "public"."public_trip_spot_info" from "service_role";

revoke references on table "public"."public_trip_spot_info" from "service_role";

revoke select on table "public"."public_trip_spot_info" from "service_role";

revoke trigger on table "public"."public_trip_spot_info" from "service_role";

revoke truncate on table "public"."public_trip_spot_info" from "service_role";

revoke update on table "public"."public_trip_spot_info" from "service_role";

alter table "public"."public_trip_spot_info" drop constraint "public_trip_spot_info_id_fkey";

alter table "public"."public_trip_spot_info" drop constraint "public_trip_spot_info_pkey";

drop index if exists "public"."public_trip_spot_info_pkey";

drop table "public"."public_trip_spot_info";

grant delete on table "public"."allowed_trip_participants" to "postgres";

grant insert on table "public"."allowed_trip_participants" to "postgres";

grant references on table "public"."allowed_trip_participants" to "postgres";

grant select on table "public"."allowed_trip_participants" to "postgres";

grant trigger on table "public"."allowed_trip_participants" to "postgres";

grant truncate on table "public"."allowed_trip_participants" to "postgres";

grant update on table "public"."allowed_trip_participants" to "postgres";


