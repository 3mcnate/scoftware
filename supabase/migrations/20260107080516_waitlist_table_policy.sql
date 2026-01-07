
  create policy "Guides can view waitlist signups"
  on "public"."waitlist_signups"
  as permissive
  for select
  to authenticated
using (public.authorize('guide'::public.user_role));



