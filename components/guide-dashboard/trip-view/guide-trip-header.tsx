"use client";

import type React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, Globe, ArrowLeft } from "lucide-react";
import { TripTabs } from "@/components/guide-dashboard/trip-view/trip-tabs";
import { useTrip } from "@/data/client/trips/get-guide-trips";

const guides = [
  { name: "Alex Chen", avatar: "/placeholder.svg?height=32&width=32" },
  { name: "Maria Santos", avatar: "/placeholder.svg?height=32&width=32" },
];

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
                {guides.map((guide, i) => (
                  <Avatar
                    key={i}
                    className="h-8 w-8 border-2 border-background"
                  >
                    <AvatarImage
                      src={guide.avatar || "/placeholder.svg"}
                      alt={guide.name}
                    />
                    <AvatarFallback className="text-xs">
                      {guide.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="bg-transparent">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button size="sm">
                <Globe className="h-4 w-4 mr-2" />
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
      <div className="mx-auto py-8">
        <Skeleton className="h-64 w-full mb-4" />
        <Skeleton className="h-32 w-full mb-4" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}
