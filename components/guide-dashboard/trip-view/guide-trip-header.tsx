"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, Globe, ArrowLeft, ScanSearch, FileText } from "lucide-react";
import { TripTabs } from "@/components/guide-dashboard/trip-view/trip-tabs";
import { useTrip } from "@/data/client/trips/get-guide-trips";
import { getAvatarUrl } from "@/data/client/storage/avatars";
import { PublishTripDialog } from "@/components/guide-dashboard/trip-view/publish-trip-dialog";
import { TripStatusBadge } from "@/components/guide-dashboard/trip-status-badge";
import { computeTripStatus } from "@/lib/trip-status";
import { useTripCycleByDate } from "@/data/client/trip-cycles/get-trip-cycle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function GuideTripHeader() {
  const params = useParams();
  const tripId = params.tripId as string;
  const { data: trip, isLoading } = useTrip(tripId);
  const { data: cycle } = useTripCycleByDate(trip ? new Date(trip.start_date) : new Date());
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);

  if (isLoading || !trip) {
    return <GuideTripHeaderSkeleton />;
  }

  const tripName = trip?.name || "Grand Canyon Expedition";
  const isPublished = !!trip.published_trips;

  const activeTickets = trip.tickets?.filter((t) => !t.cancelled) ?? [];
  const participantCount = activeTickets.filter(
    (t) => t.type === "member" || t.type === "nonmember"
  ).length;
  const driverCount = activeTickets.filter((t) => t.type === "driver").length;

  const settings = trip.trip_settings;
  const tripStatus = computeTripStatus({
    cancelled: trip.cancelled,
    startDate: trip.start_date,
    endDate: trip.end_date,
    isPublished,
    allowSignups: settings?.allow_signups ?? true,
    enableParticipantWaitlist: settings?.enable_participant_waitlist ?? false,
    enableDriverWaitlist: settings?.enable_driver_waitlist ?? false,
    participantCount,
    participantSpots: trip.participant_spots,
    driverCount,
    driverSpots: trip.driver_spots,
    publishDate: settings?.publish_date_override ?? cycle?.trips_published_at ?? null,
    memberSignupDate: settings?.member_signup_date_override ?? cycle?.member_signups_start_at ?? null,
    nonmemberSignupDate: settings?.nonmember_signup_date_override ?? cycle?.nonmember_signups_start_at ?? null,
    driverSignupDate: settings?.driver_signup_date_override ?? cycle?.driver_signups_start_at ?? null,
  });

  return (
    <div className="bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="mx-auto py-4">
          <div className="flex items-center gap-3 mb-4">
            <Link
              href="/guide/my-trips"
              className="text-muted-foreground hover:text-foreground text-sm flex gap-2"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to My Trips
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold">{tripName}</h1>
              <TripStatusBadge status={tripStatus} />
              <div className="flex -space-x-2">
                {trip.trip_guides.map((guide, i) => (
                  <Avatar
                    key={i}
                    className="h-8 w-8 border-2 border-background"
                  >
                    <AvatarImage
                      src={
                        guide.profiles.avatar_path
                          ? getAvatarUrl(guide.profiles.avatar_path)
                          : "/placeholder.svg"
                      }
                      alt={guide.profiles.first_name}
                    />
                    <AvatarFallback className="text-xs">
                      {guide.profiles.first_name[0] +
                        guide.profiles.last_name[0]}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-transparent"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem>
                    <ScanSearch /> Preview
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileText />
                    View live page
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button size="sm" onClick={() => setPublishDialogOpen(true)}>
                <Globe className="h-4 w-4" />
								{isPublished ? "Publish Updates" : "Ready to Publish"}
              </Button>
            </div>
          </div>
        </div>

        <TripTabs />
      </div>

      <PublishTripDialog
        open={publishDialogOpen}
        onOpenChange={setPublishDialogOpen}
        trip={trip}
      />
    </div>
  );
}


function GuideTripHeaderSkeleton() {
  return (
    <div className="bg-background">
      <div className="border-b border-border">
        <div className="mx-auto py-4">
          <div className="flex items-center gap-3 mb-4">
            <Link
              href="/guide/my-trips"
              className="text-muted-foreground hover:text-foreground text-sm flex gap-2"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to My Trips
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="h-8 w-64" />
              <div className="flex -space-x-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        </div>

        <TripTabs />
      </div>
    </div>
  );
}
