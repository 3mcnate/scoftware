"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Sparkles, Calendar, Shield } from "lucide-react"

// Mock data - in a real app, this would come from an API
const mockMembershipStatus = {
  hasMembership: false,
  plan: null as null | "semester" | "annual",
  expiresAt: null as null | string,
  memberSince: null as null | string,
}

const membershipPlans = [
  {
    id: "semester",
    name: "1-Semester Membership",
    price: 25,
    period: "semester",
    description: "Great for trying us out",
    features: ["Unlimited trip registrations", "Member pricing on all trips", "Priority booking access"],
  },
  {
    id: "annual",
    name: "1-Year Membership",
    price: 35,
    period: "year",
    description: "Best value for the year",
    features: [
      "Unlimited trip registrations",
      "Member pricing on all trips",
      "Priority booking access",
      "Member-only events",
    ],
    popular: true,
  },
]

export function MembershipTab() {
  const [membership, setMembership] = useState(mockMembershipStatus)

  const handlePurchase = (planId: string) => {
    // Mock purchase - in real app, this would integrate with payment
    const expiresAt = planId === "semester" ? "2026-05-15" : "2026-11-26"
    setMembership({
      hasMembership: true,
      plan: planId as "semester" | "annual",
      expiresAt,
      memberSince: "2025-11-26",
    })
  }

  if (membership.hasMembership) {
    const currentPlan = membershipPlans.find((p) => p.id === membership.plan)

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Membership</h2>
          <p className="text-muted-foreground">Manage your membership status and benefits</p>
        </div>

        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">{currentPlan?.name}</CardTitle>
                  <CardDescription>Member since {membership.memberSince}</CardDescription>
                </div>
              </div>
              <Badge className="bg-primary text-primary-foreground">Active</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {membership.expiresAt && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Expires on {membership.expiresAt}</span>
              </div>
            )}

            <div className="space-y-3">
              <h4 className="font-medium">Your Benefits</h4>
              <ul className="space-y-2">
                {currentPlan?.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="outline">Cancel Membership</Button>
              {membership.plan === "semester" && (
                <Button onClick={() => handlePurchase("annual")}>Upgrade to Annual</Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Membership</h2>
        <p className="text-muted-foreground">Join our community and unlock exclusive benefits</p>
      </div>

      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <Shield className="h-7 w-7 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-medium">No Active Membership</h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Become a member to enjoy member pricing and priority access on all trips.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {membershipPlans.map((plan) => (
          <Card key={plan.id} className={`relative transition-all ${plan.popular ? "border-primary shadow-md" : ""}`}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">Best Value</Badge>
              </div>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="pt-2">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground">/{plan.period}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                variant={plan.popular ? "default" : "outline"}
                onClick={() => handlePurchase(plan.id)}
              >
                {plan.popular ? "Get Started" : "Select Plan"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
