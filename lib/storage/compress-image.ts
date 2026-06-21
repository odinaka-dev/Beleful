interface CompressionPreset {
  /** Longest side, in pixels, the image is downscaled to. */
  maxDimension: number;
  /** JPEG re-encode quality, 0–1. */
  quality: number;
  /** Skip re-compression if the file is already at/under this size and
   * doesn't need downscaling — avoids pointless quality loss. */
  skipIfUnderBytes: number;
}

export const COMPRESSION_PRESETS = {
  /** Small, square — vendor logo, agent/student profile photo. */
  AVATAR: { maxDimension: 512, quality: 0.82, skipIfUnderBytes: 150_000 },
  /** Wide marketing/listing photo — vendor banner, menu item photo. */
  WIDE_PHOTO: { maxDimension: 1600, quality: 0.82, skipIfUnderBytes: 400_000 },
  /** Verification document — needs to stay legible, so gentler compression. */
  DOCUMENT: { maxDimension: 2000, quality: 0.92, skipIfUnderBytes: 800_000 },
} as const satisfies Record<string, CompressionPreset>;

export type CompressionPresetName = keyof typeof COMPRESSION_PRESETS;

/**
 * Resizes and re-encodes an image File as JPEG, capped to the preset's max
 * dimension. Falls back to returning the original file if anything in the
 * decode/encode pipeline fails (corrupt file, unsupported format, no canvas
 * support) — the Storage bucket's size/mime-type limit is the real backstop
 * either way, this is purely a bandwidth/UX optimization.
 */
export async function compressImage(
  file: File,
  presetName: CompressionPresetName,
): Promise<File> {
  if (!file.type.startsWith("image/")) return file;

  const preset = COMPRESSION_PRESETS[presetName];

  try {
    // `imageOrientation: "from-image"` makes the browser apply the photo's
    // EXIF rotation for us, so a phone-camera portrait doesn't come out
    // sideways after we redraw it onto a canvas.
    const bitmap = await createImageBitmap(file, {
      imageOrientation: "from-image",
    });

    const scale = Math.min(
      1,
      preset.maxDimension / Math.max(bitmap.width, bitmap.height),
    );

    if (scale >= 1 && file.size <= preset.skipIfUnderBytes) {
      bitmap.close();
      return file;
    }

    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      return file;
    }

    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", preset.quality),
    );
    if (!blob) return file;

    const newName = file.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], newName, { type: "image/jpeg" });
  } catch {
    return file;
  }
}
