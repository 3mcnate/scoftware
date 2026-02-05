create or replace function insert_trip_settings()
returns trigger
security definer
set search_path = ''
as $$
BEGIN

	insert into public.trip_settings
	(trip_id) values (NEW.id);

	return NEW;

end;
$$ language plpgsql;

create or replace trigger insert_trip_settings_trg
after insert on public.trips
for each row
execute function insert_trip_settings();