"use client";

import { ItemGroup } from "@/components/ui/item";
import { TripListItem } from "./trip-list-item";

interface Trip {
  id: string;
  picture: string;
  title: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  activity: string;
  difficulty: string;
  priorExperience: string;
  participantSpotsLeft: number;
  driverSpotsLeft: number;
  location: string;
}

interface TripsListProps {
  trips: Trip[];
  isPast?: boolean;
}

export function TripsList({ trips }: TripsListProps) {
  return (
    <ItemGroup className="gap-4">
      {trips.map((trip) => (
        <TripListItem key={trip.id} trip={trip} />
      ))}
    </ItemGroup>
  );
}
