alter table "public"."trips" drop constraint "ends_after_start";

alter table "public"."published_trips" drop column "picture";

alter table "public"."published_trips" add column "picture_path" text not null;

alter table "public"."trips" drop column "ends_at";

alter table "public"."trips" drop column "picture";

alter table "public"."trips" drop column "starts_at";

alter table "public"."trips" add column "end_date" timestamp with time zone not null;

alter table "public"."trips" add column "picture_path" text;

alter table "public"."trips" add column "start_date" timestamp with time zone not null;

alter table "public"."tickets" add constraint "tickets_trip_id_fkey1" FOREIGN KEY (trip_id) REFERENCES public.trips(id) not valid;

alter table "public"."tickets" validate constraint "tickets_trip_id_fkey1";

alter table "public"."trips" add constraint "ends_after_start" CHECK ((start_date < end_date)) not valid;

alter table "public"."trips" validate constraint "ends_after_start";


