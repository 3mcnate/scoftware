import { TypedSupabaseClient } from "@/types/typed-supabase-client";
import { createClient } from "@/utils/supabase/browser";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";

export const getParticipantInfo = (
	userId: string,
	client: TypedSupabaseClient,
) => {
	return client
		.from("participant_info")
		.select("*")
		.eq("user_id", userId)
};

export const useParticipantInfo = (userId: string) => {
	const supabase = createClient();
	return useQuery(
		getParticipantInfo(userId, supabase),
		{ enabled: !!userId },
	);
};
