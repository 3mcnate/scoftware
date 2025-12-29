import type React from "react";
import GuideTripHeader from "@/components/guide-dashboard/trip-view/guide-trip-header";

export default function TripEditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
			<GuideTripHeader />
      <div className="mx-auto py-8">{children}</div>
    </div>
  );
}

