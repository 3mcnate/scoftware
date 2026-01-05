"use client"

import { useParams } from "next/navigation"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Download, 
  Mail, 
  CheckCircle, 
  AlertCircle, 
  MoreHorizontal, 
  XCircle, 
  RefreshCcw 
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTripTickets } from "@/data/client/tickets/get-trip-tickets"
import { useUpdateTicket } from "@/data/client/tickets/update-ticket"
import { createClient } from "@/utils/supabase/browser"
import { getInitials } from "@/utils/names"
import { getAvatarUrl } from "@/data/client/storage/avatars"
import { toast } from "sonner"
import { useTrip } from "@/data/client/trips/get-guide-trips"

const waitlist = [
  {
    id: 5,
    name: "Morgan Davis",
    email: "morgan@email.com",
    avatar: "/placeholder.svg?height=32&width=32",
    signupDate: "Feb 19, 2025",
    position: 1,
  },
  {
    id: 6,
    name: "Quinn Miller",
    email: "quinn@email.com",
    avatar: "/placeholder.svg?height=32&width=32",
    signupDate: "Feb 20, 2025",
    position: 2,
  },
]

export default function SignupsPage() {
  const params = useParams()
  const tripId = params.tripId as string
  const { data: tickets, isLoading: isTicketsLoading } = useTripTickets(tripId)
	const { data: trip, isLoading: isTripLoading } = useTrip(tripId);
  const { mutateAsync: updateTicket } = useUpdateTicket()

  const openWaiver = async (path: string) => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.storage
        .from("waivers")
        .createSignedUrl(path, 60)

      if (error) throw error
      if (data?.signedUrl) {
        window.open(data.signedUrl, "_blank")
      }
    } catch (error) {
      toast.error("Failed to open waiver")
      console.error(error)
    }
  }

  const handleCancel = async (ticketId: string) => {
    try {
      await updateTicket({
        id: ticketId,
        cancelled: true,
        cancelled_at: new Date().toISOString()
      })
      toast.success("Ticket cancelled")
    } catch (error) {
      toast.error(`Failed to cancel ticket`)
			console.error(error)
    }
  }

  const handleRefund = async (ticketId: string) => {
    toast.error("Not implemented yet " + ticketId)
  }

  if (isTicketsLoading || isTripLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading participants...</div>
  }

	if (!trip) {
		return <div className="p-8 text-center">Could not load trip</div>
	}

  const activeParticipantsCount = tickets?.filter(t => !t.cancelled).length || 0

  return (
    <div className="space-y-8">
      {/* Signups Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Participants</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {activeParticipantsCount} of {trip.driver_spots + trip.participant_spots}
            </p>
          </div>
          <Button variant="outline" className="bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            Download Trip Report
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Participant</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Signup Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Waivers</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets?.map((ticket) => {
                const user = ticket.user
                const isDriver = ticket.type === "driver"
                
                return (
                  <TableRow key={ticket.id} className={ticket.cancelled ? "bg-muted/30" : ""}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage 
                            src={user?.avatar_path ? getAvatarUrl(user.avatar_path) : undefined} 
                            alt={user?.first_name} 
                          />
                          <AvatarFallback>
                            {getInitials(user?.first_name, user?.last_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {user?.first_name} {user?.last_name}
                          </span>
                          <div className="flex gap-1 mt-1">
                            {ticket.cancelled && (
                              <Badge variant="destructive" className="text-[10px] h-4 px-1">
                                Cancelled
                              </Badge>
                            )}
                            {ticket.refunded && (
                              <Badge variant="outline" className="text-[10px] h-4 px-1 text-amber-600 border-amber-600">
                                Refunded
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
											{user.email}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm">
                      {user?.phone || "-"}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm">
                      {format(new Date(ticket.created_at), "MMM d, yyyy h:mm a")}
                    </TableCell>
                    <TableCell>
                      ${ticket.amount_paid}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {ticket.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {/* Participant Waiver */}
                        <Badge 
                          variant={ticket.waiver_filepath ? "default" : "outline"}
                          className={`cursor-pointer w-fit ${!ticket.waiver_filepath ? "text-muted-foreground border-dashed" : "hover:bg-primary/90"}`}
                          onClick={() => ticket.waiver_filepath && openWaiver(ticket.waiver_filepath)}
                        >
                          {ticket.waiver_filepath ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                          Participant
                        </Badge>
                        
                        {/* Driver Waiver */}
                        {isDriver && (
                          <Badge 
                            variant={ticket.driver_waiver_filepath ? "default" : "outline"}
                            className={`cursor-pointer w-fit ${!ticket.driver_waiver_filepath ? "text-muted-foreground border-dashed" : "hover:bg-primary/90"}`}
                            onClick={() => ticket.driver_waiver_filepath && openWaiver(ticket.driver_waiver_filepath)}
                          >
                            {ticket.driver_waiver_filepath ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                            Driver
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleCancel(ticket.id)} disabled={ticket.cancelled || ticket.refunded}>
                            <XCircle className="mr-2 h-4 w-4" />
                            Cancel Ticket
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRefund(ticket.id)} disabled={ticket.refunded}>
                            <RefreshCcw className="mr-2 h-4 w-4" />
                            Refund Ticket
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            window.location.href = `mailto:?subject=Trip Info&body=Hi ${user?.first_name},`
                          }}>
                            <Mail className="mr-2 h-4 w-4" />
                            Email Participant
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
              {tickets?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No participants yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Waitlist Section */}
      <Card>
        <CardHeader>
          <CardTitle>Waitlist</CardTitle>
          <p className="text-sm text-muted-foreground">{waitlist.length} people on the waitlist</p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Position</TableHead>
                <TableHead>Participant</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Signup Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {waitlist.map((person) => (
                <TableRow key={person.id}>
                  <TableCell>
                    <Badge variant="outline">#{person.position}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={person.avatar || "/placeholder.svg"} alt={person.name} />
                        <AvatarFallback>
                          {person.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{person.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{person.email}</TableCell>
                  <TableCell className="text-muted-foreground">{person.signupDate}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="bg-transparent">
                      Move to Signups
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
