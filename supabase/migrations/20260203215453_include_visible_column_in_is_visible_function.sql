set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.is_trip_visible(trip_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
	override_date timestamptz := null;
	cycle_date timestamptz := null;
	is_visible boolean;

BEGIN

	select t.visible, t.publish_date_override, tc.trips_published_at
	into is_visible, override_date, cycle_date
	from public.trips t
	left join public.trip_cycles tc on (t.start_date between tc.starts_at and tc.ends_at)
	where t.id = trip_id
	limit 1;

	if not is_visible then
		return false;
	end if;

	return coalesce(now() >= override_date, now() >= cycle_date, false);

end;
$function$
;

grant delete on table "public"."trip_signup_settings" to "postgres";

grant insert on table "public"."trip_signup_settings" to "postgres";

grant references on table "public"."trip_signup_settings" to "postgres";

grant select on table "public"."trip_signup_settings" to "postgres";

grant trigger on table "public"."trip_signup_settings" to "postgres";

grant truncate on table "public"."trip_signup_settings" to "postgres";

grant update on table "public"."trip_signup_settings" to "postgres";


