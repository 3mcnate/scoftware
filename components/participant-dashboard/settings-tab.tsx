"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Save, Trash2 } from "lucide-react"

export function SettingsTab() {
  const [isSaving, setIsSaving] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => setIsSaving(false), 1500)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setProfileImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Account Settings</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage your profile and account preferences</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Profile Picture Section */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Profile Picture</CardTitle>
            <CardDescription>Upload a photo to personalize your profile</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={profileImage || "/placeholder.svg?height=96&width=96&query=professional headshot"}
                  />
                  <AvatarFallback className="bg-secondary text-secondary-foreground text-2xl">JD</AvatarFallback>
                </Avatar>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
                >
                  <Camera className="h-4 w-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                    Upload New Photo
                  </Button>
                  {profileImage && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveImage}
                      className="text-destructive hover:text-destructive bg-transparent"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Recommended: Square image, at least 200x200px. Max 5MB.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Details Section */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Personal Details</CardTitle>
            <CardDescription>Update your name and contact information</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name">First Name</Label>
                <Input id="first-name" placeholder="John" defaultValue="John" className="bg-input border-border" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last Name</Label>
                <Input id="last-name" placeholder="Doe" defaultValue="Doe" className="bg-input border-border" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                defaultValue="+1 (555) 123-4567"
                className="bg-input border-border"
              />
              <p className="text-xs text-muted-foreground">
                This number will be used for trip notifications and emergencies
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Email Section (Read-only) */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Email Address</CardTitle>
            <CardDescription>Your email is used for login and cannot be changed here</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value="john.doe@example.com"
                disabled
                className="bg-secondary border-border text-muted-foreground"
              />
              <p className="text-xs text-muted-foreground">Contact support if you need to change your email address</p>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="bg-card border-destructive/30">
          <CardHeader>
            <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
            <CardDescription>Irreversible and destructive actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border border-border">
              <div>
                <p className="text-sm font-medium text-foreground">Delete Account</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <Button variant="destructive" size="sm">
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
