import mime from "mime-types"
import path from "path"
import { mkdir } from "node:fs/promises"


const fileHandlers = {
    video: async () => (await import("./File_Type/video.js")).generateVideoThumbnail,
    image: async () => (await import("./File_Type/image.js")).generateImageThumbnail,
    pdf: async () => (await import("./File_Type/pdf.js")).generatePdfThumbnail,
    text: async () => (await import("./File_Type/text.js")).generateTxtThumbnail,
    audio: async () => (await import("./File_Type/music.js")).generateAudioThumbnail,
    unknown: async () => (await import("./File_Type/unknown.js")).generateUnknownThumbnail,
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
        //right now we only handle the thumbnail image not for short video 
        const outputPath = `/tmp/output/${baseName}.jpg`
        const context = {
            fileName: key,
            fileFormat: "jpg",
            inputPath: `/tmp/input/${key}`,
            outputPath
        }
        const generator = await fileHandlers[functionName]()
        const res = await generator(context)
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
