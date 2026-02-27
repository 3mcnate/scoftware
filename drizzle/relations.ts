import { relations } from "drizzle-orm/relations";
import { trips, stripe_products, profiles, allowed_trip_participants, driver_info, guide_info, hard_trip_participants, memberships, usersInAuth, published_trips, tickets, trip_prices, waiver_templates, trip_waivers, waitlist_signups, waiver_events, roles, trip_settings, trip_guides } from "./schema";

export const stripe_productsRelations = relations(stripe_products, ({one, many}) => ({
	trip: one(trips, {
		fields: [stripe_products.trip_id],
		references: [trips.id]
	}),
	trip_prices: many(trip_prices),
}));

export const tripsRelations = relations(trips, ({many}) => ({
	stripe_products: many(stripe_products),
	allowed_trip_participants: many(allowed_trip_participants),
	tickets: many(tickets),
	published_trips: many(published_trips),
	trip_prices: many(trip_prices),
	trip_waivers: many(trip_waivers),
	waitlist_signups: many(waitlist_signups),
	waiver_events: many(waiver_events),
	trip_settings: many(trip_settings),
	trip_guides: many(trip_guides),
}));

export const allowed_trip_participantsRelations = relations(allowed_trip_participants, ({one}) => ({
	profile_approved_by: one(profiles, {
		fields: [allowed_trip_participants.approved_by],
		references: [profiles.id],
		relationName: "allowed_trip_participants_approved_by_profiles_id"
	}),
	trip: one(trips, {
		fields: [allowed_trip_participants.trip_id],
		references: [trips.id]
	}),
	profile_user_id: one(profiles, {
		fields: [allowed_trip_participants.user_id],
		references: [profiles.id],
		relationName: "allowed_trip_participants_user_id_profiles_id"
	}),
}));

export const profilesRelations = relations(profiles, ({one, many}) => ({
	allowed_trip_participants_approved_by: many(allowed_trip_participants, {
		relationName: "allowed_trip_participants_approved_by_profiles_id"
	}),
	allowed_trip_participants_user_id: many(allowed_trip_participants, {
		relationName: "allowed_trip_participants_user_id_profiles_id"
	}),
	driver_infos: many(driver_info),
	guide_infos: many(guide_info),
	hard_trip_participants_approved_by: many(hard_trip_participants, {
		relationName: "hard_trip_participants_approved_by_profiles_id"
	}),
	hard_trip_participants_user_id: many(hard_trip_participants, {
		relationName: "hard_trip_participants_user_id_profiles_id"
	}),
	memberships: many(memberships),
	usersInAuth: one(usersInAuth, {
		fields: [profiles.id],
		references: [usersInAuth.id]
	}),
	tickets: many(tickets),
	waitlist_signups: many(waitlist_signups),
	waiver_events: many(waiver_events),
	roles: many(roles),
	trip_guides: many(trip_guides),
}));

export const driver_infoRelations = relations(driver_info, ({one}) => ({
	profile: one(profiles, {
		fields: [driver_info.user_id],
		references: [profiles.id]
	}),
}));

export const guide_infoRelations = relations(guide_info, ({one}) => ({
	profile: one(profiles, {
		fields: [guide_info.user_id],
		references: [profiles.id]
	}),
}));

export const hard_trip_participantsRelations = relations(hard_trip_participants, ({one}) => ({
	profile_approved_by: one(profiles, {
		fields: [hard_trip_participants.approved_by],
		references: [profiles.id],
		relationName: "hard_trip_participants_approved_by_profiles_id"
	}),
	profile_user_id: one(profiles, {
		fields: [hard_trip_participants.user_id],
		references: [profiles.id],
		relationName: "hard_trip_participants_user_id_profiles_id"
	}),
}));

export const membershipsRelations = relations(memberships, ({one}) => ({
	profile: one(profiles, {
		fields: [memberships.user_id],
		references: [profiles.id]
	}),
}));

export const usersInAuthRelations = relations(usersInAuth, ({many}) => ({
	profiles: many(profiles),
}));

export const ticketsRelations = relations(tickets, ({one}) => ({
	published_trip: one(published_trips, {
		fields: [tickets.trip_id],
		references: [published_trips.id]
	}),
	trip: one(trips, {
		fields: [tickets.trip_id],
		references: [trips.id]
	}),
	profile: one(profiles, {
		fields: [tickets.user_id],
		references: [profiles.id]
	}),
}));

export const published_tripsRelations = relations(published_trips, ({one, many}) => ({
	tickets: many(tickets),
	trip: one(trips, {
		fields: [published_trips.id],
		references: [trips.id]
	}),
}));

export const trip_pricesRelations = relations(trip_prices, ({one}) => ({
	trip: one(trips, {
		fields: [trip_prices.trip_id],
		references: [trips.id]
	}),
	stripe_product: one(stripe_products, {
		fields: [trip_prices.stripe_product_id],
		references: [stripe_products.stripe_product_id]
	}),
}));

export const trip_waiversRelations = relations(trip_waivers, ({one, many}) => ({
	waiver_template: one(waiver_templates, {
		fields: [trip_waivers.template_id],
		references: [waiver_templates.id]
	}),
	trip: one(trips, {
		fields: [trip_waivers.trip_id],
		references: [trips.id]
	}),
	waiver_events: many(waiver_events),
}));

export const waiver_templatesRelations = relations(waiver_templates, ({many}) => ({
	trip_waivers: many(trip_waivers),
}));

export const waitlist_signupsRelations = relations(waitlist_signups, ({one}) => ({
	trip: one(trips, {
		fields: [waitlist_signups.trip_id],
		references: [trips.id]
	}),
	profile: one(profiles, {
		fields: [waitlist_signups.user_id],
		references: [profiles.id]
	}),
}));

export const waiver_eventsRelations = relations(waiver_events, ({one}) => ({
	trip: one(trips, {
		fields: [waiver_events.trip_id],
		references: [trips.id]
	}),
	profile: one(profiles, {
		fields: [waiver_events.user_id],
		references: [profiles.id]
	}),
	trip_waiver: one(trip_waivers, {
		fields: [waiver_events.waiver_id],
		references: [trip_waivers.id]
	}),
}));

export const rolesRelations = relations(roles, ({one}) => ({
	profile: one(profiles, {
		fields: [roles.user_id],
		references: [profiles.id]
	}),
}));

export const trip_settingsRelations = relations(trip_settings, ({one}) => ({
	trip: one(trips, {
		fields: [trip_settings.trip_id],
		references: [trips.id]
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