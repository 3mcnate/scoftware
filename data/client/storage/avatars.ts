import { createClient } from "@/utils/supabase/browser";

const AVATARS_BUCKET = "avatars";

export function getAvatarPath(userId: string) {
	return `${userId}`;
}

export async function uploadAvatar(userId: string, file: File) {
	const client = createClient();
	const path = getAvatarPath(userId);

	const { data, error } = await client.storage
		.from(AVATARS_BUCKET)
		.upload(path, file, { upsert: true });

	if (error) throw error;

	const {
		data: { publicUrl },
	} = client.storage.from(AVATARS_BUCKET).getPublicUrl(data.path);

	return publicUrl;
}

export async function removeAvatar(userId: string) {
	const client = createClient();
	const path = getAvatarPath(userId);

	const { error } = await client.storage.from(AVATARS_BUCKET).remove([path]);

	if (error) throw error;
}	

export function getAvatarUrl(path: string) {
	const supabase = createClient();
	const { data } = supabase.storage.from("avatars").getPublicUrl(path);
	return data.publicUrl
}