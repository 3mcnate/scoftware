"use client";

import { useForm, Controller, useWatch } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { z } from "zod/v4";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useSignWaiver } from "@/data/client/waivers/sign-waiver";
import { isAdult } from "@/utils/date-time";
import { FieldError } from "@/components/ui/field";
import {
  ACKNOWLEDGE_AND_ACCEPT_TEXT,
  ELECTRONIC_SIGNATURE_CONSENT_TEXT,
} from "@/components/waiver/waiver-checkbox-text";
import { useRevalidateTables } from "@supabase-cache-helpers/postgrest-react-query";

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
  const router = useRouter();
  const { mutate: signWaiver, isPending } = useSignWaiver();

  const revalidate = useRevalidateTables([
    { schema: "public", table: "tickets" },
  ]);

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

  const onSubmit = (data: WaiverSignatureFormData) => {
    signWaiver(
      {
        fullLegalName: data.fullLegalName.trim(),
        birthday: data.birthday,
        tripId,
        waiverId,
      },
      {
        onSuccess: async (response) => {
          const params = new URLSearchParams({
            filepath: response.filepath,
            signatureId: response.signatureId,
            signedAt: response.signedAt,
          });
					await revalidate();
          router.push(`/participant/trips/${tripId}/waiver/success?${params}`);
        },
        onError: (error) => toast.error(error.message),
      }
    );
  };

  return (
    <div className="space-y-4 py-4 border-t-2">
      <h3 className="text-lg font-semibold">Signature</h3>
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
                <Input id="birthday" type="date" className="mt-1" {...field} />
                <FieldError errors={error ? [error] : undefined} />
                {birthday !== null && !isAdult(birthday) && !error && (
                  <p className="text-destructive text-sm mt-1">
                    You must be over 18 to submit this waiver. If you are under
                    18, contact the guides for this trip.
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
          {isPending ? "Submitting..." : "Sign Waiver"}
        </Button>
      </form>
    </div>
  );
}
