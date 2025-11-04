alter table "public"."driver_info" drop constraint "five_seats_or_more";

alter table "public"."driver_info" add constraint "driver_info_drivers_license_expiration_check" CHECK ((drivers_license_expiration > CURRENT_DATE)) not valid;

alter table "public"."driver_info" validate constraint "driver_info_drivers_license_expiration_check";


