alter table "public"."published_trips" alter column "description" set data type jsonb using "description"::jsonb;


