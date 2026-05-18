import { getSignedCookies, getSignedUrl } from "@aws-sdk/cloudfront-signer";
import { getSecrets } from "./secreteManeger.js";

const ONE_HOUR_MS = 60 * 60 * 1000;
const trimWrapped = (value) => value?.trim?.().replace(/^['"]|['"]$/g, "");
const getConfigValue = async (key) => {
  const secrets = await getSecrets();
  return trimWrapped(secrets?.[key] ?? process.env[key]);
};

export const generateSignedCookies = async (url) => {
  const privateKey = await getConfigValue("Secret_key");
  const keyPairId = await getConfigValue("Thumbnail_CloudFront_KerPair_ID");
  return getSignedCookies({
    url,
    privateKey,
    dateLessThan: new Date(Date.now() + ONE_HOUR_MS),
    keyPairId,
  });
};

export const generateSignedUrl = async (s3ObjectKey) => {
  const privateKey = await getConfigValue("Secret_key");
  const distributionDomain = await getConfigValue("CloudFront_Distributio_Domain");
  const keyPairId = await getConfigValue("Thumbnail_CloudFront_KerPair_ID");
  return getSignedUrl({
    url: `https://${distributionDomain}/thumbnails/${s3ObjectKey}`,
    privateKey,
    dateLessThan: new Date(Date.now() + ONE_HOUR_MS),
    keyPairId,
  });
};
