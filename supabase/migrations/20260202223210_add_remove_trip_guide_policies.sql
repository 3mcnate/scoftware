
  create policy "Allow trip guides to remove trip guides"
  on "public"."trip_guides"
  as permissive
  for delete
  to public
using ((public.is_trip_guide(( SELECT auth.uid() AS uid), trip_id) OR public.authorize('admin'::public.user_role)));



  create policy "Guides can add other guides to trip"
  on "public"."trip_guides"
  as permissive
  for insert
  to authenticated
with check ((public.is_trip_guide(( SELECT auth.uid() AS uid), trip_id) OR public.authorize('admin'::public.user_role)));



