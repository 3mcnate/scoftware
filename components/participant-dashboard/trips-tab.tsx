"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle } from "@/components/ui/alert";
import {
  Calendar,
  MapPin,
  Clock,
  AlertTriangle,
  ChevronRight,
  Car,
  CircleAlert,
  ArrowUpRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useUserTickets } from "@/data/participant/get-user-tickets";
import { useAuth } from "@/hooks/use-auth";
import { formatDate } from "@/utils/date-time";
import { Skeleton } from "@/components/ui/skeleton";

type TicketWithTrip = NonNullable<
  ReturnType<typeof useUserTickets>["data"]
>[number];

export function TripsTab() {
  const auth = useAuth();
  const userId = auth.status === "authenticated" ? auth.user.id : "";
  const { data: tickets, isLoading } = useUserTickets(userId);

  if (auth.status !== "authenticated" || isLoading) {
    return <TripsTabSkeleton />;
  }

  const activeTickets = tickets ?? [];
  const now = new Date();

  const upcomingTickets = activeTickets.filter(
    (t) => t.published_trips && new Date(t.published_trips.start_date) >= now
  );
  const pastTickets = activeTickets.filter(
    (t) => t.published_trips && new Date(t.published_trips.start_date) < now
  );

  const waiverCount = upcomingTickets.filter((t) => !t.waiver && !t.cancelled).length;

  return (
    <div className="space-y-8">
      {waiverCount > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-warning/10 border border-warning/20">
          <AlertTriangle className="h-5 w-5 text-warning shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              {waiverCount} trip{waiverCount > 1 ? "s" : ""} require
              {waiverCount === 1 ? "s" : ""} waiver signature
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Please sign the required waivers before your trip dates
            </p>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Upcoming Trips
        </h2>
        {upcomingTickets.length === 0 ? (
          <p className="text-muted-foreground">No upcoming trips</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingTickets.map((ticket) => (
              <TripCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        )}
      </div>

      {pastTickets.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Past Trips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pastTickets.map((ticket) => (
              <TripCard key={ticket.id} ticket={ticket} isPast />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TripCard({
  ticket,
  isPast,
}: {
  ticket: TicketWithTrip;
  isPast?: boolean;
}) {
  const trip = ticket.published_trips;
  if (!trip) return null;

  const waiverRequired = !ticket.waiver && !isPast && !ticket.cancelled;
  const isDriver = ticket.type === "driver";
  const isCancelled = ticket.cancelled;
  const isRefunded = ticket.refunded;
  const isConfirmed = ticket.waiver && !ticket.cancelled;

  return (
    <Card className="bg-card border-border overflow-hidden group hover:border-muted-foreground/30 transition-colors pt-0">
      <Link href={`/trip/${trip.id}`} className="aspect-12/9 relative h-60 w-full md:w-auto">
        <Image
          src={trip.picture}
          alt={trip.name}
          className="size-full object-cover hover:opacity-80 transition-all"
          fill
        />
      </Link>
      <CardHeader className="space-y-2">
        <Link href={`/trip/${trip.id}`}>
          <h3 className="font-semibold text-foreground hover:underline hover:opacity-60 transition-all">{trip.name}</h3>
        </Link>
        <div className="flex flex-wrap gap-1">
          {isCancelled && (
            <Badge className="bg-destructive text-white hover:bg-destructive">
              Cancelled
            </Badge>
          )}
          {isConfirmed && (
            <Badge className="bg-green-600 text-white hover:bg-green-600">
              Confirmed
            </Badge>
          )}
					{isPast && !isCancelled && (
            <Badge className="bg-muted text-muted-foreground">Completed</Badge>
          )}
          {waiverRequired && (
            <Badge className="bg-warning text-warning-foreground hover:bg-warning">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Waiver Required
            </Badge>
          )}
					{isRefunded && (
            <Badge className="">
              Refunded
            </Badge>
          )}
          
        </div>
        {isDriver && (
          <Alert className="py-2">
            <Car className="h-4 w-4" />
            <AlertTitle className="text-sm font-medium">
              You are a driver for this trip
            </AlertTitle>
          </Alert>
        )}
        <div className="w-full flex flex-col gap-2">
          {waiverRequired && (
            <Button variant="outline" className="w-full justify-between">
              <div className="flex gap-2 items-center">
                <CircleAlert className="size-4" />
                Sign Waiver
              </div>
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 shrink-0" />
          <span>{trip.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 shrink-0" />
          <span>
            {trip.start_date === trip.end_date
              ? formatDate(trip.start_date)
              : `${formatDate(trip.start_date)} - ${formatDate(trip.end_date)}`}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 shrink-0" />
          <span>Meet: {trip.meet}</span>
        </div>
      </CardContent>
      {ticket.receipt_url && (
        <CardFooter>
          <Link
            href={ticket.receipt_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            View Receipt
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}

function TripsTabSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="pt-0">
              <Skeleton className="h-60 w-full" />
              <CardHeader>
                <Skeleton className="h-5 w-3/4" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
