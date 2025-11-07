import {
	boolean,
	check,
	index,
	jsonb,
	pgSchema,
	smallint,
	text,
	timestamp,
	uniqueIndex,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm"

export const auth = pgSchema("auth");

export const users = auth.table("users", {
	instance_id: uuid(),
	id: uuid().notNull(),
	aud: varchar({ length: 255 }),
	role: varchar({ length: 255 }),
	email: varchar({ length: 255 }),
	encrypted_password: varchar({ length: 255 }),
	email_confirmed_at: timestamp({ withTimezone: true, mode: "string" }),
	invited_at: timestamp({ withTimezone: true, mode: "string" }),
	confirmation_token: varchar({ length: 255 }),
	confirmation_sent_at: timestamp({ withTimezone: true, mode: "string" }),
	recovery_token: varchar({ length: 255 }),
	recovery_sent_at: timestamp({ withTimezone: true, mode: "string" }),
	email_change_token_new: varchar({ length: 255 }),
	email_change: varchar({ length: 255 }),
	email_change_sent_at: timestamp({ withTimezone: true, mode: "string" }),
	last_sign_in_at: timestamp({ withTimezone: true, mode: "string" }),
	raw_app_meta_data: jsonb(),
	raw_user_meta_data: jsonb(),
	is_super_admin: boolean(),
	created_at: timestamp({ withTimezone: true, mode: "string" }),
	updated_at: timestamp({ withTimezone: true, mode: "string" }),
	phone: text().default(sql`NULL`),
	phone_confirmed_at: timestamp({ withTimezone: true, mode: "string" }),
	phone_change: text().default(""),
	phone_change_token: varchar({ length: 255 }).default(""),
	phone_change_sent_at: timestamp({ withTimezone: true, mode: "string" }),
	confirmed_at: timestamp({ withTimezone: true, mode: "string" })
		.generatedAlwaysAs(sql`LEAST(email_confirmed_at, phone_confirmed_at)`),
	email_change_token_current: varchar({ length: 255 }).default(""),
	email_change_confirm_status: smallint().default(0),
	banned_until: timestamp({ withTimezone: true, mode: "string" }),
	reauthentication_token: varchar({ length: 255 }).default(""),
	reauthentication_sent_at: timestamp({ withTimezone: true, mode: "string" }),
	is_sso_user: boolean().default(false).notNull(),
	deleted_at: timestamp({ withTimezone: true, mode: "string" }),
	is_anonymous: boolean().default(false).notNull(),
}, (table) => [
	uniqueIndex("confirmation_token_idx").using(
		"btree",
		table.confirmation_token.asc().nullsLast().op("text_ops"),
	).where(sql`((confirmation_token)::text !~ '^[0-9 ]*$'::text)`),
	uniqueIndex("email_change_token_current_idx").using(
		"btree",
		table.email_change_token_current.asc().nullsLast().op("text_ops"),
	).where(sql`((email_change_token_current)::text !~ '^[0-9 ]*$'::text)`),
	uniqueIndex("email_change_token_new_idx").using(
		"btree",
		table.email_change_token_new.asc().nullsLast().op("text_ops"),
	).where(sql`((email_change_token_new)::text !~ '^[0-9 ]*$'::text)`),
	uniqueIndex("reauthentication_token_idx").using(
		"btree",
		table.reauthentication_token.asc().nullsLast().op("text_ops"),
	).where(sql`((reauthentication_token)::text !~ '^[0-9 ]*$'::text)`),
	uniqueIndex("recovery_token_idx").using(
		"btree",
		table.recovery_token.asc().nullsLast().op("text_ops"),
	).where(sql`((recovery_token)::text !~ '^[0-9 ]*$'::text)`),
	uniqueIndex("users_email_partial_key").using(
		"btree",
		table.email.asc().nullsLast().op("text_ops"),
	).where(sql`(is_sso_user = false)`),
	index("users_instance_id_email_idx").using(
		"btree",
		sql`instance_id`,
		sql`lower((email)::text)`,
	),
	index("users_instance_id_idx").using(
		"btree",
		table.instance_id.asc().nullsLast().op("uuid_ops"),
	),
	index("users_is_anonymous_idx").using(
		"btree",
		table.is_anonymous.asc().nullsLast().op("bool_ops"),
	),
	check(
		"users_email_change_confirm_status_check",
		sql`(email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)`,
	),
]);
