import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

export async function sanitizeUploadedImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!IMAGE_EXTENSIONS.has(ext)) {
    return;
  }

  const tempPath = `${filePath}.sanitized`;

  let pipeline = sharp(filePath)
    .rotate()
    .resize({
      width: 1920,
      height: 1920,
      fit: "inside",
      withoutEnlargement: true,
    });

  if (ext === ".png") {
    await pipeline.png().toFile(tempPath);
  } else if (ext === ".webp") {
    await pipeline.webp().toFile(tempPath);
  } else {
    await pipeline.jpeg({ quality: 85 }).toFile(tempPath);
  }

  await fs.rename(tempPath, filePath);
}
