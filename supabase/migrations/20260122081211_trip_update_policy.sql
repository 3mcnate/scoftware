
  create policy "Allow trip guides, admins to update trips"
  on "public"."trips"
  as permissive
  for update
  to authenticated
using ((public.is_trip_guide(( SELECT auth.uid() AS uid), id) OR public.authorize('admin'::public.user_role)))
with check ((public.is_trip_guide(( SELECT auth.uid() AS uid), id) OR public.authorize('admin'::public.user_role)));



