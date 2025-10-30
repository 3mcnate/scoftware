alter table "public"."profiles" add column "email" text not null;

alter table "public"."profiles" add column "phone_number" text not null;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
$function$
;


