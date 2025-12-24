


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."checkout_session_status" AS ENUM (
    'open',
    'complete',
    'expired'
);


ALTER TYPE "public"."checkout_session_status" OWNER TO "postgres";


CREATE TYPE "public"."degree_path_type" AS ENUM (
    'undergrad',
    'graduate',
    'pdp'
);


ALTER TYPE "public"."degree_path_type" OWNER TO "postgres";


CREATE TYPE "public"."graduation_season_type" AS ENUM (
    'spring',
    'fall'
);


ALTER TYPE "public"."graduation_season_type" OWNER TO "postgres";


CREATE TYPE "public"."guide_position" AS ENUM (
    'new_guide',
    'guide',
    'longboard',
    'alum'
);


ALTER TYPE "public"."guide_position" OWNER TO "postgres";


CREATE TYPE "public"."membership_length" AS ENUM (
    'semester',
    'year'
);


ALTER TYPE "public"."membership_length" OWNER TO "postgres";


CREATE TYPE "public"."participant_type" AS ENUM (
    'participant',
    'driver'
);


ALTER TYPE "public"."participant_type" OWNER TO "postgres";


CREATE TYPE "public"."ticket_price_type" AS ENUM (
    'member',
    'nonmember',
    'driver'
);


ALTER TYPE "public"."ticket_price_type" OWNER TO "postgres";


CREATE TYPE "public"."trip_signup_status" AS ENUM (
    'open',
    'closed',
    'access_code',
    'select_participants',
    'waitlist',
    'full'
);


ALTER TYPE "public"."trip_signup_status" OWNER TO "postgres";


CREATE TYPE "public"."user_role" AS ENUM (
    'participant',
    'guide',
    'admin',
    'superadmin'
);


ALTER TYPE "public"."user_role" OWNER TO "postgres";


CREATE TYPE "public"."waitlist_status" AS ENUM (
    'waiting',
    'notification_sent',
    'signed_up',
    'expired'
);


ALTER TYPE "public"."waitlist_status" OWNER TO "postgres";


CREATE TYPE "public"."waiver_event" AS ENUM (
    'user_opened',
    'user_signed'
);


ALTER TYPE "public"."waiver_event" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."add_auto_timestamps_triggers"() RETURNS "void"
    LANGUAGE "plpgsql"
    SET "search_path" TO ''
    AS $$
DECLARE
  tbl record;
  has_timestamp_cols boolean;
BEGIN
  FOR tbl IN
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
  LOOP
    -- Does the table have created_at or updated_at columns?
    SELECT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = tbl.table_name
        AND column_name IN ('created_at', 'updated_at')
    ) INTO has_timestamp_cols;

    IF has_timestamp_cols THEN
	begin
		EXECUTE format('
          DROP TRIGGER %I_enforce_times_trg ON public.%I;
        ', tbl.table_name, tbl.table_name);
        EXECUTE format('
          CREATE TRIGGER %I_enforce_times_trg
          BEFORE INSERT OR UPDATE ON public.%I
          FOR EACH ROW
          EXECUTE FUNCTION public.enforce_times();
        ', tbl.table_name, tbl.table_name);
	exception
		when others then
			raise notice 'something went wrong adding trigger to %', tbl.table_name;
	end;
    END IF;
  END LOOP;
END;
$$;


ALTER FUNCTION "public"."add_auto_timestamps_triggers"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."authorize"("authorized_role" "public"."user_role") RETURNS boolean
    LANGUAGE "plpgsql"
    SET "search_path" TO ''
    AS $$
declare
	urole public.user_role;
begin

	select (auth.jwt()->>'user_role')::public.user_role into urole;
	return public.get_role_code(urole) >= public.get_role_code(authorized_role) ;

end;
$$;


ALTER FUNCTION "public"."authorize"("authorized_role" "public"."user_role") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."custom_access_token_hook"("event" "jsonb") RETURNS "jsonb"
    LANGUAGE "plpgsql" STABLE
    SET "search_path" TO ''
    AS $$
  declare
    claims jsonb;
    app_role public.user_role;
  begin
    -- Fetch the user role in the user_roles table
    select "role" into app_role from public.roles where user_id = (event->>'user_id')::uuid;

    claims := event->'claims';
	  claims := jsonb_set(claims, '{app_role}', to_jsonb(app_role));

    -- Update the 'claims' object in the original event
    event := jsonb_set(event, '{claims}', claims);

    -- Return the modified or original event
    return event;
  end;
$$;


ALTER FUNCTION "public"."custom_access_token_hook"("event" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."enforce_times"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
declare
	has_created_at boolean;
	has_updated_at boolean;
begin

	SELECT EXISTS (
    SELECT 1
    FROM pg_attribute
    WHERE attrelid = format('%I.%I', TG_TABLE_SCHEMA, TG_TABLE_NAME)::regclass
      AND attname = 'updated_at'
      AND NOT attisdropped
  	)
 	INTO has_updated_at;

	SELECT EXISTS (
    SELECT 1
    FROM pg_attribute
    WHERE attrelid = format('%I.%I', TG_TABLE_SCHEMA, TG_TABLE_NAME)::regclass
      AND attname = 'created_at'
      AND NOT attisdropped
  	)
 	INTO has_created_at;

	if has_created_at then

		if TG_OP = 'INSERT' then
			new.created_at = now();
		else
			new.created_at = old.created_at;
		end if;
	
	end if;

	if has_updated_at then

		new.updated_at = now();

	end if;

	return new;

end;
$$;


ALTER FUNCTION "public"."enforce_times"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_role_code"("r" "public"."user_role") RETURNS integer
    LANGUAGE "plpgsql"
    SET "search_path" TO ''
    AS $$
begin
	return case r
		when "participant" then 0
		when "guide" then 1
		when "admin" then 2
		when "superadmin" then 3
	end;
end;
$$;


ALTER FUNCTION "public"."get_role_code"("r" "public"."user_role") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $_$
declare

fname text;
lname text;
env text;

begin

	select "value" into env
	from public.env where "key" = 'env';

	if new.email is null then
		raise exception 'email is null';
	end if;

	if env != 'development' and new.email !~* '@usc.edu$' then
		raise exception 'must signup with @usc.edu email address';
	end if;

	if new.raw_user_meta_data->>'first_name' is null then
		fname := new.email;
	else
		select new.raw_user_meta_data->>'first_name' into fname;
	end if;

	if new.raw_user_meta_data->>'last_name' is null then
		lname := new.email;
	else
		select new.raw_user_meta_data->>'last_name' into lname;
	end if;

	insert into public.profiles (id, first_name, last_name)
	values (
		new.id,
		fname,
		lname
	);

	insert into public.roles ("user_id", "role")
	values (
		new.id,
		'participant'
	);

	return new;
end;
$_$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."has_trip_ticket"("user" "uuid", "trip" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" STABLE
    SET "search_path" TO ''
    AS $$
begin
	return exists (
		select 1 from public.tickets
		where tickets.user_id = "user" and tickets.trip_id = "trip"
	);
end;
$$;


ALTER FUNCTION "public"."has_trip_ticket"("user" "uuid", "trip" "uuid") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."allowed_trip_participants" (
    "trip_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "approved_by" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."allowed_trip_participants" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."driver_info" (
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "drivers_license_number" "text" NOT NULL,
    "vehicle_make_and_model" "text" NOT NULL,
    "vehicle_year" integer NOT NULL,
    "vehicle_owner_name" "text" NOT NULL,
    "vehicle_owner_address" "text" NOT NULL,
    "auto_insurance_company" "text" NOT NULL,
    "auto_insurance_policy_number" "text" NOT NULL,
    "num_seats" integer NOT NULL,
    "slack_interested" boolean NOT NULL,
    "drivers_license_expiration" "date" NOT NULL,
    "affirm_good_condition" boolean NOT NULL,
    "drivers_license_state" "text" NOT NULL,
    "license_plate_number" "text" NOT NULL,
    "is_4wd" boolean NOT NULL,
    CONSTRAINT "driver_info_drivers_license_expiration_check" CHECK (("drivers_license_expiration" > CURRENT_DATE))
);


ALTER TABLE "public"."driver_info" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."env" (
    "key" "text" NOT NULL,
    "value" "text" NOT NULL
);


ALTER TABLE "public"."env" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."guide_info" (
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "has_car" boolean NOT NULL,
    "guide_class" integer NOT NULL,
    "active" boolean DEFAULT true NOT NULL,
    "position" "public"."guide_position" DEFAULT 'new_guide'::"public"."guide_position" NOT NULL,
    "emergency_contact_name" "text" NOT NULL,
    "emergency_contact_phone_number" "text" NOT NULL,
    "emergency_contact_relationship" "text" NOT NULL,
    "medical_history" "text",
    "is_wfr" boolean DEFAULT false NOT NULL,
    "wfr_expiration_date" "date",
    CONSTRAINT "guide_info_check" CHECK (((NOT "is_wfr") OR ("wfr_expiration_date" IS NOT NULL)))
);


ALTER TABLE "public"."guide_info" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."hard_trip_participants" (
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "approved_by" "uuid" NOT NULL,
    "notes" "text",
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."hard_trip_participants" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."membership_prices" (
    "length" "public"."membership_length" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "stripe_price_id" "text" NOT NULL,
    "unit_amount" integer NOT NULL
);


ALTER TABLE "public"."membership_prices" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."memberships" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "expires_at" timestamp with time zone NOT NULL,
    "stripe_payment_id" "text" NOT NULL,
    "length" "public"."membership_length" NOT NULL
);


ALTER TABLE "public"."memberships" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."participant_comments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "content" "text" NOT NULL
);


ALTER TABLE "public"."participant_comments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."participant_info" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "allergies" "text" NOT NULL,
    "medical_history" "text" NOT NULL,
    "medications" "text" NOT NULL,
    "dietary_restrictions" "text" NOT NULL,
    "emergency_contact_name" "text" NOT NULL,
    "emergency_contact_phone_number" "text" NOT NULL,
    "emergency_contact_relationship" "text" NOT NULL,
    "health_insurance_bin_number" "text" NOT NULL,
    "health_insurance_group_number" "text" NOT NULL,
    "health_insurance_member_id" "text" NOT NULL,
    "health_insurance_provider" "text" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "usc_id" "text" NOT NULL,
    "graduation_year" smallint NOT NULL,
    "graduation_season" "public"."graduation_season_type" NOT NULL,
    "degree_path" "public"."degree_path_type" NOT NULL,
    CONSTRAINT "participant_info_usc_id_check" CHECK (("usc_id" ~ '^\d{10}$'::"text"))
);


ALTER TABLE "public"."participant_info" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "first_name" "text" NOT NULL,
    "last_name" "text" NOT NULL,
    "avatar" "text"
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."published_trips" (
    "id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "picture" "text" NOT NULL,
    "start_date" timestamp with time zone NOT NULL,
    "end_date" timestamp with time zone NOT NULL,
    "meet" "text" NOT NULL,
    "return" "text" NOT NULL,
    "activity" "text" NOT NULL,
    "difficulty" "text" NOT NULL,
    "trail" "text" NOT NULL,
    "recommended_prior_experience" "text" NOT NULL,
    "location" "text" NOT NULL,
    "native_land" "text" NOT NULL,
    "description" "text" NOT NULL,
    "what_to_bring" "text"[] NOT NULL,
    "guides" "jsonb" NOT NULL,
    "visible" boolean DEFAULT true NOT NULL
);


ALTER TABLE "public"."published_trips" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."roles" (
    "user_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "role" "public"."user_role" DEFAULT 'participant'::"public"."user_role" NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."roles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tickets" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "trip_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "cancelled" boolean DEFAULT false NOT NULL,
    "refunded" boolean DEFAULT false NOT NULL,
    "cancelled_at" timestamp with time zone,
    "stripe_payment_id" "text" NOT NULL,
    "type" "public"."ticket_price_type" NOT NULL,
    "amount_paid" numeric NOT NULL,
    "stripe_refund_id" "text",
    "receipt_url" "text" DEFAULT 'https://www.stripe.com'::"text" NOT NULL,
    "driver_waiver_filepath" "text",
    "waiver_filepath" "text"
);


ALTER TABLE "public"."tickets" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."trip_budgets" (
    "trip_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "car_rental_price" numeric DEFAULT '0'::numeric NOT NULL,
    "car_mpgs" real[] DEFAULT '{}'::real[] NOT NULL,
    "total_miles" integer DEFAULT 0 NOT NULL,
    "breakfasts" integer DEFAULT 0 NOT NULL,
    "lunches" integer DEFAULT 0 NOT NULL,
    "dinners" integer DEFAULT 0 NOT NULL,
    "snacks" integer DEFAULT 0 NOT NULL,
    "permit_cost" numeric DEFAULT '0'::numeric NOT NULL,
    "parking_cost" numeric DEFAULT '0'::numeric NOT NULL,
    "other" "jsonb",
    CONSTRAINT "trip_budgets_breakfasts_check" CHECK (("breakfasts" >= 0)),
    CONSTRAINT "trip_budgets_car_rental_price_check" CHECK (("car_rental_price" >= 0.0)),
    CONSTRAINT "trip_budgets_dinners_check" CHECK (("dinners" >= 0)),
    CONSTRAINT "trip_budgets_lunches_check" CHECK (("lunches" >= 0)),
    CONSTRAINT "trip_budgets_parking_cost_check" CHECK (("parking_cost" >= 0.0)),
    CONSTRAINT "trip_budgets_permit_cost_check" CHECK (("permit_cost" >= 0.0)),
    CONSTRAINT "trip_budgets_snacks_check" CHECK (("snacks" >= 0)),
    CONSTRAINT "trip_budgets_total_miles_check" CHECK (("total_miles" >= 0))
);


ALTER TABLE "public"."trip_budgets" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."trip_checkout_sessions" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "trip_id" "uuid" NOT NULL,
    "expires_at" timestamp with time zone DEFAULT ("now"() + '00:15:00'::interval) NOT NULL,
    "stripe_cs_id" "text" NOT NULL,
    "status" "public"."checkout_session_status" DEFAULT 'open'::"public"."checkout_session_status" NOT NULL,
    "price_id" "text" NOT NULL
);


ALTER TABLE "public"."trip_checkout_sessions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."trip_cycles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "starts_at" timestamp with time zone NOT NULL,
    "ends_at" timestamp with time zone NOT NULL,
    "trips_published_at" timestamp with time zone NOT NULL,
    "member_signups_start_at" timestamp with time zone NOT NULL,
    "nonmember_signups_start_at" timestamp with time zone NOT NULL,
    "range" "tstzrange" GENERATED ALWAYS AS ("tstzrange"("starts_at", "ends_at", '[)'::"text")) STORED,
    "trip_feedback_form" "text",
    "guide_post_trip_form" "text",
    CONSTRAINT "end_after_start" CHECK (("starts_at" < "ends_at"))
);


ALTER TABLE "public"."trip_cycles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."trip_details" (
    "trip_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "meet" "text" NOT NULL,
    "return" "text" NOT NULL,
    "activity" "text" NOT NULL,
    "difficulty" "text" NOT NULL,
    "trail" "text" NOT NULL,
    "prior_experience" "text" NOT NULL,
    "location" "text" NOT NULL,
    "native_land" "text" NOT NULL
);


ALTER TABLE "public"."trip_details" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."trip_guides" (
    "user_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "trip_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


ALTER TABLE "public"."trip_guides" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."trip_prices" (
    "trip_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "active" boolean DEFAULT true NOT NULL,
    "amount" numeric NOT NULL,
    "archived_at" timestamp with time zone,
    "stripe_price_id" "text" NOT NULL,
    "stripe_product_id" "text" NOT NULL,
    "ticket_type" "public"."ticket_price_type" NOT NULL
);


ALTER TABLE "public"."trip_prices" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."trip_waivers" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "trip_id" "uuid" NOT NULL,
    "content" "jsonb" NOT NULL,
    "type" "public"."participant_type" NOT NULL,
    "template_id" "uuid" NOT NULL,
    "title" "text" NOT NULL
);


ALTER TABLE "public"."trip_waivers" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."trips" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "picture" "text",
    "driver_spots" integer NOT NULL,
    "participant_spots" integer NOT NULL,
    "ends_at" timestamp with time zone NOT NULL,
    "starts_at" timestamp with time zone NOT NULL,
    "gear_questions" "text"[],
    "signup_status" "public"."trip_signup_status" DEFAULT 'open'::"public"."trip_signup_status" NOT NULL,
    "what_to_bring" "text",
    "access_code" "text",
    CONSTRAINT "ends_after_start" CHECK (("starts_at" < "ends_at")),
    CONSTRAINT "trips_driver_spots_check" CHECK (("driver_spots" >= 0)),
    CONSTRAINT "trips_participant_spots_check" CHECK (("participant_spots" >= 0))
);


ALTER TABLE "public"."trips" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."waitlist_signups" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "user_id" "uuid" NOT NULL,
    "trip_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "status" "public"."waitlist_status" DEFAULT 'waiting'::"public"."waitlist_status" NOT NULL,
    "open_until" timestamp with time zone,
    "notification_sent_at" timestamp with time zone
);


ALTER TABLE "public"."waitlist_signups" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."waiver_events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "event" "public"."waiver_event" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "trip_id" "uuid" NOT NULL,
    "ip_address" "text" NOT NULL,
    "user_agent" "text" DEFAULT 'unknown'::"text" NOT NULL,
    "file_path" "text",
    "waiver_id" "uuid" NOT NULL
);


ALTER TABLE "public"."waiver_events" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."waiver_templates" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "content" "jsonb" NOT NULL,
    "active" boolean DEFAULT false NOT NULL,
    "title" "text" NOT NULL,
    "type" "public"."participant_type" DEFAULT 'participant'::"public"."participant_type" NOT NULL
);


ALTER TABLE "public"."waiver_templates" OWNER TO "postgres";


ALTER TABLE ONLY "public"."allowed_trip_participants"
    ADD CONSTRAINT "allowed_trip_participants_pkey" PRIMARY KEY ("trip_id");



ALTER TABLE ONLY "public"."driver_info"
    ADD CONSTRAINT "driver_info_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."env"
    ADD CONSTRAINT "env_pkey" PRIMARY KEY ("key");



ALTER TABLE ONLY "public"."guide_info"
    ADD CONSTRAINT "guide_info_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."hard_trip_participants"
    ADD CONSTRAINT "hard_trip_participants_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."membership_prices"
    ADD CONSTRAINT "membership_prices_pkey" PRIMARY KEY ("length");



ALTER TABLE ONLY "public"."membership_prices"
    ADD CONSTRAINT "membership_prices_stripe_price_id_key" UNIQUE ("stripe_price_id");



ALTER TABLE ONLY "public"."memberships"
    ADD CONSTRAINT "memberships_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."memberships"
    ADD CONSTRAINT "memberships_stripe_payment_id_key" UNIQUE ("stripe_payment_id");



ALTER TABLE ONLY "public"."trip_cycles"
    ADD CONSTRAINT "no_overlapping_trip_cycles" EXCLUDE USING "gist" ("range" WITH &&);



ALTER TABLE ONLY "public"."participant_comments"
    ADD CONSTRAINT "participant_comments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."participant_info"
    ADD CONSTRAINT "participant_info_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."published_trips"
    ADD CONSTRAINT "published_trips_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."roles"
    ADD CONSTRAINT "roles_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."trip_prices"
    ADD CONSTRAINT "stripe_prices_pkey" PRIMARY KEY ("stripe_price_id");



ALTER TABLE ONLY "public"."trip_checkout_sessions"
    ADD CONSTRAINT "ticket_reservations_pkey" PRIMARY KEY ("stripe_cs_id");



ALTER TABLE ONLY "public"."tickets"
    ADD CONSTRAINT "tickets_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tickets"
    ADD CONSTRAINT "tickets_stripe_checkout_session_id_key" UNIQUE ("stripe_payment_id");



ALTER TABLE ONLY "public"."tickets"
    ADD CONSTRAINT "tickets_stripe_refund_id_key" UNIQUE ("stripe_refund_id");



ALTER TABLE ONLY "public"."tickets"
    ADD CONSTRAINT "tickets_unique_trip_participant" UNIQUE ("user_id", "trip_id");



ALTER TABLE ONLY "public"."trip_budgets"
    ADD CONSTRAINT "trip_budgets_pkey" PRIMARY KEY ("trip_id");



ALTER TABLE ONLY "public"."trip_cycles"
    ADD CONSTRAINT "trip_cycles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."trip_details"
    ADD CONSTRAINT "trip_details_pkey" PRIMARY KEY ("trip_id");



ALTER TABLE ONLY "public"."trip_guides"
    ADD CONSTRAINT "trip_guides_pkey" PRIMARY KEY ("user_id", "trip_id");



ALTER TABLE ONLY "public"."trip_waivers"
    ADD CONSTRAINT "trip_waivers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."trips"
    ADD CONSTRAINT "trips_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."trip_checkout_sessions"
    ADD CONSTRAINT "user_trip_unique" UNIQUE ("user_id", "trip_id");



ALTER TABLE ONLY "public"."waitlist_signups"
    ADD CONSTRAINT "waitlist_signups_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."waitlist_signups"
    ADD CONSTRAINT "waitlist_signups_user_trip_unique" UNIQUE ("user_id", "trip_id");



ALTER TABLE ONLY "public"."waiver_events"
    ADD CONSTRAINT "waiver_events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."waiver_templates"
    ADD CONSTRAINT "waiver_templates_pkey" PRIMARY KEY ("id");



CREATE OR REPLACE TRIGGER "checkout_sessions_enforce_times_trg" BEFORE INSERT OR UPDATE ON "public"."trip_checkout_sessions" FOR EACH ROW EXECUTE FUNCTION "public"."enforce_times"();



CREATE OR REPLACE TRIGGER "driver_info_enforce_times_trg" BEFORE INSERT OR UPDATE ON "public"."driver_info" FOR EACH ROW EXECUTE FUNCTION "public"."enforce_times"();



CREATE OR REPLACE TRIGGER "guide_info_enforce_times_trg" BEFORE INSERT OR UPDATE ON "public"."guide_info" FOR EACH ROW EXECUTE FUNCTION "public"."enforce_times"();



CREATE OR REPLACE TRIGGER "hard_trip_participants_enforce_times_trg" BEFORE INSERT OR UPDATE ON "public"."hard_trip_participants" FOR EACH ROW EXECUTE FUNCTION "public"."enforce_times"();



CREATE OR REPLACE TRIGGER "memberships_enforce_times_trg" BEFORE INSERT OR UPDATE ON "public"."memberships" FOR EACH ROW EXECUTE FUNCTION "public"."enforce_times"();



CREATE OR REPLACE TRIGGER "participant_info_enforce_times_trg" BEFORE INSERT OR UPDATE ON "public"."participant_info" FOR EACH ROW EXECUTE FUNCTION "public"."enforce_times"();



CREATE OR REPLACE TRIGGER "roles_enforce_times_trg" BEFORE INSERT OR UPDATE ON "public"."roles" FOR EACH ROW EXECUTE FUNCTION "public"."enforce_times"();



CREATE OR REPLACE TRIGGER "tickets_enforce_times_trg" BEFORE INSERT OR UPDATE ON "public"."tickets" FOR EACH ROW EXECUTE FUNCTION "public"."enforce_times"();



CREATE OR REPLACE TRIGGER "trip_budgets_enforce_times_trg" BEFORE INSERT OR UPDATE ON "public"."trip_budgets" FOR EACH ROW EXECUTE FUNCTION "public"."enforce_times"();



CREATE OR REPLACE TRIGGER "trip_cycles_enforce_times_trg" BEFORE INSERT OR UPDATE ON "public"."trip_cycles" FOR EACH ROW EXECUTE FUNCTION "public"."enforce_times"();



CREATE OR REPLACE TRIGGER "trips_enforce_times_trg" BEFORE INSERT OR UPDATE ON "public"."trips" FOR EACH ROW EXECUTE FUNCTION "public"."enforce_times"();



CREATE OR REPLACE TRIGGER "waitlist_signups_enforce_times_trg" BEFORE INSERT OR UPDATE ON "public"."waitlist_signups" FOR EACH ROW EXECUTE FUNCTION "public"."enforce_times"();



ALTER TABLE ONLY "public"."allowed_trip_participants"
    ADD CONSTRAINT "allowed_trip_participants_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."allowed_trip_participants"
    ADD CONSTRAINT "allowed_trip_participants_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id");



ALTER TABLE ONLY "public"."allowed_trip_participants"
    ADD CONSTRAINT "allowed_trip_participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."trip_checkout_sessions"
    ADD CONSTRAINT "checkout_sessions_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id");



ALTER TABLE ONLY "public"."trip_checkout_sessions"
    ADD CONSTRAINT "checkout_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."driver_info"
    ADD CONSTRAINT "driver_info_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."guide_info"
    ADD CONSTRAINT "guide_info_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."hard_trip_participants"
    ADD CONSTRAINT "hard_trip_participants_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."hard_trip_participants"
    ADD CONSTRAINT "hard_trip_participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."participant_comments"
    ADD CONSTRAINT "participant_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."participant_info"
    ADD CONSTRAINT "participant_info_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."published_trips"
    ADD CONSTRAINT "published_trips_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."trips"("id");



ALTER TABLE ONLY "public"."roles"
    ADD CONSTRAINT "roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."trip_prices"
    ADD CONSTRAINT "stripe_prices_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id");



ALTER TABLE ONLY "public"."tickets"
    ADD CONSTRAINT "tickets_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "public"."published_trips"("id");



ALTER TABLE ONLY "public"."tickets"
    ADD CONSTRAINT "tickets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."trip_budgets"
    ADD CONSTRAINT "trip_budgets_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id");



ALTER TABLE ONLY "public"."trip_checkout_sessions"
    ADD CONSTRAINT "trip_checkout_sessions_price_id_fkey" FOREIGN KEY ("price_id") REFERENCES "public"."trip_prices"("stripe_price_id");



ALTER TABLE ONLY "public"."trip_details"
    ADD CONSTRAINT "trip_details_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id");



ALTER TABLE ONLY "public"."trip_guides"
    ADD CONSTRAINT "trip_guides_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."trip_guides"
    ADD CONSTRAINT "trip_guides_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."trip_waivers"
    ADD CONSTRAINT "trip_waivers_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "public"."waiver_templates"("id");



ALTER TABLE ONLY "public"."trip_waivers"
    ADD CONSTRAINT "trip_waivers_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id");



ALTER TABLE ONLY "public"."waitlist_signups"
    ADD CONSTRAINT "waitlist_signups_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id");



ALTER TABLE ONLY "public"."waitlist_signups"
    ADD CONSTRAINT "waitlist_signups_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."waiver_events"
    ADD CONSTRAINT "waiver_events_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id");



ALTER TABLE ONLY "public"."waiver_events"
    ADD CONSTRAINT "waiver_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."waiver_events"
    ADD CONSTRAINT "waiver_events_waiver_id_fkey" FOREIGN KEY ("waiver_id") REFERENCES "public"."trip_waivers"("id");



CREATE POLICY "Allow auth admin to read user roles" ON "public"."roles" FOR SELECT TO "supabase_auth_admin" USING (true);



CREATE POLICY "Allow participants who have a ticket to view the trip, even if " ON "public"."published_trips" FOR SELECT TO "authenticated" USING ("public"."has_trip_ticket"(( SELECT "auth"."uid"() AS "uid"), "id"));



CREATE POLICY "Allow user to select own profile" ON "public"."profiles" FOR SELECT TO "authenticated" USING (("id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "Authenticated users can view visible trips" ON "public"."published_trips" FOR SELECT TO "authenticated" USING ("visible");



CREATE POLICY "Participants can insert their own information" ON "public"."participant_info" FOR INSERT TO "authenticated" WITH CHECK (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "Participants can select their own information" ON "public"."participant_info" FOR SELECT TO "authenticated" USING (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "Participants can select their own tickets" ON "public"."tickets" FOR SELECT TO "authenticated" USING (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "Participants can update their own information" ON "public"."participant_info" FOR UPDATE TO "authenticated" USING (("user_id" = ( SELECT "auth"."uid"() AS "uid"))) WITH CHECK (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



ALTER TABLE "public"."allowed_trip_participants" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."driver_info" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."env" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."guide_info" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."hard_trip_participants" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."membership_prices" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."memberships" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."participant_comments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."participant_info" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."published_trips" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."roles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."tickets" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."trip_budgets" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."trip_checkout_sessions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."trip_cycles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."trip_details" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."trip_guides" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."trip_prices" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."trip_waivers" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."trips" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."waitlist_signups" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."waiver_events" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."waiver_templates" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";





GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";































































































































































GRANT ALL ON FUNCTION "public"."add_auto_timestamps_triggers"() TO "anon";
GRANT ALL ON FUNCTION "public"."add_auto_timestamps_triggers"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."add_auto_timestamps_triggers"() TO "service_role";



GRANT ALL ON FUNCTION "public"."authorize"("authorized_role" "public"."user_role") TO "anon";
GRANT ALL ON FUNCTION "public"."authorize"("authorized_role" "public"."user_role") TO "authenticated";
GRANT ALL ON FUNCTION "public"."authorize"("authorized_role" "public"."user_role") TO "service_role";



GRANT ALL ON FUNCTION "public"."custom_access_token_hook"("event" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."custom_access_token_hook"("event" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."custom_access_token_hook"("event" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."enforce_times"() TO "anon";
GRANT ALL ON FUNCTION "public"."enforce_times"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."enforce_times"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_role_code"("r" "public"."user_role") TO "anon";
GRANT ALL ON FUNCTION "public"."get_role_code"("r" "public"."user_role") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_role_code"("r" "public"."user_role") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."has_trip_ticket"("user" "uuid", "trip" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."has_trip_ticket"("user" "uuid", "trip" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."has_trip_ticket"("user" "uuid", "trip" "uuid") TO "service_role";


















GRANT ALL ON TABLE "public"."allowed_trip_participants" TO "anon";
GRANT ALL ON TABLE "public"."allowed_trip_participants" TO "authenticated";
GRANT ALL ON TABLE "public"."allowed_trip_participants" TO "service_role";



GRANT ALL ON TABLE "public"."driver_info" TO "anon";
GRANT ALL ON TABLE "public"."driver_info" TO "authenticated";
GRANT ALL ON TABLE "public"."driver_info" TO "service_role";



GRANT ALL ON TABLE "public"."env" TO "anon";
GRANT ALL ON TABLE "public"."env" TO "authenticated";
GRANT ALL ON TABLE "public"."env" TO "service_role";



GRANT ALL ON TABLE "public"."guide_info" TO "anon";
GRANT ALL ON TABLE "public"."guide_info" TO "authenticated";
GRANT ALL ON TABLE "public"."guide_info" TO "service_role";



GRANT ALL ON TABLE "public"."hard_trip_participants" TO "anon";
GRANT ALL ON TABLE "public"."hard_trip_participants" TO "authenticated";
GRANT ALL ON TABLE "public"."hard_trip_participants" TO "service_role";



GRANT ALL ON TABLE "public"."membership_prices" TO "anon";
GRANT ALL ON TABLE "public"."membership_prices" TO "authenticated";
GRANT ALL ON TABLE "public"."membership_prices" TO "service_role";



GRANT ALL ON TABLE "public"."memberships" TO "anon";
GRANT ALL ON TABLE "public"."memberships" TO "authenticated";
GRANT ALL ON TABLE "public"."memberships" TO "service_role";



GRANT ALL ON TABLE "public"."participant_comments" TO "anon";
GRANT ALL ON TABLE "public"."participant_comments" TO "authenticated";
GRANT ALL ON TABLE "public"."participant_comments" TO "service_role";



GRANT ALL ON TABLE "public"."participant_info" TO "anon";
GRANT ALL ON TABLE "public"."participant_info" TO "authenticated";
GRANT ALL ON TABLE "public"."participant_info" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."published_trips" TO "anon";
GRANT ALL ON TABLE "public"."published_trips" TO "authenticated";
GRANT ALL ON TABLE "public"."published_trips" TO "service_role";



GRANT MAINTAIN ON TABLE "public"."roles" TO "anon";
GRANT MAINTAIN ON TABLE "public"."roles" TO "authenticated";
GRANT ALL ON TABLE "public"."roles" TO "service_role";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."roles" TO "supabase_auth_admin";



GRANT ALL ON TABLE "public"."tickets" TO "anon";
GRANT ALL ON TABLE "public"."tickets" TO "authenticated";
GRANT ALL ON TABLE "public"."tickets" TO "service_role";



GRANT ALL ON TABLE "public"."trip_budgets" TO "anon";
GRANT ALL ON TABLE "public"."trip_budgets" TO "authenticated";
GRANT ALL ON TABLE "public"."trip_budgets" TO "service_role";



GRANT ALL ON TABLE "public"."trip_checkout_sessions" TO "anon";
GRANT ALL ON TABLE "public"."trip_checkout_sessions" TO "authenticated";
GRANT ALL ON TABLE "public"."trip_checkout_sessions" TO "service_role";



GRANT ALL ON TABLE "public"."trip_cycles" TO "anon";
GRANT ALL ON TABLE "public"."trip_cycles" TO "authenticated";
GRANT ALL ON TABLE "public"."trip_cycles" TO "service_role";



GRANT ALL ON TABLE "public"."trip_details" TO "anon";
GRANT ALL ON TABLE "public"."trip_details" TO "authenticated";
GRANT ALL ON TABLE "public"."trip_details" TO "service_role";



GRANT ALL ON TABLE "public"."trip_guides" TO "anon";
GRANT ALL ON TABLE "public"."trip_guides" TO "authenticated";
GRANT ALL ON TABLE "public"."trip_guides" TO "service_role";



GRANT ALL ON TABLE "public"."trip_prices" TO "anon";
GRANT ALL ON TABLE "public"."trip_prices" TO "authenticated";
GRANT ALL ON TABLE "public"."trip_prices" TO "service_role";



GRANT ALL ON TABLE "public"."trip_waivers" TO "anon";
GRANT ALL ON TABLE "public"."trip_waivers" TO "authenticated";
GRANT ALL ON TABLE "public"."trip_waivers" TO "service_role";



GRANT ALL ON TABLE "public"."trips" TO "anon";
GRANT ALL ON TABLE "public"."trips" TO "authenticated";
GRANT ALL ON TABLE "public"."trips" TO "service_role";



GRANT ALL ON TABLE "public"."waitlist_signups" TO "anon";
GRANT ALL ON TABLE "public"."waitlist_signups" TO "authenticated";
GRANT ALL ON TABLE "public"."waitlist_signups" TO "service_role";



GRANT ALL ON TABLE "public"."waiver_events" TO "anon";
GRANT ALL ON TABLE "public"."waiver_events" TO "authenticated";
GRANT ALL ON TABLE "public"."waiver_events" TO "service_role";



GRANT ALL ON TABLE "public"."waiver_templates" TO "anon";
GRANT ALL ON TABLE "public"."waiver_templates" TO "authenticated";
GRANT ALL ON TABLE "public"."waiver_templates" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";
































--
-- Dumped schema changes for auth and storage
--

CREATE OR REPLACE TRIGGER "handle_new_user_trg" AFTER INSERT ON "auth"."users" FOR EACH ROW EXECUTE FUNCTION "public"."handle_new_user"();



CREATE POLICY "Give users access to own folder ignnv3_0" ON "storage"."objects" FOR SELECT TO "authenticated" USING ((("bucket_id" = 'waivers'::"text") AND (( SELECT ("auth"."uid"())::"text" AS "uid") = ("storage"."foldername"("name"))[1])));



