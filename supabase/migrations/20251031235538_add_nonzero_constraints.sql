alter table "public"."participant_info" drop constraint "participant_info_usc_id_check";

alter table "public"."participant_info" alter column "usc_id" set data type integer using "usc_id"::integer;

alter table "public"."trip_budgets" alter column "car_mpgs" set default '{}'::real[];

alter table "public"."trip_budgets" add constraint "trip_budgets_breakfasts_check" CHECK ((breakfasts >= 0)) not valid;

alter table "public"."trip_budgets" validate constraint "trip_budgets_breakfasts_check";

alter table "public"."trip_budgets" add constraint "trip_budgets_car_rental_price_check" CHECK ((car_rental_price >= 0.0)) not valid;

alter table "public"."trip_budgets" validate constraint "trip_budgets_car_rental_price_check";

alter table "public"."trip_budgets" add constraint "trip_budgets_dinners_check" CHECK ((dinners >= 0)) not valid;

alter table "public"."trip_budgets" validate constraint "trip_budgets_dinners_check";

alter table "public"."trip_budgets" add constraint "trip_budgets_lunches_check" CHECK ((lunches >= 0)) not valid;

alter table "public"."trip_budgets" validate constraint "trip_budgets_lunches_check";

alter table "public"."trip_budgets" add constraint "trip_budgets_parking_cost_check" CHECK ((parking_cost >= 0.0)) not valid;

alter table "public"."trip_budgets" validate constraint "trip_budgets_parking_cost_check";

alter table "public"."trip_budgets" add constraint "trip_budgets_permit_cost_check" CHECK ((permit_cost >= 0.0)) not valid;

alter table "public"."trip_budgets" validate constraint "trip_budgets_permit_cost_check";

alter table "public"."trip_budgets" add constraint "trip_budgets_snacks_check" CHECK ((snacks >= 0)) not valid;

alter table "public"."trip_budgets" validate constraint "trip_budgets_snacks_check";

alter table "public"."trip_budgets" add constraint "trip_budgets_total_miles_check" CHECK ((total_miles >= 0)) not valid;

alter table "public"."trip_budgets" validate constraint "trip_budgets_total_miles_check";

alter table "public"."trip_prices" add constraint "trip_prices_driver_price_check" CHECK (((driver_price IS NULL) OR (driver_price >= (0)::numeric))) not valid;

alter table "public"."trip_prices" validate constraint "trip_prices_driver_price_check";

alter table "public"."trip_prices" add constraint "trip_prices_member_price_check" CHECK ((member_price >= (0)::numeric)) not valid;

alter table "public"."trip_prices" validate constraint "trip_prices_member_price_check";

alter table "public"."trip_prices" add constraint "trip_prices_nonmember_price_check" CHECK ((nonmember_price >= (0)::numeric)) not valid;

alter table "public"."trip_prices" validate constraint "trip_prices_nonmember_price_check";

alter table "public"."trip_ticket_info" add constraint "trip_ticket_info_cancelled_driver_tickets_check" CHECK ((cancelled_driver_tickets >= 0)) not valid;

alter table "public"."trip_ticket_info" validate constraint "trip_ticket_info_cancelled_driver_tickets_check";

alter table "public"."trip_ticket_info" add constraint "trip_ticket_info_cancelled_participant_tickets_check" CHECK ((cancelled_participant_tickets >= 0)) not valid;

alter table "public"."trip_ticket_info" validate constraint "trip_ticket_info_cancelled_participant_tickets_check";

alter table "public"."trip_ticket_info" add constraint "trip_ticket_info_driver_tickets_sold_check" CHECK ((driver_tickets_sold >= 0)) not valid;

alter table "public"."trip_ticket_info" validate constraint "trip_ticket_info_driver_tickets_sold_check";

alter table "public"."trip_ticket_info" add constraint "trip_ticket_info_participant_tickets_sold_check" CHECK ((participant_tickets_sold >= 0)) not valid;

alter table "public"."trip_ticket_info" validate constraint "trip_ticket_info_participant_tickets_sold_check";

alter table "public"."trips" add constraint "trips_difficulty_check" CHECK (((difficulty >= 1) AND (difficulty <= 10))) not valid;

alter table "public"."trips" validate constraint "trips_difficulty_check";

alter table "public"."trips" add constraint "trips_driver_spots_check" CHECK ((driver_spots >= 0)) not valid;

alter table "public"."trips" validate constraint "trips_driver_spots_check";

alter table "public"."trips" add constraint "trips_participant_spots_check" CHECK ((participant_spots >= 0)) not valid;

alter table "public"."trips" validate constraint "trips_participant_spots_check";

alter table "public"."participant_info" add constraint "participant_info_usc_id_check" CHECK ((usc_id < '9999999999'::bigint)) not valid;

alter table "public"."participant_info" validate constraint "participant_info_usc_id_check";


