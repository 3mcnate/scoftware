set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.authorize(authorized_role public.user_role)
 RETURNS boolean
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
	urole public.user_role;
begin

	select "role" from public.roles into urole where user_id = (select auth.uid());
	return public.get_role_code(urole) >= public.get_role_code(authorized_role);

end;
$function$
;


