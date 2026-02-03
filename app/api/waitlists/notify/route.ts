import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { Resend } from "resend";
import { db } from "@/utils/drizzle";
import { createServerClient } from "@/utils/supabase/server";
import { waitlist_signups, profiles, trips, trip_guides } from "@/drizzle/schema";
import { eq, and } from "drizzle-orm";
import { WaitlistNotificationEmail } from "@/emails/notifications/waitlist-notification";
import { headers } from "next/headers";
import { createHostUrl } from "@/utils/host-url";

const resend = new Resend(process.env.RESEND_API_KEY);

const NotifyWaitlistSchema = z.object({
	waitlistSignupId: z.uuid(),
	expiresAt: z.iso.datetime(),
});

async function getWaitlistSignupWithDetails(waitlistSignupId: string) {
	const [result] = await db
		.select({
			waitlist: waitlist_signups,
			user: {
				id: profiles.id,
				first_name: profiles.first_name,
				last_name: profiles.last_name,
				email: profiles.email,
			},
			trip: {
				id: trips.id,
				name: trips.name,
			},
		})
		.from(waitlist_signups)
		.innerJoin(profiles, eq(waitlist_signups.user_id, profiles.id))
		.innerJoin(trips, eq(waitlist_signups.trip_id, trips.id))
		.where(eq(waitlist_signups.id, waitlistSignupId))
		.limit(1);

	return result;
}

async function isTripGuide(tripId: string, userId: string) {
	const [guide] = await db
		.select()
		.from(trip_guides)
		.where(and(eq(trip_guides.trip_id, tripId), eq(trip_guides.user_id, userId)))
		.limit(1);

	return !!guide;
}

export async function POST(request: NextRequest) {
	const supabase = await createServerClient();
	const { data: claimsData, error: authError } = await supabase.auth.getClaims();

	if (!claimsData || authError) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { claims } = claimsData;
	const userId = claims.sub;
	const role = claims.app_role;

	if (role === "participant") {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	let body;
	try {
		body = await request.json();
	} catch {
		return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
	}

	const validation = NotifyWaitlistSchema.safeParse(body);
	if (!validation.success) {
		return NextResponse.json(
			{ error: "Invalid request body", details: validation.error.issues },
			{ status: 400 }
		);
	}

	const { waitlistSignupId, expiresAt } = validation.data;

	const signupDetails = await getWaitlistSignupWithDetails(waitlistSignupId);

	if (!signupDetails) {
		return NextResponse.json(
			{ error: "Waitlist signup not found" },
			{ status: 404 }
		);
	}

	const isAdmin = role === "admin" || role === "superadmin";
	const isGuide = await isTripGuide(signupDetails.trip.id, userId);

	if (!isAdmin && !isGuide) {
		return NextResponse.json(
			{ error: "Insufficient permissions" },
			{ status: 403 }
		);
	}

	const expiresAtDate = new Date(expiresAt);
	const now = new Date();

	if (expiresAtDate <= now) {
		return NextResponse.json(
			{ error: "Expiration date must be in the future" },
			{ status: 400 }
		);
	}

	await db
		.update(waitlist_signups)
		.set({
			spot_expires_at: expiresAt,
			notification_sent_at: now.toISOString(),
		})
		.where(eq(waitlist_signups.id, waitlistSignupId));

	const headersList = await headers();
	const host = headersList.get("host") ?? "localhost:3000";
	const baseUrl = createHostUrl(host);
	const signupUrl = `${baseUrl}/trip/${signupDetails.trip.id}/checkout?waitlist=${waitlistSignupId}`;

	const { error: emailError } = await resend.emails.send({
		from: "SC Outfitters [PREVIEW] <noreply@dev.scoutfitters.org>",
		to: [signupDetails.user.email],
		subject: `A spot opened up for ${signupDetails.trip.name}!`,
		react: WaitlistNotificationEmail({
			firstName: signupDetails.user.first_name,
			tripName: signupDetails.trip.name,
			spotType: signupDetails.waitlist.ticket_type,
			expiresAt: expiresAtDate,
			signupUrl,
		}),
	});

	if (emailError) {
		console.error("Failed to send waitlist notification email:", emailError);
		return NextResponse.json(
			{ error: "Failed to send email notification" },
			{ status: 500 }
		);
	}

	return NextResponse.json({
		success: true,
		message: "Notification sent successfully",
	});
}