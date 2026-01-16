"use client";

import { useParams } from "next/navigation";
import { TripParticipantsTable } from "@/components/guide-dashboard/trip-view/trip-participants-table";
import { TripAlerts } from "@/components/guide-dashboard/trip-view/trip-alerts";
import { TripWaitlistSignupsTable } from "@/components/guide-dashboard/trip-view/trip-waitlist-signups-table";

const SignupsPage = () => {
  const params = useParams();
  const tripId = params.tripId as string;

  return (
    <div className="space-y-12">
      <TripParticipantsTable tripId={tripId} />
      <TripAlerts tripId={tripId} />
      <TripWaitlistSignupsTable tripId={tripId} />
    </div>
  );
};

export default SignupsPage;
