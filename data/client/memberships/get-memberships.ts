import { createClient } from "@/utils/supabase/browser";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";

function getMembershipsByUser(userId: string) {
	const supabase = createClient();
	return supabase.from("memberships").select(`
			id,
			user_id,
			created_at,
			expires_at,
			stripe_payment_id,
			length,
			cancelled,
			receipt_url
	`).eq("user_id", userId);
}

export const useUserMemberships = (userId: string) => {
	return useQuery(getMembershipsByUser(userId))
}