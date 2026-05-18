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



//todo:short video is not updated till now 
export async function generateShortVideo({ inputPath, outputPath }) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .setStartTime('00:00:04')   // start at 4 sec
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
