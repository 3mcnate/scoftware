alter table "public"."trip_budgets" add constraint "trip_budgets_trip_id_fkey" FOREIGN KEY (trip_id) REFERENCES trips(id) not valid;

alter table "public"."trip_budgets" validate constraint "trip_budgets_trip_id_fkey";


