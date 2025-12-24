import { memberships } from "@/drizzle/schema";
import { db } from "@/utils/drizzle";
import { and, eq, gte, ne, sql } from "drizzle-orm";

export async function getActiveUserMembership(userId: string) {
	const [membership] = await db
		.select()
		.from(memberships)
		.where(
			and(
				eq(memberships.user_id, userId),
				gte(memberships.expires_at, sql`now()`),
				ne(memberships.cancelled, true)
			),
		)
		.limit(1);

	return membership ?? null;
}
