import { published_trips, trip_settings, trip_cycles } from "@/drizzle/schema";
import { and, between, eq, sql, or } from "drizzle-orm";
import type { PgSelectQueryBuilder } from "drizzle-orm/pg-core";

/**
 * Applies trip visibility filtering to a query on `published_trips`.
 *
 * Visibility logic (descending priority):
 * 1. Hide if trip_settings.hide_trip is true
 * 2. Show if now() >= trip_settings.publish_date_override
 * 3. Show if now() >= trip_cycles.trips_published_at (matched by date range)
 * 4. Otherwise, hide
 *
 * Usage:
 *   db.select().from(published_trips)
 *     .innerJoin(trip_settings, eq(published_trips.id, trip_settings.trip_id))
 *     .leftJoin(trip_cycles, visibilityJoinCondition)
 *     .where(and(...otherConditions, visibilityWhereCondition))
 */

/** Join condition for trip_cycles: match cycles whose range contains the trip start_date */
export const tripCycleJoinCondition = between(
  published_trips.start_date,
  trip_cycles.starts_at,
  trip_cycles.ends_at,
);

/** Join condition for trip_settings: match settings by trip_id */
export const tripSettingsJoinCondition = eq(
  published_trips.id,
  trip_settings.trip_id,
);

/**
 * WHERE condition implementing visibility logic:
 * - hide_trip must not be true
 * - Either publish_date_override has passed, or the cycle's trips_published_at has passed
 */
export const tripVisibilityCondition = and(
  eq(trip_settings.hide_trip, false),
  or(
    sql`now() >= ${trip_settings.publish_date_override}`,
    sql`now() >= ${trip_cycles.trips_published_at}`,
  ),
);
