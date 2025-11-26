import { db } from "@/utils/drizzle";
import { published_trips } from "@/drizzle/schema";
import { lt, desc } from "drizzle-orm";
import { InferSelectModel } from "drizzle-orm";

type GetPastPublishedTripsReturn = InferSelectModel<typeof published_trips>[];

export async function getPastPublishedTrips(): Promise<GetPastPublishedTripsReturn> {
	const now = new Date().toISOString();
	
	const trips = await db
		.select()
		.from(published_trips)
		.where(lt(published_trips.start_date, now))
		.orderBy(desc(published_trips.start_date));

	return trips;
}
