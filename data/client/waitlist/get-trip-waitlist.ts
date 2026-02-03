import { TypedSupabaseClient } from "@/types/typed-supabase-client";
import { createClient } from "@/utils/supabase/browser";
import { useQuery, useUpdateMutation } from "@supabase-cache-helpers/postgrest-react-query";

const getTripWaitlist = (tripId: string, client: TypedSupabaseClient) => {
  return client
    .from("waitlist_signups")
    .select(`
      id,
      created_at,
      trip_id,
      updated_at,
      notification_sent_at,
      spot_expires_at,
      user_id,
			ticket_type,
      user:profiles (
        id,
        first_name,
        last_name,
        email,
        phone,
        avatar_path
      )
    `)
    .eq("trip_id", tripId)
    .order("created_at", { ascending: true });
};

export const useTripWaitlist = (tripId: string) => {
  const client = createClient();
  return useQuery(getTripWaitlist(tripId, client));
};

export const useUpdateWaitlist = () => {
	const client = createClient()
	return useUpdateMutation(client.from('waitlist_signups'), ['id'])
}