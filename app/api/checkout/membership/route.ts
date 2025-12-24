import { getMembershipPrice } from "@/data/memberships/get-membership-price";
import { getActiveUserMembership } from "@/data/memberships/get-user-membership";
import { createHostUrl } from "@/utils/host-url";
import { createStripeClient } from "@/utils/stripe";
import { createServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";

const MembershipCheckoutSchema = z.object({
	length: z.enum(["semester", "year"]),
});

export async function POST(request: NextRequest) {
	const supabase = await createServerClient();
	const { data: claimsData, error } = await supabase.auth.getClaims();

	if (!claimsData || error) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const requestData = MembershipCheckoutSchema.safeParse(await request.json());
	if (!requestData.success) {
		return NextResponse.json({ error: "Bad request" }, { status: 400 });
	}

	const { claims: { sub: userId, email } } = claimsData;
	console.log("claimsData.claims", claimsData.claims);
	const { length } = requestData.data;

	// check if user already has active membership
	const membership = await getActiveUserMembership(userId);
	if (membership) {
		return NextResponse.json({ error: "User already has active membership" }, {
			status: 400,
		});
	}

	const price = await getMembershipPrice(length);
	if (!price) {
		return NextResponse.json(
			{ error: "Price not found for length " + length },
			{ status: 500 },
		);
	}

	const host = request.headers.get("host");
	if (!host) {
		return NextResponse.json(
			{ error: "Host not found" },
			{ status: 400 },
		);
	}

	const stripe = createStripeClient();
	const session = await stripe.checkout.sessions.create({
		success_url: `${createHostUrl(host)}/participant/membership?success=true`,
		line_items: [
			{
				price: price.stripe_price_id,
				quantity: 1,
			},
		],
		mode: "payment",
		customer_email: email,
		client_reference_id: userId,
		metadata: {
			type: "membership",
			length,
		},
	});

	if (!session.url) {
		return NextResponse.json({ "error": "Couldn't get billing session URL" }, {
			status: 500,
		});
	}

	return NextResponse.json({ url: session.url });
}
