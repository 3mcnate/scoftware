import { sanitizeObjectName } from "@/utils/storage";
import { createClient } from "@/utils/supabase/browser";

export function getAvatarPath(userId: string, fileName: string) {
	fileName = sanitizeObjectName(fileName)
	return `${userId}/${fileName}`;
}

export async function uploadAvatar(userId: string, file: File) {
	const client = createClient();
	const path = getAvatarPath(userId, file.name);

	const { error } = await client.storage
		.from("avatars")
		.upload(path, file, { upsert: true });

	if (error) throw error;
	return path
}

export async function deleteAvatar(path: string) {
	const client = createClient();
	const { error } = await client.storage.from("avatars").remove([path]);
	if (error) throw error;
}	

export function getAvatarUrl(path: string) {
	const supabase = createClient();
	const { data } = supabase.storage.from("avatars").getPublicUrl(path);
	return data.publicUrl
}