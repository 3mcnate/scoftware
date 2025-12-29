"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Download, Mail, CheckCircle, AlertCircle } from "lucide-react"

const participants = [
  {
    id: 1,
    name: "Jordan Smith",
    email: "jordan@email.com",
    avatar: "/placeholder.svg?height=32&width=32",
    signupDate: "Feb 15, 2025",
    waiverSigned: true,
    membershipStatus: "active",
  },
  {
    id: 2,
    name: "Taylor Johnson",
    email: "taylor@email.com",
    avatar: "/placeholder.svg?height=32&width=32",
    signupDate: "Feb 16, 2025",
    waiverSigned: true,
    membershipStatus: "active",
  },
  {
    id: 3,
    name: "Casey Williams",
    email: "casey@email.com",
    avatar: "/placeholder.svg?height=32&width=32",
    signupDate: "Feb 17, 2025",
    waiverSigned: false,
    membershipStatus: "active",
  },
  {
    id: 4,
    name: "Riley Brown",
    email: "riley@email.com",
    avatar: "/placeholder.svg?height=32&width=32",
    signupDate: "Feb 18, 2025",
    waiverSigned: true,
    membershipStatus: "expired",
  },
]

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
  return (
    <div className="space-y-8">
      {/* Signups Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Participants</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{participants.length} of 15 spots filled</p>
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
                <TableHead>Signup Date</TableHead>
                <TableHead>Waiver</TableHead>
                <TableHead>Membership</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participants.map((participant) => (
                <TableRow key={participant.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={participant.avatar || "/placeholder.svg"} alt={participant.name} />
                        <AvatarFallback>
                          {participant.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{participant.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{participant.email}</TableCell>
                  <TableCell className="text-muted-foreground">{participant.signupDate}</TableCell>
                  <TableCell>
                    {participant.waiverSigned ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">Signed</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-amber-600">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">Pending</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={participant.membershipStatus === "active" ? "default" : "destructive"}>
                      {participant.membershipStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Mail className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
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
