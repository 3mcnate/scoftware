drop policy "Participants can select their own tickets" on "public"."tickets";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.authorize(authorized_role public.user_role)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
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

CREATE OR REPLACE FUNCTION public.get_role_code(r public.user_role)
 RETURNS integer
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
begin
	return case r
		when 'participant' then 0
		when 'guide' then 1
		when 'admin' then 2
		when 'superadmin' then 3
	end;
end;
$function$
;

grant delete on table "public"."roles" to "authenticated";

grant insert on table "public"."roles" to "authenticated";

grant references on table "public"."roles" to "authenticated";

grant select on table "public"."roles" to "authenticated";

grant trigger on table "public"."roles" to "authenticated";

grant truncate on table "public"."roles" to "authenticated";

grant update on table "public"."roles" to "authenticated";


  create policy "Guides, participants can select their own tickets"
  on "public"."tickets"
  as permissive
  for select
  to authenticated
using (((user_id = ( SELECT auth.uid() AS uid)) OR public.authorize('guide'::public.user_role)));



  create policy "Allow guides to select trip guides"
  on "public"."trip_guides"
  as permissive
  for select
  to authenticated
using (public.authorize('guide'::public.user_role));



  create policy "Guides can select trips"
  on "public"."trips"
  as permissive
  for select
  to authenticated
using (public.authorize('guide'::public.user_role));



