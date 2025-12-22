drop index if exists "public"."active_waiver_template_types";

alter table "public"."waiver_templates" drop column "type";

alter table "public"."waiver_templates" add column "type" public.participant_type;

alter table "public"."waiver_templates" alter column "type" set default 'participant'::public.participant_type;



