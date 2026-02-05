import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { createServerClient } from "@/utils/supabase/server";
import { db } from "@/utils/drizzle";
import {
	profiles,
	published_trips,
	stripe_products,
	trip_guides,
	trip_prices,
	trips,
} from "@/drizzle/schema";
import { and, eq, sql } from "drizzle-orm";
import { createStripeClient } from "@/utils/stripe";
import { calculateTripPrices, type TripForPricing } from "@/utils/math";
import type { Enums } from "@/types/database.types";

const PublishTripSchema = z.object({
	tripId: z.uuidv4(),
});

const REQUIRED_FIELDS = [
	"description",
	"what_to_bring",
	"picture_path",
	"activity",
	"difficulty",
	"location",
	"meet",
	"native_land",
	"prior_experience",
	"return",
	"trail",
	"budget_confirmed",
] as const;

type GuideInfo = {
	name: string;
	email: string;
	picture_path: string | null;
};

type TripRow = typeof trips.$inferSelect;
type GuideWithProfile = {
	user_id: string;
	trip_id: string;
	profile: {
		id: string;
		first_name: string;
		last_name: string;
		email: string;
		avatar_path: string | null;
	};
};

// ─────────────────────────────────────────────────────────────────────────────
// Helper Functions
// ─────────────────────────────────────────────────────────────────────────────

async function fetchTripData(tripId: string): Promise<
	{
		trip: TripRow;
		guides: GuideWithProfile[];
		existingPublishedTrip: { id: string } | null;
	} | null
> {
	const [tripRows, guideRows, publishedRows] = await Promise.all([
		db.select().from(trips).where(eq(trips.id, tripId)),
		db
			.select({
				user_id: trip_guides.user_id,
				trip_id: trip_guides.trip_id,
				profile: {
					id: profiles.id,
					first_name: profiles.first_name,
					last_name: profiles.last_name,
					email: profiles.email,
					avatar_path: profiles.avatar_path,
				},
			})
			.from(trip_guides)
			.innerJoin(profiles, eq(trip_guides.user_id, profiles.id))
			.where(eq(trip_guides.trip_id, tripId)),
		db
			.select({ id: published_trips.id })
			.from(published_trips)
			.where(eq(published_trips.id, tripId)),
	]);

	if (tripRows.length === 0) return null;

	return {
		trip: tripRows[0],
		guides: guideRows,
		existingPublishedTrip: publishedRows[0] ?? null,
	};
}

async function fetchBudgetFormulas(): Promise<string | null> {
	const result = await db.execute<{ formulas: string }>(
		sql`SELECT formulas FROM budget_formulas LIMIT 1`,
	);
	const rows = result as unknown as { formulas: string }[];
	return rows[0]?.formulas ?? null;
}

function validateRequiredFields(trip: TripRow): string[] {
	const missingFields: string[] = [];

	for (const field of REQUIRED_FIELDS) {
		const value = trip[field];
		if (
			value === null ||
			value === undefined ||
			value === "" ||
			(Array.isArray(value) && value.length === 0)
		) {
			missingFields.push(field);
		}
	}

	// budget_confirmed must be true, not just non-null
	if (!trip.budget_confirmed && !missingFields.includes("budget_confirmed")) {
		missingFields.push("budget_confirmed");
	}

	return missingFields;
}

function buildGuidesJson(guides: GuideWithProfile[]): GuideInfo[] {
	return guides.map((g) => ({
		name: `${g.profile.first_name} ${g.profile.last_name}`,
		email: g.profile.email,
		picture_path: g.profile.avatar_path,
	}));
}

function getFinalPrices(
	trip: TripRow,
	calculatedPrices: {
		member_price: number;
		nonmember_price: number;
		driver_price: number;
	},
) {
	return {
		member: trip.member_price_override !== null
			? Math.ceil(Number(trip.member_price_override))
			: calculatedPrices.member_price,
		nonmember: trip.nonmember_price_override !== null
			? Math.ceil(Number(trip.nonmember_price_override))
			: calculatedPrices.nonmember_price,
		driver: trip.driver_price_override !== null
			? Math.ceil(Number(trip.driver_price_override))
			: calculatedPrices.driver_price,
	};
}

async function createParticipantProductAndPrices(
	stripe: ReturnType<typeof createStripeClient>,
	tripId: string,
	tripName: string,
	memberPrice: number,
	nonmemberPrice: number,
) {
	const participantProduct = await stripe.products.create({
		name: `${tripName} - Participant Ticket`,
		metadata: { trip_id: tripId, type: "participant" },
	});

	const [memberStripePrice, nonmemberStripePrice] = await Promise.all([
		stripe.prices.create({
			product: participantProduct.id,
			unit_amount: memberPrice * 100,
			currency: "usd",
			metadata: { trip_id: tripId, ticket_type: "member" },
		}),
		stripe.prices.create({
			product: participantProduct.id,
			unit_amount: nonmemberPrice * 100,
			currency: "usd",
			metadata: { trip_id: tripId, ticket_type: "nonmember" },
		}),
	]);

	await Promise.all([
		db.insert(stripe_products).values({
			stripe_product_id: participantProduct.id,
			name: participantProduct.name,
			trip_id: tripId,
			type: "participant",
		}),
		db.insert(trip_prices).values([
			{
				stripe_price_id: memberStripePrice.id,
				stripe_product_id: participantProduct.id,
				trip_id: tripId,
				ticket_type: "member",
				amount: memberPrice.toString(),
				active: true,
			},
			{
				stripe_price_id: nonmemberStripePrice.id,
				stripe_product_id: participantProduct.id,
				trip_id: tripId,
				ticket_type: "nonmember",
				amount: nonmemberPrice.toString(),
				active: true,
			},
		]),
	]);
}

async function createDriverProductAndPrice(
	stripe: ReturnType<typeof createStripeClient>,
	tripId: string,
	tripName: string,
	driverPrice: number,
) {
	const driverProduct = await stripe.products.create({
		name: `${tripName} - Driver Ticket`,
		metadata: { trip_id: tripId, type: "driver" },
	});

	const driverStripePrice = await stripe.prices.create({
		product: driverProduct.id,
		unit_amount: driverPrice * 100,
		currency: "usd",
		metadata: { trip_id: tripId, ticket_type: "driver" },
	});

	await Promise.all([
		db.insert(stripe_products).values({
			stripe_product_id: driverProduct.id,
			name: driverProduct.name,
			trip_id: tripId,
			type: "driver",
		}),
		db.insert(trip_prices).values({
			stripe_price_id: driverStripePrice.id,
			stripe_product_id: driverProduct.id,
			trip_id: tripId,
			ticket_type: "driver",
			amount: driverPrice.toString(),
			active: true,
		}),
	]);
}

async function archiveAndCreateNewPrice(
	stripe: ReturnType<typeof createStripeClient>,
	tripId: string,
	existingPrice: {
		stripe_price_id: string;
		stripe_product_id: string;
	},
	newAmount: number,
	ticketType: Enums<"ticket_price_type">,
) {
	await Promise.all([
		stripe.prices.update(existingPrice.stripe_price_id, { active: false }),
		db
			.update(trip_prices)
			.set({ active: false, archived_at: new Date().toISOString() })
			.where(eq(trip_prices.stripe_price_id, existingPrice.stripe_price_id)),
	]);

	const newStripePrice = await stripe.prices.create({
		product: existingPrice.stripe_product_id,
		unit_amount: newAmount * 100,
		currency: "usd",
		metadata: { trip_id: tripId, ticket_type: ticketType },
	});

	await db.insert(trip_prices).values({
		stripe_price_id: newStripePrice.id,
		stripe_product_id: existingPrice.stripe_product_id,
		trip_id: tripId,
		ticket_type: ticketType,
		amount: newAmount.toString(),
		active: true,
	});
}

async function upsertPublishedTrip(
	tripId: string,
	trip: TripRow,
	guides: GuideInfo[],
) {
	const values = {
		id: tripId,
		name: trip.name,
		start_date: trip.start_date,
		end_date: trip.end_date,
		meet: trip.meet!,
		return: trip.return!,
		activity: trip.activity!,
		difficulty: trip.difficulty!,
		trail: trip.trail!,
		recommended_prior_experience: trip.prior_experience!,
		location: trip.location!,
		native_land: trip.native_land!,
		what_to_bring: trip.what_to_bring!,
		guides: JSON.stringify(guides),
		picture_path: trip.picture_path!,
		description: trip.description!,
		updated_at: new Date().toISOString(),
	};

	await db
		.insert(published_trips)
		.values(values)
		.onConflictDoUpdate({
			target: published_trips.id,
			set: {
				name: values.name,
				start_date: values.start_date,
				end_date: values.end_date,
				meet: values.meet,
				return: values.return,
				activity: values.activity,
				difficulty: values.difficulty,
				trail: values.trail,
				recommended_prior_experience: values.recommended_prior_experience,
				location: values.location,
				native_land: values.native_land,
				what_to_bring: values.what_to_bring,
				guides: values.guides,
				picture_path: values.picture_path,
				description: values.description,
				updated_at: values.updated_at,
			},
		});
}

async function handlePriceUpdates(
	stripe: ReturnType<typeof createStripeClient>,
	tripId: string,
	tripName: string,
	driverSpots: number,
	prices: { member: number; nonmember: number; driver: number },
	existingPrices: {
		stripe_price_id: string;
		stripe_product_id: string;
		ticket_type: string;
		amount: string;
	}[],
) {
	const existingMemberPrice = existingPrices.find((p) =>
		p.ticket_type === "member"
	);
	const existingNonmemberPrice = existingPrices.find((p) =>
		p.ticket_type === "nonmember"
	);
	const existingDriverPrice = existingPrices.find((p) =>
		p.ticket_type === "driver"
	);

	const priceUpdatePromises: Promise<void>[] = [];

	if (
		existingMemberPrice && Number(existingMemberPrice.amount) !== prices.member
	) {
		priceUpdatePromises.push(
			archiveAndCreateNewPrice(
				stripe,
				tripId,
				existingMemberPrice,
				prices.member,
				"member",
			),
		);
	}

	if (
		existingNonmemberPrice &&
		Number(existingNonmemberPrice.amount) !== prices.nonmember
	) {
		priceUpdatePromises.push(
			archiveAndCreateNewPrice(
				stripe,
				tripId,
				existingNonmemberPrice,
				prices.nonmember,
				"nonmember",
			),
		);
	}

	if (driverSpots > 0) {
		if (
			existingDriverPrice &&
			Number(existingDriverPrice.amount) !== prices.driver
		) {
			priceUpdatePromises.push(
				archiveAndCreateNewPrice(
					stripe,
					tripId,
					existingDriverPrice,
					prices.driver,
					"driver",
				),
			);
		} else if (!existingDriverPrice) {
			priceUpdatePromises.push(
				createDriverProductAndPrice(stripe, tripId, tripName, prices.driver),
			);
		}
	}

	await Promise.all(priceUpdatePromises);
}

// ─────────────────────────────────────────────────────────────────────────────
// Route Handler
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
	// Auth check
	const supabase = await createServerClient();
	const { data: claimsData, error: authError } = await supabase.auth
		.getClaims();

	if (!claimsData || authError) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const role: Enums<"user_role"> = claimsData.claims.app_role;
	if (role === "participant") {
		return NextResponse.json({ error: "Must be a guide" }, { status: 403 });
	}

	// Validate request body
	const body = await request.json();
	const result = PublishTripSchema.safeParse(body);

	if (!result.success) {
		return NextResponse.json(
			{ error: "Invalid request body", details: result.error.format() },
			{ status: 400 },
		);
	}

	const { tripId } = result.data;

	// Fetch trip data and budget formulas in parallel
	const [tripData, formulas] = await Promise.all([
		fetchTripData(tripId),
		fetchBudgetFormulas(),
	]);

	if (!tripData) {
		return NextResponse.json({ error: "Trip not found" }, { status: 404 });
	}

	if (!formulas) {
		return NextResponse.json({ error: "Budget formulas not found" }, {
			status: 500,
		});
	}

	const { trip, guides, existingPublishedTrip } = tripData;

	// Validate required fields
	const missingFields = validateRequiredFields(trip);
	if (missingFields.length > 0) {
		return NextResponse.json({
			error: "Missing required fields",
			missingFields,
		}, { status: 400 });
	}

	// Build guides JSON
	const guidesJson = buildGuidesJson(guides);

	// Calculate prices
	const tripForPricing: TripForPricing = {
		breakfasts: trip.breakfasts,
		lunches: trip.lunches,
		dinners: trip.dinners,
		snacks: trip.snacks,
		total_miles: trip.total_miles,
		car_mpgs: trip.car_mpgs?.map(Number) ?? null,
		other_expenses: trip.other_expenses,
		participant_spots: trip.participant_spots,
		driver_spots: trip.driver_spots,
		num_guides: guides.length,
		start_date: trip.start_date,
		end_date: trip.end_date,
	};

	const calculatedPrices = calculateTripPrices(tripForPricing, formulas);
	const finalPrices = getFinalPrices(trip, calculatedPrices);

	const stripe = createStripeClient();
	const isUpdate = existingPublishedTrip !== null;

	if (isUpdate) {
		// Update flow: fetch existing prices and update as needed
		const existingPrices = await db
			.select()
			.from(trip_prices)
			.where(
				and(eq(trip_prices.trip_id, tripId), eq(trip_prices.active, true)),
			);

		await Promise.all([
			handlePriceUpdates(
				stripe,
				tripId,
				trip.name,
				trip.driver_spots,
				finalPrices,
				existingPrices,
			),
			upsertPublishedTrip(tripId, trip, guidesJson),
		]);
	} else {
		// Create flow: create products, prices, and published trip
		const stripePromises: Promise<void>[] = [
			createParticipantProductAndPrices(
				stripe,
				tripId,
				trip.name,
				finalPrices.member,
				finalPrices.nonmember,
			),
		];

		if (trip.driver_spots > 0) {
			stripePromises.push(
				createDriverProductAndPrice(
					stripe,
					tripId,
					trip.name,
					finalPrices.driver,
				),
			);
		}

		await Promise.all([
			...stripePromises,
			upsertPublishedTrip(tripId, trip, guidesJson),
		]);
	}

	return NextResponse.json({
		success: true,
		tripId,
		prices: {
			member: finalPrices.member,
			nonmember: finalPrices.nonmember,
			driver: trip.driver_spots > 0 ? finalPrices.driver : null,
		},
	});
}
