alter table "public"."driver_info" drop column "good_condition";

alter table "public"."driver_info" add column "affirm_good_condition" boolean not null;

alter table "public"."driver_info" add column "drivers_license_state" text not null;

alter table "public"."driver_info" add column "license_plate_number" text not null;


