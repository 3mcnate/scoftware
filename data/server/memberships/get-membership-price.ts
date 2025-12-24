import { membership_prices } from "@/drizzle/schema";
import { Enums } from "@/types/database.types";
import { db } from "@/utils/drizzle";
import { eq } from "drizzle-orm";

export async function getMembershipPrice(
	length: Enums<"membership_length">,
): Promise<typeof membership_prices.$inferSelect | undefined> {
	const [price] = await db
		.select()
		.from(membership_prices)
		.where(eq(membership_prices.length, length))
		.limit(1);

	return price;
}
