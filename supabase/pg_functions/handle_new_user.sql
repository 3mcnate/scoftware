create or replace function handle_new_user()
returns trigger
security definer
as $$
begin
	if new.email !~* '@usc.edu$' then
		raise exception 'must signup with @usc.edu email address';
	end if;

	insert into public.profiles (id, first_name, last_name, email, phone_number)
	values (
		new.id,
		new.raw_user_meta_data->>'first_name',
		new.raw_user_meta_data->>'last_name',
		new.email,
		new.raw_user_meta_data->>'phone_number'
	);

	return new;
end;
$$ language plpgsql;

