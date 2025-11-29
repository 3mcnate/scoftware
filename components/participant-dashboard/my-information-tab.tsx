"use client";

import { useEffect } from "react";
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
import { PhoneInput } from "@/components/ui/phone-input";
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
import { useParticipantInfo } from "@/data/participant/get-participant-info";
import { useUpsertParticipantInfo } from "@/data/participant/upsert-participant-info";

const currentYear = new Date().getFullYear();

const ParticipantInfoSchema = z.object({
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
		.refine(year => Number(year) >= currentYear && Number(year) <= currentYear + 10,
			`Year must be between ${currentYear} and ${currentYear + 10}`
		),
  emergency_contact_name: z
    .string()
    .min(1, "Emergency contact name is required"),
  emergency_contact_phone_number: z
    .string()
    .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
  emergency_contact_relationship: z.string().min(1, "Relationship is required"),
  health_insurance_provider: z
    .string()
    .min(1, "Insurance provider is required"),
  health_insurance_member_id: z.string().min(1, "Member ID is required"),
  health_insurance_group_number: z.string().min(1, "Group number is required"),
  health_insurance_bin_number: z.string().min(1, "BIN number is required"),
  allergies: z.string().min(1, "Allergies is required"),
  medications: z.string().min(1, "Medications is required"),
  medical_history: z.string().min(1, "Medical history is required"),
  dietary_restrictions: z.string().min(1, "Dietary Restrictions is required"),
});

type ParticipantInfoFormData = z.infer<typeof ParticipantInfoSchema>;

export function MyInformationTab() {
  const auth = useAuth();
  const userId = auth.status === "authenticated" ? auth.user.id : "";

  const {
    data: existingInfo,
    isLoading,
    error: existingInfoError,
  } = useParticipantInfo(userId);
  const { mutateAsync: upsertInfo, isPending: isSaving } =
    useUpsertParticipantInfo();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<ParticipantInfoFormData>({
    resolver: standardSchemaResolver(ParticipantInfoSchema),
    defaultValues: {
      usc_id: "",
      degree_path: undefined,
      graduation_season: undefined,
      graduation_year: "",
      emergency_contact_name: "",
      emergency_contact_phone_number: "",
      emergency_contact_relationship: "",
      health_insurance_provider: "",
      health_insurance_member_id: "",
      health_insurance_group_number: "",
      health_insurance_bin_number: "",
      allergies: "",
      medications: "",
      medical_history: "",
      dietary_restrictions: "",
    },
  });

  // Warn user about unsaved changes before leaving the page
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  useEffect(() => {
    if (existingInfoError)
      toast.error(
        existingInfoError instanceof Error
          ? existingInfoError.message
          : "Failed to load information"
      );
  }, [existingInfoError]);

  useEffect(() => {
    if (existingInfo?.length) {
      const info = existingInfo[0];
      reset({
        usc_id: `${info.usc_id}`,
        degree_path: info.degree_path,
        graduation_season: info.graduation_season,
        graduation_year: `${info.graduation_year}`,
        emergency_contact_name: info.emergency_contact_name,
        emergency_contact_phone_number: info.emergency_contact_phone_number,
        emergency_contact_relationship: info.emergency_contact_relationship,
        health_insurance_provider: info.health_insurance_provider,
        health_insurance_member_id: info.health_insurance_member_id,
        health_insurance_group_number: info.health_insurance_group_number,
        health_insurance_bin_number: info.health_insurance_bin_number,
        allergies: info.allergies,
        medications: info.medications,
        medical_history: info.medical_history,
        dietary_restrictions: info.dietary_restrictions,
      });
    }
  }, [existingInfo, reset]);

  const onSubmit = async (data: ParticipantInfoFormData) => {
    if (!userId) return;

    try {
      await upsertInfo([
        {
          user_id: userId,
          ...data,
					graduation_year: Number(data.graduation_year) 
        },
      ]);
      toast.success("Information saved successfully");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save information"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Personal Information
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Keep your emergency contact and healthcare information up to date
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
            <CardDescription>Your university identification</CardDescription>
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
                        disabled={isSaving}
                        aria-invalid={!!error}
                      />
                      <FieldDescription>
                        Type &quot;none&quot; or &quot;N/A&quot; if none
                      </FieldDescription>
                      <FieldError errors={error ? [error] : undefined} />
                    </>
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
                        disabled={isSaving}
                        aria-invalid={!!error}
                      />
                      <FieldDescription>
                        Type &quot;none&quot; or &quot;N/A&quot; if none
                      </FieldDescription>
                      <FieldError errors={error ? [error] : undefined} />
                    </>
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
                        disabled={isSaving}
                        aria-invalid={!!error}
                      />
                      <FieldDescription>
                        Type &quot;none&quot; or &quot;N/A&quot; if none
                      </FieldDescription>
                      <FieldError errors={error ? [error] : undefined} />
                    </>
                  )}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="dietary_restrictions">
                  Dietary Restrictions
                </FieldLabel>
                <Controller
                  control={control}
                  name="dietary_restrictions"
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Textarea
                        {...field}
                        id="dietary_restrictions"
                        placeholder="List any dietary restrictions or preferences..."
                        className="resize-none"
                        rows={2}
                        disabled={isSaving}
                        aria-invalid={!!error}
                      />
                      <FieldDescription>
                        Type &quot;none&quot; or &quot;N/A&quot; if none
                      </FieldDescription>
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
