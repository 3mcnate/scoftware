import Link from "next/link"
import { Item, ItemContent, ItemTitle, ItemDescription, ItemMedia } from "@/components/ui/item"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface TripNavigationProps {
  previousTrip?: {
    id: string
    title: string
    date: string
  }
  nextTrip?: {
    id: string
    title: string
    date: string
  }
}

export function TripNavigation({ previousTrip, nextTrip }: TripNavigationProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 mt-8 pt-8 border-t-2 border-border">
      {previousTrip ? (
        <Item variant="outline" size="default" asChild>
          <Link href={`/trip/${previousTrip.id}`} className="group hover:border-primary h-full">
            <ItemMedia>
              <ChevronLeft className="h-5 w-5 text-muted-foreground" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>
                <span className="text-xs font-semibold text-muted-foreground">Previous Trip</span>
              </ItemTitle>
              <ItemDescription className="font-bold text-base text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {previousTrip.title}
              </ItemDescription>
              <p className="text-xs text-muted-foreground">{previousTrip.date}</p>
            </ItemContent>
          </Link>
        </Item>
      ) : (
        <div />
      )}

      {nextTrip ? (
        <Item variant="outline" size="default" asChild>
          <Link href={`/trip/${nextTrip.id}`} className="group hover:border-primary h-full flex-row-reverse">
            <ItemMedia>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </ItemMedia>
            <ItemContent className="text-right">
              <ItemTitle className="block w-full text-right">
                <span className="text-xs font-semibold text-muted-foreground">Next Trip</span>
              </ItemTitle>
              <ItemDescription className="font-bold text-base text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {nextTrip.title}
              </ItemDescription>
              <p className="text-xs text-muted-foreground">{nextTrip.date}</p>
            </ItemContent>
          </Link>
        </Item>
      ) : (
        <div />
      )}
    </div>
  )
}
