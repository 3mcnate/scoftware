
  create policy "Allow guides to update waitlist signups"
  on "public"."waitlist_signups"
  as permissive
  for update
  to authenticated
using ((public.is_trip_guide(( SELECT auth.uid() AS uid), trip_id) OR public.authorize('admin'::public.user_role)))
with check ((public.is_trip_guide(( SELECT auth.uid() AS uid), trip_id) OR public.authorize('admin'::public.user_role)));



