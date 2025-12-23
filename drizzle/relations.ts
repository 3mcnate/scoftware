import { relations } from "drizzle-orm/relations";
import { usersInAuth, profiles, trips, published_trips, waiver_events, trip_waivers, tickets, waiver_templates } from "./schema";

export const profilesRelations = relations(profiles, ({one, many}) => ({
	usersInAuth: one(usersInAuth, {
		fields: [profiles.id],
		references: [usersInAuth.id]
	}),
	waiver_events: many(waiver_events),
	tickets: many(tickets),
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
	waiver_events: many(waiver_events),
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

export const trip_waiversRelations = relations(trip_waivers, ({one, many}) => ({
	waiver_events: many(waiver_events),
	waiver_template: one(waiver_templates, {
		fields: [trip_waivers.template_id],
		references: [waiver_templates.id]
	}),
	trip: one(trips, {
		fields: [trip_waivers.trip_id],
		references: [trips.id]
	}),
}));

export const ticketsRelations = relations(tickets, ({one}) => ({
	published_trip: one(published_trips, {
		fields: [tickets.trip_id],
		references: [published_trips.id]
	}),
	profile: one(profiles, {
		fields: [tickets.user_id],
		references: [profiles.id]
	}),
}));

export const waiver_templatesRelations = relations(waiver_templates, ({many}) => ({
	trip_waivers: many(trip_waivers),
}));