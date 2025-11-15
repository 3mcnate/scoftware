import {
  Item,
  ItemContent,
  ItemGroup,
  ItemSeparator,
} from "@/components/ui/item";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  MapPin,
  TrendingUp,
  Compass,
  Mail,
  Mountain,
  Footprints,
  Clock,
  TentTree,
} from "lucide-react";
import { DifficultyModal } from "@/features/trip-page/components/difficulty-modal";
import { TripDetailItem } from "@/features/trip-page/components/trip-detail-item";
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
  returnDate: string;
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
  returnDate,
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
      </div>

      {/* Title and Pricing Section */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground text-balance leading-tight mb-3 lg:mb-4">
            {title}
          </h1>
          <p className="text-base sm:text-lg">
            {meetDate} @ {meetTime} - {returnDate} @ {returnTime}
          </p>
        </div>

        <div className="lg:shrink-0">
          <Item
            variant="default"
            className="bg-accent/10 lg:pl-0 lg:pt-0 w-full"
          >
            <ItemContent className="flex-col">
              <ItemGroup className="gap-3 lg:gap-2">
                <div className="flex items-baseline justify-between gap-8">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Member
                  </span>
                  <span className="text-xl font-medium ">${memberPrice}</span>
                </div>
                <ItemSeparator className="block lg:hidden" />
                <div className="flex items-baseline justify-between gap-8">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Non-Member
                  </span>
                  <span className="text-xl font-medium ">
                    ${nonMemberPrice}
                  </span>
                </div>
                <ItemSeparator className="block lg:hidden" />
                <div className="flex items-baseline justify-between gap-8">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Driver
                  </span>
                  <span className="text-xl font-medium ">${driverPrice}</span>
                </div>
              </ItemGroup>
            </ItemContent>
          </Item>
        </div>
      </div>

      <ItemGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <TripDetailItem
          icon={Clock}
          label="Meet"
          value="Friday, 11/14, 7 A.M. @ Trader Joe's Elevators"
        />

        <TripDetailItem
          icon={Calendar}
          label="Return"
          value="Sunday, 11/16 around 6 P.M."
        />

        <TripDetailItem
          icon={TentTree}
          label="Activity"
          value="hiking, sightseeing, camping"
        />

        <TripDetailItem
          icon={TrendingUp}
          label="Difficulty"
          value="(4/10) Easy-Medium"
          titleAction={<DifficultyModal />}
        />

        <TripDetailItem
          icon={Footprints}
          label="Trail"
          value="Distance: ~6/7 miles, ~500 ft elevation"
        />

        <TripDetailItem
          icon={Compass}
          label="Recommended Prior Experience"
          value="none!"
        />

        <TripDetailItem
          icon={MapPin}
          label="Location of Trip"
          value="Pfeiffer Big Sur State Park, Point Lobos State Natural Reserve"
        />

        <TripDetailItem
          icon={Mountain}
          label="Native Land"
          value="Salinan, Esselen"
        />
      </ItemGroup>

      <Item variant="outline" className="p-6 md:p-8">
        <ItemContent>
          <h2 className="text-2xl font-bold mb-4 text-foreground">Overview</h2>
          <div className="space-y-4">
            <p className="text-base leading-relaxed text-foreground">
              {description}
            </p>
          </div>
        </ItemContent>
      </Item>

      <div className="grid gap-6 md:grid-cols-2">
        <Item variant="outline" className="p-6 items-start">
          <ItemContent>
            <h3 className="text-xl font-bold text-foreground mb-4">
              What to Bring
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              *REMINDER (overnights only) : if you do not have a sleeping bag,
              sleeping pad, backpacking pack, or other technical gear
              (non-clothing), do not panic, SC Outfitters has these items for
              you! Your guides will send out a gear-request form the week of
              your trip where you&apos;ll let them know what gear you need!
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
          </ItemContent>
        </Item>

        <Item variant="outline" className="p-6 items-start">
          <ItemContent>
            <h3 className="text-xl font-bold text-foreground mb-4">
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
          </ItemContent>
        </Item>
      </div>

      <Item variant="outline" className="p-6 md:p-8">
        <ItemContent>
          <h2 className="text-2xl font-bold mb-6 text-foreground">
            Contact the Guides
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {guides.map((guide, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-lg bg-muted/50"
              >
                <Avatar className="h-14 w-14">
                  <AvatarImage
                    src={guide.image || "/placeholder.svg"}
                    alt={guide.name}
                  />
                  <AvatarFallback className="bg-foreground text-primary-foreground font-bold">
                    {guide.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-bold text-foreground">{guide.name}</p>
                  <p className="text-xs flex items-center gap-1 mt-1">
                    <Mail className="h-3 w-3" />
                    {guide.email}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ItemContent>
      </Item>

      <Item variant="outline" className="p-6 md:p-8 bg-muted/30">
        <ItemContent>
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
                requires added reporting measures of participants (plane
                tickets, external providers, rental services, etc.) dropping the
                trip close to the date of the trip will not allow for the spot
                to be re-filled.
              </p>
              <a
                href="https://www.scoutfitters.org/cancellation-policy"
                className="hover:underline hover:text-primary font-semibold inline-flex items-center gap-1"
              >
                Read complete cancellation/refund policy →
              </a>
            </div>

            <div className="p-4 rounded-lg bg-card border">
              <h3 className="font-bold text-base text-foreground mb-2">
                Questions or Concerns?
              </h3>
              <p className="text-muted-foreground">
                If you have any questions or concerns about the physical
                activity, recommended prior experience, or gear needed on any
                kind of trip please contact the guides as soon as possible!
              </p>
            </div>

            <div className="p-4 rounded-lg bg-card border">
              <h3 className="font-bold text-base text-foreground mb-2">
                Non-Discrimination Statement
              </h3>
              <p className="text-muted-foreground">
                This program is open to all eligible individuals. SC Outfitters
                operates all of its programs and activities consistent with the
                University&apos;s Notice of Non-Discrimination. Eligibility is
                not determined based on race, sex, ethnicity, sexual
                orientation, or any other prohibited factor.
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
                sign language interpreters and alternative format materials
                notify us at least 7 days prior to the event. Every reasonable
                effort will be made to provide reasonable accommodations in an
                effective and timely manner.
              </p>
            </div>
          </div>
        </ItemContent>
      </Item>
    </div>
  );
}
