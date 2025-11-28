"use client"

import { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { z } from "zod/v4"
import { isValidPhoneNumber } from "react-phone-number-input"
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query"
import { toast } from "sonner"
import { Save, Loader2 } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { PhoneInput } from "@/components/ui/phone-input"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { createClient } from "@/utils/supabase/browser"
import { useAuth } from "@/hooks/use-auth"
import { useParticipantInfo } from "@/data/participant/get-participant-info"

const ParticipantInfoSchema = z.object({
  usc_id: z.coerce
    .number({ error: "USC ID must be a number" })
    .int("USC ID must be a whole number")
    .min(1000000000, "USC ID must be 10 digits")
    .max(9999999999, "USC ID must be 10 digits"),
  emergency_contact_name: z.string().min(1, "Emergency contact name is required"),
  emergency_contact_phone_number: z
    .string()
    .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
  emergency_contact_relationship: z.string().min(1, "Relationship is required"),
  health_insurance_provider: z.string().min(1, "Insurance provider is required"),
  health_insurance_member_id: z.string().min(1, "Member ID is required"),
  health_insurance_group_number: z.string().min(1, "Group number is required"),
  health_insurance_bin_number: z.string().min(1, "BIN number is required"),
  allergies: z.string(),
  medications: z.string(),
  medical_history: z.string(),
  dietary_restrictions: z.string(),
})

type ParticipantInfoFormData = z.infer<typeof ParticipantInfoSchema>



export function MyInformationTab() {
  const supabase = createClient()
  const auth = useAuth()
  const userId = auth.status === "authenticated" ? auth.user.id : ""
  const [isSaving, setIsSaving] = useState(false)

  const { data: existingInfo, isLoading, refetch } = useParticipantInfo(userId)

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<ParticipantInfoFormData>({
    resolver: standardSchemaResolver(ParticipantInfoSchema),
    defaultValues: {
      usc_id: 0,
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
  })

  useEffect(() => {
    if (existingInfo?.length) {
			const info = existingInfo[0]
      reset({
        usc_id: info.usc_id,
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
      })
    }
  }, [existingInfo, reset])

  const onSubmit = async (data: ParticipantInfoFormData) => {
    if (!userId) return

    setIsSaving(true)
    try {
      const { error } = await supabase
        .from("participant_info")
        .upsert({
          user_id: userId,
          ...data,
        })

      if (error) {
        toast.error(error.message)
        return
      }

      toast.success("Information saved successfully")
      await refetch()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save information")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Personal Information</h2>
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
                        type="number"
                        placeholder="1234567890"
                        disabled={isSaving}
                        aria-invalid={!!error}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                      <FieldDescription>Your 10-digit USC ID number</FieldDescription>
                      <FieldError errors={error ? [error] : undefined} />
                    </>
                  )}
                />
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>

        {/* Emergency Contact Section */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Emergency Contact</CardTitle>
            <CardDescription>This person will be contacted in case of an emergency during your trips</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="emergency_contact_name">Full Name</FieldLabel>
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
                  <FieldLabel htmlFor="emergency_contact_relationship">Relationship</FieldLabel>
                  <Controller
                    control={control}
                    name="emergency_contact_relationship"
                    render={({ field, fieldState: { error } }) => (
                      <>
                        <Input
                          {...field}
                          id="emergency_contact_relationship"
                          placeholder="e.g., Parent, Spouse, Sibling"
                          disabled={isSaving}
                          aria-invalid={!!error}
                        />
                        <FieldError errors={error ? [error] : undefined} />
                      </>
                    )}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="emergency_contact_phone_number">Phone Number</FieldLabel>
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
            <CardDescription>Your health insurance details for emergency medical situations</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="health_insurance_provider">Insurance Provider</FieldLabel>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field>
                  <FieldLabel htmlFor="health_insurance_member_id">Member ID</FieldLabel>
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
                <Field>
                  <FieldLabel htmlFor="health_insurance_group_number">Group Number</FieldLabel>
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
                  <FieldLabel htmlFor="health_insurance_bin_number">BIN Number</FieldLabel>
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
                        <FieldDescription>Found on your insurance card</FieldDescription>
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
            <CardDescription>Important medical information for trip leaders and emergency responders</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="allergies">Known Allergies</FieldLabel>
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
                      <FieldDescription>Leave blank if none</FieldDescription>
                      <FieldError errors={error ? [error] : undefined} />
                    </>
                  )}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="medications">Current Medications</FieldLabel>
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
                      <FieldDescription>Leave blank if none</FieldDescription>
                      <FieldError errors={error ? [error] : undefined} />
                    </>
                  )}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="medical_history">Medical History</FieldLabel>
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
                      <FieldDescription>Leave blank if none</FieldDescription>
                      <FieldError errors={error ? [error] : undefined} />
                    </>
                  )}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="dietary_restrictions">Dietary Restrictions</FieldLabel>
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
                      <FieldDescription>Leave blank if none</FieldDescription>
                      <FieldError errors={error ? [error] : undefined} />
                    </>
                  )}
                />
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>
      </div>
    </form>
  )
}
