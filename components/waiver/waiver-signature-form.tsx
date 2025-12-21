"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {differenceInYears} from 'date-fns'

interface WaiverSignatureFormProps {
  tripName: string;
}

export function WaiverSignatureForm({ tripName }: WaiverSignatureFormProps) {
  const [consentChecked, setConsentChecked] = useState(false);
  const [acknowledgmentChecked, setAcknowledgmentChecked] = useState(false);
  const [finalSignature, setFinalSignature] = useState("");
  const [birthday, setBirthday] = useState("");

	const age = differenceInYears(new Date(), new Date(birthday));

  const canSubmit =
    consentChecked &&
    acknowledgmentChecked &&
    finalSignature.trim() &&
		age >= 18;

  const handleSubmitWaiver = () => {
    
  };

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
          Submit Waiver
        </Button>
      </CardContent>
    </Card>
  );
}
