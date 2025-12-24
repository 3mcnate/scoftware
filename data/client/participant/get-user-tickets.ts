import { TypedSupabaseClient } from "@/types/typed-supabase-client";
import { createClient } from "@/utils/supabase/browser";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";

export const getUserTickets = (userId: string, client: TypedSupabaseClient) => {
	return client.from("tickets").select(`
			id, user_id, trip_id, created_at, updated_at, 
			cancelled, refunded, cancelled_at, type, amount_paid, receipt_url,
			waiver_filepath, driver_waiver_filepath,
			published_trips (
				*
			)
		`)
		.eq('user_id', userId);
};

export const useUserTickets = (userId: string) => {
	const supabase = createClient();
	return useQuery(getUserTickets(userId, supabase))
}