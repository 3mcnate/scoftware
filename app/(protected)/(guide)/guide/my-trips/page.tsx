"use client";

import { useGuideTrips } from "@/data/client/trips/get-guide-trips";
import { useAuth } from "@/hooks/use-auth";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TripsTable,
  TripsTableSkeleton,
  TripData,
} from "@/components/guide-dashboard/trips-table";
import { Map, Plus } from "lucide-react";
import Link from "next/link";

export default function MyTripsPage() {
  const auth = useAuth();
  const userId = auth.status === "authenticated" ? auth.user.id : "";
  const { data: guideTrips, isLoading } = useGuideTrips(userId);

  if (auth.status !== "authenticated" || isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Trips</h1>
          <Skeleton className="h-10 w-32" />
        </div>
        <TripsTableSkeleton />
      </div>
    );
  }

  const now = new Date();
  const allTrips: TripData[] = (guideTrips ?? [])
    .map((gt) => gt.trips)
    .filter((t): t is TripData => t !== null);

  const upcomingTrips = allTrips.filter(
    (t) => new Date(t.start_date) >= now
  );
  const pastTrips = allTrips.filter((t) => new Date(t.start_date) < now);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Trips</h1>
        <Button asChild>
          <Link href="/guide/trip/new">
            <Plus className="h-4 w-4 mr-2" />
            Create Trip
          </Link>
        </Button>
      </div>

      <div className="space-y-6">
        <h2 className="text-lg font-semibold">Upcoming Trips</h2>
        {upcomingTrips.length === 0 ? (
          <Empty className="border rounded-lg">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Map />
              </EmptyMedia>
              <EmptyTitle>No Upcoming Trips</EmptyTitle>
              <EmptyDescription>
                You don&apos;t have any upcoming trips assigned to you.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button asChild>
                <Link href="/guide/trip/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Trip
                </Link>
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          <TripsTable trips={upcomingTrips} />
        )}
      </div>

      {pastTrips.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">Past Trips</h2>
          <TripsTable trips={pastTrips} isPast />
        </div>
      )}

      {pastTrips.length === 0 && allTrips.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">Past Trips</h2>
          <Empty className="border rounded-lg">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Map />
              </EmptyMedia>
              <EmptyTitle>No Past Trips</EmptyTitle>
              <EmptyDescription>
                You don&apos;t have any completed trips yet.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      )}
    </div>
  );
}