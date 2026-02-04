drop policy "Allow trip guides to remove trip guides" on "public"."trip_guides";

drop policy "Allow trip guides, admins to update trips" on "public"."trips";

drop policy "Guides can add other guides to trip" on "public"."trip_guides";


  create policy "Allow guides to remove trip guides"
  on "public"."trip_guides"
  as permissive
  for delete
  to authenticated
using (public.authorize('guide'::public.user_role));



  create policy "Allow guides to update trip settings"
  on "public"."trip_signup_settings"
  as permissive
  for update
  to authenticated
using (public.authorize('guide'::public.user_role))
with check (public.authorize('guide'::public.user_role));



  create policy "Allow guides to view trip settings"
  on "public"."trip_signup_settings"
  as permissive
  for select
  to authenticated
using (public.authorize('guide'::public.user_role));



  create policy "Allow all guides to update trips"
  on "public"."trips"
  as permissive
  for update
  to authenticated
using (public.authorize('guide'::public.user_role))
with check (public.authorize('guide'::public.user_role));



  create policy "Guides can add other guides to trip"
  on "public"."trip_guides"
  as permissive
  for insert
  to authenticated
with check (public.authorize('guide'::public.user_role));



