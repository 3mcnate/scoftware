import { db } from "@/utils/drizzle";
import { waiver_events } from "@/drizzle/schema";
import { InferInsertModel } from "drizzle-orm";

type WaiverEventInsert = InferInsertModel<typeof waiver_events>;

export async function createWaiverEvent(data: Omit<WaiverEventInsert, "id" | "created_at">) {
	const result = await db
		.insert(waiver_events)
		.values(data)
		.returning();

	return result[0];
}
