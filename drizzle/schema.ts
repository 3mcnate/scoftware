import { pgTable, uuid, timestamp, jsonb, foreignKey, check, numeric, real, integer, text, boolean, unique, date, pgPolicy, primaryKey, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import { users } from "@/drizzle/auth-schema"

export const checkout_session_status = pgEnum("checkout_session_status", ['open', 'complete', 'expired'])
export const guide_position = pgEnum("guide_position", ['new_guide', 'guide', 'longboard', 'alum'])
export const membership_length = pgEnum("membership_length", ['semester', 'year'])
export const ticket_type = pgEnum("ticket_type", ['member', 'nonmember', 'driver'])
export const user_role = pgEnum("user_role", ['participant', 'guide', 'admin', 'superadmin'])
export const waitlist_status = pgEnum("waitlist_status", ['waiting', 'notification_sent', 'signed_up', 'expired'])


export const forms = pgTable("forms", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	form_schema: jsonb().notNull(),
});

export const trip_budgets = pgTable("trip_budgets", {
	trip_id: uuid().primaryKey().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	car_rental_price: numeric().default('0').notNull(),
	car_mpgs: real().array().default([]).notNull(),
	total_miles: integer().default(0).notNull(),
	breakfasts: integer().default(0).notNull(),
	lunches: integer().default(0).notNull(),
	dinners: integer().default(0).notNull(),
	snacks: integer().default(0).notNull(),
	permit_cost: numeric().default('0').notNull(),
	parking_cost: numeric().default('0').notNull(),
	other: jsonb(),
}, (table) => [
	foreignKey({
			columns: [table.trip_id],
			foreignColumns: [trips.id],
			name: "trip_budgets_trip_id_fkey"
		}),
	check("trip_budgets_car_rental_price_check", sql`car_rental_price >= 0.0`),
	check("trip_budgets_total_miles_check", sql`total_miles >= 0`),
	check("trip_budgets_breakfasts_check", sql`breakfasts >= 0`),
	check("trip_budgets_lunches_check", sql`lunches >= 0`),
	check("trip_budgets_dinners_check", sql`dinners >= 0`),
	check("trip_budgets_snacks_check", sql`snacks >= 0`),
	check("trip_budgets_permit_cost_check", sql`permit_cost >= 0.0`),
	check("trip_budgets_parking_cost_check", sql`parking_cost >= 0.0`),
]);

export const form_responses = pgTable("form_responses", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	form_id: uuid().defaultRandom().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	response: jsonb().notNull(),
	user_id: uuid().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.form_id],
			foreignColumns: [forms.id],
			name: "form_responses_form_id_fkey"
		}),
	foreignKey({
			columns: [table.user_id],
			foreignColumns: [profiles.id],
			name: "form_responses_user_id_fkey"
		}),
]);

export const waiver_uploads = pgTable("waiver_uploads", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	user_id: uuid().notNull(),
	ticket_id: uuid().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	bucket: text().default('private').notNull(),
	path: text().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.user_id],
			foreignColumns: [profiles.id],
			name: "waivers_user_id_fkey"
		}),
	foreignKey({
			columns: [table.ticket_id],
			foreignColumns: [tickets.id],
			name: "waivers_ticket_id_fkey"
		}),
]);

export const trip_ticket_info = pgTable("trip_ticket_info", {
	trip_id: uuid().primaryKey().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	participant_tickets_sold: integer().default(0).notNull(),
	driver_tickets_sold: integer().default(0).notNull(),
	participant_waitlist_only: boolean().default(false).notNull(),
	driver_waitlist_only: boolean().default(false).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.trip_id],
			foreignColumns: [trips.id],
			name: "trip_ticket_info_trip_id_fkey"
		}),
	check("trip_ticket_info_participant_tickets_sold_check", sql`participant_tickets_sold >= 0`),
	check("trip_ticket_info_driver_tickets_sold_check", sql`driver_tickets_sold >= 0`),
]);

export const participant_info = pgTable("participant_info", {
	user_id: uuid().primaryKey().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	allergies: text().notNull(),
	medical_history: text().notNull(),
	medications: text().notNull(),
	dietary_restrictions: text().notNull(),
	emergency_contact_name: text().notNull(),
	emergency_contact_phone_number: text().notNull(),
	emergency_contact_relationship: text().notNull(),
	health_insurance_provider: text().notNull(),
	health_insurance_member_id: text().notNull(),
	health_insurance_group_number: text().notNull(),
	health_insurance_bin_number: text().notNull(),
	usc_id: integer().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.user_id],
			foreignColumns: [profiles.id],
			name: "participant_info_user_id_fkey"
		}),
	unique("participant_info_usc_id_key").on(table.usc_id),
	check("participant_info_usc_id_check", sql`usc_id < '9999999999'::bigint`),
]);

export const memberships = pgTable("memberships", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	user_id: uuid().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	expires_at: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	stripe_payment_id: text().notNull(),
	length: membership_length().notNull(),
}, (table) => [
	unique("memberships_stripe_payment_id_key").on(table.stripe_payment_id),
]);

export const trip_prices = pgTable("trip_prices", {
	trip_id: uuid().primaryKey().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	stripe_participant_product_id: text().notNull(),
	stripe_member_price_id: text().notNull(),
	stripe_nonmember_price_id: text().notNull(),
	stripe_driver_product_id: text(),
	stripe_driver_price_id: text(),
	member_price: numeric().notNull(),
	nonmember_price: numeric().notNull(),
	driver_price: numeric(),
}, (table) => [
	foreignKey({
			columns: [table.trip_id],
			foreignColumns: [trips.id],
			name: "prices_id_fkey"
		}).onDelete("cascade"),
	unique("prices_stripe_participant_product_id_key").on(table.stripe_participant_product_id),
	unique("prices_stripe_member_price_id_key").on(table.stripe_member_price_id),
	unique("prices_stripe_nonmember_price_id_key").on(table.stripe_nonmember_price_id),
	unique("prices_stripe_driver_product_id_key").on(table.stripe_driver_product_id),
	unique("prices_stripe_driver_price_id_key").on(table.stripe_driver_price_id),
	check("trip_prices_member_price_check", sql`member_price >= (0)::numeric`),
	check("trip_prices_nonmember_price_check", sql`nonmember_price >= (0)::numeric`),
	check("trip_prices_driver_price_check", sql`(driver_price IS NULL) OR (driver_price >= (0)::numeric)`),
]);

export const waitlist_signups = pgTable("waitlist_signups", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow(),
	user_id: uuid().notNull(),
	trip_id: uuid().defaultRandom().notNull(),
	status: waitlist_status().default('waiting').notNull(),
	open_until: timestamp({ withTimezone: true, mode: 'string' }),
	notification_sent_at: timestamp({ withTimezone: true, mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.user_id],
			foreignColumns: [profiles.id],
			name: "waitlist_signups_user_id_fkey"
		}),
	foreignKey({
			columns: [table.trip_id],
			foreignColumns: [trips.id],
			name: "waitlist_signups_trip_id_fkey"
		}),
	unique("waitlist_signups_user_trip_unique").on(table.user_id, table.trip_id),
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
	range: timestamp({ withTimezone: true, mode: "string" }).array().generatedAlwaysAs(sql`tstzrange(starts_at, ends_at, '[)'::text)`).notNull(),
	trip_feedback_form: text(),
	guide_post_trip_form: text(),
}, (table) => [
	check("end_after_start", sql`starts_at < ends_at`),
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
	affirm_good_condition: boolean().notNull(),
	drivers_license_expiration: date().notNull(),
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
]);

export const hard_trip_participants = pgTable("hard_trip_participants", {
	user_id: uuid().primaryKey().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	approved_by: uuid().notNull(),
	notes: text(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.user_id],
			foreignColumns: [profiles.id],
			name: "hard_trip_participants_user_id_fkey"
		}),
	foreignKey({
			columns: [table.approved_by],
			foreignColumns: [profiles.id],
			name: "hard_trip_participants_approved_by_fkey"
		}),
]);

export const waiver_signatures = pgTable("waiver_signatures", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	document_id: uuid().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	signed_at: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	confirmation_email_sent_at: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	ip_address: text().notNull(),
	user_id: uuid().notNull(),
	email: text().notNull(),
	typed_name: text().notNull(),
	typed_date: text().notNull(),
	drawn_signature: text().notNull(),
	consent_text: text().notNull(),
	document_hash: text().notNull(),
	signature_hash: text().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.user_id],
			foreignColumns: [profiles.id],
			name: "waiver_signatures_user_id_fkey"
		}),
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
}, (table) => [
	foreignKey({
			columns: [table.user_id],
			foreignColumns: [profiles.id],
			name: "guide_info_user_id_fkey"
		}),
]);

export const trips = pgTable("trips", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	name: text(),
	description: text(),
	difficulty: integer(),
	picture: text(),
	driver_spots: integer().default(0).notNull(),
	participant_spots: integer().default(8).notNull(),
	starts_at: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	ends_at: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
}, (table) => [
	check("ends_after_start", sql`starts_at < ends_at`),
	check("trips_driver_spots_check", sql`driver_spots >= 0`),
	check("trips_participant_spots_check", sql`participant_spots >= 0`),
	check("trips_difficulty_check", sql`(difficulty >= 1) AND (difficulty <= 10)`),
]);

export const profiles = pgTable("profiles", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	first_name: text().notNull(),
	last_name: text().notNull(),
	avatar: text(),
	email: text().notNull(),
	phone_number: text().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.id],
			foreignColumns: [users.id],
			name: "profiles_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const checkout_sessions = pgTable("checkout_sessions", {
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	user_id: uuid().notNull(),
	trip_id: uuid().notNull(),
	expires_at: timestamp({ withTimezone: true, mode: 'string' }).default(sql`(now() + '00:15:00'::interval)`).notNull(),
	stripe_checkout_session_id: text(),
	id: uuid().defaultRandom().primaryKey().notNull(),
	status: checkout_session_status().default('open').notNull(),
}, (table) => [
	foreignKey({
			columns: [table.trip_id],
			foreignColumns: [trips.id],
			name: "checkout_sessions_trip_id_fkey"
		}),
	foreignKey({
			columns: [table.user_id],
			foreignColumns: [profiles.id],
			name: "checkout_sessions_user_id_fkey"
		}),
	unique("user_trip_unique").on(table.user_id, table.trip_id),
	unique("ticket_reservations_stripe_checkout_session_id_key").on(table.stripe_checkout_session_id),
]);

export const tickets = pgTable("tickets", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	user_id: uuid().notNull(),
	trip_id: uuid().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	stripe_payment_id: text().notNull(),
	cancelled: boolean().default(false).notNull(),
	refunded: boolean().default(false).notNull(),
	cancelled_at: timestamp({ withTimezone: true, mode: 'string' }),
	type: ticket_type().notNull(),
	amount_paid: numeric().notNull(),
	stripe_refund_id: text(),
}, (table) => [
	foreignKey({
			columns: [table.trip_id],
			foreignColumns: [trips.id],
			name: "tickets_trip_id_fkey"
		}),
	foreignKey({
			columns: [table.user_id],
			foreignColumns: [profiles.id],
			name: "tickets_user_id_fkey"
		}),
	unique("tickets_unique_trip_participant").on(table.user_id, table.trip_id),
	unique("tickets_stripe_checkout_session_id_key").on(table.stripe_payment_id),
	unique("tickets_stripe_refund_id_key").on(table.stripe_refund_id),
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
]);
