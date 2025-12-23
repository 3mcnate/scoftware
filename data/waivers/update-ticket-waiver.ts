import { db } from "@/utils/drizzle";
import { published_trips, tickets } from "@/drizzle/schema";
import { eq, and, InferSelectModel } from "drizzle-orm";

export async function updateTicketWaiverFilepath(
	userId: string,
	tripId: string,
	waiverFilepath: string,
	isDriverWaiver: boolean
) {
	const updateData = isDriverWaiver
		? { driver_waiver_filepath: waiverFilepath }
		: { waiver_filepath: waiverFilepath };

	const result = await db
		.update(tickets)
		.set({
			...updateData,
			updated_at: new Date().toISOString(),
		})
		.where(and(eq(tickets.user_id, userId), eq(tickets.trip_id, tripId)))
		.returning();

	return result[0];
}

export type GetTicketReturn = InferSelectModel<typeof tickets> | null

export async function getTicketByUserAndTrip(userId: string, tripId: string): Promise<GetTicketReturn> {
	const result = await db
		.select()
		.from(tickets)
		.where(and(eq(tickets.user_id, userId), eq(tickets.trip_id, tripId)));

	return result[0] ?? null;
}
