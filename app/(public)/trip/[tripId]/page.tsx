"use server";

import { TripDetails } from "@/components/trip-page/trip-details";
import { SignupButtons } from "@/components/trip-page/signup-buttons";
import { TripNavigation } from "@/components/trip-page/trip-navigation";
import { getVisiblePublishedTrip } from "@/data/trips/get-published-trip";
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
    </>
  );
}
