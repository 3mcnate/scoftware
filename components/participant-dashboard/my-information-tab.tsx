"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Save, AlertCircle } from "lucide-react"

export function MyInformationTab() {
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => setIsSaving(false), 1500)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Personal Information</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Keep your emergency contact and healthcare information up to date
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Emergency Contact Section */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Emergency Contact</CardTitle>
            <CardDescription>This person will be contacted in case of an emergency during your trips</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergency-first-name">First Name</Label>
                <Input id="emergency-first-name" placeholder="Enter first name" className="border-border" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergency-last-name">Last Name</Label>
                <Input id="emergency-last-name" placeholder="Enter last name" className="border-border" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergency-relationship">Relationship</Label>
                <Select>
                  <SelectTrigger className="border-border">
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="spouse">Spouse/Partner</SelectItem>
                    <SelectItem value="sibling">Sibling</SelectItem>
                    <SelectItem value="friend">Friend</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergency-phone">Phone Number</Label>
                <Input
                  id="emergency-phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  className="border-border"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergency-email">Email Address</Label>
              <Input
                id="emergency-email"
                type="email"
                placeholder="emergency@example.com"
                className="border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergency-address">Address</Label>
              <Textarea
                id="emergency-address"
                placeholder="Enter full address"
                className="border-border resize-none"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Healthcare Information Section */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Healthcare Information</CardTitle>
            <CardDescription>Important medical information for trip leaders and emergency responders</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="blood-type">Blood Type</Label>
                <Select>
                  <SelectTrigger className="border-border">
                    <SelectValue placeholder="Select blood type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a-positive">A+</SelectItem>
                    <SelectItem value="a-negative">A-</SelectItem>
                    <SelectItem value="b-positive">B+</SelectItem>
                    <SelectItem value="b-negative">B-</SelectItem>
                    <SelectItem value="o-positive">O+</SelectItem>
                    <SelectItem value="o-negative">O-</SelectItem>
                    <SelectItem value="ab-positive">AB+</SelectItem>
                    <SelectItem value="ab-negative">AB-</SelectItem>
                    <SelectItem value="unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input id="dob" type="date" className="border-border" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="allergies">Known Allergies</Label>
              <Textarea
                id="allergies"
                placeholder="List any food, medication, or environmental allergies..."
                className="border-border resize-none"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="medications">Current Medications</Label>
              <Textarea
                id="medications"
                placeholder="List any medications you are currently taking..."
                className="border-border resize-none"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="conditions">Medical Conditions</Label>
              <Textarea
                id="conditions"
                placeholder="List any chronic conditions, past surgeries, or health concerns..."
                className="border-border resize-none"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dietary">Dietary Restrictions</Label>
              <Textarea
                id="dietary"
                placeholder="List any dietary restrictions or preferences..."
                className="border-border resize-none"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Insurance Information */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Insurance Information</CardTitle>
            <CardDescription>Your health insurance details for emergency medical situations</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="insurance-provider">Insurance Provider</Label>
                <Input
                  id="insurance-provider"
                  placeholder="e.g., Blue Cross Blue Shield"
                  className="border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="policy-number">Policy Number</Label>
                <Input id="policy-number" placeholder="Enter policy number" className="border-border" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="group-number">Group Number</Label>
                <Input id="group-number" placeholder="Enter group number" className="border-border" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="insurance-phone">Insurance Phone</Label>
                <Input
                  id="insurance-phone"
                  type="tel"
                  placeholder="+1 (800) 000-0000"
                  className="border-border"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Primary Care Physician */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Primary Care Physician</CardTitle>
            <CardDescription>Your doctor&apos;s contact information</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="doctor-name">Doctor&apos;s Name</Label>
                <Input id="doctor-name" placeholder="Dr. Jane Smith" className="border-border" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="doctor-phone">Doctor&apos;s Phone</Label>
                <Input
                  id="doctor-phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  className="border-border"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="clinic-name">Clinic/Hospital Name</Label>
              <Input id="clinic-name" placeholder="Enter clinic or hospital name" className="border-border" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clinic-address">Clinic Address</Label>
              <Textarea
                id="clinic-address"
                placeholder="Enter full address"
                className="border-border resize-none"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Consent Section */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Medical Consent</CardTitle>
            <CardDescription>Authorization for emergency medical treatment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
              <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                In the event of an emergency where I am unable to provide consent, I authorize trip leaders and medical
                personnel to administer necessary medical treatment.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="consent" />
              <Label htmlFor="consent" className="text-sm font-normal cursor-pointer">
                I agree to the medical consent authorization above
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="share-info" />
              <Label htmlFor="share-info" className="text-sm font-normal cursor-pointer">
                I authorize sharing my medical information with trip leaders
              </Label>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
