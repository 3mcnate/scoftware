alter table "public"."tickets" add column "receipt_url" text not null default 'https://www.stripe.com'::text;

grant delete on table "public"."allowed_trip_participants" to "postgres";

grant insert on table "public"."allowed_trip_participants" to "postgres";

grant references on table "public"."allowed_trip_participants" to "postgres";

grant select on table "public"."allowed_trip_participants" to "postgres";

grant trigger on table "public"."allowed_trip_participants" to "postgres";

grant truncate on table "public"."allowed_trip_participants" to "postgres";

grant update on table "public"."allowed_trip_participants" to "postgres";


