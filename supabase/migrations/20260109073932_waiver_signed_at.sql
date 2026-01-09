drop policy "Participants can select their own information" on "public"."participant_info";

alter table "public"."tickets" add column "driver_waiver_signed_at" timestamp with time zone;

alter table "public"."tickets" add column "waiver_signed_at" timestamp with time zone;


  create policy "Guides, participants can select their own information"
  on "public"."participant_info"
  as permissive
  for select
  to authenticated
using (((user_id = ( SELECT auth.uid() AS uid)) OR public.authorize('guide'::public.user_role)));



