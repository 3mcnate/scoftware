alter table "public"."tickets" add column "waiver_id" uuid;

alter table "public"."tickets" add constraint "tickets_waiver_id_fkey" FOREIGN KEY (waiver_id) REFERENCES public.waiver_signatures(id) not valid;

alter table "public"."tickets" validate constraint "tickets_waiver_id_fkey";

grant delete on table "public"."allowed_trip_participants" to "postgres";

grant insert on table "public"."allowed_trip_participants" to "postgres";

grant references on table "public"."allowed_trip_participants" to "postgres";

grant select on table "public"."allowed_trip_participants" to "postgres";

grant trigger on table "public"."allowed_trip_participants" to "postgres";

grant truncate on table "public"."allowed_trip_participants" to "postgres";

grant update on table "public"."allowed_trip_participants" to "postgres";


  create policy "Authenticated users can view visible trips"
  on "public"."published_trips"
  as permissive
  for select
  to authenticated
using (visible);



  create policy "Participants can select their own tickets"
  on "public"."tickets"
  as permissive
  for select
  to authenticated
using ((user_id = ( SELECT auth.uid() AS uid)));



  create policy "Allow participants to view their waiver signatures"
  on "public"."waiver_signatures"
  as permissive
  for select
  to authenticated
using ((user_id = ( SELECT auth.uid() AS uid)));



