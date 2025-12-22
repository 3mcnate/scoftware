"use client";

import { useForm, Controller, useWatch } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { z } from "zod/v4";
import { toast } from "sonner";
import { Loader2, FileCheck, ExternalLink } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSignWaiver } from "@/data/waivers/sign-waiver";
import { isAdult } from "@/utils/date-time";
import { FieldError } from "@/components/ui/field";
import { useEffect } from "react";
import { ACKNOWLEDGE_AND_ACCEPT_TEXT, ELECTRONIC_SIGNATURE_CONSENT_TEXT } from "@/components/waiver/waiver-checkbox-text";

const WaiverSignatureSchema = z
  .object({
    consentChecked: z.literal(true, {
      error: "You must consent to electronic signature",
    }),
    acknowledgmentChecked: z.literal(true, {
      error: "You must acknowledge the waiver terms",
    }),
    fullLegalName: z.string().min(1, "Full legal name is required"),
    birthday: z.string().min(1, "Birthday is required"),
  })
  .refine((data) => isAdult(data.birthday), {
    message: "You must be 18 or older to sign this waiver",
    path: ["birthday"],
  });

type WaiverSignatureFormData = z.infer<typeof WaiverSignatureSchema>;

interface WaiverSignatureFormProps {
  tripId: string;
  waiverId: string;
}

export function WaiverSignatureForm({
  tripId,
  waiverId,
}: WaiverSignatureFormProps) {
  const { mutate: signWaiver, isPending, data: signedData } = useSignWaiver();

  const { control, handleSubmit } = useForm<WaiverSignatureFormData>({
    resolver: standardSchemaResolver(WaiverSignatureSchema),
    defaultValues: {
      consentChecked: false as unknown as true,
      acknowledgmentChecked: false as unknown as true,
      fullLegalName: "",
      birthday: "",
    },
  });

  const birthday = useWatch({ control, name: "birthday" });
	useEffect(() => {
		console.log("birthday", birthday)
	}, [birthday])

  const onSubmit = (data: WaiverSignatureFormData) => {
    signWaiver(
      {
        fullLegalName: data.fullLegalName.trim(),
        birthday: data.birthday,
        tripId,
        waiverId,
      },
      {
        onSuccess: () => toast.success("Waiver signed successfully"),
        onError: (error) => toast.error(error.message),
      }
    );
  };

  const waiverViewUrl = signedData?.filepath
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/authenticated/waivers/${signedData.filepath}`
    : null;

  if (signedData?.filepath) {
    return (
      <Card className="border-2 border-green-500/50 bg-green-50/50 dark:bg-green-950/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-green-700 dark:text-green-400">
            <FileCheck className="h-5 w-5" />
            Waiver Signed Successfully
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTitle>Your waiver has been submitted</AlertTitle>
            <AlertDescription className="mt-2">
              A copy of your signed waiver has been saved. You can view or
              download it using the link below.
            </AlertDescription>
          </Alert>
          <Button asChild variant="outline" className="w-full">
            <a href={waiverViewUrl!} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Signed Waiver
            </a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-border">
      <CardHeader>
        <CardTitle className="text-lg">Signature</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            control={control}
            name="consentChecked"
            render={({ field, fieldState: { error } }) => (
              <div>
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="consent"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="mt-0.5"
                  />
                  <Label
                    htmlFor="consent"
                    className="text-sm leading-relaxed cursor-pointer"
                  >
                    {ELECTRONIC_SIGNATURE_CONSENT_TEXT}
                  </Label>
                </div>
                <FieldError errors={error ? [error] : undefined} />
              </div>
            )}
          />

          <Controller
            control={control}
            name="acknowledgmentChecked"
            render={({ field, fieldState: { error } }) => (
              <div>
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="acknowledgment"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="mt-0.5"
                  />
                  <Label
                    htmlFor="acknowledgment"
                    className="text-sm leading-relaxed cursor-pointer"
                  >
                    {ACKNOWLEDGE_AND_ACCEPT_TEXT}
                  </Label>
                </div>
                <FieldError errors={error ? [error] : undefined} />
              </div>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <Controller
              control={control}
              name="fullLegalName"
              render={({ field, fieldState: { error } }) => (
                <div>
                  <Label htmlFor="full-legal-name" className="text-sm">
                    Full Legal Name
                  </Label>
                  <Input
                    id="full-legal-name"
                    placeholder="Enter your full name"
                    className="mt-1"
                    {...field}
                  />
                  <FieldError errors={error ? [error] : undefined} />
                </div>
              )}
            />

            <Controller
              control={control}
              name="birthday"
              render={({ field, fieldState: { error } }) => (
                <div>
                  <Label htmlFor="birthday" className="text-sm">
                    Your Birthday
                  </Label>
                  <Input
                    id="birthday"
                    type="date"
                    className="mt-1"
                    {...field}
                  />
                  <FieldError errors={error ? [error] : undefined} />
                  {birthday !== null && !isAdult(birthday) && !error && (
                    <p className="text-destructive text-sm mt-1">
                      You must be over 18 to submit this waiver. If you are
                      under 18, contact the guides for this trip.
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full mt-4"
            size="lg"
          >
            {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isPending ? "Submitting..." : "Submit Waiver"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
