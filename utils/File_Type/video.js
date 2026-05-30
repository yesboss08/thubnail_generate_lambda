import { execFile, execSync } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

function getFfmpegBinary() {
  // Lambda Layer common path; fallback to PATH binary for local/dev.
  return process.env.FFMPEG_PATH || "/opt/bin/ffmpeg";
}

function verifyFfmpegBinary(ffmpegBinary) {
  try {
    const output = execSync(`${ffmpegBinary} -version`, { encoding: "utf8" });
    console.log("ffmpeg detected:", output.split("\n")[0]);
    return true;
  } catch (error) {
    console.log("ffmpeg not available at path:", ffmpegBinary, error?.message);
    return false;
  }
}

export async function generateVideoThumbnail({ inputPath, outputPath }) {
  console.log({inputPath, outputPath}, 'inside the generate video thumbnail')
  try {
    const ffmpegBinary = getFfmpegBinary();
    if (!verifyFfmpegBinary(ffmpegBinary)) {
      return false;
    }

    await execFileAsync(ffmpegBinary, [
      "-y",
      "-ss",
      "00:00:04",
      "-i",
      inputPath,
      "-frames:v",
      "1",
      "-vf",
      "scale=320:240",
      outputPath,
    ]);

    console.log("Thumbnail saved!");
    return { ok: true, thumbnailPath: outputPath };
  } catch (error) {
    console.log("error while generating ffmpeg", error);
    return false;
  }
}

//todo:short video is not updated till now
export async function generateShortVideo({ inputPath, outputPath }) {
  try {
    const ffmpegBinary = getFfmpegBinary();
    if (!verifyFfmpegBinary(ffmpegBinary)) {
      return false;
    }

    await execFileAsync(ffmpegBinary, [
      "-y",
      "-ss",
      "00:00:04",
      "-i",
      inputPath,
      "-t",
      "5",
      "-c:v",
      "libx264",
      "-c:a",
      "aac",
      "-movflags",
      "+faststart",
      outputPath,
    ]);

    console.log("Short video created");
    return outputPath;
  } catch (error) {
    console.log("error while creating short video", error);
    return false;
  }
}

/*
OLD CODE (kept for reference)

import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import path from "path";

ffmpeg.setFfmpegPath(ffmpegPath);

export async function generateVideoThumbnail({ inputPath, outputPath }) {
try {
    const val = await  new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .screenshots({
        timestamps: ['04'],
        filename: path.basename(outputPath),
        folder: path.dirname(outputPath),
        size: '320x240'
      })
      .on('end', () => {
        console.log('Thumbnail saved!');
        resolve(outputPath);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
   return { ok: true, thumbnailPath: val }
} catch (error) {
  console.log('error while generating ffmpeg',error)
  return false
}
}

export async function generateShortVideo({ inputPath, outputPath }) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .setStartTime('00:00:04')
      .setDuration(5)
      .output(outputPath)
      .videoCodec('libx264')
      .audioCodec('aac')
      .on('end', () => {
        console.log('Short video created');
        resolve(outputPath);
      })
      .on('error', reject)
      .run();
  });
}
*/
