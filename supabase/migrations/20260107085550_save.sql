alter table "public"."participant_info" alter column "allergies" drop not null;

alter table "public"."participant_info" alter column "dietary_restrictions" drop not null;

alter table "public"."participant_info" alter column "dietary_restrictions" set data type text[] using "dietary_restrictions"::text[];

alter table "public"."participant_info" alter column "medical_history" drop not null;

alter table "public"."participant_info" alter column "medications" drop not null;


