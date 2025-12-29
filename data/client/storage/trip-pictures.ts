import { sanitizeObjectName } from "@/utils/storage";
import { createClient } from "@/utils/supabase/browser";

export function getTripPicturePath(tripId: string, fileName: string) {
  fileName = sanitizeObjectName(fileName);
  return `${tripId}/${fileName}`;
}

export async function uploadTripPicture(tripId: string, file: File) {
  const client = createClient();
  const path = getTripPicturePath(tripId, file.name);

  const { error } = await client.storage
    .from("trip_pictures")
    .upload(path, file, { upsert: true });

  if (error) throw error;
  return path;
}

export async function deleteTripPicture(path: string) {
  const client = createClient();
  const { error } = await client.storage.from("trip_pictures").remove([path]);
  if (error) throw error;
}

export function getTripPictureUrl(path: string) {
  const supabase = createClient();
  const { data } = supabase.storage.from("trip_pictures").getPublicUrl(path);
  return data.publicUrl;
}
