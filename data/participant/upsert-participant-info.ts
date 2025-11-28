import { createClient } from "@/utils/supabase/browser"
import { useUpsertMutation } from "@supabase-cache-helpers/postgrest-react-query";

export const useUpsertParticipantInfo() => {
	const client = createClient();
	return useUpsertMutation(
		client.from('participant_info'),
		['user_id'],
		null
	)
	
}