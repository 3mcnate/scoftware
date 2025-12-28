import { TypedSupabaseClient } from "@/types/typed-supabase-client";
import { createClient } from "@/utils/supabase/browser";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";

const getGuides = (client: TypedSupabaseClient) => {
  return client
    .from("roles")
    .select(`
      user_id,
      role,
      profiles (
        id,
        first_name,
        last_name,
        avatar_path
      )
    `)
    .in("role", ["guide", "admin", "superadmin"]);
};

export const useGuides = () => {
  const client = createClient();
  return useQuery(getGuides(client));
};
