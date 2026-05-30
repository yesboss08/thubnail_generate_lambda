import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { createWriteStream, createReadStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { mkdir } from "node:fs/promises";
import { getSecrets } from "./secreteManeger.js";


const getBucketName = async (bucketType) => {
    const secrets = await getSecrets();
    if(bucketType =='download'){
        return {bucketName:secrets?.Source_S3_BUCKET || process.env.Source_S3_BUCKET , bucketRegion:secrets?.Source_S3_BUCKET_REGION || process.env.Source_S3_BUCKET_REGION}
    }
    return {bucketName:secrets?.Thumbnail_S3_BUCKET || process.env.Thumbnail_S3_BUCKET , bucketRegion:secrets?.Thumbnail_S3_BUCKET_REGION || process.env.Thumbnail_S3_BUCKET_REGION}
}

export const DownloadS3Object = async (sourceKey, fileName) => {
    const bucketInfo = await getBucketName();
    const { bucketName: bucket , bucketRegion } = bucketInfo.bucketName;
    
    const client = new S3Client({ region:bucketRegion })
    const command = new GetObjectCommand({ Bucket: bucket, Key: sourceKey })
    try {
        await mkdir("/tmp/input", { recursive: true });
        const res = await client.send(command)
        const writeStream = createWriteStream(`/tmp/input/${fileName}`)
        await pipeline(res.Body, writeStream)
        return res
    } catch (error) {
        console.log("error while downloading the object from s3", error)
        return false
    }
}

export const UploadS3Object = async (key, filePath) => {
    const bucket = await getBucketName();
    const readStream = createReadStream(filePath)
    const command = new PutObjectCommand({ Bucket: bucket, Key: key, Body: readStream, ContentType: "image/jpeg" })
    try {
        const res = await client.send(command)
        return res
    } catch (error) {
        console.log("error while downloading the object from s3", error)
        return false
    }
}
