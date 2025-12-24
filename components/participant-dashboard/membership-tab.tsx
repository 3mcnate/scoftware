"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useBuyMembership } from "@/data/client/memberships/buy-membership";
import { useUserMemberships } from "@/data/client/memberships/get-memberships";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import {
  Loader2,
  CheckCircle,
  Calendar,
  ExternalLink,
  CreditCard,
} from "lucide-react";
import { formatDate, formatDateWithWeekday, getMembershipExpirationDate } from "@/utils/date-time";

type Membership = NonNullable<
  ReturnType<typeof useUserMemberships>["data"]
>[number];

export function MembershipTab() {
  const auth = useAuth();
  const userId = auth.status === "authenticated" ? auth.user.id : "";
  const { data: memberships, isLoading } = useUserMemberships(userId);
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

  if (auth.status !== "authenticated" || isLoading) {
    return <MembershipTabSkeleton />;
  }

  const now = new Date();
  const activeMembership = memberships?.find(
    (m) => !m.cancelled && new Date(m.expires_at) > now
  );
  const hasActiveMembership = !!activeMembership;

	console.log("memberships", memberships)

  return (
    <div className="space-y-8">
      {hasActiveMembership ? (
        <ActiveMembershipCard membership={activeMembership} />
      ) : (
        <BecomeMemberCard
          onBuyMembership={handleButtonClick}
          isPending={isPending}
        />
      )}

      {memberships && memberships.length > 0 && (
        <MembershipHistoryTable memberships={memberships} />
      )}
    </div>
  );
}

function ActiveMembershipCard({ membership }: { membership: Membership }) {
  const lengthLabel = membership.length === "year" ? "Full Year" : "Semester";
  const periodLabel = getMembershipWindowFromExpiration(
    membership.length,
    new Date(membership.expires_at)
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <CheckCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Active Membership</CardTitle>
              <CardDescription>
                {lengthLabel}, {periodLabel}
              </CardDescription>
            </div>
          </div>
          <Badge variant="default">Active</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Expires {formatDateWithWeekday(membership.expires_at)}</span>
        </div>
        <p className="text-sm text-muted-foreground">
          You have access to priority trip sign-ups, member pricing, exclusive
          events, and gear rentals.
        </p>
      </CardContent>
    </Card>
  );
}

function BecomeMemberCard({
  onBuyMembership,
  isPending,
}: {
  onBuyMembership: (length: "semester" | "year") => void;
  isPending: boolean;
}) {
  const yearOffer = getMembershipOffer("year");
  const semesterOffer = getMembershipOffer("semester");

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <CardTitle>Become a Member</CardTitle>
            <CardDescription>
              Get priority access and member-only perks
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3 text-sm">
          <p className="font-semibold uppercase text-xs tracking-wide">
            AT SC OUTFITTERS, WE LIVE FOR THE CHANCE TO BRING THE WONDERS OF THE
            WILDERNESS TO OUR FELLOW TROJANS AND DEVELOP A COMMUNITY AROUND OUR
            SHARED PASSION FOR THE OUTDOORS.
          </p>
          <p></p>
        </div>
        <div className="space-y-3 text-sm">
          <p>
            SC Outfitters welcomes everyone to participate on our trips - our
            mission is to get people outside! We also offer a membership to
            those who wish to join which allows you to be more involved with the
            org and has some pretty sweet perks to get you outside more.
          </p>
          <p>
            Our trips fill up FAST, and as a member you get early access to the
            tickets (11:00 pm on nights of Trip Reveal while non-members must
            wait until 9:00 am the next day).
          </p>
          <p>
            Trip prices are also discounted for members - depending on the
            length of trip, membership basically pays for itself in one/two
            tickets.
          </p>
          <p>
            Plus, we host a bunch of member events including bonfires, t-shirt
            tie-dyeing, backcountry cooking competitions, Wilderness First
            Aid/First Responder training, etc. and the fee helps cover the cost
            of supplies. If this is what you are looking for, then sign up
            below. We would love to have you!
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium">Membership Perks</h4>
          <ul className="grid gap-2 text-sm grid-cols-1">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              Priority trip sign-ups
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              Lower cost trips
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              Member-only events
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              Gear rentals access
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="space-y-2">
            <Button
              variant="default"
              onClick={() => onBuyMembership("year")}
              disabled={isPending}
              className="w-full"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {yearOffer.label} ({yearOffer.price})
            </Button>
            <p className="text-muted-foreground text-sm">
              ({yearOffer.period}. Expires {yearOffer.expires})
            </p>
          </div>
          <div className="space-y-2">
            <Button
              variant="outline"
              onClick={() => onBuyMembership("semester")}
              disabled={isPending}
							className="w-full"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {semesterOffer.label} ({semesterOffer.price})
            </Button>
            <p className="text-muted-foreground text-sm">
              ({semesterOffer.period}. Expires {semesterOffer.expires})
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getMembershipOffer(length: "semester" | "year") {
  const expiration = getMembershipExpirationDate(length);
  return {
    label: length === "year" ? "Full Year" : "Half Year",
    price: length === "year" ? "$35" : "$25",
    period: getMembershipWindowFromExpiration(length, expiration),
    expires: formatDate(expiration.toISOString()),
  };
}

function getMembershipWindowFromExpiration(
  length: "semester" | "year",
  expiresAt: Date
) {
  const month = expiresAt.getMonth();
  const year = expiresAt.getFullYear();

  if (length === "semester") {
    return month === 4 ? `Spring ${year}` : `Fall ${year}`;
  }

  if (month === 11) {
    return `Spring - Fall ${year}`;
  }

  return `Fall ${year - 1} - Spring ${year}`;
}

function MembershipHistoryTable({
  memberships,
}: {
  memberships: Membership[];
}) {
  const now = new Date();

  const getMembershipStatus = (membership: Membership) => {
    if (membership.cancelled) return "cancelled";
    if (new Date(membership.expires_at) < now) return "expired";
    return "active";
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">
        Membership History
      </h2>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Semesters</TableHead>
              <TableHead>Purchased</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Receipt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {memberships.map((membership) => {
              const status = getMembershipStatus(membership);
              return (
                <TableRow key={membership.id}>
                  <TableCell className="font-medium">
                    {membership.length === "year" ? "Full Year" : "Semester"}
                  </TableCell>
                  <TableCell>
                    {getMembershipWindowFromExpiration(
                      membership.length,
                      new Date(membership.expires_at)
                    )}
                  </TableCell>
                  <TableCell>{formatDateWithWeekday(membership.created_at)}</TableCell>
                  <TableCell>{formatDateWithWeekday(membership.expires_at)}</TableCell>
                  <TableCell>
                    <MembershipStatusBadge status={status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <a
                        href={membership.receipt_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">View receipt</span>
                      </a>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function MembershipStatusBadge({
  status,
}: {
  status: "active" | "expired" | "cancelled";
}) {
  switch (status) {
    case "active":
      return <Badge variant="default">Active</Badge>;
    case "expired":
      return <Badge variant="secondary">Expired</Badge>;
    case "cancelled":
      return <Badge variant="destructive">Cancelled</Badge>;
  }
}

function MembershipTabSkeleton() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-60" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    </div>
  );
}
