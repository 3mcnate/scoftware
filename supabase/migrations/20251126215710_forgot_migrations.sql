alter table "public"."trips" alter column "signup_status" drop default;

alter type "public"."trip_signup_status" rename to "trip_signup_status__old_version_to_be_dropped";

create type "public"."trip_signup_status" as enum ('open', 'closed', 'access_code', 'select_participants', 'waitlist', 'full');

alter table "public"."trips" alter column signup_status type "public"."trip_signup_status" using signup_status::text::"public"."trip_signup_status";

alter table "public"."trips" alter column "signup_status" set default 'open'::public.trip_signup_status;

drop type "public"."trip_signup_status__old_version_to_be_dropped";

alter table "public"."trips" drop column "gear";

alter table "public"."trips" alter column "driver_spots" drop default;

alter table "public"."trips" alter column "gear_questions" drop not null;

alter table "public"."trips" alter column "participant_spots" drop default;

grant delete on table "public"."allowed_trip_participants" to "postgres";

grant insert on table "public"."allowed_trip_participants" to "postgres";

grant references on table "public"."allowed_trip_participants" to "postgres";

grant select on table "public"."allowed_trip_participants" to "postgres";

grant trigger on table "public"."allowed_trip_participants" to "postgres";

grant truncate on table "public"."allowed_trip_participants" to "postgres";

grant update on table "public"."allowed_trip_participants" to "postgres";

grant delete on table "public"."public_trip_spot_info" to "postgres";

grant insert on table "public"."public_trip_spot_info" to "postgres";

grant references on table "public"."public_trip_spot_info" to "postgres";

grant select on table "public"."public_trip_spot_info" to "postgres";

grant trigger on table "public"."public_trip_spot_info" to "postgres";

grant truncate on table "public"."public_trip_spot_info" to "postgres";

grant update on table "public"."public_trip_spot_info" to "postgres";


