alter table "public"."trips" add constraint "ends_after_start" CHECK ((starts_at < ends_at)) not valid;

alter table "public"."trips" validate constraint "ends_after_start";


