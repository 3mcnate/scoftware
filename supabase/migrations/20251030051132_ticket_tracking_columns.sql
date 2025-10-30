alter table "public"."trips" add column "driver_tickets_sold" integer not null default 0;

alter table "public"."trips" add column "participant_tickets_sold" integer;

alter table "public"."trips" add column "total_driver_tickets" integer not null default 0;

alter table "public"."trips" add column "total_participant_tickets" integer;

alter table "public"."trips" alter column "description" drop not null;

alter table "public"."trips" alter column "difficulty" drop not null;

alter table "public"."trips" alter column "difficulty" set data type integer using "difficulty"::integer;

alter table "public"."trips" alter column "name" drop not null;

alter table "public"."trips" alter column "picture" drop not null;


