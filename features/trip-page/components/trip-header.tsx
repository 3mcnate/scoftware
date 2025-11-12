"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mountain } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { SignupButtons } from "@/features/trip-page/components/signup-buttons"
import Image from "next/image"

interface TripHeaderProps {
  participantSpotsRemaining: number
  participantSpotsTotal: number
  driverSpotsRemaining: number
  driverSpotsTotal: number
}

export function TripHeader({
  participantSpotsRemaining,
  participantSpotsTotal,
  driverSpotsRemaining,
  driverSpotsTotal,
}: TripHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/80">
      <div className="container flex h-auto mx-auto flex-col gap-3 px-4 py-3 md:h-16 md:flex-row md:items-center md:justify-between md:py-0 md:px-6">
        <div className="flex items-center justify-between md:justify-start gap-3">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" height={100} width={100} alt="logo" />
          </div>

          <div className="flex gap-2 md:hidden">
            <Badge variant="secondary" className="font-bold text-xs">
              {participantSpotsRemaining}/{participantSpotsTotal} spots left
            </Badge>
            <Badge variant="secondary" className="font-bold text-xs">
              {driverSpotsRemaining}/{driverSpotsTotal} drivers spots left
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-wrap md:flex-nowrap">
          {/* Desktop spot counters */}
          <div className="hidden md:flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-muted-foreground font-medium">Participant Spots</p>
              <p className="text-lg font-bold text-foreground">
                {participantSpotsRemaining}/{participantSpotsTotal} <span className="hidden lg:inline-block">left</span>
              </p>
            </div>
            <div className="h-10 w-px bg-border" />
            <div className="text-right">
              <p className="text-xs text-muted-foreground font-medium">Driver Spots</p>
              <p className="text-lg font-bold text-foreground">
                {driverSpotsRemaining}/{driverSpotsTotal} <span className="hidden lg:inline-block">left</span>
              </p>
            </div>
          </div>

          
          <SignupButtons className="hidden md:flex"/>
          <Avatar className="h-10 w-10 border-2 border-border hidden md:flex">
            <AvatarImage src="/diverse-student-profiles.png" alt="User" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
        <SignupButtons className="flex flex-row justify-between md:hidden" header/>
      </div>
    </header>
  )
}
