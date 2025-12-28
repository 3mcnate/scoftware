set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.is_trip_guide(u1 uuid, u2 uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare

begin

	if exists (
		select 1
		from public.trip_guides
		where user_id = u1 and trip_id = u2
	) then
		return true;
	end if;

	return exists (
		select 1
		from public.trip_guides
		where trip_id = u1 and user_id = u2
	);

end;

$function$
;

CREATE OR REPLACE FUNCTION public.trip_has_tickets(t_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
begin
	return exists (
		select 1 
		from public.tickets
		where trip_id = t_id
	);
end;
$function$
;


  create policy "Allow trip deletion"
  on "public"."trips"
  as permissive
  for delete
  to authenticated
using (((public.is_trip_guide(id, ( SELECT auth.uid() AS uid)) OR public.authorize('admin'::public.user_role)) AND (NOT public.trip_has_tickets(id))));



