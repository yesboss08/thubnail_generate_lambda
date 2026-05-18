import { copyFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const unknownAssetPath = path.join(__dirname, "assets", "unknown.jpg");

export const generateUnknownThumbnail = async ({ outputPath }) => {
  try {
    await copyFile(unknownAssetPath, outputPath);
    return { ok: true, thumbnailPath: outputPath };
  } catch (error) {
    console.log("error while creating unknown thumbnail fallback", error);
    return false;
  }
};
