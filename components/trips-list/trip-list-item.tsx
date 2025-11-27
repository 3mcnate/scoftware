import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemHeader,
} from "@/components/ui/item";
import { Compass, MapPin, TrendingUp, User } from "lucide-react";
import Image from "next/image";

interface Trip {
  id: string;
  picture: string;
  title: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  activity: string;
  difficulty: string;
  priorExperience: string;
  participantSpotsLeft: number;
  driverSpotsLeft: number;
  location: string;
}

interface TripListItemProps {
  trip: Trip;
}

export function TripListItem({ trip }: TripListItemProps) {
  return (
    <Link href={`/trip/${trip.id}`} className="block">
      <Item
        variant="outline"
        size="default"
        className="hover:bg-accent/50 transition-colors relative flex-col md:flex-row items-start p-6"
      >
        <ItemMedia variant="image" className="aspect-12/9 relative h-60 w-full md:w-auto">
          <Image
            src={trip.picture}
            alt={trip.title}
            className="size-full object-cover"
            fill
          />
        </ItemMedia>

        <ItemContent className="flex-1 min-w-0">
          <ItemHeader>
            <ItemTitle className="text-xl md:text-2xl font-bold">
              {trip.title}
            </ItemTitle>
          </ItemHeader>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium">
                {trip.startDate === trip.endDate ? (
                  <>
                    {trip.startDate} • {trip.startTime} - {trip.endTime}
                  </>
                ) : (
                  <>
                    {trip.startDate} {trip.startTime} → {trip.endDate}{" "}
                    {trip.endTime}
                  </>
                )}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary shrink-0" />
              <span className="font-medium">Location: {trip.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Compass className="h-4 w-4 text-primary shrink-0" />
              <span className="font-medium">Activity: {trip.activity}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-primary shrink-0" />
              <span className="font-medium">Difficulty: {trip.difficulty}</span>
            </div>

            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span className="font-medium line-clamp-2">
                Recommended prior experience: {trip.priorExperience}
              </span>
            </div>
          </div>
        </ItemContent>

        <div className="absolute top-8 right-8 md:left-8 lg:top-8 lg:left-auto lg:right-6 flex gap-2">
          <Badge
            variant={trip.participantSpotsLeft > 0 ? "default" : "secondary"}
            className="shadow-md"
          >
            {trip.participantSpotsLeft} spots left
          </Badge>
          <Badge
            variant={trip.driverSpotsLeft > 0 ? "default" : "secondary"}
            className="shadow-md"
          >
            {trip.driverSpotsLeft} drivers
          </Badge>
        </div>
      </Item>
    </Link>
  );
}
