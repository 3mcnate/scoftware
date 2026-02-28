import { revalidateTag } from "next/cache";

/**
 * Revalidates all trip-related caches. Call after publishing or updating a trip.
 * - "upcoming-trips": the public trips list at /
 * - "trip-data": all individual trip detail pages
 * - "trip-${tripId}": the specific trip's detail page
 */
export function revalidateTripCache(tripId: string) {
	revalidateTag("upcoming-trips");
	revalidateTag("trip-data");
	revalidateTag(`trip-${tripId}`);
}
