"use client";

import { useGuideTrips } from "@/data/client/trips/get-guide-trips";
import { getAvatarUrl } from "@/data/client/storage/avatars";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Car, TentTree } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getTripPictureUrl } from "@/utils/storage";
import { formatDate } from "@/utils/date-time";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EllipsisVertical } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useDeleteTrip } from "@/data/client/trips/use-delete-trip";
import { useState } from "react";
import { toast } from "sonner";

type GuideTripsData = NonNullable<
  ReturnType<typeof useGuideTrips>["data"]
>[number];
type TripData = NonNullable<GuideTripsData["trips"]>;

type Guide = {
  user_id: string;
  profiles: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_path: string | null;
  } | null;
};

function getInitials(
  firstName?: string | null,
  lastName?: string | null
): string {
  const first = firstName?.charAt(0)?.toUpperCase() ?? "";
  const last = lastName?.charAt(0)?.toUpperCase() ?? "";
  return first + last || "?";
}

export function getStatusBadge(signupStatus: string | null, isPast: boolean) {
  if (isPast) {
    return <Badge variant="secondary">Completed</Badge>;
  }

  switch (signupStatus) {
    case "open":
      return <Badge className="bg-green-500/20 text-green-700">Open</Badge>;
    case "closed":
      return <Badge variant="secondary">Closed</Badge>;
    case "full":
      return <Badge variant="destructive">Full</Badge>;
    case "waitlist":
      return (
        <Badge className="bg-yellow-500/20 text-yellow-700">Waitlist</Badge>
      );
    case "access_code":
      return (
        <Badge className="bg-blue-500/20 text-blue-700">Access Code</Badge>
      );
    case "select_participants":
      return (
        <Badge className="bg-purple-500/20 text-purple-700">
          Select Participants
        </Badge>
      );
    default:
      return <Badge variant="outline">{signupStatus}</Badge>;
  }
}

function TripRow({ trip, isPast }: { trip: TripData; isPast?: boolean }) {
  const router = useRouter();
  const auth = useAuth();
  const deleteTrip = useDeleteTrip();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const guides: Guide[] = trip.trip_guides ?? [];
  const activeTickets = trip.tickets?.filter((t) => !t.cancelled) ?? [];
  const participantCount = activeTickets.filter(
    (t) => t.type === "member" || t.type === "nonmember"
  ).length;
  const driverCount = activeTickets.filter((t) => t.type === "driver").length;

  const participantSpots = trip.participant_spots;
  const driverSpots = trip.driver_spots;

  const participantPercent =
    participantSpots > 0
      ? Math.min((participantCount / participantSpots) * 100, 100)
      : 0;
  const driverPercent =
    driverSpots > 0 ? Math.min((driverCount / driverSpots) * 100, 100) : 0;

  const hasTickets = (trip.tickets?.length ?? 0) > 0;
  const isGuide =
    auth.status === "authenticated" &&
    trip.trip_guides?.some((g) => g.user_id === auth.user.id);
  const isAdmin =
    auth.status === "authenticated" && auth.claims.app_role === "admin";
  const canDelete = (isAdmin || isGuide) && !hasTickets;

  const handleDelete = async () => {
    try {
      await deleteTrip.mutateAsync({ id: trip.id });
      toast.success("Trip deleted successfully");
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast.error("Failed to delete trip");
      console.error(error);
    }
  };

  return (
    <TableRow
      className="group cursor-pointer"
      onClick={() => router.push(`/guide/trip/${trip.id}/signups`)}
    >
      <TableCell className="w-[120px] p-2.5">
        <Link href={`/guide/trip/${trip.id}`}>
          {trip.picture_path ? (
            <div className="relative h-16 w-28 rounded-md overflow-hidden">
              <Image
                src={getTripPictureUrl(trip.picture_path)}
                alt={trip.name}
                fill
                className="object-cover group-hover:opacity-80 transition-opacity"
              />
            </div>
          ) : (
            <div className="flex h-16 w-28 rounded-md overflow-hidden bg-muted group-hover:opacity-80">
              <TentTree className="m-auto size-5 text-muted-foreground" />
            </div>
          )}
        </Link>
      </TableCell>
      <TableCell className="max-w-[300px]">
        <Link
          href={`/guide/trip/${trip.id}`}
          className="font-medium hover:underline"
        >
          {trip.name}
        </Link>
      </TableCell>
      <TableCell>
        <div className="flex flex-col text-sm">
          <span>{formatDate(trip.start_date)}</span>
          {new Date(trip.end_date).toLocaleDateString() !==
            new Date(trip.start_date).toLocaleDateString() && (
            <span className="text-muted-foreground text-xs">
              to {formatDate(trip.end_date)}
            </span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-1">
          {guides.map((guide) => {
            const profile = guide.profiles;
            if (!profile) return null;
            const fullName =
              `${profile.first_name} ${profile.last_name}`.trim();
            return (
              <div key={guide.user_id} className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  {profile.avatar_path && (
                    <AvatarImage
                      src={getAvatarUrl(profile.avatar_path)}
                      alt={fullName}
                    />
                  )}
                  <AvatarFallback className="text-xs">
                    {getInitials(profile.first_name, profile.last_name)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{fullName}</span>
              </div>
            );
          })}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-2 min-w-[140px]">
          <div className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5 text-muted-foreground" />
            <Progress value={participantPercent} className="h-2 flex-1" />
            <span className="text-xs text-muted-foreground w-12">
              {participantCount}/{participantSpots}
            </span>
          </div>
          {driverSpots > 0 && (
            <div className="flex items-center gap-2">
              <Car className="h-3.5 w-3.5 text-muted-foreground" />
              <Progress value={driverPercent} className="h-2 flex-1" />
              <span className="text-xs text-muted-foreground w-12">
                {driverCount}/{driverSpots}
              </span>
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        {getStatusBadge(trip.signup_status ?? null, !!isPast)}
      </TableCell>
      <TableCell onClick={(e) => e.stopPropagation()}>
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <EllipsisVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                disabled={!canDelete}
                onClick={() => setIsDeleteDialogOpen(true)}
                className="text-destructive focus:text-destructive"
              >
                Delete Trip
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
              <DialogDescription>
                This can&apos;t be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteTrip.isPending}
              >
                {deleteTrip.isPending ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
}

export function TripsTableSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-32" />
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Picture</TableHead>
              <TableHead>Trip Name</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Guides</TableHead>
              <TableHead>Signups</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3].map((i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-16 w-28 rounded-md" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-36" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-8 rounded-full" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export function TripsTable({
  trips,
  isPast,
}: {
  trips: TripData[];
  isPast?: boolean;
}) {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Picture</TableHead>
            <TableHead>Trip Name</TableHead>
            <TableHead>Dates</TableHead>
            <TableHead>Guides</TableHead>
            <TableHead>Signups</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trips.map((trip) => (
            <TripRow key={trip.id} trip={trip} isPast={isPast} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export type { TripData };
