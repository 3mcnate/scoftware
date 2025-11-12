import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  MapPin,
  TrendingUp,
  Compass,
  DollarSign,
  Mail,
} from "lucide-react";
import { DifficultyModal } from "@/features/trip-page/components/difficulty-modal";
import Image from "next/image";

interface Guide {
  name: string;
  email: string;
  role: string;
  image?: string;
  initials: string;
}

interface TripDetailsProps {
  title: string;
  image: string;
  meetDate: string;
  meetTime: string;
  returnTime: string;
  location: string;
  nativeLand: string;
  activity: string;
  difficulty: string;
  distance: string;
  elevation: string;
  memberPrice: number;
  nonMemberPrice: number;
  driverPrice: number;
  description: string;
  guides: Guide[];
  priorExperience: string;
  whatToBring: string[];
  included: string[];
}

export function TripDetails({
  title,
  image,
  meetDate,
  meetTime,
  returnTime,
  location,
  nativeLand,
  activity,
  difficulty,
  distance,
  elevation,
  memberPrice,
  nonMemberPrice,
  driverPrice,
  description,
  guides,
  priorExperience,
}: TripDetailsProps) {
  const whatToBring = [
    "Sleeping bag",
    "Sleeping pad",
    "Day pack",
    "Mess kit (utensils and bowl/plate/tupperware)",
    "3+ liters of water",
    "Hat/sunscreen/sunglasses",
    "Comfortable, sturdy hiking shoes/boots",
    "Comfortable hiking clothes",
    "Toiletries/medications",
    "Headlamp/flashlight",
    "Rain jacket (prepare for potential rain)",
    "Warm jacket",
    "Warm clothes and layers for camping (it will get cold at night, as low as 40 °F!!)",
    "$$ for 2 lunches",
  ];

  const included = [
    "Snacks",
    "Breakfast, lunch, and dinner will be provided when a trip occurs during meal-times",
    "Any technical gear required (ie. kayaks, snowshoes, snorkels, backpacking packs, sleeping bags, fishing rods, etc.)",
    "All group / shared gear (tents, stoves, bear cans, first aid kit, etc.)",
    "Any permits or campsite reservations needed",
    "Cost of gas reimbursed for participant drivers",
    "Amazing guides who love the outdoors and do this for free! ",
  ];

  return (
    <div className="space-y-6">
      {/* Hero Image */}
      <div className="relative h-[300px] sm:h-[400px] md:h-[500px] w-full overflow-hidden rounded-xl">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-balance leading-tight">
            {title}
          </h1>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4 border-2">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Date & Time
              </p>
              <p className="text-sm font-bold text-foreground mt-1">
                {meetDate}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Meet: {meetTime} • Return: {returnTime}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-2">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Trip Location
              </p>
              <p className="text-sm font-bold text-foreground mt-1">
                {location}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-2">
          <div className="flex items-start gap-3">
            <Compass className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Activity
              </p>
              <p className="text-sm font-bold text-foreground mt-1">
                {activity}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-2">
          <div className="flex items-start gap-3">
            <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Difficulty
                </p>
                <DifficultyModal />
              </div>
              <p className="text-sm font-bold text-foreground mt-1">
                {difficulty}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{distance}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-4 md:p-6 border-2 bg-accent/10">
        <div className="flex items-center gap-2 mb-3">
          <DollarSign className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Trip Pricing</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="p-3 rounded-lg bg-card border-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Member
            </p>
            <p className="text-2xl font-bold text-primary mt-0.5">
              ${memberPrice}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-card border-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Non-Member
            </p>
            <p className="text-2xl font-bold text-primary mt-0.5">
              ${nonMemberPrice}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-card border-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Participant Driver
            </p>
            <p className="text-2xl font-bold text-primary mt-0.5">
              ${driverPrice}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              + gas reimbursed
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6 md:p-8 border-2">
        <h2 className="text-2xl font-bold mb-4 text-foreground">
          Trip Overview
        </h2>
        <div className="space-y-4">
          {priorExperience && (
            <div className="p-4 rounded-lg bg-accent/10 border-l-4 border-primary">
              <p className="text-sm font-semibold text-foreground mb-1">
                Recommended Prior Experience:
              </p>
              <p className="text-sm text-foreground">{priorExperience}</p>
            </div>
          )}
          <p className="text-base leading-relaxed text-foreground">
            {description}
          </p>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 border-2">
          <h3 className="text-xl font-bold text-foreground">What to Bring</h3>
          <p>
            *REMINDER (overnights only) : if you do not have a sleeping bag,
            sleeping pad, backpacking pack, or other technical gear
            (non-clothing), do not panic, SC Outfitters has these items for you!
            Your guides will send out a gear-request form the week of your trip
            where you’ll let them know what gear you need!
          </p>
          <ul className="space-y-2">
            {whatToBring.map((item, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-md text-foreground"
              >
                <span className="text-primary font-bold mt-0.5">•</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6 border-2">
          <h3 className="text-xl font-bold text-foreground">
            Price of the trip includes (and we will provide):
          </h3>
          <ul className="space-y-2">
            {included.map((item, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-md text-foreground"
              >
                <span className="text-primary font-bold mt-0.5">✓</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="p-6 md:p-8 border-2">
        <h2 className="text-2xl font-bold mb-6 text-foreground">
          Contact the Guides
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {guides.map((guide, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 rounded-lg bg-muted/50"
            >
              <Avatar className="h-14 w-14 border-2 border-primary">
                <AvatarImage
                  src={guide.image || "/placeholder.svg"}
                  alt={guide.name}
                />
                <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                  {guide.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-bold text-foreground">{guide.name}</p>
                <a
                  href={`mailto:${guide.email}`}
                  className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
                >
                  <Mail className="h-3 w-3" />
                  {guide.email}
                </a>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 md:p-8 border-2 bg-muted/30">
        <h2 className="text-2xl font-bold mb-4 text-foreground">
          Important Information
        </h2>
        <div className="space-y-4 text-sm leading-relaxed">
          <div className="p-4 rounded-lg bg-card border">
            <h3 className="font-bold text-base text-foreground mb-2">
              Cancellation and Refund Policy
            </h3>
            <p className="text-muted-foreground mb-2">
              All SC Outfitters trips have a no-refund policy unless a
              substitute participant can be found. In the event your trip
              requires added reporting measures of participants (plane tickets,
              external providers, rental services, etc.) dropping the trip close
              to the date of the trip will not allow for the spot to be
              re-filled.
            </p>
            <a
              href="#"
              className="text-primary hover:underline font-semibold inline-flex items-center gap-1"
            >
              Read complete cancellation/refund policy →
            </a>
          </div>

          <div className="p-4 rounded-lg bg-card border">
            <h3 className="font-bold text-base text-foreground mb-2">
              Questions or Concerns?
            </h3>
            <p className="text-muted-foreground">
              If you have any questions or concerns about the physical activity,
              recommended prior experience, or gear needed on any kind of trip
              please contact the guides as soon as possible!
            </p>
          </div>

          <div className="p-4 rounded-lg bg-card border">
            <h3 className="font-bold text-base text-foreground mb-2">
              Non-Discrimination Statement
            </h3>
            <p className="text-muted-foreground">
              This program is open to all eligible individuals. SC Outfitters
              operates all of its programs and activities consistent with the
              University&apos;s Notice of Non-Discrimination. Eligibility is not
              determined based on race, sex, ethnicity, sexual orientation, or
              any other prohibited factor.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-card border">
            <h3 className="font-bold text-base text-foreground mb-2">
              Accessibility Accommodations
            </h3>
            <p className="text-muted-foreground">
              Individuals with disabilities who need accommodations to attend
              this event may contact the guides listed above. We request that
              individuals requiring accommodations or auxiliary aids such as
              sign language interpreters and alternative format materials notify
              us at least 7 days prior to the event. Every reasonable effort
              will be made to provide reasonable accommodations in an effective
              and timely manner.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
