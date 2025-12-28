import { relations } from "drizzle-orm/relations";
import { published_trips, tickets, profiles, trips, waiver_templates, trip_waivers, waiver_events, memberships, usersInAuth, trip_guides } from "./schema";

export const ticketsRelations = relations(tickets, ({one}) => ({
	published_trip: one(published_trips, {
		fields: [tickets.trip_id],
		references: [published_trips.id]
	}),
	profile: one(profiles, {
		fields: [tickets.user_id],
		references: [profiles.id]
	}),
	trip: one(trips, {
		fields: [tickets.trip_id],
		references: [trips.id]
	}),
}));

export const published_tripsRelations = relations(published_trips, ({one, many}) => ({
	tickets: many(tickets),
	trip: one(trips, {
		fields: [published_trips.id],
		references: [trips.id]
	}),
}));

export const profilesRelations = relations(profiles, ({one, many}) => ({
	tickets: many(tickets),
	waiver_events: many(waiver_events),
	memberships: many(memberships),
	usersInAuth: one(usersInAuth, {
		fields: [profiles.id],
		references: [usersInAuth.id]
	}),
	trip_guides: many(trip_guides),
}));

export const tripsRelations = relations(trips, ({many}) => ({
	tickets: many(tickets),
	trip_waivers: many(trip_waivers),
	waiver_events: many(waiver_events),
	published_trips: many(published_trips),
	trip_guides: many(trip_guides),
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

export const membershipsRelations = relations(memberships, ({one}) => ({
	profile: one(profiles, {
		fields: [memberships.user_id],
		references: [profiles.id]
	}),
}));

export const usersInAuthRelations = relations(usersInAuth, ({many}) => ({
	profiles: many(profiles),
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