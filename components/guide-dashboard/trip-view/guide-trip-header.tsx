"use client";

import type React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, Globe, ArrowLeft, ScanSearch, FileText } from "lucide-react";
import { TripTabs } from "@/components/guide-dashboard/trip-view/trip-tabs";
import { useTrip } from "@/data/client/trips/get-guide-trips";
import { getAvatarUrl } from "@/data/client/storage/avatars";
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

  if (isLoading || !trip) {
    return <GuideTripHeaderSkeleton />;
  }

  const tripName = trip?.name || "Grand Canyon Expedition";

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
              <Button size="sm">
                <Globe className="h-4 w-4" />
                Publish
              </Button>
            </div>
          </div>
        </div>

        <TripTabs />
      </div>
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
