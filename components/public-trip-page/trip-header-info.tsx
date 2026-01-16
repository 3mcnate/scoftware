"use client";

import { Badge } from "@/components/ui/badge";
import { SignupButtons } from "@/components/public-trip-page/signup-buttons";

const participantSpotsRemaining = 2;
const participantSpotsTotal = 7;
const driverSpotsRemaining = 1;
const driverSpotsTotal = 1;

export default function TripHeaderInfo() {
  return (
    <>
      <div className="hidden md:flex items-center gap-3">
        <div className="text-right">
          <p className="text-xs text-muted-foreground font-medium">
            Participant Spots
          </p>
          <p className="text-lg font-bold text-foreground">
            {participantSpotsRemaining}/{participantSpotsTotal}{" "}
            <span className="hidden lg:inline-block">left</span>
          </p>
        </div>
        <div className="h-10 w-px bg-border" />
        <div className="text-right">
          <p className="text-xs text-muted-foreground font-medium">
            Driver Spots
          </p>
          <p className="text-lg font-bold text-foreground">
            {driverSpotsRemaining}/{driverSpotsTotal}{" "}
            <span className="hidden lg:inline-block">left</span>
          </p>
        </div>
      </div>

      <SignupButtons className="hidden md:flex" />
    </>
  );
}

export function TripHeaderInfoBadges() {
  return (
    <div className="flex gap-2 md:hidden">
      <Badge variant="secondary" className="font-bold text-xs">
        {participantSpotsRemaining}/{participantSpotsTotal} spots left
      </Badge>
      <Badge variant="secondary" className="font-bold text-xs">
        {driverSpotsRemaining}/{driverSpotsTotal} drivers spots left
      </Badge>
    </div>
  );
}
