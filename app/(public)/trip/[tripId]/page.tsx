"use server";

import { TripHeader } from "@/features/trip-page/components/trip-header";
import { TripDetails } from "@/features/trip-page/components/trip-details";
import { SignupButtons } from "@/features/trip-page/components/signup-buttons";
import { TripNavigation } from "@/features/trip-page/components/trip-navigation";
import { getPublishedTrip } from "@/data/trips/get-published-trip";
import { getAdjacentPublishedTrips } from "@/data/trips/get-adjacent-published-trips";
import { notFound } from "next/navigation";
import { formatDate } from "@/utils/date-time";

export default async function TripPage({
  params,
}: {
  params: { tripId: string };
}) {
  const { tripId } = await params;
  let trip = null;

  try {
    trip = await getPublishedTrip(tripId);
  } catch (e) {
    console.log("error fetching trip", e);
    notFound();
  }

  if (!trip) {
    notFound();
  }

  const { previous, next } = await getAdjacentPublishedTrips(
    trip.id,
    trip.start_date
  );

  return (
    <div className="min-h-screen bg-background">
      <TripHeader />

      <main className="container px-4 py-6 md:py-8 md:px-6 mx-auto">
        <TripDetails trip={trip} />

        <SignupButtons className="my-8" />

        <TripNavigation
          previousTrip={
            previous
              ? {
                  id: previous.id,
                  title: previous.name,
                  date: formatDate(previous.start_date),
                }
              : undefined
          }
          nextTrip={
            next
              ? {
                  id: next.id,
                  title: next.name,
                  date: formatDate(next.start_date),
                }
              : undefined
          }
        />
      </main>
    </div>
  );
}
