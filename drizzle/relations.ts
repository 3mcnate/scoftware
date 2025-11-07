import { relations } from "drizzle-orm/relations";
import { trips, trip_budgets, forms, form_responses, profiles, waiver_uploads, tickets, bucketsInStorage, trip_ticket_info, oauth_clientsInAuth, oauth_authorizationsInAuth, usersInAuth, oauth_consentsInAuth, participant_info, trip_prices, waitlist_signups, sso_providersInAuth, saml_relay_statesInAuth, flow_stateInAuth, sessionsInAuth, refresh_tokensInAuth, sso_domainsInAuth, mfa_amr_claimsInAuth, saml_providersInAuth, identitiesInAuth, one_time_tokensInAuth, mfa_factorsInAuth, mfa_challengesInAuth, driver_info, roles, hard_trip_participants, waiver_signatures, guide_info, checkout_sessions, trip_guides } from "./schema";

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
	usersInAuth: one(usersInAuth, {
		fields: [profiles.id],
		references: [usersInAuth.id]
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
	bucketsInStorage: one(bucketsInStorage, {
		fields: [waiver_uploads.bucket],
		references: [bucketsInStorage.name]
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

export const bucketsInStorageRelations = relations(bucketsInStorage, ({many}) => ({
	waiver_uploads: many(waiver_uploads),
}));

export const trip_ticket_infoRelations = relations(trip_ticket_info, ({one}) => ({
	trip: one(trips, {
		fields: [trip_ticket_info.trip_id],
		references: [trips.id]
	}),
}));

export const oauth_authorizationsInAuthRelations = relations(oauth_authorizationsInAuth, ({one}) => ({
	oauth_clientsInAuth: one(oauth_clientsInAuth, {
		fields: [oauth_authorizationsInAuth.client_id],
		references: [oauth_clientsInAuth.id]
	}),
	usersInAuth: one(usersInAuth, {
		fields: [oauth_authorizationsInAuth.user_id],
		references: [usersInAuth.id]
	}),
}));

export const oauth_clientsInAuthRelations = relations(oauth_clientsInAuth, ({many}) => ({
	oauth_authorizationsInAuths: many(oauth_authorizationsInAuth),
	oauth_consentsInAuths: many(oauth_consentsInAuth),
	sessionsInAuths: many(sessionsInAuth),
}));

export const usersInAuthRelations = relations(usersInAuth, ({many}) => ({
	oauth_authorizationsInAuths: many(oauth_authorizationsInAuth),
	oauth_consentsInAuths: many(oauth_consentsInAuth),
	identitiesInAuths: many(identitiesInAuth),
	sessionsInAuths: many(sessionsInAuth),
	one_time_tokensInAuths: many(one_time_tokensInAuth),
	mfa_factorsInAuths: many(mfa_factorsInAuth),
	profiles: many(profiles),
}));

export const oauth_consentsInAuthRelations = relations(oauth_consentsInAuth, ({one}) => ({
	usersInAuth: one(usersInAuth, {
		fields: [oauth_consentsInAuth.user_id],
		references: [usersInAuth.id]
	}),
	oauth_clientsInAuth: one(oauth_clientsInAuth, {
		fields: [oauth_consentsInAuth.client_id],
		references: [oauth_clientsInAuth.id]
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

export const saml_relay_statesInAuthRelations = relations(saml_relay_statesInAuth, ({one}) => ({
	sso_providersInAuth: one(sso_providersInAuth, {
		fields: [saml_relay_statesInAuth.sso_provider_id],
		references: [sso_providersInAuth.id]
	}),
	flow_stateInAuth: one(flow_stateInAuth, {
		fields: [saml_relay_statesInAuth.flow_state_id],
		references: [flow_stateInAuth.id]
	}),
}));

export const sso_providersInAuthRelations = relations(sso_providersInAuth, ({many}) => ({
	saml_relay_statesInAuths: many(saml_relay_statesInAuth),
	sso_domainsInAuths: many(sso_domainsInAuth),
	saml_providersInAuths: many(saml_providersInAuth),
}));

export const flow_stateInAuthRelations = relations(flow_stateInAuth, ({many}) => ({
	saml_relay_statesInAuths: many(saml_relay_statesInAuth),
}));

export const refresh_tokensInAuthRelations = relations(refresh_tokensInAuth, ({one}) => ({
	sessionsInAuth: one(sessionsInAuth, {
		fields: [refresh_tokensInAuth.session_id],
		references: [sessionsInAuth.id]
	}),
}));

export const sessionsInAuthRelations = relations(sessionsInAuth, ({one, many}) => ({
	refresh_tokensInAuths: many(refresh_tokensInAuth),
	mfa_amr_claimsInAuths: many(mfa_amr_claimsInAuth),
	usersInAuth: one(usersInAuth, {
		fields: [sessionsInAuth.user_id],
		references: [usersInAuth.id]
	}),
	oauth_clientsInAuth: one(oauth_clientsInAuth, {
		fields: [sessionsInAuth.oauth_client_id],
		references: [oauth_clientsInAuth.id]
	}),
}));

export const sso_domainsInAuthRelations = relations(sso_domainsInAuth, ({one}) => ({
	sso_providersInAuth: one(sso_providersInAuth, {
		fields: [sso_domainsInAuth.sso_provider_id],
		references: [sso_providersInAuth.id]
	}),
}));

export const mfa_amr_claimsInAuthRelations = relations(mfa_amr_claimsInAuth, ({one}) => ({
	sessionsInAuth: one(sessionsInAuth, {
		fields: [mfa_amr_claimsInAuth.session_id],
		references: [sessionsInAuth.id]
	}),
}));

export const saml_providersInAuthRelations = relations(saml_providersInAuth, ({one}) => ({
	sso_providersInAuth: one(sso_providersInAuth, {
		fields: [saml_providersInAuth.sso_provider_id],
		references: [sso_providersInAuth.id]
	}),
}));

export const identitiesInAuthRelations = relations(identitiesInAuth, ({one}) => ({
	usersInAuth: one(usersInAuth, {
		fields: [identitiesInAuth.user_id],
		references: [usersInAuth.id]
	}),
}));

export const one_time_tokensInAuthRelations = relations(one_time_tokensInAuth, ({one}) => ({
	usersInAuth: one(usersInAuth, {
		fields: [one_time_tokensInAuth.user_id],
		references: [usersInAuth.id]
	}),
}));

export const mfa_factorsInAuthRelations = relations(mfa_factorsInAuth, ({one, many}) => ({
	usersInAuth: one(usersInAuth, {
		fields: [mfa_factorsInAuth.user_id],
		references: [usersInAuth.id]
	}),
	mfa_challengesInAuths: many(mfa_challengesInAuth),
}));

export const mfa_challengesInAuthRelations = relations(mfa_challengesInAuth, ({one}) => ({
	mfa_factorsInAuth: one(mfa_factorsInAuth, {
		fields: [mfa_challengesInAuth.factor_id],
		references: [mfa_factorsInAuth.id]
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