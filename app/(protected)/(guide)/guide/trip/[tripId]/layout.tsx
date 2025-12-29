"use client";

import type React from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  FileText,
  DollarSign,
  Settings,
  Eye,
  Globe,
  ArrowLeft,
} from "lucide-react";
import { TripTabs } from "@/components/guide-dashboard/trip-view/trip-tabs";

const tabs = [
  { value: "signups", label: "Signups", icon: Users },
  { value: "trip-page", label: "Trip Page", icon: FileText },
  { value: "budget", label: "Budget", icon: DollarSign },
  { value: "settings", label: "Settings", icon: Settings },
];

const guides = [
  { name: "Alex Chen", avatar: "/placeholder.svg?height=32&width=32" },
  { name: "Maria Santos", avatar: "/placeholder.svg?height=32&width=32" },
];

export default function TripEditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const tripId = params.tripId as string;

  const tripName = "Grand Canyon Expedition";

  return (
    <div className="min-h-screen bg-background">
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
      <div className="mx-auto py-8">{children}</div>
    </div>
  );
}
