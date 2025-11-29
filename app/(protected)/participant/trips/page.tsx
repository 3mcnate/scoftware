"use client";

import { TripsTab } from "@/components/participant-dashboard/trips-tab";
import { ParticipantInfoRequiredAlert } from "@/components/participant-dashboard/participant-info-required-alert";

export default function TripsPage() {
  return (
    <div className="space-y-6">
      <ParticipantInfoRequiredAlert />
      <TripsTab />
    </div>
  );
}
