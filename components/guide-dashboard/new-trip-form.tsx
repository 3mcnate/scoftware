"use client";

import { useForm, Controller, useWatch } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { z } from "zod/v4";
import { toast } from "sonner";
import { differenceInCalendarDays } from "date-fns";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGuides } from "@/data/client/users/get-guides";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select";
import { useAuth } from "@/hooks/use-auth";
import { useCreateTrip } from "@/features/trips/hooks/use-create-trip";
import { useRouter } from "next/navigation";
import { useGuideTrips } from "@/data/client/trips/get-guide-trips";

const NewTripSchema = z
  .object({
    name: z.string().min(1, "Trip name is required"),
    start_date: z.string().min(1, "Start date is required").refine(start_date => new Date(start_date) >= new Date(), "Start date must be in the future"),
    end_date: z.string().min(1, "End date is required"),
    participant_spots: z.coerce.number().min(0, "Must be 0 or more"),
    driver_spots: z.coerce.number().min(0, "Must be 0 or more"),
    guides: z.array(z.uuidv4()).min(1, "At least one guide is required"),
  })
  .refine((data) => new Date(data.end_date) >= new Date(data.start_date), {
    message: "End date must be after start date",
    path: ["end_date"],
  });

type NewTripFormData = z.infer<typeof NewTripSchema>;

export default function NewTripForm() {
  const { data: guidesData, isLoading: isLoadingGuides } = useGuides();
  const auth = useAuth();
  const userId = auth.status === "authenticated" ? auth.user.id : "unknown";
  const createTrip = useCreateTrip();
	const { refetch: refetchGuideTrips } = useGuideTrips(userId);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<NewTripFormData>({
    resolver: standardSchemaResolver(NewTripSchema),
    defaultValues: {
      name: "",
      start_date: "",
      end_date: "",
      participant_spots: 8,
      driver_spots: 0,
      guides: [],
    },
  });

  const watchedValues = useWatch({
    control,
    name: [
      "participant_spots",
      "driver_spots",
      "guides",
      "start_date",
      "end_date",
    ],
  });

  const participantSpots = Number(watchedValues[0]) || 0;
  const driverSpots = Number(watchedValues[1]) || 0;
  const selectedGuides = watchedValues[2] || [];
  const startDate = watchedValues[3];
  const endDate = watchedValues[4];

  const totalParticipants = participantSpots + driverSpots;
  const totalGuides = selectedGuides.length + 1;

  let durationLabel = "-";
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const nights = differenceInCalendarDays(end, start);

    if (nights === 0) {
      durationLabel = "Day Trip";
    } else {
      durationLabel = `${nights} night${nights === 1 ? "" : "s"}`;
    }
  }

  const onSubmit = async (data: NewTripFormData) => {
    try {
      const result = await createTrip.mutateAsync(data);
			await refetchGuideTrips();
      toast.success("Trip created successfully!");
      router.push(`/guide/trip/${result.tripId}`);
    } catch (error) {
      toast.error("Failed to create trip");
      console.error(error);
    }
  };

  const guides = guidesData ?? [];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Trip</CardTitle>
        <CardDescription>Everything here can be changed later</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Trip Name</FieldLabel>
              <Controller
                control={control}
                name="name"
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Input
                      {...field}
                      id="name"
                      placeholder="e.g. Marry Your Cousin in Alabama Hills"
                      aria-invalid={!!error}
                    />
                    <FieldError errors={error ? [error] : undefined} />
                  </>
                )}
              />
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="start_date">Start Date & Time</FieldLabel>
                <Controller
                  control={control}
                  name="start_date"
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Input
                        {...field}
                        id="start_date"
                        type="datetime-local"
                        aria-invalid={!!error}
                      />
                      <FieldError errors={error ? [error] : undefined} />
                    </>
                  )}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="end_date">End Date & Time</FieldLabel>
                <Controller
                  control={control}
                  name="end_date"
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Input
                        {...field}
                        id="end_date"
                        type="datetime-local"
                        aria-invalid={!!error}
                      />
                      <FieldError errors={error ? [error] : undefined} />
                      <FieldDescription>
                        End time can be approximate
                      </FieldDescription>
                    </>
                  )}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="participant_spots">
                  Participant Spots (Non-Drivers)
                </FieldLabel>
                <Controller
                  control={control}
                  name="participant_spots"
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Input
                        {...field}
                        id="participant_spots"
                        type="number"
                        min={0}
                        aria-invalid={!!error}
                      />
                      <FieldError errors={error ? [error] : undefined} />
                    </>
                  )}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="driver_spots">Driver Spots</FieldLabel>
                <Controller
                  control={control}
                  name="driver_spots"
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Input
                        {...field}
                        id="driver_spots"
                        type="number"
                        min={0}
                        aria-invalid={!!error}
                      />
                      <FieldError errors={error ? [error] : undefined} />
                    </>
                  )}
                />
              </Field>
            </div>

            <Field>
              <FieldLabel>Guides</FieldLabel>
              <Controller
                control={control}
                name="guides"
                render={({ field, fieldState: { error } }) => (
                  <>
                    <MultiSelect
                      values={field.value}
                      onValuesChange={field.onChange}
                    >
                      <MultiSelectTrigger className="w-full">
                        <MultiSelectValue placeholder="Select guides" />
                      </MultiSelectTrigger>
                      <MultiSelectContent>
                        {isLoadingGuides ? (
                          <div className="p-2 text-sm text-muted-foreground text-center">
                            Loading guides...
                          </div>
                        ) : (
                          guides
                            .filter((guide) => guide.user_id !== userId)
                            .map((guide) => (
                              <MultiSelectItem
                                key={guide.user_id}
                                value={guide.user_id}
                              >
                                {guide.profiles.first_name}{" "}
                                {guide.profiles.last_name}
                              </MultiSelectItem>
                            ))
                        )}
                      </MultiSelectContent>
                    </MultiSelect>
                    <FieldError errors={error ? [error] : undefined} />
                    <FieldDescription>
                      Invite other guides to the trip.
                    </FieldDescription>
                  </>
                )}
              />
            </Field>

            <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>Total People:</span>
                <span className="font-medium text-foreground">
                  {totalParticipants + totalGuides} ({totalParticipants}{" "}
                  participants, {totalGuides} guides)
                </span>
              </div>
              <div className="flex justify-between">
                <span>Duration:</span>
                <span className="font-medium text-foreground">
                  {durationLabel}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Button type="button" className="w-full" variant={"outline"} onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Trip...
                  </>
                ) : (
                  "Create Trip"
                )}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
