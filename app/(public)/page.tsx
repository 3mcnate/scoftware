import { TripsListHeader } from "@/features/trips-list/trips-list-header";
import { TripsList } from "@/features/trips-list/trips-list";
import { getUpcomingPublishedTrips } from "@/data/trips/get-upcoming-published-trips";
import { formatDate, formatTime } from "@/utils/date-time";

export default async function TripsPage() {
  const upcomingTrips = await getUpcomingPublishedTrips();
  
  const currentTrips = upcomingTrips.map((trip) => ({
    id: trip.id,
    picture: trip.picture,
    title: trip.name,
    startDate: formatDate(trip.start_date),
    startTime: formatTime(trip.start_date),
    endDate: formatDate(trip.end_date),
    endTime: formatTime(trip.end_date),
    activity: trip.activity,
    difficulty: trip.difficulty,
    priorExperience: trip.recommended_prior_experience,
    participantSpotsLeft: 0,
    driverSpotsLeft: 0,
    location: trip.location,
  }));

  return (
    <div className="min-h-screen bg-background">
      <TripsListHeader />

      <main className="container px-4 py-6 md:py-8 md:px-6 mx-auto">
        <div className="mb-6 text-center py-10 md:py-10">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Upcoming Trips
          </h1>
        </div>

        <TripsList trips={currentTrips} />
      </main>
    </div>
  );
}
