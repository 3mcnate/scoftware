// https://orm.drizzle.team/docs/get-started/supabase-new#step-3---connect-drizzle-orm-to-the-database

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const client = postgres(process.env.DATABASE_URL!, { prepare: false, ssl: "require" });
export const db = drizzle({ client });

