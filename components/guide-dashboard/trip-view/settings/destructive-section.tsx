import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2, LogOut } from "lucide-react";

import { type TripData } from "@/data/client/trips/get-guide-trips";
import { useDeleteTrip } from "@/data/client/trips/use-delete-trip";
import { useRemoveTripGuide } from "@/data/client/trips/use-remove-trip-guide";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function DestructiveSection({
  trip,
  currentUserId,
}: {
  trip: TripData;
  currentUserId: string;
}) {
  const router = useRouter();
  const { mutateAsync: removeGuide, isPending: isLeaving } =
    useRemoveTripGuide();
  const { mutateAsync: deleteTrip, isPending: isDeleting } = useDeleteTrip();

  const handleLeaveTrip = async () => {
    await removeGuide(
      { trip_id: trip.id, user_id: currentUserId },
      {
        onSuccess: () => {
          toast.success("You have left the trip");
          router.push("/guide");
        },
        onError: (err) => {
          toast.error("Failed to leave trip");
          console.error(err);
        },
      },
    );
  };

  const handleDeleteTrip = async () => {
    await deleteTrip(
      { id: trip.id },
      {
        onSuccess: () => {
          toast.success("Trip deleted");
          router.push("/guide");
        },
        onError: (err) => {
          toast.error("Failed to delete trip");
          console.error(err);
        },
      },
    );
  };

  const isOnlyGuide = trip.trip_guides.length === 1;

  return (
    <Card className="">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Trash2 className="h-4 w-4 " />
          <CardTitle className="text-base font-medium ">Danger Zone</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-destructive/30 rounded-lg">
          <div>
            <p className="font-medium">Leave Trip</p>
            <p className="text-sm text-muted-foreground">
              Remove yourself from this trip
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" disabled={isOnlyGuide || isLeaving}>
                <LogOut className="h-4 w-4 mr-2" />
                Leave Trip
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Leave this trip?</AlertDialogTitle>
                <AlertDialogDescription>
                  You will be removed as a guide from this trip. You can be
                  added back by another guide.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleLeaveTrip}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  Leave Trip
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="flex items-center justify-between p-4 border border-destructive/30 rounded-lg">
          <div>
            <p className="font-medium">Delete Trip</p>
            <p className="text-sm text-muted-foreground">
              Permanently delete this trip and all associated data
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Delete this trip permanently?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the trip, all signups, budget
                  data, and associated information. This action cannot be
                  undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteTrip}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  Delete Permanently
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {isOnlyGuide && (
          <p className="text-sm text-muted-foreground">
            You are the only guide on this trip. Add another guide before
            leaving.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
