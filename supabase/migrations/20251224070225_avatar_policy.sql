
  create policy "Give users access to own avatar 1oj01fe_0"
  on "storage"."objects"
  as permissive
  for update
  to authenticated
using (((bucket_id = 'avatars'::text) AND (name = ( SELECT (auth.uid())::text AS uid))));



  create policy "Give users access to own avatar 1oj01fe_1"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check (((bucket_id = 'avatars'::text) AND (name = ( SELECT (auth.uid())::text AS uid))));



  create policy "Give users access to own avatar 1oj01fe_2"
  on "storage"."objects"
  as permissive
  for select
  to authenticated
using (((bucket_id = 'avatars'::text) AND (name = ( SELECT (auth.uid())::text AS uid))));



  create policy "Give users access to own avatar 1oj01fe_3"
  on "storage"."objects"
  as permissive
  for delete
  to authenticated
using (((bucket_id = 'avatars'::text) AND (name = ( SELECT (auth.uid())::text AS uid))));



