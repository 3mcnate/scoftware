import { relations } from "drizzle-orm/relations";
import { profiles, memberships, usersInAuth, trips, published_trips, tickets, waiver_templates, trip_waivers, waitlist_signups, waiver_events, roles, trip_guides } from "./schema";

export const membershipsRelations = relations(memberships, ({one}) => ({
	profile: one(profiles, {
		fields: [memberships.user_id],
		references: [profiles.id]
	}),
}));

export const profilesRelations = relations(profiles, ({one, many}) => ({
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

export const usersInAuthRelations = relations(usersInAuth, ({many}) => ({
	profiles: many(profiles),
}));

export const published_tripsRelations = relations(published_trips, ({one, many}) => ({
	trip: one(trips, {
		fields: [published_trips.id],
		references: [trips.id]
	}),
	tickets: many(tickets),
}));

export const tripsRelations = relations(trips, ({many}) => ({
	published_trips: many(published_trips),
	tickets: many(tickets),
	trip_waivers: many(trip_waivers),
	waitlist_signups: many(waitlist_signups),
	waiver_events: many(waiver_events),
	trip_guides: many(trip_guides),
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