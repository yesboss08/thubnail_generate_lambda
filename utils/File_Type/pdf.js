import fs from "fs/promises";
import { createCanvas } from "@napi-rs/canvas";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";



// here canvas is used for creating a blank page to draw the pdf data in jpeg formate , basically canvas gives a blank paper to draw the pdf 1st page

export async function generatePdfThumbnail({ inputPath, outputPath }) {
  try {
    const loadingTask = pdfjsLib.getDocument(inputPath);
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);
    const scale = 1.5;
    const viewport = page.getViewport({ scale });
    const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
    const context = canvas.getContext("2d");
    //pdf.js reads the page and draw in the canvas paper
    await page.render({ canvasContext: context, viewport }).promise;
    const jpegBuffer = canvas.toBuffer("image/jpeg", 70);
    await fs.writeFile(outputPath, jpegBuffer);
    console.log(`Saved screenshot: ${outputPath}`);
    return { ok: true, thumbnailPath: outputPath }
  } catch (error) {
    console.error("Failed to save screenshot:", error);
    return false
  }
}
