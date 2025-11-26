import { relations } from "drizzle-orm/relations";
import { usersInAuth, profiles, trips, published_trips } from "./schema";

export const profilesRelations = relations(profiles, ({one}) => ({
	usersInAuth: one(usersInAuth, {
		fields: [profiles.id],
		references: [usersInAuth.id]
	}),
}));

export const usersInAuthRelations = relations(usersInAuth, ({many}) => ({
	profiles: many(profiles),
}));

export const published_tripsRelations = relations(published_trips, ({one}) => ({
	trip: one(trips, {
		fields: [published_trips.id],
		references: [trips.id]
	}),
}));

export const tripsRelations = relations(trips, ({many}) => ({
	published_trips: many(published_trips),
}));