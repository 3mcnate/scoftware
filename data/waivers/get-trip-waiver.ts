import { db } from "@/utils/drizzle";
import { trip_waivers } from "@/drizzle/schema";
import { eq, and } from "drizzle-orm";
import { InferSelectModel } from "drizzle-orm";

type TripWaiver = InferSelectModel<typeof trip_waivers>;

export async function getTripWaiver(waiverId: string): Promise<TripWaiver | null> {
	const waivers = await db
		.select()
		.from(trip_waivers)
		.where(eq(trip_waivers.id, waiverId));

	return waivers[0] ?? null;
}

export async function getTripWaiverByTripAndType(
	tripId: string,
	type: "member" | "nonmember" | "driver"
): Promise<TripWaiver | null> {
	const waivers = await db
		.select()
		.from(trip_waivers)
		.where(and(eq(trip_waivers.trip_id, tripId), eq(trip_waivers.type, type)));

	return waivers[0] ?? null;
}
