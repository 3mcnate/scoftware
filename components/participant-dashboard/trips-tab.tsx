"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, AlertTriangle, ChevronRight } from "lucide-react"

const trips = [
  {
    id: 1,
    name: "Grand Canyon Adventure",
    location: "Arizona, USA",
    date: "Dec 15-18, 2025",
    participants: 24,
    image: "/placeholder.svg?height=200&width=400",
    waiverRequired: true,
    status: "upcoming",
  },
  {
    id: 2,
    name: "Yellowstone Expedition",
    location: "Wyoming, USA",
    date: "Jan 5-10, 2026",
    participants: 18,
    image: "/placeholder.svg?height=200&width=400",
    waiverRequired: false,
    status: "upcoming",
  },
  {
    id: 3,
    name: "Yosemite Camping Trip",
    location: "California, USA",
    date: "Feb 20-23, 2026",
    participants: 32,
    image: "/placeholder.svg?height=200&width=400",
    waiverRequired: true,
    status: "upcoming",
  },
  {
    id: 4,
    name: "Pacific Coast Highway",
    location: "California, USA",
    date: "Mar 8-12, 2026",
    participants: 12,
    image: "/placeholder.svg?height=200&width=400",
    waiverRequired: false,
    status: "upcoming",
  },
  {
    id: 5,
    name: "Rocky Mountains Trek",
    location: "Colorado, USA",
    date: "Nov 1-5, 2025",
    participants: 20,
    image: "/placeholder.svg?height=200&width=400",
    waiverRequired: false,
    status: "completed",
  },
  {
    id: 6,
    name: "Zion National Park",
    location: "Utah, USA",
    date: "Oct 10-13, 2025",
    participants: 16,
    image: "/placeholder.svg?height=200&width=400",
    waiverRequired: false,
    status: "completed",
  },
]

export function TripsTab() {
  const upcomingTrips = trips.filter((t) => t.status === "upcoming")
  const pastTrips = trips.filter((t) => t.status === "completed")
  const waiverCount = trips.filter((t) => t.waiverRequired).length

  return (
    <div className="space-y-8">
      {waiverCount > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-warning/10 border border-warning/20">
          <AlertTriangle className="h-5 w-5 text-warning shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              {waiverCount} trip{waiverCount > 1 ? "s" : ""} require{waiverCount === 1 ? "s" : ""} waiver signature
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Please sign the required waivers before your trip dates
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="text-warning border-warning/30 hover:bg-warning/10 bg-transparent"
          >
            View All
          </Button>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Upcoming Trips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      </div>

      {pastTrips.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Past Trips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pastTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function TripCard({ trip }: { trip: (typeof trips)[0] }) {
  return (
    <Card className="bg-card border-border overflow-hidden group hover:border-muted-foreground/30 transition-colors">
      <div className="relative h-36 overflow-hidden">
        <img
          src={trip.image || "/placeholder.svg"}
          alt={trip.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {trip.waiverRequired && (
          <Badge className="absolute top-2 right-2 bg-warning text-warning-foreground hover:bg-warning">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Waiver Required
          </Badge>
        )}
        {trip.status === "completed" && (
          <Badge className="absolute top-2 right-2 bg-muted text-muted-foreground">Completed</Badge>
        )}
      </div>
      <CardHeader className="pb-2">
        <h3 className="font-semibold text-foreground text-base">{trip.name}</h3>
      </CardHeader>
      <CardContent className="pb-3 space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          {trip.location}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {trip.date}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          {trip.participants} participants
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="ghost" className="w-full justify-between text-muted-foreground hover:text-foreground">
          View Details
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
