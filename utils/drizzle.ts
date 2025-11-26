// https://orm.drizzle.team/docs/get-started/supabase-new#step-3---connect-drizzle-orm-to-the-database

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const ssl = process.env.NEXT_PUBLIC_ENV! === 'development' ? false : 'require'

const client = postgres(process.env.DATABASE_URL!, { prepare: false, ssl });
export const db = drizzle({ client });

