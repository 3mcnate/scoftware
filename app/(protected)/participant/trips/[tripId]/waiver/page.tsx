"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Check, AlertCircle } from "lucide-react"

const trips: Record<string, { name: string; date: string }> = {
  "1": { name: "Grand Canyon Adventure", date: "Dec 15-18, 2025" },
  "2": { name: "Yellowstone Expedition", date: "Jan 5-10, 2026" },
  "3": { name: "Yosemite Camping Trip", date: "Feb 20-23, 2026" },
  "4": { name: "Pacific Coast Highway", date: "Mar 8-12, 2026" },
}

const waiverSections = [
  {
    id: "assumption-of-risk",
    title: "Assumption of Risk",
    content:
      "I understand and acknowledge that outdoor activities, including but not limited to hiking, camping, and wilderness exploration, involve inherent risks. These risks may include, but are not limited to: adverse weather conditions, difficult terrain, wildlife encounters, physical exertion, and potential equipment failure. I voluntarily assume all risks associated with participating in this trip.",
  },
  {
    id: "release-of-liability",
    title: "Release of Liability",
    content:
      "In consideration of being permitted to participate in this trip, I hereby release, waive, discharge, and covenant not to sue the trip organizers, leaders, volunteers, and affiliated organizations from any and all liability, claims, demands, actions, or causes of action arising out of or related to any loss, damage, or injury that may be sustained by me during my participation.",
  },
  {
    id: "medical-authorization",
    title: "Medical Authorization",
    content:
      "I authorize trip leaders and medical personnel to obtain or provide emergency medical care for me if I am unable to make decisions for myself. I understand that I am responsible for any costs associated with such medical care. I confirm that I have disclosed all relevant medical conditions, allergies, and medications in my participant profile.",
  },
  {
    id: "code-of-conduct",
    title: "Code of Conduct Agreement",
    content:
      "I agree to follow all instructions given by trip leaders, respect fellow participants and the natural environment, refrain from the use of alcohol or illegal substances during the trip, and maintain responsible behavior at all times. I understand that violation of these guidelines may result in removal from the trip without refund.",
  },
  {
    id: "photo-release",
    title: "Photo and Media Release",
    content:
      "I grant permission to use photographs, videos, or other media taken during this trip for promotional, educational, or documentation purposes. I understand that my image may be used in social media, websites, newsletters, or other marketing materials without compensation.",
  },
]

export default function WaiverPage() {
  const params = useParams()
  const tripId = params.tripId as string
  const trip = trips[tripId] || { name: "Unknown Trip", date: "" }

  const [initials, setInitials] = useState<Record<string, string>>({})
  const [savedSections, setSavedSections] = useState<Record<string, boolean>>({})
  const [finalSignature, setFinalSignature] = useState("")
  const [signatureDate, setSignatureDate] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSaveSection = (sectionId: string) => {
    if (initials[sectionId]?.trim()) {
      setSavedSections((prev) => ({ ...prev, [sectionId]: true }))
    }
  }

  const allSectionsSaved = waiverSections.every((section) => savedSections[section.id])
  const canSubmit = allSectionsSaved && finalSignature.trim() && signatureDate.trim()

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
        <p className="text-muted-foreground mb-6">Your waiver for {trip.name} has been successfully submitted.</p>
        <Button asChild>
          <Link href="/dashboard/trips">Return to Trips</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl space-y-6 mx-auto">
      {/* Breadcrumbs */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/participant/trips">Trips</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{trip.name}</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Waiver</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Participant Waiver</h1>
        <p className="text-muted-foreground mt-1">
          Please read each section carefully and initial to acknowledge your understanding.
        </p>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center gap-2 p-4 rounded-lg bg-muted/50 border border-border">
        <AlertCircle className="h-5 w-5 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          {Object.keys(savedSections).length} of {waiverSections.length} sections completed
        </p>
      </div>

      {/* Waiver Sections */}
      <div className="space-y-4">
        {waiverSections.map((section) => (
          <Card
            key={section.id}
            className={`border transition-colors ${
              savedSections[section.id] ? "border-success/30 bg-success/5" : "border-border"
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">{section.title}</CardTitle>
                {savedSections[section.id] && (
                  <div className="flex items-center gap-1 text-success text-sm">
                    <Check className="h-4 w-4" />
                    Saved
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">{section.content}</p>
              <div className="flex items-end gap-3 pt-2 border-t border-border">
                <div className="flex-1 max-w-[200px]">
                  <Label htmlFor={`initials-${section.id}`} className="text-xs text-muted-foreground">
                    Your Initials
                  </Label>
                  <Input
                    id={`initials-${section.id}`}
                    placeholder="e.g., JD"
                    value={initials[section.id] || ""}
                    onChange={(e) => setInitials((prev) => ({ ...prev, [section.id]: e.target.value.toUpperCase() }))}
                    disabled={savedSections[section.id]}
                    className="mt-1 uppercase"
                    maxLength={4}
                  />
                </div>
                <Button
                  onClick={() => handleSaveSection(section.id)}
                  disabled={!initials[section.id]?.trim() || savedSections[section.id]}
                  variant={savedSections[section.id] ? "outline" : "default"}
                  size="sm"
                >
                  {savedSections[section.id] ? "Saved" : "Save"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Final Signature */}
      <Card className="border-2 border-border">
        <CardHeader>
          <CardTitle className="text-lg">Final Signature</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            By signing below, I confirm that I have read, understand, and agree to all sections of this waiver. I
            acknowledge that my electronic signature is legally binding.
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
          <Button onClick={handleSubmitWaiver} disabled={!canSubmit} className="w-full mt-4" size="lg">
            Submit Waiver
          </Button>
          {!allSectionsSaved && (
            <p className="text-xs text-muted-foreground text-center">
              Please initial and save all sections above before submitting.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
