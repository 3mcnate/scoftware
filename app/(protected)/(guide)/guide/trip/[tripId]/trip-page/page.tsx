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
import { FormRichTextEditor } from "@/components/tiptap/form-rich-text-editor";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Field, FieldDescription, FieldError } from "@/components/ui/field";

import { useTrip, TripData } from "@/data/client/trips/get-guide-trips";
import { useUpdateTrip } from "@/data/client/trips/use-update-trip";
import {
  uploadTripPicture,
  deleteTripPicture,
  getTripPictureUrl,
} from "@/data/client/storage/trip-pictures";
import { useUnsavedChangesPrompt } from "@/hooks/use-unsaved-changes-prompt";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { DifficultyModal } from "@/components/public-trip-page/difficulty-modal";
import Link from "next/link";

const TripPageSchema = z.object({
  start_date: z.string().min(1, "Meeting time is required"),
  meet: z.string().min(1, "Meeting place is required"),
  return: z.string().min(1, "Return information is required"),
  activity: z.string().min(1, "Activity is required"),
  difficulty: z.string().min(1, "Difficulty is required"),
  trail: z.string().min(1, "Trail information is required"),
  prior_experience: z.string().min(1, "Prior experience level is required"),
  location: z.string().min(1, "Trip location is required"),
  native_land: z.string().min(1, "Native land information is required"),
  description: z.string().min(1, "Trip description is required"),
  what_to_bring: z.array(z.string()).min(1, "Packing list is required"),
});

type TripPageFormData = z.infer<typeof TripPageSchema>;

export default function TripPageTab() {
  const params = useParams();
  const tripId = params.tripId as string;

  const { data: trip, isLoading } = useTrip(tripId);

  if (isLoading) {
    return <TripPageTabSkeleton />;
  }

  if (!trip) {
    return null;
  }

  return <TripPageContent trip={trip} />;
}

function TripPageContent({ trip }: { trip: TripData }) {
  const { mutateAsync: updateTrip, isPending: isSaving } = useUpdateTrip();

  const initialPackingItems = trip.what_to_bring ?? [];

  const [packingItems, setPackingItems] =
    useState<string[]>(initialPackingItems);
  const [newItem, setNewItem] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (trip.picture_path) {
      setIsImageLoading(true);
    }
  }, [trip.picture_path]);

  const {
    control,
    handleSubmit,
    formState: { isDirty, errors },
    reset,
    setValue,
  } = useForm<TripPageFormData>({
    resolver: standardSchemaResolver(TripPageSchema),
    defaultValues: {
      start_date: trip.start_date
        ? new Date(trip.start_date).toISOString().slice(0, 16)
        : "",
      meet: trip.meet ?? "",
      return: trip.return ?? "",
      activity: trip.activity ?? "",
      difficulty: trip.difficulty ?? "",
      trail: trip.trail ?? "",
      prior_experience: trip.prior_experience ?? "",
      location: trip.location ?? "",
      native_land: trip.native_land ?? "",
      description: trip.description ?? "",
      what_to_bring: trip.what_to_bring ?? [],
    },
  });

  useUnsavedChangesPrompt(isDirty);

  const addPackingItem = () => {
    if (newItem.trim()) {
      const newItems = [...packingItems, newItem.trim()];
      setPackingItems(newItems);
      setValue("what_to_bring", newItems, { shouldDirty: true });
      setNewItem("");
    }
  };

  const removePackingItem = (index: number) => {
    const newItems = packingItems.filter((_, i) => i !== index);
    setPackingItems(newItems);
    setValue("what_to_bring", newItems, { shouldDirty: true });
  };

  const addOvernightPackingList = () => {
    const overnightItems = [
      "Sleeping bag",
      "Sleeping pad",
      "Mess kit (utensils and bowl/plate/tupperware)",
      "3+ liters of water",
      "Hat/sunscreen/sunglasses",
      "Comfortable hiking shoes",
      "Comfortable hiking clothes",
      "Toiletries/medications",
      "Headlamp/flashlight",
      "Warm clothes for night/sleeping",
    ];
    const newItems = [...packingItems, ...overnightItems];
    setPackingItems(newItems);
    setValue("what_to_bring", newItems, { shouldDirty: true });
  };

  const addDayTripPackingList = () => {
    const dayTripItems = [
      "3+ liters of water",
      "Hat/sunscreen/sunglasses",
      "Comfortable hiking shoes",
      "Comfortable hiking clothes",
    ];
    const newItems = [...packingItems, ...dayTripItems];
    setPackingItems(newItems);
    setValue("what_to_bring", newItems, { shouldDirty: true });
  };

  const clearPackingList = () => {
    setPackingItems([]);
    setValue("what_to_bring", [], { shouldDirty: true });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !trip.id) return;

    if (file.size > 10000000) {
      toast.error("File too large (limit 10 MB)");
      return;
    }

    setIsUploading(true);
		setIsImageLoading(true);
    try {
      const path = await uploadTripPicture(trip.id, file);
      await updateTrip({
        id: trip.id,
        picture_path: path,
      });

      toast.success("Trip picture updated");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to upload image",
      );
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = async () => {
    if (!trip.picture_path) return;

    setIsUploading(true);
    try {
      await Promise.all([
        deleteTripPicture(trip.picture_path),
        updateTrip({ id: trip.id, picture_path: null }),
      ]);
      toast.success("Trip picture removed");
    } catch {
      toast.error("Failed to remove trip picture");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: TripPageFormData) => {
    try {
      await updateTrip({
        id: trip.id,
        meet: data.meet,
        return: data.return,
        activity: data.activity,
        difficulty: data.difficulty,
        trail: data.trail,
        prior_experience: data.prior_experience,
        location: data.location,
        native_land: data.native_land,
        description: data.description,
        what_to_bring: data.what_to_bring,
      });
      toast.success("Trip details saved successfully");
      reset(data);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save trip details",
      );
    }
  };

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
          {trip.picture_path ? (
            <div className="relative rounded-lg overflow-hidden aspect-video w-full max-w-2xl mx-auto border border-border">
              {isImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              )}
              <Image
                src={getTripPictureUrl(trip.picture_path)}
                alt="Trip"
                className={cn(
                  "w-full h-full object-cover transition-opacity",
                  isImageLoading ? "opacity-0" : "opacity-100"
                )}
                fill
                onLoad={() => setIsImageLoading(false)}
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
              <Label htmlFor="meet">Meeting Place</Label>
              <Controller
                control={control}
                name="meet"
                render={({ field }) => (
                  <Input
                    id="meet"
                    placeholder="e.g. Village fountain on Saturday 2/7 at 7am"
                    {...field}
                    value={field.value ?? ""}
                  />
                )}
              />{" "}
              <FieldError>{errors.meet?.message}</FieldError>{" "}
            </Field>
            <Field>
              <Label htmlFor="return">Return</Label>
              <Controller
                control={control}
                name="return"
                render={({ field }) => (
                  <Input
                    id="return"
                    placeholder="e.g. Sunday 2/8 3pm"
                    {...field}
                    value={field.value ?? ""}
                  />
                )}
              />{" "}
              <FieldError>{errors.return?.message}</FieldError>{" "}
            </Field>
            <Field>
              <Label htmlFor="activity">Activity</Label>
              <Controller
                control={control}
                name="activity"
                render={({ field }) => (
                  <Input
                    id="activity"
                    placeholder="e.g. hiking, camping, chilling"
                    {...field}
                    value={field.value ?? ""}
                  />
                )}
              />
              <FieldError>{errors.activity?.message}</FieldError>
            </Field>
            <Field>
              <Label htmlFor="difficulty">Difficulty</Label>
              <Controller
                control={control}
                name="difficulty"
                render={({ field }) => (
                  <Input
                    id="difficulty"
                    placeholder="x/10 easy/medium/hard"
                    {...field}
                    value={field.value ?? ""}
                  />
                )}
              />
              <FieldDescription>
                <DifficultyModal />
              </FieldDescription>
              <FieldError>{errors.difficulty?.message}</FieldError>
            </Field>
            <Field>
              <Label htmlFor="trail">Trail</Label>
              <Controller
                control={control}
                name="trail"
                render={({ field }) => (
                  <Input
                    id="trail"
                    placeholder="8 miles/12.8 km, 1400 ft/426 m"
                    {...field}
                    value={field.value ?? ""}
                  />
                )}
              />
              <FieldDescription>
                Put distance in miles/kms and elevation gain in feet/meters
              </FieldDescription>
              <FieldError>{errors.trail?.message}</FieldError>
            </Field>
            <Field>
              <Label htmlFor="prior_experience">
                Recommended Prior Experience
              </Label>
              <Controller
                control={control}
                name="prior_experience"
                render={({ field }) => (
                  <Input
                    id="prior_experience"
                    placeholder="e.g. some hiking experience required"
                    {...field}
                    value={field.value ?? ""}
                  />
                )}
              />
              <FieldError>{errors.prior_experience?.message}</FieldError>
            </Field>
            <Field>
              <Label htmlFor="location">Location of Trip</Label>
              <Controller
                control={control}
                name="location"
                render={({ field }) => (
                  <Input
                    id="location"
                    placeholder="e.g. Grand Canyon National Park"
                    {...field}
                    value={field.value ?? ""}
                  />
                )}
              />
              <FieldError>{errors.location?.message}</FieldError>
            </Field>
            <Field>
              <Label htmlFor="native_land">Native Land</Label>
              <Controller
                control={control}
                name="native_land"
                render={({ field }) => (
                  <Input
                    id="native_land"
                    placeholder="e.g. Chumash"
                    {...field}
                    value={field.value ?? ""}
                  />
                )}
              />
              <FieldDescription>
                Use{" "}
                <Link
                  href="https://native-land.ca/maps/native-land"
                  target="_blank"
                >
                  native-land.ca
                </Link>
              </FieldDescription>
              <FieldError>{errors.native_land?.message}</FieldError>
            </Field>
          </div>
        </CardContent>
      </Card>

      {/* Trip Description */}
      <div className="space-y-4">
        <h3 className="font-semibold">Trip Description</h3>
        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <FormRichTextEditor
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              placeholder=""
              minHeight="250px"
              tripId={trip.id}
            />
          )}
        />
        <FieldError>{errors.description?.message}</FieldError>
      </div>

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
              <Plus />
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              onClick={addOvernightPackingList}
              variant="outline"
              size="sm"
              className="bg-transparent"
            >
              <Plus /> Add Overnight List
            </Button>
            <Button
              type="button"
              onClick={addDayTripPackingList}
              variant="outline"
              size="sm"
              className="bg-transparent"
            >
              <Plus /> Add Day Trip List
            </Button>
            <Button
              type="button"
              onClick={clearPackingList}
              variant="outline"
              size="sm"
              className="bg-transparent"
            >
              <X /> Clear All
            </Button>
          </div>
          <FieldError>{errors.what_to_bring?.message}</FieldError>
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
            {[...Array(8)].map((_, i) => (
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
