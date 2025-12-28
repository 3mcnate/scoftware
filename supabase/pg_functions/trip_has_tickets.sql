create or replace function trip_has_tickets(t_id uuid)
returns boolean
as $$
begin
	return exists (
		select 1 
		from public.tickets
		where trip_id = t_id
	);
end;
$$ language plpgsql set search_path = '';