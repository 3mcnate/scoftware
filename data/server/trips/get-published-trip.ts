import { db } from "@/utils/drizzle";
import { published_trips } from "@/drizzle/schema";
import { eq, and } from "drizzle-orm";
import { InferSelectModel } from "drizzle-orm";

type GetPublishedTripReturn = InferSelectModel<typeof published_trips>;

export async function getVisiblePublishedTrip(
	tripId: string,
): Promise<GetPublishedTripReturn | null> {
	const trips = await db
		.select()
		.from(published_trips)
		.where(and(eq(published_trips.id, tripId), published_trips.visible));

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
