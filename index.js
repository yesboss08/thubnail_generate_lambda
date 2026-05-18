import dotenv from 'dotenv'
import { DownloadS3Object, UploadS3Object } from './utils/aws/getS3object.js'
import { generateS3Key, handleFileType } from './utils/generate_thumbnail.js'

dotenv.config()

export const handler = async (event, context) => {
    try {
        const record = event?.Records?.[0]
        const s3 = record?.s3
        if (!s3?.object?.key) {
            return { statusCode: 400, body: 'invalid s3 event payload' }
        }
        const sourceKey = decodeURIComponent(s3.object.key.replace(/\+/g, " "))
        const fileInKey = sourceKey.split("/").at(-1)
        const downloaded = await DownloadS3Object(sourceKey, fileInKey)
        if (!downloaded) return { statusCode: 404, body: 'error while downloading source file from s3' }

        const res = await handleFileType(fileInKey)
        const newS3key = await generateS3Key(sourceKey)
        if (!res) return { statusCode: 404, body: 'error in the thumbnail generation' }
        const s3res = await UploadS3Object(newS3key, res.thumbnailPath)
        if (!s3res) return { statusCode: 404, body: 'error in the uplaoding the thumbnail to s3' }
        return { statusCode: 200, body: 'success' }
    } catch (error) {
        console.log("error ", error)
        return { statusCode: 404, body: 'error in the thumbnail generation' }
    }

}


// handle the nameing covention of the files 
// so all files will contains the userId/fileId and for the thumbnail we just add a prefix thumbnail/ 
