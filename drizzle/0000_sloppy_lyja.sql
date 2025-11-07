-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE SCHEMA "auth";
--> statement-breakpoint
CREATE TYPE "auth"."aal_level" AS ENUM('aal1', 'aal2', 'aal3');--> statement-breakpoint
CREATE TYPE "auth"."code_challenge_method" AS ENUM('s256', 'plain');--> statement-breakpoint
CREATE TYPE "auth"."factor_status" AS ENUM('unverified', 'verified');--> statement-breakpoint
CREATE TYPE "auth"."factor_type" AS ENUM('totp', 'webauthn', 'phone');--> statement-breakpoint
CREATE TYPE "auth"."oauth_authorization_status" AS ENUM('pending', 'approved', 'denied', 'expired');--> statement-breakpoint
CREATE TYPE "auth"."oauth_client_type" AS ENUM('public', 'confidential');--> statement-breakpoint
CREATE TYPE "auth"."oauth_registration_type" AS ENUM('dynamic', 'manual');--> statement-breakpoint
CREATE TYPE "auth"."oauth_response_type" AS ENUM('code');--> statement-breakpoint
CREATE TYPE "auth"."one_time_token_type" AS ENUM('confirmation_token', 'reauthentication_token', 'recovery_token', 'email_change_token_new', 'email_change_token_current', 'phone_change_token');--> statement-breakpoint
CREATE TYPE "public"."checkout_session_status" AS ENUM('open', 'complete', 'expired');--> statement-breakpoint
CREATE TYPE "public"."guide_position" AS ENUM('new_guide', 'guide', 'longboard', 'alum');--> statement-breakpoint
CREATE TYPE "public"."membership_length" AS ENUM('semester', 'year');--> statement-breakpoint
CREATE TYPE "public"."ticket_type" AS ENUM('member', 'nonmember', 'driver');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('participant', 'guide', 'admin', 'superadmin');--> statement-breakpoint
CREATE TYPE "public"."waitlist_status" AS ENUM('waiting', 'notification_sent', 'signed_up', 'expired');--> statement-breakpoint
CREATE TABLE "forms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"form_schema" jsonb NOT NULL
);
--> statement-breakpoint
ALTER TABLE "forms" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "trip_budgets" (
	"trip_id" uuid PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"car_rental_price" numeric DEFAULT '0' NOT NULL,
	"car_mpgs" real[] DEFAULT '{}' NOT NULL,
	"total_miles" integer DEFAULT 0 NOT NULL,
	"breakfasts" integer DEFAULT 0 NOT NULL,
	"lunches" integer DEFAULT 0 NOT NULL,
	"dinners" integer DEFAULT 0 NOT NULL,
	"snacks" integer DEFAULT 0 NOT NULL,
	"permit_cost" numeric DEFAULT '0' NOT NULL,
	"parking_cost" numeric DEFAULT '0' NOT NULL,
	"other" jsonb,
	CONSTRAINT "trip_budgets_car_rental_price_check" CHECK (car_rental_price >= 0.0),
	CONSTRAINT "trip_budgets_total_miles_check" CHECK (total_miles >= 0),
	CONSTRAINT "trip_budgets_breakfasts_check" CHECK (breakfasts >= 0),
	CONSTRAINT "trip_budgets_lunches_check" CHECK (lunches >= 0),
	CONSTRAINT "trip_budgets_dinners_check" CHECK (dinners >= 0),
	CONSTRAINT "trip_budgets_snacks_check" CHECK (snacks >= 0),
	CONSTRAINT "trip_budgets_permit_cost_check" CHECK (permit_cost >= 0.0),
	CONSTRAINT "trip_budgets_parking_cost_check" CHECK (parking_cost >= 0.0)
);
--> statement-breakpoint
ALTER TABLE "trip_budgets" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "form_responses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"form_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"response" jsonb NOT NULL,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "form_responses" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "waiver_uploads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"ticket_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"bucket" text DEFAULT 'private' NOT NULL,
	"path" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "waiver_uploads" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "trip_ticket_info" (
	"trip_id" uuid PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"participant_tickets_sold" integer DEFAULT 0 NOT NULL,
	"driver_tickets_sold" integer DEFAULT 0 NOT NULL,
	"participant_waitlist_only" boolean DEFAULT false NOT NULL,
	"driver_waitlist_only" boolean DEFAULT false NOT NULL,
	CONSTRAINT "trip_ticket_info_participant_tickets_sold_check" CHECK (participant_tickets_sold >= 0),
	CONSTRAINT "trip_ticket_info_driver_tickets_sold_check" CHECK (driver_tickets_sold >= 0)
);
--> statement-breakpoint
ALTER TABLE "trip_ticket_info" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "auth"."oauth_authorizations" (
	"id" uuid NOT NULL,
	"authorization_id" text NOT NULL,
	"client_id" uuid NOT NULL,
	"user_id" uuid,
	"redirect_uri" text NOT NULL,
	"scope" text NOT NULL,
	"state" text,
	"resource" text,
	"code_challenge" text,
	"code_challenge_method" "auth"."code_challenge_method",
	"response_type" "auth"."oauth_response_type" DEFAULT 'code' NOT NULL,
	"status" "auth"."oauth_authorization_status" DEFAULT 'pending' NOT NULL,
	"authorization_code" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone DEFAULT (now() + '00:03:00'::interval) NOT NULL,
	"approved_at" timestamp with time zone,
	CONSTRAINT "oauth_authorizations_redirect_uri_length" CHECK (char_length(redirect_uri) <= 2048),
	CONSTRAINT "oauth_authorizations_scope_length" CHECK (char_length(scope) <= 4096),
	CONSTRAINT "oauth_authorizations_state_length" CHECK (char_length(state) <= 4096),
	CONSTRAINT "oauth_authorizations_resource_length" CHECK (char_length(resource) <= 2048),
	CONSTRAINT "oauth_authorizations_code_challenge_length" CHECK (char_length(code_challenge) <= 128),
	CONSTRAINT "oauth_authorizations_authorization_code_length" CHECK (char_length(authorization_code) <= 255),
	CONSTRAINT "oauth_authorizations_expires_at_future" CHECK (expires_at > created_at)
);
--> statement-breakpoint
CREATE TABLE "auth"."oauth_consents" (
	"id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"client_id" uuid NOT NULL,
	"scopes" text NOT NULL,
	"granted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"revoked_at" timestamp with time zone,
	CONSTRAINT "oauth_consents_scopes_length" CHECK (char_length(scopes) <= 2048),
	CONSTRAINT "oauth_consents_scopes_not_empty" CHECK (char_length(TRIM(BOTH FROM scopes)) > 0),
	CONSTRAINT "oauth_consents_revoked_after_granted" CHECK ((revoked_at IS NULL) OR (revoked_at >= granted_at))
);
--> statement-breakpoint
CREATE TABLE "auth"."oauth_clients" (
	"id" uuid NOT NULL,
	"client_secret_hash" text,
	"registration_type" "auth"."oauth_registration_type" NOT NULL,
	"redirect_uris" text NOT NULL,
	"grant_types" text NOT NULL,
	"client_name" text,
	"client_uri" text,
	"logo_uri" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"client_type" "auth"."oauth_client_type" DEFAULT 'confidential' NOT NULL,
	CONSTRAINT "oauth_clients_client_name_length" CHECK (char_length(client_name) <= 1024),
	CONSTRAINT "oauth_clients_client_uri_length" CHECK (char_length(client_uri) <= 2048),
	CONSTRAINT "oauth_clients_logo_uri_length" CHECK (char_length(logo_uri) <= 2048)
);
--> statement-breakpoint
CREATE TABLE "participant_info" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"allergies" text NOT NULL,
	"medical_history" text NOT NULL,
	"medications" text NOT NULL,
	"dietary_restrictions" text NOT NULL,
	"emergency_contact_name" text NOT NULL,
	"emergency_contact_phone_number" text NOT NULL,
	"emergency_contact_relationship" text NOT NULL,
	"health_insurance_provider" text NOT NULL,
	"health_insurance_member_id" text NOT NULL,
	"health_insurance_group_number" text NOT NULL,
	"health_insurance_bin_number" text NOT NULL,
	"usc_id" integer NOT NULL,
	CONSTRAINT "participant_info_usc_id_key" UNIQUE("usc_id"),
	CONSTRAINT "participant_info_usc_id_check" CHECK (usc_id < '9999999999'::bigint)
);
--> statement-breakpoint
ALTER TABLE "participant_info" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "memberships" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"stripe_payment_id" text NOT NULL,
	"length" "membership_length" NOT NULL,
	CONSTRAINT "memberships_stripe_payment_id_key" UNIQUE("stripe_payment_id")
);
--> statement-breakpoint
ALTER TABLE "memberships" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "trip_prices" (
	"trip_id" uuid PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"stripe_participant_product_id" text NOT NULL,
	"stripe_member_price_id" text NOT NULL,
	"stripe_nonmember_price_id" text NOT NULL,
	"stripe_driver_product_id" text,
	"stripe_driver_price_id" text,
	"member_price" numeric NOT NULL,
	"nonmember_price" numeric NOT NULL,
	"driver_price" numeric,
	CONSTRAINT "prices_stripe_participant_product_id_key" UNIQUE("stripe_participant_product_id"),
	CONSTRAINT "prices_stripe_member_price_id_key" UNIQUE("stripe_member_price_id"),
	CONSTRAINT "prices_stripe_nonmember_price_id_key" UNIQUE("stripe_nonmember_price_id"),
	CONSTRAINT "prices_stripe_driver_product_id_key" UNIQUE("stripe_driver_product_id"),
	CONSTRAINT "prices_stripe_driver_price_id_key" UNIQUE("stripe_driver_price_id"),
	CONSTRAINT "trip_prices_member_price_check" CHECK (member_price >= (0)::numeric),
	CONSTRAINT "trip_prices_nonmember_price_check" CHECK (nonmember_price >= (0)::numeric),
	CONSTRAINT "trip_prices_driver_price_check" CHECK ((driver_price IS NULL) OR (driver_price >= (0)::numeric))
);
--> statement-breakpoint
ALTER TABLE "trip_prices" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "waitlist_signups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now(),
	"user_id" uuid NOT NULL,
	"trip_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"status" "waitlist_status" DEFAULT 'waiting' NOT NULL,
	"open_until" timestamp with time zone,
	"notification_sent_at" timestamp with time zone,
	CONSTRAINT "waitlist_signups_user_trip_unique" UNIQUE("user_id","trip_id")
);
--> statement-breakpoint
ALTER TABLE "waitlist_signups" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "auth"."schema_migrations" (
	"version" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "auth"."schema_migrations" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "auth"."instances" (
	"id" uuid NOT NULL,
	"uuid" uuid,
	"raw_base_config" text,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "auth"."instances" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "auth"."users" (
	"instance_id" uuid,
	"id" uuid NOT NULL,
	"aud" varchar(255),
	"role" varchar(255),
	"email" varchar(255),
	"encrypted_password" varchar(255),
	"email_confirmed_at" timestamp with time zone,
	"invited_at" timestamp with time zone,
	"confirmation_token" varchar(255),
	"confirmation_sent_at" timestamp with time zone,
	"recovery_token" varchar(255),
	"recovery_sent_at" timestamp with time zone,
	"email_change_token_new" varchar(255),
	"email_change" varchar(255),
	"email_change_sent_at" timestamp with time zone,
	"last_sign_in_at" timestamp with time zone,
	"raw_app_meta_data" jsonb,
	"raw_user_meta_data" jsonb,
	"is_super_admin" boolean,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone,
	"phone" text DEFAULT NULL,
	"phone_confirmed_at" timestamp with time zone,
	"phone_change" text DEFAULT '',
	"phone_change_token" varchar(255) DEFAULT '',
	"phone_change_sent_at" timestamp with time zone,
	"confirmed_at" timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
	"email_change_token_current" varchar(255) DEFAULT '',
	"email_change_confirm_status" smallint DEFAULT 0,
	"banned_until" timestamp with time zone,
	"reauthentication_token" varchar(255) DEFAULT '',
	"reauthentication_sent_at" timestamp with time zone,
	"is_sso_user" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"is_anonymous" boolean DEFAULT false NOT NULL,
	CONSTRAINT "users_email_change_confirm_status_check" CHECK ((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2))
);
--> statement-breakpoint
ALTER TABLE "auth"."users" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "auth"."audit_log_entries" (
	"instance_id" uuid,
	"id" uuid NOT NULL,
	"payload" json,
	"created_at" timestamp with time zone,
	"ip_address" varchar(64) DEFAULT '' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "auth"."audit_log_entries" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "auth"."saml_relay_states" (
	"id" uuid NOT NULL,
	"sso_provider_id" uuid NOT NULL,
	"request_id" text NOT NULL,
	"for_email" text,
	"redirect_to" text,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone,
	"flow_state_id" uuid,
	CONSTRAINT "request_id not empty" CHECK (char_length(request_id) > 0)
);
--> statement-breakpoint
ALTER TABLE "auth"."saml_relay_states" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "auth"."refresh_tokens" (
	"instance_id" uuid,
	"id" bigserial NOT NULL,
	"token" varchar(255),
	"user_id" varchar(255),
	"revoked" boolean,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone,
	"parent" varchar(255),
	"session_id" uuid
);
--> statement-breakpoint
ALTER TABLE "auth"."refresh_tokens" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "auth"."sso_domains" (
	"id" uuid NOT NULL,
	"sso_provider_id" uuid NOT NULL,
	"domain" text NOT NULL,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone,
	CONSTRAINT "domain not empty" CHECK (char_length(domain) > 0)
);
--> statement-breakpoint
ALTER TABLE "auth"."sso_domains" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "auth"."mfa_amr_claims" (
	"session_id" uuid NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"authentication_method" text NOT NULL,
	"id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "auth"."mfa_amr_claims" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "auth"."saml_providers" (
	"id" uuid NOT NULL,
	"sso_provider_id" uuid NOT NULL,
	"entity_id" text NOT NULL,
	"metadata_xml" text NOT NULL,
	"metadata_url" text,
	"attribute_mapping" jsonb,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone,
	"name_id_format" text,
	CONSTRAINT "metadata_xml not empty" CHECK (char_length(metadata_xml) > 0),
	CONSTRAINT "metadata_url not empty" CHECK ((metadata_url = NULL::text) OR (char_length(metadata_url) > 0)),
	CONSTRAINT "entity_id not empty" CHECK (char_length(entity_id) > 0)
);
--> statement-breakpoint
ALTER TABLE "auth"."saml_providers" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "auth"."flow_state" (
	"id" uuid NOT NULL,
	"user_id" uuid,
	"auth_code" text NOT NULL,
	"code_challenge_method" "auth"."code_challenge_method" NOT NULL,
	"code_challenge" text NOT NULL,
	"provider_type" text NOT NULL,
	"provider_access_token" text,
	"provider_refresh_token" text,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone,
	"authentication_method" text NOT NULL,
	"auth_code_issued_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "auth"."flow_state" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "auth"."identities" (
	"provider_id" text NOT NULL,
	"user_id" uuid NOT NULL,
	"identity_data" jsonb NOT NULL,
	"provider" text NOT NULL,
	"last_sign_in_at" timestamp with time zone,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone,
	"email" text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
	"id" uuid DEFAULT gen_random_uuid() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "auth"."identities" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "auth"."sso_providers" (
	"id" uuid NOT NULL,
	"resource_id" text,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone,
	"disabled" boolean,
	CONSTRAINT "resource_id not empty" CHECK ((resource_id = NULL::text) OR (char_length(resource_id) > 0))
);
--> statement-breakpoint
ALTER TABLE "auth"."sso_providers" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "auth"."sessions" (
	"id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone,
	"factor_id" uuid,
	"aal" "auth"."aal_level",
	"not_after" timestamp with time zone,
	"refreshed_at" timestamp,
	"user_agent" text,
	"ip" "inet",
	"tag" text,
	"oauth_client_id" uuid
);
--> statement-breakpoint
ALTER TABLE "auth"."sessions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "trip_cycles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone NOT NULL,
	"trips_published_at" timestamp with time zone NOT NULL,
	"member_signups_start_at" timestamp with time zone NOT NULL,
	"nonmember_signups_start_at" timestamp with time zone NOT NULL,
	"range" "tstzrange" GENERATED ALWAYS AS (tstzrange(starts_at, ends_at, '[)'::text)) STORED,
	"trip_feedback_form" text,
	"guide_post_trip_form" text,
	CONSTRAINT "end_after_start" CHECK (starts_at < ends_at)
);
--> statement-breakpoint
ALTER TABLE "trip_cycles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "auth"."one_time_tokens" (
	"id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"token_type" "auth"."one_time_token_type" NOT NULL,
	"token_hash" text NOT NULL,
	"relates_to" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "one_time_tokens_token_hash_check" CHECK (char_length(token_hash) > 0)
);
--> statement-breakpoint
ALTER TABLE "auth"."one_time_tokens" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "auth"."mfa_factors" (
	"id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"friendly_name" text,
	"factor_type" "auth"."factor_type" NOT NULL,
	"status" "auth"."factor_status" NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"secret" text,
	"phone" text,
	"last_challenged_at" timestamp with time zone,
	"web_authn_credential" jsonb,
	"web_authn_aaguid" uuid
);
--> statement-breakpoint
ALTER TABLE "auth"."mfa_factors" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "auth"."mfa_challenges" (
	"id" uuid NOT NULL,
	"factor_id" uuid NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"verified_at" timestamp with time zone,
	"ip_address" "inet" NOT NULL,
	"otp_code" text,
	"web_authn_session_data" jsonb
);
--> statement-breakpoint
ALTER TABLE "auth"."mfa_challenges" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "driver_info" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"drivers_license_number" text NOT NULL,
	"vehicle_make_and_model" text NOT NULL,
	"vehicle_year" integer NOT NULL,
	"vehicle_owner_name" text NOT NULL,
	"vehicle_owner_address" text NOT NULL,
	"auto_insurance_company" text NOT NULL,
	"auto_insurance_policy_number" text NOT NULL,
	"num_seats" integer NOT NULL,
	"slack_interested" boolean NOT NULL,
	"affirm_good_condition" boolean NOT NULL,
	"drivers_license_expiration" date NOT NULL,
	"drivers_license_state" text NOT NULL,
	"license_plate_number" text NOT NULL,
	"is_4wd" boolean NOT NULL,
	CONSTRAINT "driver_info_drivers_license_expiration_check" CHECK (drivers_license_expiration > CURRENT_DATE)
);
--> statement-breakpoint
ALTER TABLE "driver_info" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "roles" (
	"user_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"role" "user_role" DEFAULT 'participant' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "roles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "hard_trip_participants" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"approved_by" uuid NOT NULL,
	"notes" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "hard_trip_participants" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "waiver_signatures" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"document_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"signed_at" timestamp with time zone NOT NULL,
	"confirmation_email_sent_at" timestamp with time zone NOT NULL,
	"ip_address" text NOT NULL,
	"user_id" uuid NOT NULL,
	"email" text NOT NULL,
	"typed_name" text NOT NULL,
	"typed_date" text NOT NULL,
	"drawn_signature" text NOT NULL,
	"consent_text" text NOT NULL,
	"document_hash" text NOT NULL,
	"signature_hash" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "waiver_signatures" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "guide_info" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"has_car" boolean NOT NULL,
	"guide_class" integer NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"position" "guide_position" DEFAULT 'new_guide' NOT NULL,
	"emergency_contact_name" text NOT NULL,
	"emergency_contact_phone_number" text NOT NULL,
	"emergency_contact_relationship" text NOT NULL,
	"medical_history" text
);
--> statement-breakpoint
ALTER TABLE "guide_info" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "trips" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" text,
	"description" text,
	"difficulty" integer,
	"picture" text,
	"driver_spots" integer DEFAULT 0 NOT NULL,
	"participant_spots" integer DEFAULT 8 NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone NOT NULL,
	CONSTRAINT "ends_after_start" CHECK (starts_at < ends_at),
	CONSTRAINT "trips_driver_spots_check" CHECK (driver_spots >= 0),
	CONSTRAINT "trips_participant_spots_check" CHECK (participant_spots >= 0),
	CONSTRAINT "trips_difficulty_check" CHECK ((difficulty >= 1) AND (difficulty <= 10))
);
--> statement-breakpoint
ALTER TABLE "trips" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"avatar" text,
	"email" text NOT NULL,
	"phone_number" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "checkout_sessions" (
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"user_id" uuid NOT NULL,
	"trip_id" uuid NOT NULL,
	"expires_at" timestamp with time zone DEFAULT (now() + '00:15:00'::interval) NOT NULL,
	"stripe_checkout_session_id" text,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"status" "checkout_session_status" DEFAULT 'open' NOT NULL,
	CONSTRAINT "user_trip_unique" UNIQUE("user_id","trip_id"),
	CONSTRAINT "ticket_reservations_stripe_checkout_session_id_key" UNIQUE("stripe_checkout_session_id")
);
--> statement-breakpoint
ALTER TABLE "checkout_sessions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "tickets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"trip_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"stripe_payment_id" text NOT NULL,
	"cancelled" boolean DEFAULT false NOT NULL,
	"refunded" boolean DEFAULT false NOT NULL,
	"waiver_id" uuid,
	"waiver_confirmed" boolean DEFAULT false NOT NULL,
	"cancelled_at" timestamp with time zone,
	"type" "ticket_type" NOT NULL,
	"amount_paid" numeric NOT NULL,
	"stripe_refund_id" text,
	CONSTRAINT "tickets_unique_trip_participant" UNIQUE("user_id","trip_id"),
	CONSTRAINT "tickets_stripe_checkout_session_id_key" UNIQUE("stripe_payment_id")
);
--> statement-breakpoint
ALTER TABLE "tickets" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "trip_guides" (
	"user_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"trip_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	CONSTRAINT "trip_guides_pkey" PRIMARY KEY("user_id","trip_id")
);
--> statement-breakpoint
ALTER TABLE "trip_guides" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "trip_budgets" ADD CONSTRAINT "trip_budgets_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_responses" ADD CONSTRAINT "form_responses_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_responses" ADD CONSTRAINT "form_responses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "waiver_uploads" ADD CONSTRAINT "waivers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "waiver_uploads" ADD CONSTRAINT "waivers_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "public"."tickets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "waiver_uploads" ADD CONSTRAINT "waiver_uploads_bucket_fkey" FOREIGN KEY ("bucket") REFERENCES "storage"."buckets"("name") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trip_ticket_info" ADD CONSTRAINT "trip_ticket_info_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth"."oauth_authorizations" ADD CONSTRAINT "oauth_authorizations_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "auth"."oauth_clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth"."oauth_authorizations" ADD CONSTRAINT "oauth_authorizations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth"."oauth_consents" ADD CONSTRAINT "oauth_consents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth"."oauth_consents" ADD CONSTRAINT "oauth_consents_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "auth"."oauth_clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "participant_info" ADD CONSTRAINT "participant_info_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trip_prices" ADD CONSTRAINT "prices_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "waitlist_signups" ADD CONSTRAINT "waitlist_signups_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "waitlist_signups" ADD CONSTRAINT "waitlist_signups_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth"."saml_relay_states" ADD CONSTRAINT "saml_relay_states_sso_provider_id_fkey" FOREIGN KEY ("sso_provider_id") REFERENCES "auth"."sso_providers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth"."saml_relay_states" ADD CONSTRAINT "saml_relay_states_flow_state_id_fkey" FOREIGN KEY ("flow_state_id") REFERENCES "auth"."flow_state"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth"."refresh_tokens" ADD CONSTRAINT "refresh_tokens_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "auth"."sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth"."sso_domains" ADD CONSTRAINT "sso_domains_sso_provider_id_fkey" FOREIGN KEY ("sso_provider_id") REFERENCES "auth"."sso_providers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth"."mfa_amr_claims" ADD CONSTRAINT "mfa_amr_claims_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "auth"."sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth"."saml_providers" ADD CONSTRAINT "saml_providers_sso_provider_id_fkey" FOREIGN KEY ("sso_provider_id") REFERENCES "auth"."sso_providers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth"."identities" ADD CONSTRAINT "identities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth"."sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth"."sessions" ADD CONSTRAINT "sessions_oauth_client_id_fkey" FOREIGN KEY ("oauth_client_id") REFERENCES "auth"."oauth_clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth"."one_time_tokens" ADD CONSTRAINT "one_time_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth"."mfa_factors" ADD CONSTRAINT "mfa_factors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth"."mfa_challenges" ADD CONSTRAINT "mfa_challenges_auth_factor_id_fkey" FOREIGN KEY ("factor_id") REFERENCES "auth"."mfa_factors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "driver_info" ADD CONSTRAINT "driver_info_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roles" ADD CONSTRAINT "roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "hard_trip_participants" ADD CONSTRAINT "hard_trip_participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hard_trip_participants" ADD CONSTRAINT "hard_trip_participants_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "waiver_signatures" ADD CONSTRAINT "waiver_signatures_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guide_info" ADD CONSTRAINT "guide_info_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "checkout_sessions" ADD CONSTRAINT "checkout_sessions_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "checkout_sessions" ADD CONSTRAINT "checkout_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_waiver_id_fkey" FOREIGN KEY ("waiver_id") REFERENCES "public"."waiver_uploads"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trip_guides" ADD CONSTRAINT "trip_guides_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "trip_guides" ADD CONSTRAINT "trip_guides_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "oauth_auth_pending_exp_idx" ON "auth"."oauth_authorizations" USING btree ("expires_at" timestamptz_ops) WHERE (status = 'pending'::auth.oauth_authorization_status);--> statement-breakpoint
CREATE INDEX "oauth_consents_active_client_idx" ON "auth"."oauth_consents" USING btree ("client_id" uuid_ops) WHERE (revoked_at IS NULL);--> statement-breakpoint
CREATE INDEX "oauth_consents_active_user_client_idx" ON "auth"."oauth_consents" USING btree ("user_id" uuid_ops,"client_id" uuid_ops) WHERE (revoked_at IS NULL);--> statement-breakpoint
CREATE INDEX "oauth_consents_user_order_idx" ON "auth"."oauth_consents" USING btree ("user_id" timestamptz_ops,"granted_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "oauth_clients_deleted_at_idx" ON "auth"."oauth_clients" USING btree ("deleted_at" timestamptz_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "confirmation_token_idx" ON "auth"."users" USING btree ("confirmation_token" text_ops) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);--> statement-breakpoint
CREATE UNIQUE INDEX "email_change_token_current_idx" ON "auth"."users" USING btree ("email_change_token_current" text_ops) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);--> statement-breakpoint
CREATE UNIQUE INDEX "email_change_token_new_idx" ON "auth"."users" USING btree ("email_change_token_new" text_ops) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);--> statement-breakpoint
CREATE UNIQUE INDEX "reauthentication_token_idx" ON "auth"."users" USING btree ("reauthentication_token" text_ops) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);--> statement-breakpoint
CREATE UNIQUE INDEX "recovery_token_idx" ON "auth"."users" USING btree ("recovery_token" text_ops) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_partial_key" ON "auth"."users" USING btree ("email" text_ops) WHERE (is_sso_user = false);--> statement-breakpoint
CREATE INDEX "users_instance_id_email_idx" ON "auth"."users" USING btree (instance_id uuid_ops,lower((email)::text) uuid_ops);--> statement-breakpoint
CREATE INDEX "users_instance_id_idx" ON "auth"."users" USING btree ("instance_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "users_is_anonymous_idx" ON "auth"."users" USING btree ("is_anonymous" bool_ops);--> statement-breakpoint
CREATE INDEX "audit_logs_instance_id_idx" ON "auth"."audit_log_entries" USING btree ("instance_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "saml_relay_states_created_at_idx" ON "auth"."saml_relay_states" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "saml_relay_states_for_email_idx" ON "auth"."saml_relay_states" USING btree ("for_email" text_ops);--> statement-breakpoint
CREATE INDEX "saml_relay_states_sso_provider_id_idx" ON "auth"."saml_relay_states" USING btree ("sso_provider_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "refresh_tokens_instance_id_idx" ON "auth"."refresh_tokens" USING btree ("instance_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "refresh_tokens_instance_id_user_id_idx" ON "auth"."refresh_tokens" USING btree ("instance_id" text_ops,"user_id" text_ops);--> statement-breakpoint
CREATE INDEX "refresh_tokens_parent_idx" ON "auth"."refresh_tokens" USING btree ("parent" text_ops);--> statement-breakpoint
CREATE INDEX "refresh_tokens_session_id_revoked_idx" ON "auth"."refresh_tokens" USING btree ("session_id" bool_ops,"revoked" bool_ops);--> statement-breakpoint
CREATE INDEX "refresh_tokens_updated_at_idx" ON "auth"."refresh_tokens" USING btree ("updated_at" timestamptz_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "sso_domains_domain_idx" ON "auth"."sso_domains" USING btree (lower(domain) text_ops);--> statement-breakpoint
CREATE INDEX "sso_domains_sso_provider_id_idx" ON "auth"."sso_domains" USING btree ("sso_provider_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "saml_providers_sso_provider_id_idx" ON "auth"."saml_providers" USING btree ("sso_provider_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "flow_state_created_at_idx" ON "auth"."flow_state" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "idx_auth_code" ON "auth"."flow_state" USING btree ("auth_code" text_ops);--> statement-breakpoint
CREATE INDEX "idx_user_id_auth_method" ON "auth"."flow_state" USING btree ("user_id" uuid_ops,"authentication_method" uuid_ops);--> statement-breakpoint
CREATE INDEX "identities_email_idx" ON "auth"."identities" USING btree ("email" text_pattern_ops);--> statement-breakpoint
CREATE INDEX "identities_user_id_idx" ON "auth"."identities" USING btree ("user_id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "sso_providers_resource_id_idx" ON "auth"."sso_providers" USING btree (lower(resource_id) text_ops);--> statement-breakpoint
CREATE INDEX "sso_providers_resource_id_pattern_idx" ON "auth"."sso_providers" USING btree ("resource_id" text_pattern_ops);--> statement-breakpoint
CREATE INDEX "sessions_not_after_idx" ON "auth"."sessions" USING btree ("not_after" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "sessions_oauth_client_id_idx" ON "auth"."sessions" USING btree ("oauth_client_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "sessions_user_id_idx" ON "auth"."sessions" USING btree ("user_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "user_id_created_at_idx" ON "auth"."sessions" USING btree ("user_id" uuid_ops,"created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "one_time_tokens_relates_to_hash_idx" ON "auth"."one_time_tokens" USING hash ("relates_to" text_ops);--> statement-breakpoint
CREATE INDEX "one_time_tokens_token_hash_hash_idx" ON "auth"."one_time_tokens" USING hash ("token_hash" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "one_time_tokens_user_id_token_type_key" ON "auth"."one_time_tokens" USING btree ("user_id" uuid_ops,"token_type" uuid_ops);--> statement-breakpoint
CREATE INDEX "factor_id_created_at_idx" ON "auth"."mfa_factors" USING btree ("user_id" timestamptz_ops,"created_at" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "mfa_factors_user_friendly_name_unique" ON "auth"."mfa_factors" USING btree ("friendly_name" text_ops,"user_id" uuid_ops) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);--> statement-breakpoint
CREATE INDEX "mfa_factors_user_id_idx" ON "auth"."mfa_factors" USING btree ("user_id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "unique_phone_factor_per_user" ON "auth"."mfa_factors" USING btree ("user_id" text_ops,"phone" text_ops);--> statement-breakpoint
CREATE INDEX "mfa_challenge_created_at_idx" ON "auth"."mfa_challenges" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE POLICY "Allow auth admin to read user roles" ON "roles" AS PERMISSIVE FOR SELECT TO "supabase_auth_admin" USING (true);
*/