import { db } from "@/utils/drizzle";
import { published_trips } from "@/drizzle/schema";
import { lt, desc, count } from "drizzle-orm";
import { InferSelectModel } from "drizzle-orm";

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
	options: GetPastPublishedTripsOptions = {}
): Promise<GetPastPublishedTripsReturn> {
	const { limit, offset } = options;
	const now = new Date().toISOString();

	const [trips, countResult] = await Promise.all([
		db
			.select()
			.from(published_trips)
			.where(lt(published_trips.start_date, now))
			.orderBy(desc(published_trips.start_date))
			.limit(limit ?? 1000)
			.offset(offset ?? 0),
		db
			.select({ count: count() })
			.from(published_trips)
			.where(lt(published_trips.start_date, now)),
	]);

	return {
		trips,
		totalCount: countResult[0]?.count ?? 0,
	};
}
