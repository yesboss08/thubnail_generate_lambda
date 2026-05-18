import { createCanvas } from "@napi-rs/canvas";
import fs from 'fs';
import {writeFile} from 'fs/promises'

export async function generateTxtThumbnail({ inputPath, outputPath }) {
  const text = fs.readFileSync(inputPath, 'utf-8');

  const canvas = createCanvas(400, 200);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#ffffff';
  ctx.font = '16px Arial';

  const lines = text.split('\n').slice(0, 7);

  lines.forEach((line, i) => {
    ctx.fillText(line, 10, 25 + i * 18);
  });

try {
    const buffer = canvas.toBuffer('image/jpeg', 85);
  await writeFile(outputPath,  buffer);
   return { ok: true, thumbnailPath: outputPath }
} catch (error) {
  console.log("error while thumbnail for text" , error)
  return false
}
 
}
