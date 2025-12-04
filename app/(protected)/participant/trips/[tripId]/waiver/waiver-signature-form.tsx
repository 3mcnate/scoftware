"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Check } from "lucide-react"

interface WaiverSignatureFormProps {
  tripName: string
}

export function WaiverSignatureForm({ tripName }: WaiverSignatureFormProps) {
  const [finalSignature, setFinalSignature] = useState("")
  const [signatureDate, setSignatureDate] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const canSubmit = finalSignature.trim() && signatureDate.trim()

  const handleSubmitWaiver = () => {
    if (canSubmit) {
      setIsSubmitted(true)
    }
  }

  if (isSubmitted) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center">
        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="h-8 w-8 text-success" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Waiver Submitted</h1>
        <p className="text-muted-foreground mb-6">
          Your waiver for {tripName} has been successfully submitted.
        </p>
        <Button asChild>
          <Link href="/dashboard/trips">Return to Trips</Link>
        </Button>
      </div>
    )
  }

  return (
    <Card className="border-2 border-border">
      <CardHeader>
        <CardTitle className="text-lg">Signature</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          By signing below, I confirm that I have read, understand, and agree to all terms of this
          waiver. I acknowledge that my electronic signature is legally binding.
        </p>
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
              Date
            </Label>
            <Input
              id="signature-date"
              type="date"
              value={signatureDate}
              onChange={(e) => setSignatureDate(e.target.value)}
              className="mt-1"
            />
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
  )
}
