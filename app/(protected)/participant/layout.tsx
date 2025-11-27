import type React from "react"
import { ParticipantDashboardHeader } from "@/components/participant-dashboard/dashboard-header"
import PublicHeader from "@/components/global/public-header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
			<PublicHeader />
      <ParticipantDashboardHeader />
      <div className="container px-4 py-6 md:py-8 md:px-6 mx-auto">{children}</div>
    </div>
  )
}
