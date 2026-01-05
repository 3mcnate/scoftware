import { TypedSupabaseClient } from "@/types/typed-supabase-client";
import { createClient } from "@/utils/supabase/browser";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";

const getTripTickets = (tripId: string, client: TypedSupabaseClient) => {
  return client
    .from("tickets")
    .select(`
      id,
			user_id,
			trip_id,
			created_at,
			updated_at,
			cancelled,
			refunded,
			cancelled_at,
			stripe_payment_id,
			type,
			amount_paid,
			stripe_refund_id,
			receipt_url,
			driver_waiver_filepath,
			waiver_filepath,
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

export const useTripTickets = (tripId: string) => {
  const client = createClient();
  return useQuery(getTripTickets(tripId, client));
};
