import { db } from "@/utils/drizzle";
import { published_trips, trip_settings, trip_cycles } from "@/drizzle/schema";
import { eq, and } from "drizzle-orm";
import { InferSelectModel } from "drizzle-orm";
import {
	tripSettingsJoinCondition,
	tripCycleJoinCondition,
	tripVisibilityCondition,
} from "@/data/server/trips/trip-visibility";

type GetPublishedTripReturn = InferSelectModel<typeof published_trips>;

export async function getVisiblePublishedTrip(
	tripId: string,
): Promise<GetPublishedTripReturn | null> {
	const trips = await db
		.select({
			id: published_trips.id,
			created_at: published_trips.created_at,
			updated_at: published_trips.updated_at,
			name: published_trips.name,
			start_date: published_trips.start_date,
			end_date: published_trips.end_date,
			meet: published_trips.meet,
			return: published_trips.return,
			activity: published_trips.activity,
			difficulty: published_trips.difficulty,
			trail: published_trips.trail,
			recommended_prior_experience: published_trips.recommended_prior_experience,
			location: published_trips.location,
			native_land: published_trips.native_land,
			what_to_bring: published_trips.what_to_bring,
			guides: published_trips.guides,
			picture_path: published_trips.picture_path,
			description: published_trips.description,
		})
		.from(published_trips)
		.innerJoin(trip_settings, tripSettingsJoinCondition)
		.leftJoin(trip_cycles, tripCycleJoinCondition)
		.where(
			and(
				eq(published_trips.id, tripId),
				tripVisibilityCondition,
			)
		);

	const trip = trips[0];

	if (!trip) {
		return null;
	}

	return trip;
}


export async function getPublishedTrip(
	tripId: string,
): Promise<GetPublishedTripReturn | null> {
	const trips = await db
		.select()
		.from(published_trips)
		.where(eq(published_trips.id, tripId));

	const trip = trips[0];

	if (!trip) {
		return null;
	}

	return trip;
}
