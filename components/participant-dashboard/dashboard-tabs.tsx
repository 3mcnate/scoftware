"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Map, User, Settings, CreditCard } from "lucide-react"

type TabValue = "trips" | "my-information" | "membership" | "settings"

const tabs: { value: TabValue; label: string; icon: React.ElementType; href: string }[] = [
  { value: "trips", label: "Trips", icon: Map, href: "/participant/trips" },
  { value: "my-information", label: "My Information", icon: User, href: "/participant/my-information" },
  { value: "membership", label: "Membership", icon: CreditCard, href: "/participant/membership" },
  { value: "settings", label: "Settings", icon: Settings, href: "/participant/settings" },
]

export function DashboardTabs() {
  const pathname = usePathname()

  return (
    <nav className="flex gap-1">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = pathname === tab.href
        return (
          <Link
            key={tab.value}
            href={tab.href}
            className={cn(
              "relative px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2",
              isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            {tab.label}
            {isActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />}
          </Link>
        )
      })}
    </nav>
  )
}
