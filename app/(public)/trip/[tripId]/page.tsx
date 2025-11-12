import { TripHeader } from "@/features/trip-page/components/trip-header"
import { TripDetails } from "@/features/trip-page/components/trip-details"
import { SignupButtons } from "@/features/trip-page/components/signup-buttons"
import { TripNavigation } from "@/features/trip-page/components/trip-navigation"

export default function TripPage() {
  const tripData = {
    title: "Sur-Real Views in Big Sur",
    image: "/trip-pic-1.webp",
    meetDate: "Saturday, February 15, 2025",
    meetTime: "5:00 AM",
    returnTime: "8:00 PM",
    location: "Pfeiffer Big Sur State Park, Point Lobos State Natural Reserve",
    nativeLand: "Abenaki and Wabanaki Territory",
    activity: "Alpine Hiking",
    difficulty: "4/10",
    distance: "8.4 miles roundtrip",
    elevation: "4,250 ft gain",
    memberPrice: 121,
    nonMemberPrice: 158,
    driverPrice: 48,
    description:
      `Join us for a sur-real weekend adventure up the California coast to Big Sur! We’ll head out bright and sur-ly Friday morning and make our way to Monterey area with plenty of time to explore the charming town of Carmel and soak in some scenic Highway 1 vista points. Then we’ll set up camp at Pfeiffer Big Sur State Park and enjoy a lei-sur-ly evening. 

Saturday will be packed with sur-prisingly stunning hikes and gorgeous coastal views, as we explore Big Sur and Point Lobos State Natural Reserve and make stops at iconic spots like McWay Falls and the Henry Miller Memorial Library. After an ab-sur-dly scenic day, we’ll head back to camp at Pfeiffer Big Sur State Park and enjoy sleeping under the stars. Sunday we'll make our way back down the coast, stopping at cool spots like Morro Bay or the Elephant Seal Vista Point along the way. You’ll be back home in time for dinner, with a camera roll full of sur-real views and some great memories from one of California’s most iconic coastal trips.`,
    priorExperience:
      "Prior winter hiking experience strongly recommended. Participants should be comfortable hiking 8+ miles with significant elevation gain in winter conditions. Experience with microspikes and snowshoes required.",
    guides: [
      {
        name: "Sarah Chen",
        email: "sarah.chen@university.edu",
        role: "Lead Guide",
        image: "/female-outdoor-guide.jpg",
        initials: "SC",
      },
      {
        name: "Mike Torres",
        email: "mike.torres@university.edu",
        role: "Assistant Guide",
        image: "/male-mountain-guide.jpg",
        initials: "MT",
      },
    ],
    whatToBring: [
      "Insulated winter hiking boots (waterproof)",
      "Microspikes or crampons",
      "Snowshoes (if required)",
      "Winter jacket and insulated pants",
      "Multiple base layers (no cotton)",
      "Winter gloves and warm hat",
      "Goggles or sunglasses",
      "Headlamp with extra batteries",
      "2-3 liters of water (insulated bottles)",
      "High-energy snacks and lunch",
      "First aid kit and emergency supplies",
    ],
    included: [
      "Transportation from campus",
      "Group safety equipment (ropes, radio)",
      "Emergency shelter and supplies",
      "Hot drinks at trailhead",
      "Gas reimbursement for drivers",
    ],
    participantSpotsRemaining: 3,
    participantSpotsTotal: 8,
    driverSpotsRemaining: 1,
    driverSpotsTotal: 2,
  }

  return (
    <div className="min-h-screen bg-background">
      <TripHeader
        participantSpotsRemaining={tripData.participantSpotsRemaining}
        participantSpotsTotal={tripData.participantSpotsTotal}
        driverSpotsRemaining={tripData.driverSpotsRemaining}
        driverSpotsTotal={tripData.driverSpotsTotal}
      />

      <main className="container px-4 py-6 md:py-8 md:px-6 mx-auto">
        <TripDetails
          title={tripData.title}
          image={tripData.image}
          meetDate={tripData.meetDate}
          meetTime={tripData.meetTime}
          returnTime={tripData.returnTime}
          location={tripData.location}
          nativeLand={tripData.nativeLand}
          activity={tripData.activity}
          difficulty={tripData.difficulty}
          distance={tripData.distance}
          elevation={tripData.elevation}
          memberPrice={tripData.memberPrice}
          nonMemberPrice={tripData.nonMemberPrice}
          driverPrice={tripData.driverPrice}
          description={tripData.description}
          guides={tripData.guides}
          priorExperience={tripData.priorExperience}
          whatToBring={tripData.whatToBring}
          included={tripData.included}
        />

        <SignupButtons className="my-8" />

        <TripNavigation
          previousTrip={{
            id: "lake-placid-snowshoeing",
            title: "Lake Placid Snowshoeing Adventure",
            date: "February 8, 2025",
          }}
          nextTrip={{
            id: "white-mountains-skiing",
            title: "White Mountains Backcountry Skiing",
            date: "February 22, 2025",
          }}
        />
      </main>
    </div>
  )
}
