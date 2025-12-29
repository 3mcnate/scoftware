"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Save, Trash2, UserPlus, X } from "lucide-react"

const currentGuides = [
  { name: "Alex Chen", email: "alex@example.com", avatar: "/placeholder.svg?height=40&width=40", role: "Lead" },
  { name: "Maria Santos", email: "maria@example.com", avatar: "/placeholder.svg?height=40&width=40", role: "Co-lead" },
]

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      {/* Basic Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Trip Settings</CardTitle>
          <CardDescription>Configure basic trip settings and visibility</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="tripName">Trip Name</Label>
            <Input id="tripName" defaultValue="Grand Canyon Expedition" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="maxParticipants">Maximum Participants</Label>
              <Input id="maxParticipants" type="number" defaultValue={15} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signupDeadline">Signup Deadline</Label>
              <Input id="signupDeadline" type="datetime-local" />
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Waitlist</Label>
              <p className="text-sm text-muted-foreground">
                Allow participants to join a waitlist when the trip is full
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Require Membership</Label>
              <p className="text-sm text-muted-foreground">Participants must have an active membership to sign up</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-approve Signups</Label>
              <p className="text-sm text-muted-foreground">Automatically approve participants without manual review</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Trip Guides */}
      <Card>
        <CardHeader>
          <CardTitle>Trip Guides</CardTitle>
          <CardDescription>Manage guides assigned to this trip</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentGuides.map((guide, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={guide.avatar || "/placeholder.svg"} alt={guide.name} />
                  <AvatarFallback>
                    {guide.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{guide.name}</p>
                  <p className="text-sm text-muted-foreground">{guide.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Select defaultValue={guide.role.toLowerCase()}>
                  <SelectTrigger className="w-28">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lead">Lead</SelectItem>
                    <SelectItem value="co-lead">Co-lead</SelectItem>
                    <SelectItem value="assistant">Assistant</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          <Button variant="outline" className="w-full bg-transparent">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Guide
          </Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions for this trip</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-destructive/30 rounded-lg">
            <div>
              <p className="font-medium">Cancel Trip</p>
              <p className="text-sm text-muted-foreground">Cancel this trip and notify all participants</p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Cancel Trip</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel this trip?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will cancel the trip and send a notification to all {12} registered participants. This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep Trip</AlertDialogCancel>
                  <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Cancel Trip
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <div className="flex items-center justify-between p-4 border border-destructive/30 rounded-lg">
            <div>
              <p className="font-medium">Delete Trip</p>
              <p className="text-sm text-muted-foreground">Permanently delete this trip and all associated data</p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this trip permanently?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the trip, all signups, budget data, and associated information. This
                    action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete Permanently
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button>
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  )
}
