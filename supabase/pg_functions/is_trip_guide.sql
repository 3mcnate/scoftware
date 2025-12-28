create or replace function is_trip_guide(u1 uuid, u2 uuid)
returns boolean
as $$
declare

begin

	if exists (
		select 1
		from public.trip_guides
		where user_id = u1 and trip_id = u2
	) then
		return true;
	end if;

	return exists (
		select 1
		from public.trip_guides
		where trip_id = u1 and user_id = u2
	);

end;

$$ language plpgsql set search_path = '';