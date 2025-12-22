drop index if exists "public"."active_waiver_template_types";

alter table "public"."waiver_templates" alter column "type" set default 'participant'::public.participant_type;

alter table "public"."waiver_templates" alter column "type" set data type public.participant_type using "type"::text::public.participant_type;


