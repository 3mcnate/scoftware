import { db } from "@/utils/drizzle";
import { published_trips } from "@/drizzle/schema";
import { gte, asc } from "drizzle-orm";
import { InferSelectModel } from "drizzle-orm";

type GetUpcomingPublishedTripsReturn = InferSelectModel<typeof published_trips>[];

export async function getUpcomingPublishedTrips(): Promise<GetUpcomingPublishedTripsReturn> {
	const now = new Date().toISOString();
	
	const trips = await db
		.select()
		.from(published_trips)
		.where(gte(published_trips.start_date, now))
		.orderBy(asc(published_trips.start_date));

	return trips;
}
