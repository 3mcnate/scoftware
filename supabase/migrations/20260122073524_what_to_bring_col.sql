alter table "public"."trips" alter column "what_to_bring" set data type text[] using "what_to_bring"::text[];


