alter table "public"."tickets" drop constraint "tickets_trip_id_fkey";

alter table "public"."published_trips" add column "visible" boolean not null default true;

alter table "public"."tickets" add constraint "tickets_trip_id_fkey" FOREIGN KEY (trip_id) REFERENCES public.published_trips(id) not valid;

alter table "public"."tickets" validate constraint "tickets_trip_id_fkey";

grant delete on table "public"."allowed_trip_participants" to "postgres";

grant insert on table "public"."allowed_trip_participants" to "postgres";

grant references on table "public"."allowed_trip_participants" to "postgres";

grant select on table "public"."allowed_trip_participants" to "postgres";

grant trigger on table "public"."allowed_trip_participants" to "postgres";

grant truncate on table "public"."allowed_trip_participants" to "postgres";

grant update on table "public"."allowed_trip_participants" to "postgres";


