import { createClient } from "@/utils/supabase/browser";
import { useDeleteMutation } from "@supabase-cache-helpers/postgrest-react-query";

export const useDeleteTrip = () => {
  const client = createClient();

  return useDeleteMutation(client.from("trips"), ["id"], "id", {
		revalidateTables: [{
			schema: 'public',
			table: 'trip_guides',
		}]
	});
};
