import sharp from 'sharp'

export const generateImageThumbnail = async ({ inputPath, outputPath }) => {
   try {
      await sharp(inputPath).resize(300).jpeg({ mozjpeg: true }).toFile(outputPath)
      return { ok: true, thumbnailPath: outputPath }
   } catch (error) {
      console.log("error while generating image thumbnail", error)
      return false
   }
}

