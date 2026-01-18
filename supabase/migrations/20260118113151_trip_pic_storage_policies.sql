revoke delete on table "public"."roles" from "anon";

revoke insert on table "public"."roles" from "anon";

revoke references on table "public"."roles" from "anon";

revoke select on table "public"."roles" from "anon";

revoke trigger on table "public"."roles" from "anon";

revoke truncate on table "public"."roles" from "anon";

revoke update on table "public"."roles" from "anon";


  create policy "Give guides access to trip folder l60vm7_0"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check (((bucket_id = 'trip_pictures'::text) AND public.is_trip_guide(( SELECT auth.uid() AS uid), ((storage.foldername(name))[1])::uuid)));



  create policy "Give guides access to trip folder l60vm7_1"
  on "storage"."objects"
  as permissive
  for select
  to authenticated
using (((bucket_id = 'trip_pictures'::text) AND public.is_trip_guide(( SELECT auth.uid() AS uid), ((storage.foldername(name))[1])::uuid)));



  create policy "Give guides access to trip folder l60vm7_2"
  on "storage"."objects"
  as permissive
  for update
  to authenticated
using (((bucket_id = 'trip_pictures'::text) AND public.is_trip_guide(( SELECT auth.uid() AS uid), ((storage.foldername(name))[1])::uuid)));



  create policy "Give guides access to trip folder l60vm7_3"
  on "storage"."objects"
  as permissive
  for delete
  to authenticated
using (((bucket_id = 'trip_pictures'::text) AND public.is_trip_guide(( SELECT auth.uid() AS uid), ((storage.foldername(name))[1])::uuid)));



