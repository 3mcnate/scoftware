import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createStripeClient } from "@/utils/stripe";
import { handleCheckoutSessionCompleted } from "../../../../data/server/stripe/checkout-session-completed";

const stripe = createStripeClient();

export async function POST(request: NextRequest) {
	const body = await request.text();
	const signature = request.headers.get("stripe-signature");

	if (!signature) {
		return NextResponse.json(
			{ error: "Missing stripe-signature header" },
			{ status: 400 },
		);
	}

	const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
	if (!webhookSecret) {
		console.error("STRIPE_WEBHOOK_SECRET is not configured");
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}

	let event: Stripe.Event;

	try {
		event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
	} catch (err) {
		const message = err instanceof Error ? err.message : "Unknown error";
		console.error(`Webhook signature verification failed: ${message}`);
		return NextResponse.json(
			{ error: `Webhook signature verification failed` },
			{ status: 400 },
		);
	}

	try {
		switch (event.type) {
			case "checkout.session.completed":
				await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session,);
				break;
			default:
				console.log(`Unhandled event type: ${event.type}`);
		}
	} catch (err) {
		const message = err instanceof Error ? err.message : "Unknown error";
		console.error(`Error handling event ${event.type}: ${message}`);
		return NextResponse.json(
			{ error: "Error processing webhook" },
			{ status: 500 },
		);
	}

	return NextResponse.json({ received: true });
}
