import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DashboardHeader() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-foreground flex items-center justify-center">
            <span className="text-background font-semibold text-sm">T</span>
          </div>
          <span className="text-foreground font-semibold">TripManager</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-warning rounded-full" />
          </Button>
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" />
            <AvatarFallback className="bg-secondary text-secondary-foreground">JD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
