import { pgTable, foreignKey, text, timestamp, uuid, pgSchema, uniqueIndex, index, check, varchar, jsonb, boolean, smallint, integer, date, unique, pgPolicy, numeric, primaryKey, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const auth = pgSchema("auth");
export const aal_levelInAuth = auth.enum("aal_level", ['aal1', 'aal2', 'aal3'])
export const code_challenge_methodInAuth = auth.enum("code_challenge_method", ['s256', 'plain'])
export const factor_statusInAuth = auth.enum("factor_status", ['unverified', 'verified'])
export const factor_typeInAuth = auth.enum("factor_type", ['totp', 'webauthn', 'phone'])
export const oauth_authorization_statusInAuth = auth.enum("oauth_authorization_status", ['pending', 'approved', 'denied', 'expired'])
export const oauth_client_typeInAuth = auth.enum("oauth_client_type", ['public', 'confidential'])
export const oauth_registration_typeInAuth = auth.enum("oauth_registration_type", ['dynamic', 'manual'])
export const oauth_response_typeInAuth = auth.enum("oauth_response_type", ['code'])
export const one_time_token_typeInAuth = auth.enum("one_time_token_type", ['confirmation_token', 'reauthentication_token', 'recovery_token', 'email_change_token_new', 'email_change_token_current', 'phone_change_token'])
export const checkout_session_status = pgEnum("checkout_session_status", ['open', 'complete', 'expired'])
export const degree_path_type = pgEnum("degree_path_type", ['undergrad', 'graduate', 'pdp'])
export const graduation_season_type = pgEnum("graduation_season_type", ['spring', 'fall'])
export const guide_position = pgEnum("guide_position", ['new_guide', 'guide', 'longboard', 'alum'])
export const membership_length = pgEnum("membership_length", ['semester', 'year'])
export const participant_type = pgEnum("participant_type", ['participant', 'driver'])
export const ticket_price_type = pgEnum("ticket_price_type", ['member', 'nonmember', 'driver'])
export const trip_signup_status = pgEnum("trip_signup_status", ['open', 'closed', 'access_code', 'select_participants', 'waitlist', 'full'])
export const user_role = pgEnum("user_role", ['participant', 'guide', 'admin', 'superadmin'])
export const waitlist_status = pgEnum("waitlist_status", ['waiting', 'notification_sent', 'signed_up', 'expired'])
export const waiver_event = pgEnum("waiver_event", ['user_opened', 'user_signed'])

export const refresh_tokens_id_seqInAuth = auth.sequence("refresh_tokens_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false })

export const stripe_products = pgTable("stripe_products", {
	stripe_product_id: text().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow(),
	trip_id: uuid(),
	name: text().notNull(),
	type: participant_type().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.trip_id],
			foreignColumns: [trips.id],
			name: "stripe_products_trip_id_fkey"
		}).onDelete("set null"),
]);

export const usersInAuth = auth.table("users", {
	instance_id: uuid(),
	id: uuid().notNull(),
	aud: varchar({ length: 255 }),
	role: varchar({ length: 255 }),
	email: varchar({ length: 255 }),
	encrypted_password: varchar({ length: 255 }),
	email_confirmed_at: timestamp({ withTimezone: true, mode: 'string' }),
	invited_at: timestamp({ withTimezone: true, mode: 'string' }),
	confirmation_token: varchar({ length: 255 }),
	confirmation_sent_at: timestamp({ withTimezone: true, mode: 'string' }),
	recovery_token: varchar({ length: 255 }),
	recovery_sent_at: timestamp({ withTimezone: true, mode: 'string' }),
	email_change_token_new: varchar({ length: 255 }),
	email_change: varchar({ length: 255 }),
	email_change_sent_at: timestamp({ withTimezone: true, mode: 'string' }),
	last_sign_in_at: timestamp({ withTimezone: true, mode: 'string' }),
	raw_app_meta_data: jsonb(),
	raw_user_meta_data: jsonb(),
	is_super_admin: boolean(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }),
	phone: text().default(sql`NULL`),
	phone_confirmed_at: timestamp({ withTimezone: true, mode: 'string' }),
	phone_change: text().default(''),
	phone_change_token: varchar({ length: 255 }).default(''),
	phone_change_sent_at: timestamp({ withTimezone: true, mode: 'string' }),
	confirmed_at: timestamp({ withTimezone: true, mode: 'string' }).generatedAlwaysAs(sql`LEAST(email_confirmed_at, phone_confirmed_at)`),
	email_change_token_current: varchar({ length: 255 }).default(''),
	email_change_confirm_status: smallint().default(0),
	banned_until: timestamp({ withTimezone: true, mode: 'string' }),
	reauthentication_token: varchar({ length: 255 }).default(''),
	reauthentication_sent_at: timestamp({ withTimezone: true, mode: 'string' }),
	is_sso_user: boolean().default(false).notNull(),
	deleted_at: timestamp({ withTimezone: true, mode: 'string' }),
	is_anonymous: boolean().default(false).notNull(),
}, (table) => [
	uniqueIndex("confirmation_token_idx").using("btree", table.confirmation_token.asc().nullsLast().op("text_ops")).where(sql`((confirmation_token)::text !~ '^[0-9 ]*$'::text)`),
	uniqueIndex("email_change_token_current_idx").using("btree", table.email_change_token_current.asc().nullsLast().op("text_ops")).where(sql`((email_change_token_current)::text !~ '^[0-9 ]*$'::text)`),
	uniqueIndex("email_change_token_new_idx").using("btree", table.email_change_token_new.asc().nullsLast().op("text_ops")).where(sql`((email_change_token_new)::text !~ '^[0-9 ]*$'::text)`),
	uniqueIndex("reauthentication_token_idx").using("btree", table.reauthentication_token.asc().nullsLast().op("text_ops")).where(sql`((reauthentication_token)::text !~ '^[0-9 ]*$'::text)`),
	uniqueIndex("recovery_token_idx").using("btree", table.recovery_token.asc().nullsLast().op("text_ops")).where(sql`((recovery_token)::text !~ '^[0-9 ]*$'::text)`),
	uniqueIndex("users_email_partial_key").using("btree", table.email.asc().nullsLast().op("text_ops")).where(sql`(is_sso_user = false)`),
	index("users_instance_id_email_idx").using("btree", sql`instance_id`, sql`lower((email)::text)`),
	index("users_instance_id_idx").using("btree", table.instance_id.asc().nullsLast().op("uuid_ops")),
	index("users_is_anonymous_idx").using("btree", table.is_anonymous.asc().nullsLast().op("bool_ops")),
	check("users_email_change_confirm_status_check", sql`(email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)`),
]);

export const allowed_trip_participants = pgTable("allowed_trip_participants", {
	trip_id: uuid().defaultRandom().primaryKey().notNull(),
	user_id: uuid().defaultRandom().notNull(),
	approved_by: uuid().defaultRandom().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.approved_by],
			foreignColumns: [profiles.id],
			name: "allowed_trip_participants_approved_by_fkey"
		}),
	foreignKey({
			columns: [table.trip_id],
			foreignColumns: [trips.id],
			name: "allowed_trip_participants_trip_id_fkey"
		}),
	foreignKey({
			columns: [table.user_id],
			foreignColumns: [profiles.id],
			name: "allowed_trip_participants_user_id_fkey"
		}),
]);

export const driver_info = pgTable("driver_info", {
	user_id: uuid().primaryKey().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	drivers_license_number: text().notNull(),
	vehicle_make_and_model: text().notNull(),
	vehicle_year: integer().notNull(),
	vehicle_owner_name: text().notNull(),
	vehicle_owner_address: text().notNull(),
	auto_insurance_company: text().notNull(),
	auto_insurance_policy_number: text().notNull(),
	num_seats: integer().notNull(),
	slack_interested: boolean().notNull(),
	drivers_license_expiration: date().notNull(),
	affirm_good_condition: boolean().notNull(),
	drivers_license_state: text().notNull(),
	license_plate_number: text().notNull(),
	is_4wd: boolean().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.user_id],
			foreignColumns: [profiles.id],
			name: "driver_info_user_id_fkey"
		}),
	check("driver_info_drivers_license_expiration_check", sql`drivers_license_expiration > CURRENT_DATE`),
]);

export const guide_info = pgTable("guide_info", {
	user_id: uuid().primaryKey().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	has_car: boolean().notNull(),
	guide_class: integer().notNull(),
	active: boolean().default(true).notNull(),
	position: guide_position().default('new_guide').notNull(),
	emergency_contact_name: text().notNull(),
	emergency_contact_phone_number: text().notNull(),
	emergency_contact_relationship: text().notNull(),
	medical_history: text(),
	is_wfr: boolean().default(false).notNull(),
	wfr_expiration_date: date(),
}, (table) => [
	foreignKey({
			columns: [table.user_id],
			foreignColumns: [profiles.id],
			name: "guide_info_user_id_fkey"
		}),
	check("guide_info_check", sql`(NOT is_wfr) OR (wfr_expiration_date IS NOT NULL)`),
]);

export const hard_trip_participants = pgTable("hard_trip_participants", {
	user_id: uuid().primaryKey().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	approved_by: uuid().notNull(),
	notes: text(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.approved_by],
			foreignColumns: [profiles.id],
			name: "hard_trip_participants_approved_by_fkey"
		}),
	foreignKey({
			columns: [table.user_id],
			foreignColumns: [profiles.id],
			name: "hard_trip_participants_user_id_fkey"
		}),
]);

export const membership_prices = pgTable("membership_prices", {
	length: membership_length().primaryKey().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	stripe_price_id: text().notNull(),
	unit_amount: integer().notNull(),
}, (table) => [
	unique("membership_prices_stripe_price_id_key").on(table.stripe_price_id),
]);

export const memberships = pgTable("memberships", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	user_id: uuid().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	expires_at: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	stripe_payment_id: text().notNull(),
	length: membership_length().notNull(),
	cancelled: boolean().default(false).notNull(),
	receipt_url: text().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.user_id],
			foreignColumns: [profiles.id],
			name: "memberships_user_id_fkey"
		}),
	unique("memberships_stripe_payment_id_key").on(table.stripe_payment_id),
	pgPolicy("Allow users to view their memberships", { as: "permissive", for: "select", to: ["authenticated"], using: sql`(user_id = ( SELECT auth.uid() AS uid))` }),
]);

export const profiles = pgTable("profiles", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	first_name: text().notNull(),
	last_name: text().notNull(),
	phone: text().default('').notNull(),
	avatar_path: text(),
	email: text().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.id],
			foreignColumns: [usersInAuth.id],
			name: "profiles_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	unique("profiles_phone_key").on(table.phone),
	pgPolicy("Allow guides, user to select own profile", { as: "permissive", for: "select", to: ["authenticated"], using: sql`((id = ( SELECT auth.uid() AS uid)) OR authorize('guide'::user_role))` }),
	pgPolicy("Allow users to update own profile", { as: "permissive", for: "update", to: ["authenticated"] }),
]);

export const trips = pgTable("trips", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	name: text().notNull(),
	driver_spots: integer().notNull(),
	participant_spots: integer().notNull(),
	gear_questions: text().array(),
	what_to_bring: text().array(),
	access_code: text(),
	end_date: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	picture_path: text(),
	start_date: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	activity: text(),
	breakfasts: smallint(),
	budget_confirmed: boolean().default(false).notNull(),
	car_mpgs: numeric().array(),
	difficulty: text(),
	dinners: smallint(),
	location: text(),
	lunches: smallint(),
	meet: text(),
	native_land: text(),
	prior_experience: text(),
	return: text(),
	snacks: smallint(),
	total_miles: integer(),
	trail: text(),
	other_expenses: jsonb(),
	driver_price_override: numeric(),
	member_price_override: numeric(),
	nonmember_price_override: numeric(),
	cancelled: boolean().default(false).notNull(),
	description: jsonb(),
}, (table) => [
	pgPolicy("Allow all guides to update trips", { as: "permissive", for: "update", to: ["authenticated"], using: sql`authorize('guide'::user_role)`, withCheck: sql`authorize('guide'::user_role)`  }),
	pgPolicy("Allow trip deletion", { as: "permissive", for: "delete", to: ["authenticated"] }),
	pgPolicy("Guides can select trips", { as: "permissive", for: "select", to: ["authenticated"] }),
	check("ends_after_start", sql`start_date < end_date`),
	check("trips_breakfasts_check", sql`breakfasts >= 0`),
	check("trips_car_mpgs_check", sql`(0)::numeric <= ALL (car_mpgs)`),
	check("trips_dinners_check", sql`dinners >= 0`),
	check("trips_driver_spots_check", sql`driver_spots >= 0`),
	check("trips_lunches_check", sql`lunches >= 0`),
	check("trips_participant_spots_check", sql`participant_spots >= 0`),
	check("trips_snacks_check", sql`snacks >= 0`),
	check("trips_total_miles_check", sql`total_miles >= 0`),
]);

export const tickets = pgTable("tickets", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	user_id: uuid().notNull(),
	trip_id: uuid().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	cancelled: boolean().default(false).notNull(),
	refunded: boolean().default(false).notNull(),
	cancelled_at: timestamp({ withTimezone: true, mode: 'string' }),
	stripe_payment_id: text().notNull(),
	type: ticket_price_type().notNull(),
	amount_paid: numeric().notNull(),
	stripe_refund_id: text(),
	receipt_url: text().default('https://www.stripe.com').notNull(),
	driver_waiver_filepath: text(),
	waiver_filepath: text(),
	driver_waiver_signed_at: timestamp({ withTimezone: true, mode: 'string' }),
	waiver_signed_at: timestamp({ withTimezone: true, mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.trip_id],
			foreignColumns: [published_trips.id],
			name: "tickets_trip_id_fkey"
		}),
	foreignKey({
			columns: [table.trip_id],
			foreignColumns: [trips.id],
			name: "tickets_trip_id_fkey1"
		}),
	foreignKey({
			columns: [table.user_id],
			foreignColumns: [profiles.id],
			name: "tickets_user_id_fkey"
		}),
	unique("tickets_unique_trip_participant").on(table.user_id, table.trip_id),
	unique("tickets_stripe_checkout_session_id_key").on(table.stripe_payment_id),
	unique("tickets_stripe_refund_id_key").on(table.stripe_refund_id),
	pgPolicy("Guides, participants can select their own tickets", { as: "permissive", for: "select", to: ["authenticated"], using: sql`((user_id = ( SELECT auth.uid() AS uid)) OR authorize('guide'::user_role))` }),
]);

export const published_trips = pgTable("published_trips", {
	id: uuid().primaryKey().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	name: text().notNull(),
	start_date: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	end_date: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	meet: text().notNull(),
	return: text().notNull(),
	activity: text().notNull(),
	difficulty: text().notNull(),
	trail: text().notNull(),
	recommended_prior_experience: text().notNull(),
	location: text().notNull(),
	native_land: text().notNull(),
	what_to_bring: text().array().notNull(),
	guides: jsonb().notNull(),
	picture_path: text().notNull(),
	description: jsonb().default("").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.id],
			foreignColumns: [trips.id],
			name: "published_trips_id_fkey"
		}),
	pgPolicy("Allow participants who have a ticket to view the trip, even if ", { as: "permissive", for: "select", to: ["authenticated"], using: sql`(has_trip_ticket(( SELECT auth.uid() AS uid), id) OR authorize('guide'::user_role))` }),
]);

export const trip_prices = pgTable("trip_prices", {
	trip_id: uuid().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	active: boolean().default(true).notNull(),
	amount: numeric().notNull(),
	archived_at: timestamp({ withTimezone: true, mode: 'string' }),
	stripe_price_id: text().primaryKey().notNull(),
	stripe_product_id: text().notNull(),
	ticket_type: ticket_price_type().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.trip_id],
			foreignColumns: [trips.id],
			name: "stripe_prices_trip_id_fkey"
		}),
	foreignKey({
			columns: [table.stripe_product_id],
			foreignColumns: [stripe_products.stripe_product_id],
			name: "trip_prices_stripe_product_id_fkey"
		}),
]);

export const trip_waivers = pgTable("trip_waivers", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	trip_id: uuid().notNull(),
	content: jsonb().notNull(),
	type: participant_type().notNull(),
	template_id: uuid().notNull(),
	title: text().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.template_id],
			foreignColumns: [waiver_templates.id],
			name: "trip_waivers_template_id_fkey"
		}),
	foreignKey({
			columns: [table.trip_id],
			foreignColumns: [trips.id],
			name: "trip_waivers_trip_id_fkey"
		}),
]);

export const trip_cycles = pgTable("trip_cycles", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	name: text().notNull(),
	starts_at: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	ends_at: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	trips_published_at: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	member_signups_start_at: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	nonmember_signups_start_at: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	// TODO: failed to parse database type 'tstzrange'
	range: timestamp({ withTimezone: true, mode: 'string' }).notNull().array(),
	trip_feedback_form: text(),
	guide_post_trip_form: text(),
	driver_signups_start_at: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
}, (table) => [
	pgPolicy("Guides can view trip cycles", { as: "permissive", for: "select", to: ["authenticated"], using: sql`authorize('guide'::user_role)` }),
	check("end_after_start", sql`starts_at < ends_at`),
]);

export const waitlist_signups = pgTable("waitlist_signups", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow(),
	user_id: uuid().notNull(),
	trip_id: uuid().defaultRandom().notNull(),
	notification_sent_at: timestamp({ withTimezone: true, mode: 'string' }),
	spot_expires_at: timestamp({ withTimezone: true, mode: 'string' }),
	sign_up_success: boolean().default(false).notNull(),
	ticket_type: participant_type().default('participant').notNull(),
}, (table) => [
	foreignKey({
			columns: [table.trip_id],
			foreignColumns: [trips.id],
			name: "waitlist_signups_trip_id_fkey"
		}),
	foreignKey({
			columns: [table.user_id],
			foreignColumns: [profiles.id],
			name: "waitlist_signups_user_id_fkey"
		}),
	unique("waitlist_signups_user_trip_unique").on(table.user_id, table.trip_id),
	pgPolicy("Allow guides to update waitlist signups", { as: "permissive", for: "update", to: ["authenticated"], using: sql`(is_trip_guide(( SELECT auth.uid() AS uid), trip_id) OR authorize('admin'::user_role))`, withCheck: sql`(is_trip_guide(( SELECT auth.uid() AS uid), trip_id) OR authorize('admin'::user_role))`  }),
	pgPolicy("Guides can view waitlist signups", { as: "permissive", for: "select", to: ["authenticated"] }),
]);

export const waiver_events = pgTable("waiver_events", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	event: waiver_event().notNull(),
	user_id: uuid().notNull(),
	trip_id: uuid().notNull(),
	ip_address: text().notNull(),
	user_agent: text().default('unknown').notNull(),
	file_path: text(),
	waiver_id: uuid().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.trip_id],
			foreignColumns: [trips.id],
			name: "waiver_events_trip_id_fkey"
		}),
	foreignKey({
			columns: [table.user_id],
			foreignColumns: [profiles.id],
			name: "waiver_events_user_id_fkey"
		}),
	foreignKey({
			columns: [table.waiver_id],
			foreignColumns: [trip_waivers.id],
			name: "waiver_events_waiver_id_fkey"
		}),
]);

export const waiver_templates = pgTable("waiver_templates", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	content: jsonb().notNull(),
	active: boolean().default(false).notNull(),
	title: text().notNull(),
	type: participant_type().default('participant').notNull(),
});

export const roles = pgTable("roles", {
	user_id: uuid().defaultRandom().primaryKey().notNull(),
	role: user_role().default('participant').notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.user_id],
			foreignColumns: [profiles.id],
			name: "roles_user_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	pgPolicy("Allow auth admin to read user roles", { as: "permissive", for: "select", to: ["supabase_auth_admin"], using: sql`true` }),
	pgPolicy("Allow guides to view roles", { as: "permissive", for: "select", to: ["authenticated"] }),
]);

export const budget_formulas = pgTable("budget_formulas", {
	formulas: text().primaryKey().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	pgPolicy("Admins can update", { as: "permissive", for: "update", to: ["authenticated"], using: sql`authorize('admin'::user_role)`, withCheck: sql`authorize('admin'::user_role)`  }),
	pgPolicy("Guides can select", { as: "permissive", for: "select", to: ["authenticated"] }),
]);

export const trip_settings = pgTable("trip_settings", {
	trip_id: uuid().primaryKey().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	allow_signups: boolean().default(true).notNull(),
	enable_participant_waitlist: boolean().default(false).notNull(),
	enable_driver_waitlist: boolean().default(false).notNull(),
	require_code: boolean().default(false).notNull(),
	driver_signup_date_override: timestamp({ withTimezone: true, mode: 'string' }),
	member_signup_date_override: timestamp({ withTimezone: true, mode: 'string' }),
	nonmember_signup_date_override: timestamp({ withTimezone: true, mode: 'string' }),
	publish_date_override: timestamp({ withTimezone: true, mode: 'string' }),
	hide_trip: boolean().default(false).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.trip_id],
			foreignColumns: [trips.id],
			name: "trip_settings_trip_id_fkey"
		}).onDelete("cascade"),
	pgPolicy("Allow guides to update trip settings", { as: "permissive", for: "update", to: ["authenticated"], using: sql`authorize('guide'::user_role)`, withCheck: sql`authorize('guide'::user_role)`  }),
	pgPolicy("Allow guides to view trip settings", { as: "permissive", for: "select", to: ["authenticated"] }),
]);

export const trip_guides = pgTable("trip_guides", {
	user_id: uuid().defaultRandom().notNull(),
	trip_id: uuid().defaultRandom().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.trip_id],
			foreignColumns: [trips.id],
			name: "trip_guides_trip_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.user_id],
			foreignColumns: [profiles.id],
			name: "trip_guides_user_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	primaryKey({ columns: [table.user_id, table.trip_id], name: "trip_guides_pkey"}),
	pgPolicy("Allow guides to remove trip guides", { as: "permissive", for: "delete", to: ["authenticated"], using: sql`authorize('guide'::user_role)` }),
	pgPolicy("Allow guides to select trip guides", { as: "permissive", for: "select", to: ["authenticated"] }),
	pgPolicy("Guides can add other guides to trip", { as: "permissive", for: "insert", to: ["authenticated"] }),
]);
