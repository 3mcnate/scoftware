import Link from "next/link"
import { Card } from "@/components/ui/card"
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
        <Link href={`/trips/${previousTrip.id}`} className="group">
          <Card className="p-4 border-2 hover:border-primary transition-colors h-full">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <ChevronLeft className="h-4 w-4" />
              <span className="font-semibold">Previous Trip</span>
            </div>
            <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors text-balance">
              {previousTrip.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">{previousTrip.date}</p>
          </Card>
        </Link>
      ) : (
        <div />
      )}

      {nextTrip ? (
        <Link href={`/trips/${nextTrip.id}`} className="group">
          <Card className="p-4 border-2 hover:border-primary transition-colors h-full text-right">
            <div className="flex items-center justify-end gap-2 text-muted-foreground text-xs mb-1">
              <span className="font-semibold">Next Trip</span>
              <ChevronRight className="h-4 w-4" />
            </div>
            <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors text-balance">
              {nextTrip.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">{nextTrip.date}</p>
          </Card>
        </Link>
      ) : (
        <div />
      )}
    </div>
  )
}
