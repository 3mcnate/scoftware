import { db } from "@/utils/drizzle";
import { published_trips, trip_settings, trip_cycles } from "@/drizzle/schema";
import { and, count, desc, lt } from "drizzle-orm";
import { InferSelectModel } from "drizzle-orm";
import {
	tripSettingsJoinCondition,
	tripCycleJoinCondition,
	tripVisibilityCondition,
} from "@/data/server/trips/trip-visibility";

type PublishedTrip = InferSelectModel<typeof published_trips>;

interface GetPastPublishedTripsOptions {
	limit?: number;
	offset?: number;
}

interface GetPastPublishedTripsReturn {
	trips: PublishedTrip[];
	totalCount: number;
}

export async function getPastPublishedTrips(
	options: GetPastPublishedTripsOptions = {},
): Promise<GetPastPublishedTripsReturn> {
	const { limit, offset } = options;
	const now = new Date().toISOString();

	const visibilityConditions = and(
		lt(published_trips.start_date, now),
		tripVisibilityCondition,
	);

	const [trips, countResult] = await Promise.all([
		db
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
			.where(visibilityConditions)
			.orderBy(desc(published_trips.start_date))
			.limit(limit ?? 1000)
			.offset(offset ?? 0),
		db
			.select({ count: count() })
			.from(published_trips)
			.innerJoin(trip_settings, tripSettingsJoinCondition)
			.leftJoin(trip_cycles, tripCycleJoinCondition)
			.where(visibilityConditions),
	]);

	return {
		trips,
		totalCount: countResult[0]?.count ?? 0,
	};
}
