import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { z } from "zod/v4";
import { toast } from "sonner";
import { Loader2, ToggleLeft, AlertTriangle, ChevronDown } from "lucide-react";
import { type TripData } from "@/data/client/trips/get-guide-trips";
import {
  useUpdateTrip,
  useUpdateTripSettings,
} from "@/data/client/trips/use-update-trip";
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
  FieldLabel,
} from "@/components/ui/field";
import { formatDateTimeLocal } from "@/utils/date-time";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { type TripCycle } from "@/data/client/trip-cycles/get-trip-cycle";
import { useUnsavedChangesPrompt } from "@/hooks/use-unsaved-changes-prompt";

const SignupSettingsSchema = z
  .object({
    allow_signups: z.boolean(),
    enable_participant_waitlist: z.boolean(),
    enable_driver_waitlist: z.boolean(),
    require_access_code: z.boolean(),
    access_code: z.string().optional(),
    override_publish_date: z.boolean(),
    publish_date: z.string().optional(),
    override_member_signup_date: z.boolean(),
    member_signup_date: z.string().optional(),
    override_nonmember_signup_date: z.boolean(),
    nonmember_signup_date: z.string().optional(),
    override_driver_signup_date: z.boolean(),
    driver_signup_date: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.require_access_code && !data.access_code) {
      ctx.addIssue({
        code: "custom",
        message: "Access code is required",
        path: ["access_code"],
      });
    }
    if (data.override_publish_date && !data.publish_date) {
      ctx.addIssue({
        code: "custom",
        message: "Publish date is required when override is enabled",
        path: ["publish_date"],
      });
    }
    if (data.override_member_signup_date && !data.member_signup_date) {
      ctx.addIssue({
        code: "custom",
        message: "Member signup date is required when override is enabled",
        path: ["member_signup_date"],
      });
    }
    if (data.override_nonmember_signup_date && !data.nonmember_signup_date) {
      ctx.addIssue({
        code: "custom",
        message: "Non-member signup date is required when override is enabled",
        path: ["nonmember_signup_date"],
      });
    }
    if (data.override_driver_signup_date && !data.driver_signup_date) {
      ctx.addIssue({
        code: "custom",
        message: "Driver signup date is required when override is enabled",
        path: ["driver_signup_date"],
      });
    }
  });

type SignupSettingsFormData = z.infer<typeof SignupSettingsSchema>;

export function SignupSettingsSection({
  trip,
  tripCycle,
}: {
  trip: TripData;
  tripCycle: TripCycle | null;
}) {
  const { mutateAsync: updateTrip, isPending: updateTripPending } =
    useUpdateTrip();
  const { mutateAsync: updateSettings, isPending: updateSettingsPending } =
    useUpdateTripSettings();

  const isPending = updateTripPending || updateSettingsPending;
  const [isTripCycleDatesOpen, setIsTripCycleDatesOpen] = useState(false);

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
      allow_signups: trip.trip_settings?.allow_signups,
      enable_participant_waitlist:
        trip.trip_settings?.enable_participant_waitlist,
      enable_driver_waitlist: trip.trip_settings?.enable_driver_waitlist,
      require_access_code: !!trip.access_code,
      access_code: trip.access_code ?? "",
      override_publish_date: !!trip.trip_settings?.publish_date_override,
      publish_date: trip.trip_settings?.publish_date_override
        ? formatDateTimeLocal(trip.trip_settings?.publish_date_override)
        : tripCycle?.trips_published_at
          ? formatDateTimeLocal(tripCycle.trips_published_at)
          : "",
      override_member_signup_date:
        !!trip.trip_settings?.member_signup_date_override,
      member_signup_date: trip.trip_settings?.member_signup_date_override
        ? formatDateTimeLocal(trip.trip_settings?.member_signup_date_override)
        : tripCycle?.member_signups_start_at
          ? formatDateTimeLocal(tripCycle.member_signups_start_at)
          : "",
      override_nonmember_signup_date:
        !!trip.trip_settings?.nonmember_signup_date_override,
      nonmember_signup_date: trip.trip_settings?.nonmember_signup_date_override
        ? formatDateTimeLocal(
            trip.trip_settings?.nonmember_signup_date_override,
          )
        : tripCycle?.nonmember_signups_start_at
          ? formatDateTimeLocal(tripCycle.nonmember_signups_start_at)
          : "",
      override_driver_signup_date:
        !!trip.trip_settings?.driver_signup_date_override,
      driver_signup_date: trip.trip_settings?.driver_signup_date_override
        ? formatDateTimeLocal(trip.trip_settings?.driver_signup_date_override)
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
    defaultVal?: string,
  ) => {
    if (!checked && defaultVal) {
      setValue(dateFieldName, formatDateTimeLocal(defaultVal), {
        shouldDirty: true,
      });
    }
  };

  const onSubmit = async (data: SignupSettingsFormData) => {
    console.log("submitting...", data);

    try {
      const updateSettingsQuery = updateSettings({
        trip_id: trip.id,
        allow_signups: data.allow_signups,
        enable_participant_waitlist: data.enable_participant_waitlist,
        enable_driver_waitlist: data.enable_driver_waitlist,
        member_signup_date_override:
          data.override_member_signup_date && data.member_signup_date
            ? new Date(data.member_signup_date).toISOString()
            : null,
        nonmember_signup_date_override:
          data.override_nonmember_signup_date && data.nonmember_signup_date
            ? new Date(data.nonmember_signup_date).toISOString()
            : null,
        driver_signup_date_override:
          data.override_driver_signup_date && data.driver_signup_date
            ? new Date(data.driver_signup_date).toISOString()
            : null,
        publish_date_override:
          data.override_publish_date && data.publish_date
            ? new Date(data.publish_date).toISOString()
            : null,
      });

      const updateTripQuery = updateTrip({
        id: trip.id,
        access_code: data.require_access_code ? data.access_code || null : null,
      });

      await Promise.all([updateSettingsQuery, updateTripQuery]);
      toast.success("Signup settings updated");
      reset(data);
    } catch (err) {
      toast.error("Failed to update signup settings");
      console.error(err);
    }
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
                    When enabled, participants cannot sign up and may only join
                    the waitlist, even if a spot is available. Participants can
                    only sign up if you send them a signup link. This waitlist
                    is enabled automatically when participant spots fill up.
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
                    When enabled, drivers cannot sign up and may only join the
                    waitlist, even if a driver spot is available. Drivers can
                    only sign up if you send them a signup link. This waitlist
                    is enabled automatically when driver spots fill up.
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

          <Collapsible
            open={isTripCycleDatesOpen}
            onOpenChange={setIsTripCycleDatesOpen}
          >
            <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 py-2 hover:bg-muted/50 rounded-md px-2 transition-colors">
              <div className="flex items-center gap-2">
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform ${
                    isTripCycleDatesOpen ? "rotate-180" : ""
                  }`}
                />
                <h3 className="text-sm font-medium">Trip Cycle Information</h3>
              </div>
            </CollapsibleTrigger>

            <CollapsibleContent className="space-y-4 pt-4">
              {tripCycle ? (
                <div className="space-y-4">
                  <div className="rounded-lg bg-muted p-4 text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Trip Cycle:</span>
                      <span className="font-medium">{tripCycle.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Cycle Period:
                      </span>
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
                      handleDateOverrideToggle(
                        "publish_date",
                        checked,
                        defaultVal,
                      )
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
                      handleDateOverrideToggle(
                        "member_signup_date",
                        checked,
                        defaultVal,
                      )
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
                      handleDateOverrideToggle(
                        "nonmember_signup_date",
                        checked,
                        defaultVal,
                      )
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
                      handleDateOverrideToggle(
                        "driver_signup_date",
                        checked,
                        defaultVal,
                      )
                    }
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>No Trip Cycle Found</AlertTitle>
                    <AlertDescription>
                      This trip&apos;s start date does not fall within any trip
                      cycle. Please enter all dates manually below, otherwise
                      the trip won&apos;t be published and participants
                      won&apos;t be able to sign up.
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
            </CollapsibleContent>
          </Collapsible>

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

export function TripCycleSkeleton() {
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
