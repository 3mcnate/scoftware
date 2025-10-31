revoke delete on table "public"."roles" from "anon";

revoke insert on table "public"."roles" from "anon";

revoke references on table "public"."roles" from "anon";

revoke select on table "public"."roles" from "anon";

revoke trigger on table "public"."roles" from "anon";

revoke truncate on table "public"."roles" from "anon";

revoke update on table "public"."roles" from "anon";

revoke delete on table "public"."roles" from "authenticated";

revoke insert on table "public"."roles" from "authenticated";

revoke references on table "public"."roles" from "authenticated";

revoke select on table "public"."roles" from "authenticated";

revoke trigger on table "public"."roles" from "authenticated";

revoke truncate on table "public"."roles" from "authenticated";

revoke update on table "public"."roles" from "authenticated";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.authorize(authorized_role user_role)
 RETURNS boolean
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
	urole public.user_role;
begin

	select (auth.jwt()->>'user_role')::public.user_role into urole;
	return public.get_role_code(urole) >= public.get_role_code(authorized_role) ;

end;
$function$
;

CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE
AS $function$
  declare
    claims jsonb;
    urole public.user_role;
  begin
    -- Fetch the user role in the user_roles table
    select role into urole from public.roles where user_id = (event->>'user_id')::uuid;

    claims := event->'claims';
	claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));

    -- Update the 'claims' object in the original event
    event := jsonb_set(event, '{claims}', claims);

    -- Return the modified or original event
    return event;
  end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_role_code(r user_role)
 RETURNS integer
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
begin
	return case r
		when "participant" then 0
		when "guide" then 1
		when "admin" then 2
		when "superadmin" then 3
	end;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
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

	insert into public.roles ("user_id", "role")
	values (
		new.id,
		'participant'
	);

	return new;
end;
$function$
;

grant delete on table "public"."roles" to "supabase_auth_admin";

grant insert on table "public"."roles" to "supabase_auth_admin";

grant references on table "public"."roles" to "supabase_auth_admin";

grant select on table "public"."roles" to "supabase_auth_admin";

grant trigger on table "public"."roles" to "supabase_auth_admin";

grant truncate on table "public"."roles" to "supabase_auth_admin";

grant update on table "public"."roles" to "supabase_auth_admin";

create policy "Allow auth admin to read user roles"
on "public"."roles"
as permissive
for select
to supabase_auth_admin
using (true);



