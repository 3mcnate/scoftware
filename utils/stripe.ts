import Stripe from 'stripe'

export function createStripeClient()
{
	const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
	if (!stripeSecretKey) {
		throw new Error("Stripe secret key not configured")
	}
	return new Stripe(stripeSecretKey)
}