import { db } from "@/utils/drizzle";
import { profiles } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function getProfileName(userId: string): Promise<string | null> {
  const result = await db
    .select({ first_name: profiles.first_name, last_name: profiles.last_name })
    .from(profiles)
    .where(eq(profiles.id, userId))
    .limit(1);

  if (result.length === 0) return null;

  return `${result[0].first_name} ${result[0].last_name}`;
}
