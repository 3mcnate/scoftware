import { db } from "@/utils/drizzle";
import { published_trips } from "@/drizzle/schema";
import { and, asc, gte } from "drizzle-orm";
import { InferSelectModel } from "drizzle-orm";

type GetUpcomingPublishedTripsReturn = InferSelectModel<
	typeof published_trips
>[];

export async function getUpcomingPublishedTrips(): Promise<
	GetUpcomingPublishedTripsReturn
> {
	const now = new Date().toISOString();

	const trips = await db
		.select()
		.from(published_trips)
		.where(
			and(
				gte(published_trips.start_date, now), 
				published_trips.visible
			)
		)
		.orderBy(asc(published_trips.start_date));

	return trips;
}
