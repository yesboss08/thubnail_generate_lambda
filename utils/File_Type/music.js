import { parseFile } from "music-metadata";
import sharp from "sharp";

export const generateAudioThumbnail = async ({ inputPath, outputPath }) => {
  try {
    const metadata = await parseFile(inputPath);
    const picture = metadata.common.picture?.[0];
    if (!picture) return false;
    await sharp(picture.data).jpeg({ mozjpeg: true }).toFile(outputPath);
    return { ok: true, thumbnailPath: outputPath }
  } catch (e) {
    console.log("error while mp3 file", e)
    return false
  }
};
