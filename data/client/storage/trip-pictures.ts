import { createClient } from "@/utils/supabase/browser";

export function getTripPictureUrl(path: string) {
	const supabase = createClient();
	const { data } = supabase.storage.from("trip-pictures").getPublicUrl(path);
	return data.publicUrl;
}
