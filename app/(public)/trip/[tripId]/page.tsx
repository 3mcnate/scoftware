import { TripDetails } from "@/components/public-trip-page/trip-details";
import { SignupButtons } from "@/components/public-trip-page/signup-buttons";
import { TripNavigation } from "@/components/public-trip-page/trip-navigation";
import { getVisiblePublishedTrip } from "@/data/server/trips/get-published-trip";
import { getAdjacentPublishedTrips } from "@/data/server/trips/get-adjacent-published-trips";
import { notFound } from "next/navigation";
import { formatDateWithWeekday } from "@/utils/date-time";
import { unstable_cache } from "next/cache";

export default async function TripPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;

  const getCachedTrip = unstable_cache(
    () => getVisiblePublishedTrip(tripId),
    [`trip-${tripId}`],
    { revalidate: 60, tags: ['trip-data', `trip-${tripId}`] }
  );

  const getCachedAdjacentTrips = unstable_cache(
    (id: string, startDate: string) => getAdjacentPublishedTrips(id, startDate),
    [`adjacent-trips-${tripId}`],
    { revalidate: 60, tags: ['trip-data'] }
  );

  let trip = null;

  try {
    trip = await getCachedTrip();
  } catch (e) {
    console.log("error fetching trip", e);
    notFound();
  }

  if (!trip) {
    notFound();
  }

  const { previous, next } = await getCachedAdjacentTrips(
    trip.id,
    trip.start_date
  );

  return (
    <>
      <TripDetails trip={trip} />

      <SignupButtons className="my-8" />

      <TripNavigation
        previousTrip={
          previous
            ? {
                id: previous.id,
                title: previous.name,
                date: formatDateWithWeekday(previous.start_date),
              }
            : undefined
        }
        nextTrip={
          next
            ? {
                id: next.id,
                title: next.name,
                date: formatDateWithWeekday(next.start_date),
              }
            : undefined
        }
      />
    </>
  );
}
