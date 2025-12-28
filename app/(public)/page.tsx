import { TripsList } from "@/components/trips-list/trips-list";
import { getUpcomingPublishedTrips } from "@/data/server/trips/get-upcoming-published-trips";
import { formatDateWithWeekday, formatTime } from "@/utils/date-time";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { History, Undo2 } from "lucide-react";

export default async function TripsPage() {
  const upcomingTrips = await getUpcomingPublishedTrips();

  const currentTrips = upcomingTrips.map((trip) => ({
    id: trip.id,
    picture_path: trip.picture_path,
    title: trip.name,
    startDate: formatDateWithWeekday(trip.start_date),
    startTime: formatTime(trip.start_date),
    endDate: formatDateWithWeekday(trip.end_date),
    endTime: formatTime(trip.end_date),
    activity: trip.activity,
    difficulty: trip.difficulty,
    priorExperience: trip.recommended_prior_experience,
    participantSpotsLeft: 0,
    driverSpotsLeft: 0,
    location: trip.location,
  }));

  return (
    <>
      <div className="flex justify-between">
        <Button asChild variant="ghost" className="font-normal">
          <Link href="https://www.scoutfitters.org">
            <Undo2 className="h-4 w-4" />
            Return to scoutfitters.org
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/past-trips">
            <History className="h-4 w-4" />
            View Past Trips
          </Link>
        </Button>
      </div>

      <div className="mb-6 text-center py-10 md:py-10">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          Upcoming Trips
        </h1>
      </div>

      <TripsList trips={currentTrips} />
    </>
  );
}
