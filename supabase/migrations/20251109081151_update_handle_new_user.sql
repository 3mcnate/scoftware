set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare

fname text;
lname text;
env text;

begin

	select "value" into env
	from public.env where "key" = 'env';

	if new.email is null then
		raise exception 'email is null';
	end if;

	if env != 'development' and new.email !~* '@usc.edu$' then
		raise exception 'must signup with @usc.edu email address';
	end if;

	if new.raw_user_meta_data->>'first_name' is null then
		fname := new.email;
	else
		select new.raw_user_meta_data->>'first_name' into fname;
	end if;

	if new.raw_user_meta_data->>'last_name' is null then
		lname := new.email;
	else
		select new.raw_user_meta_data->>'last_name' into lname;
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
$function$
;


