
  create policy "Give users access to own folder ignnv3_0"
  on "storage"."objects"
  as permissive
  for select
  to authenticated
using (((bucket_id = 'waivers'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])));



