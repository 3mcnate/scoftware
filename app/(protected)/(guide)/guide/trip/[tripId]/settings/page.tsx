"use client";

import { useParams, useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { z } from "zod/v4";
import { toast } from "sonner";
import { differenceInCalendarDays } from "date-fns";
import {
  Loader2,
  Settings,
  Users,
  ToggleLeft,
  Trash2,
  LogOut,
  UserPlus,
  X,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";

import { useTrip, type TripData } from "@/data/client/trips/get-guide-trips";
import { useUpdateTrip } from "@/data/client/trips/use-update-trip";
import { useDeleteTrip } from "@/data/client/trips/use-delete-trip";
import { useAddTripGuide } from "@/data/client/trips/use-add-trip-guide";
import { useRemoveTripGuide } from "@/data/client/trips/use-remove-trip-guide";
import { useAuth } from "@/hooks/use-auth";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
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
import { formatDateTimeLocal } from "@/utils/date-time";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTripCycleByDate, type TripCycle } from "@/data/client/trip-cycles/get-trip-cycle";
import { useUnsavedChangesPrompt } from "@/hooks/use-unsaved-changes-prompt";

export default function SettingsPage() {
  const params = useParams();
  const tripId = params.tripId as string;
  const { data: trip, isLoading } = useTrip(tripId);

  if (isLoading || !trip) {
    return <SettingsFormSkeleton />;
  }

  return <TripSettingsForm trip={trip} />;
}

function SettingsFormSkeleton() {
  return (
    <div className="space-y-8">
      {/* Basic Info Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48 mt-1" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <Skeleton className="h-10 w-24 ml-auto" />
        </CardContent>
      </Card>

      {/* Guides Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-56 mt-1" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
              <Skeleton className="h-8 w-8" />
            </div>
          ))}
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>

      {/* Signup Settings Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-64 mt-1" />
        </CardHeader>
        <CardContent className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="space-y-1">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-56" />
              </div>
              <Skeleton className="h-6 w-11 rounded-full" />
            </div>
          ))}
          <Skeleton className="h-10 w-24 ml-auto" />
        </CardContent>
      </Card>

      {/* Danger Zone Skeleton */}
      <Card className="border-destructive/50">
        <CardHeader>
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-4 w-48 mt-1" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-destructive/30 rounded-lg">
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-10 w-28" />
          </div>
          <div className="flex items-center justify-between p-4 border border-destructive/30 rounded-lg">
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-56" />
            </div>
            <Skeleton className="h-10 w-24" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TripSettingsForm({ trip }: { trip: TripData }) {
  const auth = useAuth();
  const userId = auth.status === "authenticated" ? auth.user.id : "";
  const { data: tripCycle, isLoading: isTripCycleLoading } = useTripCycleByDate(
    new Date(trip.start_date)
  );

  return (
    <div className="space-y-8">
      <BasicInfoSection trip={trip} />
      <SignupSettingsSection
        trip={trip}
        tripCycle={tripCycle ?? null}
        isTripCycleLoading={isTripCycleLoading}
      />
      <GuidesSection trip={trip} currentUserId={userId} />
      <DestructiveSection trip={trip} currentUserId={userId} />
    </div>
  );
}

// ============================================================================
// Section 1: Basic Info
// ============================================================================

const BasicInfoSchema = z
  .object({
    name: z.string().min(1, "Trip name is required"),
    start_date: z.string().min(1, "Start date is required"),
    end_date: z.string().min(1, "End date is required"),
    participant_spots: z.coerce.number().min(0, "Must be 0 or more"),
    driver_spots: z.coerce.number().min(0, "Must be 0 or more"),
  })
  .refine((data) => new Date(data.end_date) >= new Date(data.start_date), {
    message: "End date must be after start date",
    path: ["end_date"],
  });

type BasicInfoFormData = z.infer<typeof BasicInfoSchema>;

function BasicInfoSection({ trip }: { trip: TripData }) {
  const { mutateAsync: updateTrip, isPending } = useUpdateTrip();

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { isDirty },
  } = useForm<BasicInfoFormData>({
    resolver: standardSchemaResolver(BasicInfoSchema),
    defaultValues: {
      name: trip.name,
      start_date: formatDateTimeLocal(trip.start_date),
      end_date: formatDateTimeLocal(trip.end_date),
      participant_spots: trip.participant_spots,
      driver_spots: trip.driver_spots,
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const startDate = watch("start_date");
  const endDate = watch("end_date");
  const participantSpots = watch("participant_spots");
  const driverSpots = watch("driver_spots");

  const totalParticipants =
    (Number(participantSpots) || 0) + (Number(driverSpots) || 0);
  const totalGuides = trip.trip_guides.length;

  let durationLabel = "-";
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const nights = differenceInCalendarDays(end, start);
    durationLabel =
      nights === 0 ? "Day Trip" : `${nights} night${nights === 1 ? "" : "s"}`;
  }

  const onSubmit = async (data: BasicInfoFormData) => {
    await updateTrip(
      {
        id: trip.id,
        name: data.name,
        start_date: new Date(data.start_date).toISOString(),
        end_date: new Date(data.end_date).toISOString(),
        participant_spots: data.participant_spots,
        driver_spots: data.driver_spots,
      },
      {
        onSuccess: () => {
          toast.success("Trip info updated");
          reset(data);
        },
        onError: (err) => {
          toast.error("Failed to update trip info");
          console.error(err);
        },
      },
    );
  };

	useUnsavedChangesPrompt(isDirty);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-base font-medium">Basic Info</CardTitle>
        </div>
        <CardDescription>Update trip name, dates, and capacity</CardDescription>
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
                      placeholder="e.g. Grand Canyon Expedition"
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

            <div className="flex justify-end">
              <Button type="submit" disabled={isPending || !isDirty}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Helper: Date Override Field
// ============================================================================

function DateOverrideField({
  control,
  label,
  overrideFieldName,
  dateFieldName,
  isOverridden,
  defaultValue,
  forceOverride = false,
  onOverrideToggle,
}: {
  control: ReturnType<typeof useForm<SignupSettingsFormData>>["control"];
  label: string;
  overrideFieldName: keyof SignupSettingsFormData;
  dateFieldName: keyof SignupSettingsFormData;
  isOverridden: boolean;
  defaultValue?: string;
  forceOverride?: boolean;
  onOverrideToggle?: (checked: boolean, defaultVal?: string) => void;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 min-w-0">
        <FieldLabel className="text-sm">{label}</FieldLabel>
      </div>
      <div className="flex items-center gap-3">
        <Controller
          control={control}
          name={dateFieldName}
          render={({ field, fieldState: { error } }) => (
            <div className="flex flex-col">
              <Input
                {...field}
                value={field.value as string}
                type="datetime-local"
                disabled={!isOverridden && !forceOverride}
                className="w-52"
                aria-invalid={!!error}
              />
              {error && (
                <span className="text-xs text-destructive mt-1">
                  {error.message}
                </span>
              )}
            </div>
          )}
        />
        {!forceOverride && (
          <Controller
            control={control}
            name={overrideFieldName}
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <Switch
                  checked={field.value as boolean}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    onOverrideToggle?.(checked, defaultValue);
                  }}
                />
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  Override
                </span>
              </div>
            )}
          />
        )}
      </div>
    </div>
  );
}

function TripCycleSkeleton() {
  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-muted p-4 text-sm space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-4 w-36 flex-1" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-52" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// Section 2: Guides
// ============================================================================

function GuidesSection({
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

const SignupSettingsSchema = z.object({
  allow_signups: z.boolean(),
  enable_participant_waitlist: z.boolean(),
  enable_driver_waitlist: z.boolean(),
  require_access_code: z.boolean(),
  access_code: z.string().optional(),
  // Trip cycle date overrides
  override_publish_date: z.boolean(),
  publish_date: z.string().optional(),
  override_member_signup_date: z.boolean(),
  member_signup_date: z.string().optional(),
  override_nonmember_signup_date: z.boolean(),
  nonmember_signup_date: z.string().optional(),
  override_driver_signup_date: z.boolean(),
  driver_signup_date: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.override_publish_date && !data.publish_date) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Publish date is required when override is enabled",
      path: ["publish_date"],
    });
  }
  if (data.override_member_signup_date && !data.member_signup_date) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Member signup date is required when override is enabled",
      path: ["member_signup_date"],
    });
  }
  if (data.override_nonmember_signup_date && !data.nonmember_signup_date) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Non-member signup date is required when override is enabled",
      path: ["nonmember_signup_date"],
    });
  }
  if (data.override_driver_signup_date && !data.driver_signup_date) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Driver signup date is required when override is enabled",
      path: ["driver_signup_date"],
    });
  }
});

type SignupSettingsFormData = z.infer<typeof SignupSettingsSchema>;

function SignupSettingsSection({
  trip,
  tripCycle,
  isTripCycleLoading,
}: {
  trip: TripData;
  tripCycle: TripCycle | null;
  isTripCycleLoading: boolean;
}) {
  const { mutateAsync: updateTrip, isPending } = useUpdateTrip();

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { isDirty },
  } = useForm<SignupSettingsFormData>({
    resolver: standardSchemaResolver(SignupSettingsSchema),
    defaultValues: {
      allow_signups: trip.allow_signups,
      enable_participant_waitlist: trip.enable_participant_waitlist,
      enable_driver_waitlist: trip.enable_driver_waitlist,
      require_access_code: !!trip.access_code,
      access_code: trip.access_code ?? "",
      override_publish_date: !!trip.publish_date_override,
      publish_date: trip.publish_date_override
        ? formatDateTimeLocal(trip.publish_date_override)
        : tripCycle?.trips_published_at
          ? formatDateTimeLocal(tripCycle.trips_published_at)
          : "",
      override_member_signup_date: !!trip.member_ticket_drop_date_override,
      member_signup_date: trip.member_ticket_drop_date_override
        ? formatDateTimeLocal(trip.member_ticket_drop_date_override)
        : tripCycle?.member_signups_start_at
          ? formatDateTimeLocal(tripCycle.member_signups_start_at)
          : "",
      override_nonmember_signup_date: !!trip.nonmember_ticket_drop_date_override,
      nonmember_signup_date: trip.nonmember_ticket_drop_date_override
        ? formatDateTimeLocal(trip.nonmember_ticket_drop_date_override)
        : tripCycle?.nonmember_signups_start_at
          ? formatDateTimeLocal(tripCycle.nonmember_signups_start_at)
          : "",
      override_driver_signup_date: !!trip.driver_ticket_drop_date_override,
      driver_signup_date: trip.driver_ticket_drop_date_override
        ? formatDateTimeLocal(trip.driver_ticket_drop_date_override)
        : tripCycle?.driver_signups_start_at
          ? formatDateTimeLocal(tripCycle.driver_signups_start_at)
          : "",
    },
  });

  /* eslint-disable react-hooks/incompatible-library */
  const requireAccessCode = watch("require_access_code");
  const overridePublishDate = watch("override_publish_date");
  const overrideMemberSignupDate = watch("override_member_signup_date");
  const overrideNonmemberSignupDate = watch("override_nonmember_signup_date");
  const overrideDriverSignupDate = watch("override_driver_signup_date");
  /* eslint-enable react-hooks/incompatible-library */

  const handleDateOverrideToggle = (
    dateFieldName: keyof SignupSettingsFormData,
    checked: boolean,
    defaultVal?: string
  ) => {
    if (!checked && defaultVal) {
      setValue(dateFieldName, formatDateTimeLocal(defaultVal), { shouldDirty: true });
    }
  };

  const onSubmit = async (data: SignupSettingsFormData) => {
    await updateTrip(
      {
        id: trip.id,
        allow_signups: data.allow_signups,
        enable_participant_waitlist: data.enable_participant_waitlist,
        enable_driver_waitlist: data.enable_driver_waitlist,
        access_code: data.require_access_code ? data.access_code || null : null,
        publish_date_override: data.override_publish_date && data.publish_date
          ? new Date(data.publish_date).toISOString()
          : null,
        member_ticket_drop_date_override: data.override_member_signup_date && data.member_signup_date
          ? new Date(data.member_signup_date).toISOString()
          : null,
        nonmember_ticket_drop_date_override: data.override_nonmember_signup_date && data.nonmember_signup_date
          ? new Date(data.nonmember_signup_date).toISOString()
          : null,
        driver_ticket_drop_date_override: data.override_driver_signup_date && data.driver_signup_date
          ? new Date(data.driver_signup_date).toISOString()
          : null,
      },
      {
        onSuccess: () => {
          toast.success("Signup settings updated");
          reset(data);
        },
        onError: (err) => {
          toast.error("Failed to update signup settings");
          console.error(err);
        },
      },
    );
  };

	useUnsavedChangesPrompt(isDirty);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <ToggleLeft className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-base font-medium">
            Signup Settings
          </CardTitle>
        </div>
        <CardDescription>
          Configure how participants can sign up for this trip
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Controller
            control={control}
            name="allow_signups"
            render={({ field }) => (
              <div className="flex items-center justify-between gap-12">
                <div className="space-y-0.5">
                  <FieldLabel>Allow Signups</FieldLabel>
                  <p className="text-sm text-muted-foreground">
                    Enable or disable signups for this trip
                  </p>
                </div>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </div>
            )}
          />

          <Controller
            control={control}
            name="enable_participant_waitlist"
            render={({ field }) => (
              <div className="flex items-center justify-between gap-12">
                <div className="space-y-0.5">
                  <FieldLabel>Enable Participant Waitlist</FieldLabel>
                  <p className="text-sm text-muted-foreground">
                    When enabled, participants cannot sign up and may only join the waitlist, even if a spot is available. Participants can only sign up if you send them a signup link. The waitlist is enabled automatically when participant spots fill up.
                  </p>
                </div>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </div>
            )}
          />

          <Controller
            control={control}
            name="enable_driver_waitlist"
            render={({ field }) => (
              <div className="flex items-center justify-between gap-12">
                <div className="space-y-0.5">
                  <FieldLabel>Enable Driver Waitlist</FieldLabel>
                  <p className="text-sm text-muted-foreground">
                    When enabled, drivers cannot sign up and may only join the waitlist, even if a driver spot is available. Drivers can only sign up if you send them a signup link. The waitlist is enabled automatically when driver spots fill up.
                  </p>
                </div>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </div>
            )}
          />

          <Controller
            control={control}
            name="require_access_code"
            render={({ field }) => (
              <div className="flex items-center justify-between gap-12">
                <div className="space-y-0.5">
                  <FieldLabel>Require Signup Code</FieldLabel>
                  <p className="text-sm text-muted-foreground">
                    Participants and drivers must enter a code to sign up
                  </p>
                </div>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </div>
            )}
          />

          {requireAccessCode && (
            <Field>
              <FieldLabel htmlFor="access_code">Signup Code</FieldLabel>
              <Controller
                control={control}
                name="access_code"
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Input
                      {...field}
                      id="access_code"
                      placeholder="Enter a signup code"
                      aria-invalid={!!error}
                    />
                    <FieldError errors={error ? [error] : undefined} />
                    <FieldDescription>
                      Share this code with participants who should be able to
                      sign up
                    </FieldDescription>
                  </>
                )}
              />
            </Field>
          )}

          <Separator className="my-6" />

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">Trip Cycle Dates</h3>
            </div>

            {isTripCycleLoading ? (
              <TripCycleSkeleton />
            ) : tripCycle ? (
              <div className="space-y-4">
                <div className="rounded-lg bg-muted p-4 text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Trip Cycle:</span>
                    <span className="font-medium">{tripCycle.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cycle Period:</span>
                    <span className="font-medium">
                      {new Date(tripCycle.starts_at).toLocaleDateString()} -{" "}
                      {new Date(tripCycle.ends_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <DateOverrideField
                  control={control}
                  label="Publish Date"
                  overrideFieldName="override_publish_date"
                  dateFieldName="publish_date"
                  isOverridden={overridePublishDate}
                  defaultValue={tripCycle.trips_published_at}
                  onOverrideToggle={(checked, defaultVal) =>
                    handleDateOverrideToggle("publish_date", checked, defaultVal)
                  }
                />

                <DateOverrideField
                  control={control}
                  label="Member Signup Date"
                  overrideFieldName="override_member_signup_date"
                  dateFieldName="member_signup_date"
                  isOverridden={overrideMemberSignupDate}
                  defaultValue={tripCycle.member_signups_start_at}
                  onOverrideToggle={(checked, defaultVal) =>
                    handleDateOverrideToggle("member_signup_date", checked, defaultVal)
                  }
                />

                <DateOverrideField
                  control={control}
                  label="Non-Member Signup Date"
                  overrideFieldName="override_nonmember_signup_date"
                  dateFieldName="nonmember_signup_date"
                  isOverridden={overrideNonmemberSignupDate}
                  defaultValue={tripCycle.nonmember_signups_start_at}
                  onOverrideToggle={(checked, defaultVal) =>
                    handleDateOverrideToggle("nonmember_signup_date", checked, defaultVal)
                  }
                />

                <DateOverrideField
                  control={control}
                  label="Driver Signup Date"
                  overrideFieldName="override_driver_signup_date"
                  dateFieldName="driver_signup_date"
                  isOverridden={overrideDriverSignupDate}
                  defaultValue={tripCycle.driver_signups_start_at}
                  onOverrideToggle={(checked, defaultVal) =>
                    handleDateOverrideToggle("driver_signup_date", checked, defaultVal)
                  }
                />
              </div>
            ) : (
              <div className="space-y-4">
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>No Trip Cycle Found</AlertTitle>
                  <AlertDescription>
                    This trip&apos;s start date does not fall within any trip cycle. Please enter all dates manually below, otherwise the trip won&apos;t be published and participants won&apos;t be able to sign up.
                  </AlertDescription>
                </Alert>

                <DateOverrideField
                  control={control}
                  label="Publish Date"
                  overrideFieldName="override_publish_date"
                  dateFieldName="publish_date"
                  isOverridden={true}
                  forceOverride
                />

                <DateOverrideField
                  control={control}
                  label="Member Signup Date"
                  overrideFieldName="override_member_signup_date"
                  dateFieldName="member_signup_date"
                  isOverridden={true}
                  forceOverride
                />

                <DateOverrideField
                  control={control}
                  label="Non-Member Signup Date"
                  overrideFieldName="override_nonmember_signup_date"
                  dateFieldName="nonmember_signup_date"
                  isOverridden={true}
                  forceOverride
                />

                <DateOverrideField
                  control={control}
                  label="Driver Signup Date"
                  overrideFieldName="override_driver_signup_date"
                  dateFieldName="driver_signup_date"
                  isOverridden={true}
                  forceOverride
                />
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isPending || !isDirty}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Settings"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function DestructiveSection({
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
          <CardTitle className="text-base font-medium ">
            Danger Zone
          </CardTitle>
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
