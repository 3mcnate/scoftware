drop policy "Allow user to select own profile" on "public"."profiles";


  create policy "Allow guides, user to select own profile"
  on "public"."profiles"
  as permissive
  for select
  to authenticated
using (((id = ( SELECT auth.uid() AS uid)) OR public.authorize('guide'::public.user_role)));



  create policy "Allow guides to view roles"
  on "public"."roles"
  as permissive
  for select
  to authenticated
using (public.authorize('guide'::public.user_role));



