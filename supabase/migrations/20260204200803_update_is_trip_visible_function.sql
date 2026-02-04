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
	should_hide boolean;

BEGIN

	select ts.hide_trip, ts.publish_date_override, tc.trips_published_at
	into should_hide, override_date, cycle_date
	from public.trips t
	inner join public.trip_settings ts on (t.id = ts.trip_id)
	left join public.trip_cycles tc on (t.start_date between tc.starts_at and tc.ends_at)
	where t.id = trip_id
	limit 1;

	if should_hide then
		return false;
	end if;

	return coalesce(now() >= override_date, now() >= cycle_date, false);

end;
$function$
;


