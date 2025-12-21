"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, FileCheck, ExternalLink } from "lucide-react";
import { differenceInYears } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface WaiverSignatureFormProps {
  tripId: string;
  waiverId: string;
  tripName: string;
}

export function WaiverSignatureForm({ tripId, waiverId, tripName }: WaiverSignatureFormProps) {
  const [consentChecked, setConsentChecked] = useState(false);
  const [acknowledgmentChecked, setAcknowledgmentChecked] = useState(false);
  const [finalSignature, setFinalSignature] = useState("");
  const [birthday, setBirthday] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signedWaiverPath, setSignedWaiverPath] = useState<string | null>(null);

  const age = differenceInYears(new Date(), new Date(birthday));

  const canSubmit =
    consentChecked &&
    acknowledgmentChecked &&
    finalSignature.trim() &&
    age >= 18 &&
    !isSubmitting;

  const handleSubmitWaiver = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/waivers/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullLegalName: finalSignature.trim(),
          birthday,
          tripId,
          waiverId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit waiver");
      }

      setSignedWaiverPath(data.filepath);
      toast.success("Waiver signed successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to submit waiver");
    } finally {
      setIsSubmitting(false);
    }
  };

  const waiverViewUrl = signedWaiverPath
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/authenticated/waivers/${signedWaiverPath}`
    : null;

  if (signedWaiverPath) {
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
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <Checkbox
            id="consent"
            checked={consentChecked}
            onCheckedChange={(checked) => setConsentChecked(checked === true)}
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
        <div className="flex items-start gap-3">
          <Checkbox
            id="acknowledgment"
            checked={acknowledgmentChecked}
            onCheckedChange={(checked) => setAcknowledgmentChecked(checked === true)}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <Label htmlFor="final-signature" className="text-sm">
              Full Legal Name
            </Label>
            <Input
              id="final-signature"
              placeholder="Enter your full name"
              value={finalSignature}
              onChange={(e) => setFinalSignature(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="signature-date" className="text-sm">
              Your Birthday
            </Label>
            <Input
              id="signature-date"
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="mt-1"
            />
						{ age < 18 && <p className="text-destructive">
							You must be over 18 to submit this waiver. If you are under 18, contact the guides for this trip.
							</p>}
          </div>
        </div>
        <Button
          onClick={handleSubmitWaiver}
          disabled={!canSubmit}
          className="w-full mt-4"
          size="lg"
        >
          {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {isSubmitting ? "Submitting..." : "Submit Waiver"}
        </Button>
      </CardContent>
    </Card>
  );
}
