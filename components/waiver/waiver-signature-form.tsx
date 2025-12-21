"use client";

import { useForm, Controller } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { z } from "zod/v4";
import { toast } from "sonner";
import { Loader2, FileCheck, ExternalLink } from "lucide-react";
import { differenceInYears } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSignWaiver } from "@/data/waivers";

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
  .refine(
    (data) => differenceInYears(new Date(), new Date(data.birthday)) >= 18,
    { message: "You must be 18 or older to sign this waiver", path: ["birthday"] }
  );

type WaiverSignatureFormData = z.infer<typeof WaiverSignatureSchema>;

interface WaiverSignatureFormProps {
  tripId: string;
  waiverId: string;
  tripName: string;
}

export function WaiverSignatureForm({ tripId, waiverId, tripName }: WaiverSignatureFormProps) {
  const { mutate: signWaiver, isPending, data: signedData } = useSignWaiver();

  const { control, handleSubmit, watch } = useForm<WaiverSignatureFormData>({
    resolver: standardSchemaResolver(WaiverSignatureSchema),
    defaultValues: {
      consentChecked: false as unknown as true,
      acknowledgmentChecked: false as unknown as true,
      fullLegalName: "",
      birthday: "",
    },
  });

  const birthday = watch("birthday");
  const age = birthday ? differenceInYears(new Date(), new Date(birthday)) : null;

  const onSubmit = (data: WaiverSignatureFormData) => {
    signWaiver(
      {
        fullLegalName: data.fullLegalName.trim(),
        birthday: data.birthday,
        tripId,
        waiverId,
      },
      {
        onSuccess: () => toast.success("Waiver signed successfully!"),
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
            <AlertTitle>Your waiver for {tripName} has been submitted</AlertTitle>
            <AlertDescription className="mt-2">
              A copy of your signed waiver has been saved. You can view or download it using the link below.
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
            render={({ field }) => (
              <div className="flex items-start gap-3">
                <Checkbox
                  id="consent"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="mt-0.5"
                />
                <Label htmlFor="consent" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                  By checking here, you are consenting to the use of your electronic
                  signature in lieu of an original signature on paper. You have the
                  right to request that you sign a paper copy instead. By checking here,
                  you are waiving that right. After consent, you may, upon written
                  request to us, obtain a paper copy of an electronic record. No fee
                  will be charged for such copy and no special hardware or software is
                  required to view it. Your agreement to use an electronic signature
                  with us for any documents will continue until such time as you notify
                  us in writing that you no longer wish to use an electronic signature.
                  There is no penalty for withdrawing your consent. You should always
                  make sure that we have a current email address in order to contact you
                  regarding any changes, if necessary.
                </Label>
              </div>
            )}
          />

          <Controller
            control={control}
            name="acknowledgmentChecked"
            render={({ field }) => (
              <div className="flex items-start gap-3">
                <Checkbox
                  id="acknowledgment"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="mt-0.5"
                />
                <Label htmlFor="acknowledgment" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                  By checking this box I acknowledge that I have carefully read this entire waiver and release,
                  fully understand its contents, and voluntarily agree to all of its
                  terms, including the release of liability, and intend this
                  acknowledgment to be a complete and unconditional acceptance of the
                  entire document.
                </Label>
              </div>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <Controller
              control={control}
              name="fullLegalName"
              render={({ field, fieldState }) => (
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
                  {fieldState.error && (
                    <p className="text-sm text-destructive mt-1">{fieldState.error.message}</p>
                  )}
                </div>
              )}
            />

            <Controller
              control={control}
              name="birthday"
              render={({ field, fieldState }) => (
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
                  {fieldState.error && (
                    <p className="text-sm text-destructive mt-1">{fieldState.error.message}</p>
                  )}
                  {age !== null && age < 18 && !fieldState.error && (
                    <p className="text-destructive text-sm mt-1">
                      You must be over 18 to submit this waiver. If you are under 18, contact the guides for this trip.
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          <Button type="submit" disabled={isPending} className="w-full mt-4" size="lg">
            {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isPending ? "Submitting..." : "Submit Waiver"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
