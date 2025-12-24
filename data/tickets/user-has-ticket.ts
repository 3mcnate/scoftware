import { db } from "@/utils/drizzle";
import { tickets } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";

export async function userHasTicket(userId: string, tripId: string): Promise<boolean> {
  const result = await db
    .select({ id: tickets.id })
    .from(tickets)
    .where(
      and(
        eq(tickets.user_id, userId),
        eq(tickets.trip_id, tripId),
        eq(tickets.cancelled, false)
      )
    )
    .limit(1);

  return result.length > 0;
}
