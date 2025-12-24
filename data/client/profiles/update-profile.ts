import { createClient } from "@/utils/supabase/browser";
import { useUpdateMutation } from "@supabase-cache-helpers/postgrest-react-query";

export const useUpdateProfile = () => {
	const client = createClient();
	return useUpdateMutation(client.from("profiles"), ["id"], null, {
		revalidateTables: [{ table: "profiles" }],
	});
};
