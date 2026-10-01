import { supabase } from "./supabase";

export const IMAGE_BUCKET = "invitation-assets";
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MIN_DIMENSION = 200;
const MAX_DIMENSION = 8000;

const extensions: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

export const IMAGE_ACCEPT = Object.keys(extensions).join(",");
export const UPLOAD_ERROR_MESSAGE = "We couldn't upload your image. Please try again.";

function readDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("unreadable"));
    };
    img.src = url;
  });
}

/** Returns a user-facing problem with the file, or null when it is acceptable. */
export async function validateImageFile(file: File): Promise<string | null> {
  if (!(file.type in extensions)) return "Use a JPG, PNG or WebP image.";
  if (file.size > MAX_IMAGE_BYTES) return "Images must be 5 MB or smaller.";
  try {
    const { width, height } = await readDimensions(file);
    if (Math.min(width, height) < MIN_DIMENSION) return `Images must be at least ${MIN_DIMENSION}px wide and tall.`;
    if (Math.max(width, height) > MAX_DIMENSION) return `Images can be at most ${MAX_DIMENSION}px wide or tall.`;
  } catch {
    return "We couldn't read that image. Try a different file.";
  }
  return null;
}

/**
 * Uploads to `<user id>/<random id>.<ext>` in the public bucket and returns the public URL.
 * Storage policies only allow writes inside the signed-in user's own folder.
 */
export async function uploadInvitationImage(userId: string, file: File): Promise<string> {
  if (!supabase) throw new Error(UPLOAD_ERROR_MESSAGE);
  const path = `${userId}/${crypto.randomUUID()}.${extensions[file.type]}`;
  const { error } = await supabase.storage.from(IMAGE_BUCKET).upload(path, file, { contentType: file.type, cacheControl: "31536000" });
  if (error) {
    if (import.meta.env.DEV) console.error("[storage]", error);
    throw new Error(UPLOAD_ERROR_MESSAGE);
  }
  return supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path).data.publicUrl;
}
