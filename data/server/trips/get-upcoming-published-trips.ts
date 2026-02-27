import { db } from "@/utils/drizzle";
import { published_trips, trip_settings, trip_cycles } from "@/drizzle/schema";
import { and, asc, gte } from "drizzle-orm";
import { InferSelectModel } from "drizzle-orm";
import {
	tripSettingsJoinCondition,
	tripCycleJoinCondition,
	tripVisibilityCondition,
} from "@/data/server/trips/trip-visibility";

type GetUpcomingPublishedTripsReturn = InferSelectModel<
	typeof published_trips
>[];

export async function getUpcomingPublishedTrips(): Promise<
	GetUpcomingPublishedTripsReturn
> {
	const now = new Date().toISOString();

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
				gte(published_trips.start_date, now),
				tripVisibilityCondition,
			)
		)
		.orderBy(asc(published_trips.start_date));

	return trips;
}
