alter table "public"."waiver_templates" alter column "type" drop default;

alter table "public"."waiver_templates" alter column type type "public"."participant_type" using type::text::"public"."participant_type";

alter table "public"."waiver_templates" alter column "type" set default 'participant'::public.participant_type;

alter table "public"."waiver_events" add column "waiver_id" uuid not null default 'e9849888-8cd8-4632-a97a-eb10e5328691'::uuid;

alter table "public"."waiver_templates" alter column "type" set not null;

alter table "public"."waiver_events" add constraint "waiver_events_waiver_id_fkey" FOREIGN KEY (waiver_id) REFERENCES public.trip_waivers(id) not valid;

alter table "public"."waiver_events" validate constraint "waiver_events_waiver_id_fkey";


