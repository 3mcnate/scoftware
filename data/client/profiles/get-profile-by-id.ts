import { TypedSupabaseClient } from "@/types/typed-supabase-client";
import { createClient } from "@/utils/supabase/browser";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";

const getProfileById = (userId: string, client: TypedSupabaseClient) => {
	return client.from("profiles").select(
		"id, first_name, last_name, phone, avatar_path",
	).eq(
		"id",
		userId,
	).single();
};

export const useProfileById = (userId: string) => {
	const client = createClient();
	return useQuery(getProfileById(userId, client));
};
