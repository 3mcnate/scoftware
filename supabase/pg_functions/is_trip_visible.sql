create or replace function public.is_trip_visible(trip_id uuid)
returns boolean
security definer
set search_path = ''
as $$
declare
	override_date timestamptz := null;
	cycle_date timestamptz := null;

BEGIN

	select t.publish_date_override, tc.trips_published_at
	into override_date, cycle_date
	from public.trips t
	left join public.trip_cycles tc on (t.start_date between tc.starts_at and tc.ends_at)
	where t.id = trip_id
	limit 1;

	return coalesce(now() >= override_date, now() >= cycle_date, false);

end;
$$ language plpgsql;