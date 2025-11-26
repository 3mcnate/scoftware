"use server";

import { TripHeader } from "@/features/trip-page/components/trip-header";
import { TripDetails } from "@/features/trip-page/components/trip-details";
import { SignupButtons } from "@/features/trip-page/components/signup-buttons";
import { TripNavigation } from "@/features/trip-page/components/trip-navigation";
import { getPublishedTrip } from "@/data/trips/get-published-trip";
import { notFound } from "next/navigation";

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

  return (
    <div className="min-h-screen bg-background">
      <TripHeader />

      <main className="container px-4 py-6 md:py-8 md:px-6 mx-auto">
        <TripDetails trip={trip} />

        <SignupButtons className="my-8" />

        <TripNavigation
          previousTrip={{
            id: "lake-placid-snowshoeing",
            title: "Lake Placid Snowshoeing Adventure",
            date: "February 8, 2025",
          }}
          nextTrip={{
            id: "white-mountains-skiing",
            title: "White Mountains Backcountry Skiing",
            date: "February 22, 2025",
          }}
        />
      </main>
    </div>
  );
}
