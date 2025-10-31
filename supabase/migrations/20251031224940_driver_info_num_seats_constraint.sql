alter table "public"."driver_info" add constraint "five_seats_or_more" CHECK ((num_seats >= 5)) not valid;

alter table "public"."driver_info" validate constraint "five_seats_or_more";


