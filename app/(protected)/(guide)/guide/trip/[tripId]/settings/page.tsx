"use client";

import { useParams } from "next/navigation";
import { useTrip, type TripData } from "@/data/client/trips/get-guide-trips";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTripCycleByDate } from "@/data/client/trip-cycles/get-trip-cycle";
import { BasicInfoSection } from "@/components/guide-dashboard/trip-view/settings/basic-info-section";
import {
  SignupSettingsSection,
  TripCycleSkeleton,
} from "@/components/guide-dashboard/trip-view/settings/signup-settings-section";
import { GuidesSection } from "@/components/guide-dashboard/trip-view/settings/guides-section";
import { DestructiveSection } from "@/components/guide-dashboard/trip-view/settings/destructive-section";
import { useTripTickets } from "@/data/client/tickets/get-trip-tickets";

export default function SettingsPage() {
  const params = useParams();
  const tripId = params.tripId as string;
  const { data: trip, isLoading } = useTrip(tripId);

  if (isLoading || !trip) {
    return <SettingsFormSkeleton />;
  }

  return <TripSettingsForm trip={trip} />;
}

function SettingsFormSkeleton() {
  return (
    <div className="space-y-8">
      {/* Basic Info Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48 mt-1" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <Skeleton className="h-10 w-24 ml-auto" />
        </CardContent>
      </Card>

      {/* Guides Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-56 mt-1" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
              <Skeleton className="h-8 w-8" />
            </div>
          ))}
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>

      {/* Signup Settings Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-64 mt-1" />
        </CardHeader>
        <CardContent className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="space-y-1">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-56" />
              </div>
              <Skeleton className="h-6 w-11 rounded-full" />
            </div>
          ))}
          <Skeleton className="h-10 w-24 ml-auto" />
        </CardContent>
      </Card>

      {/* Danger Zone Skeleton */}
      <Card className="border-destructive/50">
        <CardHeader>
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-4 w-48 mt-1" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-destructive/30 rounded-lg">
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-10 w-28" />
          </div>
          <div className="flex items-center justify-between p-4 border border-destructive/30 rounded-lg">
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-56" />
            </div>
            <Skeleton className="h-10 w-24" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TripSettingsForm({ trip }: { trip: TripData }) {
  const auth = useAuth();
  const userId = auth.status === "authenticated" ? auth.user.id : "";
  const { data: tripCycle, isLoading: isTripCycleLoading } = useTripCycleByDate(
    new Date(trip.start_date),
  );
	const { data: tickets } = useTripTickets(trip.id);

  return (
    <div className="space-y-8">
      <BasicInfoSection trip={trip} />
      {isTripCycleLoading ? (
        <TripCycleSkeleton />
      ) : (
        <SignupSettingsSection trip={trip} tripCycle={tripCycle ?? null} />
      )}
      <GuidesSection trip={trip} currentUserId={userId} />
      <DestructiveSection trip={trip} currentUserId={userId} allowDeletion={tickets?.length === 0}/>
    </div>
  );
}
