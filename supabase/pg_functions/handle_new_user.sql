create or replace function handle_new_user()
returns trigger
security definer
as $$
declare

fname text;
lname text;

begin
	if new.email !~* '@usc.edu$' then
		raise exception 'must signup with @usc.edu email address';
	end if;

	if new.raw_user_meta_data->>'first_name' is null then
		fname := new.email;
	end if;

	if new.raw_user_meta_data->>'last_name' is null then
		lname := new.email;
	end if;

	insert into public.profiles (id, first_name, last_name)
	values (
		new.id,
		fname,
		lname
	);

	insert into public.roles ("user_id", "role")
	values (
		new.id,
		'participant'
	);

	return new;
end;
$$ language plpgsql
set search_path = '';

revoke execute on function handle_new_user from public;
revoke execute on function handle_new_user from authenticated;
revoke execute on function handle_new_user from anon;