import { createClient } from "@/lib/supabase/client";
import { compressImage, type CompressionPresetName } from "./compress-image";

export type StorageBucket = "avatars" | "vendor-media" | "agent-documents";

interface UploadResult {
  /** Storage object path, e.g. "{user_id}/<uuid>.png". */
  path: string;
  /** Only meaningful for public buckets — null for private ones (use a
   * signed URL to view those instead). */
  publicUrl: string | null;
}

/**
 * Compresses (see {@link compressImage}) then uploads a file into the
 * caller's own folder ({user_id}/...) in the given bucket. Storage RLS
 * enforces that the folder matches auth.uid(), so this only works for the
 * signed-in user's own files.
 */
export async function uploadOwnFile(
  bucket: StorageBucket,
  file: File,
  preset: CompressionPresetName,
): Promise<{ data: UploadResult | null; error: string | null }> {
  const supabase = createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return { data: null, error: "You must be signed in to upload a file." };
  }

  const compressed = await compressImage(file, preset);

  const ext = compressed.name.split(".").pop() || "bin";
  const path = `${userData.user.id}/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, compressed, { upsert: true, contentType: compressed.type });

  if (uploadError) {
    return { data: null, error: uploadError.message };
  }

  const isPublicBucket = bucket === "avatars" || bucket === "vendor-media";
  const publicUrl = isPublicBucket
    ? supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl
    : null;

  return { data: { path, publicUrl }, error: null };
}
