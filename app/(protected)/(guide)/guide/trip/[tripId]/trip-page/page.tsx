"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { z } from "zod/v4";
import { toast } from "sonner";
import {
  ImagePlus,
  X,
  Plus,
  Save,
  Loader2,
  Camera,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { useTrip } from "@/data/client/trips/get-guide-trips";
import { useUpdateTrip } from "@/data/client/trips/use-update-trip";
import {
  uploadTripPicture,
  deleteTripPicture,
  getTripPictureUrl,
} from "@/data/client/storage/trip-pictures";
import { useUnsavedChangesPrompt } from "@/hooks/use-unsaved-changes-prompt";
import { format } from "date-fns";

const TripPageSchema = z.object({
  start_date: z.string().optional(),
  meet: z.string().optional(),
  trail: z.string().optional(),
  activity: z.string().optional(),
  native_land: z.string().optional(),
  prior_experience: z.string().optional(),
  description: z.string().optional(),
  what_to_bring: z.string().optional(),
});

type TripPageFormData = z.infer<typeof TripPageSchema>;

export default function TripPageTab() {
  const params = useParams();
  const tripId = params.tripId as string;

  const { data: trip, isLoading } = useTrip(tripId);
  const { mutateAsync: updateTrip, isPending: isSaving } = useUpdateTrip();

  const [packingItems, setPackingItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    control,
    handleSubmit,
    formState: { isDirty },
    reset,
    setValue,
  } = useForm<TripPageFormData>({
    resolver: standardSchemaResolver(TripPageSchema),
    defaultValues: {
      start_date: "",
      meet: "",
      trail: "",
      activity: "",
      native_land: "",
      prior_experience: "",
      description: "",
      what_to_bring: "",
    },
  });

  // Sync form with data when loaded
  useEffect(() => {
    if (trip) {
      reset({
        start_date: trip.start_date
          ? new Date(trip.start_date).toISOString().slice(0, 16)
          : "",
        meet: trip.meet ?? "",
        trail: trip.trail ?? "",
        activity: trip.activity ?? "",
        native_land: trip.native_land ?? "",
        prior_experience: trip.prior_experience ?? "",
        description: trip.description ?? "",
        what_to_bring: trip.what_to_bring ?? "",
      });

      if (trip.what_to_bring) {
        setPackingItems(
          trip.what_to_bring
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean)
        );
      } else {
        setPackingItems([]);
      }
    }
  }, [trip, reset]);

  useUnsavedChangesPrompt(isDirty);

  const addPackingItem = () => {
    if (newItem.trim()) {
      const newItems = [...packingItems, newItem.trim()];
      setPackingItems(newItems);
      setValue("what_to_bring", newItems.join("\n"), { shouldDirty: true });
      setNewItem("");
    }
  };

  const removePackingItem = (index: number) => {
    const newItems = packingItems.filter((_, i) => i !== index);
    setPackingItems(newItems);
    setValue("what_to_bring", newItems.join("\n"), { shouldDirty: true });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !tripId) return;

    if (file.size > 5000000) {
      toast.error("File too large (limit 5 MB)");
      return;
    }

    setIsUploading(true);
    try {
      const oldPath = trip?.picture_path;

      const path = await uploadTripPicture(tripId, file);
      await updateTrip({
        id: tripId,
        picture_path: path,
      });

      if (oldPath && oldPath !== path) {
        // Optional: delete old image if it's different and not used elsewhere
        // await deleteTripPicture(oldPath)
      }

      toast.success("Trip picture updated");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to upload image"
      );
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = async () => {
    if (!tripId || !trip?.picture_path) return;

    setIsUploading(true);
    try {
      await Promise.all([
        deleteTripPicture(trip.picture_path),
        updateTrip({ id: tripId, picture_path: null }),
      ]);
      toast.success("Trip picture removed");
    } catch {
      toast.error("Failed to remove trip picture");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: TripPageFormData) => {
    if (!tripId) return;

    try {
      await updateTrip({
        id: tripId,
        ...data,
        start_date: data.start_date
          ? new Date(data.start_date).toISOString()
          : trip?.start_date ?? "", // Fallback to existing if empty? Or allow clearing?
      });
      toast.success("Trip details saved successfully");
      reset(data);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save trip details"
      );
    }
  };

  if (isLoading) {
    return <TripPageTabSkeleton />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Trip Picture */}
      <Card>
        <CardHeader>
          <CardTitle>Trip Picture</CardTitle>
          <CardDescription>
            Upload a photo to be displayed on the trip page
          </CardDescription>
        </CardHeader>
        <CardContent>
          {trip?.picture_path ? (
            <div className="relative rounded-lg overflow-hidden aspect-video w-full max-w-2xl mx-auto border border-border">
              <img
                src={getTripPictureUrl(trip.picture_path)}
                alt="Trip"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Change
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleRemoveImage}
                  disabled={isUploading}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div
              className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImagePlus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag and drop an image, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Recommended: 1200x630px, JPG or PNG
              </p>
              <Button
                type="button"
                variant="outline"
                className="mt-4 bg-transparent"
                disabled={isUploading}
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Upload Image
              </Button>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
            disabled={isUploading}
          />
        </CardContent>
      </Card>

      {/* Trip Details */}
      <Card>
        <CardHeader>
          <CardTitle>Trip Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field>
              <Label htmlFor="start_date">Meeting Time</Label>
              <Controller
                control={control}
                name="start_date"
                render={({ field }) => (
                  <Input
                    id="start_date"
                    type="datetime-local"
                    {...field}
                    value={field.value ?? ""}
                  />
                )}
              />
            </Field>
            <Field>
              <Label htmlFor="meet">Meeting Place</Label>
              <Controller
                control={control}
                name="meet"
                render={({ field }) => (
                  <Input
                    id="meet"
                    placeholder="e.g., Student Union Building"
                    {...field}
                    value={field.value ?? ""}
                  />
                )}
              />
            </Field>
            <Field>
              <Label htmlFor="trail">Trail Length</Label>
              <Controller
                control={control}
                name="trail"
                render={({ field }) => (
                  <Input
                    id="trail"
                    placeholder="e.g., 8 miles round trip"
                    {...field}
                    value={field.value ?? ""}
                  />
                )}
              />
            </Field>
            <Field>
              <Label htmlFor="activity">Activities</Label>
              <Controller
                control={control}
                name="activity"
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select activities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hiking">Hiking</SelectItem>
                      <SelectItem value="backpacking">Backpacking</SelectItem>
                      <SelectItem value="camping">Camping</SelectItem>
                      <SelectItem value="climbing">Rock Climbing</SelectItem>
                      <SelectItem value="kayaking">Kayaking</SelectItem>
                      <SelectItem value="skiing">Skiing</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
            <Field>
              <Label htmlFor="native_land">Native Land</Label>
              <Controller
                control={control}
                name="native_land"
                render={({ field }) => (
                  <Input
                    id="native_land"
                    placeholder="e.g., Havasupai and Hualapai territories"
                    {...field}
                    value={field.value ?? ""}
                  />
                )}
              />
            </Field>
            <Field>
              <Label htmlFor="prior_experience">
                Recommended Prior Experience
              </Label>
              <Controller
                control={control}
                name="prior_experience"
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">
                        None - Beginner friendly
                      </SelectItem>
                      <SelectItem value="some">
                        Some outdoor experience
                      </SelectItem>
                      <SelectItem value="moderate">
                        Moderate experience required
                      </SelectItem>
                      <SelectItem value="advanced">
                        Advanced experience required
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
          </div>
        </CardContent>
      </Card>

      {/* Trip Description */}
      <Card>
        <CardHeader>
          <CardTitle>Trip Description</CardTitle>
        </CardHeader>
        <CardContent>
          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <Textarea
                placeholder="Describe the trip, what participants can expect, highlights, and any important information..."
                className="min-h-[200px]"
                {...field}
                value={field.value ?? ""}
              />
            )}
          />
          <p className="text-xs text-muted-foreground mt-2">
            Markdown formatting is supported
          </p>
        </CardContent>
      </Card>

      {/* Packing List */}
      <Card>
        <CardHeader>
          <CardTitle>Packing List</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {packingItems.map((item, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="px-3 py-1 text-sm flex items-center gap-2"
              >
                {item}
                <button
                  type="button"
                  onClick={() => removePackingItem(index)}
                  className="hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add packing item..."
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addPackingItem();
                }
              }}
            />
            <Button
              type="button"
              onClick={addPackingItem}
              variant="outline"
              className="bg-transparent"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isSaving || !isDirty}>
          {isSaving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}

function TripPageTabSkeleton() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-48 w-full rounded-lg" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
