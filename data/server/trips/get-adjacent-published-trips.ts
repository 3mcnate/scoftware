import { db } from "@/utils/drizzle";
import { published_trips } from "@/drizzle/schema";
import { lt, gt, asc, desc, and, ne } from "drizzle-orm";
import { InferSelectModel } from "drizzle-orm";

type PublishedTrip = InferSelectModel<typeof published_trips>;

interface AdjacentTrips {
  previous: Pick<PublishedTrip, "id" | "name" | "start_date"> | null;
  next: Pick<PublishedTrip, "id" | "name" | "start_date"> | null;
}

export async function getAdjacentPublishedTrips(
  tripId: string,
  startDate: string
): Promise<AdjacentTrips> {
  const [previousTrips, nextTrips] = await Promise.all([
    db
      .select({
        id: published_trips.id,
        name: published_trips.name,
        start_date: published_trips.start_date,
      })
      .from(published_trips)
      .where(
        and(
          lt(published_trips.start_date, startDate),
          ne(published_trips.id, tripId),
					published_trips.visible
        )
      )
      .orderBy(desc(published_trips.start_date))
      .limit(1),
    db
      .select({
        id: published_trips.id,
        name: published_trips.name,
        start_date: published_trips.start_date,
      })
      .from(published_trips)
      .where(
        and(
          gt(published_trips.start_date, startDate),
          ne(published_trips.id, tripId),
					published_trips.visible
        )
      )
      .orderBy(asc(published_trips.start_date))
      .limit(1),
  ]);

  return {
    previous: previousTrips[0] ?? null,
    next: nextTrips[0] ?? null,
  };
}
