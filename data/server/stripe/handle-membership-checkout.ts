import Stripe from "stripe";
import { db } from "@/utils/drizzle";
import { memberships } from "@/drizzle/schema";
import { getMembershipExpirationDate } from "@/utils/date-time";

export async function handleMembershipCheckout(
	session: Stripe.Checkout.Session,
) {
	const userId = session.client_reference_id;
	const length = session.metadata?.length as "semester" | "year" | undefined;
	const paymentIntentId = session.payment_intent as string | null;

	if (!userId) {
		throw new Error(
			`Membership checkout session ${session.id} missing client_reference_id`,
		);
	}

	if (!length) {
		throw new Error(
			`Membership checkout session ${session.id} missing length in metadata`,
		);
	}

	if (!paymentIntentId) {
		throw new Error(
			`Membership checkout session ${session.id} missing payment_intent`,
		);
	}

	const expiresAt = getMembershipExpirationDate(length);

	const receiptUrl =
		(session as Stripe.Checkout.Session & { receipt_url?: string })
			.receipt_url ?? "#";

	await db.insert(memberships).values({
		user_id: userId,
		length,
		stripe_payment_id: paymentIntentId,
		expires_at: expiresAt.toISOString(),
		receipt_url: receiptUrl,
	});

	console.log(`Created membership for user ${userId} with length ${length}`);
}
