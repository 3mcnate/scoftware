"use client";

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ChevronRight } from "lucide-react";
import { useUserTickets } from "@/data/client/participant/get-user-tickets";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";

interface TripPageWaiverAlertProps {
  tripId: string;
}

export function TripPageWaiverAlert({ tripId }: TripPageWaiverAlertProps) {
  const auth = useAuth();
  const userId = auth.status === "authenticated" ? auth.user.id : "";
  const { data: tickets } = useUserTickets(userId);

  if (auth.status !== "authenticated") {
    return null;
  }

  const now = new Date();
  const tripTicket = tickets?.find(
    (t) =>
      t.trip_id === tripId &&
      !t.cancelled &&
      !t.waiver_filepath &&
      new Date(t.published_trips.start_date) > now
  );

  if (!tripTicket) {
    return null;
  }

  return (
    <Alert className="bg-warning/20 border-warning/30">
      <AlertTriangle className="h-4 w-4 text-warning" />
      <div className="flex flex-1 items-center justify-between gap-4">
        <div>
          <AlertTitle>Waiver Required</AlertTitle>
          <AlertDescription className="text-muted-foreground">
            You&apos;re signed up for this trip, but you must sign the waiver
            before coming.
          </AlertDescription>
        </div>
        <Button asChild variant="outline" className="shrink-0">
          <Link href={`/participant/trips/${tripId}/waiver`}>
            Sign Waiver
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </Alert>
  );
}
