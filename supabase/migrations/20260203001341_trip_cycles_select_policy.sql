
  create policy "Guides can view trip cycles"
  on "public"."trip_cycles"
  as permissive
  for select
  to authenticated
using (public.authorize('guide'::public.user_role));



