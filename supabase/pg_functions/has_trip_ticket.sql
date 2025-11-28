create or replace function has_trip_ticket("user" uuid, "trip" uuid)
returns boolean
stable
language plpgsql
as $$
begin
	return exists (
		select 1 from public.tickets
		where tickets.user_id = "user" and tickets.trip_id = "trip"
	);
end;
$$ set search_path = '';
