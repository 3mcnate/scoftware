create type "public"."graduation_season_type" as enum ('spring', 'fall');

alter table "public"."participant_info" add column "graduation_season" public.graduation_season_type not null;

grant delete on table "public"."allowed_trip_participants" to "postgres";

grant insert on table "public"."allowed_trip_participants" to "postgres";

grant references on table "public"."allowed_trip_participants" to "postgres";

grant select on table "public"."allowed_trip_participants" to "postgres";

grant trigger on table "public"."allowed_trip_participants" to "postgres";

grant truncate on table "public"."allowed_trip_participants" to "postgres";

grant update on table "public"."allowed_trip_participants" to "postgres";


