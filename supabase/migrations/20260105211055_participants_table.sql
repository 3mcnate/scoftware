drop policy "Give users access to own folder ignnv3_0" on "storage"."objects";


  create policy "Give guides, users access to own folder ignnv3_0"
  on "storage"."objects"
  as permissive
  for select
  to authenticated
using (((bucket_id = 'waivers'::text) AND ((( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1]) OR public.authorize('guide'::public.user_role))));



