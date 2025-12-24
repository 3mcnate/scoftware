import Stripe from "stripe";
import { handleMembershipCheckout } from "./handle-membership-checkout";

export type ProductType = "membership" | "trip_ticket";

export async function handleCheckoutSessionCompleted(
	session: Stripe.Checkout.Session,
) {
	const productType = session.metadata?.product_type as ProductType | undefined;

	if (!productType) {
		console.warn(
			`Checkout session ${session.id} has no product_type in metadata`,
		);
		return;
	}

	switch (productType) {
		case "membership":
			await handleMembershipCheckout(session);
			break;

		case "trip_ticket":
			// TODO: Implement trip ticket purchase handling
			console.log(`Trip ticket purchase: ${session.id}`);
			
			break;
		default:
			console.warn(`Unknown product_type: ${productType}`);
	}
}
