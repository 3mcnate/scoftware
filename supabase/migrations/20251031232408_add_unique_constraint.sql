CREATE UNIQUE INDEX waitlist_signups_user_trip_unique ON public.waitlist_signups USING btree (user_id, trip_id);

alter table "public"."waitlist_signups" add constraint "waitlist_signups_user_trip_unique" UNIQUE using index "waitlist_signups_user_trip_unique";


