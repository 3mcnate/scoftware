create type "public"."degree_path_type" as enum ('undergrad', 'graduate', 'pdp');

alter table "public"."participant_info" add column "graduation_year" smallint not null;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.has_trip_ticket("user" uuid, trip uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE
 SET search_path TO ''
AS $function$
begin
	return exists (
		select 1 from public.tickets
		where tickets.user_id = "user" and tickets.trip_id = "trip"
	);
end;
$function$
;

grant delete on table "public"."allowed_trip_participants" to "postgres";

grant insert on table "public"."allowed_trip_participants" to "postgres";

grant references on table "public"."allowed_trip_participants" to "postgres";

grant select on table "public"."allowed_trip_participants" to "postgres";

grant trigger on table "public"."allowed_trip_participants" to "postgres";

grant truncate on table "public"."allowed_trip_participants" to "postgres";

grant update on table "public"."allowed_trip_participants" to "postgres";


  create policy "Allow participants who have a ticket to view the trip, even if "
  on "public"."published_trips"
  as permissive
  for select
  to authenticated
using (public.has_trip_ticket(( SELECT auth.uid() AS uid), id));



