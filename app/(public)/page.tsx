import { TripsListHeader } from "@/features/trips-list/trips-list-header";
import { TripsList } from "@/features/trips-list/trips-list";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function TripsPage() {
  const currentTrips = [
    {
      id: "mount-washington-winter",
      image: "/snowy-mountain-peak-adventure-hiking.jpg",
      title: "Mount Washington Winter Summit",
      startDate: "Saturday, February 15, 2025",
      startTime: "5:00 AM",
      endDate: "Saturday, February 15, 2025",
      endTime: "8:00 PM",
      activity: "Alpine Hiking",
      difficulty: "Level 8 - Very Difficult",
      priorExperience:
        "Prior winter hiking experience strongly recommended. Participants should be comfortable hiking 8+ miles with significant elevation gain in winter conditions.",
      participantSpotsLeft: 3,
      driverSpotsLeft: 1,
	  location: "Sequoia National Park"
    },
    {
      id: "lake-placid-snowshoeing",
      image: "/placeholder.svg?height=400&width=600",
      title: "Lake Placid Snowshoeing Adventure",
      startDate: "Saturday, February 8, 2025",
      startTime: "6:00 AM",
      endDate: "Saturday, February 8, 2025",
      endTime: "7:00 PM",
      activity: "Snowshoeing",
      difficulty: "Level 4 - Moderate",
      priorExperience:
        "No prior snowshoeing experience required. Comfortable hiking 4-6 miles on relatively flat terrain.",
      participantSpotsLeft: 5,
      driverSpotsLeft: 2,
	  location: "Sequoia National Park"
    },
    {
      id: "white-mountains-skiing",
      image: "/placeholder.svg?height=400&width=600",
      title: "White Mountains Backcountry Skiing",
      startDate: "Saturday, February 22, 2025",
      startTime: "5:30 AM",
      endDate: "Sunday, February 23, 2025",
      endTime: "6:00 PM",
      activity: "Backcountry Skiing",
      difficulty: "Level 9 - Extremely Difficult",
      priorExperience:
        "Advanced skiing ability required. Must be comfortable in backcountry terrain and have avalanche awareness training.",
      participantSpotsLeft: 2,
      driverSpotsLeft: 0,
	  location: "Sequoia National Park"
    },
    {
      id: "acadia-coastal-camping",
      image: "/placeholder.svg?height=400&width=600",
      title: "Acadia National Park Coastal Camping",
      startDate: "Friday, March 7, 2025",
      startTime: "4:00 PM",
      endDate: "Sunday, March 9, 2025",
      endTime: "5:00 PM",
      activity: "Camping & Hiking",
      difficulty: "Level 3 - Easy-Moderate",
      priorExperience:
        "Beginner friendly! Open to all fitness levels. Basic camping knowledge helpful but not required.",
      participantSpotsLeft: 6,
      driverSpotsLeft: 2,
	  location: "Sequoia National Park"
    },
  ];

  const pastTrips = [
    {
      id: "adirondacks-ice-climbing",
      image: "/placeholder.svg?height=400&width=600",
      title: "Adirondacks Ice Climbing Expedition",
      startDate: "Saturday, January 25, 2025",
      startTime: "5:00 AM",
      endDate: "Sunday, January 26, 2025",
      endTime: "7:00 PM",
      activity: "Ice Climbing",
      difficulty: "Level 7 - Difficult",
      priorExperience:
        "Prior climbing experience required. Must be comfortable with heights and technical equipment.",
      participantSpotsLeft: 0,
      driverSpotsLeft: 0,
	  location: "Sequoia National Park"
    },
    {
      id: "winter-camping-basics",
      image: "/placeholder.svg?height=400&width=600",
      title: "Winter Camping Basics Workshop",
      startDate: "Saturday, January 18, 2025",
      startTime: "9:00 AM",
      endDate: "Saturday, January 18, 2025",
      endTime: "4:00 PM",
      activity: "Workshop & Camping",
      difficulty: "Level 2 - Beginner",
      priorExperience:
        "No experience required! Perfect for first-time winter campers.",
      participantSpotsLeft: 0,
      driverSpotsLeft: 0,
	  location: "Sequoia National Park"
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <TripsListHeader />

      <main className="container px-4 py-6 md:py-8 md:px-6 mx-auto">
        <div className="mb-6 text-center py-10 md:py-20">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            UPCOMING TRIPS!
          </h1>
        </div>

        <TripsList trips={currentTrips} />

        <div className="py-10 mt-10">
          <h1 className="text-3xl md:text-4xl font-medium text-foreground">
            Past Trips
          </h1>
        </div>

        <TripsList trips={pastTrips} isPast />
      </main>
    </div>
  );
}
