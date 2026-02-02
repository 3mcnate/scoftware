import { createClient } from "@/utils/supabase/browser";
import { useDeleteMutation } from "@supabase-cache-helpers/postgrest-react-query";

export const useRemoveTripGuide = () => {
  const client = createClient();
  return useDeleteMutation(
    client.from("trip_guides"),
    ["trip_id", "user_id"],
    null,
    {
      revalidateTables: [
        { schema: "public", table: "trips" },
        { schema: "public", table: "trip_guides" },
      ],
    }
  );
};
