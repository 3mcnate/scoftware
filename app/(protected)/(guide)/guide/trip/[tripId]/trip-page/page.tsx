"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ImagePlus, X, Plus, Save } from "lucide-react"

export default function TripPageTab() {
  const [packingItems, setPackingItems] = useState([
    "Hiking boots",
    "Water bottle (2L minimum)",
    "Sunscreen",
    "Hat",
    "Snacks",
    "First aid kit",
  ])
  const [newItem, setNewItem] = useState("")

  const addPackingItem = () => {
    if (newItem.trim()) {
      setPackingItems([...packingItems, newItem.trim()])
      setNewItem("")
    }
  }

  const removePackingItem = (index: number) => {
    setPackingItems(packingItems.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-8">
      {/* Trip Picture */}
      <Card>
        <CardHeader>
          <CardTitle>Trip Picture</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer">
            <ImagePlus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-2">Drag and drop an image, or click to browse</p>
            <p className="text-xs text-muted-foreground">Recommended: 1200x630px, JPG or PNG</p>
            <Button variant="outline" className="mt-4 bg-transparent">
              Upload Image
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Trip Details */}
      <Card>
        <CardHeader>
          <CardTitle>Trip Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="meetingTime">Meeting Time</Label>
              <Input id="meetingTime" type="datetime-local" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meetingPlace">Meeting Place</Label>
              <Input id="meetingPlace" placeholder="e.g., Student Union Building" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trailLength">Trail Length</Label>
              <Input id="trailLength" placeholder="e.g., 8 miles round trip" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="activities">Activities</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select activities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hiking">Hiking</SelectItem>
                  <SelectItem value="backpacking">Backpacking</SelectItem>
                  <SelectItem value="camping">Camping</SelectItem>
                  <SelectItem value="climbing">Rock Climbing</SelectItem>
                  <SelectItem value="kayaking">Kayaking</SelectItem>
                  <SelectItem value="skiing">Skiing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nativeLand">Native Land</Label>
              <Input id="nativeLand" placeholder="e.g., Havasupai and Hualapai territories" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Recommended Prior Experience</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None - Beginner friendly</SelectItem>
                  <SelectItem value="some">Some outdoor experience</SelectItem>
                  <SelectItem value="moderate">Moderate experience required</SelectItem>
                  <SelectItem value="advanced">Advanced experience required</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trip Description */}
      <Card>
        <CardHeader>
          <CardTitle>Trip Description</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Describe the trip, what participants can expect, highlights, and any important information..."
            className="min-h-[200px]"
          />
          <p className="text-xs text-muted-foreground mt-2">Markdown formatting is supported</p>
        </CardContent>
      </Card>

      {/* Packing List */}
      <Card>
        <CardHeader>
          <CardTitle>Packing List</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {packingItems.map((item, index) => (
              <Badge key={index} variant="secondary" className="px-3 py-1 text-sm flex items-center gap-2">
                {item}
                <button onClick={() => removePackingItem(index)} className="hover:text-destructive">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add packing item..."
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addPackingItem()}
            />
            <Button onClick={addPackingItem} variant="outline" className="bg-transparent">
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  )
}
