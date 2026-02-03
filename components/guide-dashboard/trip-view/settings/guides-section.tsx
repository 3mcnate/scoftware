import { toast } from "sonner";
import {
  Loader2,
  Users,
  UserPlus,
  X,
} from "lucide-react";
import { useState } from "react";
import { useTrip, type TripData } from "@/data/client/trips/get-guide-trips";
import { useAddTripGuide } from "@/data/client/trips/use-add-trip-guide";
import { useRemoveTripGuide } from "@/data/client/trips/use-remove-trip-guide";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Item, ItemContent, ItemActions } from "@/components/ui/item";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GuideMultiSelect } from "@/components/guide-dashboard/guide-multi-select";
import { getAvatarUrl } from "@/data/client/storage/avatars";

export function GuidesSection({
  trip,
  currentUserId,
}: {
  trip: TripData;
  currentUserId: string;
}) {
  const { mutateAsync: addGuide, isPending: isAdding } = useAddTripGuide();
  const { mutateAsync: removeGuide, isPending: isRemoving } =
    useRemoveTripGuide();
		const {refetch: refetchTrip } = useTrip(trip.id);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedGuides, setSelectedGuides] = useState<string[]>([]);

  const existingGuideIds = trip.trip_guides.map((g) => g.profiles.id);

  const handleRemoveGuide = async (guideId: string) => {
    await removeGuide(
      { trip_id: trip.id, user_id: guideId },
      {
        onSuccess: async () => {
					await refetchTrip();
					toast.success("Guide removed")
				},
        onError: (err) => {
          toast.error("Failed to remove guide");
          console.error(err);
        },
      },
    );
  };

  const handleAddGuides = async () => {
    if (selectedGuides.length === 0) return;

    try {
      await Promise.all(
        selectedGuides.map((guideId) =>
          addGuide([{ trip_id: trip.id, user_id: guideId }]),
        ),
      );
      toast.success(
        `Added ${selectedGuides.length} guide${selectedGuides.length > 1 ? "s" : ""}`,
      );
      setSelectedGuides([]);
      setAddDialogOpen(false);
    } catch (err) {
      toast.error("Failed to add guides");
      console.error(err);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-base font-medium">Trip Guides</CardTitle>
        </div>
        <CardDescription>Manage guides assigned to this trip</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {trip.trip_guides.map((guide) => (
          <Item
            key={guide.profiles.id}
            variant="outline"
            size="sm"
            className="p-3"
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={getAvatarUrl(guide.profiles.avatar_path ?? "")}
                  alt={`${guide.profiles.first_name} ${guide.profiles.last_name}`}
                />
                <AvatarFallback>
                  {guide.profiles.first_name?.[0]}
                  {guide.profiles.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <ItemContent>
                <p className="font-medium">
                  {guide.profiles.first_name} {guide.profiles.last_name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {guide.profiles.email}
                </p>
              </ItemContent>
            </div>
            <ItemActions>
              {guide.profiles.id !== currentUserId && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-destructive h-8 w-8 p-0"
                      disabled={isRemoving}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove guide?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will remove {guide.profiles.first_name}{" "}
                        {guide.profiles.last_name} from this trip.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleRemoveGuide(guide.profiles.id)}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Remove
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </ItemActions>
          </Item>
        ))}

        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full bg-transparent">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Guide
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Guides</DialogTitle>
              <DialogDescription>
                Select guides to add to this trip
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <GuideMultiSelect
                values={selectedGuides}
                onValuesChange={setSelectedGuides}
                excludeUserIds={existingGuideIds}
                placeholder="Select guides to add"
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedGuides([]);
                  setAddDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddGuides}
                disabled={selectedGuides.length === 0 || isAdding}
              >
                {isAdding ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  `Add ${selectedGuides.length > 0 ? selectedGuides.length : ""} Guide${selectedGuides.length !== 1 ? "s" : ""}`
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
