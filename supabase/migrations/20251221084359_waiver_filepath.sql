alter table "public"."tickets" add column "driver_waiver_filepath" text;

alter table "public"."tickets" add column "waiver_filepath" text;

alter table "public"."waiver_events" add column "file_path" text;


