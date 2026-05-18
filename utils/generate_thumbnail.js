
import { generateImageThumbnail } from "./File_Type/image.js"
import { generateAudioThumbnail } from "./File_Type/music.js"
import { generatePdfThumbnail } from "./File_Type/pdf.js"
import { generateTxtThumbnail } from "./File_Type/text.js"
import { generateVideoThumbnail } from "./File_Type/video.js"
import { generateUnknownThumbnail } from "./File_Type/unknown.js"
import mime from "mime-types"
import path from "path"
import { mkdir } from "node:fs/promises"


const fileObject = {
    "video": generateVideoThumbnail,
    "image": generateImageThumbnail,
    "pdf": generatePdfThumbnail,
    "text": generateTxtThumbnail,
    "audio": generateAudioThumbnail,
    "unknown": generateUnknownThumbnail
}


function getCategory(mimeType) {
    if (!mimeType) return "unknown";
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType.startsWith("video/")) return "video";
    if (mimeType.startsWith("audio/")) return "audio";
    if (mimeType === "application/pdf") return "pdf";
    if (mimeType.startsWith("text/")) return "text";
    return "unknown";
}


export const handleFileType = async (key) => {
    try {
        const fileType = mime.contentType(key)
        const functionName = getCategory(fileType)
        const baseName = path.parse(key).name
        await mkdir("/tmp/output", { recursive: true })
        const outputPath = `/tmp/output/${baseName}.jpg`
        const context = {
            fileName: key,
            fileFormat: "jpg",
            inputPath: `/tmp/input/${key}`,
            outputPath
        }
        const res = await fileObject[functionName](context)
        if (!res?.ok) return false
        return res
    } catch (error) {
        console.log("error while handle file type function", error)
        return false
    }
}


export const generateS3Key = async (s3key) => {
    const parts = s3key.split("/")
    const fileName = parts.pop()
    const baseName = path.parse(fileName).name
    const dir = parts.join("/")
    const targetName = `${baseName}.jpg`
    return dir ? `thumbnail/${dir}/${targetName}` : `thumbnail/${targetName}`
}
