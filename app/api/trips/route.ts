import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerClient } from "@/utils/supabase/server";
import { db } from "@/utils/drizzle";
import { trip_guides, trips } from "@/drizzle/schema";
import { Enums } from "@/types/database.types";

const CreateTripSchema = z.object({
	name: z.string().min(1),
	start_date: z.string(),
	end_date: z.string(),
	participant_spots: z.coerce.number().min(0),
	driver_spots: z.coerce.number().min(0),
	guides: z.array(z.string().uuid()),
});

export async function POST(request: Request) {
	const supabase = await createServerClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	const { data: claimsData } = await supabase.auth.getClaims();

	if (!user || !claimsData) {
		return NextResponse.json({ error: "User not found" }, { status: 401 });
	}

	const { claims } = claimsData;
	const role: Enums<"user_role"> = claims.app_role;

	if (role === "participant") {
		return NextResponse.json({ error: "Must be a guide" }, { status: 403 });
	}

	const body = await request.json();
	const result = CreateTripSchema.safeParse(body);

	if (!result.success) {
		return NextResponse.json(
			{ error: "Invalid request body", details: result.error },
			{ status: 400 },
		);
	}

	const {
		name,
		start_date,
		end_date,
		participant_spots,
		driver_spots,
		guides,
	} = result.data;

	// Create the trip
	const [newTrip] = await db
		.insert(trips)
		.values({
			name,
			start_date: new Date(start_date).toISOString(),
			end_date: new Date(end_date).toISOString(),
			participant_spots,
			driver_spots,
		})
		.returning({ id: trips.id });

	if (!newTrip) {
		throw new Error("Failed to create trip");
	}

	// Prepare guide entries (calling user + selected guides)
	// Use a Set to ensure uniqueness in case the user selected themselves
	const guideIds = new Set([user.id, ...guides]);

	const guideEntries = Array.from(guideIds).map((userId) => ({
		trip_id: newTrip.id,
		user_id: userId,
	}));

	if (guideEntries.length > 0) {
		await db.insert(trip_guides).values(guideEntries);
	}

	return NextResponse.json({ tripId: newTrip.id });
}
