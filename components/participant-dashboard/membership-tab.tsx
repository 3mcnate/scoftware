"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useBuyMembership } from "@/data/memberships/buy-membership";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// This component reproduces the copy and structure from
// https://www.scoutfitters.org/become-a-member
export function MembershipTab(): React.ReactElement {
  const { mutate: buyMembership, isPending } = useBuyMembership();

  const handleButtonClick = (length: "semester" | "year") => {
    buyMembership(
      { length },
      {
        onSuccess: (data) => {
          window.location.href = data.url;
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  return (
    <div className="space-y-8 mx-auto max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">BECOME A MEMBER</h1>
        <h3 className="mt-4 text-sm font-semibold uppercase text-muted-foreground">
          AT SC OUTFITTERS, WE LIVE FOR THE CHANCE TO BRING THE WONDERS OF THE
          WILDERNESS TO OUR FELLOW TROJANS AND DEVELOP A COMMUNITY AROUND OUR
          SHARED PASSION FOR THE OUTDOORS.
        </h3>
        <p className="mt-4 text-sm max-w-3xl">
          SC Outfitters welcomes everyone to participate on our trips- our
          mission is to get people outside! We also offer a membership to those
          who wish to join which allows you to be more involved with the org and
          has some pretty sweet perks to get you outside more. Our trips fill up
          FAST, and as a member you get early access to the tickets (11:00 pm on
          nights of Trip Reveal while non-members must wait until 9:00 am the
          next day). Trip prices are also discounted for members - depending on
          the length of trip, membership basically pays for itself in one/two
          tickets. Plus, we host a bunch of member events including bonfires,
          t-shirt tie-dyeing, backcountry cooking competitions, Wilderness First
          Aid/First Responder training, etc. and the fee helps cover the cost of
          supplies. If this is what you’re looking for, then sign up below. We’d
          love to have you!
        </p>
      </div>

      <h3 className="text-lg font-semibold">Membership Perks</h3>
      <ul className="list-disc pl-5 space-y-2 text-sm">
        <li>Priority trip sign-ups!</li>
        <li>Lower cost trips!</li>
        <li>Monthly member-only events and opportunities</li>
        <li>
          Exclusive access to gear rentals for your own trips (participants get
          gear for SCO trips already)
        </li>
        <li>The coolest people you’ll ever meet</li>
      </ul>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button
          variant="default"
          onClick={() => handleButtonClick("year")}
          disabled={isPending}
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          FULL YEAR (FALL 2025 - SPRING 2026) $35
        </Button>
        <Button
          variant="outline"
          onClick={() => handleButtonClick("semester")}
          disabled={isPending}
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          HALF YEAR (FALL 2025) $25
        </Button>
      </div>
    </div>
  );
}
