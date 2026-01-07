"use client";

import { useForm, Controller } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { z } from "zod/v4";
import { isValidPhoneNumber } from "react-phone-number-input";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { PhoneInput } from "@/components/ui/phone-input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { useAuth } from "@/hooks/use-auth";
import { useUpsertParticipantInfo } from "@/data/client/participant/upsert-participant-info";
import { useUnsavedChangesPrompt } from "@/hooks/use-unsaved-changes-prompt";
import type { Tables } from "@/types/database.types";

const currentYear = new Date().getFullYear();

const DIETARY_RESTRICTIONS = [
  "Vegetarian",
  "Vegan",
  "Gluten free",
  "Dairy free",
  "Nut free",
  "Kosher",
  "Halal",
  "Pescatarian",
] as const;

const ParticipantInfoSchema = z
  .object({
    usc_id: z.coerce
      .string()
      .regex(/^\d{10}$/, "USC ID must be a 10-digit number"),
    degree_path: z.enum(["undergrad", "graduate", "pdp"], {
      error: "Please select a degree path",
    }),
    graduation_season: z.enum(["spring", "fall"], {
      error: "Please select a graduation season",
    }),
    graduation_year: z
      .string()
      .regex(/^\d{4}$/, "Graduation year must be a valid year")
      .refine(
        (year) =>
          Number(year) >= currentYear && Number(year) <= currentYear + 10,
        `Year must be between ${currentYear} and ${currentYear + 10}`
      ),
    emergency_contact_name: z
      .string()
      .min(1, "Emergency contact name is required"),
    emergency_contact_phone_number: z
      .string()
      .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
    emergency_contact_relationship: z
      .string()
      .min(1, "Relationship is required"),
    health_insurance_provider: z
      .string()
      .min(1, "Insurance provider is required"),
    health_insurance_member_id: z.string().min(1, "Member ID is required"),
    health_insurance_group_number: z
      .string()
      .min(1, "Group number is required"),
    health_insurance_bin_number: z.string().min(1, "BIN number is required"),
    allergies: z.string().optional(),
    no_allergies: z.boolean().optional(),
    medications: z.string().optional(),
    no_medications: z.boolean().optional(),
    medical_history: z.string().optional(),
    no_medical_history: z.boolean().optional(),
    dietary_restrictions: z.array(z.string()).optional(),
    has_other_dietary_restriction: z.boolean().optional(),
    dietary_restrictions_other: z.string().optional(),
    no_dietary_restrictions: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.no_allergies && !data.allergies) {
      ctx.addIssue({
        code: "custom",
        message: "Please describe your allergies or check 'I have none'",
        path: ["allergies"],
      });
    }
    if (!data.no_medications && !data.medications) {
      ctx.addIssue({
        code: "custom",
        message: "Please list your medications or check 'I have none'",
        path: ["medications"],
      });
    }
    if (!data.no_medical_history && !data.medical_history) {
      ctx.addIssue({
        code: "custom",
        message: "Please describe your medical history or check 'I have none'",
        path: ["medical_history"],
      });
    }
		
    // Dietary restrictions: must have at least one selection OR check "no dietary restrictions"
    const hasStandardRestrictions =
      data.dietary_restrictions && data.dietary_restrictions.length > 0;
    const hasOtherRestriction =
      data.has_other_dietary_restriction &&
      data.dietary_restrictions_other?.trim();
    const hasAnyRestriction = hasStandardRestrictions || hasOtherRestriction;

    if (!data.no_dietary_restrictions && !hasAnyRestriction) {
      ctx.addIssue({
        code: "custom",
        message:
          "Please select any dietary restrictions or check 'I don't have any dietary restrictions'",
        path: ["no_dietary_restrictions"],
      });
    }

    // If "other" is checked, must provide a value
    if (
      data.has_other_dietary_restriction &&
      !data.dietary_restrictions_other?.trim()
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Please specify your other dietary restriction",
        path: ["dietary_restrictions_other"],
      });
    }
  });

type ParticipantInfoFormData = z.infer<typeof ParticipantInfoSchema>;
type ParticipantInfo = Tables<"participant_info">;
interface MyInformationTabProps {
  initialData?: ParticipantInfo | null;
}

export function MyInformationTab({ initialData }: MyInformationTabProps) {
  const auth = useAuth();
  const userId = auth.status === "authenticated" ? auth.user.id : "";

  const { mutateAsync: upsertInfo, isPending: isSaving } =
    useUpsertParticipantInfo();

  const {
    control,
    handleSubmit,
    formState: { isDirty },
    reset,
    watch,
    setValue,
  } = useForm<ParticipantInfoFormData>({
    resolver: standardSchemaResolver(ParticipantInfoSchema),
    defaultValues: {
      usc_id: initialData?.usc_id ?? "",
      graduation_year: initialData?.graduation_year?.toString() ?? "",
      degree_path: initialData?.degree_path,
      graduation_season: initialData?.graduation_season,
      emergency_contact_name: initialData?.emergency_contact_name ?? "",
      emergency_contact_phone_number:
        initialData?.emergency_contact_phone_number ?? "",
      emergency_contact_relationship:
        initialData?.emergency_contact_relationship ?? "",
      health_insurance_provider: initialData?.health_insurance_provider ?? "",
      health_insurance_member_id: initialData?.health_insurance_member_id ?? "",
      health_insurance_group_number:
        initialData?.health_insurance_group_number ?? "",
      health_insurance_bin_number:
        initialData?.health_insurance_bin_number ?? "",
      allergies: initialData?.allergies ?? "",
      no_allergies: initialData?.allergies === "",
      medications: initialData?.medications ?? "",
      no_medications: initialData?.medications === "",
      medical_history: initialData?.medical_history ?? "",
      no_medical_history: initialData?.medical_history === "",
      dietary_restrictions:
        initialData?.dietary_restrictions?.filter((r) =>
          DIETARY_RESTRICTIONS.includes(
            r as (typeof DIETARY_RESTRICTIONS)[number]
          )
        ) ?? [],
      has_other_dietary_restriction: !!initialData?.dietary_restrictions?.find(
        (r) =>
          !DIETARY_RESTRICTIONS.includes(
            r as (typeof DIETARY_RESTRICTIONS)[number]
          )
      ),
      dietary_restrictions_other:
        initialData?.dietary_restrictions?.find(
          (r) =>
            !DIETARY_RESTRICTIONS.includes(
              r as (typeof DIETARY_RESTRICTIONS)[number]
            )
        ) ?? "",
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const noAllergies = watch("no_allergies");
  const hasOtherDietaryRestriction = watch("has_other_dietary_restriction");
  const noMedications = watch("no_medications");
  const noMedicalHistory = watch("no_medical_history");
  const noDietaryRestrictions = watch("no_dietary_restrictions");

  useUnsavedChangesPrompt(isDirty);

  const onSubmit = async (data: ParticipantInfoFormData) => {
    if (!userId) return;

    try {
      const {
        no_allergies,
        no_medications,
        no_medical_history,
        dietary_restrictions,
        has_other_dietary_restriction,
        dietary_restrictions_other,
        no_dietary_restrictions,
        ...rest
      } = data;

      const combinedDietaryRestrictions = [
        ...(dietary_restrictions && !no_dietary_restrictions
          ? dietary_restrictions
          : []),
      ];
      if (has_other_dietary_restriction && dietary_restrictions_other) {
        combinedDietaryRestrictions.push(dietary_restrictions_other);
      }

      await upsertInfo([
        {
          user_id: userId,
          ...rest,
          dietary_restrictions: combinedDietaryRestrictions,
          allergies: no_allergies ? "" : data.allergies ?? "",
          medications: no_medications ? "" : data.medications ?? "",
          medical_history: no_medical_history ? "" : data.medical_history ?? "",
          graduation_year: Number(data.graduation_year),
        },
      ]);
      toast.success("Information saved successfully");
      reset(data);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save information"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Personal Information
          </h2>
          <p className="text-sm mt-1">
            This information helps us keep you safe! It will be shared with your
            guides before every trip, so you only have to enter it once :)
          </p>
        </div>
        <Button type="submit" disabled={isSaving || !isDirty}>
          {isSaving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid gap-6">
        {/* USC ID Section */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">USC Information</CardTitle>
            <CardDescription>
              Helps us ensure only current USC students can sign up for trips
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="usc_id">USC ID</FieldLabel>
                  <Controller
                    control={control}
                    name="usc_id"
                    render={({ field, fieldState: { error } }) => (
                      <>
                        <Input
                          {...field}
                          id="usc_id"
                          placeholder="1234567890"
                          disabled={isSaving}
                          aria-invalid={!!error}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                        <FieldDescription>
                          Your 10-digit USC ID number
                        </FieldDescription>
                        <FieldError errors={error ? [error] : undefined} />
                      </>
                    )}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="degree_path">Degree Path</FieldLabel>
                  <Controller
                    control={control}
                    name="degree_path"
                    render={({ field, fieldState: { error } }) => (
                      <>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={isSaving}
                        >
                          <SelectTrigger
                            id="degree_path"
                            aria-invalid={!!error}
                          >
                            <SelectValue placeholder="Select degree path" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="undergrad">
                              Undergraduate
                            </SelectItem>
                            <SelectItem value="graduate">Graduate</SelectItem>
                            <SelectItem value="pdp">PDP</SelectItem>
                          </SelectContent>
                        </Select>
                        <FieldError errors={error ? [error] : undefined} />
                      </>
                    )}
                  />
                </Field>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="graduation_season">
                    Graduation Season
                  </FieldLabel>
                  <Controller
                    control={control}
                    name="graduation_season"
                    render={({ field, fieldState: { error } }) => (
                      <>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={isSaving}
                        >
                          <SelectTrigger
                            id="graduation_season"
                            aria-invalid={!!error}
                          >
                            <SelectValue placeholder="Select season" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="spring">Spring</SelectItem>
                            <SelectItem value="fall">Fall</SelectItem>
                          </SelectContent>
                        </Select>
                        <FieldError errors={error ? [error] : undefined} />
                      </>
                    )}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="graduation_year">
                    Graduation Year
                  </FieldLabel>
                  <Controller
                    control={control}
                    name="graduation_year"
                    render={({ field, fieldState: { error } }) => (
                      <>
                        <Input
                          {...field}
                          id="graduation_year"
                          type="number"
                          placeholder="2025"
                          disabled={isSaving}
                          aria-invalid={!!error}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                        <FieldError errors={error ? [error] : undefined} />
                      </>
                    )}
                  />
                </Field>
              </div>
            </FieldGroup>
          </CardContent>
        </Card>

        {/* Emergency Contact Section */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Emergency Contact</CardTitle>
            <CardDescription>
              This person will be contacted in case of an emergency during your
              trips
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="emergency_contact_name">
                  Full Name
                </FieldLabel>
                <Controller
                  control={control}
                  name="emergency_contact_name"
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Input
                        {...field}
                        id="emergency_contact_name"
                        placeholder="John Doe"
                        disabled={isSaving}
                        aria-invalid={!!error}
                      />
                      <FieldError errors={error ? [error] : undefined} />
                    </>
                  )}
                />
              </Field>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="emergency_contact_relationship">
                    Relationship
                  </FieldLabel>
                  <Controller
                    control={control}
                    name="emergency_contact_relationship"
                    render={({ field, fieldState: { error } }) => (
                      <>
                        <Input
                          {...field}
                          id="emergency_contact_relationship"
                          placeholder="e.g. parent, sibling, spouse, etc."
                          disabled={isSaving}
                          aria-invalid={!!error}
                        />
                        <FieldError errors={error ? [error] : undefined} />
                      </>
                    )}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="emergency_contact_phone_number">
                    Phone Number
                  </FieldLabel>
                  <Controller
                    control={control}
                    name="emergency_contact_phone_number"
                    render={({ field, fieldState: { error } }) => (
                      <>
                        <PhoneInput
                          {...field}
                          defaultCountry="US"
                          disabled={isSaving}
                        />
                        <FieldError errors={error ? [error] : undefined} />
                      </>
                    )}
                  />
                </Field>
              </div>
            </FieldGroup>
          </CardContent>
        </Card>

        {/* Health Insurance Section */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Health Insurance</CardTitle>
            <CardDescription>
              Your health insurance details for emergency medical situations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="health_insurance_provider">
                    Insurance Provider
                  </FieldLabel>
                  <Controller
                    control={control}
                    name="health_insurance_provider"
                    render={({ field, fieldState: { error } }) => (
                      <>
                        <Input
                          {...field}
                          id="health_insurance_provider"
                          placeholder="e.g., Blue Cross Blue Shield"
                          disabled={isSaving}
                          aria-invalid={!!error}
                        />
                        <FieldError errors={error ? [error] : undefined} />
                      </>
                    )}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="health_insurance_member_id">
                    Member ID
                  </FieldLabel>
                  <Controller
                    control={control}
                    name="health_insurance_member_id"
                    render={({ field, fieldState: { error } }) => (
                      <>
                        <Input
                          {...field}
                          id="health_insurance_member_id"
                          placeholder="Member ID"
                          disabled={isSaving}
                          aria-invalid={!!error}
                        />
                        <FieldError errors={error ? [error] : undefined} />
                      </>
                    )}
                  />
                </Field>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="health_insurance_group_number">
                    Group Number
                  </FieldLabel>
                  <Controller
                    control={control}
                    name="health_insurance_group_number"
                    render={({ field, fieldState: { error } }) => (
                      <>
                        <Input
                          {...field}
                          id="health_insurance_group_number"
                          placeholder="Group Number"
                          disabled={isSaving}
                          aria-invalid={!!error}
                        />
                        <FieldError errors={error ? [error] : undefined} />
                      </>
                    )}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="health_insurance_bin_number">
                    BIN Number
                  </FieldLabel>
                  <Controller
                    control={control}
                    name="health_insurance_bin_number"
                    render={({ field, fieldState: { error } }) => (
                      <>
                        <Input
                          {...field}
                          id="health_insurance_bin_number"
                          placeholder="BIN Number"
                          disabled={isSaving}
                          aria-invalid={!!error}
                        />
                        <FieldDescription>
                          Found on your insurance card
                        </FieldDescription>
                        <FieldError errors={error ? [error] : undefined} />
                      </>
                    )}
                  />
                </Field>
              </div>
            </FieldGroup>
          </CardContent>
        </Card>

        {/* Medical Information Section */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Medical Information</CardTitle>
            <CardDescription>
              This information will be shared with your guides when you sign up
              for a trip, and with rescuers or medical staff in the event of an
              emergency.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="allergies">
                  Please list any allergies that may be pertinent. Examples:
                  peanuts, dairy, gluten, bees, pollen, etc
                </FieldLabel>
                <Controller
                  control={control}
                  name="allergies"
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Textarea
                        {...field}
                        id="allergies"
                        placeholder="List any food, medication, or environmental allergies..."
                        className="resize-none"
                        rows={3}
                        disabled={isSaving || noAllergies}
                        aria-invalid={!!error}
                      />
                      <FieldError errors={error ? [error] : undefined} />
                    </>
                  )}
                />
                <Controller
                  control={control}
                  name="no_allergies"
                  render={({ field }) => (
                    <div className="flex items-center space-x-2 mt-2">
                      <Checkbox
                        id="no_allergies"
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          if (checked) setValue("allergies", "");
                        }}
                        disabled={isSaving}
                      />
                      <label
                        htmlFor="no_allergies"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I don&apos;t have any allergies
                      </label>
                    </div>
                  )}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="medications">
                  Please list any medications/supplements you are currently
                  taking. (ex: epi pen, albuterol, insulin, etc.)
                </FieldLabel>
                <Controller
                  control={control}
                  name="medications"
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Textarea
                        {...field}
                        id="medications"
                        placeholder="List any medications you are currently taking..."
                        className="resize-none"
                        rows={3}
                        disabled={isSaving || noMedications}
                        aria-invalid={!!error}
                      />
                      <FieldError errors={error ? [error] : undefined} />
                    </>
                  )}
                />
                <Controller
                  control={control}
                  name="no_medications"
                  render={({ field }) => (
                    <div className="flex items-center space-x-2 mt-2">
                      <Checkbox
                        id="no_medications"
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          if (checked) setValue("medications", "");
                        }}
                        disabled={isSaving}
                      />
                      <label
                        htmlFor="no_medications"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I don&apos;t have any medications
                      </label>
                    </div>
                  )}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="medical_history">
                  Do you have any pertinent medical history we should know
                  about? (ex: asthma, diabetes, seizures, syndromes, emergency
                  medications).
                </FieldLabel>
                <Controller
                  control={control}
                  name="medical_history"
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Textarea
                        {...field}
                        id="medical_history"
                        placeholder="List any chronic conditions, past surgeries, or health concerns..."
                        className="resize-none"
                        rows={3}
                        disabled={isSaving || noMedicalHistory}
                        aria-invalid={!!error}
                      />
                      <FieldError errors={error ? [error] : undefined} />
                    </>
                  )}
                />
                <Controller
                  control={control}
                  name="no_medical_history"
                  render={({ field }) => (
                    <div className="flex items-center space-x-2 mt-2">
                      <Checkbox
                        id="no_medical_history"
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          if (checked) setValue("medical_history", "");
                        }}
                        disabled={isSaving}
                      />
                      <label
                        htmlFor="no_medical_history"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I don&apos;t have any pertinent medical history
                      </label>
                    </div>
                  )}
                />
              </Field>
              <Field>
                <FieldLabel>Dietary Restrictions</FieldLabel>
                <FieldDescription className="mb-2">
                  Select any that apply
                </FieldDescription>
                <Controller
                  control={control}
                  name="dietary_restrictions"
                  render={({ field }) => (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        {DIETARY_RESTRICTIONS.map((restriction) => (
                          <div
                            key={restriction}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`dietary_${restriction}`}
                              checked={field.value?.includes(restriction)}
                              onCheckedChange={(checked) => {
                                const newValue = checked
                                  ? [...(field.value || []), restriction]
                                  : field.value?.filter(
                                      (r) => r !== restriction
                                    ) || [];
                                field.onChange(newValue);
                              }}
                              disabled={isSaving || noDietaryRestrictions}
                            />
                            <label
                              htmlFor={`dietary_${restriction}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {restriction}
                            </label>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                />
                <div className="flex items-center gap-3">
                  <Controller
                    control={control}
                    name="has_other_dietary_restriction"
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="has_other_dietary_restriction"
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            if (!checked)
                              setValue("dietary_restrictions_other", "");
                          }}
                          disabled={isSaving || noDietaryRestrictions}
                        />
                        <label
                          htmlFor="has_other_dietary_restriction"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Other
                        </label>
                      </div>
                    )}
                  />
                  <Controller
                    control={control}
                    name="dietary_restrictions_other"
                    render={({ field, fieldState: { error } }) => (
                      <div className="flex-1 space-y-1">
                        <Input
                          {...field}
                          id="dietary_restrictions_other"
                          disabled={isSaving || !hasOtherDietaryRestriction}
                          placeholder="Other dietary restriction..."
                          aria-invalid={!!error}
                        />
                        <FieldError errors={error ? [error] : undefined} />
                      </div>
                    )}
                  />
                </div>
                <Controller
                  control={control}
                  name="no_dietary_restrictions"
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <div className="flex items-center space-x-2 mt-2">
                        <Checkbox
                          id="no_dietary_restrictions"
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            if (checked) {
                              setValue("dietary_restrictions", []);
                              setValue("has_other_dietary_restriction", false);
                              setValue("dietary_restrictions_other", "");
                            }
                          }}
                          disabled={isSaving}
                        />
                        <label
                          htmlFor="no_dietary_restrictions"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          I don&apos;t have any dietary restrictions
                        </label>
                      </div>
                      <FieldError errors={error ? [error] : undefined} />
                    </>
                  )}
                />
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>
        <div className="">
          <Button type="submit" disabled={isSaving || !isDirty}>
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </form>
  );
}

export function MyInformationTabSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
        <Skeleton className="h-9 w-32" />
      </div>

      <div className="grid gap-6">
        {/* USC Information Card Skeleton */}
        <Card className="bg-card border-border">
          <CardHeader>
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-64 mt-1" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-3 w-40" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-9 w-full" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-9 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-9 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact Card Skeleton */}
        <Card className="bg-card border-border">
          <CardHeader>
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-80 mt-1" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-9 w-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-9 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-9 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Health Insurance Card Skeleton */}
        <Card className="bg-card border-border">
          <CardHeader>
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-72 mt-1" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-9 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-9 w-full" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-9 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medical Information Card Skeleton */}
        <Card className="bg-card border-border">
          <CardHeader>
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-96 mt-1" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-80" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-3 w-48" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-72" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-3 w-48" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-80" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-3 w-48" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-3 w-48" />
            </div>
          </CardContent>
        </Card>

        <Skeleton className="h-9 w-32" />
      </div>
    </div>
  );
}
