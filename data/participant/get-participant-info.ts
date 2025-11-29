import {
	PostgrestUseQueryOptions,
	TypedSupabaseClient,
} from "@/types/typed-supabase-client";
import { createClient } from "@/utils/supabase/browser";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { QueryData } from "@supabase/supabase-js";

export const getParticipantInfo = (
	userId: string,
	client: TypedSupabaseClient,
) => {
	return client
		.from("participant_info")
		.select("*")
		.eq("user_id", userId);
};

export const useParticipantInfo = (
	userId: string,
	config?: PostgrestUseQueryOptions<
		QueryData<ReturnType<typeof getParticipantInfo>>
	>,
) => {
	const supabase = createClient();
	return useQuery(
		getParticipantInfo(userId, supabase),
		{ enabled: !!userId, ...config },
	);
};
