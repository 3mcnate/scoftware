import { createClient } from "@/utils/supabase/browser";
import { useInsertMutation } from "@supabase-cache-helpers/postgrest-react-query";

export const useAddTripGuide = () => {
  const client = createClient();
  return useInsertMutation(client.from("trip_guides"), ["trip_id", "user_id"], null, {
    revalidateTables: [
      { schema: "public", table: "trips" },
      { schema: "public", table: "trip_guides" },
    ],
  });
};
