"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Users, FileText, Settings, CircleDollarSign } from "lucide-react";
import type React from "react";

type TabValue = "signups" | "trip-page" | "budget" | "settings";

const tabs: {
  value: TabValue;
  label: string;
  icon: React.ElementType;
  segment: string;
}[] = [
  { value: "signups", label: "Signups", icon: Users, segment: "signups" },
  { value: "trip-page", label: "Trip Page", icon: FileText, segment: "trip-page" },
  { value: "budget", label: "Budget", icon: CircleDollarSign, segment: "budget" },
  { value: "settings", label: "Settings", icon: Settings, segment: "settings" },
];

export function TripTabs() {
  const pathname = usePathname();
  const params = useParams();
  const tripId = params.tripId as string;

  return (
    <nav className="flex gap-1 border-b">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const href = `/guide/trip/${tripId}/${tab.segment}`;
        const isActive = pathname.includes(`/${tab.segment}`);
        return (
          <Link
            key={tab.value}
            href={href}
            className={cn(
              "relative px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2",
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {tab.label}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
