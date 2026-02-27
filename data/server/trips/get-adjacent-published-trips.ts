import { db } from "@/utils/drizzle";
import { published_trips, trip_settings, trip_cycles } from "@/drizzle/schema";
import { lt, gt, asc, desc, and, ne } from "drizzle-orm";
import { InferSelectModel } from "drizzle-orm";
import {
	tripSettingsJoinCondition,
	tripCycleJoinCondition,
	tripVisibilityCondition,
} from "@/data/server/trips/trip-visibility";

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
      .innerJoin(trip_settings, tripSettingsJoinCondition)
      .leftJoin(trip_cycles, tripCycleJoinCondition)
      .where(
        and(
          lt(published_trips.start_date, startDate),
          ne(published_trips.id, tripId),
          tripVisibilityCondition,
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
      .innerJoin(trip_settings, tripSettingsJoinCondition)
      .leftJoin(trip_cycles, tripCycleJoinCondition)
      .where(
        and(
          gt(published_trips.start_date, startDate),
          ne(published_trips.id, tripId),
          tripVisibilityCondition,
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
