import { relations } from "drizzle-orm/relations";
import { trips, trip_budgets, forms, form_responses, profiles, waiver_uploads, tickets, trip_ticket_info, participant_info, trip_prices, waitlist_signups, driver_info, roles, hard_trip_participants, waiver_signatures, guide_info, checkout_sessions, trip_guides } from "./schema";
import { users } from "@/drizzle/auth-schema"

export const trip_budgetsRelations = relations(trip_budgets, ({one}) => ({
	trip: one(trips, {
		fields: [trip_budgets.trip_id],
		references: [trips.id]
	}),
}));

export const tripsRelations = relations(trips, ({many}) => ({
	trip_budgets: many(trip_budgets),
	trip_ticket_infos: many(trip_ticket_info),
	trip_prices: many(trip_prices),
	waitlist_signups: many(waitlist_signups),
	checkout_sessions: many(checkout_sessions),
	tickets: many(tickets),
	trip_guides: many(trip_guides),
}));

export const form_responsesRelations = relations(form_responses, ({one}) => ({
	form: one(forms, {
		fields: [form_responses.form_id],
		references: [forms.id]
	}),
	profile: one(profiles, {
		fields: [form_responses.user_id],
		references: [profiles.id]
	}),
}));

export const formsRelations = relations(forms, ({many}) => ({
	form_responses: many(form_responses),
}));

export const profilesRelations = relations(profiles, ({one, many}) => ({
	form_responses: many(form_responses),
	waiver_uploads: many(waiver_uploads),
	participant_infos: many(participant_info),
	waitlist_signups: many(waitlist_signups),
	driver_infos: many(driver_info),
	roles: many(roles),
	hard_trip_participants_user_id: many(hard_trip_participants, {
		relationName: "hard_trip_participants_user_id_profiles_id"
	}),
	hard_trip_participants_approved_by: many(hard_trip_participants, {
		relationName: "hard_trip_participants_approved_by_profiles_id"
	}),
	waiver_signatures: many(waiver_signatures),
	guide_infos: many(guide_info),
	usersInAuth: one(users, {
		fields: [profiles.id],
		references: [users.id]
	}),
	checkout_sessions: many(checkout_sessions),
	tickets: many(tickets),
	trip_guides: many(trip_guides),
}));

export const waiver_uploadsRelations = relations(waiver_uploads, ({one}) => ({
	profile: one(profiles, {
		fields: [waiver_uploads.user_id],
		references: [profiles.id]
	}),
	ticket: one(tickets, {
		fields: [waiver_uploads.ticket_id],
		references: [tickets.id]
	}),
}));

export const ticketsRelations = relations(tickets, ({one, many}) => ({
	waiver_uploads: many(waiver_uploads),
	trip: one(trips, {
		fields: [tickets.trip_id],
		references: [trips.id]
	}),
	profile: one(profiles, {
		fields: [tickets.user_id],
		references: [profiles.id]
	}),
}));

export const trip_ticket_infoRelations = relations(trip_ticket_info, ({one}) => ({
	trip: one(trips, {
		fields: [trip_ticket_info.trip_id],
		references: [trips.id]
	}),
}));

export const participant_infoRelations = relations(participant_info, ({one}) => ({
	profile: one(profiles, {
		fields: [participant_info.user_id],
		references: [profiles.id]
	}),
}));

export const trip_pricesRelations = relations(trip_prices, ({one}) => ({
	trip: one(trips, {
		fields: [trip_prices.trip_id],
		references: [trips.id]
	}),
}));

export const waitlist_signupsRelations = relations(waitlist_signups, ({one}) => ({
	profile: one(profiles, {
		fields: [waitlist_signups.user_id],
		references: [profiles.id]
	}),
	trip: one(trips, {
		fields: [waitlist_signups.trip_id],
		references: [trips.id]
	}),
}));

export const driver_infoRelations = relations(driver_info, ({one}) => ({
	profile: one(profiles, {
		fields: [driver_info.user_id],
		references: [profiles.id]
	}),
}));

export const rolesRelations = relations(roles, ({one}) => ({
	profile: one(profiles, {
		fields: [roles.user_id],
		references: [profiles.id]
	}),
}));

export const hard_trip_participantsRelations = relations(hard_trip_participants, ({one}) => ({
	profile_user_id: one(profiles, {
		fields: [hard_trip_participants.user_id],
		references: [profiles.id],
		relationName: "hard_trip_participants_user_id_profiles_id"
	}),
	profile_approved_by: one(profiles, {
		fields: [hard_trip_participants.approved_by],
		references: [profiles.id],
		relationName: "hard_trip_participants_approved_by_profiles_id"
	}),
}));

export const waiver_signaturesRelations = relations(waiver_signatures, ({one}) => ({
	profile: one(profiles, {
		fields: [waiver_signatures.user_id],
		references: [profiles.id]
	}),
}));

export const guide_infoRelations = relations(guide_info, ({one}) => ({
	profile: one(profiles, {
		fields: [guide_info.user_id],
		references: [profiles.id]
	}),
}));

export const usersInAuthRelations = relations(users, ({many}) => ({
	profiles: many(profiles),
}));

export const checkout_sessionsRelations = relations(checkout_sessions, ({one}) => ({
	trip: one(trips, {
		fields: [checkout_sessions.trip_id],
		references: [trips.id]
	}),
	profile: one(profiles, {
		fields: [checkout_sessions.user_id],
		references: [profiles.id]
	}),
}));

export const trip_guidesRelations = relations(trip_guides, ({one}) => ({
	trip: one(trips, {
		fields: [trip_guides.trip_id],
		references: [trips.id]
	}),
	profile: one(profiles, {
		fields: [trip_guides.user_id],
		references: [profiles.id]
	}),
}));