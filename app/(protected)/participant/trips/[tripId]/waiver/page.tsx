import Link from "next/link";
import { z } from "zod/v4";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { JSONContent } from "@tiptap/core";
import { WaiverSignatureForm } from "../../../../../../components/waiver/waiver-signature-form";
import { getTripWaiverByTripAndType } from "@/data/server/waivers/get-trip-waiver";
import { createServerClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { generateWaiverHTML } from "@/utils/tiptap";
import { getTicketByUserAndTrip } from "@/data/server/waivers/update-ticket-waiver";
import { getPublishedTrip } from "@/data/server/trips/get-published-trip";
import { createWaiverEvent } from "@/data/server/waivers/create-waiver-event";
import { getUserIP } from "@/utils/logging";
import { headers } from "next/headers";

const waiverTypeSchema = z
  .enum(["participant", "driver"])
  .default("participant");

interface WaiverPageProps {
  params: Promise<{ tripId: string }>;
  searchParams: Promise<{ type?: string }>;
}

// TODO: double check that this route is dynamic

export default async function WaiverPage({
  params,
  searchParams,
}: WaiverPageProps) {
  const { tripId } = await params;
  const { type } = await searchParams;

  const parsedType = waiverTypeSchema.safeParse(type);

  if (!parsedType.success) {
    return (
      <div className="w-full text-center">
        <p>
          Error: Invalid waiver type. Must specify type=participant or
          type=driver.
        </p>
      </div>
    );
  }

  const waiverType = parsedType.data;
  const supabase = await createServerClient();

  const [
    {
      data: { user },
    },
    waiver,
  ] = await Promise.all([
    supabase.auth.getUser(),
    getTripWaiverByTripAndType(tripId, waiverType),
  ]);

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const [ticket, trip] = await Promise.all([
    getTicketByUserAndTrip(user.id, tripId),
    getPublishedTrip(tripId),
  ]);

  if (!ticket || !trip) {
    return (
      <div className="w-full text-center">
        <p>404: Trip not found or you don&apos;t have a ticket for this trip</p>
      </div>
    );
  }

  if (
    (ticket.waiver_filepath && waiverType === "participant") ||
    (ticket.driver_waiver_filepath && waiverType === "driver")
  ) {
    return (
      <div className="w-full text-center">
        <p>This waiver has already been signed.</p>
      </div>
    );
  }

  if (!waiver) {
    return (
      <div className="w-full text-center">
        <p>Error - couldn&apos;t get waiver, please contact the guides</p>
      </div>
    );
  }

  // TODO: log waiver view event

  const waiverHtml = generateWaiverHTML(waiver.content as JSONContent);

	const headersList = await headers();
	const ip = await getUserIP();

	await createWaiverEvent({
		event: 'user_opened',
		ip_address: ip,
		trip_id: tripId,
		user_agent: headersList.get('user-agent') || "unknown",
		user_id: user.id,
		waiver_id: waiver.id
	})

  return (
    <div className="max-w-3xl space-y-6 mx-auto">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/participant/trips">Trips</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{trip.name}</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Waiver</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-bold text-foreground">{waiver.title}</h1>
      </div>

      <div
        className="prose prose-sm dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: waiverHtml }}
      />

      <WaiverSignatureForm tripId={tripId} waiverId={waiver.id} />
    </div>
  );
}
