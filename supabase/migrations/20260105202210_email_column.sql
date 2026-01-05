alter table "public"."profiles" add column "email" text not null default 'nboxer@usc.edu'::text;

alter table "public"."trips" add constraint "trips_breakfasts_check" CHECK ((breakfasts >= 0)) not valid;

alter table "public"."trips" validate constraint "trips_breakfasts_check";

alter table "public"."trips" add constraint "trips_car_mpgs_check" CHECK (((0)::numeric <= ALL (car_mpgs))) not valid;

alter table "public"."trips" validate constraint "trips_car_mpgs_check";

alter table "public"."trips" add constraint "trips_dinners_check" CHECK ((dinners >= 0)) not valid;

alter table "public"."trips" validate constraint "trips_dinners_check";

alter table "public"."trips" add constraint "trips_lunches_check" CHECK ((lunches >= 0)) not valid;

alter table "public"."trips" validate constraint "trips_lunches_check";

alter table "public"."trips" add constraint "trips_snacks_check" CHECK ((snacks >= 0)) not valid;

alter table "public"."trips" validate constraint "trips_snacks_check";

alter table "public"."trips" add constraint "trips_total_miles_check" CHECK ((total_miles >= 0)) not valid;

alter table "public"."trips" validate constraint "trips_total_miles_check";


