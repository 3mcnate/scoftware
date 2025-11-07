import { createBrowserClient as _createBrowserClient } from "@supabase/ssr";
import { Database } from "@/types/database.types";

export const createClient = () =>
  _createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );