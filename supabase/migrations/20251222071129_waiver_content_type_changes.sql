alter table "public"."trip_waivers" alter column "content" set data type jsonb using "content"::jsonb;

alter table "public"."waiver_templates" alter column "content" set data type jsonb using "content"::jsonb;


