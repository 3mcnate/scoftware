import { createServerClient } from "@/utils/supabase/server";
import { createStripeClient } from "@/utils/stripe";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/utils/drizzle";
import { tickets, trip_guides } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";

const cancelSchema = z.object({
	refund: z.boolean().optional(),
});

const getTicket = async (ticketId: string) => {
	const [ticket] = await db
		.select()
		.from(tickets)
		.where(eq(tickets.id, ticketId))
		.limit(1);
	return ticket;
};

const getTripGuide = async (tripId: string, userId: string) => {
	const [guide] = await db
		.select()
		.from(trip_guides)
		.where(
			and(eq(trip_guides.trip_id, tripId), eq(trip_guides.user_id, userId)),
		)
		.limit(1);
	return guide;
};

export async function POST(
	request: Request,
	{ params }: { params: Promise<{ ticketId: string }> },
) {
	const { ticketId } = await params;

	let body;
	try {
		body = await request.json();
	} catch {
		return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
	}

	const validation = cancelSchema.safeParse(body);
	if (!validation.success) {
		return NextResponse.json({ error: "Bad request" }, { status: 400 });
	}
	const { refund } = validation.data;

	const supabase = await createServerClient();
	const stripe = createStripeClient();

	const { data: claimsData, error } = await supabase.auth.getClaims();

	if (!claimsData || error) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { claims: { sub: userId, app_role } } = claimsData;

	const ticket = await getTicket(ticketId);

	if (!ticket) {
		return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
	}

	const tripGuide = await getTripGuide(ticket.trip_id, userId);

	const isAdmin = app_role === "admin" || app_role === "superadmin";

	if (!isAdmin && !tripGuide) {
		return NextResponse.json(
			{ error: "Insufficient permissions to cancel this ticket" },
			{ status: 403 },
		);
	}

	let stripeRefundId = null;
	let refundedStatus = false;

	if (refund) {
		if (!ticket.stripe_payment_id) {
			return NextResponse.json(
				{ error: "Missing Stripe Payment ID" },
				{ status: 500 },
			);
		}
		if (ticket.refunded) {
			return NextResponse.json(
				{ error: "Ticket already refunded" },
				{ status: 400 },
			);
		}

		try {
			const refund = await stripe.refunds.create({
				payment_intent: ticket.stripe_payment_id,
				reason: "requested_by_customer",
			});

			stripeRefundId = refund.id;
			refundedStatus = true;

		} catch (stripeError: unknown) {
			console.error("Stripe refund error:", stripeError);
			const errorMessage = stripeError instanceof Error
				? stripeError.message
				: "Unknown Stripe error";
			return NextResponse.json(
				{ error: `Stripe refund failed: ${errorMessage}` },
				{ status: 500 },
			);
		}
	}

	await db
		.update(tickets)
		.set({
			cancelled: true,
			cancelled_at: new Date().toISOString(),
			refunded: refundedStatus || ticket.refunded, // Keep true if already true
			stripe_refund_id: stripeRefundId,
		})
		.where(eq(tickets.id, ticketId));

	return NextResponse.json({ success: true });
}
