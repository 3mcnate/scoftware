import { createClient } from "@/utils/supabase/browser";

/**
 * Sanitizes a string for use as an S3 object key.
 * - Replaces spaces with hyphens
 * - Removes unsafe characters, keeping only: a-z, A-Z, 0-9, !, -, _, ., *, ', (, )
 * @see https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html
 */
export function sanitizeObjectName(name: string): string {
  return name
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9\-_]/g, "");
}

export function getTripPictureUrl(path: string) {
  const supabase = createClient();
  const { data } = supabase.storage.from("trip_pictures").getPublicUrl(path);
  return data.publicUrl;
}