import type React from "react"
import { DashboardHeader } from "@/components/participant-dashboard/dashboard-header"
import { DashboardTabs } from "@/components/participant-dashboard/dashboard-tabs"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <DashboardHeader />
      <div className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <DashboardTabs />
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">{children}</div>
    </div>
  )
}
