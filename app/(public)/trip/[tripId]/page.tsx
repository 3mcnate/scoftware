"use server";

import { TripDetails } from "@/components/public-trip-page/trip-details";
import { SignupButtons } from "@/components/public-trip-page/signup-buttons";
import { TripNavigation } from "@/components/public-trip-page/trip-navigation";
import { getVisiblePublishedTrip } from "@/data/server/trips/get-published-trip";
import { getAdjacentPublishedTrips } from "@/data/server/trips/get-adjacent-published-trips";
import { notFound } from "next/navigation";
import { formatDateWithWeekday } from "@/utils/date-time";

export default async function TripPage({
  params,
}: {
  params: { tripId: string };
}) {
  const { tripId } = await params;
  let trip = null;

  try {
    trip = await getVisiblePublishedTrip(tripId);
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
